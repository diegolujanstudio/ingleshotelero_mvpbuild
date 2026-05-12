import "server-only";

/**
 * First-time seeding of vocabulary_progress.
 *
 * When an employee opens /practice for the first time and has no
 * rows in vocabulary_progress for their module, we materialize one
 * row per unique word from `src/content/practice-drills.ts`. Each
 * row starts with default SM-2 state and `next_review_at = now()`
 * so it is immediately due — the spaced-repetition runtime then
 * pushes successful cards forward.
 *
 * Idempotent: runs only when the count is zero. The actual upserts
 * use `(employee_id, word, module)` so re-runs are safe even if the
 * count check loses the race.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import { DRILLS, type Role } from "@/content/practice-drills";
import type { RoleModule } from "@/lib/supabase/types";
import { log } from "@/lib/server/log";

export async function seedVocabularyIfEmpty(
  employee_id: string,
  module: RoleModule,
): Promise<{ seeded: number }> {
  const supabase = createServiceClient();
  if (!supabase) return { seeded: 0 };

  const { count, error: countErr } = await supabase
    .from("vocabulary_progress")
    .select("id", { count: "exact", head: true })
    .eq("employee_id", employee_id)
    .eq("module", module);
  if (countErr) {
    log.warn(
      { err: countErr.message, employee_id, module },
      "vocab.seed.count.failed",
    );
    return { seeded: 0 };
  }
  if ((count ?? 0) > 0) return { seeded: 0 };

  const pool = DRILLS[module as Role] ?? [];
  const seenWords = new Set<string>();
  const rows: {
    employee_id: string;
    word: string;
    module: RoleModule;
    level: "A1" | "A2" | "B1" | "B2";
    next_review_at: string;
  }[] = [];
  const nowIso = new Date().toISOString();

  for (const drill of pool) {
    for (const v of drill.vocabulary) {
      if (seenWords.has(v.word_en)) continue;
      seenWords.add(v.word_en);
      rows.push({
        employee_id,
        word: v.word_en,
        module,
        level: drill.level,
        next_review_at: nowIso,
      });
    }
  }

  if (rows.length === 0) return { seeded: 0 };

  const { error: insErr } = await supabase
    .from("vocabulary_progress")
    .upsert(rows, { onConflict: "employee_id,word,module", ignoreDuplicates: true });
  if (insErr) {
    log.warn(
      { err: insErr.message, employee_id, module, count: rows.length },
      "vocab.seed.insert.failed",
    );
    return { seeded: 0 };
  }
  return { seeded: rows.length };
}
