/**
 * Vocabulary decks, mined from the drill corpus.
 *
 * The 160 authored drills each carry 2–4 vocabulary items with examples —
 * that inventory already exists and is level-tagged by its drill. This
 * module aggregates it into per-role decks so the standalone Vocabulario
 * mode ships with real depth on day one instead of a second, parallel
 * word list that would drift from the drills (one source of truth).
 *
 * Dedupe is by lowercase word_en per role; the first occurrence (lowest
 * level) wins, so a word introduced at A1 keeps its A1 example sentence.
 */

import { DRILLS, type Role } from "@/content/practice-drills";
import type { CEFRLevel } from "@/lib/supabase/types";

export interface VocabCard {
  word_en: string;
  word_es: string;
  example_en: string;
  example_es: string;
  level: CEFRLevel;
}

const LEVEL_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

const deckCache = new Map<Role, VocabCard[]>();

/** Full deck for a role, deduped, ordered A1 → B2. */
export function deckForRole(role: Role): VocabCard[] {
  const cached = deckCache.get(role);
  if (cached) return cached;
  const seen = new Set<string>();
  const deck: VocabCard[] = [];
  const drills = [...(DRILLS[role] ?? [])].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level),
  );
  for (const drill of drills) {
    for (const v of drill.vocabulary) {
      const key = v.word_en.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      deck.push({ ...v, level: drill.level });
    }
  }
  deckCache.set(role, deck);
  return deck;
}

/**
 * A session of `count` cards for role+level: the learner's level first,
 * padded with neighboring levels when the exact level runs short.
 * Deterministic rotation by `seed` (day number) so each day is a
 * different slice but a refresh repeats today's.
 */
export function vocabSession(
  role: Role,
  level: CEFRLevel,
  seed: number,
  count = 10,
): VocabCard[] {
  const deck = deckForRole(role);
  if (deck.length === 0) return [];
  const atLevel = deck.filter((c) => c.level === level);
  const rest = deck.filter((c) => c.level !== level);
  const pool = [...atLevel, ...rest];
  const start = (seed * count) % pool.length;
  const out: VocabCard[] = [];
  for (let k = 0; k < Math.min(count, pool.length); k++) {
    out.push(pool[(start + k) % pool.length]);
  }
  return out;
}
