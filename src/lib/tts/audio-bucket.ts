import "server-only";

/**
 * Audio bucket helpers — content-addressed storage of TTS output.
 *
 * Layout: `audio/{module}/{level}/{itemId}.mp3`. The bucket is public
 * (declared in migration 0001), so we serve via the public URL with a
 * 1-year immutable cache header. When the source text for an item
 * changes, the new file gets a new id; the old file stays so any
 * existing service worker caches keep working.
 *
 * Existence probing: we use `list({ prefix })` rather than HEAD on the
 * public URL because:
 *   - HEAD against the public URL costs a CDN round trip per request,
 *     and miss-detection requires interpreting redirects + 4xx codes
 *     differently across CDNs.
 *   - `list()` is one Postgres-backed lookup against `storage.objects`
 *     and is the same call shape Supabase Studio uses for the file
 *     browser — fast, predictable, and avoids leaking the bucket
 *     structure through CDN caches.
 *
 * Generation policy: `ensureAudio()` only generates on demand if the
 * bucket file is missing AND `ELEVENLABS_API_KEY` is set. Otherwise it
 * returns `source: "speech-synth"` and the client falls back to
 * browser SpeechSynthesis.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import { generateAudio, hasElevenLabsKey } from "./elevenlabs";
import { voiceForGuest, voiceForRole } from "./voices";
import { addBreadcrumb } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";
import type { RoleModule, CEFRLevel } from "@/lib/supabase/types";

export type AudioSource = "bucket" | "generated" | "speech-synth";

export interface EnsureAudioInput {
  id: string;
  module: RoleModule;
  level: CEFRLevel;
  audio_text: string;
  /** "speaker" determines voice. Default: role-side. */
  speaker?: "role" | "guest";
  /** Override voice id explicitly (rare). */
  voice_id?: string;
}

export interface EnsureAudioResult {
  url: string;
  source: AudioSource;
}

const BUCKET = "audio";

export function audioPathFor(
  module: RoleModule | string,
  level: CEFRLevel | string,
  itemId: string,
): string {
  // Path within the bucket — we deliberately do NOT prefix `audio/`
  // because the bucket itself is named `audio`.
  return `${module}/${level}/${itemId}.mp3`;
}

export async function ensureAudio(
  input: EnsureAudioInput,
): Promise<EnsureAudioResult> {
  const supabase = createServiceClient();
  if (!supabase) {
    // Demo mode — no bucket, browser must SpeechSynthesis.
    return { url: "", source: "speech-synth" };
  }
  const path = audioPathFor(input.module, input.level, input.id);
  const folder = `${input.module}/${input.level}`;
  const filename = `${input.id}.mp3`;

  // Probe existence via list().
  try {
    const { data: list } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit: 200, search: filename });
    if (list?.some((f) => f.name === filename)) {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { url: pub.publicUrl, source: "bucket" };
    }
  } catch (err) {
    log.warn(
      { err: String(err), path },
      "audio-bucket.list.failed",
    );
  }

  // Need to generate. If no key, give up gracefully.
  if (!hasElevenLabsKey()) {
    addBreadcrumb({
      route: "audio.ensure.no-elevenlabs-key",
      data: { item_id: input.id, module: input.module, level: input.level },
      level: "info",
    });
    return { url: "", source: "speech-synth" };
  }

  const voiceId =
    input.voice_id ??
    (input.speaker === "guest"
      ? voiceForGuest(input.module)
      : voiceForRole(input.module));

  let buffer: Buffer;
  try {
    buffer = await generateAudio(input.audio_text, voiceId);
  } catch (err) {
    log.warn(
      { err: String(err), path },
      "audio-bucket.generate.failed",
    );
    addBreadcrumb({
      route: "audio.ensure.generate-failed",
      data: { item_id: input.id, module: input.module, level: input.level },
      level: "warning",
    });
    return { url: "", source: "speech-synth" };
  }

  try {
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "31536000",
        upsert: false,
      });
    // upsert:false — content-addressed; never overwrite. A duplicate
    // upload (race between two requests) is fine; we still return the
    // public URL.
    if (upErr && !/duplicate/i.test(upErr.message)) {
      log.warn(
        { err: upErr.message, path },
        "audio-bucket.upload.failed",
      );
    }
  } catch (err) {
    log.warn({ err: String(err), path }, "audio-bucket.upload.threw");
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: pub.publicUrl, source: "generated" };
}
