import "server-only";

/**
 * ElevenLabs TTS wrapper.
 *
 * One thin function — `generateAudio(text, voiceId)` — returns a
 * Buffer of MP3 bytes. The caller decides what to do with them
 * (upload to Supabase Storage, write to disk during the
 * generate-audio script, etc).
 *
 * Why direct fetch instead of the SDK: the SDK returns a Node
 * `stream.Readable`, which couples this module to Node typings and
 * complicates testing. A direct call to the documented endpoint
 * keeps this isomorphic and lets us swap models with a single env
 * var (`ELEVENLABS_MODEL_ID`).
 *
 * Defaults:
 *   - model: `eleven_multilingual_v2` (best for English with light
 *     Spanish accent influence in test prompts)
 *   - format: `mp3_44100_128` (small, universal browser support)
 *
 * Failure modes:
 *   - Missing API key → throws. Callers must check
 *     `hasElevenLabsKey()` before invoking.
 *   - 4xx / 5xx → throws with the body excerpt; caller logs.
 */

const ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_MODEL = "eleven_multilingual_v2";
const DEFAULT_OUTPUT = "mp3_44100_128";

export function hasElevenLabsKey(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}

export interface GenerateAudioOptions {
  modelId?: string;
  outputFormat?: string;
  /** Voice settings — values from the ElevenLabs docs, range 0-1. */
  stability?: number;
  similarityBoost?: number;
}

export async function generateAudio(
  text: string,
  voiceId: string,
  opts: GenerateAudioOptions = {},
): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY missing — call hasElevenLabsKey() first");
  }

  const modelId = opts.modelId ?? process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_MODEL;
  const outputFormat = opts.outputFormat ?? DEFAULT_OUTPUT;

  const url = `${ENDPOINT}/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: opts.stability ?? 0.5,
        similarity_boost: opts.similarityBoost ?? 0.75,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    throw new Error(
      `ElevenLabs ${res.status}: ${body.slice(0, 240)}`,
    );
  }

  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}
