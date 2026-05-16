import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

/**
 * `/acceso` — friendly fallback when a personal link fails.
 *
 * The `/i/[token]` route handler redirects here with `?e=<reason>`
 * when a token is invalid, revoked, or the system is briefly down.
 * Plain Server Component (no cookies, no data) so it can't itself
 * fail.
 */

export const metadata: Metadata = {
  title: "Acceso · Inglés Hotelero",
  robots: { index: false, follow: false },
};

const MESSAGES: Record<
  string,
  { headline: string; em: string; body: string }
> = {
  invalido: {
    headline: "Este enlace no funciona.",
    em: "Pide uno nuevo a tu equipo.",
    body: "El código del enlace no es válido — puede ser un error de copiado. Pídele a Recursos Humanos que te envíe tu enlace de nuevo.",
  },
  revocado: {
    headline: "Este enlace ya no está activo.",
    em: "Pide uno nuevo a tu equipo.",
    body: "Tu acceso fue revocado o tu cuenta está pausada. Recursos Humanos puede generarte un enlace fresco en segundos.",
  },
  nodisponible: {
    headline: "No pudimos validar tu enlace.",
    em: "Intenta otra vez en un momento.",
    body: "Hubo un problema temporal del sistema. Si sigue pasando, avísale a tu equipo de Recursos Humanos.",
  },
};

export default function AccesoPage({
  searchParams,
}: {
  searchParams: { e?: string };
}) {
  const reason = searchParams.e ?? "invalido";
  const msg = MESSAGES[reason] ?? MESSAGES.invalido;

  return (
    <main className="flex min-h-screen flex-col bg-ivory text-espresso">
      <header className="mx-auto flex w-full max-w-shell items-center px-5 pt-5 sm:px-8 sm:pt-7">
        <Logo />
      </header>
      <section className="mx-auto w-full max-w-prose flex-1 px-5 pt-16 pb-12 sm:px-8 sm:pt-20">
        <p className="caps mb-3">Acceso personal</p>
        <h1 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.018em]">
          {msg.headline} <em>{msg.em}</em>
        </h1>
        <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {msg.body}
        </p>
        <div className="mt-8">
          <ButtonLink href="/" variant="primary" size="lg">
            Volver al inicio
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
