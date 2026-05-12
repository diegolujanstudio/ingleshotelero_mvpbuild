/* eslint-disable no-console */
/**
 * Pre-warm the audio bucket — one-shot script.
 *
 * Iterates every unique audio_text across:
 *   - src/content/practice-drills.ts (listening prompt + reinforce
 *     model_en for each drill)
 *   - src/content/exam.ts (listening audio_en + speaking model_response_en)
 *
 * For each, calls ElevenLabs and uploads to the `audio` bucket at
 * `{module}/{level}/{itemId}.mp3`. Skips items whose file already
 * exists (content-addressed; we never overwrite).
 *
 * Run: `npx tsx scripts/generate-audio.ts`
 *
 * Required env:
 *   - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL)
 *   - ELEVENLABS_API_KEY
 *   - Optional voice IDs: ELEVENLABS_VOICE_ID_FRONTDESK / _BELLBOY /
 *     _RESTAURANT / _GUEST
 */

import { ensureAudio } from "../src/lib/tts/audio-bucket";
import { hasElevenLabsKey } from "../src/lib/tts/elevenlabs";
import { isSupabaseConfigured } from "../src/lib/supabase/client-or-service";
import { DRILLS } from "../src/content/practice-drills";
import { EXAM_CONTENT } from "../src/content/exam";
import type { CEFRLevel, RoleModule } from "../src/lib/supabase/types";

interface Job {
  id: string;
  module: RoleModule;
  level: CEFRLevel;
  text: string;
  speaker: "guest" | "role";
}

function buildJobs(): Job[] {
  const jobs: Job[] = [];

  // Practice drills.
  for (const module of Object.keys(DRILLS) as RoleModule[]) {
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

  // Exam content.
  for (const module of Object.keys(EXAM_CONTENT) as RoleModule[]) {
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

async function main() {
  if (!isSupabaseConfigured()) {
    console.error(
      "Supabase env vars missing (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).",
    );
    process.exit(1);
  }
  if (!hasElevenLabsKey()) {
    console.error("ELEVENLABS_API_KEY missing.");
    process.exit(1);
  }

  const jobs = buildJobs();
  console.log(`Audio generation queue: ${jobs.length} items`);

  let bucketHits = 0;
  let generated = 0;
  let failed = 0;

  for (let i = 0; i < jobs.length; i++) {
    const j = jobs[i];
    const tag = `${i + 1}/${jobs.length} ${j.module}/${j.level}/${j.id}`;
    try {
      const r = await ensureAudio({
        id: j.id,
        module: j.module,
        level: j.level,
        audio_text: j.text,
        speaker: j.speaker,
      });
      if (r.source === "bucket") {
        bucketHits += 1;
        console.log(`  [skip] ${tag}`);
      } else if (r.source === "generated") {
        generated += 1;
        console.log(`  [gen]  ${tag}`);
      } else {
        failed += 1;
        console.warn(`  [miss] ${tag} — speech-synth fallback indicated`);
      }
    } catch (err) {
      failed += 1;
      console.error(`  [err]  ${tag}`, err);
    }
    // Light pacing to avoid bursting ElevenLabs Creator-tier rate limits.
    await new Promise((res) => setTimeout(res, 250));
  }

  console.log(
    `\nDone. bucket=${bucketHits} generated=${generated} failed=${failed}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
