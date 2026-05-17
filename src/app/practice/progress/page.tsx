import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getEmployeeSession } from "@/lib/auth/employee";
import { getEmployeeProgress } from "@/lib/practice/progress";
import { ROLE_LABELS } from "@/content/practice-drills";
import type { RoleModule } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mi progreso",
  description: "Tu progreso de inglés hotelero.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-hair bg-white p-5">
      <p className="caps mb-2 text-espresso-muted">{label}</p>
      <p className="font-serif text-[1.9rem] font-medium leading-none text-espresso">
        {value}
      </p>
      {sub && (
        <p className="mt-2 font-sans text-t-caption text-espresso-soft">{sub}</p>
      )}
    </div>
  );
}

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: { employee_id?: string };
}) {
  const session = await getEmployeeSession();
  const employeeId = session?.employee_id ?? searchParams.employee_id ?? null;

  const p = employeeId ? await getEmployeeProgress(employeeId) : null;

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/practice"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          Volver a practicar →
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10 md:px-12 md:py-14">
        <p className="caps mb-3">Mi progreso</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Lo que has <em>aprendido</em>.
        </h1>

        {!p || !p.has_data ? (
          <div className="mt-8 rounded-md border border-hair bg-white p-6">
            <p className="font-sans text-t-body-lg text-espresso-soft">
              Aún no hay datos suficientes. Completa tu práctica de hoy y aquí
              verás tu progreso: comprensión, tu nivel hablado y el vocabulario
              que vas dominando.
            </p>
            <div className="mt-5">
              <ButtonLink href="/practice" variant="primary">
                Empezar mi práctica
              </ButtonLink>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
              {p.total_drills} prácticas · {p.days_practiced} días · racha de{" "}
              <em>{p.current_streak}</em>{" "}
              {p.current_streak === 1 ? "día" : "días"}.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              <Stat
                label="Comprensión"
                value={p.listening_pct === null ? "—" : `${p.listening_pct}%`}
                sub={
                  p.listening_recent_pct !== null
                    ? `Últimos 7 días: ${p.listening_recent_pct}%`
                    : undefined
                }
              />
              <Stat
                label="Nivel hablado"
                value={p.speaking_avg === null ? "—" : `${p.speaking_avg}`}
                sub={
                  p.speaking_recent !== null && p.speaking_prior !== null
                    ? p.speaking_recent >= p.speaking_prior
                      ? `▲ subiendo (${p.speaking_prior}→${p.speaking_recent})`
                      : `▼ bajó (${p.speaking_prior}→${p.speaking_recent})`
                    : p.speaking_recent !== null
                      ? `Últimos 7 días: ${p.speaking_recent}`
                      : "Habla en tu práctica para medirlo"
                }
              />
              <Stat
                label="Vocabulario"
                value={String(p.vocab_total)}
                sub="palabras repasadas"
              />
              <Stat
                label="Racha actual"
                value={`${p.current_streak}`}
                sub={`Mejor: ${p.longest_streak}`}
              />
              <Stat label="Días activos" value={`${p.days_practiced}`} />
              <Stat label="Prácticas" value={`${p.total_drills}`} />
            </div>

            {p.by_module.length > 0 && (
              <div className="mt-10">
                <p className="caps mb-3">Por área</p>
                <div className="space-y-2">
                  {p.by_module.map((m) => (
                    <div
                      key={m.module}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-hair bg-white px-4 py-3"
                    >
                      <p className="font-serif text-t-body font-medium text-espresso">
                        {ROLE_LABELS[m.module as RoleModule] ?? m.module}
                      </p>
                      <div className="flex gap-x-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-soft">
                        <span>{m.drills} prácticas</span>
                        <span>
                          comprensión{" "}
                          {m.listening_pct === null ? "—" : `${m.listening_pct}%`}
                        </span>
                        <span>
                          habla{" "}
                          {m.speaking_avg === null ? "—" : m.speaking_avg}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <p className="caps mb-3">Actividad reciente</p>
              <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
                {p.recent.map((r, i) => (
                  <li
                    key={`${r.drill_id}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
                  >
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-soft">
                      {new Date(r.completed_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      · {r.level} ·{" "}
                      {ROLE_LABELS[r.module as RoleModule] ?? r.module}
                    </span>
                    <span className="flex gap-x-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                      <span
                        className={
                          r.listening_correct
                            ? "text-success"
                            : r.listening_correct === false
                              ? "text-error"
                              : ""
                        }
                      >
                        {r.listening_correct === null
                          ? "—"
                          : r.listening_correct
                            ? "✓ comprensión"
                            : "✗ comprensión"}
                      </span>
                      <span>
                        habla {r.speaking_score === null ? "—" : r.speaking_score}
                      </span>
                      <span>+{r.vocab_known} voc.</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <ButtonLink href="/practice" variant="primary">
                Seguir practicando
              </ButtonLink>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
