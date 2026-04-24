/**
 * CEFR level calculation helpers.
 *
 * Source of truth: Product Bible §4 — Scoring Algorithm (Weighted).
 *
 * Listening score is weighted by item level:
 *   A1 → 1.0, A2 → 1.5, B1 → 2.0, B2 → 3.0.
 *
 * Speaking score is the average of 6 prompt totals (each 0–100, sum of four
 * 0–25 sub-scores from the AI rubric).
 *
 * Final level = (speaking × 0.60) + (listening × 0.40), bucketed:
 *   A1 < 30, A2 30–54, B1 55–77, B2 ≥ 78.
 */

import type { CEFRLevel } from "./supabase/types";

export const LEVEL_WEIGHTS: Record<CEFRLevel, number> = {
  A1: 1.0,
  A2: 1.5,
  B1: 2.0,
  B2: 3.0,
};

export const LEVEL_LABEL_ES: Record<CEFRLevel, string> = {
  A1: "Supervivencia",
  A2: "Funcional",
  B1: "Profesional",
  B2: "Avanzado",
};

export const LEVEL_DESCRIPTION_ES: Record<CEFRLevel, string> = {
  A1: "Puede responder a solicitudes básicas y predecibles con frases memorizadas.",
  A2: "Puede manejar interacciones rutinarias con cierta flexibilidad.",
  B1: "Puede manejar interacciones complejas: quejas, políticas, solicitudes de varios pasos.",
  B2: "Puede manejar cualquier interacción con fluidez y profesionalismo.",
};

export interface ListeningItemResult {
  level: CEFRLevel;
  correct: boolean;
}

/**
 * Compute a 0–100 listening score weighted by item level difficulty.
 */
export function calculateListeningScore(results: ListeningItemResult[]): number {
  if (results.length === 0) return 0;

  const totalWeight = results.reduce((sum, r) => sum + LEVEL_WEIGHTS[r.level], 0);
  const earnedWeight = results
    .filter((r) => r.correct)
    .reduce((sum, r) => sum + LEVEL_WEIGHTS[r.level], 0);

  return Math.round((earnedWeight / totalWeight) * 100);
}

/**
 * Average of speaking prompt totals (each already summed to 0–100 by the AI).
 */
export function calculateSpeakingAverage(promptTotals: number[]): number {
  if (promptTotals.length === 0) return 0;
  const sum = promptTotals.reduce((s, n) => s + n, 0);
  return Math.round(sum / promptTotals.length);
}

/**
 * Combined weighted score — speaking weighted 60%, listening 40%.
 */
export function calculateCombinedScore(opts: {
  listeningScore: number;
  speakingScore: number;
}): number {
  return Math.round(opts.speakingScore * 0.6 + opts.listeningScore * 0.4);
}

/**
 * Bucket a 0–100 combined score into a CEFR level.
 */
export function scoreToLevel(combined: number): CEFRLevel {
  if (combined < 30) return "A1";
  if (combined < 55) return "A2";
  if (combined < 78) return "B1";
  return "B2";
}

/**
 * Distance from the nearest level boundary — used to flag borderline
 * results for multi-pass re-scoring (bible §6: "within 5 points").
 */
export function distanceFromBoundary(combined: number): number {
  const boundaries = [30, 55, 78];
  return Math.min(...boundaries.map((b) => Math.abs(combined - b)));
}

/**
 * Convenience: full placement result from raw inputs.
 */
export function computePlacement(input: {
  listening: ListeningItemResult[];
  speakingPromptTotals: number[];
}): {
  listeningScore: number;
  speakingScore: number;
  combined: number;
  level: CEFRLevel;
  borderline: boolean;
} {
  const listeningScore = calculateListeningScore(input.listening);
  const speakingScore = calculateSpeakingAverage(input.speakingPromptTotals);
  const combined = calculateCombinedScore({ listeningScore, speakingScore });
  const level = scoreToLevel(combined);
  const borderline = distanceFromBoundary(combined) <= 5;
  return { listeningScore, speakingScore, combined, level, borderline };
}
