/* eslint-disable no-console */
/**
 * Pre-warm the `audio` bucket with real ElevenLabs MP3s — standalone.
 *
 * The Next-coupled scripts/generate-audio.ts can't run via tsx because
 * its import chain hits `import "server-only"`. This script replicates
 * the exact ElevenLabs call (src/lib/tts/elevenlabs.ts) and the exact
 * bucket path scheme (src/lib/tts/audio-bucket.ts) with zero
 * server-only imports, so production's ensureAudio() finds every file
 * on a `list()` probe and serves the public URL (source: "bucket").
 *
 * Path scheme (MUST match audio-bucket.ts):
 *   bucket "audio", object `{module}/{level}/{id}.mp3`
 *   drill listening → id `${drill.id}-listen`  (guest voice)
 *   drill model     → id `${drill.id}-model`   (role voice)
 *   exam listening   → id `listening-${index}`  (guest voice)
 *   exam speaking    → id `speaking-${index}`   (role voice)
 *
 * Run: set -a; source .env.local; set +a; node scripts/generate-audio-standalone.mjs
 * Required env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL),
 *   SUPABASE_SERVICE_ROLE_KEY, ELEVENLABS_API_KEY.
 * Optional: ELEVENLABS_VOICE_ID_FRONTDESK/_BELLBOY/_RESTAURANT/_GUEST,
 *   ELEVENLABS_MODEL_ID.
 */
// Run via `npx tsx scripts/generate-audio-standalone.mjs` — tsx handles
// the .ts content imports. No manual loader registration needed.
import { createClient } from "@supabase/supabase-js";

const { DRILLS } = await import("../src/content/practice-drills.ts");
const { EXAM_CONTENT } = await import("../src/content/exam.ts");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!ELEVEN_KEY) {
  console.error("Missing ELEVENLABS_API_KEY.");
  process.exit(1);
}

const RACHEL = "21m00Tcm4TlvDq8ikWAM";
const MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const OUTPUT = "mp3_44100_128";
const BUCKET = "audio";

function voiceForRole(module) {
  if (module === "frontdesk")
    return process.env.ELEVENLABS_VOICE_ID_FRONTDESK || RACHEL;
  if (module === "bellboy")
    return process.env.ELEVENLABS_VOICE_ID_BELLBOY || RACHEL;
  if (module === "restaurant")
    return process.env.ELEVENLABS_VOICE_ID_RESTAURANT || RACHEL;
  return RACHEL;
}
function voiceForGuest() {
  return process.env.ELEVENLABS_VOICE_ID_GUEST || RACHEL;
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function buildJobs() {
  const jobs = [];
  for (const module of Object.keys(DRILLS)) {
    for (const drill of DRILLS[module]) {
      jobs.push({
        id: `${drill.id}-listen`,
        module,
        level: drill.level,
        text: drill.listening.audio_text,
        speaker: "guest",
      });
      jobs.push({
        id: `${drill.id}-model`,
        module,
        level: drill.level,
        text: drill.reinforce.model_en,
        speaker: "role",
      });
    }
  }
  for (const module of Object.keys(EXAM_CONTENT)) {
    const mod = EXAM_CONTENT[module];
    for (const item of mod.listening) {
      jobs.push({
        id: `listening-${item.index}`,
        module,
        level: item.level,
        text: item.audio_en,
        speaker: "guest",
      });
    }
    for (const item of mod.speaking) {
      jobs.push({
        id: `speaking-${item.index}`,
        module,
        level: item.level,
        text: item.model_response_en,
        speaker: "role",
      });
    }
  }
  return jobs;
}

async function exists(folder, filename) {
  const { data } = await sb.storage
    .from(BUCKET)
    .list(folder, { limit: 200, search: filename });
  return Boolean(data?.some((f) => f.name === filename));
}

async function tts(text, voiceId) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
    voiceId,
  )}?output_format=${OUTPUT}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_KEY,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) {
    const b = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${b.slice(0, 200)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

const jobs = buildJobs();
console.log(`Audio queue: ${jobs.length} items`);
let skip = 0,
  gen = 0,
  fail = 0;

for (let i = 0; i < jobs.length; i++) {
  const j = jobs[i];
  const folder = `${j.module}/${j.level}`;
  const filename = `${j.id}.mp3`;
  const path = `${folder}/${filename}`;
  const tag = `${i + 1}/${jobs.length} ${path}`;
  try {
    if (await exists(folder, filename)) {
      skip++;
      console.log(`  [skip] ${tag}`);
      continue;
    }
    const voice =
      j.speaker === "guest" ? voiceForGuest() : voiceForRole(j.module);
    const buf = await tts(j.text, voice);
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(path, buf, {
        contentType: "audio/mpeg",
        cacheControl: "31536000",
        upsert: false,
      });
    if (error && !/duplicate/i.test(error.message)) throw error;
    gen++;
    console.log(`  [gen]  ${tag}`);
  } catch (err) {
    fail++;
    console.error(`  [err]  ${tag} — ${String(err).slice(0, 160)}`);
  }
}

console.log(`\nDone. generated=${gen} skipped=${skip} failed=${fail}`);
process.exit(fail > 0 && gen === 0 ? 1 : 0);
