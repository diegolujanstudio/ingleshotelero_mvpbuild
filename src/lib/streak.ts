/**
 * Streak math for daily practice — the retention loop.
 *
 * Persistence is local-first (localStorage), with a placeholder for
 * future Supabase sync. Date math is performed in the user's local
 * timezone — daylight saving transitions are absorbed by comparing
 * calendar dates only, never timestamps.
 *
 * The contract:
 *   - "Today" = ISO date string (YYYY-MM-DD) in the user's local TZ
 *   - Recording a practice on day N+1 increments the streak by 1
 *   - Recording twice in the same day is idempotent
 *   - Skipping a day (gap >= 2) resets the streak to 1
 */

const STORAGE_KEY = "ih.streak.v1";

export type Streak = {
  current: number;
  longest: number;
  lastPracticeDate: string | null; // YYYY-MM-DD or null if never practiced
  totalDays: number;
};

const EMPTY: Streak = {
  current: 0,
  longest: 0,
  lastPracticeDate: null,
  totalDays: 0,
};

/** Today as YYYY-MM-DD in local timezone. */
export function todayIso(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Yesterday's date (relative to `today`) as YYYY-MM-DD. */
function yesterdayOf(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return todayIso(date);
}

export function readStreak(): Streak {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Streak>;
    return {
      current: Number(parsed.current ?? 0) | 0,
      longest: Number(parsed.longest ?? 0) | 0,
      lastPracticeDate: parsed.lastPracticeDate ?? null,
      totalDays: Number(parsed.totalDays ?? 0) | 0,
    };
  } catch {
    return EMPTY;
  }
}

function writeStreak(next: Streak): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota / private mode — fail silent. Streak is best-effort UX,
    // not load-bearing data.
  }
}

/**
 * Mark a practice as completed today. Returns the new streak state and
 * a flag indicating whether the streak just ticked up (so the UI can
 * celebrate). Idempotent: calling twice in the same day is a no-op
 * after the first call.
 */
export function recordPractice(now: Date = new Date()): {
  streak: Streak;
  ticked: boolean;
} {
  const today = todayIso(now);
  const prev = readStreak();

  // Same day — no-op.
  if (prev.lastPracticeDate === today) {
    return { streak: prev, ticked: false };
  }

  let nextCurrent: number;
  if (prev.lastPracticeDate === yesterdayOf(today)) {
    nextCurrent = prev.current + 1; // continued streak
  } else {
    nextCurrent = 1; // first practice ever, or gap reset
  }

  const next: Streak = {
    current: nextCurrent,
    longest: Math.max(prev.longest, nextCurrent),
    lastPracticeDate: today,
    totalDays: prev.totalDays + 1,
  };

  writeStreak(next);
  return { streak: next, ticked: true };
}

/**
 * Returns true if a practice was already recorded for today. Used to
 * show "ya practicó hoy" state instead of starting another drill.
 */
export function alreadyPracticedToday(now: Date = new Date()): boolean {
  return readStreak().lastPracticeDate === todayIso(now);
}

/** For tests / dev. */
export function clearStreak(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
