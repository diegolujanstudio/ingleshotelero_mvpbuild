import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { getInsights } from "@/lib/masteros/insights";
import { getRevenue } from "@/lib/masteros/revenue";

/**
 * Command Center — the founder's 8am glance. One band at the top of
 * Master OS that answers "is the company winning today?" and links into
 * every pillar. Server-rendered; reuses the same aggregation libs as the
 * dedicated pages (single source of truth).
 */

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

async function counts() {
  const sb = createServiceClient();
  let newLeads = 0;
  let pendingTasks = 0;
  if (sb) {
    try {
      const [{ count: l }, { count: t }] = await Promise.all([
        sb
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        sb
          .from("ops_tasks")
          .select("id", { count: "exact", head: true })
          .neq("status", "done"),
      ]);
      newLeads = l ?? 0;
      pendingTasks = t ?? 0;
    } catch {
      /* keep zeros */
    }
  }
  return { newLeads, pendingTasks };
}

function Cell({
  href,
  label,
  value,
  tone,
}: {
  href: string;
  label: string;
  value: string;
  tone?: "alert";
}) {
  return (
    <Link
      href={href}
      className="group rounded-md border border-hair bg-white p-4 transition-colors hover:border-ink/40"
    >
      <p className="caps mb-2 text-espresso-muted group-hover:text-ink">
        {label}
      </p>
      <p
        className={
          tone === "alert"
            ? "font-serif text-[1.7rem] font-medium leading-none text-error"
            : "font-serif text-[1.7rem] font-medium leading-none text-espresso"
        }
      >
        {value}
      </p>
    </Link>
  );
}

export async function CommandCenter() {
  const [ins, rev, c] = await Promise.all([
    getInsights(),
    getRevenue(),
    counts(),
  ]);

  return (
    <div className="mx-auto max-w-shell px-6 pt-8 md:px-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Command Center
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        ¿Vamos <em>ganando</em>?
      </h1>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Cell
          href="/masteros/leads"
          label="Leads nuevos"
          value={String(c.newLeads)}
          tone={c.newLeads > 0 ? "alert" : undefined}
        />
        <Cell
          href="/masteros/revenue"
          label="MRR estimado"
          value={fmt(rev.mrr_estimate)}
        />
        <Cell
          href="/masteros/outcomes"
          label="Clientes en riesgo"
          value={String(ins.at_risk_count)}
          tone={ins.at_risk_count > 0 ? "alert" : undefined}
        />
        <Cell
          href="/masteros/outcomes"
          label="Aprendices activos 7d"
          value={String(ins.active_7d)}
        />
        <Cell
          href="/masteros/tasks"
          label="Tareas pendientes"
          value={String(c.pendingTasks)}
        />
        <Cell
          href="/masteros/audit"
          label="Nivel hablado prom."
          value={ins.speaking_avg === null ? "—" : String(ins.speaking_avg)}
        />
      </div>
    </div>
  );
}
