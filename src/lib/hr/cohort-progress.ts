import "server-only";

/**
 * Cohort progress — per-member completion, derived from actual practice
 * activity instead of the static `cohort_members.completion_pct` column
 * (which only the /members POST route ever touched, so it sat at 0% for
 * the lifetime of the cohort).
 *
 * "Completion" = the fraction of the cohort's elapsed days the member
 * actually practiced on, from `start_date` through `min(today, end_date)`.
 * Write-through: every computeCohortProgress() call persists the freshly
 * computed completion_pct back onto cohort_members, so loadCohorts() (which
 * reads that column directly for the list view) stays in sync without a
 * second live computation on every page.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";

const IN_CHUNK = 200;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export interface MemberProgress {
  employee_id: string;
  days_practiced: number;
  days_elapsed: number;
  completion_pct: number;
  exam_completed: boolean;
  last_practice_date: string | null;
}

export interface CohortProgress {
  members: MemberProgress[];
  avg_completion_pct: number;
  on_track_count: number;
}

const EMPTY: CohortProgress = { members: [], avg_completion_pct: 0, on_track_count: 0 };

export async function computeCohortProgress(cohortId: string): Promise<CohortProgress> {
  const sb = createServiceClient();
  if (!sb) return EMPTY;

  try {
    const { data: cohort } = await sb
      .from("cohorts")
      .select("id, start_date, end_date, completion_target_pct")
      .eq("id", cohortId)
      .maybeSingle();
    if (!cohort) return EMPTY;

    const { data: memberRows } = await sb
      .from("cohort_members")
      .select("id, employee_id")
      .eq("cohort_id", cohortId);
    const members = memberRows ?? [];
    if (members.length === 0) return EMPTY;

    const todayIso = new Date().toISOString().slice(0, 10);
    const startDate = cohort.start_date ?? todayIso;
    const endDate = cohort.end_date && cohort.end_date < todayIso ? cohort.end_date : todayIso;

    const spanMs = new Date(endDate).getTime() - new Date(startDate).getTime();
    const daysElapsed = Math.max(1, Math.floor(spanMs / 86400000) + 1);

    const empIds = members.map((m) => m.employee_id);

    // Practice days per employee within [startDate, endDate], plus the most
    // recent practice date (used for the "last_practice" chip regardless of
    // whether it falls inside the cohort window).
    const practiceDaysByEmp = new Map<string, Set<string>>();
    const lastPracticeByEmp = new Map<string, string>();
    for (const ids of chunk(empIds, IN_CHUNK)) {
      const { data: sessions } = await sb
        .from("practice_sessions")
        .select("employee_id, date")
        .in("employee_id", ids);
      for (const s of sessions ?? []) {
        if (!s.employee_id) continue;
        const prevLast = lastPracticeByEmp.get(s.employee_id);
        if (!prevLast || s.date > prevLast) lastPracticeByEmp.set(s.employee_id, s.date);
        if (s.date >= startDate && s.date <= endDate) {
          if (!practiceDaysByEmp.has(s.employee_id)) {
            practiceDaysByEmp.set(s.employee_id, new Set());
          }
          practiceDaysByEmp.get(s.employee_id)!.add(s.date);
        }
      }
    }

    // Placement exam completion — any exam_session with status=complete.
    const examCompletedSet = new Set<string>();
    for (const ids of chunk(empIds, IN_CHUNK)) {
      const { data: exams } = await sb
        .from("exam_sessions")
        .select("employee_id, status")
        .in("employee_id", ids)
        .eq("status", "complete");
      for (const e of exams ?? []) examCompletedSet.add(e.employee_id);
    }

    const results: MemberProgress[] = members.map((m) => {
      const daysPracticed = practiceDaysByEmp.get(m.employee_id)?.size ?? 0;
      const completionPct = Math.min(100, Math.round((daysPracticed / daysElapsed) * 100));
      return {
        employee_id: m.employee_id,
        days_practiced: daysPracticed,
        days_elapsed: daysElapsed,
        completion_pct: completionPct,
        exam_completed: examCompletedSet.has(m.employee_id),
        last_practice_date: lastPracticeByEmp.get(m.employee_id) ?? null,
      };
    });

    const avgCompletionPct = Math.round(
      results.reduce((sum, r) => sum + r.completion_pct, 0) / results.length,
    );
    const target = cohort.completion_target_pct ?? 80;
    const onTrackCount = results.filter((r) => r.completion_pct >= target).length;

    // Write-through so loadCohorts()'s list view (which reads the column
    // directly, not this live computation) stops showing a stale 0%.
    // Best-effort: awaited so a caller reloading right after sees fresh
    // data, but a write failure never blocks returning the computed result.
    await Promise.allSettled(
      results.map((r) => {
        const member = members.find((m) => m.employee_id === r.employee_id);
        if (!member) return Promise.resolve();
        return sb
          .from("cohort_members")
          .update({ completion_pct: r.completion_pct })
          .eq("id", member.id);
      }),
    );

    return { members: results, avg_completion_pct: avgCompletionPct, on_track_count: onTrackCount };
  } catch {
    return EMPTY;
  }
}
