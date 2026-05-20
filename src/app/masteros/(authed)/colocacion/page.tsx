import { requireSuperAdmin } from "@/lib/masteros/auth";
import { getPageContent } from "@/lib/server/page-content";
import { listLeads, type LeadRow } from "@/lib/server/leads";
import {
  COLOCACION_COPY_KEY,
  DEFAULT_COLOCACION_COPY,
  type ColocacionCopy,
} from "@/content/colocacion";
import { CopyEditor } from "./CopyEditor";

export const dynamic = "force-dynamic";

export default async function ColocacionAdminPage() {
  await requireSuperAdmin();
  const copy = await getPageContent<ColocacionCopy>(
    COLOCACION_COPY_KEY,
    DEFAULT_COLOCACION_COPY,
  );
  let rows: LeadRow[] = [];
  try {
    const res = await listLeads({ formName: "colocacion", limit: 50 });
    rows = res.rows;
  } catch {
    rows = [];
  }

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Captación
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Examen de <em>colocación</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        El diagnóstico que llenan los prospectos para que los cotices. Edita
        la página en vivo y revisa las solicitudes aquí.
      </p>
      <a
        href="https://ingleshotelero.netlify.app/colocacion"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
      >
        Ver / compartir la página en vivo →
      </a>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <CopyEditor initial={copy} />

        <div className="rounded-md border border-hair bg-white p-5">
          <p className="caps mb-3">
            Solicitudes recibidas · {rows.length}
          </p>
          {rows.length === 0 ? (
            <p className="font-sans text-t-caption text-espresso-muted">
              Aún no hay solicitudes. Comparte el link de arriba con prospectos.
            </p>
          ) : (
            <ul className="space-y-3">
              {rows.map((r) => {
                const m = (r.metadata ?? {}) as Record<string, unknown>;
                const areas = Array.isArray(m.areas)
                  ? (m.areas as string[]).join(", ")
                  : null;
                return (
                  <li
                    key={r.id}
                    className="rounded-md border border-hair p-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-serif text-t-body font-medium text-espresso">
                        {r.company ?? r.name ?? "—"}
                      </p>
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                        {new Date(r.created_at).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                      {[r.name, r.role, r.email, r.phone]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft">
                      {r.city && <span>{r.city}</span>}
                      {r.hotel_count != null && (
                        <span>{r.hotel_count} ubic.</span>
                      )}
                      {typeof m.team_size === "string" && (
                        <span>{m.team_size} empl.</span>
                      )}
                      {typeof m.timeline === "string" && (
                        <span>{m.timeline}</span>
                      )}
                    </div>
                    {areas && (
                      <p className="mt-1 font-sans text-t-caption text-espresso-soft">
                        Áreas: {areas}
                      </p>
                    )}
                    {r.message && (
                      <p className="mt-1 font-sans text-t-caption text-espresso-soft">
                        “{r.message}”
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
