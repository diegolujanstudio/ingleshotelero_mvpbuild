import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { EmployeeSlugForm } from "@/components/site/EmployeeSlugForm";
import { InstallButton } from "@/components/site/InstallButton";
import { META, EMPLOYEE, HR, INSTALL, FOOTER, TOPBAR, SUPPORT_LINK } from "@/content/auth";

/**
 * `/` — product entry point.
 *
 * Employee-first. The dominant action is for an employee to type their
 * hotel code and start their exam. Recursos Humanos is a small secondary
 * link to /hr/login. Install lives in the top utility bar (always visible)
 * and in its own card lower down.
 *
 * Single column, mobile-first. Editorial tokens, no shadows.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  robots: { index: false, follow: false },
};

// Build-fingerprint marker — Diego greps for this string in the live HTML
// to verify Netlify is deploying our pushes. Bumped on every deploy probe.
// If you see this comment in production HTML, that build IS live.
const BUILD_MARKER = "ih-build-mw-edgedbg";

export default function AppEntry() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory text-espresso" data-build={BUILD_MARKER}>
      {/* ── Top utility bar ─────────────────────────────────── */}
      <header className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <Logo />
        <InstallButton size="md" variant="accent" label={TOPBAR.installCta} />
      </header>

      {/* ── Hero · Employee (primary) ───────────────────────── */}
      <section className="mx-auto w-full max-w-2xl flex-1 px-5 pt-10 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
        <p className="caps mb-3">{EMPLOYEE.eyebrow}</p>
        <h1 className="font-serif text-[clamp(2.25rem,7vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-espresso">
          {EMPLOYEE.headline.before}
          <em>{EMPLOYEE.headline.em}</em>
          {EMPLOYEE.headline.after}
        </h1>
        <p className="mt-3 font-sans text-t-body-lg text-espresso-soft">
          {EMPLOYEE.sub}
        </p>

        {/* Fallback for employees who don't have a personal link yet */}
        <div className="mt-7 rounded-md border border-hair bg-white p-5 sm:p-7">
          <p className="font-sans text-t-body text-espresso-soft">
            {EMPLOYEE.fallbackHint}
          </p>
          <div className="mt-3">
            <EmployeeSlugForm />
          </div>
          <p className="mt-4 font-sans text-t-caption text-espresso-muted">
            {EMPLOYEE.hint}
          </p>
        </div>

        {/* ── Install card ──────────────────────────────────── */}
        <div className="mt-10 rounded-md border border-hair bg-ivory-soft p-5 sm:p-7">
          <p className="caps mb-2">{INSTALL.eyebrow}</p>
          <h2 className="font-serif text-[clamp(1.375rem,3.5vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.018em] text-espresso">
            {INSTALL.headline.before}
            <em>{INSTALL.headline.em}</em>
            {INSTALL.headline.after}
          </h2>
          <p className="mt-2 font-sans text-t-body text-espresso-soft">
            {INSTALL.sub}
          </p>
          <div className="mt-5">
            <InstallButton />
          </div>
        </div>

        {/* ── HR (secondary card) ─────────────────────────────────── */}
        <div className="mt-10 rounded-md border border-hair bg-white p-5 sm:p-7">
          <p className="caps mb-2">{HR.eyebrow}</p>
          <h2 className="font-serif text-[clamp(1.375rem,3.5vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.018em] text-espresso">
            {HR.headline.before}
            <em>{HR.headline.em}</em>
            {HR.headline.after}
          </h2>
          <p className="mt-2 font-sans text-t-body text-espresso-soft">
            {HR.body}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/hr/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-6 font-sans text-t-label font-medium text-white transition-colors hover:bg-ink-deep"
            >
              {HR.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="font-sans text-t-caption text-espresso-muted">
              {HR.footnote}
            </p>
          </div>
        </div>

        {/* ── Support link (small, below HR card) ─────────────────── */}
        <div className="mt-6 flex items-center gap-3">
          <span className="caps text-espresso-muted">{SUPPORT_LINK.caption}</span>
          <Link
            href={SUPPORT_LINK.href}
            className="inline-flex items-center gap-1 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
          >
            {SUPPORT_LINK.cta}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mx-auto w-full max-w-shell px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col gap-3 border-t border-hair pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER.links.map((link) =>
              link.href.startsWith("mailto:") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="caps text-espresso-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="caps text-espresso-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
          <p className="caps text-espresso-muted">{FOOTER.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
