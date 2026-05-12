import "server-only";

/**
 * Scoring worker — re-exports the proven implementation from
 * `@/lib/server/scoring`.
 *
 * Kept as a thin module to match the file layout the task brief expects so
 * future maintainers can find it under the documented name. The actual
 * claim/score logic (with conditional UPDATE for race safety, retry-on-
 * failure with attempts < 3, and post-score session finalization) lives
 * inside `./scoring.ts`.
 */
export { scoreOne, claimPending as claimAndScoreBatch, runScoringOnce } from "./scoring";
export type { ScoreOneOutput } from "./scoring";
