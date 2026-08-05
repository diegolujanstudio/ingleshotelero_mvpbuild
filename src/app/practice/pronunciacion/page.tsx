import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MinimalPairTrainer } from "@/components/practice/MinimalPairTrainer";
import { ContrastIntro } from "@/components/practice/ContrastIntro";
import {
  CONTRASTS,
  CONTRAST_BY_ID,
  contrastForDay,
  isPerceptionContrast,
} from "@/content/minimal-pairs";
import { cn } from "@/lib/utils";

/**
 * /practice/pronunciacion — "La Semana Sin Pena".
 *
 * LAYOUT ORDER IS THE DESIGN (each choice cited, none random):
 *
 *   1. Sound identity chips  — the contrast, visible without reading
 *   2. Context, COLLAPSED    — "¿Por qué importa?" one tap away, never a wall
 *   3. The drill             — reachable without scrolling on a 375px phone
 *   4. Contrast switcher     — pills, 44px targets
 *
 * Why: NN/g lower-literacy (n=50) — simplification moved task success
 * 46%→82%; these users lose concentration when scrolling, and the old layout
 * put three mandatory paragraphs between them and the exercise. Dirksen: the
 * gap is motivation, and motivation comes from HEARING the contrast collide,
 * not from reading about it first. Every paragraph that remains carries an
 * audio twin (doctrine §2: "never require reading to succeed").
 *
 * Reachable without a session (?c=) so it can be demoed to a buyer cold.
 */

export const metadata: Metadata = {
  title: "Pronunciación · La Semana Sin Pena",
  description:
    "Entrenamiento de sonidos del inglés para hispanohablantes. Dos minutos al día.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { c?: string; day?: string };
}

export default function PronunciacionPage({ searchParams }: PageProps) {
  const byId = searchParams.c ? CONTRAST_BY_ID.get(searchParams.c as never) : undefined;
  const day = Number.parseInt(searchParams.day ?? "", 10);
  const contrast =
    byId ?? contrastForDay(Number.isFinite(day) && day > 0 ? day : 1);
  const perception = isPerceptionContrast(contrast);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <Logo className="min-h-[44px] items-center" />
        <Link
          href="/practice"
          aria-label="Volver a la práctica"
          className="caps inline-flex min-h-[44px] items-center text-espresso transition-colors hover:text-ink"
        >
          Salir
        </Link>
      </header>

      {/* max-w wider than prose on desktop so the trainer breathes; still a
          single column at every size — the doctrine bans multi-column on the
          learner surface. */}
      <section className="mx-auto max-w-[40rem] px-6 py-8 md:py-12">
        <p className="caps mb-4 text-espresso-muted">La Semana Sin Pena</p>

        {/* ── 1 · The sound pair, as identity — legible without reading ── */}
        <div className="flex items-center gap-3">
          <span className="flex h-14 min-w-[4.5rem] items-center justify-center rounded-md border border-ink bg-ink px-4 font-serif text-t-h3 font-medium text-white">
            {contrast.symbol_a}
          </span>
          <span className="caps text-espresso-muted">contra</span>
          <span
            className={cn(
              "flex h-14 min-w-[4.5rem] items-center justify-center rounded-md border px-4 font-serif text-t-h3 font-medium",
              perception
                ? "border-espresso text-espresso"
                : // For s-onset the second chip IS the mistake — struck through
                  // so the hierarchy is visible before a single word is read.
                  "border-error/50 text-error line-through decoration-error/60",
            )}
          >
            {contrast.symbol_b}
          </span>
        </div>
        <h1 className="mt-4 font-serif text-[clamp(1.5rem,4.5vw,2rem)] font-medium leading-tight tracking-[-0.02em]">
          {contrast.label_es}
        </h1>

        {/* ── 2 · Context: one tap away, audio twin on every paragraph ── */}
        <div className="mt-6">
          <ContrastIntro
            cards={[
              {
                id: "why",
                title: "¿Por qué importa este sonido?",
                paragraphs: [contrast.stakes_es, contrast.why_es],
              },
              {
                id: "how",
                title: "¿Cómo se hace con la boca?",
                paragraphs: [contrast.how_es],
              },
            ]}
          />
        </div>

        {/* ── 3 · The drill ── */}
        <div className="mt-6">
          <MinimalPairTrainer contrast={contrast} />
        </div>

        {/* ── 4 · The four sounds ── */}
        <nav className="mt-10 border-t border-hair pt-6" aria-label="Los cuatro sonidos">
          <p className="caps mb-4 text-espresso-muted">Los cuatro sonidos</p>
          <ul className="flex flex-wrap gap-2">
            {CONTRASTS.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/practice/pronunciacion?c=${c.id}`}
                  className={cn(
                    "inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm transition-colors",
                    c.id === contrast.id
                      ? "border-espresso bg-espresso text-ivory"
                      : "border-hair text-espresso-soft hover:border-ink hover:text-ink",
                  )}
                >
                  {c.label_es}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}
