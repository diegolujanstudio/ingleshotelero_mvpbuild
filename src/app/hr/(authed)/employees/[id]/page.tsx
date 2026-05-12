import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireHRUser } from "@/lib/hr/auth";
import { loadEmployee, loadEmployeeTranscripts } from "@/lib/hr/data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { LevelChip } from "@/components/hr/LevelChip";
import { EmployeeStatusChip } from "@/components/hr/EmployeeStatusChip";
import { ActivityTimeline, type TimelineEvent } from "@/components/hr/ActivityTimeline";
import { RecommendationsCard } from "@/components/hr/RecommendationsCard";
import { EmployeeDetailClient } from "./EmployeeDetailClient";
import { EMPLOYEE_DETAIL, EMPLOYEES } from "@/content/hr";
import { ROLES } from "@/content/roles";
import { LEVEL_LABEL_ES } from "@/lib/cefr";

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireHRUser();
  const employee = await loadEmployee(user, params.id);
  if (!employee) notFound();

  const transcripts = await loadEmployeeTranscripts(user, params.id);

  const timeline: TimelineEvent[] = [];
  if (employee.exam_completed_at) {
    timeline.push({
      type: "exam_completed",
      when_iso: employee.exam_completed_at,
    });
  }
  timeline.push({
    type: "level_updated",
    when_iso: employee.updated_at,
    detail: employee.current_level ?? "—",
  });

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <Link
        href="/hr/employees"
        className="mb-4 inline-flex items-center gap-2 caps hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        {EMPLOYEE_DETAIL.back}
      </Link>

      <SectionHeader
        eyebrow={EMPLOYEE_DETAIL.eyebrow}
        title={
          <span className="flex items-center gap-3">
            {employee.name}
            <LevelChip level={employee.current_level} />
            <EmployeeStatusChip status={employee.status} />
          </span>
        }
        sub={`${ROLES[employee.hotel_role].label_es} · ${employee.department ?? "—"}`}
        actions={
          <EmployeeDetailClient employee={employee} />
        }
      />

      {/* Contact info */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <ContactCard employee={employee} />
        <ScoreCard employee={employee} />
      </div>

      <HairlineRule className="my-8" />

      {/* Practice */}
      <SectionTitle index="02" title={EMPLOYEE_DETAIL.sections.practice} />
      <div className="grid gap-3 md:grid-cols-4">
        <Tile label={EMPLOYEE_DETAIL.practice.streak} value={employee.streak > 0 ? `${employee.streak}d` : "—"} />
        <Tile label={EMPLOYEE_DETAIL.practice.completion} value={`${employee.practice_completion_pct}%`} />
        <Tile
          label={EMPLOYEE_DETAIL.practice.drills30}
          value={Math.min(30, Math.round(employee.practice_completion_pct * 0.3))}
        />
        <Tile
          label="Última actividad"
          value={
            employee.last_active_days_ago === 0
              ? "hoy"
              : employee.last_active_days_ago > 99
                ? "—"
                : `hace ${employee.last_active_days_ago}d`
          }
        />
      </div>

      <HairlineRule className="my-8" />

      {/* Transcripts */}
      {transcripts.length > 0 && (
        <>
          <SectionTitle index="03" title={EMPLOYEE_DETAIL.exam.transcripts} />
          <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
            {transcripts.map((t, i) => (
              <li key={i} className="px-5 py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="caps">
                      {t.scenario_es} · {t.level}
                    </p>
                    {t.transcript && (
                      <p className="mt-2 rounded-sm bg-ivory-soft p-3 font-mono text-[0.75rem] text-espresso-soft">
                        &ldquo;{t.transcript}&rdquo;
                      </p>
                    )}
                  </div>
                  {t.score_total !== null && (
                    <span className="font-mono text-[0.8125rem] text-espresso">
                      {t.score_total}/100
                    </span>
                  )}
                </div>
                {t.feedback_es && (
                  <p className="mt-3 font-sans text-t-body text-ink">
                    <em>Retroalimentación:</em> {t.feedback_es}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <HairlineRule className="my-8" />
        </>
      )}

      {/* Recommendations */}
      <SectionTitle index="04" title={EMPLOYEE_DETAIL.sections.recommendations} />
      <RecommendationsCard
        current_level={employee.current_level}
        hotel_role={employee.hotel_role}
        combined_score={employee.combined_score}
        streak={employee.streak}
        practice_completion_pct={employee.practice_completion_pct}
        name={employee.name}
      />

      <HairlineRule className="my-8" />

      {/* Timeline */}
      <SectionTitle index="05" title={EMPLOYEE_DETAIL.sections.timeline} />
      <ActivityTimeline events={timeline} />
    </section>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="font-serif text-t-h2 font-medium text-espresso">{title}</h2>
      <p className="caps">Sección {index}</p>
    </div>
  );
}

function ContactCard({
  employee,
}: {
  employee: Awaited<ReturnType<typeof loadEmployee>>;
}) {
  if (!employee) return null;
  return (
    <div className="rounded-md border border-hair bg-white">
      <div className="border-b border-hair bg-ivory-soft px-5 py-2.5">
        <p className="caps">{EMPLOYEE_DETAIL.sections.contact}</p>
      </div>
      <dl className="divide-y divide-hair">
        <Row label={EMPLOYEE_DETAIL.contact.email} value={employee.email ?? EMPLOYEE_DETAIL.contact.none} />
        <Row label={EMPLOYEE_DETAIL.contact.phone} value={employee.phone ?? EMPLOYEE_DETAIL.contact.none} />
        <Row label={EMPLOYEE_DETAIL.contact.department} value={employee.department ?? EMPLOYEE_DETAIL.contact.none} />
        <Row
          label={EMPLOYEE_DETAIL.contact.shift}
          value={employee.shift ? EMPLOYEES.shift[employee.shift] : EMPLOYEE_DETAIL.contact.none}
        />
        <Row
          label={EMPLOYEE_DETAIL.contact.source}
          value={EMPLOYEES.source[employee.source]}
        />
        <Row
          label={EMPLOYEE_DETAIL.contact.createdAt}
          value={new Date(employee.created_at).toLocaleDateString("es-MX")}
        />
      </dl>
    </div>
  );
}

function ScoreCard({
  employee,
}: {
  employee: Awaited<ReturnType<typeof loadEmployee>>;
}) {
  if (!employee) return null;
  if (!employee.exam_completed_at) {
    return (
      <div className="rounded-md border border-hair bg-white p-5">
        <p className="caps mb-2">{EMPLOYEE_DETAIL.sections.exam}</p>
        <p className="font-sans text-t-body text-espresso-muted">
          {EMPLOYEE_DETAIL.exam.none}
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-hair bg-white">
      <div className="border-b border-hair bg-ivory-soft px-5 py-2.5">
        <p className="caps">
          {EMPLOYEE_DETAIL.sections.exam} · {EMPLOYEE_DETAIL.exam.rubric}
        </p>
      </div>
      <dl className="divide-y divide-hair">
        <Row label={EMPLOYEE_DETAIL.exam.combined} value={`${employee.combined_score}/100`} strong />
        <Row label={EMPLOYEE_DETAIL.exam.listening} value={`${employee.listening_score}/100`} />
        <Row label={EMPLOYEE_DETAIL.exam.speaking} value={`${employee.speaking_score}/100`} />
        <Row
          label={EMPLOYEE_DETAIL.exam.completedAt}
          value={new Date(employee.exam_completed_at).toLocaleDateString("es-MX")}
        />
        {employee.current_level && (
          <Row label="Nivel CEFR" value={`${employee.current_level} · ${LEVEL_LABEL_ES[employee.current_level]}`} />
        )}
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string | number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-5 py-3">
      <dt className="font-sans text-t-body text-espresso-muted">{label}</dt>
      <dd
        className={
          strong
            ? "font-serif text-t-h3 font-medium text-espresso"
            : "font-mono text-t-label text-espresso"
        }
      >
        {value}
      </dd>
    </div>
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
