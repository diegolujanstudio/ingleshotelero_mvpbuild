"use client";

/**
 * Pitch deck renderer — interactive 20-slide presentation.
 *
 * Navigation:
 *   - Keyboard: → ↓ Space PageDown · ← ↑ PageUp · Home · End · F (fullscreen) · Esc (cover)
 *   - Click: right half advances · left half goes back · top-left corner returns to cover
 *   - Touch: horizontal swipe
 *   - URL hash: #1 … #20 (deep-linkable, syncs both ways)
 *
 * Each slide is full-viewport, ivory background. Layout switches on
 * the discriminated `kind` field from src/content/pitch.ts.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SLIDES, type Slide } from "@/content/pitch";

const TOTAL = SLIDES.length;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getInitialIndex(): number {
  if (typeof window === "undefined") return 0;
  const hash = window.location.hash.replace("#", "");
  const parsed = parseInt(hash, 10);
  if (Number.isFinite(parsed) && parsed >= 1 && parsed <= TOTAL) {
    return parsed - 1;
  }
  return 0;
}

export default function PitchDeck() {
  const [index, setIndex] = useState<number>(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Hydrate from URL hash on mount.
  useEffect(() => {
    setIndex(getInitialIndex());
  }, []);

  const goTo = useCallback((next: number) => {
    setIndex((current) => {
      const target = clamp(next, 0, TOTAL - 1);
      if (typeof window !== "undefined" && target !== current) {
        window.history.replaceState(null, "", `#${target + 1}`);
      }
      return target;
    });
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // Keyboard navigation.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(TOTAL - 1);
          break;
        case "Escape":
          e.preventDefault();
          goTo(0);
          break;
        case "f":
        case "F":
          if (
            typeof document !== "undefined" &&
            document.fullscreenEnabled &&
            !document.fullscreenElement
          ) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else if (typeof document !== "undefined" && document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, goTo]);

  // Listen to manual hash changes (back / forward buttons).
  useEffect(() => {
    const onHashChange = () => setIndex(getInitialIndex());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  const slide = SLIDES[index];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-ivory text-espresso"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Click zones — invisible halves of the screen for tap navigation.
          Slide controls (buttons, links, iframes) sit above this layer. */}
      <button
        type="button"
        aria-label="Diapositiva anterior"
        className="absolute inset-y-0 left-0 z-0 hidden w-[18%] cursor-w-resize md:block"
        onClick={prev}
      />
      <button
        type="button"
        aria-label="Siguiente diapositiva"
        className="absolute inset-y-0 right-0 z-0 hidden w-[18%] cursor-e-resize md:block"
        onClick={next}
      />

      {/* Slide canvas */}
      <main className="relative z-10 mx-auto flex min-h-screen max-w-shell flex-col px-6 pb-24 pt-10 md:px-12 md:pb-28 md:pt-14">
        <SlideHeader index={index} />
        <SlideBody slide={slide} />
      </main>

      {/* Bottom controls */}
      <SlideFooter index={index} prev={prev} next={next} goTo={goTo} />
    </div>
  );
}

/* ───────────────────────── Header / Footer ──────────────────────── */

function SlideHeader({ index }: { index: number }) {
  return (
    <header className="mb-10 flex items-baseline justify-between md:mb-14">
      <Link
        href="/"
        className="inline-flex items-baseline gap-3"
        aria-label="Inglés Hotelero — inicio"
      >
        <span className="font-serif text-[1.15rem] font-medium leading-none tracking-[-0.02em] md:text-[1.35rem]">
          Inglés <em>Hotelero</em>
        </span>
      </Link>
      <span className="caps">
        {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </header>
  );
}

function SlideFooter({
  index,
  prev,
  next,
  goTo,
}: {
  index: number;
  prev: () => void;
  next: () => void;
  goTo: (n: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
      {/* Progress bar */}
      <div className="h-px w-full bg-hair">
        <div
          className="h-px bg-ink transition-[width] duration-500 ease-editorial"
          style={{ width: `${((index + 1) / TOTAL) * 100}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-6 py-4 md:px-12">
        <div className="pointer-events-auto flex items-center gap-2">
          <NavButton onClick={prev} disabled={index === 0} label="Anterior">
            ←
          </NavButton>
          <NavButton onClick={next} disabled={index === TOTAL - 1} label="Siguiente">
            →
          </NavButton>
        </div>

        {/* Dot index — clickable jump-to */}
        <div className="pointer-events-auto hidden items-center gap-1.5 md:flex">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a diapositiva ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1 rounded-pill transition-all ease-editorial ${
                i === index ? "w-6 bg-ink" : "w-1.5 bg-hair hover:bg-espresso-muted"
              }`}
            />
          ))}
        </div>

        <span className="caps pointer-events-auto text-espresso-muted">
          ← / → para navegar
        </span>
      </div>
    </div>
  );
}

function NavButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-pill border border-hair bg-white font-serif text-[1.1rem] text-espresso transition-colors duration-200 ease-editorial hover:border-espresso/40 disabled:opacity-30 disabled:hover:border-hair"
    >
      {children}
    </button>
  );
}

/* ───────────────────────── Slide router ──────────────────────── */

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return <CoverSlide slide={slide} />;
    case "statement":
      return <StatementSlide slide={slide} />;
    case "triptych":
      return <TriptychSlide slide={slide} />;
    case "loop":
      return <LoopSlide slide={slide} />;
    case "demo":
      return <DemoSlide slide={slide} />;
    case "embed":
      return <EmbedSlide slide={slide} />;
    case "pricing":
      return <PricingSlide slide={slide} />;
    case "checklist":
      return <ChecklistSlide slide={slide} />;
    case "qa":
      return <QASlide slide={slide} />;
    case "cta":
      return <CTASlide slide={slide} />;
  }
}

/* ───────────────────────── Slide layouts ──────────────────────── */

type Headline = { before?: string; em: string; after?: string };

function HeadlineRender({
  h,
  size = "h1",
  className = "",
}: {
  h: Headline;
  size?: "display" | "h1" | "h2";
  className?: string;
}) {
  const sizeClasses =
    size === "display"
      ? "text-[clamp(2.5rem,8vw,4.5rem)] leading-[1] tracking-[-0.025em]"
      : size === "h1"
      ? "text-[clamp(2rem,6vw,3rem)] leading-[1.05] tracking-[-0.02em]"
      : "text-[clamp(1.5rem,4vw,2rem)] leading-[1.1] tracking-[-0.018em]";
  return (
    <h2
      className={`max-w-[20ch] font-serif font-medium ${sizeClasses} ${className}`}
    >
      {h.before}
      <em>{h.em}</em>
      {h.after}
    </h2>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="caps mb-6 block">{children}</p>;
}

/* ── 1. Cover ──────────────────────────────────────────── */
function CoverSlide({ slide }: { slide: Extract<Slide, { kind: "cover" }> }) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} size="display" />
      <p className="mt-10 max-w-prose font-sans text-t-body-lg text-espresso-soft md:text-[1.25rem]">
        {slide.sub}
      </p>
      {slide.footer ? (
        <p className="caps mt-16 text-espresso-muted">{slide.footer}</p>
      ) : null}
    </section>
  );
}

/* ── 2. Statement (eyebrow + headline + paragraphs + coda) ── */
function StatementSlide({
  slide,
}: {
  slide: Extract<Slide, { kind: "statement" }>;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} />
      <div className="mt-10 max-w-prose space-y-6">
        {slide.body.map((p, i) => (
          <p key={i} className="font-sans text-t-body-lg text-espresso-soft">
            {p}
          </p>
        ))}
      </div>
      {slide.coda ? (
        <p className="mt-12 max-w-prose font-serif text-[1.15rem] font-medium text-espresso">
          <em>{slide.coda}</em>
        </p>
      ) : null}
    </section>
  );
}

