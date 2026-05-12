import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import {
  audioPathFor,
  ensureAudio,
} from "@/lib/tts/audio-bucket";
import { captureException } from "@/lib/server/sentry";
import { DRILLS, type Role } from "@/content/practice-drills";
import { EXAM_CONTENT } from "@/content/exam";

export const runtime = "nodejs";

const paramSchema = z.object({
  module: z.enum(["bellboy", "frontdesk", "restaurant"]),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  itemId: z.string().min(1).max(120),
});

const querySchema = z.object({
  /**
   * "guest" — listening prompt (guest voice)
   * "role"  — model response (employee role voice; default)
   */
  speaker: z.enum(["guest", "role"]).optional(),
  /** Override the audio_text — used when the caller already has the text. */
  text: z.string().min(1).max(500).optional(),
});

/**
 * Resolve audio for a content item.
 *
 *   GET /api/audio/{module}/{level}/{itemId}?speaker=guest|role
 *
 * Behavior:
 *   - bucket hit → 302 redirect to the public URL (1y immutable).
 *   - bucket miss + ELEVENLABS_API_KEY set → generate, upload, redirect.
 *   - bucket miss + no key → 404 with `{ source: "speech-synth" }` so
 *     the client falls back gracefully.
 *
 * Public; rate limited via the same bucket as score-speaking-style
 * endpoints. Idempotent + cache-friendly: we send Cache-Control on
 * the redirect itself plus the audio bytes carry their own headers.
 */
export async function GET(
  req: Request,
  { params }: { params: { module: string; level: string; itemId: string } },
) {
  const parsed = paramSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }
  const url = new URL(req.url);
  const q = querySchema.safeParse({
    speaker: url.searchParams.get("speaker") ?? undefined,
    text: url.searchParams.get("text") ?? undefined,
  });
  if (!q.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  const { module, level, itemId } = parsed.data;
  const speaker = q.data.speaker ?? "guest";

  // Resolve the audio text. Prefer the explicit query, else look it
  // up in the static content. Listening drills use audio_text; reinforce
  // uses the model_en. Exam content has audio_en for listening,
  // model_response_en for speaking.
  let text = q.data.text ?? null;
  if (!text) {
    text = resolveAudioText(module, itemId, speaker);
  }
  if (!text) {
    return NextResponse.json({ error: "audio_text_not_found" }, { status: 404 });
  }

  // Demo mode: tell the client to fall back.
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { source: "speech-synth", path: audioPathFor(module, level, itemId) },
      { status: 404 },
    );
  }

  try {
    const result = await ensureAudio({
      id: itemId,
      module,
      level,
      audio_text: text,
      speaker,
    });
    if (result.source === "speech-synth" || !result.url) {
      return NextResponse.json(
        { source: "speech-synth" },
        { status: 404 },
      );
    }
    // Redirect with long-lived cache hint.
    return NextResponse.redirect(result.url, {
      status: 302,
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    captureException(err, {
      route: "GET /api/audio",
      data: { module, level, itemId },
    });
    return NextResponse.json(
      { source: "speech-synth", error: "generation_failed" },
      { status: 503 },
    );
  }
}

/**
 * Best-effort static lookup of an item's audio text.
 *
 * Practice drill ids are like `b-001`, `f-002`, `r-003`. Exam ids
 * follow `{role}-listening-{index}` and `{role}-speaking-{index}` —
 * synthesized lazily from EXAM_CONTENT below.
 */
function resolveAudioText(
  module: string,
  itemId: string,
  speaker: "guest" | "role",
): string | null {
  // Practice drills.
  const pool = DRILLS[module as Role] ?? [];
  const drill = pool.find((d) => d.id === itemId);
  if (drill) {
    if (speaker === "guest") return drill.listening.audio_text;
    return drill.reinforce.model_en;
  }

  // Exam content.
  const examMod = EXAM_CONTENT[module as keyof typeof EXAM_CONTENT];
  if (examMod) {
    const listenMatch = itemId.match(/^listening-(\d+)$/);
    if (listenMatch && speaker === "guest") {
      const idx = Number(listenMatch[1]);
      const item = examMod.listening.find((i) => i.index === idx);
      if (item) return item.audio_en;
    }
    const speakMatch = itemId.match(/^speaking-(\d+)$/);
    if (speakMatch && speaker === "role") {
      const idx = Number(speakMatch[1]);
      const item = examMod.speaking.find((i) => i.index === idx);
      if (item) return item.model_response_en;
    }
  }

  return null;
}
