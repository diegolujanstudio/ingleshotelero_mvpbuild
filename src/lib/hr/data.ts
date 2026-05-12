import "server-only";

/**
 * HR dashboard data layer.
 *
 * Server-only helpers that query Supabase with explicit property scoping.
 * For org_admin / super_admin, the query spans multiple properties; for
 * property_admin / viewer, scope is a single property.
 *
 * Uses the SERVICE client because every helper here runs after a successful
 * `requireHRUser()` defensive check — we already know the caller is allowed
 * to read the property/org. RLS would also be enforced if we used the
 * server client, but the service client lets us run a single aggregate
 * across multiple properties for org-level views.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import type { CEFRLevel, RoleModule, Database } from "@/lib/supabase/types";
import type { HRUser } from "@/lib/auth/session";
import type { EmployeeStatus } from "@/content/hr";
import type {
  HREmployeeView,
  HRCohortView,
  HRTeamMember,
  HROrgInfo,
  HRPropertyInfo,
} from "./demo-bridge";
import {
  getDemoEmployees,
  getDemoCohorts,
  getDemoTeam,
  getDemoOrg,
  getDemoProperty,
  shouldUseDemoFallback,
  isDemoMode,
} from "./demo-bridge";

type SC = NonNullable<ReturnType<typeof createServiceClient>>;
type EmployeeRow = Database["public"]["Tables"]["employees"]["Row"];

/** Resolve which property_ids the user can read. */
async function userPropertyIds(user: HRUser, sb: SC): Promise<string[]> {
  if (user.role === "super_admin") {
    const { data } = await sb.from("properties").select("id").eq("is_active", true);
    return (data ?? []).map((p) => p.id);
  }
  if (user.role === "org_admin" && user.organization_id) {
    const { data } = await sb
      .from("properties")
      .select("id")
      .eq("organization_id", user.organization_id)
      .eq("is_active", true);
    return (data ?? []).map((p) => p.id);
  }
  if (user.property_id) return [user.property_id];
  return [];
}

function rowToView(
  emp: EmployeeRow,
  metrics: {
    combined_score?: number;
    listening_score?: number;
    speaking_score?: number;
    last_active_days_ago?: number;
    streak?: number;
    practice_completion_pct?: number;
    exam_completed_at?: string | null;
  } = {},
): HREmployeeView {
  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    phone: emp.phone,
    hotel_role: emp.hotel_role,
    current_level: emp.current_level,
    department: emp.department,
    shift: emp.shift,
    whatsapp_opted_in: emp.whatsapp_opted_in,
    is_active: emp.is_active,
    status: (emp.is_active ? "active" : "inactive") as EmployeeStatus,
    source: emp.source,
    created_at: emp.created_at,
    updated_at: emp.updated_at,
    combined_score: metrics.combined_score ?? 0,
    listening_score: metrics.listening_score ?? 0,
    speaking_score: metrics.speaking_score ?? 0,
    last_active_days_ago: metrics.last_active_days_ago ?? 999,
    streak: metrics.streak ?? 0,
    practice_completion_pct: metrics.practice_completion_pct ?? 0,
    exam_completed_at: metrics.exam_completed_at ?? null,
    is_demo: false,
  };
}

function daysSince(iso: string | null | undefined): number {
  if (!iso) return 999;
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86400000),
  );
}

/** ─── Employees ───────────────────────────────────────────────────── */

