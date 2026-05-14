import "server-only";

/**
 * `/i/[token]` — Personal-link entry for an employee.
 *
 * The employee taps a personal URL HR sent them (via WhatsApp / email /
 * SMS). This server component:
 *
 *   1. Looks up the access token in `employee_access_tokens`.
 *   2. If valid + not revoked: sets the `ih_employee_session` cookie with
 *      the raw token (httpOnly, secure, sameSite=lax, 1y expiry).
 *   3. Increments use_count + stamps last_used_at.
 *   4. Redirects to /practice — the employee's home loop. The /practice
 *      server component itself decides whether to route them into a
 *      diagnostic exam first (no exam taken yet) or straight to the
 *      drill loop (exam done).
 *
 * If the token is invalid or revoked, renders a clear error in Spanish
 * with instructions to ask HR for a fresh link.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { EMPLOYEE_COOKIE } from "@/lib/auth/employee";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

interface PageProps {
  params: { token: string };
}

export const dynamic = "force-dynamic";

export default async function PersonalLinkPage({ params }: PageProps) {
  const token = decodeURIComponent(params.token).trim();

  // Defensive: tokens are URL-safe base64 of 32 bytes — at least 32 chars.
  if (token.length < 24) return renderInvalid();

  const sb = createServiceClient();
  if (!sb) return renderUnavailable();

  // Supabase types haven't been regenerated post-0007 yet — cast.
  type TokenRow = {
    id: string;
    employee_id: string;
    revoked_at: string | null;
  };
  const tokensTable = (sb as unknown as {
    from: (t: string) => {
      select: (cols: string) => {
        eq: (k: string, v: string) => {
          maybeSingle: () => Promise<{ data: TokenRow | null }>;
        };
      };
    };
  }).from("employee_access_tokens");
  const tokenResp = await tokensTable
    .select("id, employee_id, revoked_at")
    .eq("token", token)
    .maybeSingle();
  const tokenRow = tokenResp.data;

  if (!tokenRow) return renderInvalid();
  if (tokenRow.revoked_at) return renderRevoked();

  const { data: employee } = await sb
    .from("employees")
    .select("id, is_active, name")
    .eq("id", tokenRow.employee_id)
    .maybeSingle();

  if (!employee) return renderInvalid();
  if (!employee.is_active) return renderRevoked();

  // Set the session cookie. Don't await the use-count bump — fire and
  // continue so the redirect is snappy.
  cookies().set(EMPLOYEE_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });

  // Bump last_used_at — fire and continue.
  const updTable = (sb as unknown as {
    from: (t: string) => {
      update: (v: unknown) => {
        eq: (k: string, v: string) => Promise<unknown>;
      };
    };
  }).from("employee_access_tokens");
  void updTable
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenRow.id);

  redirect("/practice");
}

function renderInvalid() {
  return (
    <Shell
      headline="Este enlace no funciona."
      em="Pide a tu equipo de RH uno nuevo."
      body="El código del enlace no es válido. Puede ser un error de copiado o que el enlace haya sido revocado."
      cta="Volver al inicio"
    />
  );
}

function renderRevoked() {
  return (
    <Shell
      headline="Este enlace fue revocado."
      em="Pide uno nuevo a tu equipo de RH."
      body="Tu acceso ya no está activo. Tu hotel puede generarte un enlace fresco en segundos."
      cta="Volver al inicio"
    />
  );
}

function renderUnavailable() {
  return (
    <Shell
      headline="No podemos validar tu enlace ahora."
      em="Intenta de nuevo en un momento."
      body="Hay un problema temporal con el sistema. Si persiste, contacta a tu equipo de RH."
      cta="Volver al inicio"
    />
  );
}

function Shell({
  headline,
  em,
  body,
  cta,
}: {
  headline: string;
  em: string;
  body: string;
  cta: string;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-ivory text-espresso">
      <header className="mx-auto flex w-full max-w-shell items-center px-5 pt-5 sm:px-8 sm:pt-7">
        <Logo />
      </header>
      <section className="mx-auto w-full max-w-prose flex-1 px-5 pt-16 pb-12 sm:px-8 sm:pt-20">
        <p className="caps mb-3">Acceso personal</p>
        <h1 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.018em]">
          {headline}{" "}
          <em>{em}</em>
        </h1>
        <p className="mt-4 font-sans text-t-body-lg text-espresso-soft">
          {body}
        </p>
        <div className="mt-8">
          <ButtonLink href="/" variant="primary" size="lg">
            {cta}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
