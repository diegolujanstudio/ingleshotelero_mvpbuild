"use client";

import * as React from "react";
import { Mail, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EditDrawer } from "@/components/hr/EditDrawer";
import { TEAM } from "@/content/hr";
import type { HRRole } from "@/lib/supabase/types";
import type { HRTeamMember } from "@/lib/hr/demo-bridge";

interface Props {
  initial: HRTeamMember[];
  canInvite: boolean;
  callerRole: HRRole;
}

export function TeamClient({ initial, canInvite: canInviteAny, callerRole }: Props) {
  const [rows, setRows] = React.useState<HRTeamMember[]>(initial);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({
    name: "",
    email: "",
    role: "viewer" as HRRole,
  });
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Roles the current caller can grant — strictly below their own.
  const grantable: HRRole[] = (() => {
    const all: HRRole[] = ["super_admin", "org_admin", "property_admin", "viewer"];
    const ranks: Record<HRRole, number> = {
      super_admin: 4,
      org_admin: 3,
      property_admin: 2,
      viewer: 1,
    };
    return all.filter((r) => ranks[r] < ranks[callerRole]);
  })();

  async function send() {
    setBusy(true);
    setToast(null);
    try {
      const res = await fetch("/api/hr/invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        setToast({ kind: "err", text: TEAM.modal.error });
        return;
      }
      setRows((prev) => [
        {
          id: `pending-${Date.now()}`,
          email: draft.email,
          name: draft.name,
          role: draft.role,
          is_active: false,
          last_login_at: null,
          invite_sent_at: new Date().toISOString(),
          is_demo: false,
        },
        ...prev,
      ]);
      setToast({ kind: "ok", text: TEAM.modal.sent });
      setOpen(false);
      setDraft({ name: "", email: "", role: "viewer" });
    } catch {
      setToast({ kind: "err", text: TEAM.modal.error });
    } finally {
      setBusy(false);
    }
  }

  const columns = React.useMemo<ColumnDef<HRTeamMember>[]>(
    () => [
      {
        accessorKey: "name",
        header: TEAM.table.name,
        cell: ({ row }) => (
          <div>
            <p className="font-serif text-t-body font-medium text-espresso">{row.original.name}</p>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: TEAM.table.email,
        cell: ({ row }) => (
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-muted">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: TEAM.table.role,
        cell: ({ row }) => <Badge tone="soft">{TEAM.role[row.original.role]}</Badge>,
      },
      {
        accessorKey: "last_login_at",
        header: TEAM.table.lastLogin,
        cell: ({ row }) => (
          <span className="caps">
            {row.original.last_login_at
              ? new Date(row.original.last_login_at).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                })
              : TEAM.never}
          </span>
        ),
      },
      {
        accessorKey: "is_active",
        header: TEAM.table.status,
        cell: ({ row }) => (
          <Badge
            tone={row.original.is_active ? "success" : row.original.invite_sent_at ? "warn" : "neutral"}
          >
            {row.original.is_active
              ? TEAM.status.active
              : row.original.invite_sent_at
                ? TEAM.status.pending
                : TEAM.status.inactive}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {toast && (
          <span
            className={
              "font-mono text-[0.625rem] uppercase tracking-[0.14em] " +
              (toast.kind === "ok" ? "text-success" : "text-error")
            }
          >
            {toast.text}
          </span>
        )}
        <div className="flex flex-1 justify-end">
          {canInviteAny && (
            <Button variant="primary" onClick={() => setOpen(true)}>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {TEAM.actions.invite}
            </Button>
          )}
        </div>
      </div>

      <DenseDataTable data={rows} columns={columns} emptyMessage={TEAM.empty} pageSize={25} />

      <EditDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={TEAM.modal.title}
        eyebrow="NUEVO USUARIO"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
              {TEAM.modal.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={send}
              disabled={busy || !draft.email.trim() || !draft.name.trim()}
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              {busy ? TEAM.modal.sending : TEAM.modal.send}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={TEAM.modal.name}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            label={TEAM.modal.email}
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
          <div>
            <label className="caps mb-2 block">{TEAM.modal.role}</label>
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value as HRRole })}
              className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
            >
              {grantable.map((r) => (
                <option key={r} value={r}>
                  {TEAM.role[r]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </EditDrawer>
    </div>
  );
}