export async function loadEmployees(user: HRUser): Promise<HREmployeeView[]> {
  const sb = createServiceClient();
  if (!sb) {
    return isDemoMode() ? getDemoEmployees() : [];
  }
  try {
    const propertyIds = await userPropertyIds(user, sb);
    if (propertyIds.length === 0) {
      return isDemoMode() ? getDemoEmployees() : [];
    }
    const { data: employees } = await sb
      .from("employees")
      .select("*")
      .in("property_id", propertyIds);

    if (!employees || employees.length === 0) {
      return shouldUseDemoFallback(0) ? getDemoEmployees() : [];
    }

    // Latest exam session per employee
    const { data: sessions } = await sb
      .from("exam_sessions")
      .select(
        "id, employee_id, status, listening_score, speaking_avg_score, completed_at, started_at",
      )
      .in(
        "employee_id",
        employees.map((e) => e.id),
      )
      .order("completed_at", { ascending: false });

    const latestByEmp = new Map<
      string,
      { listening: number; speaking: number; combined: number; completed_at: string | null }
    >();
    for (const s of sessions ?? []) {
      if (latestByEmp.has(s.employee_id)) continue;
      if (s.status !== "complete") continue;
      const listening = s.listening_score ?? 0;
      const speaking = s.speaking_avg_score ?? 0;
      const combined = Math.round(speaking * 0.6 + listening * 0.4);
      latestByEmp.set(s.employee_id, {
        listening,
        speaking,
        combined,
        completed_at: s.completed_at,
      });
    }

    // Streaks
    const { data: streakRows } = await sb
      .from("streaks")
      .select("employee_id, current_streak, last_practice_date")
      .in(
        "employee_id",
        employees.map((e) => e.id),
      );
    const streakByEmp = new Map<string, { current: number; last: string | null }>();
    for (const s of streakRows ?? []) {
      streakByEmp.set(s.employee_id, {
        current: s.current_streak,
        last: s.last_practice_date,
      });
    }

    return employees.map((e) => {
      const m = latestByEmp.get(e.id);
      const s = streakByEmp.get(e.id);
      return rowToView(e, {
        listening_score: m?.listening,
        speaking_score: m?.speaking,
        combined_score: m?.combined,
        exam_completed_at: m?.completed_at ?? null,
        last_active_days_ago: daysSince(s?.last ?? m?.completed_at ?? e.updated_at),
        streak: s?.current ?? 0,
        practice_completion_pct: s?.current ? Math.min(100, s.current * 4) : 0,
      });
    });
  } catch {
    return isDemoMode() ? getDemoEmployees() : [];
  }
}

export async function loadEmployee(
  user: HRUser,
  id: string,
): Promise<HREmployeeView | null> {
  // Demo path
  if (id.startsWith("demo-")) {
    const demo = getDemoEmployees().find((d) => d.id === id);
    if (demo) return demo;
  }
  const sb = createServiceClient();
  if (!sb) {
    return getDemoEmployees().find((d) => d.id === id) ?? null;
  }
  try {
    const propertyIds = await userPropertyIds(user, sb);
    const { data: emp } = await sb.from("employees").select("*").eq("id", id).maybeSingle();
    if (!emp || !propertyIds.includes(emp.property_id)) return null;

    const { data: sessions } = await sb
      .from("exam_sessions")
      .select(
        "id, status, listening_score, speaking_avg_score, completed_at, started_at",
      )
      .eq("employee_id", emp.id)
      .order("completed_at", { ascending: false })
      .limit(1);
    const session = (sessions ?? [])[0];
    const listening = session?.listening_score ?? 0;
    const speaking = session?.speaking_avg_score ?? 0;
    const combined = Math.round(speaking * 0.6 + listening * 0.4);

    const { data: streak } = await sb
      .from("streaks")
      .select("current_streak, longest_streak, last_practice_date")
      .eq("employee_id", emp.id)
      .maybeSingle();

    return rowToView(emp, {
      listening_score: listening,
      speaking_score: speaking,
      combined_score: combined,
      exam_completed_at: session?.completed_at ?? null,
      last_active_days_ago: daysSince(streak?.last_practice_date ?? session?.completed_at ?? emp.updated_at),
      streak: streak?.current_streak ?? 0,
      practice_completion_pct: streak?.current_streak ? Math.min(100, streak.current_streak * 4) : 0,
    });
  } catch {
    return null;
  }
}

export interface EmployeeTranscript {
  prompt_index: number;
  level: CEFRLevel;
  transcript: string | null;
  feedback_es: string | null;
  score_total: number | null;
  scenario_es: string;
}

