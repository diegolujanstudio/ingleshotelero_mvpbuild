import { requireHRUser } from "@/lib/hr/auth";
import { loadCohorts } from "@/lib/hr/data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { COHORTS, COMMON } from "@/content/hr";
import { CohortsClient } from "./CohortsClient";

export const dynamic = "force-dynamic";

export default async function CohortsPage() {
  const user = await requireHRUser();
  const cohorts = await loadCohorts(user);
  const isDemo = cohorts.length > 0 && cohorts[0].is_demo;

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={COHORTS.eyebrow}
        title={
          <>
            {COHORTS.headline.before}
            <em>{COHORTS.headline.em}</em>
            {COHORTS.headline.after}
          </>
        }
        sub={COHORTS.sub}
        actions={
          isDemo && (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
              {COMMON.demoBadge}
            </span>
          )
        }
      />
      <div className="mt-6">
        <CohortsClient initial={cohorts} />
      </div>
    </section>
  );
}
