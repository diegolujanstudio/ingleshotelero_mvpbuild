import { NextResponse } from "next/server";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/client-or-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";
import { transition, normalizePhone } from "@/lib/whatsapp/engine";
import type { WaSnapshot } from "@/lib/whatsapp/engine";
import {
  isWhatsAppEnabled,
  validateTwilioSignature,
  twimlResponse,
  fetchTwilioMedia,
} from "@/lib/whatsapp/twilio";
import {
  findOptedInEmployeeByPhone,
  getOrCreateTodaySession,
  saveTransition,
  optOutEmployee,
} from "@/lib/whatsapp/session-store";
import { getDrillById, getDrillsForRole } from "@/lib/content/drills-store";
import { pickDrillForEmployee } from "@/lib/practice/picker";
import { recordDrillCompletion } from "@/lib/practice/complete";
import { WHATSAPP_COPY } from "@/content/whatsapp";
import type { Drill } from "@/content/practice-drills";
import type { CEFRLevel } from "@/lib/supabase/types";

export const runtime = "nodejs";

// Speaking (voice-note) step is disabled by default over WhatsApp until the
// recordings→scoring pipeline is proven on this channel; enable with env.
const SPEAKING_ENABLED = process.env.WHATSAPP_SPEAKING_ENABLED === "true";

/**
 * POST /api/whatsapp/incoming — Twilio WhatsApp inbound webhook.
 *
 * Drives the pure conversation engine: identifies the employee by phone,
 * runs today's drill, records completions to the same tables as the web
 * loop, and replies with TwiML. Always 200 so Twilio never hard-retries.
 * Fully inert (friendly fallback) when Supabase/Twilio env is absent.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit("whatsapp", ip);
  if (!rl.ok) {
    // Still 200 with a benign ack — never surface a 429 into Twilio's retry loop.
    return twimlResponse([]);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return twimlResponse([]);

  const params: Record<string, string> = {};
  for (const [k, v] of form.entries()) params[k] = String(v);

  // Verify Twilio's signature (enforced only when TWILIO_AUTH_TOKEN is set).
  const url = req.url;
  if (!validateTwilioSignature(url, params, req.headers.get("x-twilio-signature"))) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const from = params.From ?? "";
  const body = params.Body ?? "";
  const numMedia = Number(params.NumMedia ?? 0);
  const phone = normalizePhone(from);

  // Unknown / demo → friendly fallback (inert), never an error.
  if (!isSupabaseConfigured()) {
    return twimlResponse([WHATSAPP_COPY.unknownEmployee]);
  }

  try {
    const employee = await findOptedInEmployeeByPhone(phone);
    if (!employee) {
      return twimlResponse([WHATSAPP_COPY.unknownEmployee]);
    }

    const session = await getOrCreateTodaySession(employee, phone);
    if (!session) return twimlResponse([WHATSAPP_COPY.internalError]);

    // Resolve today's drill (session-pinned, picker fallback).
    let drill: Drill | null = session.drill_id
      ? await getDrillById(employee.hotel_role, session.drill_id)
      : null;
    if (!drill) {
      try {
        const picked = await pickDrillForEmployee(
          employee.id,
          employee.hotel_role,
          (employee.current_level ?? "A2") as CEFRLevel,
        );
        drill = picked.drill;
      } catch {
        const pool = await getDrillsForRole(employee.hotel_role);
        drill = pool[0] ?? null;
      }
    }
    if (!drill) return twimlResponse([WHATSAPP_COPY.internalError]);

    const firstName = employee.name.trim().split(/\s+/)[0] ?? "";
    const snapshot: WaSnapshot = {
      state: session.state,
      drill_id: session.drill_id,
      listening_correct: session.listening_correct,
    };

    const result = transition(
      snapshot,
      { body, numMedia, mediaUrl0: params.MediaUrl0, mediaContentType0: params.MediaContentType0 },
      { drill, speakingEnabled: SPEAKING_ENABLED, firstName },
    );

    const replies = [...result.replies];
    let audioPath: string | undefined;

    for (const effect of result.effects) {
      if (effect.kind === "opt_out") {
        await optOutEmployee(employee.id);
      } else if (effect.kind === "store_voice_note") {
        audioPath = await storeVoiceNote(
          employee.id,
          session.date,
          effect.mediaUrl,
          effect.contentType,
        );
      } else if (effect.kind === "complete_drill") {
        const completion = await recordDrillCompletion({
          employee_id: employee.id,
          drill_id: drill.id,
          level: drill.level,
          module: employee.hotel_role,
          listening_correct: effect.listening_correct,
          channel: "whatsapp",
        });
        // Append the accurate streak line only when the day actually ticked.
        if (completion.streak.ticked) {
          replies.push(WHATSAPP_COPY.streakLine(completion.streak.current_streak));
        }
      }
    }

    await saveTransition(session, result.next, audioPath ? { audio_path: audioPath } : {});

    return twimlResponse(replies);
  } catch (err) {
    captureException(err, { route: "POST /api/whatsapp/incoming" });
    log.warn({ err: String(err) }, "whatsapp.incoming.error");
    return twimlResponse([WHATSAPP_COPY.internalError]);
  }
}

/** Download a Twilio voice note and store it in the private recordings bucket. */
async function storeVoiceNote(
  employeeId: string,
  date: string,
  mediaUrl: string,
  contentType: string,
): Promise<string | undefined> {
  if (!isWhatsAppEnabled()) return undefined;
  const media = await fetchTwilioMedia(mediaUrl);
  if (!media) return undefined;
  const sb = createServiceClient();
  if (!sb) return undefined;
  const ext = media.contentType.includes("mpeg")
    ? "mp3"
    : media.contentType.includes("ogg")
      ? "ogg"
      : "audio";
  const path = `whatsapp/${employeeId}/${date}.${ext}`;
  const { error } = await sb.storage
    .from("recordings")
    .upload(path, media.buffer, { contentType: media.contentType || contentType, upsert: true });
  if (error) {
    log.warn({ err: error.message, employeeId }, "whatsapp.voicenote.upload.failed");
    return undefined;
  }
  return path;
}
