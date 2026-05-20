import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Building2, GraduationCap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Bienvenido · Inglés Hotelero",
  description: "Empieza con Inglés Hotelero — para hoteles y para empleados.",
};

export default function OnboardingHub() {
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link href="/" className="caps text-espresso transition-colors hover:text-ink">
          Inglés Hotelero
        </Link>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <p className="caps mb-3">Bienvenido</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          ¿Por dónde <em>empezamos</em>?
        </h1>
        <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Elige tu camino. Te guiamos paso a paso.
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <Link
            href="/onboarding/cliente"
            className="group rounded-md border border-hair bg-white p-6 transition-colors hover:border-ink/40"
          >
            <Building2 className="h-6 w-6 text-ink" aria-hidden />
            <h2 className="mt-4 font-serif text-t-h3 font-medium text-espresso">
              Soy un hotel
            </h2>
            <p className="mt-2 font-sans text-t-body text-espresso-soft">
              Quiero capacitar a mi equipo. Cómo arrancamos tu propiedad.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink group-hover:gap-2">
              Empezar como hotel <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/onboarding/empleado"
            className="group rounded-md border border-hair bg-white p-6 transition-colors hover:border-ink/40"
          >
            <GraduationCap className="h-6 w-6 text-ink" aria-hidden />
            <h2 className="mt-4 font-serif text-t-h3 font-medium text-espresso">
              Soy empleado
            </h2>
            <p className="mt-2 font-sans text-t-body text-espresso-soft">
              Voy a aprender inglés para mi puesto. Cómo funciona tu práctica.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink group-hover:gap-2">
              Empezar como empleado <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
