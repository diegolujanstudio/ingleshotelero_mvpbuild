import "server-only";
import { createServiceClient } from "@/lib/supabase/client-or-service";

/**
 * Master OS insights — learning outcomes (proof the product works = the
 * sales weapon + product loop) and per-customer health (the retention
 * radar). Pure aggregation over data already collected: drill_history,
 * employees, exam_sessions, organizations/properties.
 */

const DAY = 864e5;

export interface DrillEffectiveness {
  drill_id: string;
  attempts: number;
  listening_pct: number; // lower = harder/possibly broken content
}
export interface OrgHealth {
  org_id: string;
  org_name: string;
  properties: number;
  employees: number;
  active_7d: number;
  active_pct: number;
  speaking_avg: number | null;
  exams_completed: number;
  health: number; // 0..100
  at_risk: boolean;
}
export interface Insights {
  has_data: boolean;
  // Outcomes
  learners_total: number;
  activated: number; // ≥1 drill
  habitual: number; // practiced on ≥3 distinct days
  active_7d: number;
  listening_pct: number | null;
  speaking_avg: number | null;
  vocab_total: number;
  exams_completed: number;
  cefr: Record<string, number>;
  hardest_drills: DrillEffectiveness[];
  // Health
  orgs: OrgHealth[];
  at_risk_count: number;
}

const EMPTY: Insights = {
  has_data: false,
  learners_total: 0,
  activated: 0,
  habitual: 0,
  active_7d: 0,
  listening_pct: null,
  speaking_avg: null,
  vocab_total: 0,
  exams_completed: 0,
  cefr: {},
  hardest_drills: [],
  orgs: [],
  at_risk_count: 0,
};

function avg(ns: number[]): number | null {
  return ns.length ? Math.round(ns.reduce((a, b) => a + b, 0) / ns.length) : null;
}

