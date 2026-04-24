"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
import { formatIndex } from "@/lib/utils";
import type { CEFRLevel } from "@/lib/supabase/types";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

export default function HRDashboardPage() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  useEffect(() => {
    setRows(loadEmployees());
    const poll = setInterval(() => setRows(loadEmployees()), 4000);
    return () => clearInterval(poll);
  }, []);

  const levels = useMemo(() => aggregateLevels(rows), [rows]);
  const roles = useMemo(() => aggregateRoles(rows), [rows]);
  const avg = useMemo(() => averageScore(rows), [rows]);
  const active = useMemo(() => activeThisWeek(rows), [rows]);

  const maxLevel = Math.max(...LEVELS.map((l) => levels[l]), 1);

  const topPerformers = [...rows]
    .sort((a, b) => b.combined_score - a.combined_score)
    .slice(0, 3);
  const needAttention = [...rows]
    .sort((a, b) => a.last_active_days_ago - b.last_active_days_ago)
    .reverse()
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-shell px-6 py-12 md:px-12 md:py-16">
      <div className="mb-12">
        <p className="caps mb-3">{formatIndex(1)} · Resumen</p>
        <h1 className="font-serif text-t-h1 font-medium text-espresso">
          Su equipo, <em>en números</em>.
        </h1>
      </div>

      {/* Top stats row */}
      <div className="grid gap-5 md:grid-cols-4">
        <Stat label="Empleados evaluados" value={rows.length} />
        <Stat label="Nivel promedio" value={`${avg}/100`} />
        <Stat label="Activos esta semana" value={`${active}/${rows.length}`} />
        <Stat
          label="Tasa de participación"
          value={`${rows.length > 0 ? Math.round((active / rows.length) * 100) : 0}%`}
        />
      </div>

      <HairlineRule className="my-12" />

      {/* Level distribution + role breakdown */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-16">
        <div>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-t-h2 font-medium">Distribución de niveles</h2>
            <span className="caps">CEFR adaptado a hotelería</span>
          </div>
          <div className="space-y-3">
            {LEVELS.map((level) => {
              const count = levels[level];
              const pct = rows.length > 0 ? Math.round((count / rows.length) * 100) : 0;
              const barPct = Math.round((count / maxLevel) * 100);
              return (
                <div key={level} className="flex items-center gap-4">
                  <div className="w-12">
                    <LevelBadge level={level} />
                  </div>
                  <div className="flex-1">
                    <div className="h-7 w-full rounded-xs bg-ivory-deep">
                      <div
                        className="flex h-7 items-center justify-end rounded-xs bg-ink px-2 font-mono text-[0.625rem] text-white transition-all duration-500 ease-editorial"
                        style={{ width: `${Math.max(barPct, 8)}%` }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right font-mono text-[0.75rem] text-espresso-muted">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>

          <HairlineRule className="my-10" />

          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-serif text-t-h3 font-medium">Por departamento</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((key) => (
              <div
                key={key}
                className="rounded-md border border-hair bg-white p-5"
              >
                <p className="caps mb-1">{ROLES[key].label_es}</p>
                <p className="font-serif text-t-h2 font-medium text-espresso">
                  {roles[key]}
                </p>
                <p className="caps mt-2">empleados evaluados</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — top performers + need attention */}
        <aside className="space-y-10">
          <div>
            <h3 className="mb-4 font-serif text-t-h3 font-medium">Destacan</h3>
            <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
              {topPerformers.map((e) => (
                <EmployeeMiniRow key={e.id} e={e} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-t-h3 font-medium">Necesitan atención</h3>
            <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
              {needAttention.map((e) => (
                <EmployeeMiniRow key={e.id} e={e} showInactivity />
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <HairlineRule className="my-12" />

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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-hair bg-white p-6">
      <p className="caps mb-2">{label}</p>
      <p className="font-serif text-[2.5rem] font-medium leading-none tracking-tight text-espresso">
        {value}
      </p>
    </div>
  );
}

function EmployeeMiniRow({
  e,
  showInactivity,
}: {
  e: EmployeeRow;
  showInactivity?: boolean;
}) {
  return (
    <li className="p-4">
      <Link
        href={`/hr/employees/${e.id}`}
        className="flex items-center justify-between gap-4 hover:text-ink"
      >
        <div className="min-w-0">
          <p className="truncate font-serif text-t-h3 font-medium">{e.name}</p>
          <p className="caps">{ROLES[e.hotel_role].label_es}</p>
        </div>
        <div className="flex items-center gap-3">
          {showInactivity ? (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-warn">
              {e.last_active_days_ago}d inactivo
            </span>
          ) : (
            <span className="font-mono text-[0.75rem] text-espresso">
              {e.combined_score}
            </span>
          )}
          <LevelBadge level={e.current_level} />
        </div>
      </Link>
    </li>
  );
}
