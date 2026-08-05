/**
 * Números y horas — procedural listening comprehension.
 *
 * WHY THIS EXISTS
 * Room numbers, prices, and times are the highest-stakes listening in a hotel:
 * mishear "two fifteen" as "two fifty" and a guest misses their airport
 * shuttle. Unlike phrases, numbers can be generated — which makes this the
 * one module with genuinely infinite content, and the one place a learner can
 * grind without ever seeing a repeat.
 *
 * DESIGN
 * Deterministic given a seed (same contract as buildPerceptionQuestion in
 * minimal-pairs.ts): a refresh never silently re-rolls the answer. Distractors
 * are NEAR-MISSES by construction — the classic confusions Spanish speakers
 * actually make (13/30, 14/40, 15/50 "teen/ty"; 2:15/2:50; digit swaps) —
 * not random numbers, because random distractors make guessing trivial and
 * teach nothing (Law 4: recall beats recognition, so make recognition earn it).
 *
 * Level calibration:
 *   A1 — room numbers (1–99) + o'clock hours
 *   A2 — bigger rooms (100–999), prices in whole dollars, half/quarter times
 *   B1 — prices with cents, X:XX times, teen/ty traps everywhere
 *   B2 — phone-style room extensions, flight times, prices spoken fast
 */

import type { CEFRLevel } from "@/lib/supabase/types";

export type NumberKind = "room" | "price" | "time";

export interface NumberQuestion {
  kind: NumberKind;
  /** English text for SpeechSynthesis, e.g. "Your room is two fifteen." */
  audio_en: string;
  /** Spanish prompt for the learner, e.g. "¿Qué número de cuarto dijo?" */
  prompt_es: string;
  /** Display options — exactly one correct. */
  options: { display: string; correct: boolean }[];
  /** Shown after answering: the number written out in English. */
  reveal_en: string;
}

// ── Deterministic PRNG (mulberry32) ─────────────────────────────────
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy",
  "eighty", "ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
}

/** How a hotel actually says a room number: 215 = "two fifteen". */
function sayRoom(n: number): string {
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) return `${ONES[h]} hundred`;
  if (rest < 10) return `${ONES[h]} oh ${ONES[rest]}`;
  return `${ONES[h]} ${twoDigits(rest)}`;
}

function sayPrice(dollars: number, cents: number): string {
  const d =
    dollars < 100
      ? twoDigits(dollars)
      : `${ONES[Math.floor(dollars / 100)]} hundred${dollars % 100 ? ` ${twoDigits(dollars % 100)}` : ""}`;
  if (cents === 0) return `${d} dollars`;
  return `${d} ${twoDigits(cents)}`;
}

function sayTime(h: number, m: number): string {
  if (m === 0) return `${ONES[h]} o'clock`;
  if (m === 15) return `a quarter past ${ONES[h]}`;
  if (m === 30) return `half past ${ONES[h]}`;
  if (m < 10) return `${ONES[h]} oh ${ONES[m]}`;
  return `${ONES[h]} ${twoDigits(m)}`;
}

// ── Near-miss distractor construction ───────────────────────────────
/** The teen/ty trap: 15→50, 50→15, 13→30 … the single worst confusion. */
function teenTySwap(n: number): number | null {
  const map: Record<number, number> = {
    13: 30, 30: 13, 14: 40, 40: 14, 15: 50, 50: 15,
    16: 60, 60: 16, 17: 70, 70: 17, 18: 80, 80: 18, 19: 90, 90: 19,
  };
  return map[n] ?? null;
}

function roomDistractors(n: number, rand: () => number): number[] {
  const out = new Set<number>();
  const rest = n % 100;
  const swap = teenTySwap(rest);
  if (swap !== null) out.add(n - rest + swap);
  // Digit swap: 215 → 251
  const s = String(n);
  if (s.length >= 2) {
    const arr = s.split("");
    const i = arr.length - 2;
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    const swapped = Number(arr.join(""));
    if (swapped !== n && swapped > 0) out.add(swapped);
  }
  // Off-by-ten
  out.add(n + (rand() < 0.5 ? 10 : -10));
  return [...out].filter((x) => x !== n && x > 0).slice(0, 2);
}

