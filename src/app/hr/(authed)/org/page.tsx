import { redirect } from "next/navigation";
import { requireHRUser } from "@/lib/hr/auth";
import { isOrgLevel } from "@/lib/auth/roles";
import { loadOrgOverview } from "@/lib/hr/org-data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { MetricCard } from "@/components/masteros/MetricCard";
import { ORG } from "@/content/hr";
import { OrgTable } from "./OrgTable";

export const dynamic = "force-dynamic";

/**
 * /hr/org — org_admin / super_admin only. One row per property in scope so
 * a chain can compare activity and exam throughput across hotels without
 * hopping between the single-property switcher one property at a time.
 */
export default async function OrgOverviewPage() {
  const user = await requireHRUser();
  if (!isOrgLevel(user.role)) redirect("/hr");

  const { org, rows } = await loadOrgOverview(user);
  const totalActive = rows.reduce((sum, r) => sum + r.employees_active, 0);
  const totalExams30d = rows.reduce((sum, r) => sum + r.exams_completed_30d, 0);

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={ORG.eyebrow}
        title={
          <>
            {ORG.headline.before}
            <em>{ORG.headline.em}</em>
            {ORG.headline.after}
          </>
        }
        sub={org ? `${org.name} — ${ORG.sub}` : ORG.sub}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <MetricCard
          eyebrow={ORG.metrics.properties.eyebrow}
          value={rows.length}
          caption={ORG.metrics.properties.caption}
        />
        <MetricCard
          eyebrow={ORG.metrics.totalActive.eyebrow}
          value={totalActive}
          caption={ORG.metrics.totalActive.caption}
        />
        <MetricCard
          eyebrow={ORG.metrics.exams30d.eyebrow}
          value={totalExams30d}
          caption={ORG.metrics.exams30d.caption}
        />
      </div>

      <div className="mt-8">
        <OrgTable rows={rows} />
      </div>
    </section>
  );
}
