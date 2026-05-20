import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Onboarding de hotel · Inglés Hotelero",
  description: "Cómo arranca tu hotel con Inglés Hotelero, paso a paso.",
};

const STEPS = [
  {
    n: "01",
    title: "Tu diagnóstico y cotización",
    body: "Llenas el examen de colocación (5 min): propiedades, áreas, equipo. Te enviamos un plan y precio a la medida en menos de 24 horas.",
    cta: { label: "Llenar examen de colocación", href: "/colocacion" },
  },
  {
    n: "02",
    title: "Activamos tu cuenta",
    body: "Confirmado el plan, creamos tu organización y tus propiedades (una por ubicación). Tú recibes acceso al panel de Recursos Humanos.",
    cta: { label: "Entrar a RH", href: "/hr/login" },
  },
  {
    n: "03",
    title: "Subes a tu equipo",
    body: "Desde el panel agregas empleados (uno por uno o en lote) y les envías su enlace personal por WhatsApp o correo — sin contraseñas.",
  },
  {
    n: "04",
    title: "Cada empleado toma su evaluación de nivel",
    body: "Una evaluación de 15 minutos ubica a cada persona en su nivel CEFR real (A1–B2). Con eso personalizamos su práctica.",
  },
  {
    n: "05",
    title: "Arranca la práctica diaria",
    body: "Cinco minutos al día por puesto: comprensión, práctica hablada con evaluación, refuerzo y vocabulario. Tú ves el progreso en reportes.",
    cta: { label: "Ver el dashboard de RH", href: "/hr/login" },
  },
];

export default function ClienteOnboarding() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link href="/onboarding" className="caps text-espresso transition-colors hover:text-ink">
          ← Volver
        </Link>
      </header>
      <section className="mx-auto max-w-2xl px-6 py-10 md:px-8 md:py-14">
        <p className="caps mb-3">Onboarding · Hotel</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          De cero a tu equipo <em>aprendiendo</em>.
        </h1>
        <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Cinco pasos. Sin instalaciones, sin contratos largos.
        </p>

        <ol className="mt-10 space-y-6">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-md border border-hair bg-white p-5 md:p-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[0.75rem] tabular-nums text-ink">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-t-h3 font-medium text-espresso">
                    {s.title}
                  </h2>
                  <p className="mt-1.5 font-sans text-t-body text-espresso-soft">
                    {s.body}
                  </p>
                  {s.cta && (
                    <div className="mt-3">
                      <ButtonLink href={s.cta.href} variant="ghost" size="md">
                        {s.cta.label}
                      </ButtonLink>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-md border border-ink-soft bg-ink-tint/40 p-6">
          <p className="caps mb-2 text-ink">¿Listo para empezar?</p>
          <p className="font-sans text-t-body text-espresso-soft">
            Empieza con tu examen de colocación — es gratis y sin compromiso.
          </p>
          <div className="mt-4">
            <ButtonLink href="/colocacion" variant="primary">
              Solicitar mi cotización
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
