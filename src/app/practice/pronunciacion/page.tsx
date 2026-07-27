import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MinimalPairTrainer } from "@/components/practice/MinimalPairTrainer";
import { CONTRASTS, CONTRAST_BY_ID, contrastForDay } from "@/content/minimal-pairs";

/**
 * /practice/pronunciacion — "La Semana Sin Pena".
 *
 * The opening move of the method (METODO-TURNO.md §5): week one teaches no
 * vocabulary and no grammar, it fixes the sounds that can embarrass you.
 *
 * It is also the sharpest thing we can put in front of a buyer. An HR director
 * who hears the problem explained once never forgets it, and immediately
 * understands why their staff go quiet around guests. So this route is
 * reachable without a session — `?c=` picks the contrast directly.
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

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/practice"
          aria-label="Volver a la práctica"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          Salir
        </Link>
      </header>

      <section className="mx-auto max-w-prose px-6 py-10 md:px-12 md:py-16">
        <div className="mb-8 border-b border-hair pb-4">
          <p className="caps text-espresso-muted">La Semana Sin Pena</p>
        </div>

        <h1 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {contrast.label_es}
        </h1>

        {/* Why it matters comes BEFORE the drill. Someone who does not know
            what is at stake will not spend two minutes a day on it. */}
        <div className="mt-6 rounded-md border border-hair bg-ivory-soft p-5">
          <p className="caps mb-2 text-espresso-muted">Por qué importa</p>
          <p className="font-sans text-t-body text-espresso-soft">{contrast.stakes_es}</p>
        </div>

        <p className="mt-6 max-w-prose font-sans text-t-body text-espresso-soft">
          {contrast.why_es}
        </p>

        <div className="mt-4 rounded-md border border-hair bg-white p-5">
          <p className="caps mb-2 text-ink">Cómo se hace el sonido</p>
          <p className="font-sans text-t-body text-espresso-soft">{contrast.how_es}</p>
        </div>

        <div className="mt-10">
          <MinimalPairTrainer contrast={contrast} />
        </div>

        <nav className="mt-12 border-t border-hair pt-6">
          <p className="caps mb-4 text-espresso-muted">Los cuatro sonidos</p>
          <ul className="flex flex-wrap gap-2">
            {CONTRASTS.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/practice/pronunciacion?c=${c.id}`}
                  className={
                    c.id === contrast.id
                      ? "inline-flex min-h-[44px] items-center rounded-full border border-espresso bg-espresso px-4 text-sm text-ivory"
                      : "inline-flex min-h-[44px] items-center rounded-full border border-hair px-4 text-sm text-espresso-soft transition-colors hover:border-ink hover:text-ink"
                  }
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
