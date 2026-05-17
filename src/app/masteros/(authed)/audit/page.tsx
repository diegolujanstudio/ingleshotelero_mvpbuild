import { requireSuperAdmin } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

interface AuditRow {
  id: string;
  actor_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}

export default async function AuditPage() {
  await requireSuperAdmin();
  const sb = createServiceClient();
  let rows: AuditRow[] = [];
  if (sb) {
    const { data } = await sb
      .from("ops_audit")
      .select("id, actor_email, action, entity, entity_id, detail, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    rows = (data as AuditRow[] | null) ?? [];
  }

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Gobernanza
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Registro de <em>auditoría</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        Cada cambio sensible queda registrado de forma inmutable: quién, qué
        y cuándo. Por eso es seguro dar accesos al equipo.
      </p>

      <div className="mt-6 overflow-x-auto rounded-md border border-hair bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hair font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
              <th className="px-4 py-2.5">Cuándo</th>
              <th className="px-4 py-2.5">Quién</th>
              <th className="px-4 py-2.5">Acción</th>
              <th className="px-4 py-2.5">Objeto</th>
              <th className="px-4 py-2.5">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 font-sans text-t-caption text-espresso-muted"
                >
                  Sin eventos registrados todavía.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-hair last:border-0 font-sans text-t-caption text-espresso"
                >
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-[0.625rem] text-espresso-muted">
                    {new Date(r.created_at).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2 text-espresso-soft">
                    {r.actor_email ?? "sistema"}
                  </td>
                  <td className="px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink">
                    {r.action}
                  </td>
                  <td className="px-4 py-2 font-mono text-[0.625rem] text-espresso-muted">
                    {r.entity}
                    {r.entity_id ? `·${String(r.entity_id).slice(0, 12)}` : ""}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-2 font-mono text-[0.625rem] text-espresso-muted">
                    {Object.keys(r.detail || {}).length
                      ? JSON.stringify(r.detail)
                      : "—"}
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
