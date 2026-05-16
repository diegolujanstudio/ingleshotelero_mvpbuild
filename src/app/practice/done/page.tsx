import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { StreakChip } from "@/components/practice/StreakChip";
import { StreakRibbon } from "@/components/practice/StreakRibbon";
import { PRACTICE_COPY } from "@/content/practice";

export const metadata: Metadata = {
  title: "Práctica completa",
  description: "Su práctica de hoy está completa.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { streak?: string; ticked?: string; vocab?: string };
}

/**
 * /practice/done — completion screen.
 *
 * Server component reading the result from URL params (the runner
 * pushes here after POST /api/practice/complete). No data fetching;
 * the streak count + ticked flag arrive via the URL so this page is
 * static-renderable and works without Supabase.
 */
export default function PracticeDonePage({ searchParams }: PageProps) {
  const streak = Math.max(0, Number(searchParams.streak ?? "0") | 0);
  const ticked = searchParams.ticked === "true";
  const vocab = Math.max(0, Number(searchParams.vocab ?? "0") | 0);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          {PRACTICE_COPY.intro.backHome}
        </Link>
      </header>

      <section className="mx-auto max-w-prose px-6 py-10 md:px-12 md:py-16">
        <p className={`caps mb-3 ${ticked ? "text-success" : "text-espresso-muted"}`}>
          {ticked ? PRACTICE_COPY.done.eyebrow : PRACTICE_COPY.done.eyebrowExtra}
        </p>

        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {ticked ? (
            <>
              Racha de <em>{streak}</em> {streak === 1 ? "día" : "días"}.
            </>
          ) : (
            <>{PRACTICE_COPY.done.titleExtra}</>
          )}
        </h1>

        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {ticked ? PRACTICE_COPY.done.notePrimary : PRACTICE_COPY.done.noteExtra}
        </p>

        {ticked && (
          <div className="mt-10">
            <StreakRibbon streak={streak} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/" variant="primary">
            {PRACTICE_COPY.done.home}
          </ButtonLink>
          <ButtonLink href="/practice" variant="text">
            {PRACTICE_COPY.done.again}
          </ButtonLink>
        </div>

        <div className="mt-12 border-t border-hair pt-8">
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-3">
            <div>
              <dt className="caps mb-1 text-espresso-muted">
                {PRACTICE_COPY.done.summary.current}
              </dt>
              <dd className="font-serif text-[1.6rem] font-medium text-espresso">
                <em>{streak}</em>
              </dd>
            </div>
            <div>
              <dt className="caps mb-1 text-espresso-muted">
                {PRACTICE_COPY.done.summary.reviewed}
              </dt>
              <dd className="font-serif text-[1.6rem] font-medium text-espresso">
                <em>{vocab}</em>
              </dd>
            </div>
            <div>
              <dt className="caps mb-1 text-espresso-muted">Hoy</dt>
              <dd>
                <StreakChip current={streak} />
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
