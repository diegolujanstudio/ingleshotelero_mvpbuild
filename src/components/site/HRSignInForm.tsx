"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HR_SIGNIN } from "@/content/auth";

/**
 * HR sign-in form for the app entry page.
 *
 * Submits to Supabase Auth via the browser client. On success, honors a
 * `?returnTo=` parameter (set by the auth middleware when a protected
 * route bounces an unauthenticated user); otherwise lands on `/hr`.
 *
 * The "Enviar enlace mágico" affordance is staged but not wired — the
 * Resend integration is post-MVP. It surfaces a notice rather than
 * pretending to work.
 *
 * The "¿Olvidó su contraseña?" link points at `/hr/login?method=reset`
 * which the existing /hr/login page handles (or will handle when the
 * reset flow ships in Phase B).
 */
export function HRSignInForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get("returnTo") ?? "/hr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const supabaseConfigured =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!supabaseConfigured) {
      setError(HR_SIGNIN.notConfigured);
      return;
    }

    setBusy(true);
    try {
      // POST to the server-side sign-in route. It runs
      // signInWithPassword via the @supabase/ssr server client (which
      // writes the auth cookie onto THIS response, reliably), verifies
      // the hr_users profile with the service client (no RLS race),
      // and returns the safe redirect path. We then do a HARD
      // navigation so the just-set cookie is guaranteed to ride the
      // next request and the middleware sees the session — no
      // client-side cookie/navigation race.
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          return_to: returnTo,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        redirect_to?: string;
        error?: { code?: string; message?: string };
      };
      if (!res.ok || !json.ok) {
        setError(json.error?.message || HR_SIGNIN.errorGeneric);
        setBusy(false);
        return;
      }
      const dest =
        json.redirect_to &&
        json.redirect_to.startsWith("/") &&
        !json.redirect_to.startsWith("//")
          ? json.redirect_to
          : "/hr";
      window.location.assign(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : HR_SIGNIN.errorGeneric);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Input
        label={HR_SIGNIN.emailLabel}
        type="email"
        autoComplete="email"
        required
        placeholder={HR_SIGNIN.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label={HR_SIGNIN.passwordLabel}
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="font-sans text-t-caption text-error" role="alert">
          {error}
        </p>
      )}
      {info && !error && (
        <p className="font-sans text-t-caption text-espresso-soft" role="status">
          {info}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {HR_SIGNIN.submitting}
          </>
        ) : (
          <>
            {HR_SIGNIN.submit}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </Button>

      <div className="flex flex-col gap-2 pt-2 text-t-caption">
        <button
          type="button"
          className="self-start font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
          onClick={() => {
            setError(null);
            setInfo(HR_SIGNIN.magicLinkComing);
          }}
        >
          {HR_SIGNIN.magicLink} →
        </button>
        <Link
          href="/hr/login?method=reset"
          className="self-start font-mono text-[0.75rem] uppercase tracking-[0.14em] text-espresso-muted hover:text-ink"
        >
          {HR_SIGNIN.forgot}
        </Link>
      </div>

      <p className="caps pt-2 text-espresso-muted">{HR_SIGNIN.footer}</p>
    </form>
  );
}