export async function loadEmployeeTranscripts(
  user: HRUser,
  employeeId: string,
): Promise<EmployeeTranscript[]> {
  if (employeeId.startsWith("demo-")) return [];
  const sb = createServiceClient();
  if (!sb) return [];
  try {
    const propertyIds = await userPropertyIds(user, sb);
    const { data: emp } = await sb.from("employees").select("property_id").eq("id", employeeId).maybeSingle();
    if (!emp || !propertyIds.includes(emp.property_id)) return [];

    const { data: sessions } = await sb
      .from("exam_sessions")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("status", "complete")
      .order("completed_at", { ascending: false })
      .limit(1);
    const sessionId = sessions?.[0]?.id;
    if (!sessionId) return [];

    const { data: recs } = await sb
      .from("speaking_recordings")
      .select("prompt_index, level_tag, transcript, ai_feedback_es, ai_score_total")
      .eq("session_id", sessionId)
      .order("prompt_index", { ascending: true });

    return (recs ?? []).map((r) => ({
      prompt_index: r.prompt_index,
      level: r.level_tag,
      transcript: r.transcript,
      feedback_es: r.ai_feedback_es,
      score_total: r.ai_score_total,
      scenario_es: `Escenario ${r.prompt_index + 1}`,
    }));
  } catch {
    return [];
  }
}

/** ─── Cohorts ─────────────────────────────────────────────────────── */

export async function loadCohorts(user: HRUser): Promise<HRCohortView[]> {
  const sb = createServiceClient();
  if (!sb) {
    return isDemoMode() ? getDemoCohorts() : [];
  }
  try {
    const propertyIds = await userPropertyIds(user, sb);
    if (propertyIds.length === 0) {
      return isDemoMode() ? getDemoCohorts() : [];
    }
    const { data: cohorts } = await sb
      .from("cohorts")
      .select("*")
      .in("property_id", propertyIds);
    if (!cohorts || cohorts.length === 0) {
      return shouldUseDemoFallback(0) ? getDemoCohorts() : [];
    }
    const { data: members } = await sb
      .from("cohort_members")
      .select("cohort_id, completion_pct")
      .in(
        "cohort_id",
        cohorts.map((c) => c.id),
      );
    const stats = new Map<string, { count: number; sum: number }>();
    for (const m of members ?? []) {
      const s = stats.get(m.cohort_id) ?? { count: 0, sum: 0 };
      s.count++;
      s.sum += m.completion_pct;
      stats.set(m.cohort_id, s);
    }
    return cohorts.map((c) => {
      const s = stats.get(c.id) ?? { count: 0, sum: 0 };
      return {
        id: c.id,
        name: c.name,
        module: c.module,
        target_level: c.target_level,
        start_date: c.start_date,
        end_date: c.end_date,
        completion_target_pct: c.completion_target_pct,
        status: c.status,
        member_count: s.count,
        avg_completion_pct: s.count ? Math.round(s.sum / s.count) : 0,
        is_demo: false,
      };
    });
  } catch {
    return isDemoMode() ? getDemoCohorts() : [];
  }
}

export interface HRCohortDetail extends HRCohortView {
  members: Array<{
    id: string;
    employee_id: string;
    employee_name: string;
    employee_role: RoleModule;
    employee_level: CEFRLevel | null;
    enrollment_date: string;
    status: "active" | "completed" | "dropped" | "paused";
    completion_pct: number;
  }>;
}

export async function loadCohort(
  user: HRUser,
  id: string,
): Promise<HRCohortDetail | null> {
  if (id.startsWith("demo-cohort-")) {
    const demo = getDemoCohorts().find((c) => c.id === id);
    if (!demo) return null;
    const employees = getDemoEmployees().slice(0, demo.member_count);
    return {
      ...demo,
      members: employees.map((e) => ({
        id: `demo-member-${e.id}`,
        employee_id: e.id,
        employee_name: e.name,
        employee_role: e.hotel_role,
        employee_level: e.current_level,
        enrollment_date: new Date().toISOString().slice(0, 10),
        status: "active",
        completion_pct: e.practice_completion_pct,
      })),
    };
  }
  const sb = createServiceClient();
  if (!sb) return null;
  try {
    const propertyIds = await userPropertyIds(user, sb);
    const { data: c } = await sb.from("cohorts").select("*").eq("id", id).maybeSingle();
    if (!c || !propertyIds.includes(c.property_id)) return null;

    const { data: members } = await sb
      .from("cohort_members")
      .select("id, employee_id, enrollment_date, status, completion_pct")
      .eq("cohort_id", c.id);
    const empIds = (members ?? []).map((m) => m.employee_id);
    const { data: emps } = empIds.length
      ? await sb.from("employees").select("id, name, hotel_role, current_level").in("id", empIds)
      : { data: [] };
    const empMap = new Map((emps ?? []).map((e) => [e.id, e]));

    const memberCount = members?.length ?? 0;
    const avgCompletion = memberCount
      ? Math.round(
          (members ?? []).reduce((s, m) => s + m.completion_pct, 0) / memberCount,
        )
      : 0;

    return {
      id: c.id,
      name: c.name,
      module: c.module,
      target_level: c.target_level,
      start_date: c.start_date,
      end_date: c.end_date,
      completion_target_pct: c.completion_target_pct,
      status: c.status,
      member_count: memberCount,
      avg_completion_pct: avgCompletion,
      is_demo: false,
      members: (members ?? []).map((m) => {
        const e = empMap.get(m.employee_id);
        return {
          id: m.id,
          employee_id: m.employee_id,
          employee_name: e?.name ?? "—",
          employee_role: (e?.hotel_role ?? "frontdesk") as RoleModule,
          employee_level: (e?.current_level ?? null) as CEFRLevel | null,
          enrollment_date: m.enrollment_date,
          status: m.status,
          completion_pct: m.completion_pct,
        };
      }),
    };
  } catch {
    return null;
  }
}

