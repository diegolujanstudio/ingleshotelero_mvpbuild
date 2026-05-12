import type { Metadata, Viewport } from "next";
import { OfflineRetryButton } from "./OfflineRetryButton";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { OFFLINE } from "@/content/pwa";

/**
 * /offline — fallback page served by the SW when navigation fails. The
 * page is a static Server Component so Workbox precaches it cleanly.
 *
 * The "Reintentar" button is a tiny client island so the rest of the
 * route stays cacheable.
 */

export const metadata: Metadata = {
  title: OFFLINE.meta.title,
  description: OFFLINE.meta.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory text-espresso">
      <header className="mx-auto flex w-full max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
        <span className="caps">Sin conexión</span>
      </header>
      <HairlineRule className="mx-auto mt-6 max-w-shell px-6 md:px-12" />

      <section className="mx-auto w-full max-w-prose flex-1 px-6 py-16 md:px-12 md:py-24">
        <p className="caps mb-3">{OFFLINE.eyebrow}</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-espresso">
          {OFFLINE.headline}
        </h1>
        <p className="mt-6 font-sans text-t-body-lg leading-relaxed text-espresso-soft">
          {OFFLINE.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <OfflineRetryButton label={OFFLINE.cta} />
          <a
            href="/"
            className="caps text-espresso-muted hover:text-espresso"
          >
            {OFFLINE.secondary} →
          </a>
        </div>
      </section>
    </main>
  );
}
