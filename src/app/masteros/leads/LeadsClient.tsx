"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  ExternalLink,
  Mail,
  MailCheck,
  Phone,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { MasterosTabs } from "@/components/masteros/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LEADS } from "@/content/leads";
import type { LeadRow, LeadStatus } from "@/lib/server/leads";

export type LeadsTab = "all" | "pilot" | "soporte" | "other";
export type LeadsStatusFilter = "all" | LeadStatus;

const STATUS_OPTIONS: ReadonlyArray<{ id: LeadStatus; label: string }> = [
  { id: "new", label: LEADS.status.new },
  { id: "contacted", label: LEADS.status.contacted },
  { id: "qualified", label: LEADS.status.qualified },
  { id: "closed", label: LEADS.status.closed },
  { id: "spam", label: LEADS.status.spam },
];

interface Props {
  initialRows: LeadRow[];
  initialTotal: number;
  counts: { all: number; pilot: number; soporte: number; other: number };
  tab: LeadsTab;
  status: LeadsStatusFilter;
  search: string;
  demo: boolean;
}

export function LeadsClient({
  initialRows,
  initialTotal,
  counts,
  tab,
  status,
  search,
  demo,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [rows, setRows] = useState<LeadRow[]>(initialRows);
  const [searchInput, setSearchInput] = useState(search);
  const [drawer, setDrawer] = useState<LeadRow | null>(null);

  // Re-sync rows when SSR pushes a new initialRows on navigation.
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const tabItems = useMemo(
    () => [
      { id: "all", label: LEADS.tabs.all, count: counts.all, href: hrefFor({ tab: "all", status, search }) },
      { id: "pilot", label: LEADS.tabs.pilot, count: counts.pilot, href: hrefFor({ tab: "pilot", status, search }) },
      { id: "soporte", label: LEADS.tabs.soporte, count: counts.soporte, href: hrefFor({ tab: "soporte", status, search }) },
      { id: "other", label: LEADS.tabs.other, count: counts.other, href: hrefFor({ tab: "other", status, search }) },
    ],
    [counts, status, search],
  );

  function navigate(next: { tab?: LeadsTab; status?: LeadsStatusFilter; search?: string }) {
    const href = hrefFor({
      tab: next.tab ?? tab,
      status: next.status ?? status,
      search: next.search ?? search,
    });
    startTransition(() => {
      router.push(href);
    });
  }

  // Debounced search submit on Enter or blur.
  function commitSearch() {
    if (searchInput.trim() === search.trim()) return;
    navigate({ search: searchInput.trim() });
  }

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function patchLead(
    id: string,
    patch: { status?: LeadStatus; notes?: string | null },
  ) {
    // Optimistic.
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...(patch.status !== undefined ? { status: patch.status } : {}),
              ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
              ...(patch.status === "contacted" && !r.contacted_at
                ? { contacted_at: new Date().toISOString() }
                : {}),
            }
          : r,
      ),
    );
    setDrawer((d) =>
      d && d.id === id
        ? {
            ...d,
            ...(patch.status !== undefined ? { status: patch.status } : {}),
            ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
          }
        : d,
    );
    await fetch(`/api/masteros/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => undefined);
  }

  const exportHref = useMemo(() => {
    const sp = new URLSearchParams();
    if (tab !== "all") sp.set("tab", tab);
    if (status !== "all") sp.set("status", status);
    if (search.trim()) sp.set("search", search.trim());
    const qs = sp.toString();
    return `/api/masteros/leads/export${qs ? `?${qs}` : ""}`;
  }, [tab, status, search]);

  const columns = useMemo<ColumnDef<LeadRow>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: LEADS.table.received,
        cell: ({ row }) => (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
            {relativeEsMx(row.original.created_at)}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "person",
        header: LEADS.table.person,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-serif text-t-body font-medium text-espresso">
              {row.original.name?.trim() || row.original.email || "—"}
            </p>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
              {row.original.company?.trim() || row.original.email || "—"}
              {row.original.city ? ` · ${row.original.city}` : ""}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "form_name",
        header: LEADS.table.form,
        cell: ({ row }) => (
          <Badge tone={row.original.form_name === "pilot" ? "strong" : "soft"} className="capitalize">
            {row.original.form_name}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: LEADS.table.status,
        cell: ({ row }) => (
          <select
            value={row.original.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              patchLead(row.original.id, { status: e.target.value as LeadStatus })
            }
            className="appearance-none rounded-pill border border-hair bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 focus:border-ink focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        ),
        enableSorting: true,
      },
      {
        id: "message",
        header: LEADS.table.message,
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-[36ch] text-espresso-soft">
            {row.original.message
              ? row.original.message.slice(0, 60)
              : <span className="text-espresso-muted">—</span>}
          </span>
        ),
      },
      {
        id: "actions",
        header: LEADS.table.actions,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDrawer(row.original);
            }}
            className="inline-flex items-center gap-1 rounded-pill border border-hair bg-white px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 hover:text-ink"
          >
            {LEADS.table.view}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={LEADS.eyebrow}
        title={
          <>
            {LEADS.headline.before}
            <em>{LEADS.headline.em}</em>
            {LEADS.headline.after}
          </>
        }
        sub={LEADS.sub}
        actions={
          <>
            {demo && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
                {LEADS.demo}
              </span>
            )}
            <button
              type="button"
              onClick={refresh}
              disabled={pending}
              className="inline-flex h-10 items-center gap-1.5 rounded-pill border border-hair bg-transparent px-4 font-sans text-t-label font-medium text-espresso transition hover:border-espresso/40 hover:bg-ivory-soft disabled:opacity-50"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
              {LEADS.refresh}
            </button>
            <a
              href={exportHref}
              className="inline-flex h-10 items-center gap-1.5 rounded-pill border border-hair bg-transparent px-5 font-sans text-t-label font-medium text-espresso transition hover:border-espresso/40 hover:bg-ivory-soft"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {LEADS.exportCsv}
            </a>
          </>
        }
      />

      <div className="mt-5">
        <MasterosTabs items={tabItems} active={tab} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitSearch();
          }}
          onBlur={commitSearch}
          placeholder={LEADS.search}
          className="h-9 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
            {LEADS.table.status}
          </span>
          {([
            { v: "all", l: LEADS.status.all },
            { v: "new", l: LEADS.status.new },
            { v: "contacted", l: LEADS.status.contacted },
            { v: "qualified", l: LEADS.status.qualified },
            { v: "closed", l: LEADS.status.closed },
            { v: "spam", l: LEADS.status.spam },
          ] as Array<{ v: LeadsStatusFilter; l: string }>).map((o) => {
            const active = o.v === status;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => navigate({ status: o.v })}
                className={
                  active
                    ? "rounded-pill border border-ink bg-ink-tint px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-deep"
                    : "rounded-pill border border-hair bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 hover:text-espresso"
                }
              >
                {o.l}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <DenseDataTable<LeadRow>
          data={rows}
          columns={columns}
          emptyMessage={LEADS.empty}
          initialSorting={[{ id: "created_at", desc: true }]}
          onRowClick={(r) => setDrawer(r)}
        />
        {initialTotal > rows.length && (
          <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
            {rows.length} de {initialTotal}
          </p>
        )}
      </div>

      {drawer && (
        <LeadDrawer
          lead={drawer}
          onClose={() => setDrawer(null)}
          onPatch={(patch) => patchLead(drawer.id, patch)}
        />
      )}
    </section>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onPatch,
}: {
  lead: LeadRow;
  onClose: () => void;
  onPatch: (patch: { status?: LeadStatus; notes?: string | null }) => Promise<void> | void;
}) {
  const [notes, setNotes] = useState<string>(lead.notes ?? "");
  const [statusLocal, setStatusLocal] = useState<LeadStatus>(lead.status);
  const [saving, setSaving] = useState(false);

  // Keep in sync if parent updates this lead via optimistic patches elsewhere.
  useEffect(() => {
    setNotes(lead.notes ?? "");
    setStatusLocal(lead.status);
  }, [lead.id, lead.notes, lead.status]);

  const dirty =
    (notes ?? "") !== (lead.notes ?? "") || statusLocal !== lead.status;

  async function save() {
    setSaving(true);
    try {
      const patch: { status?: LeadStatus; notes?: string | null } = {};
      if (statusLocal !== lead.status) patch.status = statusLocal;
      if ((notes ?? "") !== (lead.notes ?? "")) patch.notes = notes ?? "";
      await onPatch(patch);
    } finally {
      setSaving(false);
    }
  }

  async function quickStatus(s: LeadStatus) {
    setSaving(true);
    try {
      setStatusLocal(s);
      await onPatch({ status: s, notes: notes ?? lead.notes ?? "" });
    } finally {
      setSaving(false);
    }
  }

  const subjectByForm: Record<LeadRow["form_name"], string> = {
    pilot: LEADS.reply.subjectPilot,
    soporte: LEADS.reply.subjectSoporte,
    other: LEADS.reply.subjectOther,
  };
  const mailto = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent(subjectByForm[lead.form_name])}`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex"
      onClick={onClose}
    >
      <div className="flex-1 bg-espresso/40" />
      <div
        className="flex h-full w-full max-w-[480px] flex-col border-l border-hair bg-ivory"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-baseline justify-between gap-3 border-b border-hair bg-ivory-soft px-5 py-3">
          <div className="min-w-0">
            <p className="caps">{LEADS.drawer.title}</p>
            <h2 className="truncate font-serif text-t-h3 font-medium text-espresso">
              {lead.name?.trim() || lead.email || "—"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:text-ink"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <DetailGrid
            items={[
              {
                label: LEADS.drawer.received,
                value: formatDateLong(lead.created_at),
              },
              {
                label: LEADS.drawer.source,
                value: (
                  <span className="capitalize">{lead.form_name}</span>
                ),
              },
              {
                label: LEADS.drawer.contact,
                value: (
                  <div className="space-y-0.5">
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="block text-ink underline-offset-4 hover:underline"
                      >
                        <Mail className="mr-1 inline-block h-3 w-3" aria-hidden />
                        {lead.email}
                      </a>
                    ) : null}
                    {lead.phone ? (
                      <span className="block">
                        <Phone className="mr-1 inline-block h-3 w-3" aria-hidden />
                        {lead.phone}
                      </span>
                    ) : null}
                    {!lead.email && !lead.phone && LEADS.drawer.none}
                  </div>
                ),
              },
              {
                label: LEADS.drawer.company,
                value: lead.company?.trim() || LEADS.drawer.none,
              },
              {
                label: LEADS.drawer.location,
                value: [lead.city, lead.ip_country].filter(Boolean).join(" · ") || LEADS.drawer.none,
              },
              {
                label: LEADS.drawer.role,
                value: lead.role?.trim() || LEADS.drawer.none,
              },
              {
                label: LEADS.drawer.hotelCount,
                value:
                  typeof lead.hotel_count === "number"
                    ? lead.hotel_count.toLocaleString("es-MX")
                    : LEADS.drawer.none,
              },
            ]}
          />

          <div>
            <p className="caps mb-2">{LEADS.drawer.message}</p>
            <p className="whitespace-pre-wrap rounded-md border border-hair bg-white p-3 font-sans text-t-body text-espresso">
              {lead.message?.trim() || (
                <span className="text-espresso-muted">{LEADS.drawer.noMessage}</span>
              )}
            </p>
          </div>

          {lead.source_url && (
            <div>
              <p className="caps mb-2">{LEADS.drawer.sourceUrl}</p>
              <a
                href={lead.source_url}
                target="_blank"
                rel="noreferrer"
                className="break-all font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink underline-offset-4 hover:underline"
              >
                {lead.source_url}
              </a>
            </div>
          )}

          <div>
            <p className="caps mb-2">{LEADS.drawer.statusLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((s) => {
                const active = s.id === statusLocal;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatusLocal(s.id)}
                    className={
                      active
                        ? "rounded-pill border border-ink bg-ink-tint px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-deep"
                        : "rounded-pill border border-hair bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 hover:text-espresso"
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="caps mb-2">{LEADS.drawer.quick}</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => quickStatus("contacted")}
                disabled={saving || statusLocal === "contacted"}
                className="inline-flex items-center gap-1 rounded-pill border border-hair bg-white px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-success hover:border-success/40 disabled:opacity-50"
              >
                <MailCheck className="h-3 w-3" aria-hidden />
                {LEADS.drawer.markContacted}
              </button>
              <button
                type="button"
                onClick={() => quickStatus("spam")}
                disabled={saving || statusLocal === "spam"}
                className="inline-flex items-center gap-1 rounded-pill border border-hair bg-white px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error hover:border-error/40 disabled:opacity-50"
              >
                <ShieldAlert className="h-3 w-3" aria-hidden />
                {LEADS.drawer.markSpam}
              </button>
              {mailto && (
                <a
                  href={mailto}
                  className="inline-flex items-center gap-1 rounded-pill border border-hair bg-white px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink hover:border-ink/40"
                >
                  <Mail className="h-3 w-3" aria-hidden />
                  {LEADS.drawer.replyEmail}
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="caps mb-2 block">{LEADS.drawer.notesLabel}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder={LEADS.drawer.notesPlaceholder}
              className="w-full resize-y rounded-md border border-hair bg-white p-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
            />
          </div>

          {lead.metadata && Object.keys(lead.metadata).length > 0 && (
            <div>
              <p className="caps mb-2">{LEADS.drawer.metadata}</p>
              <pre className="overflow-x-auto rounded-md border border-hair bg-white p-3 font-mono text-[0.6875rem] text-espresso-soft">
                {JSON.stringify(lead.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-hair bg-ivory-soft px-5 py-3">
          <Button variant="ghost" onClick={onClose}>
            {LEADS.drawer.close}
          </Button>
          <Button variant="primary" onClick={save} disabled={!dirty || saving}>
            {saving ? LEADS.drawer.saving : LEADS.drawer.save}
          </Button>
        </footer>
      </div>
    </div>
  );
}

function DetailGrid({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="caps mb-1">{it.label}</dt>
          <dd className="break-words font-sans text-t-body text-espresso">
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────

function hrefFor({
  tab,
  status,
  search,
}: {
  tab: LeadsTab;
  status: LeadsStatusFilter;
  search: string;
}): string {
  const sp = new URLSearchParams();
  if (tab !== "all") sp.set("tab", tab);
  if (status !== "all") sp.set("status", status);
  if (search.trim()) sp.set("search", search.trim());
  const qs = sp.toString();
  return `/masteros/leads${qs ? `?${qs}` : ""}`;
}

function relativeEsMx(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "—";
  const diff = Date.now() - then;
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (diff < min) return "ahora";
  if (diff < hr) return `hace ${Math.round(diff / min)} min`;
  if (diff < day) return `hace ${Math.round(diff / hr)} h`;
  if (diff < 7 * day) return `hace ${Math.round(diff / day)} d`;
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function formatDateLong(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