/** ─── Team ────────────────────────────────────────────────────────── */

export async function loadTeam(user: HRUser): Promise<HRTeamMember[]> {
  const sb = createServiceClient();
  if (!sb) {
    return isDemoMode() ? getDemoTeam() : [];
  }
  try {
    let q = sb.from("hr_users").select("id, email, name, role, is_active, last_login_at, invite_sent_at");
    if (user.role === "org_admin" && user.organization_id) {
      q = q.eq("organization_id", user.organization_id);
    } else if (user.role === "property_admin" && user.property_id) {
      q = q.eq("property_id", user.property_id);
    }
    const { data } = await q;
    if (!data || data.length === 0) {
      return shouldUseDemoFallback(0) ? getDemoTeam() : [];
    }
    return data.map((d) => ({
      id: d.id,
      email: d.email,
      name: d.name,
      role: d.role,
      is_active: d.is_active,
      last_login_at: d.last_login_at,
      invite_sent_at: d.invite_sent_at,
      is_demo: false,
    }));
  } catch {
    return isDemoMode() ? getDemoTeam() : [];
  }
}

/** ─── Settings ────────────────────────────────────────────────────── */

export async function loadOrgInfo(user: HRUser): Promise<HROrgInfo> {
  const sb = createServiceClient();
  if (!sb || !user.organization_id) return getDemoOrg();
  try {
    const { data } = await sb
      .from("organizations")
      .select("id, name, type, subscription_tier, subscription_status, billing_email")
      .eq("id", user.organization_id)
      .maybeSingle();
    if (!data) return getDemoOrg();
    return data;
  } catch {
    return getDemoOrg();
  }
}

export async function loadPropertyInfo(user: HRUser): Promise<HRPropertyInfo> {
  const sb = createServiceClient();
  if (!sb || !user.property_id) return getDemoProperty();
  try {
    const { data } = await sb
      .from("properties")
      .select("id, name, slug, city, state, country, room_count, timezone")
      .eq("id", user.property_id)
      .maybeSingle();
    if (!data) return getDemoProperty();
    return data;
  } catch {
    return getDemoProperty();
  }
}

/** ─── Overview aggregates ─────────────────────────────────────────── */

export interface OverviewStats {
  activeEmployees: number;
  examsLast30: number;
  inProgress: number;
  avgLevel: CEFRLevel | "—";
  levelDistribution: Array<{ level: CEFRLevel; count: number }>;
  byRole: Array<{ role: RoleModule; count: number }>;
  weeklyExams: Array<{ week: string; count: number }>;
  attention: {
    inactive: HREmployeeView[];
    failed: number;
    overdueCohorts: number;
  };
  recentActivity: Array<{
    type: "exam_completed" | "exam_started" | "drill_completed";
    employee_name: string;
    when_iso: string;
  }>;
  isDemo: boolean;
}

