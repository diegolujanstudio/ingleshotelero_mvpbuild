/* eslint-disable no-console */
/**
 * Seed `content_items` from the canonical static drill content so the
 * Master OS modules screen shows every real module AND the now-DB-first
 * practice loop has exact parity (identical content, but editable).
 *
 * Idempotent: keyed on (module, item_type='drill', topic=Drill.id).
 * Existing rows are UPDATED (so re-running re-syncs from the static file
 * if you haven't hand-edited), missing rows are INSERTED.
 *
 * Each drill is one row; the full nested Drill object lives in `options`
 * (authoritative for the product — see src/lib/content/drills-store.ts).
 * Flat columns are mirrored for the modules list UI.
 *
 * Run: set -a; source .env.local; set +a; npx tsx scripts/seed-content-items.mjs
 * Required env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL),
 *   SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "@supabase/supabase-js";

const { DRILLS } = await import("../src/content/practice-drills.ts");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function rowFor(role, drill) {
  return {
    module: role,
    level: drill.level,
    skill: "listening", // primary skill of the 3-step daily loop
    item_type: "drill",
    audio_text: drill.listening?.audio_text ?? null,
    options: drill, // FULL nested Drill — authoritative for the product
    scenario_es: drill.listening?.explanation_es ?? null,
    model_response: drill.reinforce?.model_en ?? null,
    topic: drill.id, // stable key, e.g. "b-001"
    is_active: true,
  };
}

let ins = 0,
  upd = 0,
  fail = 0;

for (const role of Object.keys(DRILLS)) {
  for (const drill of DRILLS[role]) {
    const tag = `${role}/${drill.id}`;
    try {
      const { data: existing, error: lookErr } = await sb
        .from("content_items")
        .select("id")
        .eq("module", role)
        .eq("item_type", "drill")
        .eq("topic", drill.id)
        .maybeSingle();
      if (lookErr) throw lookErr;

      if (existing?.id) {
        const { error } = await sb
          .from("content_items")
          .update(rowFor(role, drill))
          .eq("id", existing.id);
        if (error) throw error;
        upd++;
        console.log(`  [upd] ${tag}`);
      } else {
        const { error } = await sb
          .from("content_items")
          .insert(rowFor(role, drill));
        if (error) throw error;
        ins++;
        console.log(`  [ins] ${tag}`);
      }
    } catch (e) {
      fail++;
      console.error(`  [err] ${tag} — ${String(e).slice(0, 160)}`);
    }
  }
}

console.log(`\nDone. inserted=${ins} updated=${upd} failed=${fail}`);
process.exit(fail > 0 && ins + upd === 0 ? 1 : 0);
