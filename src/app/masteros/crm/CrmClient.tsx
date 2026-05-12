"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusChip, STATUS_VALUES, type CrmStatus } from "@/components/masteros/StatusChip";
import { CRM } from "@/content/masteros";

interface PropertyLite {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  is_active: boolean;
}
interface HrUserLite {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
}
export interface CrmOrg {
  id: string;
  name: string;
  type: string;
  subscription_tier: string;
  subscription_status: string;
  billing_email: string | null;
  status: CrmStatus;
  notes: string;
  properties: PropertyLite[];
  hr_users: HrUserLite[];
  n_properties: number;
  n_employees: number;
  last_login_at: string | null;
}

interface Props {
  initial: CrmOrg[];
  demo?: boolean;
}

export function CrmClient({ initial, demo }: Props) {
  const [rows, setRows] = useState<CrmOrg[]>(initial);
  const [filter, setFilter] = useState("");
  const [drawer, setDrawer] = useState<CrmOrg | null>(null);

  const filtered = useMemo(() => {
    if (!filter.trim()) return rows;
    const q = filter.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.billing_email?.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q),
    );
  }, [rows, filter]);

  async function updateOrg(id: string, patch: { status?: CrmStatus; notes?: string }) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
    setDrawer((d) => (d && d.id === id ? { ...d, ...patch } : d));
    await fetch("/api/masteros/crm", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organization_id: id, ...patch }),
    }).catch(() => undefined);
  }

  const columns = useMemo<ColumnDef<CrmOrg>[]>(
    () => [
      {
        accessorKey: "name",
        header: CRM.table.org,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-serif text-t-body font-medium text-espresso">
              {row.original.name}
            </p>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
              {row.original.type === "chain" ? "Cadena" : "Independiente"}
            </p>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "subscription_tier",
        header: CRM.table.plan,
        cell: ({ row }) => (
          <Badge tone="soft" className="capitalize">
            {row.original.subscription_tier}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: CRM.table.status,
        cell: ({ row }) => (
          <select
            value={row.original.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateOrg(row.original.id, { status: e.target.value as CrmStatus })}
            className="appearance-none rounded-pill border border-hair bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 focus:border-ink focus:outline-none"
          >
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {CRM.status[s]}
              </option>
            ))}
          </select>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "n_properties",
        header: CRM.table.properties,
        cell: ({ row }) => (
          <span className="block text-right font-mono text-[0.75rem] tabular-nums text-espresso">
            {row.original.n_properties}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "n_employees",
        header: CRM.table.employees,
        cell: ({ row }) => (
          <span className="block text-right font-mono text-[0.75rem] tabular-nums text-espresso">
            {row.original.n_employees}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "last_login_at",
        header: CRM.table.lastLogin,
        cell: ({ row }) =>
          row.original.last_login_at ? (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
              {new Date(row.original.last_login_at).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })}
            </span>
          ) : (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
              {CRM.drawer.never}
            </span>
          ),
        enableSorting: true,
      },
      {
        accessorKey: "notes",
        header: CRM.table.notes,
        cell: ({ row }) => (
          <span className="line-clamp-1 text-espresso-soft">
            {row.original.notes ? row.original.notes.slice(0, 80) : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: CRM.table.actions,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDrawer(row.original);
            }}
            className="inline-flex items-center gap-1 rounded-pill border border-hair bg-white px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 hover:text-ink"
          >
            {CRM.table.view}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={CRM.eyebrow}
        title={
          <>
            {CRM.headline.before}
            <em>{CRM.headline.em}</em>
            {CRM.headline.after}
          </>
        }
        sub={CRM.sub}
        actions={
          <>
            {demo && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
                Modo demo
              </span>
            )}
            <a
              href="/api/masteros/crm/export"
              className="inline-flex h-10 items-center gap-1.5 rounded-pill border border-hair bg-transparent px-5 font-sans text-t-label font-medium text-espresso transition hover:border-espresso/40 hover:bg-ivory-soft"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {CRM.exportCsv}
            </a>
          </>
        }
      />

      <div className="mt-5 flex flex-col gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={CRM.search}
          className="h-9 max-w-md rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none"
        />
      </div>

      <div className="mt-5">
        <DenseDataTable<CrmOrg>
          data={filtered}
          columns={columns}
          emptyMessage={CRM.empty}
          initialSorting={[{ id: "name", desc: false }]}
          onRowClick={(r) => setDrawer(r)}
        />
      </div>

      {drawer && (
        <Drawer
          org={drawer}
          onClose={() => setDrawer(null)}
          onSave={(notes) => updateOrg(drawer.id, { notes })}
        />
      )}
    </section>
  );
}

function Drawer({
  org,
  onClose,
  onSave,
}: {
  org: CrmOrg;
  onClose: () => void;
  onSave: (notes: string) => Promise<void> | void;
}) {
  const [notes, setNotes] = useState(org.notes);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onSave(notes);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex"
      onClick={onClose}
    >
      <div className="flex-1 bg-espresso/40" />
      <div
        className="flex h-full w-full max-w-2xl flex-col border-l border-hair bg-ivory"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-baseline justify-between border-b border-hair bg-ivory-soft px-5 py-3">
          <div>
            <p className="caps">{CRM.drawer.title}</p>
            <h2 className="font-serif text-t-h3 font-medium text-espresso">{org.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusChip status={org.status} />
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:text-ink"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div>
            <p className="caps mb-2">{CRM.drawer.properties} · {org.n_properties}</p>
            {org.properties.length === 0 ? (
              <p className="font-sans text-t-caption text-espresso-muted">{CRM.drawer.noProperties}</p>
            ) : (
              <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
                {org.properties.map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-3 px-3 py-2">
                    <div>
                      <p className="font-serif text-t-body font-medium text-espresso">{p.name}</p>
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                        {p.slug}{p.city ? ` · ${p.city}` : ""}
                      </p>
                    </div>
                    {!p.is_active && <Badge tone="neutral">Inactivo</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="caps mb-2">{CRM.drawer.hrUsers} · {org.hr_users.length}</p>
            {org.hr_users.length === 0 ? (
              <p className="font-sans text-t-caption text-espresso-muted">{CRM.drawer.noUsers}</p>
            ) : (
              <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
                {org.hr_users.map((u) => (
                  <li key={u.id} className="flex items-baseline justify-between gap-3 px-3 py-2">
                    <div>
                      <p className="font-serif text-t-body font-medium text-espresso">{u.name}</p>
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                        {u.email} · {u.role}
                      </p>
                    </div>
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })
                        : CRM.drawer.never}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="caps mb-2 block">{CRM.drawer.notesLabel}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder={CRM.drawer.notesPlaceholder}
              className="w-full resize-y rounded-md border border-hair bg-white p-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-hair bg-ivory-soft px-5 py-3">
          <Button variant="ghost" onClick={onClose}>
            {CRM.drawer.close}
          </Button>
          <Button variant="primary" onClick={save} disabled={saving || notes === org.notes}>
            {saving ? CRM.drawer.saving : CRM.drawer.save}
          </Button>
        </footer>
      </div>
    </div>
  );
}
