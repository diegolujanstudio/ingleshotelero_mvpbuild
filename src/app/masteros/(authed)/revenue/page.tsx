import { requireSuperAdmin } from "@/lib/masteros/auth";
import { getRevenue } from "@/lib/masteros/revenue";

export const dynamic = "force-dynamic";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

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

const STAGE_LABEL: Record<string, string> = {
  new: "Nuevos",
  contacted: "Contactados",
  qualified: "Calificados",
  closed: "Ganados",
};

export default async function RevenuePage() {
  await requireSuperAdmin();
  const r = await getRevenue();

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Ingresos
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Pipeline &amp; <em>ingresos</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        MRR estimado por plan + embudo de ventas. Conecta Stripe para
        cifras exactas (clave pendiente) — el modelo ya está aquí.
      </p>

      {!r.has_data ? (
        <div className="mt-8 rounded-md border border-hair bg-white p-6">
          <p className="font-sans text-t-body text-espresso-soft">
            Aún no hay organizaciones ni leads suficientes para calcular
            ingresos. En cuanto entren clientes y leads, esto se llena solo.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPI label="MRR estimado" value={fmt(r.mrr_estimate)} sub="por mes" />
            <KPI label="ARR estimado" value={fmt(r.arr_estimate)} sub="anualizado" />
            <KPI label="Clientes de pago" value={String(r.active_customers)} />
            <KPI
              label="Ingreso en riesgo"
              value={fmt(r.at_risk_revenue)}
              sub="past due / cancelado"
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-hair bg-white p-5">
              <p className="caps mb-3">MRR por plan</p>
              {r.by_tier.length === 0 ? (
                <p className="font-sans text-t-caption text-espresso-muted">—</p>
              ) : (
                <ul className="space-y-1.5">
                  {r.by_tier.map((t) => (
                    <li
                      key={t.tier}
                      className="flex justify-between font-mono text-[0.75rem] uppercase tracking-[0.14em] text-espresso-soft"
                    >
                      <span className="capitalize">
                        {t.tier} · {t.count}
                      </span>
                      <span className="tabular-nums text-espresso">
                        {fmt(t.mrr)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-md border border-hair bg-white p-5">
              <p className="caps mb-3">Estado de suscripción</p>
              <ul className="space-y-1.5">
                {r.by_status.map((s) => (
                  <li
                    key={s.status}
                    className="flex justify-between font-mono text-[0.75rem] uppercase tracking-[0.14em] text-espresso-soft"
                  >
                    <span>{s.status}</span>
                    <span className="tabular-nums">{s.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="caps mb-3 mt-10">
            Embudo de ventas
            {r.lead_conversion_pct !== null && (
              <span className="ml-3 text-espresso-muted">
                conversión {r.lead_conversion_pct}%
              </span>
            )}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {r.funnel.map((f) => (
              <div
                key={f.stage}
                className="rounded-md border border-hair bg-white p-5"
              >
                <p className="caps mb-2 text-espresso-muted">
                  {STAGE_LABEL[f.stage] ?? f.stage}
                </p>
                <p className="font-serif text-[1.8rem] font-medium leading-none text-espresso">
                  {f.count}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
