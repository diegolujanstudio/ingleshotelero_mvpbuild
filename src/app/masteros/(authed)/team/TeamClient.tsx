"use client";

import { useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";

interface Member {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "org_admin" | "property_admin" | "viewer";
  is_active: boolean;
  org_name: string | null;
  last_login_at: string | null;
}

const ROLES: { id: Member["role"]; label: string }[] = [
  { id: "super_admin", label: "Owner / Admin (equipo)" },
  { id: "org_admin", label: "Admin de organización" },
  { id: "property_admin", label: "Gerente de hotel" },
  { id: "viewer", label: "Solo lectura" },
];

export function TeamClient({ meId }: { meId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [invEmail, setInvEmail] = useState("");
  const [invName, setInvName] = useState("");
  const [invRole, setInvRole] = useState<Member["role"]>("viewer");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  function load() {
    fetch("/api/masteros/team")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function patch(id: string, p: Partial<Member>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...p } : m)));
    const res = await fetch(`/api/masteros/team/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(p),
    }).catch(() => null);
    if (!res || !res.ok) {
      setNote("No se pudo actualizar (revisa permisos / no puedes editarte a ti mismo).");
      load();
    }
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    if (!invEmail.trim() || !invName.trim()) return;
    setBusy(true);
    setNote(null);
    const res = await fetch("/api/hr/invite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: invEmail.trim(),
        name: invName.trim(),
        role: invRole,
      }),
    }).catch(() => null);
    if (res?.ok) {
      setNote(`Invitación enviada a ${invEmail.trim()}.`);
      setInvEmail("");
      setInvName("");
      load();
    } else {
      const j = await res?.json().catch(() => ({}));
      setNote(j?.error ?? "No se pudo invitar.");
    }
    setBusy(false);
  }

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Gobernanza
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Equipo &amp; <em>accesos</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        Quién puede entrar y con qué rol. Cada cambio queda en Auditoría.
      </p>

      <form
        onSubmit={invite}
        className="mt-6 grid gap-3 rounded-md border border-hair bg-white p-4 sm:grid-cols-[1fr_1fr_auto_auto]"
      >
        <input
          value={invName}
          onChange={(e) => setInvName(e.target.value)}
          placeholder="Nombre"
          className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
        />
        <input
          value={invEmail}
          onChange={(e) => setInvEmail(e.target.value)}
          type="email"
          placeholder="correo@equipo.com"
          className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
        />
        <select
          value={invRole}
          onChange={(e) => setInvRole(e.target.value as Member["role"])}
          className="h-10 rounded-md border border-hair bg-white px-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-soft"
        >
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy || !invEmail.trim() || !invName.trim()}
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white hover:bg-ink-deep disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          Invitar
        </button>
      </form>
      {note && (
        <p className="mt-2 font-sans text-t-caption text-espresso-soft">{note}</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-md border border-hair bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hair font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
              <th className="px-4 py-2.5">Miembro</th>
              <th className="px-4 py-2.5">Organización</th>
              <th className="px-4 py-2.5">Rol</th>
              <th className="px-4 py-2.5">Activo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 font-sans text-t-caption text-espresso-muted">
                  Cargando…
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-hair last:border-0 font-sans text-t-body text-espresso"
                >
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{m.name}</p>
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                      {m.email}
                      {m.id === meId ? " · tú" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[0.6875rem] text-espresso-soft">
                    {m.org_name ?? "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      value={m.role}
                      disabled={m.id === meId}
                      onChange={(e) =>
                        patch(m.id, { role: e.target.value as Member["role"] })
                      }
                      className="h-8 rounded-md border border-hair bg-white px-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      disabled={m.id === meId}
                      onClick={() => patch(m.id, { is_active: !m.is_active })}
                      className={
                        m.is_active
                          ? "rounded-pill border border-success/40 bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-success disabled:opacity-50"
                          : "rounded-pill border border-hair bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted disabled:opacity-50"
                      }
                    >
                      {m.is_active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
