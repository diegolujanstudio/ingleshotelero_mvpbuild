/**
 * SuperMemo 2 (SM-2) spaced-repetition algorithm.
 *
 * Reference: Wozniak, P. A. & Gorzelanczyk, E. J. (1994).
 * "Optimization of repetition spacing in the practice of learning."
 *
 * Grades 0-5:
 *   0 — total blackout. Restart.
 *   1 — incorrect; the correct one remembered.
 *   2 — incorrect; correct seemed easy to recall.
 *   3 — correct; serious difficulty.
 *   4 — correct; some hesitation.
 *   5 — perfect.
 *
 * On grade < 3: repetitions reset to 0, interval back to 1 day.
 * On grade >= 3: bump repetitions, schedule per the standard table.
 *
 * Ease factor floor is 1.3 (the canonical lower bound — anything below
 * causes runaway short intervals on consistently-failed cards).
 */

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2State {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

export interface SM2Result extends SM2State {
  next_review_at: Date;
}

export const DEFAULT_SM2: SM2State = {
  ease_factor: 2.5,
  interval_days: 0,
  repetitions: 0,
};

export function nextReview(
  grade: Grade,
  prev: SM2State = DEFAULT_SM2,
  now: Date = new Date(),
): SM2Result {
  let { ease_factor, interval_days, repetitions } = prev;

  if (grade < 3) {
    repetitions = 0;
    interval_days = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval_days = 1;
    } else if (repetitions === 2) {
      interval_days = 6;
    } else {
      interval_days = Math.max(1, Math.round(interval_days * ease_factor));
    }
  }

  // Standard SM-2 EF update.
  ease_factor = ease_factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (ease_factor < 1.3) ease_factor = 1.3;

  const next_review_at = new Date(
    now.getTime() + interval_days * 24 * 60 * 60 * 1000,
  );

  return { ease_factor, interval_days, repetitions, next_review_at };
}

/**
 * Map a coarse "did you know it?" UX grade to an SM-2 grade.
 * Used by the simplified flashcard UI when we don't ask a 5-point scale.
 */
export function uxGradeToSm2(answer: "no" | "hard" | "good" | "easy"): Grade {
  switch (answer) {
    case "no":
      return 0;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}
