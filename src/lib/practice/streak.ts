import "server-only";

/**
 * Server-side streak engine — the source of truth.
 *
 * `tickStreak(employee_id, today)` is idempotent for the same calendar
 * day. It SELECTs the existing row, computes the next state, then
 * UPSERTs. Because we don't hold a row lock, two concurrent calls in
 * the same second could both see the pre-state and both write the
 * post-state — but since the result is the same (current_streak += 1
 * exactly once for today), the race is benign. The accepted window:
 * two requests for the same employee landing within the same DB
 * round-trip can both think they're the first; both will write
 * `last_practice_date = today` and `current_streak = N+1`. The end
 * state is correct either way; we just don't double-bump because the
 * second write reads `last_practice_date == today` if it's read after
 * the first write commits, and writes a no-op if before.
 *
 * For drill completion this is fine. If we ever need strict
 * once-per-day exactly-N bumping, switch to a Postgres function with
 * row-level lock.
 *
 * Date math is calendar-day in UTC for stability across DST. Practice
 * "day boundaries" feel local to the user when their device timezone
 * matches the server, which is the typical case for a phone over
 * hotel wifi. Multi-region cohorts can address this in v2 with a
 * per-employee timezone column.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import { log } from "@/lib/server/log";

export interface StreakState {
  current_streak: number;
  longest_streak: number;
  last_practice_date: string | null;
}

/** Return YYYY-MM-DD in UTC. */
export function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Calendar yesterday relative to a given YYYY-MM-DD. */
export function yesterdayOf(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return isoDate(dt);
}

/**
 * Tick the streak for `employee_id` on `today`. Idempotent.
 * Returns the new streak state. Returns a "noop" indicator via the
 * unchanged date if the call was a same-day re-tick.
 */
export async function tickStreak(
  employee_id: string,
  today: Date = new Date(),
): Promise<StreakState & { ticked: boolean }> {
  const supabase = createServiceClient();
  if (!supabase) {
    // Demo mode — caller falls back to localStorage.
    return {
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: null,
      ticked: false,
    };
  }
  const dayStr = isoDate(today);

  const { data: existing, error: readErr } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak, last_practice_date")
    .eq("employee_id", employee_id)
    .maybeSingle();
  if (readErr) {
    log.warn(
      { err: readErr.message, employee_id },
      "streak.read.failed",
    );
  }

  const prev: StreakState = existing ?? {
    current_streak: 0,
    longest_streak: 0,
    last_practice_date: null,
  };

  // Same-day no-op.
  if (prev.last_practice_date === dayStr) {
    return { ...prev, ticked: false };
  }

  let nextCurrent: number;
  if (prev.last_practice_date && prev.last_practice_date === yesterdayOf(dayStr)) {
    nextCurrent = prev.current_streak + 1;
  } else {
    nextCurrent = 1;
  }
  const nextLongest = Math.max(prev.longest_streak ?? 0, nextCurrent);

  const next: StreakState = {
    current_streak: nextCurrent,
    longest_streak: nextLongest,
    last_practice_date: dayStr,
  };

  const { error: writeErr } = await supabase
    .from("streaks")
    .upsert(
      {
        employee_id,
        current_streak: next.current_streak,
        longest_streak: next.longest_streak,
        last_practice_date: next.last_practice_date,
      },
      { onConflict: "employee_id" },
    );
  if (writeErr) {
    log.warn(
      { err: writeErr.message, employee_id },
      "streak.write.failed",
    );
    // Return computed state anyway — caller's UI can still reflect it,
    // and a retry will settle the row eventually.
  }

  return { ...next, ticked: true };
}

/** Read-only fetch (for the practice intro page header chip). */
export async function readStreak(
  employee_id: string,
): Promise<StreakState> {
  const supabase = createServiceClient();
  if (!supabase) {
    return {
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: null,
    };
  }
  const { data } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak, last_practice_date")
    .eq("employee_id", employee_id)
    .maybeSingle();
  return (
    data ?? {
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: null,
    }
  );
}
