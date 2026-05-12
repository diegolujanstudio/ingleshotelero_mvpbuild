import { requireHRUser } from "@/lib/hr/auth";
import { loadEmployees, loadCohorts, loadPropertyInfo } from "@/lib/hr/data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { REPORTS, COMMON } from "@/content/hr";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requireHRUser();
  const [employees, cohorts, property] = await Promise.all([
    loadEmployees(user),
    loadCohorts(user),
    loadPropertyInfo(user),
  ]);
  const isDemo = employees.length > 0 && employees[0].is_demo;

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
        />
      </div>
    </section>
  );
}
