/**
 * Lapse recovery — "el regreso suave".
 *
 * Implements Law 5 of METODO-TURNO.md: protect the habit above all content.
 *
 * The evidence (Fluent Forever, Ch. 6): Wyner lost a year of Japanese to a
 * 6,000-card backlog he could never find 30-50 hours to clear. His conclusion:
 *
 *   "When you miss a few days of flash cards, your reviews will pile up...
 *    the first day after a lapse is a terrible day to [clear it]. So don't!
 *    Just review five flash cards and perhaps learn one new word each day.
 *    That should be two minutes of study, tops."
 *   "'But...if I only do five reviews today, then I'll have an even bigger
 *    backlog tomorrow!' This is completely true and beside the point. Your top
 *    priority right now is the health and safety of your habit, not working
 *    through your backlog."
 *
 * Why this matters more for us than for a hobbyist: a hotel worker on rotating
 * shifts WILL miss days, through no fault of their own. A 12-hour turno is not
 * a motivation failure. Every competitor punishes this with a broken streak;
 * punishing someone for working is precisely how we would lose them.
 *
 * Ramp: Wyner recommends increasing 25-50% every couple of days. We ramp by
 * one item per completed session, which reaches a normal load in ~3 sessions.
 */

/** Due-card count for a learner who is practicing normally. */
export const NORMAL_DUE_CARDS = 3;

/** Due-card count on the first session back after a lapse. Deliberately tiny. */
export const RECOVERY_FLOOR_CARDS = 1;

/**
 * Days of silence before we treat a return as a lapse.
 * 2 days is normal for shift work (a day off plus a long turno) and must NOT
 * trigger recovery messaging — that would feel like being scolded for resting.
 */
export const LAPSE_THRESHOLD_DAYS = 3;

export type PracticePosture = "normal" | "returning";

export interface PracticePlan {
  posture: PracticePosture;
  /** How many SRS items to serve this session. */
  dueCardCount: number;
  /** Whole days since the learner last practiced. null = never practiced. */
  daysSinceLastPractice: number | null;
  /**
   * True when we should show the warm return message instead of the usual
   * session header. Never accompanied by streak-loss framing.
   */
  showReturnWelcome: boolean;
}

/** Whole days between two dates, ignoring time of day. */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const b = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.floor((b - a) / 86_400_000);
}

/**
 * Decide how heavy today's session should be.
 *
 * @param lastPracticeDate  `streaks.last_practice_date` (YYYY-MM-DD) or null
 * @param sessionsSinceReturn  completed sessions since the lapse ended; drives
 *                             the ramp. 0 = this is the first session back.
 * @param now  injectable for tests
 */
export function planPracticeSession(
  lastPracticeDate: string | Date | null,
  sessionsSinceReturn = 0,
  now: Date = new Date(),
): PracticePlan {
  if (!lastPracticeDate) {
    // Brand new learner. Not a lapse — a normal first session.
    return {
      posture: "normal",
      dueCardCount: NORMAL_DUE_CARDS,
      daysSinceLastPractice: null,
      showReturnWelcome: false,
    };
  }

  const last =
    lastPracticeDate instanceof Date
      ? lastPracticeDate
      : new Date(`${lastPracticeDate}T00:00:00.000Z`);

  if (Number.isNaN(last.getTime())) {
    return {
      posture: "normal",
      dueCardCount: NORMAL_DUE_CARDS,
      daysSinceLastPractice: null,
      showReturnWelcome: false,
    };
  }

  const gap = daysBetween(last, now);

  if (gap < LAPSE_THRESHOLD_DAYS) {
    return {
      posture: "normal",
      dueCardCount: NORMAL_DUE_CARDS,
      daysSinceLastPractice: gap,
      showReturnWelcome: false,
    };
  }

  // Lapsed. Serve the floor, then ramp one item per completed session until
  // we are back to a normal load. Never exceed normal during recovery.
  const ramped = Math.min(
    NORMAL_DUE_CARDS,
    RECOVERY_FLOOR_CARDS + Math.max(0, sessionsSinceReturn),
  );

  return {
    posture: "returning",
    dueCardCount: ramped,
    daysSinceLastPractice: gap,
    // Only greet on the actual first session back, not for the whole ramp.
    showReturnWelcome: sessionsSinceReturn === 0,
  };
}
