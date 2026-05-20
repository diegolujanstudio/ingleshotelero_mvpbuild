import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getPageContent } from "@/lib/server/page-content";
import {
  COLOCACION_COPY_KEY,
  DEFAULT_COLOCACION_COPY,
  type ColocacionCopy,
} from "@/content/colocacion";

export const metadata: Metadata = {
  title: "Recibido · Inglés Hotelero",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ColocacionGracias() {
  const c = await getPageContent<ColocacionCopy>(
    COLOCACION_COPY_KEY,
    DEFAULT_COLOCACION_COPY,
  );
  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link href="/" className="caps text-espresso transition-colors hover:text-ink">
          Volver al inicio
        </Link>
      </header>
      <section className="mx-auto max-w-prose px-6 py-16 md:px-12 md:py-24">
        <p className="caps mb-3 text-success">Examen de colocación · recibido</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {c.thankyou_title}
        </h1>
        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {c.thankyou_body}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="primary">
            Volver al inicio
          </ButtonLink>
          <a
            href="mailto:hola@ingleshotelero.com"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-hair px-6 font-sans text-t-label text-espresso transition-colors hover:border-ink"
          >
            Escribirnos directo
          </a>
        </div>
      </section>
    </main>
  );
}
