"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { ROLES } from "@/content/roles";
import { loadEmployees, type EmployeeRow } from "@/lib/hr-data";
import { LevelBadge } from "@/components/ui/Badge";
import { formatIndex, cn } from "@/lib/utils";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

type SortKey = "name" | "combined_score" | "last_active" | "level";
type RoleFilter = "all" | RoleModule;
type LevelFilter = "all" | CEFRLevel;

export default function EmployeesPage() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("combined_score");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    setRows(loadEmployees());
  }, []);

  const filtered = useMemo(() => {
    let r = [...rows];
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((e) => e.name.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") r = r.filter((e) => e.hotel_role === roleFilter);
    if (levelFilter !== "all") r = r.filter((e) => e.current_level === levelFilter);
    r.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "combined_score") cmp = a.combined_score - b.combined_score;
      else if (sortKey === "last_active")
        cmp = a.last_active_days_ago - b.last_active_days_ago;
      else if (sortKey === "level") cmp = a.current_level.localeCompare(b.current_level);
      return sortDesc ? -cmp : cmp;
    });
    return r;
  }, [rows, query, roleFilter, levelFilter, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <section className="mx-auto max-w-shell px-6 py-12 md:px-12 md:py-16">
      <div className="mb-10 flex items-baseline justify-between">
        <div>
          <p className="caps mb-3">{formatIndex(2)} · Empleados</p>
          <h1 className="font-serif text-t-h1 font-medium text-espresso">
            Su equipo, <em>uno por uno</em>.
          </h1>
        </div>
        <span className="caps">{filtered.length} de {rows.length}</span>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre…"
            className="h-10 w-full rounded-md border border-hair bg-white pl-10 pr-4 font-sans text-t-body text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-body"
        >
          <option value="all">Todos los puestos</option>
          <option value="bellboy">Botones</option>
          <option value="frontdesk">Recepción</option>
          <option value="restaurant">Restaurante</option>
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
          className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-body"
        >
          <option value="all">Todos los niveles</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-hair bg-white">
        <table className="w-full font-sans text-t-body">
          <thead className="border-b border-hair bg-ivory-soft">
            <tr>
              <Th onClick={() => toggleSort("name")} active={sortKey === "name"} desc={sortDesc}>
                Nombre
              </Th>
              <Th>Puesto</Th>
              <Th onClick={() => toggleSort("level")} active={sortKey === "level"} desc={sortDesc}>
                Nivel
              </Th>
              <Th
                onClick={() => toggleSort("combined_score")}
                active={sortKey === "combined_score"}
                desc={sortDesc}
              >
                Puntaje
              </Th>
              <Th>Escucha</Th>
              <Th>Habla</Th>
              <Th onClick={() => toggleSort("last_active")} active={sortKey === "last_active"} desc={sortDesc}>
                Últ. actividad
              </Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                className={cn(
                  "border-b border-hair last:border-none hover:bg-ivory-soft",
                  e.is_live && "bg-ink-tint/40",
                )}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/hr/employees/${e.id}`}
                    className="font-serif text-t-h3 font-medium text-espresso hover:text-ink"
                  >
                    {e.name}
                  </Link>
                  {e.is_live && (
                    <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink">
                      · en vivo
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 caps">{ROLES[e.hotel_role].label_es}</td>
                <td className="px-4 py-3">
                  <LevelBadge level={e.current_level} />
                </td>
                <td className="px-4 py-3 font-mono text-[0.8125rem]">
                  {e.combined_score}/100
                </td>
                <td className="px-4 py-3 font-mono text-[0.8125rem] text-espresso-muted">
                  {e.listening_score}
                </td>
                <td className="px-4 py-3 font-mono text-[0.8125rem] text-espresso-muted">
                  {e.speaking_score}
                </td>
                <td className="px-4 py-3 caps">
                  {e.last_active_days_ago === 0
                    ? "hoy"
                    : `hace ${e.last_active_days_ago}d`}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/hr/employees/${e.id}`}
                    aria-label="Ver detalle"
                    className="text-espresso-muted hover:text-ink"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center caps">
                  Ningún empleado coincide con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  children,
  onClick,
  active,
  desc,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  desc?: boolean;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left caps",
        onClick && "cursor-pointer hover:text-ink",
        active && "text-ink",
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-1">
        {children}
        {active ? <span aria-hidden>{desc ? "↓" : "↑"}</span> : null}
      </span>
    </th>
  );
}