export async function getInsights(): Promise<Insights> {
  const sb = createServiceClient();
  if (!sb) return EMPTY;

  try {
    const [emp, hist, exams, orgs, props] = await Promise.all([
      sb.from("employees").select("id, property_id, current_level, is_active"),
      sb
        .from("drill_history")
        .select(
          "employee_id, drill_id, listening_correct, speaking_score, vocab_known, completed_at",
        )
        .order("completed_at", { ascending: false })
        .limit(8000),
      sb.from("exam_sessions").select("employee_id, status"),
      sb.from("organizations").select("id, name"),
      sb.from("properties").select("id, organization_id"),
    ]);

    type Emp = {
      id: string;
      property_id: string;
      current_level: string | null;
      is_active: boolean;
    };
    type Hist = {
      employee_id: string;
      drill_id: string;
      listening_correct: boolean | null;
      speaking_score: number | null;
      vocab_known: number | null;
      completed_at: string;
    };
    const employees = (emp.data as Emp[] | null) ?? [];
    const history = (hist.data as Hist[] | null) ?? [];
    const examRows =
      (exams.data as { employee_id: string; status: string }[] | null) ?? [];
    const orgRows =
      (orgs.data as { id: string; name: string }[] | null) ?? [];
    const propRows =
      (props.data as { id: string; organization_id: string }[] | null) ?? [];

    if (employees.length === 0 && history.length === 0) return EMPTY;

    const now = Date.now();
    const activeEmp = employees.filter((e) => e.is_active);

    // ── Outcomes ──
    const byEmp = new Map<string, Hist[]>();
    for (const h of history) {
      const a = byEmp.get(h.employee_id) ?? [];
      a.push(h);
      byEmp.set(h.employee_id, a);
    }
    const activated = byEmp.size;
    let habitual = 0;
    let active7d = 0;
    for (const [, rows] of byEmp) {
      const days = new Set(rows.map((r) => r.completed_at.slice(0, 10)));
      if (days.size >= 3) habitual++;
      if (rows.some((r) => now - new Date(r.completed_at).getTime() < 7 * DAY))
        active7d++;
    }
    const lc = history.filter((h) => h.listening_correct !== null);
    const listening_pct = lc.length
      ? Math.round(
          (lc.filter((h) => h.listening_correct).length / lc.length) * 100,
        )
      : null;
    const speaking_avg = avg(
      history
        .map((h) => h.speaking_score)
        .filter((s): s is number => typeof s === "number"),
    );
    const vocab_total = history.reduce((a, h) => a + (h.vocab_known ?? 0), 0);
    const exams_completed = examRows.filter(
      (e) => e.status === "complete",
    ).length;
    const cefr: Record<string, number> = {};
    for (const e of activeEmp) {
      const k = e.current_level ?? "sin nivel";
      cefr[k] = (cefr[k] ?? 0) + 1;
    }

    // Drill effectiveness — lowest listening accuracy w/ enough attempts.
    const perDrill = new Map<string, { n: number; ok: number }>();
    for (const h of history) {
      if (h.listening_correct === null) continue;
      const d = perDrill.get(h.drill_id) ?? { n: 0, ok: 0 };
      d.n++;
      if (h.listening_correct) d.ok++;
      perDrill.set(h.drill_id, d);
    }
    const hardest_drills: DrillEffectiveness[] = Array.from(perDrill.entries())
      .filter(([, d]) => d.n >= 3)
      .map(([drill_id, d]) => ({
        drill_id,
        attempts: d.n,
        listening_pct: Math.round((d.ok / d.n) * 100),
      }))
      .sort((a, b) => a.listening_pct - b.listening_pct)
      .slice(0, 6);

    // ── Customer health (per organization) ──
    const propToOrg = new Map(propRows.map((p) => [p.id, p.organization_id]));
    const orgName = new Map(orgRows.map((o) => [o.id, o.name]));
    const propCountByOrg = new Map<string, number>();
    for (const p of propRows)
      propCountByOrg.set(
        p.organization_id,
        (propCountByOrg.get(p.organization_id) ?? 0) + 1,
      );

    const orgAgg = new Map<
      string,
      { emps: string[]; active: Set<string>; speaking: number[] }
    >();
    for (const e of activeEmp) {
      const orgId = propToOrg.get(e.property_id);
      if (!orgId) continue;
      const a =
        orgAgg.get(orgId) ?? { emps: [], active: new Set<string>(), speaking: [] };
      a.emps.push(e.id);
      const rows = byEmp.get(e.id) ?? [];
      if (rows.some((r) => now - new Date(r.completed_at).getTime() < 7 * DAY))
        a.active.add(e.id);
      for (const r of rows)
        if (typeof r.speaking_score === "number") a.speaking.push(r.speaking_score);
      orgAgg.set(orgId, a);
    }
    const examByEmp = new Set(
      examRows.filter((e) => e.status === "complete").map((e) => e.employee_id),
    );
    const orgsOut: OrgHealth[] = Array.from(orgAgg.entries()).map(
      ([orgId, a]) => {
        const employeesN = a.emps.length;
        const active = a.active.size;
        const active_pct = employeesN
          ? Math.round((active / employeesN) * 100)
          : 0;
        const sAvg = avg(a.speaking);
        const examsDone = a.emps.filter((id) => examByEmp.has(id)).length;
        // Composite health: engagement 60% + outcomes 40%.
        const health = Math.round(
          0.6 * active_pct + 0.4 * (sAvg ?? 0),
        );
        return {
          org_id: orgId,
          org_name: orgName.get(orgId) ?? "—",
          properties: propCountByOrg.get(orgId) ?? 0,
          employees: employeesN,
          active_7d: active,
          active_pct,
          speaking_avg: sAvg,
          exams_completed: examsDone,
          health,
          at_risk: employeesN > 0 && active_pct < 25,
        };
      },
    ).sort((a, b) => a.health - b.health);

    return {
      has_data: true,
      learners_total: activeEmp.length,
      activated,
      habitual,
      active_7d: active7d,
      listening_pct,
      speaking_avg,
      vocab_total,
      exams_completed,
      cefr,
      hardest_drills,
      orgs: orgsOut,
      at_risk_count: orgsOut.filter((o) => o.at_risk).length,
    };
  } catch {
    return EMPTY;
  }
}
