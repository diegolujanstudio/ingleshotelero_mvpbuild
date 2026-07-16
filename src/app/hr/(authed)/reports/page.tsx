import { requireHRUser } from "@/lib/hr/auth";
import { loadEmployees, loadCohorts, loadPropertyInfo } from "@/lib/hr/data";
import { resolveActiveScope } from "@/lib/hr/scope";
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client-or-service";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { REPORTS, COMMON } from "@/content/hr";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requireHRUser();
  const { propertyIds } = await resolveActiveScope(user);
  const [employees, cohorts, property] = await Promise.all([
    loadEmployees(user, propertyIds),
    loadCohorts(user, propertyIds),
    loadPropertyInfo(user),
  ]);
  const isDemo = employees.length > 0 && employees[0].is_demo;

  // Build cohort id → member employee ids so the client cohort filter actually
  // scopes the preview table AND the CSV/Excel exports (previously a no-op —
  // only the server PDF honored it). Scoped to the cohorts already resolved for
  // this user; skipped in demo mode (no real membership rows).
  let cohortMembers: Record<string, string[]> | undefined;
  if (!isDemo && isSupabaseConfigured() && cohorts.length > 0) {
    const sb = createServiceClient();
    if (sb) {
      const cohortIds = cohorts.map((c) => c.id);
      const { data: members } = (await sb
        .from("cohort_members")
        .select("cohort_id, employee_id")
        .in("cohort_id", cohortIds)) as unknown as {
        data: { cohort_id: string; employee_id: string }[] | null;
      };
      if (members) {
        cohortMembers = {};
        for (const m of members) {
          (cohortMembers[m.cohort_id] ??= []).push(m.employee_id);
        }
      }
    }
  }

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={REPORTS.eyebrow}
        title={
          <>
            {REPORTS.headline.before}
            <em>{REPORTS.headline.em}</em>
            {REPORTS.headline.after}
          </>
        }
        sub={REPORTS.sub}
        actions={
          isDemo && (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
              {COMMON.demoBadge}
            </span>
          )
        }
      />

      <div className="mt-6">
        <ReportsClient
          employees={employees}
          cohorts={cohorts}
          propertyName={property.name}
          cohortMembers={cohortMembers}
        />
      </div>
    </section>
  );
}
