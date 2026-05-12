"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Pencil, FileSpreadsheet, ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { Button } from "@/components/ui/Button";
import { LevelChip } from "@/components/hr/LevelChip";
import { EmployeeStatusChip } from "@/components/hr/EmployeeStatusChip";
import { EditDrawer } from "@/components/hr/EditDrawer";
import {
  ContactEditForm,
  type EmployeeFormValues,
} from "@/components/hr/ContactEditForm";
import { EMPLOYEES, type EmployeeStatus } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import type { HREmployeeView } from "@/lib/hr/demo-bridge";

type RoleFilter = "all" | RoleModule;
type LevelFilter = "all" | CEFRLevel;
type StatusFilter = "all" | EmployeeStatus;

interface Props {
  initial: HREmployeeView[];
}

export function EmployeesClient({ initial }: Props) {
  const [rows, setRows] = React.useState<HREmployeeView[]>(initial);
  const [search, setSearch] = React.useState("");
  const [roleF, setRoleF] = React.useState<RoleFilter>("all");
  const [levelF, setLevelF] = React.useState<LevelFilter>("all");
  const [statusF, setStatusF] = React.useState<StatusFilter>("all");
  const [editing, setEditing] = React.useState<HREmployeeView | null>(null);
  const [draft, setDraft] = React.useState<EmployeeFormValues | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return rows.filter((e) => {
      if (roleF !== "all" && e.hotel_role !== roleF) return false;
      if (levelF !== "all" && e.current_level !== levelF) return false;
      if (statusF !== "all" && e.status !== statusF) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [e.name, e.email, e.department].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, search, roleF, levelF, statusF]);

  const openEdit = (e: HREmployeeView) => {
    setEditing(e);
    setDraft({
      name: e.name,
      email: e.email ?? "",
      phone: e.phone ?? "",
      hotel_role: e.hotel_role,
      department: e.department ?? "",
      shift: (e.shift ?? "") as EmployeeFormValues["shift"],
      status: e.status,
      whatsapp_opted_in: e.whatsapp_opted_in,
      current_level: (e.current_level ?? "") as EmployeeFormValues["current_level"],
    });
    setError(null);
  };

  const closeEdit = () => {
    setEditing(null);
    setDraft(null);
    setError(null);
  };

  async function save() {
    if (!editing || !draft) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/hr/employees/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        setError(EMPLOYEES.drawer.saveError);
        return;
      }
      // Optimistically reflect in the table
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                ...draft,
                shift: (draft.shift || null) as HREmployeeView["shift"],
                current_level: (draft.current_level || null) as HREmployeeView["current_level"],
                is_active: draft.status === "active",
              }
            : r,
        ),
      );
      closeEdit();
    } catch {
      setError(EMPLOYEES.drawer.saveError);
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    const header = [
      "Nombre",
      "Email",
      "Teléfono",
      "Puesto",
      "Departamento",
      "Turno",
      "Nivel",
      "Estado",
      "WhatsApp",
      "Puntaje",
      "Últ. actividad (días)",
    ].join(",");
    const lines = filtered.map((e) =>
      [
        JSON.stringify(e.name),
        JSON.stringify(e.email ?? ""),
        JSON.stringify(e.phone ?? ""),
        ROLES[e.hotel_role].label_es,
        JSON.stringify(e.department ?? ""),
        e.shift ?? "",
        e.current_level ?? "",
        EMPLOYEES.status[e.status],
        e.whatsapp_opted_in ? "Sí" : "No",
        e.combined_score,
        e.last_active_days_ago,
      ].join(","),
    );
    const csv = `${header}\n${lines.join("\n")}`;
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `empleados-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns = React.useMemo<ColumnDef<HREmployeeView>[]>(
    () => [
      {
        accessorKey: "name",
        header: EMPLOYEES.table.name,
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/hr/employees/${row.original.id}`}
              className="font-serif text-t-body font-medium text-espresso hover:text-ink"
            >
              {row.original.name}
            </Link>
            {row.original.email && (
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                {row.original.email}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "hotel_role",
        header: EMPLOYEES.table.role,
        cell: ({ row }) => <span className="caps">{ROLES[row.original.hotel_role].label_es}</span>,
      },
      {
        accessorKey: "current_level",
        header: EMPLOYEES.table.level,
        cell: ({ row }) => <LevelChip level={row.original.current_level} />,
      },
      {
        accessorKey: "department",
        header: EMPLOYEES.table.department,
        cell: ({ row }) => (
          <span className="font-sans text-t-body text-espresso-soft">
            {row.original.department ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "shift",
        header: EMPLOYEES.table.shift,
        cell: ({ row }) => (
          <span className="caps">
            {row.original.shift ? EMPLOYEES.shift[row.original.shift] : "—"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: EMPLOYEES.table.status,
        cell: ({ row }) => <EmployeeStatusChip status={row.original.status} />,
      },
      {
        accessorKey: "whatsapp_opted_in",
        header: EMPLOYEES.table.whatsapp,
        cell: ({ row }) => (
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-soft">
            {row.original.whatsapp_opted_in ? "✓" : "—"}
          </span>
        ),
      },
      {
        accessorKey: "last_active_days_ago",
        header: EMPLOYEES.table.lastActive,
        cell: ({ row }) => (
          <span className="caps">
            {row.original.last_active_days_ago === 0
              ? "hoy"
              : row.original.last_active_days_ago > 99
                ? "—"
                : `hace ${row.original.last_active_days_ago}d`}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(row.original);
              }}
              className="rounded-sm p-1 text-espresso-muted hover:bg-ivory-soft hover:text-ink"
              aria-label={EMPLOYEES.actions.edit}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
            </button>
            <Link
              href={`/hr/employees/${row.original.id}`}
              className="rounded-sm p-1 text-espresso-muted hover:bg-ivory-soft hover:text-ink"
              aria-label="Ver detalle"
            >
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-espresso-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={EMPLOYEES.search}
            className="h-10 w-full rounded-md border border-hair bg-white pl-9 pr-4 font-sans text-t-body text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none"
          />
        </div>
        <FilterSelect
          label={EMPLOYEES.filters.role}
          value={roleF}
          onChange={(v) => setRoleF(v as RoleFilter)}
          options={[
            { value: "all", label: EMPLOYEES.filters.all },
            ...(Object.keys(ROLES) as RoleModule[]).map((r) => ({
              value: r,
              label: ROLES[r].label_es,
            })),
          ]}
        />
        <FilterSelect
          label={EMPLOYEES.filters.level}
          value={levelF}
          onChange={(v) => setLevelF(v as LevelFilter)}
          options={[
            { value: "all", label: EMPLOYEES.filters.all },
            { value: "A1", label: "A1" },
            { value: "A2", label: "A2" },
            { value: "B1", label: "B1" },
            { value: "B2", label: "B2" },
          ]}
        />
        <FilterSelect
          label={EMPLOYEES.filters.status}
          value={statusF}
          onChange={(v) => setStatusF(v as StatusFilter)}
          options={[
            { value: "all", label: EMPLOYEES.filters.all },
            { value: "active", label: EMPLOYEES.status.active },
            { value: "paused", label: EMPLOYEES.status.paused },
            { value: "inactive", label: EMPLOYEES.status.inactive },
            { value: "promoted", label: EMPLOYEES.status.promoted },
            { value: "terminated", label: EMPLOYEES.status.terminated },
          ]}
        />
        <Button variant="ghost" onClick={exportCsv}>
          <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
          {EMPLOYEES.actions.export}
        </Button>
      </div>

      <DenseDataTable
        data={filtered}
        columns={columns}
        emptyMessage={EMPLOYEES.empty}
        pageSize={25}
      />

      <EditDrawer
        open={editing !== null}
        onClose={closeEdit}
        title={EMPLOYEES.drawer.titleEdit}
        eyebrow={editing ? editing.name.toUpperCase() : ""}
        footer={
          <>
            {error && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
                {error}
              </span>
            )}
            <Button variant="ghost" onClick={closeEdit} disabled={saving}>
              {EMPLOYEES.drawer.cancel}
            </Button>
            <Button variant="primary" onClick={save} disabled={saving}>
              {saving ? EMPLOYEES.drawer.saving : EMPLOYEES.drawer.save}
            </Button>
          </>
        }
      >
        {draft && (
          <ContactEditForm
            initial={draft}
            onChange={(v) => setDraft(v)}
            disabled={saving}
          />
        )}
      </EditDrawer>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-label text-espresso focus:border-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
