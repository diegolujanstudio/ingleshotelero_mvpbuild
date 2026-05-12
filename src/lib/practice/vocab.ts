import "server-only";

/**
 * Vocabulary helpers — selectDueCards + applyReview.
 *
 * All helpers operate on `vocabulary_progress` rows. The card body
 * (English word, Spanish translation, examples) is pulled from
 * `src/content/practice-drills.ts` so we don't duplicate the lexicon.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import { DRILLS, type Role } from "@/content/practice-drills";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import { nextReview, type Grade, type SM2State } from "./sm2";
import { log } from "@/lib/server/log";

export interface VocabCard {
  word_en: string;
  word_es: string;
  example_en: string;
  example_es: string;
  level: CEFRLevel;
  module: RoleModule;
  /** SM-2 state from vocabulary_progress, if any. */
  state?: SM2State;
}

export interface DueCardWithMeta extends VocabCard {
  next_review_at: string | null;
}

/**
 * Look up content metadata for a (module, word) pair from the static
 * drill lexicon. Used when a vocabulary_progress row references a
 * word that doesn't carry the example/translation in the DB.
 */
export function lookupVocabContent(
  module: RoleModule,
  word: string,
): Omit<VocabCard, "state"> | null {
  const pool = DRILLS[module as Role] ?? [];
  for (const d of pool) {
    for (const v of d.vocabulary) {
      if (v.word_en === word) {
        return {
          word_en: v.word_en,
          word_es: v.word_es,
          example_en: v.example_en,
          example_es: v.example_es,
          level: d.level,
          module,
        };
      }
    }
  }
  return null;
}

/**
 * Return cards whose next_review_at <= now(), bounded to `count`.
 * Falls back to "newest first" when nothing is strictly due — better
 * to keep the user reviewing than show an empty step.
 */
export async function selectDueCards(
  employee_id: string,
  count: number,
  module: RoleModule,
  level: CEFRLevel,
): Promise<DueCardWithMeta[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("vocabulary_progress")
    .select(
      "word, module, level, ease_factor, interval_days, repetitions, next_review_at",
    )
    .eq("employee_id", employee_id)
    .eq("module", module)
    .lte("next_review_at", nowIso)
    .order("next_review_at", { ascending: true })
    .limit(count);
  if (error) {
    log.warn(
      { err: error.message, employee_id },
      "vocab.selectDue.failed",
    );
    return [];
  }

  let rows = data ?? [];

  // Top up from "never reviewed" rows if we don't have enough due.
  if (rows.length < count) {
    const remaining = count - rows.length;
    const seenWords = new Set(rows.map((r) => r.word));
    const { data: fresh } = await supabase
      .from("vocabulary_progress")
      .select(
        "word, module, level, ease_factor, interval_days, repetitions, next_review_at",
      )
      .eq("employee_id", employee_id)
      .eq("module", module)
      .is("next_review_at", null)
      .limit(remaining + seenWords.size);
    for (const r of fresh ?? []) {
      if (rows.length >= count) break;
      if (!seenWords.has(r.word)) rows.push(r);
    }
  }

  // Prefer same level when we have more candidates than slots.
  rows = rows.sort((a, b) => {
    if (a.level === level && b.level !== level) return -1;
    if (b.level === level && a.level !== level) return 1;
    return 0;
  });
  rows = rows.slice(0, count);

  const out: DueCardWithMeta[] = [];
  for (const r of rows) {
    const content = lookupVocabContent(module, r.word);
    if (!content) continue;
    out.push({
      ...content,
      level: r.level,
      next_review_at: r.next_review_at,
      state: {
        ease_factor: r.ease_factor,
        interval_days: r.interval_days,
        repetitions: r.repetitions,
      },
    });
  }
  return out;
}

/**
 * Apply an SM-2 grade and persist. Returns the new state.
 */
export async function applyReview(input: {
  employee_id: string;
  word: string;
  module: RoleModule;
  level: CEFRLevel;
  grade: Grade;
  now?: Date;
}): Promise<{
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
} | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from("vocabulary_progress")
    .select("ease_factor, interval_days, repetitions, times_correct, times_incorrect")
    .eq("employee_id", input.employee_id)
    .eq("word", input.word)
    .eq("module", input.module)
    .maybeSingle();

  const prev: SM2State = existing
    ? {
        ease_factor: existing.ease_factor,
        interval_days: existing.interval_days,
        repetitions: existing.repetitions,
      }
    : { ease_factor: 2.5, interval_days: 0, repetitions: 0 };

  const result = nextReview(input.grade, prev, input.now);

  const wasCorrect = input.grade >= 3;
  const times_correct = (existing?.times_correct ?? 0) + (wasCorrect ? 1 : 0);
  const times_incorrect = (existing?.times_incorrect ?? 0) + (wasCorrect ? 0 : 1);

  const { error } = await supabase
    .from("vocabulary_progress")
    .upsert(
      {
        employee_id: input.employee_id,
        word: input.word,
        module: input.module,
        level: input.level,
        ease_factor: result.ease_factor,
        interval_days: result.interval_days,
        repetitions: result.repetitions,
        last_reviewed_at: (input.now ?? new Date()).toISOString(),
        next_review_at: result.next_review_at.toISOString(),
        times_correct,
        times_incorrect,
      },
      { onConflict: "employee_id,word,module" },
    );
  if (error) {
    log.warn(
      { err: error.message, employee_id: input.employee_id, word: input.word },
      "vocab.applyReview.failed",
    );
    return null;
  }

  return {
    ease_factor: result.ease_factor,
    interval_days: result.interval_days,
    repetitions: result.repetitions,
    next_review_at: result.next_review_at.toISOString(),
  };
}
