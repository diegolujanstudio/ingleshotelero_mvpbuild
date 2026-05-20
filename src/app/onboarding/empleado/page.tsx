import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Headphones, Mic, BookOpen, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Bienvenido · Tu práctica de inglés",
  description: "Cómo funciona tu práctica diaria de inglés hotelero.",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    icon: Headphones,
    title: "Escucha",
    body: "Oyes a un huésped hablar en inglés y eliges qué hacer. Como en tu turno real.",
  },
  {
    icon: Mic,
    title: "Habla",
    body: "Grabas tu respuesta. Te damos una nota y consejos para mejorar tu inglés hablado.",
  },
  {
    icon: BookOpen,
    title: "Refuerza",
    body: "Ves la frase modelo — exactamente cómo lo diría un profesional — y la repites.",
  },
  {
    icon: Layers,
    title: "Vocabulario",
    body: "Repasas palabras clave de tu puesto. Las repetimos en los días justos para que no se olviden.",
  },
];

export default function EmpleadoOnboarding() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link href="/onboarding" className="caps text-espresso transition-colors hover:text-ink">
          ← Volver
        </Link>
      </header>
      <section className="mx-auto max-w-2xl px-6 py-10 md:px-8 md:py-14">
        <p className="caps mb-3">Bienvenido · Empleado</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Cinco minutos al día. <em>Inglés que sí usas.</em>
        </h1>
        <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          No es una clase aburrida. Es práctica corta, real, para tu puesto en el
          hotel. Así funciona cada día:
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-md border border-hair bg-white p-5">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 text-ink" aria-hidden />
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                    Paso {i + 1}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-t-h3 font-medium text-espresso">
                  {s.title}
                </h2>
                <p className="mt-1.5 font-sans text-t-body text-espresso-soft">
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-md border border-hair bg-ivory-soft p-5">
          <p className="font-sans text-t-body text-espresso-soft">
            Tu racha crece cada día que practicas. Mantén tu racha y verás tu
            progreso real: comprensión, nivel hablado y vocabulario.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/practice" variant="primary">
            Empezar mi práctica
          </ButtonLink>
          <ButtonLink href="/practice/progress" variant="text">
            Ver mi progreso
          </ButtonLink>
        </div>
        <p className="mt-4 font-sans text-t-caption text-espresso-muted">
          ¿No tienes tu enlace? Pídeselo a tu equipo de Recursos Humanos.
        </p>
      </section>
    </main>
  );
}
