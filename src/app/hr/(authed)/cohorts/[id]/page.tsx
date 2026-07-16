import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireHRUser } from "@/lib/hr/auth";
import { loadCohort, loadEmployees } from "@/lib/hr/data";
import { computeCohortProgress } from "@/lib/hr/cohort-progress";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { LevelBadge } from "@/components/ui/Badge";
import { COHORTS } from "@/content/hr";
import { ROLES } from "@/content/roles";
import { CohortDetailClient } from "./CohortDetailClient";

export const dynamic = "force-dynamic";

export default async function CohortDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireHRUser();
  const cohort = await loadCohort(user, params.id);
  if (!cohort) notFound();

  // Demo cohorts have no real cohort_members rows to compute progress from —
  // computeCohortProgress soft-fails to an empty result, and the client
  // falls back to each member's existing completion_pct in that case.
  const [allEmployees, progress] = await Promise.all([
    loadEmployees(user),
    computeCohortProgress(cohort.id),
  ]);
  const memberIds = new Set(cohort.members.map((m) => m.employee_id));
  const candidates = allEmployees.filter((e) => !memberIds.has(e.id));

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <Link href="/hr/cohorts" className="mb-4 inline-flex items-center gap-2 caps hover:text-ink">
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Volver a cohortes
      </Link>

      <SectionHeader
        eyebrow={COHORTS.eyebrow}
        title={
          <span className="flex items-center gap-3">
            {cohort.name}
            <LevelBadge level={cohort.target_level} />
          </span>
        }
        sub={`${ROLES[cohort.module].label_es} · meta ${cohort.completion_target_pct}% completitud`}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Tile label="Miembros" value={cohort.member_count} />
        <Tile
          label="Avance promedio"
          value={`${progress.members.length ? progress.avg_completion_pct : cohort.avg_completion_pct}%`}
        />
        <Tile label="Inicio" value={cohort.start_date ?? "—"} />
        <Tile label="Cierre" value={cohort.end_date ?? "—"} />
      </div>

      <HairlineRule className="my-8" />

      <CohortDetailClient cohort={cohort} candidates={candidates} progress={progress} />
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-hair bg-white p-4">
      <p className="caps mb-2">{label}</p>
      <p className="font-serif text-[1.5rem] font-medium leading-none text-espresso">
        {value}
      </p>
    </div>
  );
}
