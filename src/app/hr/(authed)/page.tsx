import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { requireHRUser } from "@/lib/hr/auth";
import { loadEmployees, loadOverview } from "@/lib/hr/data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { MetricCard } from "@/components/masteros/MetricCard";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { OVERVIEW, COMMON } from "@/content/hr";
import { OverviewCharts } from "./OverviewCharts";
import { LevelChip } from "@/components/hr/LevelChip";

export const dynamic = "force-dynamic";

export default async function HROverviewPage() {
  const user = await requireHRUser();
  const employees = await loadEmployees(user);
  const stats = await loadOverview(user, employees);

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={OVERVIEW.eyebrow}
        title={
          <>
            {OVERVIEW.headline.before}
            <em>{OVERVIEW.headline.em}</em>
            {OVERVIEW.headline.after}
          </>
        }
        sub={OVERVIEW.sub}
        actions={
          stats.isDemo && (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
              {COMMON.demoBadge}
            </span>
          )
        }
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          eyebrow={OVERVIEW.metrics.activeEmployees.eyebrow}
          value={stats.activeEmployees}
          caption={OVERVIEW.metrics.activeEmployees.caption}
        />
        <MetricCard
          eyebrow={OVERVIEW.metrics.examsLast30.eyebrow}
          value={stats.examsLast30}
          caption={OVERVIEW.metrics.examsLast30.caption}
        />
        <MetricCard
          eyebrow={OVERVIEW.metrics.inProgress.eyebrow}
          value={stats.inProgress}
          caption={OVERVIEW.metrics.inProgress.caption}
        />
        <MetricCard
          eyebrow={OVERVIEW.metrics.avgLevel.eyebrow}
          value={stats.avgLevel}
          caption={OVERVIEW.metrics.avgLevel.caption}
        />
      </div>

      <div className="mt-6">
        <OverviewCharts
          levelDistribution={stats.levelDistribution}
          byRole={stats.byRole}
          weeklyExams={stats.weeklyExams}
        />
      </div>

      <HairlineRule className="my-8" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-t-h2 font-medium text-espresso">
              {OVERVIEW.attention.title}
            </h2>
            <p className="caps">{OVERVIEW.attention.sub}</p>
          </div>
          <div className="space-y-2">
            <AttentionStat
              label={OVERVIEW.attention.inactiveLabel}
              value={stats.attention.inactive.length}
            />
            <AttentionStat
              label={OVERVIEW.attention.failedLabel}
              value={stats.attention.failed}
            />
            <AttentionStat
              label={OVERVIEW.attention.overdueCohortLabel}
              value={stats.attention.overdueCohorts}
            />
          </div>
          {stats.attention.inactive.length > 0 && (
            <div className="mt-4">
              <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
                {stats.attention.inactive.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/hr/employees/${e.id}`}
                        className="font-serif text-t-body font-medium text-espresso hover:text-ink"
                      >
                        {e.name}
                      </Link>
                      <p className="caps">
                        {e.last_active_days_ago > 99 ? "sin actividad" : `hace ${e.last_active_days_ago}d`}
                      </p>
                    </div>
                    <LevelChip level={e.current_level} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stats.attention.inactive.length === 0 && stats.attention.failed === 0 && stats.attention.overdueCohorts === 0 && (
            <p className="mt-4 font-sans text-t-body text-espresso-muted">
              {OVERVIEW.attention.none}
            </p>
          )}
        </div>

        <aside>
          <h2 className="mb-3 font-serif text-t-h2 font-medium text-espresso">
            {OVERVIEW.recentActivity.title}
          </h2>
          {stats.recentActivity.length === 0 ? (
            <p className="font-sans text-t-body text-espresso-muted">
              {OVERVIEW.recentActivity.none}
            </p>
          ) : (
            <ol className="divide-y divide-hair rounded-md border border-hair bg-white">
              {stats.recentActivity.slice(0, 8).map((e, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="rounded-pill bg-ivory-soft p-1.5 text-ink">
                    <Clock className="h-3 w-3" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-t-body text-espresso">
                      {e.employee_name}
                    </p>
                    <p className="caps">
                      {e.type === "exam_completed" ? "completó examen" : e.type === "exam_started" ? "inició examen" : "completó drill"}
                    </p>
                  </div>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                    {new Date(e.when_iso).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      <HairlineRule className="my-8" />

      <Link
        href="/hr/employees"
        className="inline-flex items-baseline gap-2 font-serif text-t-h3 font-medium text-ink hover:text-ink-deep"
      >
        Ver todo el equipo
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

function AttentionStat({ label, value }: { label: string; value: number }) {
  const tone = value === 0 ? "text-espresso-muted" : "text-warn";
  return (
    <div className="flex items-center justify-between rounded-md border border-hair bg-white px-4 py-3">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className={`h-3.5 w-3.5 ${tone}`} aria-hidden />
        <span className="font-sans text-t-body text-espresso">{label}</span>
      </div>
      <span className={`font-mono text-t-label ${tone}`}>{value}</span>
    </div>
  );
}
