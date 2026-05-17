import { requireSuperAdmin } from "@/lib/masteros/auth";
import { getInsights } from "@/lib/masteros/insights";

export const dynamic = "force-dynamic";

function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-hair bg-white p-5">
      <p className="caps mb-2 text-espresso-muted">{label}</p>
      <p className="font-serif text-[1.8rem] font-medium leading-none text-espresso">
        {value}
      </p>
      {sub && (
        <p className="mt-2 font-sans text-t-caption text-espresso-soft">{sub}</p>
      )}
    </div>
  );
}

export default async function OutcomesPage() {
  await requireSuperAdmin();
  const d = await getInsights();

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Resultados
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Aprendizaje &amp; <em>salud de clientes</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        La prueba de que el producto funciona — y el radar de retención.
      </p>

      {!d.has_data ? (
        <div className="mt-8 rounded-md border border-hair bg-white p-6">
          <p className="font-sans text-t-body text-espresso-soft">
            Aún no hay actividad suficiente. En cuanto los empleados practiquen,
            aquí verás resultados de aprendizaje y la salud de cada hotel.
          </p>
        </div>
      ) : (
        <>
          {/* ── Learning outcomes ── */}
          <p className="caps mb-3 mt-9">Resultados de aprendizaje</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPI label="Aprendices" value={String(d.learners_total)} />
            <KPI
              label="Activados"
              value={String(d.activated)}
              sub={
                d.learners_total
                  ? `${Math.round((d.activated / d.learners_total) * 100)}% de invitados`
                  : undefined
              }
            />
            <KPI
              label="Con hábito"
              value={String(d.habitual)}
              sub="≥3 días practicados"
            />
            <KPI label="Activos 7d" value={String(d.active_7d)} />
            <KPI
              label="Comprensión"
              value={d.listening_pct === null ? "—" : `${d.listening_pct}%`}
            />
            <KPI
              label="Nivel hablado"
              value={d.speaking_avg === null ? "—" : String(d.speaking_avg)}
            />
            <KPI label="Vocabulario" value={String(d.vocab_total)} />
            <KPI label="Exámenes" value={String(d.exams_completed)} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-hair bg-white p-5">
              <p className="caps mb-3">Niveles CEFR (empleados)</p>
              {Object.keys(d.cefr).length === 0 ? (
                <p className="font-sans text-t-caption text-espresso-muted">—</p>
              ) : (
                <ul className="space-y-1.5">
                  {Object.entries(d.cefr)
                    .sort()
                    .map(([lvl, n]) => (
                      <li
                        key={lvl}
                        className="flex justify-between font-mono text-[0.75rem] uppercase tracking-[0.14em] text-espresso-soft"
                      >
                        <span>{lvl}</span>
                        <span className="tabular-nums">{n}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <div className="rounded-md border border-hair bg-white p-5">
              <p className="caps mb-1">Drills más difíciles</p>
              <p className="mb-3 font-sans text-t-caption text-espresso-muted">
                Baja comprensión = contenido a revisar/editar.
              </p>
              {d.hardest_drills.length === 0 ? (
                <p className="font-sans text-t-caption text-espresso-muted">
                  Sin datos suficientes todavía.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {d.hardest_drills.map((x) => (
                    <li
                      key={x.drill_id}
                      className="flex justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em]"
                    >
                      <span className="text-espresso-soft">{x.drill_id}</span>
                      <span
                        className={
                          x.listening_pct < 50
                            ? "text-error"
                            : "text-espresso-muted"
                        }
                      >
                        {x.listening_pct}% · {x.attempts} intentos
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Customer health ── */}
          <div className="mt-10 flex items-baseline justify-between">
            <p className="caps">Salud de clientes</p>
            {d.at_risk_count > 0 && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
                {d.at_risk_count} en riesgo
              </span>
            )}
          </div>
          <div className="mt-3 overflow-x-auto rounded-md border border-hair bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hair font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                  <th className="px-4 py-2.5">Hotel / grupo</th>
                  <th className="px-4 py-2.5">Ubic.</th>
                  <th className="px-4 py-2.5">Empleados</th>
                  <th className="px-4 py-2.5">Activos 7d</th>
                  <th className="px-4 py-2.5">Habla</th>
                  <th className="px-4 py-2.5">Exám.</th>
                  <th className="px-4 py-2.5">Salud</th>
                </tr>
              </thead>
              <tbody>
                {d.orgs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-4 font-sans text-t-caption text-espresso-muted"
                    >
                      Sin clientes con actividad.
                    </td>
                  </tr>
                ) : (
                  d.orgs.map((o) => (
                    <tr
                      key={o.org_id}
                      className="border-b border-hair last:border-0 font-sans text-t-body text-espresso"
                    >
                      <td className="px-4 py-2.5">
                        {o.org_name}
                        {o.at_risk && (
                          <span className="ml-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-error">
                            en riesgo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">{o.properties}</td>
                      <td className="px-4 py-2.5 tabular-nums">{o.employees}</td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {o.active_7d} ({o.active_pct}%)
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {o.speaking_avg ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {o.exams_completed}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={
                            o.health >= 60
                              ? "font-mono text-[0.75rem] tabular-nums text-success"
                              : o.health >= 30
                                ? "font-mono text-[0.75rem] tabular-nums text-warn"
                                : "font-mono text-[0.75rem] tabular-nums text-error"
                          }
                        >
                          {o.health}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
