"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, LevelBadge } from "@/components/ui/Badge";
import { EditDrawer } from "@/components/hr/EditDrawer";
import { COHORTS } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import type { HRCohortView } from "@/lib/hr/demo-bridge";

interface Props {
  initial: HRCohortView[];
}

export function CohortsClient({ initial }: Props) {
  const [rows, setRows] = React.useState<HRCohortView[]>(initial);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState({
    name: "",
    module: "frontdesk" as RoleModule,
    target_level: "B1" as CEFRLevel,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    completion_target_pct: 80,
  });

  async function create() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/hr/cohorts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        setError("No se pudo crear la cohorte.");
        return;
      }
      const json = (await res.json()) as { cohort?: HRCohortView };
      if (json.cohort) {
        setRows((prev) => [json.cohort!, ...prev]);
      }
      setOpen(false);
    } catch {
      setError("No se pudo crear la cohorte.");
    } finally {
      setSaving(false);
    }
  }

  const columns = React.useMemo<ColumnDef<HRCohortView>[]>(
    () => [
      {
        accessorKey: "name",
        header: COHORTS.table.name,
        cell: ({ row }) => (
          <Link
            href={`/hr/cohorts/${row.original.id}`}
            className="font-serif text-t-body font-medium text-espresso hover:text-ink"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "module",
        header: COHORTS.table.module,
        cell: ({ row }) => (
          <span className="caps">{ROLES[row.original.module].label_es}</span>
        ),
      },
      {
        accessorKey: "target_level",
        header: COHORTS.table.target,
        cell: ({ row }) => <LevelBadge level={row.original.target_level} />,
      },
      {
        accessorKey: "member_count",
        header: COHORTS.table.members,
        cell: ({ row }) => (
          <span className="font-mono text-t-label text-espresso">
            {row.original.member_count}
          </span>
        ),
      },
      {
        accessorKey: "avg_completion_pct",
        header: COHORTS.table.progress,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-pill bg-ivory-deep">
              <div
                className="h-1.5 rounded-pill bg-ink"
                style={{ width: `${row.original.avg_completion_pct}%` }}
              />
            </div>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-muted">
              {row.original.avg_completion_pct}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "start_date",
        header: COHORTS.table.start,
        cell: ({ row }) => <span className="caps">{row.original.start_date ?? "—"}</span>,
      },
      {
        accessorKey: "end_date",
        header: COHORTS.table.end,
        cell: ({ row }) => <span className="caps">{row.original.end_date ?? "—"}</span>,
      },
      {
        accessorKey: "status",
        header: COHORTS.table.status,
        cell: ({ row }) => (
          <Badge tone={statusToTone(row.original.status)}>{COHORTS.status[row.original.status]}</Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/hr/cohorts/${row.original.id}`}
            className="inline-flex rounded-sm p-1 text-espresso-muted hover:bg-ivory-soft hover:text-ink"
            aria-label="Ver detalle"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="caps">{rows.length} cohortes</p>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {COHORTS.actions.new}
        </Button>
      </div>
      <DenseDataTable data={rows} columns={columns} emptyMessage={COHORTS.empty} pageSize={25} />

      <EditDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={COHORTS.modal.title}
        eyebrow="NUEVA COHORTE"
        footer={
          <>
            {error && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
                {error}
              </span>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
              {COHORTS.modal.cancel}
            </Button>
            <Button variant="primary" onClick={create} disabled={saving || !draft.name.trim()}>
              {saving ? COHORTS.modal.saving : COHORTS.modal.create}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={COHORTS.modal.name}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder={COHORTS.modal.namePlaceholder}
          />
          <FieldRow>
            <Field label={COHORTS.modal.module}>
              <select
                value={draft.module}
                onChange={(e) => setDraft({ ...draft, module: e.target.value as RoleModule })}
                className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
              >
                {(Object.keys(ROLES) as RoleModule[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLES[r].label_es}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={COHORTS.modal.targetLevel}>
              <select
                value={draft.target_level}
                onChange={(e) => setDraft({ ...draft, target_level: e.target.value as CEFRLevel })}
                className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
              >
                {(["A1", "A2", "B1", "B2"] as CEFRLevel[]).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </FieldRow>
          <FieldRow>
            <Input
              label={COHORTS.modal.startDate}
              type="date"
              value={draft.start_date}
              onChange={(e) => setDraft({ ...draft, start_date: e.target.value })}
            />
            <Input
              label={COHORTS.modal.endDate}
              type="date"
              value={draft.end_date}
              onChange={(e) => setDraft({ ...draft, end_date: e.target.value })}
            />
          </FieldRow>
          <Input
            label={COHORTS.modal.completionTarget}
            type="number"
            min={0}
            max={100}
            value={String(draft.completion_target_pct)}
            onChange={(e) =>
              setDraft({ ...draft, completion_target_pct: Number(e.target.value) || 0 })
            }
          />
        </div>
      </EditDrawer>
    </div>
  );
}

function statusToTone(s: HRCohortView["status"]): "neutral" | "soft" | "strong" | "success" {
  if (s === "active") return "strong";
  if (s === "completed") return "success";
  if (s === "draft") return "soft";
  return "neutral";
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="caps mb-2 block">{label}</label>
      {children}
    </div>
  );
}
