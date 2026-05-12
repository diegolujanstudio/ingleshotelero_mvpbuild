import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/site/Footer";
import { PILOT } from "@/content/forms";

/**
 * Landing after Netlify Forms accepts the /contacto submission.
 * Reachable via the form's `action="/contacto/gracias"` after a successful POST.
 */
export const metadata: Metadata = {
  title: PILOT.thanks.meta.title,
  description: PILOT.thanks.meta.description,
  robots: { index: false, follow: true },
};

export default function ContactoGraciasPage() {
  const t = PILOT.thanks;

  return (
    <main className="bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <Link
          href={t.backHomeHref}
          className="caps text-espresso transition-colors hover:text-ink"
        >
          {t.backHome}
        </Link>
      </header>

      <section className="mx-auto max-w-shell px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">
        <div className="max-w-[42rem] rounded-md border border-hair bg-white p-8 md:p-12">
          <p className="caps mb-3 text-success">{t.eyebrow}</p>
          <h1 className="font-serif text-[clamp(2rem,4.5vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.02em] text-espresso">
            {t.headline.before}
            <em>{t.headline.em}</em>
            {t.headline.after}
          </h1>
          <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
            {t.body}
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-hair pt-8">
            {t.secondary.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="caps inline-flex items-center text-ink underline-offset-4 hover:underline"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
