import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

/**
 * `/` — product entry point.
 *
 * This is NOT a marketing landing page. Marketing lives on the separate
 * Astro site at ingleshotelero.com. This page is the front door of the
 * product app — the equivalent of any SaaS sign-in screen.
 *
 * Two paths:
 *   1. Hotel admin → /hr/login (sign in to the dashboard)
 *   2. Employee   → waits for a personal exam link from their HR manager
 *                   (we deliberately do NOT expose a hotel finder here —
 *                   the exam URL is supposed to be hotel-scoped and
 *                   distributed by HR, not discoverable by anyone)
 *
 * Plus a small back-link to the marketing site for visitors who landed
 * here by accident.
 */

export const metadata: Metadata = {
  title: "Inglés Hotelero · Plataforma",
  description:
    "Plataforma de evaluación y capacitación de inglés para personal hotelero. Acceso para administradores y empleados.",
  robots: { index: false, follow: false },
};

export default function AppEntry() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory text-espresso">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="mx-auto flex w-full max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <a
          href="https://ingleshotelero.com"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          ingleshotelero.com →
        </a>
      </header>

      {/* ── Centered card ────────────────────────────────────── */}
      <section className="mx-auto flex w-full max-w-shell flex-1 items-center justify-center px-6 py-16 md:px-12">
        <div className="w-full max-w-[520px]">
          <p className="caps mb-6">Plataforma · Acceso</p>
          <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            La plataforma de <em>Inglés Hotelero</em>.
          </h1>
          <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
            Evaluación, capacitación y reportes de inglés hotelero por puesto.
            Para administradores de hotel y para empleados con un enlace de
            evaluación.
          </p>

          {/* Primary action — admin login */}
          <div className="mt-12 rounded-md border border-hair bg-white p-6 md:p-7">
            <p className="caps mb-2">Soy administrador de hotel</p>
            <h2 className="font-serif text-[1.25rem] font-medium text-espresso">
              Entrar al dashboard de Recursos Humanos
            </h2>
            <p className="mt-2 font-sans text-t-body text-espresso-soft">
              Acceso por invitación únicamente. Use el enlace que recibió por
              correo, o inicie sesión con su contraseña.
            </p>
            <div className="mt-5">
              <Link
                href="/hr/login"
                className="inline-flex h-11 items-center gap-2 rounded-pill bg-espresso px-5 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft"
              >
                Iniciar sesión
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Secondary — employee context */}
          <div className="mt-4 rounded-md border border-hair bg-ivory-soft p-6 md:p-7">
            <p className="caps mb-2 text-espresso-muted">Soy empleado</p>
            <p className="font-sans text-t-body text-espresso-soft">
              Su gerente de Recursos Humanos le compartirá un enlace personal
              para tomar el examen, con la dirección de su hotel. El examen
              dura quince minutos y se puede pausar y retomar.
            </p>
          </div>

          {/* Tertiary footer row — links */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hair pt-6">
            <Link
              href="/aviso-de-privacidad"
              className="caps text-espresso-muted transition-colors hover:text-ink"
            >
              Aviso de privacidad
            </Link>
            <Link
              href="/terminos"
              className="caps text-espresso-muted transition-colors hover:text-ink"
            >
              Términos
            </Link>
            <a
              href="mailto:hola@ingleshotelero.com"
              className="caps text-espresso-muted transition-colors hover:text-ink"
            >
              Soporte
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-shell px-6 pb-8 md:px-12 md:pb-10">
        <p className="caps text-espresso-muted">
          © 2026 · Inglés Hotelero · LFPDPPP · México
        </p>
      </footer>
    </main>
  );
}
