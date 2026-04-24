import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { Logo } from "@/components/brand/Logo";
import { NumberedPlaceholder } from "@/components/brand/NumberedPlaceholder";
import { formatIndex } from "@/lib/utils";
import {
  NAV,
  PILOT_MAILTO,
  HERO,
  SITUATION,
  FAILURES,
  MODEL,
  PILLARS,
  LOOP,
  MODULES,
  FAQ,
  PILOT,
  FINAL_CTA,
} from "@/content/landing";

/**
 * Landing page — HR-facing, conversion-focused, editorial voice.
 * All copy lives in `src/content/landing.ts` so Diego can iterate
 * on language without touching JSX. Design tokens from `.orcha/design-system.md`.
 */
export default function LandingPage() {
  return (
    <main className="bg-ivory text-espresso">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-t-label text-espresso hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <ButtonLink href={PILOT_MAILTO} variant="primary" size="md">
            Pedir piloto
          </ButtonLink>
        </nav>
      </header>

      {/* ── 01 · Hero ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24">
        <p className="caps mb-10">{HERO.eyebrow}</p>
        <h1 className="max-w-[22ch] font-serif text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1] tracking-[-0.025em]">
          {HERO.headline.before}
          <em>{HERO.headline.em}</em>
        </h1>
        <p className="mt-10 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {HERO.sub}
        </p>

        <div className="mt-12 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
          <ButtonLink href={PILOT_MAILTO} variant="primary" size="lg">
            {HERO.primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="#como" variant="ghost" size="lg">
            {HERO.secondaryCta}
          </ButtonLink>
        </div>

        <div className="mt-20">
          <NumberedPlaceholder index={1} caption={HERO.figureCaption} aspect="wide" />
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 02 · La situación ─────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead
          num="02"
          title={
            <>
              <em>{SITUATION.headline.em}</em>
              {SITUATION.headline.after}
            </>
          }
          note="Un instructor, un turno, una hoja de asistencia firmada a mano."
        />
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-20">
          <div className="max-w-prose space-y-6">
            {SITUATION.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-sans text-t-body-lg text-espresso-soft"
                    : "font-serif text-t-h3 font-medium text-espresso"
                }
              >
                {i === 1 ? (
                  <>
                    Mientras tanto, el huésped de la 412 sigue pidiendo{" "}
                    <em>extra towels</em> con las manos.
                  </>
                ) : (
                  p
                )}
              </p>
            ))}
          </div>
          <div className="hidden w-[280px] shrink-0 md:block">
            <NumberedPlaceholder
              index={2}
              caption="guest mimes 'extra towels'"
              aspect="portrait"
            />
          </div>
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 03 · Tres fallas ──────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead num="03" title={FAILURES.headline} note={FAILURES.note} />
        <div className="grid gap-5 md:grid-cols-3">
          {FAILURES.items.map((item, i) => (
            <article
              key={item.label}
              className="flex flex-col gap-4 rounded-md border border-hair bg-white p-6"
            >
              <span className="caps">{formatIndex(i + 1)}</span>
              <h3 className="font-serif text-t-h3 font-medium">{item.label}</h3>
              <p className="font-sans text-t-body text-espresso-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 04 · El modelo ────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead
          num="04"
          title={
            <>
              {MODEL.headline.before}
              <em>{MODEL.headline.em}</em>
            </>
          }
          note="Sin intuición. Con reporte."
        />
        <div className="grid gap-10 md:grid-cols-2 md:gap-20">
          {MODEL.paragraphs.map((p, i) => (
            <p key={i} className="max-w-prose font-sans text-t-body-lg text-espresso-soft">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-12 font-serif text-t-h3 font-medium">{MODEL.coda}</p>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 05 · Pilares ──────────────────────────────────────── */}
      <section id="por-que" className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead num="05" title={PILLARS.headline} note={PILLARS.note} />
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          {PILLARS.items.map((pillar, i) => (
            <article key={pillar.title}>
              <NumberedPlaceholder index={i + 1} caption={pillar.caption} aspect="4/3" />
              <div className="mt-6 space-y-3">
                <h3 className="font-serif text-t-h3 font-medium">{pillar.title}</h3>
                <p className="font-sans text-t-body text-espresso-soft">{pillar.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 06 · Ciclo diario ─────────────────────────────────── */}
      <section id="como" className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead
          num="06"
          title={
            <>
              {LOOP.headline.before}
              <em>{LOOP.headline.em}</em>
            </>
          }
          note={LOOP.note}
        />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {LOOP.steps.map((step, i) => (
            <li
              key={step.label}
              className="flex flex-col gap-4 rounded-md border border-hair bg-white p-6"
            >
              <div className="flex items-baseline justify-between">
                <span className="caps">Paso {formatIndex(i + 1)}</span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink">
                  {step.time}
                </span>
              </div>
              <h3 className="font-serif text-t-h3 font-medium">{step.label}</h3>
              <p className="font-sans text-t-body text-espresso-soft">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="caps mt-10">{LOOP.coda}</p>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 07 · Módulos ──────────────────────────────────────── */}
      <section id="para-quien" className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead
          num="07"
          title={
            <>
              {MODULES.headline.before}
              <em>{MODULES.headline.em}</em>
            </>
          }
          note={MODULES.note}
        />
        <div className="grid gap-12 md:grid-cols-3">
          {MODULES.items.map((item, i) => (
            <article key={item.label}>
              <NumberedPlaceholder index={i + 1} caption={item.caption} aspect="portrait" />
              <div className="mt-6 space-y-3">
                <h3 className="font-serif text-t-h3 font-medium">{item.label}</h3>
                <p className="font-sans text-t-body text-espresso-soft">{item.body}</p>
                <p className="caps">{MODULES.footer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 08 · FAQ ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead
          num="08"
          title={
            <>
              <em>{FAQ.headline.em}</em>
              {FAQ.headline.after}
            </>
          }
          note="Lo que probablemente ya se está preguntando."
        />
        <dl className="divide-y divide-hair">
          {FAQ.items.map((item) => (
            <div
              key={item.q}
              className="grid gap-6 py-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12"
            >
              <dt className="font-serif text-t-h3 font-medium text-espresso">
                &ldquo;{item.q}&rdquo;
              </dt>
              <dd className="font-sans text-t-body-lg text-espresso-soft">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── 09 · Piloto ───────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-24 md:px-12 md:py-section-gap">
        <SectionHead
          num="09"
          title={
            <>
              {PILOT.headline.before}
              <em>{PILOT.headline.em}</em>
            </>
          }
          note="Sin tarjeta. Sin compromiso. Sin letra chica."
        />
        <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-20">
          <div className="space-y-8">
            <p className="font-sans text-t-body-lg text-espresso-soft">{PILOT.body}</p>
            <ul className="space-y-3">
              {PILOT.includes.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 border-t border-hair pt-3 font-sans text-t-body text-espresso"
                >
                  <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink">
                    {formatIndex(i + 1)}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-3">
              <ButtonLink href={PILOT_MAILTO} variant="accent" size="lg">
                {PILOT.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <span className="caps">{PILOT.fineprint}</span>
            </div>
          </div>
          <aside className="rounded-md border border-hair bg-white p-6">
            <p className="caps mb-3">Qué obtiene al final</p>
            <ol className="space-y-4 font-serif text-t-h3 font-medium text-espresso">
              <li>
                <em>01</em> · Datos
              </li>
              <li>
                <em>02</em> · Una decisión informada
              </li>
              <li>
                <em>03</em> · Empleados que ya están mejorando
              </li>
            </ol>
          </aside>
        </div>
      </section>

      {/* ── 10 · CTA final ────────────────────────────────────── */}
      <section className="bg-espresso text-ivory-light">
        <div className="mx-auto grid max-w-shell gap-10 px-6 py-24 md:grid-cols-[1fr_auto] md:items-end md:gap-20 md:px-12 md:py-section-gap">
          <div className="max-w-prose">
            <p className="caps mb-6 text-ivory-light/60">{FINAL_CTA.eyebrow}</p>
            <h2 className="font-serif text-t-h1 font-medium">
              {FINAL_CTA.headline.before}
              <em style={{ color: "#C3CDD8" }}>{FINAL_CTA.headline.em}</em>
            </h2>
            <p className="mt-8 font-sans text-t-body-lg text-ivory-light/80">
              {FINAL_CTA.sub}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href={PILOT_MAILTO} variant="accent" size="lg">
              {FINAL_CTA.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ivory-light/60">
              {FINAL_CTA.fineprint}
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="mx-auto max-w-shell px-6 py-12 md:px-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo showSub={false} />
          <p className="caps">© 2026 · Inglés Hotelero · hecho en México</p>
        </div>
      </footer>
    </main>
  );
}

/**
 * Consistent section head used throughout the landing: 80px number column +
 * flexible title + right-aligned note. Matches the DS `.section-head` pattern.
 */
function SectionHead({
  num,
  title,
  note,
}: {
  num: string;
  title: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="mb-16 grid items-baseline gap-6 border-b border-hair pb-[2.25rem] md:grid-cols-[80px_1fr_380px]">
      <div className="font-serif text-[1.75rem] font-medium leading-none tracking-tight text-ink">
        {num}
      </div>
      <h2 className="font-serif text-t-h2 font-medium">{title}</h2>
      {note && (
        <p className="font-sans text-t-caption text-espresso-muted md:text-right">
          {note}
        </p>
      )}
    </div>
  );
}
