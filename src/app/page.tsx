import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { HRSignInForm } from "@/components/site/HRSignInForm";
import { EmployeeSlugForm } from "@/components/site/EmployeeSlugForm";
import { InstallButton } from "@/components/site/InstallButton";
import { META, HR_SIGNIN, EMPLOYEE_ENTRY, INSTALL, FOOTER } from "@/content/auth";

/**
 * `/` — product entry point.
 *
 * Marketing lives separately on Astro at ingleshotelero.com. This page
 * is the door to the product app. Three surfaces:
 *
 *   1. HR sign-in (primary, left column)
 *   2. Employee hotel-code field (secondary, right column)
 *   3. PWA install lever (full-width block underneath, the new dominant
 *      onboarding step per the founder)
 *
 * Editorial tokens only. Information density over whitespace, but still
 * generous line-height and serif title with ink em.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  robots: { index: false, follow: false },
};

export default function AppEntry() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory text-espresso">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="mx-auto flex w-full max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <a
          href={FOOTER.marketingHref}
          className="caps text-espresso-muted transition-colors hover:text-ink"
        >
          {FOOTER.marketingLabel}
        </a>
      </header>

      <section className="mx-auto w-full max-w-shell flex-1 px-6 py-12 md:px-12 md:py-16">
        {/* ── Two-column door ──────────────────────────────── */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16">
          {/* LEFT — primary HR sign-in */}
          <div className="rounded-md border border-hair bg-white p-6 md:p-10">
            <p className="caps mb-4">{HR_SIGNIN.eyebrow}</p>
            <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-espresso">
              {HR_SIGNIN.headline.before}
              <em>{HR_SIGNIN.headline.em}</em>
              {HR_SIGNIN.headline.after}
            </h1>
            <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
              {HR_SIGNIN.sub}
            </p>

            <HairlineRule className="my-7" />

            <HRSignInForm />
          </div>

          {/* RIGHT — secondary employee entry */}
          <aside className="rounded-md border border-hair bg-ivory-soft p-6 md:p-8">
            <p className="caps mb-3">{EMPLOYEE_ENTRY.eyebrow}</p>
            <p className="font-sans text-t-body text-espresso-soft">
              {EMPLOYEE_ENTRY.body}
            </p>
            <EmployeeSlugForm />
          </aside>
        </div>

        {/* ── Install block (full-width, dominant) ─────────── */}
        <div className="mt-10 rounded-md border border-hair bg-white p-6 md:mt-14 md:p-10">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_auto] md:items-center md:gap-10">
            <div>
              <p className="caps mb-3">{INSTALL.eyebrow}</p>
              <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2rem)] font-medium leading-[1.1] tracking-[-0.018em] text-espresso">
                {INSTALL.headline.before}
                <em>{INSTALL.headline.em}</em>
                {INSTALL.headline.after}
              </h2>
              <p className="mt-3 max-w-prose font-sans text-t-body text-espresso-soft">
                {INSTALL.body}
              </p>
            </div>
            <div className="md:text-right">
              <InstallButton />
            </div>
          </div>
        </div>

        {/* ── Tertiary footer row ──────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hair pt-6">
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
      </section>

      <footer className="mx-auto w-full max-w-shell px-6 pb-8 md:px-12 md:pb-10">
        <div className="flex flex-col gap-2 border-t border-hair pt-6 md:flex-row md:items-center md:justify-between">
          <p className="caps text-espresso-muted">{FOOTER.line}</p>
          <p className="caps text-espresso-muted">{FOOTER.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
