import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstallButton } from "@/components/site/InstallButton";
import { EntryChooser } from "@/components/site/EntryChooser";
import { META, FOOTER, TOPBAR } from "@/content/auth";

/**
 * `/` — the front door.
 *
 * THE SURFACE IS THE MESSAGE. Diego's critique of the old page: "it looks
 * like an extension of the practice we just did." He was right — same ivory,
 * same card rhythm. The entry now runs on `espresso-deep` / `ivory-light`,
 * the tokens the design system explicitly reserved for dark surfaces and had
 * never used. Practice = the warm ivory room; the door = the dark threshold
 * before it. Different jobs, different light — with zero new colors.
 *
 * Structure (see EntryChooser for the per-choice rationale):
 *   1. one identity decision — employee or HR
 *   2. employee path: 01 install (structurally "mandatory"), 02 enter
 *   3. HR: straight to /hr/login
 *
 * The install lever also stays in the header, always visible, on every
 * visit — the closest a web app can honestly get to "mandatory install",
 * since browsers do not permit forcing it.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: "https://www.ingleshotelero.com/" },
  robots: { index: false, follow: false },
};

// Build-fingerprint marker — Diego greps for this string in the live HTML
// to verify Netlify is deploying our pushes. Bumped on every deploy probe.
const BUILD_MARKER = "ih-build-entry-doors";

export default function AppEntry() {
  return (
    <main
      className="flex min-h-screen flex-col bg-espresso-deep"
      data-build={BUILD_MARKER}
    >
      {/* ── Header: wordmark + the ever-present install lever ── */}
      <header className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <Logo tone="dark" className="min-h-[44px] items-center" />
        <InstallButton size="md" variant="accent" className="min-h-[44px]" label={TOPBAR.installCta} />
      </header>

      {/* ── The decision ── */}
      <section className="mx-auto w-full max-w-2xl flex-1 px-5 pt-12 pb-14 sm:px-8 sm:pt-20 sm:pb-20">
        <EntryChooser />
      </section>

      {/* ── Footer, quiet ── */}
      <footer className="mx-auto w-full max-w-shell px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col gap-3 border-t border-ivory-light/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER.links.map((link) =>
              link.href.startsWith("mailto:") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="caps inline-flex min-h-[44px] items-center text-ivory-light/40 transition-colors hover:text-ivory-light"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="caps inline-flex min-h-[44px] items-center text-ivory-light/40 transition-colors hover:text-ivory-light"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
          <p className="caps text-ivory-light/40">{FOOTER.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