// ── Question builders ───────────────────────────────────────────────
function buildRoom(level: CEFRLevel, rand: () => number): NumberQuestion {
  const n =
    level === "A1"
      ? 10 + Math.floor(rand() * 89)
      : 100 + Math.floor(rand() * 899);
  const distractors = roomDistractors(n, rand);
  while (distractors.length < 2) {
    const d = n + Math.ceil(rand() * 5) * (rand() < 0.5 ? 1 : -1);
    if (d !== n && d > 0 && !distractors.includes(d)) distractors.push(d);
  }
  const options = [n, ...distractors]
    .map((v) => ({ display: String(v), correct: v === n }))
    .sort(() => rand() - 0.5);
  return {
    kind: "room",
    audio_en: `Your room is ${sayRoom(n)}.`,
    prompt_es: "¿Qué número de cuarto dijo?",
    options,
    reveal_en: sayRoom(n),
  };
}

function buildPrice(level: CEFRLevel, rand: () => number): NumberQuestion {
  const dollars =
    level === "B2"
      ? 100 + Math.floor(rand() * 800)
      : 10 + Math.floor(rand() * 89);
  const cents =
    level === "A2" ? 0 : [0, 25, 50, 75, 95, 99][Math.floor(rand() * 6)];
  const fmt = (d: number, c: number) =>
    c === 0 ? `$${d}` : `$${d}.${String(c).padStart(2, "0")}`;
  const distractors: [number, number][] = [];
  const swap = teenTySwap(dollars % 100);
  if (swap !== null) distractors.push([dollars - (dollars % 100) + swap, cents]);
  if (cents !== 0) distractors.push([dollars, cents === 50 ? 15 : 50]);
  distractors.push([dollars + 10, cents]);
  const opts = distractors
    .filter(([d, c]) => !(d === dollars && c === cents) && d > 0)
    .slice(0, 2);
  // Guarantee three options: pad with near-miss dollar amounts when the
  // teen/ty trap didn't apply (e.g. even whole-dollar prices).
  while (opts.length < 2) {
    const d = dollars + Math.ceil(rand() * 5) * (rand() < 0.5 ? 1 : -1);
    if (d > 0 && d !== dollars && !opts.some(([x, c]) => x === d && c === cents)) {
      opts.push([d, cents]);
    }
  }
  const options = [[dollars, cents] as [number, number], ...opts]
    .map(([d, c]) => ({
      display: fmt(d, c),
      correct: d === dollars && c === cents,
    }))
    .sort(() => rand() - 0.5);
  return {
    kind: "price",
    audio_en: `That will be ${sayPrice(dollars, cents)}.`,
    prompt_es: "¿Cuánto es?",
    options,
    reveal_en: sayPrice(dollars, cents),
  };
}

function buildTime(level: CEFRLevel, rand: () => number): NumberQuestion {
  const h = 1 + Math.floor(rand() * 12);
  const m =
    level === "A1"
      ? 0
      : level === "A2"
        ? [0, 15, 30][Math.floor(rand() * 3)]
        : [5, 10, 15, 20, 30, 40, 45, 50][Math.floor(rand() * 8)];
  const fmt = (hh: number, mm: number) =>
    `${hh}:${String(mm).padStart(2, "0")}`;
  const distractors: [number, number][] = [];
  const swap = teenTySwap(m);
  if (swap !== null && swap < 60) distractors.push([h, swap]);
  distractors.push([(h % 12) + 1, m]);
  distractors.push([h, (m + 30) % 60]);
  const opts = distractors
    .filter(([hh, mm]) => !(hh === h && mm === m))
    .slice(0, 2);
  const options = [[h, m] as [number, number], ...opts]
    .map(([hh, mm]) => ({ display: fmt(hh, mm), correct: hh === h && mm === m }))
    .sort(() => rand() - 0.5);
  return {
    kind: "time",
    audio_en: `The shuttle leaves at ${sayTime(h, m)}.`,
    prompt_es: "¿A qué hora sale?",
    options,
    reveal_en: sayTime(h, m),
  };
}

/**
 * Build a session of `count` questions, deterministic for a given seed.
 * Kinds rotate so no two consecutive questions are the same kind.
 */
export function buildNumberSession(
  level: CEFRLevel,
  seed: number,
  count = 8,
): NumberQuestion[] {
  const rand = rng(seed);
  const kinds: NumberKind[] =
    level === "A1" ? ["room", "time"] : ["room", "price", "time"];
  const out: NumberQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const kind = kinds[i % kinds.length];
    if (kind === "room") out.push(buildRoom(level, rand));
    else if (kind === "price") out.push(buildPrice(level, rand));
    else out.push(buildTime(level, rand));
  }
  return out;
}
