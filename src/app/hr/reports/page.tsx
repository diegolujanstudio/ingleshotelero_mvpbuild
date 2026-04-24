"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, FileSpreadsheet, ArrowRight } from "lucide-react";
import { ROLES } from "@/content/roles";
import {
  loadEmployees,
  aggregateLevels,
  aggregateRoles,
  averageScore,
  activeThisWeek,
  type EmployeeRow,
} from "@/lib/hr-data";
import { LevelBadge } from "@/components/ui/Badge";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { Button } from "@/components/ui/Button";
import { formatIndex } from "@/lib/utils";
import type { CEFRLevel } from "@/lib/supabase/types";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

/**
 * Executive-style property report. "Export as PDF" prints the page using
 * the browser's native dialog. "Export as CSV" produces a download for
 * HR's spreadsheet tools.
 */
export default function ReportsPage() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  useEffect(() => setRows(loadEmployees()), []);

  const levels = aggregateLevels(rows);
  const roles = aggregateRoles(rows);
  const avg = averageScore(rows);
  const active = activeThisWeek(rows);

  const exportCsv = () => {
    const header = [
      "Nombre",
      "Puesto",
      "Nivel",
      "Puntaje combinado",
      "Escucha",
      "Habla",
      "Turno",
      "Últ. actividad (días)",
      "Racha",
      "Completitud %",
      "Completado",
    ].join(",");
    const body = rows
      .map((r) =>
        [
          JSON.stringify(r.name),
          ROLES[r.hotel_role].label_es,
          r.current_level,
          r.combined_score,
          r.listening_score,
          r.speaking_score,
          r.shift,
          r.last_active_days_ago,
          r.streak,
          r.practice_completion_pct,
          new Date(r.completed_at).toISOString().slice(0, 10),
        ].join(","),
      )
      .join("\n");
    const csv = `${header}\n${body}`;
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ingles-hotelero-reporte-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-shell px-6 py-12 md:px-12 md:py-16">
      <nav className="mb-8 flex items-center justify-between print:hidden">
        <div>
          <p className="caps mb-3">{formatIndex(4)} · Reporte ejecutivo</p>
          <h1 className="font-serif text-t-h1 font-medium text-espresso">
            Reporte de <em>evaluación</em>.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={exportCsv}>
            <FileSpreadsheet className="h-4 w-4" aria-hidden />
            Exportar Excel
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden />
            Exportar PDF
          </Button>
        </div>
      </nav>

      {/* ── Print cover ─────────────────────────── */}
      <header className="mb-10 hidden print:block">
        <p className="caps">Reporte Ejecutivo · Inglés Hotelero</p>
        <p className="mt-4 font-serif text-[2.5rem] font-medium">
          Evaluación de Inglés Hotelero
        </p>
        <p className="mt-2 caps">
          Generado: {new Date().toLocaleDateString("es-MX")}
        </p>
        <HairlineRule className="mt-6" />
      </header>

      {/* ── Executive summary ──────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 font-serif text-t-h2 font-medium">Resumen ejecutivo</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Total evaluados" value={rows.length} />
          <Stat label="Puntaje promedio" value={`${avg}/100`} />
          <Stat label="Activos esta semana" value={`${active}`} />
          <Stat
            label="Tasa participación"
            value={`${rows.length > 0 ? Math.round((active / rows.length) * 100) : 0}%`}
          />
        </div>
      </section>

      {/* ── Key finding ─────────────────────────── */}
      <section className="mb-12 rounded-md border border-hair bg-ivory-soft p-6 md:p-8">
        <p className="caps mb-3">Hallazgo principal</p>
        <h3 className="font-serif text-t-h2 font-medium text-espresso">
          {keyFinding(rows, levels)}
        </h3>
        <p className="mt-4 font-sans text-t-body-lg text-espresso-soft">
          {keyRecommendation(rows, levels)}
        </p>
      </section>

      {/* ── Distribution ────────────────────────── */}
      <section className="mb-12">
        <h2 className="mb-6 font-serif text-t-h2 font-medium">Distribución de niveles</h2>
        <div className="grid gap-3">
          {LEVELS.map((level) => {
            const count = levels[level];
            const pct = rows.length > 0 ? Math.round((count / rows.length) * 100) : 0;
            return (
              <div key={level} className="flex items-center gap-4">
                <div className="w-12">
                  <LevelBadge level={level} />
                </div>
                <div className="flex-1">
                  <div className="h-7 rounded-xs bg-ivory-deep">
                    <div
                      className="flex h-7 items-center justify-end rounded-xs bg-ink px-2 font-mono text-[0.625rem] text-white"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    >
                      {count} ({pct}%)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <HairlineRule className="my-10" />

      {/* ── Department breakdown ───────────────── */}
      <section className="mb-12">
        <h2 className="mb-6 font-serif text-t-h2 font-medium">Por departamento</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((key) => {
            const dept = rows.filter((r) => r.hotel_role === key);
            const deptAvg =
              dept.length > 0
                ? Math.round(dept.reduce((s, r) => s + r.combined_score, 0) / dept.length)
                : 0;
            return (
              <article key={key} className="rounded-md border border-hair bg-white p-5">
                <p className="caps mb-1">{ROLES[key].label_es}</p>
                <p className="font-serif text-[2rem] font-medium">{dept.length}</p>
                <p className="caps">empleados</p>
                <HairlineRule className="my-3" />
                <p className="font-mono text-[0.75rem] text-espresso-muted">
                  Promedio: {deptAvg}/100
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <HairlineRule className="my-10" />

      {/* ── Full employee table ─────────────────── */}
      <section>
        <h2 className="mb-6 font-serif text-t-h2 font-medium">Todos los empleados</h2>
        <table className="w-full font-sans text-t-body">
          <thead>
            <tr className="border-b border-hair">
              <th className="px-2 py-2 text-left caps">Nombre</th>
              <th className="px-2 py-2 text-left caps">Puesto</th>
              <th className="px-2 py-2 text-left caps">Nivel</th>
              <th className="px-2 py-2 text-right caps">Puntaje</th>
              <th className="px-2 py-2 text-right caps">Escucha</th>
              <th className="px-2 py-2 text-right caps">Habla</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-hair last:border-none">
                <td className="px-2 py-2 font-serif font-medium">{e.name}</td>
                <td className="px-2 py-2 caps">{ROLES[e.hotel_role].label_es}</td>
                <td className="px-2 py-2">{e.current_level}</td>
                <td className="px-2 py-2 text-right font-mono">{e.combined_score}</td>
                <td className="px-2 py-2 text-right font-mono text-espresso-muted">
                  {e.listening_score}
                </td>
                <td className="px-2 py-2 text-right font-mono text-espresso-muted">
                  {e.speaking_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Methodology — print only */}
      <footer className="mt-16 hidden print:block">
        <HairlineRule className="mb-6" />
        <h3 className="font-serif text-t-h3 font-medium">Metodología</h3>
        <p className="mt-3 font-sans text-t-body text-espresso-soft">
          La evaluación consta de un examen de comprensión auditiva (10 ítems)
          y expresión oral (6 escenarios). El puntaje combinado se calcula
          como 60% habla + 40% escucha. La escala CEFR es adaptada a
          hotelería: A1 Supervivencia · A2 Funcional · B1 Profesional · B2
          Avanzado.
        </p>
        <p className="mt-3 caps">
          Contacto: hola@ingleshotelero.com · Diego Luján · Fundador
        </p>
      </footer>

      <div className="mt-12 print:hidden">
        <Link
          href="/hr/employees"
          className="inline-flex items-baseline gap-2 font-serif text-t-h3 font-medium text-ink hover:text-ink-deep"
        >
          Ir a la lista de empleados
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-hair bg-white p-5">
      <p className="caps mb-2">{label}</p>
      <p className="font-serif text-[2rem] font-medium leading-none text-espresso">
        {value}
      </p>
    </div>
  );
}

function keyFinding(
  rows: EmployeeRow[],
  levels: Record<CEFRLevel, number>,
): string {
  const total = rows.length;
  if (total === 0) return "Aún no hay evaluaciones registradas.";
  const a1a2 = levels.A1 + levels.A2;
  const pct = Math.round((a1a2 / total) * 100);
  if (pct >= 50) {
    return `El ${pct}% de su equipo está en A1 o A2, lo que limita el manejo de interacciones complejas con huéspedes internacionales.`;
  }
  const b1b2 = levels.B1 + levels.B2;
  const pctHigh = Math.round((b1b2 / total) * 100);
  return `El ${pctHigh}% de su equipo está en B1 o B2 — una base sólida sobre la cual consolidar la certificación "Propiedad Bilingüe".`;
}

function keyRecommendation(
  rows: EmployeeRow[],
  levels: Record<CEFRLevel, number>,
): string {
  if (rows.length === 0) return "";
  const total = rows.length;
  const a1a2 = levels.A1 + levels.A2;
  if (a1a2 / total >= 0.5) {
    return `Un programa de 3 meses por departamento elevaría al 70-80% del equipo a B1 o superior, con práctica diaria de 5 minutos por WhatsApp.`;
  }
  return `Recomendamos consolidar al equipo en B2 con módulos avanzados y preparar candidatos a mentores internos.`;
}
