"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, ChevronRight } from "lucide-react";
import { ROLES } from "@/content/roles";
import { findEmployee, type EmployeeRow } from "@/lib/hr-data";
import { LevelBadge } from "@/components/ui/Badge";
import { HairlineRule } from "@/components/ui/HairlineRule";
import {
  LEVEL_LABEL_ES,
  LEVEL_DESCRIPTION_ES,
  scoreToLevel,
} from "@/lib/cefr";
import { formatIndex } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/**
 * Individual employee detail page.
 *
 * The "Exportar PDF" button triggers the browser's native print dialog,
 * which the user saves as PDF. A print stylesheet (in globals via media
 * query) removes nav and optimizes for letter-size output.
 */
export default function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [employee, setEmployee] = useState<EmployeeRow | undefined>();
  const router = useRouter();

  useEffect(() => {
    const e = findEmployee(params.id);
    if (!e) {
      router.push("/hr/employees");
      return;
    }
    setEmployee(e);
  }, [params.id, router]);

  if (!employee) return null;

  const role = ROLES[employee.hotel_role];
  const suggestedLevel = scoreToLevel(employee.combined_score);
  const print = () => window.print();

  return (
    <section className="mx-auto max-w-shell px-6 py-12 md:px-12 md:py-16">
      <nav className="mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/hr/employees"
          className="inline-flex items-center gap-2 caps hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Volver a la lista
        </Link>
        <Button variant="ghost" onClick={print}>
          <Printer className="h-4 w-4" aria-hidden />
          Exportar como PDF
        </Button>
      </nav>

      <article className="space-y-12 print:space-y-8">
        {/* ── Print cover ──────────────────── */}
        <header className="hidden print:block">
          <p className="caps">Reporte de Evaluación · Inglés Hotelero</p>
          <p className="mt-4 font-serif text-[2.5rem] font-medium">{employee.name}</p>
          <p className="mt-1 caps">{role.label_es} · Turno {shiftLabel(employee.shift)}</p>
          <p className="mt-6 caps">
            Completado: {new Date(employee.completed_at).toLocaleDateString("es-MX")}
          </p>
          <HairlineRule className="mt-6" />
        </header>

        {/* ── Hero: name + level ───────────── */}
        <header className="print:hidden">
          <p className="caps mb-3">
            {formatIndex(3)} · Empleado · {role.label_es} · Turno{" "}
            {shiftLabel(employee.shift)}
          </p>
          <h1 className="font-serif text-t-h1 font-medium text-espresso">
            {employee.name}
          </h1>
        </header>

        {/* Big level card */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
          <div className="rounded-md border border-hair bg-white p-8">
            <p className="caps mb-4">Nivel actual</p>
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-[clamp(4rem,12vw,6rem)] font-medium leading-none tracking-tight text-espresso">
                {employee.current_level}
              </span>
              <LevelBadge level={employee.current_level} />
            </div>
            <p className="mt-3 font-serif text-t-h3 font-medium">
              {LEVEL_LABEL_ES[employee.current_level]}
            </p>
            <p className="mt-2 font-sans text-t-body text-espresso-soft">
              {LEVEL_DESCRIPTION_ES[employee.current_level]}
            </p>
            {suggestedLevel !== employee.current_level && (
              <p className="mt-4 caps text-warn">
                Fronterizo con {suggestedLevel} — candidato a re-evaluación en 30 días
              </p>
            )}
          </div>

          <dl className="rounded-md border border-hair bg-white divide-y divide-hair">
            <ScoreRow
              label="Puntaje combinado"
              value={`${employee.combined_score} / 100`}
              note="60% habla + 40% escucha"
              strong
            />
            <ScoreRow label="Comprensión auditiva" value={`${employee.listening_score} / 100`} />
            <ScoreRow label="Expresión oral" value={`${employee.speaking_score} / 100`} />
            <ScoreRow
              label="Racha de práctica"
              value={
                employee.streak > 0
                  ? `${employee.streak} días consecutivos`
                  : "Sin racha activa"
              }
            />
            <ScoreRow
              label="Completitud"
              value={`${employee.practice_completion_pct}%`}
            />
            <ScoreRow
              label="Última actividad"
              value={
                employee.last_active_days_ago === 0
                  ? "hoy"
                  : `hace ${employee.last_active_days_ago} días`
              }
            />
          </dl>
        </div>

        {/* Strengths + opportunities */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <section>
            <p className="caps mb-3">{formatIndex(4)} · Fortalezas</p>
            <ul className="space-y-3">
              {employee.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-hair bg-white p-4"
                >
                  <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-success" aria-hidden />
                  <span className="font-sans text-t-body text-espresso">{s}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <p className="caps mb-3">{formatIndex(5)} · Áreas a desarrollar</p>
            <ul className="space-y-3">
              {employee.areas_to_improve.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-hair bg-white p-4"
                >
                  <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-ink" aria-hidden />
                  <span className="font-sans text-t-body text-espresso">{s}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Transcripts */}
        {employee.transcripts.length > 0 && (
          <section>
            <p className="caps mb-3">
              {formatIndex(6)} · Respuestas habladas evaluadas por IA
            </p>
            <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
              {employee.transcripts.map((t, i) => (
                <li key={i} className="p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="caps">
                        Escenario {formatIndex(t.prompt_index + 1)} · {t.level}
                      </span>
                      <p className="mt-1 font-sans text-t-body text-espresso">
                        {t.scenario_es}
                      </p>
                    </div>
                    <span className="font-mono text-[0.8125rem] text-espresso">
                      {t.ai_score_total} / 100
                    </span>
                  </div>
                  <p className="mt-3 rounded-sm bg-ivory-soft p-3 font-mono text-[0.75rem] text-espresso-soft">
                    Transcripción: &ldquo;{t.transcript_en}&rdquo;
                  </p>
                  <p className="mt-3 font-sans text-t-body text-ink">
                    <em>Retroalimentación:</em> {t.ai_feedback_es}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Recommendation */}
        <section className="rounded-md border border-hair bg-ivory-soft p-6 md:p-8">
          <p className="caps mb-3">{formatIndex(7)} · Recomendación</p>
          <h2 className="font-serif text-t-h2 font-medium text-espresso">
            {recommendationTitle(employee)}
          </h2>
          <p className="mt-3 font-sans text-t-body text-espresso-soft">
            {recommendationBody(employee, role.label_es)}
          </p>
        </section>

        {/* Print footer */}
        <footer className="hidden print:block">
          <HairlineRule className="mb-6" />
          <p className="caps">
            Reporte generado automáticamente por Inglés Hotelero · {new Date().toLocaleDateString("es-MX")}
          </p>
        </footer>
      </article>
    </section>
  );
}

function ScoreRow({
  label,
  value,
  note,
  strong,
}: {
  label: string;
  value: string;
  note?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between px-5 py-4">
      <div>
        <dt className="font-sans text-t-body text-espresso-muted">{label}</dt>
        {note && <p className="caps">{note}</p>}
      </div>
      <dd
        className={
          strong
            ? "font-serif text-t-h2 font-medium text-espresso"
            : "font-mono text-t-body-lg text-espresso"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function shiftLabel(s: "morning" | "afternoon" | "night"): string {
  return s === "morning" ? "Matutino" : s === "afternoon" ? "Vespertino" : "Nocturno";
}

function recommendationTitle(e: EmployeeRow): string {
  if (e.current_level === "B2") return "Listo para mentoría interna";
  if (e.current_level === "B1") return "Candidato al módulo B2 (3 meses)";
  if (e.current_level === "A2") return "Candidato al módulo B1 (3 meses)";
  return "Prioridad alta · Módulo A2 completo";
}

function recommendationBody(e: EmployeeRow, roleLabel: string): string {
  if (e.current_level === "B2")
    return `${e.name.split(" ")[0]} puede mentorar a colegas del mismo puesto (${roleLabel}) y eventualmente liderar la certificación "Propiedad Bilingüe" de su hotel.`;
  if (e.current_level === "B1")
    return `Un módulo de 3 meses enfocado en escenarios complejos (quejas, negociación, huéspedes VIP) elevaría a ${e.name.split(" ")[0]} a nivel B2 con alta probabilidad.`;
  if (e.current_level === "A2")
    return `Módulo ${roleLabel} de 3 meses cubriendo vocabulario específico + práctica diaria de 5 min vía WhatsApp. Meta: B1 al cierre del trimestre.`;
  return `Prioridad alta. ${e.name.split(" ")[0]} necesita el módulo completo ${roleLabel} desde cero para alcanzar comunicación funcional (A2) antes de poder atender huéspedes internacionales sin supervisión.`;
}
