import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";
import { scoreOne } from "@/lib/server/scoring";
import {
  readIdempotencyKey,
  lookupIdempotent,
  storeIdempotent,
} from "@/lib/server/idempotency";
import type { Json } from "@/lib/supabase/types";

export const runtime = "nodejs";

const fieldsSchema = z.object({
  session_id: z.string().uuid(),
  prompt_index: z.number().int().min(0).max(20),
  level_tag: z.enum(["A1", "A2", "B1", "B2"]),
  audio_duration_seconds: z.number().min(0).max(120).optional().nullable(),
});

const ALLOWED_TYPES = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/ogg;codecs=opus",
]);

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit("recordings", ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "retry-after": "60" } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json({ error: "missing_audio" }, { status: 400 });
  }

  const parsed = fieldsSchema.safeParse({
    session_id: String(form.get("session_id") ?? ""),
    prompt_index: Number(form.get("prompt_index") ?? -1),
    level_tag: String(form.get("level_tag") ?? ""),
    audio_duration_seconds:
      form.get("audio_duration_seconds") != null
        ? Number(form.get("audio_duration_seconds"))
        : undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { session_id, prompt_index, level_tag, audio_duration_seconds } = parsed.data;

  // Idempotency-Key replay (best-effort).
  const idemKey = readIdempotencyKey(req);
  if (idemKey) {
    const cached = await lookupIdempotent(idemKey);
    if (cached) return NextResponse.json(cached.body, { status: cached.status });
  }

  // Demo mode: return a synthetic id so the client keeps flowing.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      recording_id: `local-${session_id}-${prompt_index}`,
      mode: "local-only",
      scoring_status: "pending",
    });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({
      recording_id: `local-${session_id}-${prompt_index}`,
      mode: "local-only",
      scoring_status: "pending",
    });
  }

  try {
    // Validate session exists + status is recordable.
    const { data: session } = await supabase
      .from("exam_sessions")
      .select("id, status")
      .eq("id", session_id)
      .maybeSingle();
    if (!session) {
      return NextResponse.json({ error: "session_not_found" }, { status: 404 });
    }
    if (
      !["in_progress", "listening_done", "speaking_done"].includes(session.status)
    ) {
      return NextResponse.json({ error: "invalid_status" }, { status: 409 });
    }

    // Derive a sensible extension from blob.type.
    const blobType = (audio.type || "audio/webm").toLowerCase();
    if (!ALLOWED_TYPES.has(blobType)) {
      // Don't reject hard — many browsers report odd subtypes. Log + accept.
      log.warn({ blobType }, "recordings.unknown-mime-type");
    }
    const ext = extFromMime(blobType);
    const key = `recordings/${session_id}/p${prompt_index}-${Date.now()}.${ext}`;

    // Upload audio.
    const arrayBuf = await audio.arrayBuffer();
    const { error: upErr } = await supabase.storage
      .from("recordings")
      .upload(key, arrayBuf, { contentType: blobType, upsert: true });
    if (upErr) throw upErr;

    // UPSERT speaking_recordings — re-record always re-queues.
    const { data: row, error: dbErr } = await supabase
      .from("speaking_recordings")
      .upsert(
        {
          session_id,
          prompt_index,
          audio_url: key,
          audio_duration_seconds: audio_duration_seconds ?? null,
          level_tag,
          transcript: null,
          ai_score_intent: null,
          ai_score_vocabulary: null,
          ai_score_fluency: null,
          ai_score_tone: null,
          ai_score_total: null,
          ai_feedback_es: null,
          ai_model_response: null,
          ai_level_estimate: null,
          scoring_status: "pending",
          scoring_attempts: 0,
          scored_at: null,
        },
        { onConflict: "session_id,prompt_index" },
      )
      .select("id")
      .single();
    if (dbErr || !row) throw dbErr ?? new Error("recording row missing");

    // After write, count distinct prompts. If we have all 6, mark
    // session as speaking_done.
    const { data: distinct } = await supabase
      .from("speaking_recordings")
      .select("prompt_index")
      .eq("session_id", session_id);
    const uniquePrompts = new Set((distinct ?? []).map((r) => r.prompt_index));
    if (uniquePrompts.size >= 6) {
      await supabase
        .from("exam_sessions")
        .update({ status: "speaking_done", current_step: "results" })
        .eq("id", session_id)
        .neq("status", "complete");
    }

    // Best-effort signed URL (1h expiry) for HR review.
    let signed_url: string | null = null;
    try {
      const { data: signed } = await supabase.storage
        .from("recordings")
        .createSignedUrl(key, 60 * 60);
      signed_url = signed?.signedUrl ?? null;
    } catch {
      signed_url = null;
    }

    // Analytics (best-effort).
    void supabase
      .from("analytics_events")
      .insert({
        event_type: "recording_uploaded",
        session_id,
        metadata: {
          prompt_index,
          level_tag,
          duration_seconds: audio_duration_seconds ?? null,
          mime_type: blobType,
          bytes: audio.size,
        } as Json,
      });

    // Trigger background scoring (do NOT await).
    void scoreOne(row.id).catch((err) => {
      log.warn(
        { err: String(err), recording_id: row.id },
        "scoring.background.failed",
      );
    });

    const responseBody = {
      recording_id: row.id,
      mode: "persisted" as const,
      scoring_status: "pending" as const,
      signed_url,
    };
    if (idemKey) await storeIdempotent(idemKey, responseBody as unknown as Json, 200);
    return NextResponse.json(responseBody);
  } catch (err) {
    captureException(err, {
      route: "POST /api/recordings",
      data: { session_id, prompt_index, level_tag },
    });
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}

function extFromMime(mime: string): string {
  if (mime.startsWith("audio/webm")) return "webm";
  if (mime.startsWith("audio/mp4")) return "mp4";
  if (mime.startsWith("audio/mpeg")) return "mp3";
  if (mime.startsWith("audio/ogg")) return "ogg";
  return "webm";
}
