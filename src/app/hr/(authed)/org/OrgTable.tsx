"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { LevelChip } from "@/components/hr/LevelChip";
import { ORG } from "@/content/hr";
import type { OrgPropertyStat } from "@/lib/hr/org-data";

interface Props {
  rows: OrgPropertyStat[];
}

/**
 * Org-level property comparison table. Clicking a property name pins it as
 * the active scope (same POST the sidebar PropertySwitcher uses) and
 * navigates to /hr so the rest of the dashboard focuses on it.
 */
export function OrgTable({ rows }: Props) {
  const router = useRouter();
  const [pending, setPending] = React.useState<string | null>(null);

  async function focusProperty(propertyId: string) {
    setPending(propertyId);
    try {
      await fetch("/api/hr/property-context", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ property_id: propertyId }),
      });
      router.push("/hr");
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  const columns = React.useMemo<ColumnDef<OrgPropertyStat>[]>(
    () => [
      {
        accessorKey: "name",
        header: ORG.table.name,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => focusProperty(row.original.property_id)}
            disabled={pending === row.original.property_id}
            className="text-left font-serif text-t-body font-medium text-espresso hover:text-ink disabled:opacity-60"
            title={ORG.viewProperty}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: "city",
        header: ORG.table.city,
        cell: ({ row }) => <span className="caps">{row.original.city ?? "—"}</span>,
      },
      {
        accessorKey: "employees_active",
        header: ORG.table.employeesActive,
        cell: ({ row }) => (
          <span className="font-mono text-t-label text-espresso">
            {row.original.employees_active}
          </span>
        ),
      },
      {
        accessorKey: "avg_level",
        header: ORG.table.avgLevel,
        cell: ({ row }) =>
          row.original.avg_level === "—" ? (
            <span className="caps">—</span>
          ) : (
            <LevelChip level={row.original.avg_level} />
          ),
      },
      {
        accessorKey: "exams_completed_30d",
        header: ORG.table.exams30d,
        cell: ({ row }) => (
          <span className="font-mono text-t-label text-espresso">
            {row.original.exams_completed_30d}
          </span>
        ),
      },
      {
        accessorKey: "exam_completion_pct",
        header: ORG.table.completion,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-pill bg-ivory-deep">
              <div
                className="h-1.5 rounded-pill bg-ink"
                style={{ width: `${row.original.exam_completion_pct}%` }}
              />
            </div>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-muted">
              {row.original.exam_completion_pct}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "practice_7d",
        header: ORG.table.practice7d,
        cell: ({ row }) => (
          <span className="font-mono text-t-label text-espresso">
            {row.original.practice_7d}
          </span>
        ),
      },
    ],
    [pending],
  );

  return (
    <DenseDataTable data={rows} columns={columns} emptyMessage={ORG.empty} pageSize={25} />
  );
}
