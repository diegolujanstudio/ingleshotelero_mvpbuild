import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { NumberTrainer } from "@/components/practice/NumberTrainer";
import { MODES_COPY } from "@/content/practice-modes";
import type { CEFRLevel } from "@/lib/supabase/types";

/**
 * /practice/numeros — infinite listening drill for rooms, prices, times.
 *
 * Same page grammar as /practice/pronunciacion: header with an escape route,
 * eyebrow, one-line title, the drill above the fold at 375px, single column.
 * Level comes from ?level= (the practice hub links carry it); defaults A2.
 */

export const metadata: Metadata = {
  title: "Números y horas",
  description:
    "Entrenamiento de oído para números de cuarto, precios y horarios en inglés.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const COPY = MODES_COPY.numeros;
const VALID: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

export default function NumerosPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level: CEFRLevel = VALID.includes(searchParams.level as CEFRLevel)
    ? (searchParams.level as CEFRLevel)
    : "A2";

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <Logo className="min-h-[44px] items-center" />
        <Link
          href="/practice"
          aria-label={COPY.back}
          className="caps inline-flex min-h-[44px] items-center text-espresso transition-colors hover:text-ink"
        >
          Salir
        </Link>
      </header>

      <section className="mx-auto max-w-[40rem] px-6 py-8 md:py-12">
        <p className="caps mb-4 text-espresso-muted">{COPY.eyebrow}</p>
        <h1 className="font-serif text-[clamp(1.5rem,4.5vw,2rem)] font-medium leading-tight tracking-[-0.02em]">
          {COPY.title}
        </h1>
        <p className="mt-3 font-sans text-t-body text-espresso-soft">
          {COPY.description}
        </p>

        <div className="mt-6">
          <NumberTrainer level={level} />
        </div>
      </section>
    </main>
  );
}