/* ── 3. Triptych (3-column comparison) ─────────────────── */
function TriptychSlide({
  slide,
}: {
  slide: Extract<Slide, { kind: "triptych" }>;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      {typeof slide.headline === "string" ? (
        <h2 className="max-w-[20ch] font-serif text-[clamp(2rem,6vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {slide.headline}
        </h2>
      ) : (
        <HeadlineRender h={slide.headline} />
      )}
      {slide.note ? (
        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {slide.note}
        </p>
      ) : null}
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {slide.items.map((item) => (
          <article
            key={item.label}
            className="rounded-md border border-hair bg-white p-6"
          >
            <h3 className="font-serif text-t-h3 font-medium text-espresso">
              {item.label}
            </h3>
            {item.caption ? (
              <p className="caps mt-1 text-espresso-muted">{item.caption}</p>
            ) : null}
            <p className="mt-4 font-sans text-t-body text-espresso-soft">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── 4. Loop (the daily 5-min cycle) ───────────────────── */
function LoopSlide({ slide }: { slide: Extract<Slide, { kind: "loop" }> }) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} />
      <ol className="mt-12 grid gap-5 md:grid-cols-4">
        {slide.steps.map((step, i) => (
          <li
            key={step.label}
            className="rounded-md border border-hair bg-white p-6"
          >
            <p className="caps text-espresso-muted">
              0{i + 1} · {step.time}
            </p>
            <h3 className="mt-3 font-serif text-t-h3 font-medium text-espresso">
              {step.label}
            </h3>
            <p className="mt-3 font-sans text-t-body text-espresso-soft">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
      {slide.coda ? (
        <p className="mt-10 max-w-prose font-sans text-t-body-lg text-espresso">
          {slide.coda}
        </p>
      ) : null}
    </section>
  );
}

/* ── 5. Demo (link out to a live route) ───────────────── */
function DemoSlide({ slide }: { slide: Extract<Slide, { kind: "demo" }> }) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} />
      <p className="mt-8 max-w-prose font-sans text-t-body-lg text-espresso-soft">
        {slide.sub}
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Link
          href={slide.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-espresso px-6 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft"
        >
          {slide.cta.label}
        </Link>
        {slide.secondary ? (
          <Link
            href={slide.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="caps inline-flex h-12 items-center px-2 text-ink underline-offset-4 hover:underline"
          >
            {slide.secondary.label}
          </Link>
        ) : null}
      </div>
      {slide.caption ? (
        <p className="caps mt-6 text-espresso-muted">{slide.caption}</p>
      ) : null}
    </section>
  );
}

/* ── 6. Embed (live iframe of an internal route) ──────── */
function EmbedSlide({ slide }: { slide: Extract<Slide, { kind: "embed" }> }) {
  return (
    <section className="flex flex-1 flex-col">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <div className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1fr),minmax(360px,420px)] md:gap-12">
        <div className="flex flex-col justify-center">
          <HeadlineRender h={slide.headline} size="h2" />
          {slide.sub ? (
            <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
              {slide.sub}
            </p>
          ) : null}
          <Link
            href={slide.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="caps mt-8 inline-flex w-fit items-center text-ink underline-offset-4 hover:underline"
          >
            {slide.ctaLabel}
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-lg border border-hair bg-white shadow-none">
          <div className="aspect-[9/19] w-full">
            <iframe
              src={slide.src}
              title={slide.headline.em}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7. Pricing (3 tiers) ──────────────────────────────── */
function PricingSlide({
  slide,
}: {
  slide: Extract<Slide, { kind: "pricing" }>;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} />
      {slide.note ? (
        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {slide.note}
        </p>
      ) : null}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {slide.tiers.map((tier) => (
          <article
            key={tier.name}
            className={`flex flex-col rounded-md border bg-white p-6 ${
              tier.featured ? "border-ink" : "border-hair"
            }`}
          >
            {tier.featured ? (
              <p className="caps mb-3 text-ink">Recomendado</p>
            ) : null}
            <h3 className="font-serif text-t-h3 font-medium text-espresso">
              {tier.name}
            </h3>
            <p className="mt-2 font-sans text-t-body text-espresso-soft">
              {tier.body}
            </p>
            <p className="mt-5 flex items-baseline gap-2">
              <span className="font-serif text-t-h2 font-medium text-espresso">
                {tier.price}
              </span>
              <span className="caps text-espresso-muted">{tier.cadence}</span>
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-hair pt-5">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 font-sans text-t-body text-espresso-soft"
                >
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── 8. Checklist (numbered ordered list, editorial) ──── */
function ChecklistSlide({
  slide,
}: {
  slide: Extract<Slide, { kind: "checklist" }>;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} />
      {slide.sub ? (
        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {slide.sub}
        </p>
      ) : null}
      <ol className="mt-10 max-w-prose space-y-5">
        {slide.items.map((item, i) => (
          <li key={i} className="flex items-baseline gap-5">
            <span className="caps shrink-0 text-espresso-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-sans text-t-body-lg text-espresso">
              {item}
            </span>
          </li>
        ))}
      </ol>
      {slide.footer ? (
        <p className="caps mt-10 text-espresso-muted">{slide.footer}</p>
      ) : null}
    </section>
  );
}

/* ── 9. QA (objection + answer) ───────────────────────── */
function QASlide({ slide }: { slide: Extract<Slide, { kind: "qa" }> }) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} />
      <dl className="mt-12 grid gap-6 md:grid-cols-2">
        {slide.pairs.map((p, i) => (
          <div
            key={i}
            className="rounded-md border border-hair bg-white p-6"
          >
            <dt className="caps text-ink">— {p.q}</dt>
            <dd className="mt-3 font-serif text-[1.15rem] font-medium leading-[1.4] text-espresso">
              {p.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── 10. Final CTA ─────────────────────────────────────── */
function CTASlide({ slide }: { slide: Extract<Slide, { kind: "cta" }> }) {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <HeadlineRender h={slide.headline} size="display" />
      <p className="mt-10 max-w-prose font-sans text-t-body-lg text-espresso-soft md:text-[1.2rem]">
        {slide.sub}
      </p>
      <div className="mt-12">
        <Link
          href={slide.cta.href}
          className="inline-flex h-14 items-center justify-center rounded-pill bg-ink px-8 font-sans text-[1.05rem] font-medium tracking-[0.01em] text-white transition-colors duration-200 ease-editorial hover:bg-ink-deep"
        >
          {slide.cta.label}
        </Link>
      </div>
      {slide.fineprint ? (
        <p className="caps mt-6 text-espresso-muted">{slide.fineprint}</p>
      ) : null}
    </section>
  );
}
