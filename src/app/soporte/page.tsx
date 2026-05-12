import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/site/Footer";
import { SOPORTE } from "@/content/forms";
import { SupportForm } from "./SupportForm";

export const metadata: Metadata = {
  title: SOPORTE.meta.title,
  description: SOPORTE.meta.description,
};

export default function SoportePage() {
  return (
    <main className="bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          Volver al inicio
        </Link>
      </header>

      <section className="mx-auto max-w-shell px-6 pb-20 pt-16 md:px-12 md:pb-32 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,1.2fr)] md:gap-20">
          {/* ─── Left rail · context ─────────────────────────────── */}
          <div>
            <p className="caps mb-6">{SOPORTE.eyebrow}</p>
            <h1 className="max-w-[18ch] font-serif text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
              {SOPORTE.headline.before}
              <em>{SOPORTE.headline.em}</em>
              {SOPORTE.headline.after}
            </h1>
            <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
              {SOPORTE.sub}
            </p>
            <p className="mt-6 max-w-prose font-sans text-t-body text-espresso-soft">
              {SOPORTE.body}
            </p>

            <div className="mt-12 space-y-7 border-t border-hair pt-10">
              {SOPORTE.details.map((d) => (
                <Detail key={d.num} num={d.num} label={d.label} body={d.body} />
              ))}
            </div>
          </div>

          {/* ─── Right rail · form ───────────────────────────────── */}
          <div className="md:pt-2">
            <SupportForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Detail({
  num,
  label,
  body,
}: {
  num: string;
  label: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[40px_1fr] items-start gap-4">
      <p className="caps text-ink">{num}</p>
      <div>
        <p className="font-serif text-[1.1rem] font-medium leading-tight text-espresso">
          {label}
        </p>
        <p className="mt-1.5 font-sans text-t-body text-espresso-soft">{body}</p>
      </div>
    </div>
  );
}
