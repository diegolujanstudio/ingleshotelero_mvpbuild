import "server-only";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { readStreak } from "@/lib/practice/streak";

/**
 * Learner progress — turns the data already collected in `drill_history`
 * into the feedback loop that makes practice feel like real learning:
 * "I can see I'm getting better." Listening accuracy, speaking score
 * trend, vocabulary learned, consistency.
 */

export interface ModuleStat {
  module: string;
  drills: number;
  listening_pct: number | null;
  speaking_avg: number | null;
}

export interface LearnerProgress {
  has_data: boolean;
  total_drills: number;
  days_practiced: number;
  current_streak: number;
  longest_streak: number;
  listening_pct: number | null; // 0..100, lifetime
  speaking_avg: number | null; // 0..100, lifetime
  vocab_total: number;
  // 7-day window vs the 7 before it (improvement signal)
  speaking_recent: number | null;
  speaking_prior: number | null;
  listening_recent_pct: number | null;
  by_module: ModuleStat[];
  recent: Array<{
    drill_id: string;
    module: string;
    level: string;
    listening_correct: boolean | null;
    speaking_score: number | null;
    vocab_known: number;
    completed_at: string;
  }>;
}

interface Row {
  drill_id: string;
  level: string;
  module: string;
  listening_correct: boolean | null;
  speaking_score: number | null;
  vocab_known: number | null;
  completed_at: string;
}

function avg(nums: number[]): number | null {
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
}
function pct(rows: Row[]): number | null {
  const graded = rows.filter((r) => r.listening_correct !== null);
  if (!graded.length) return null;
  return Math.round(
    (graded.filter((r) => r.listening_correct).length / graded.length) * 100,
  );
}

export async function getEmployeeProgress(
  employeeId: string,
): Promise<LearnerProgress> {
  const empty: LearnerProgress = {
    has_data: false,
    total_drills: 0,
    days_practiced: 0,
    current_streak: 0,
    longest_streak: 0,
    listening_pct: null,
    speaking_avg: null,
    vocab_total: 0,
    speaking_recent: null,
    speaking_prior: null,
    listening_recent_pct: null,
    by_module: [],
    recent: [],
  };

  const sb = createServiceClient();
  if (!sb) return empty;

  let rows: Row[] = [];
  try {
    const { data } = await sb
      .from("drill_history")
      .select(
        "drill_id, level, module, listening_correct, speaking_score, vocab_known, completed_at",
      )
      .eq("employee_id", employeeId)
      .order("completed_at", { ascending: false })
      .limit(400);
    rows = (data as Row[] | null) ?? [];
  } catch {
    return empty;
  }

  const streak = await readStreak(employeeId).catch(() => ({
    current_streak: 0,
    longest_streak: 0,
  }));

  if (rows.length === 0) {
    return { ...empty, current_streak: streak.current_streak, longest_streak: streak.longest_streak };
  }

  const speaking = rows
    .map((r) => r.speaking_score)
    .filter((s): s is number => typeof s === "number");
  const days = new Set(rows.map((r) => r.completed_at.slice(0, 10)));

  const now = Date.now();
  const within = (r: Row, fromDaysAgo: number, toDaysAgo: number) => {
    const t = new Date(r.completed_at).getTime();
    return t >= now - fromDaysAgo * 864e5 && t < now - toDaysAgo * 864e5;
  };
  const recent7 = rows.filter((r) => within(r, 7, 0));
  const prior7 = rows.filter((r) => within(r, 14, 7));

  const modules = Array.from(new Set(rows.map((r) => r.module)));
  const by_module: ModuleStat[] = modules.map((m) => {
    const mr = rows.filter((r) => r.module === m);
    return {
      module: m,
      drills: mr.length,
      listening_pct: pct(mr),
      speaking_avg: avg(
        mr.map((r) => r.speaking_score).filter((s): s is number => typeof s === "number"),
      ),
    };
  });

  return {
    has_data: true,
    total_drills: rows.length,
    days_practiced: days.size,
    current_streak: streak.current_streak,
    longest_streak: streak.longest_streak,
    listening_pct: pct(rows),
    speaking_avg: avg(speaking),
    vocab_total: rows.reduce((a, r) => a + (r.vocab_known ?? 0), 0),
    speaking_recent: avg(
      recent7.map((r) => r.speaking_score).filter((s): s is number => typeof s === "number"),
    ),
    speaking_prior: avg(
      prior7.map((r) => r.speaking_score).filter((s): s is number => typeof s === "number"),
    ),
    listening_recent_pct: pct(recent7),
    by_module,
    recent: rows.slice(0, 12).map((r) => ({
      drill_id: r.drill_id,
      module: r.module,
      level: r.level,
      listening_correct: r.listening_correct,
      speaking_score: r.speaking_score,
      vocab_known: r.vocab_known ?? 0,
      completed_at: r.completed_at,
    })),
  };
}