export async function loadOverview(
  user: HRUser,
  employees: HREmployeeView[],
): Promise<OverviewStats> {
  const isDemo = employees.length > 0 && employees[0].is_demo;
  const active = employees.filter((e) => e.is_active);
  const counts: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const e of active) if (e.current_level) counts[e.current_level]++;
  const byRoleMap: Record<RoleModule, number> = {
    bellboy: 0,
    frontdesk: 0,
    restaurant: 0,
  };
  for (const e of active) byRoleMap[e.hotel_role]++;

  const examsLast30 = active.filter(
    (e) => e.exam_completed_at && daysSince(e.exam_completed_at) <= 30,
  ).length;

  // Compute approximate "average level" by mode
  const orderedLevels: CEFRLevel[] = ["A1", "A2", "B1", "B2"];
  let topLevel: CEFRLevel | "—" = "—";
  let topCount = 0;
  for (const l of orderedLevels) {
    if (counts[l] > topCount) {
      topCount = counts[l];
      topLevel = l;
    }
  }

  // Weekly exams series — 12 weeks back, derived from exam_completed_at
  const weeks: Array<{ week: string; count: number }> = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(start.getDate() - i * 7);
    const label = `${start.toLocaleDateString("es-MX", { month: "short", day: "2-digit" })}`;
    weeks.push({ week: label, count: 0 });
  }
  for (const e of active) {
    if (!e.exam_completed_at) continue;
    const d = new Date(e.exam_completed_at);
    const ageDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    const weekIdx = 11 - Math.floor(ageDays / 7);
    if (weekIdx >= 0 && weekIdx <= 11) weeks[weekIdx].count++;
  }

  // In-progress sessions — only from real DB
  let inProgress = 0;
  let failed = 0;
  let overdueCohorts = 0;
  const recent: OverviewStats["recentActivity"] = [];

  if (!isDemo) {
    const sb = createServiceClient();
    if (sb) {
      try {
        const propertyIds = await userPropertyIds(user, sb);
        if (propertyIds.length > 0) {
          // Employees in properties -> in-progress sessions
          const empIds = active.map((e) => e.id);
          if (empIds.length) {
            const { count: ipCount } = await sb
              .from("exam_sessions")
              .select("id", { count: "exact", head: true })
              .in("employee_id", empIds)
              .in("status", ["in_progress", "listening_done", "speaking_done", "scoring"]);
            inProgress = ipCount ?? 0;

            const { count: failedCount } = await sb
              .from("speaking_recordings")
              .select("id", { count: "exact", head: true })
              .eq("scoring_status", "failed");
            failed = failedCount ?? 0;

            const { data: recentSessions } = await sb
              .from("exam_sessions")
              .select("status, completed_at, started_at, employee_id")
              .in("employee_id", empIds)
              .order("started_at", { ascending: false })
              .limit(8);
            const empMap = new Map(active.map((e) => [e.id, e.name]));
            for (const s of recentSessions ?? []) {
              const when = s.completed_at ?? s.started_at;
              recent.push({
                type: s.status === "complete" ? "exam_completed" : "exam_started",
                employee_name: empMap.get(s.employee_id) ?? "Empleado",
                when_iso: when,
              });
            }
          }

          const today = new Date().toISOString().slice(0, 10);
          const { count: overdue } = await sb
            .from("cohorts")
            .select("id", { count: "exact", head: true })
            .in("property_id", propertyIds)
            .lt("end_date", today)
            .neq("status", "completed")
            .neq("status", "archived");
          overdueCohorts = overdue ?? 0;
        }
      } catch {
        // soft-fail aggregate enrichment
      }
    }
  } else {
    // Demo enrichment
    inProgress = 2;
    failed = 0;
    overdueCohorts = 1;
    for (const e of active.slice(0, 5)) {
      recent.push({
        type: e.exam_completed_at ? "exam_completed" : "exam_started",
        employee_name: e.name,
        when_iso: e.exam_completed_at ?? e.created_at,
      });
    }
  }

  const inactiveAttention = active
    .filter((e) => e.last_active_days_ago > 14)
    .sort((a, b) => b.last_active_days_ago - a.last_active_days_ago)
    .slice(0, 5);

  return {
    activeEmployees: active.length,
    examsLast30,
    inProgress,
    avgLevel: topLevel,
    levelDistribution: orderedLevels.map((l) => ({ level: l, count: counts[l] })),
    byRole: (Object.keys(byRoleMap) as RoleModule[]).map((r) => ({
      role: r,
      count: byRoleMap[r],
    })),
    weeklyExams: weeks,
    attention: {
      inactive: inactiveAttention,
      failed,
      overdueCohorts,
    },
    recentActivity: recent,
    isDemo,
  };
}
