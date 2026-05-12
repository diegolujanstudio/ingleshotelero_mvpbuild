"use client";

import * as React from "react";
import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { MetricCard } from "@/components/masteros/MetricCard";
import { LevelChip } from "@/components/hr/LevelChip";
import { REPORTS } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import type { HRCohortView, HREmployeeView } from "@/lib/hr/demo-bridge";

interface Props {
  employees: HREmployeeView[];
  cohorts: HRCohortView[];
  propertyName: string;
}

type RoleFilter = "all" | RoleModule;
type LevelFilter = "all" | CEFRLevel;

export function ReportsClient({ employees, cohorts, propertyName }: Props) {
  const [cohortF, setCohortF] = React.useState<string>("all");
  const [roleF, setRoleF] = React.useState<RoleFilter>("all");
  const [levelF, setLevelF] = React.useState<LevelFilter>("all");
  const [from, setFrom] = React.useState<string>("");
  const [to, setTo] = React.useState<string>("");
  const [busy, setBusy] = React.useState<"pdf" | "excel" | "csv" | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return employees.filter((e) => {
      if (roleF !== "all" && e.hotel_role !== roleF) return false;
      if (levelF !== "all" && e.current_level !== levelF) return false;
      if (from && e.exam_completed_at && e.exam_completed_at.slice(0, 10) < from) return false;
      if (to && e.exam_completed_at && e.exam_completed_at.slice(0, 10) > to) return false;
      return true;
    });
  }, [employees, roleF, levelF, from, to]);

  const total = filtered.length;
  const avg = total ? Math.round(filtered.reduce((s, e) => s + e.combined_score, 0) / total) : 0;
  const active = filtered.filter((e) => e.last_active_days_ago <= 7).length;
  const participation = total > 0 ? Math.round((active / total) * 100) : 0;

  const filtersBody = {
    cohort: cohortF === "all" ? undefined : cohortF,
    role: roleF,
    level: levelF,
    from: from || undefined,
    to: to || undefined,
  };

  async function generatePdf() {
    setBusy("pdf");
    setToast(null);
    try {
      const res = await fetch("/api/hr/reports/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filters: filtersBody, employeeIds: filtered.map((e) => e.id) }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setToast(REPORTS.toast.pdfReady);
    } catch {
      setToast(REPORTS.toast.error);
    } finally {
      setBusy(null);
    }
  }

  function generateCsv() {
    setBusy("csv");
    setToast(null);
    try {
      const header = [
        "Nombre",
        "Email",
        "Puesto",
        "Nivel",
        "Departamento",
        "Turno",
        "Estado",
        "Puntaje combinado",
        "Escucha",
        "Habla",
        "Racha",
        "Completitud %",
        "Examen completado",
      ].join(",");
      const lines = filtered.map((e) =>
        [
          JSON.stringify(e.name),
          JSON.stringify(e.email ?? ""),
          ROLES[e.hotel_role].label_es,
          e.current_level ?? "",
          JSON.stringify(e.department ?? ""),
          e.shift ?? "",
          e.is_active ? "Activo" : "Inactivo",
          e.combined_score,
          e.listening_score,
          e.speaking_score,
          e.streak,
          e.practice_completion_pct,
          e.exam_completed_at ? e.exam_completed_at.slice(0, 10) : "",
        ].join(","),
      );
      const csv = `${header}\n${lines.join("\n")}`;
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setToast(REPORTS.toast.csvReady);
    } catch {
      setToast(REPORTS.toast.error);
    } finally {
      setBusy(null);
    }
  }

  async function generateExcel() {
    setBusy("excel");
    setToast(null);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const empSheet = XLSX.utils.json_to_sheet(
        filtered.map((e) => ({
          Nombre: e.name,
          Email: e.email ?? "",
          Puesto: ROLES[e.hotel_role].label_es,
          Departamento: e.department ?? "",
          Turno: e.shift ?? "",
          Nivel: e.current_level ?? "",
          Estado: e.is_active ? "Activo" : "Inactivo",
          "Puntaje combinado": e.combined_score,
          Escucha: e.listening_score,
          Habla: e.speaking_score,
          Racha: e.streak,
          "Completitud %": e.practice_completion_pct,
          "Últ. actividad (días)": e.last_active_days_ago,
        })),
      );
      XLSX.utils.book_append_sheet(wb, empSheet, "Empleados");

      const evalSheet = XLSX.utils.json_to_sheet(
        filtered
          .filter((e) => e.exam_completed_at)
          .map((e) => ({
            Nombre: e.name,
            "Puntaje combinado": e.combined_score,
            Escucha: e.listening_score,
            Habla: e.speaking_score,
            Nivel: e.current_level ?? "",
            "Completado el": e.exam_completed_at ?? "",
          })),
      );
      XLSX.utils.book_append_sheet(wb, evalSheet, "Evaluaciones");

      const cohortSheet = XLSX.utils.json_to_sheet(
        cohorts.map((c) => ({
          Nombre: c.name,
          Módulo: ROLES[c.module].label_es,
          "Nivel meta": c.target_level,
          Miembros: c.member_count,
          "Avance %": c.avg_completion_pct,
          Inicio: c.start_date ?? "",
          Cierre: c.end_date ?? "",
          Estado: c.status,
        })),
      );
      XLSX.utils.book_append_sheet(wb, cohortSheet, "Cohortes");

      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setToast(REPORTS.toast.excelReady);
    } catch {
      setToast(REPORTS.toast.error);
    } finally {
      setBusy(null);
    }
  }

  function reset() {
    setCohortF("all");
    setRoleF("all");
    setLevelF("all");
    setFrom("");
    setTo("");
  }

  return (
    <div>
      {/* Filters */}
      <div className="rounded-md border border-hair bg-white p-5">
        <p className="caps mb-3">Filtros</p>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          <Field label={REPORTS.filters.cohort}>
            <select
              value={cohortF}
              onChange={(e) => setCohortF(e.target.value)}
              className="h-10 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-label text-espresso focus:border-ink focus:outline-none"
            >
              <option value="all">{REPORTS.filters.all}</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={REPORTS.filters.role}>
            <select
              value={roleF}
              onChange={(e) => setRoleF(e.target.value as RoleFilter)}
              className="h-10 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-label text-espresso focus:border-ink focus:outline-none"
            >
              <option value="all">{REPORTS.filters.all}</option>
              {(Object.keys(ROLES) as RoleModule[]).map((r) => (
                <option key={r} value={r}>
                  {ROLES[r].label_es}
                </option>
              ))}
            </select>
          </Field>
          <Field label={REPORTS.filters.level}>
            <select
              value={levelF}
              onChange={(e) => setLevelF(e.target.value as LevelFilter)}
              className="h-10 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-label text-espresso focus:border-ink focus:outline-none"
            >
              <option value="all">{REPORTS.filters.all}</option>
              {(["A1", "A2", "B1", "B2"] as CEFRLevel[]).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Input label={REPORTS.filters.from} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label={REPORTS.filters.to} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={reset}>
            {REPORTS.filters.reset}
          </Button>
        </div>
      </div>

      <HairlineRule className="my-6" />

      {/* Preview */}
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard eyebrow={REPORTS.preview.employees} value={total} caption={`para ${propertyName}`} />
        <MetricCard eyebrow={REPORTS.preview.avg} value={`${avg}/100`} caption="combinado" />
        <MetricCard eyebrow={REPORTS.preview.active} value={active} caption="últimos 7 días" />
        <MetricCard eyebrow={REPORTS.preview.participation} value={`${participation}%`} caption="del total" />
      </div>

      <HairlineRule className="my-6" />

      {/* Sample table */}
      <div className="overflow-x-auto rounded-md border border-hair bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-hair bg-ivory-soft">
              <Th>Nombre</Th>
              <Th>Puesto</Th>
              <Th>Nivel</Th>
              <Th align="right">Puntaje</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 12).map((e) => (
              <tr key={e.id} className="border-b border-hair last:border-0">
                <Td>{e.name}</Td>
                <Td>
                  <span className="caps">{ROLES[e.hotel_role].label_es}</span>
                </Td>
                <Td>
                  <LevelChip level={e.current_level} />
                </Td>
                <Td align="right">
                  <span className="font-mono text-t-label">{e.combined_score}/100</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 12 && (
          <p className="border-t border-hair bg-ivory-soft px-3 py-2 text-center caps">
            … {filtered.length - 12} filas más en la exportación
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        {toast && (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-success">
            {toast}
          </span>
        )}
        <Button variant="ghost" onClick={generateCsv} disabled={busy !== null}>
          <FileDown className="h-3.5 w-3.5" aria-hidden />
          {busy === "csv" ? REPORTS.actions.generating : REPORTS.actions.csv}
        </Button>
        <Button variant="ghost" onClick={generateExcel} disabled={busy !== null}>
          <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
          {busy === "excel" ? REPORTS.actions.generating : REPORTS.actions.excel}
        </Button>
        <Button variant="primary" onClick={generatePdf} disabled={busy !== null}>
          <FileText className="h-3.5 w-3.5" aria-hidden />
          {busy === "pdf" ? REPORTS.actions.generating : REPORTS.actions.pdf}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="caps mb-2 block">{label}</label>
      {children}
    </div>
  );
}

function Th({
  children,
  align,
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className="px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted"
      style={{ textAlign: align ?? "left" }}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  align,
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td className="px-3 py-2 font-sans text-t-body text-espresso" style={{ textAlign: align ?? "left" }}>
      {children}
    </td>
  );
}
