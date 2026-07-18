import "server-only";

/**
 * Org-level property comparison for /hr/org — org_admin and super_admin
 * only. Aggregates the same signals the single-property overview shows
 * (active headcount, level mix, exam throughput, weekly practice), one row
 * per property in scope.
 *
 * Uses the SERVICE client (already gated behind requireHRUser() +
 * isOrgLevel() at the page level) so a single query can span every property
 * in the org. Soft-fails to an empty result on any error — the org page
 * should never 500 a pitch or a pilot dashboard.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import type { CEFRLevel } from "@/lib/supabase/types";
import type { HRUser } from "@/lib/auth/session";
import { listScopedProperties, type PropertyLite } from "./scope";

/** Max ids per `.in()` list — comfortably under URL-length limits. */
const IN_CHUNK = 200;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export interface OrgPropertyStat {
  property_id: string;
  name: string;
  city: string | null;
  employees_active: number;
  avg_level: CEFRLevel | "—";
  exams_completed_30d: number;
  /** % of active employees with at least one completed placement exam, ever. */
  exam_completion_pct: number;
  /** Distinct active employees with a practice session in the last 7 days. */
  practice_7d: number;
}

export interface OrgOverview {
  org: { id: string; name: string } | null;
  rows: OrgPropertyStat[];
}

const ORDERED_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

export async function loadOrgOverview(user: HRUser): Promise<OrgOverview> {
  const sb = createServiceClient();
  const properties: PropertyLite[] = await listScopedProperties(user);
  if (!sb || properties.length === 0) {
    return { org: null, rows: [] };
  }

  try {
    const propertyIds = properties.map((p) => p.id);

    // Active employees per property + their current level, chunked. Paged
    // past Supabase's 1000-row cap per chunk — a chain with many properties
    // and a large combined headcount would otherwise silently lose rows.
    const PAGE = 1000;
    const empIdsByProperty = new Map<string, string[]>();
    const levelByEmp = new Map<string, CEFRLevel | null>();
    for (const ids of chunk(propertyIds, IN_CHUNK)) {
      for (let offset = 0; ; offset += PAGE) {
        const { data } = await sb
          .from("employees")
          .select("id, property_id, current_level")
          .in("property_id", ids)
          .eq("is_active", true)
          .order("id", { ascending: true })
          .range(offset, offset + PAGE - 1);
        const rows = data ?? [];
        for (const e of rows) {
          const list = empIdsByProperty.get(e.property_id) ?? [];
          list.push(e.id);
          empIdsByProperty.set(e.property_id, list);
          levelByEmp.set(e.id, e.current_level);
        }
        if (rows.length < PAGE) break;
      }
    }

    const allEmpIds = [...levelByEmp.keys()];

    // Completed exam sessions — split into "ever" (for completion %) and
    // "last 30 days" (for the throughput metric).
    const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
    const examCompletedEver = new Set<string>();
    const exams30dByEmp = new Map<string, number>();
    for (const ids of chunk(allEmpIds, IN_CHUNK)) {
      const { data } = await sb
        .from("exam_sessions")
        .select("employee_id, status, completed_at")
        .in("employee_id", ids)
        .eq("status", "complete");
      for (const s of data ?? []) {
        examCompletedEver.add(s.employee_id);
        if (s.completed_at && s.completed_at >= since30) {
          exams30dByEmp.set(s.employee_id, (exams30dByEmp.get(s.employee_id) ?? 0) + 1);
        }
      }
    }

    // Distinct employees with a practice session in the last 7 days.
    const since7 = new Date(Date.now() - 7 * 86400000).toISOString();
    const practice7dEmp = new Set<string>();
    for (const ids of chunk(allEmpIds, IN_CHUNK)) {
      const { data } = await sb
        .from("practice_sessions")
        .select("employee_id, created_at")
        .in("employee_id", ids)
        .gte("created_at", since7);
      for (const r of data ?? []) {
        if (r.employee_id) practice7dEmp.add(r.employee_id);
      }
    }

    const rows: OrgPropertyStat[] = properties.map((p) => {
      const empIds = empIdsByProperty.get(p.id) ?? [];
      const counts: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
      for (const eid of empIds) {
        const lvl = levelByEmp.get(eid);
        if (lvl) counts[lvl]++;
      }
      let avgLevel: CEFRLevel | "—" = "—";
      let topCount = 0;
      for (const l of ORDERED_LEVELS) {
        if (counts[l] > topCount) {
          topCount = counts[l];
          avgLevel = l;
        }
      }

      const exams30d = empIds.reduce((sum, eid) => sum + (exams30dByEmp.get(eid) ?? 0), 0);
      const completedEver = empIds.filter((eid) => examCompletedEver.has(eid)).length;
      const practice7d = empIds.filter((eid) => practice7dEmp.has(eid)).length;

      return {
        property_id: p.id,
        name: p.name,
        city: p.city,
        employees_active: empIds.length,
        avg_level: avgLevel,
        exams_completed_30d: exams30d,
        exam_completion_pct: empIds.length ? Math.round((completedEver / empIds.length) * 100) : 0,
        practice_7d: practice7d,
      };
    });

    let org: { id: string; name: string } | null = null;
    if (user.organization_id) {
      const { data: orgRow } = await sb
        .from("organizations")
        .select("id, name")
        .eq("id", user.organization_id)
        .maybeSingle();
      if (orgRow) org = orgRow;
    }

    return { org, rows };
  } catch {
    return { org: null, rows: [] };
  }
}
