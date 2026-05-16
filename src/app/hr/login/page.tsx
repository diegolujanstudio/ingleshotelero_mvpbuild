"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { formatIndex } from "@/lib/utils";
import { DemoGuard } from "@/components/DemoGuard";

/**
 * HR login.
 *
 * When Supabase is configured, authenticates via email + password.
 * When not (demo mode), "Entrar en modo demo" bypasses auth and drops
 * the HR into the dashboard with demo data + live exam sessions.
 */
/**
 * Whitelist the post-login destination. Only the two internal consoles
 * (and their sub-paths) are allowed — never an open redirect.
 */
function safeReturnTo(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/hr";
  if (
    raw === "/hr" ||
    raw === "/masteros" ||
    raw.startsWith("/hr/") ||
    raw.startsWith("/masteros/")
  ) {
    return raw;
  }
  return "/hr";
}

export default function HRLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Read ?returnTo= once on the client (no Suspense boundary needed —
  // this page is already "use client" and login is client-interactive).
  const [returnTo] = useState(() =>
    typeof window === "undefined"
      ? "/hr"
      : safeReturnTo(new URLSearchParams(window.location.search).get("returnTo")),
  );

  const supabaseConfigured =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0;

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // Server-side sign-in: the route sets the auth cookie on its
      // response (reliable) and verifies the hr_users profile with the
      // service client (no RLS race). Then a HARD navigation so the
      // cookie rides the next request and middleware sees the session.
      // (Client-side signInWithPassword + router.push raced the
      // middleware and bounced back to /.)
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, return_to: returnTo }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        redirect_to?: string;
        error?: { message?: string };
      };
      if (!res.ok || !json.ok) {
        setError(
          json.error?.message ??
            "No se pudo iniciar sesión. Verifique su correo y contraseña.",
        );
        setBusy(false);
        return;
      }
      const dest = safeReturnTo(json.redirect_to ?? returnTo);
      window.location.assign(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
      setBusy(false);
    }
  };

  const handleDemo = () => {
    // No real auth. Just drop in.
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hr_demo_mode", "true");
    }
    router.push("/hr");
  };

  return (
    <main className="min-h-screen bg-ivory">
      <header className="mx-auto flex max-w-shell items-center px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
      </header>

      <section className="mx-auto max-w-prose px-6 py-24 md:px-12 md:py-32">
        <p className="caps mb-6">
          {formatIndex(1)} · Acceso para Recursos Humanos
        </p>
        <h1 className="font-serif text-t-h1 font-medium text-espresso">
          Bienvenido <em>de vuelta</em>.
        </h1>
        <p className="mt-4 font-sans text-t-body-lg text-espresso-soft">
          Inicie sesión para ver los resultados de su equipo.
        </p>

        <HairlineRule className="my-10" />

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Correo"
            type="email"
            placeholder="rh@suhotel.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="font-sans text-t-caption text-error">{error}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={busy || !supabaseConfigured}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Iniciando sesión…
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
          {!supabaseConfigured && (
            <p className="caps">
              Autenticación real disponible cuando Supabase esté configurado (ver SETUP.md).
            </p>
          )}
        </form>

        <DemoGuard>
          {demoMode && (
            <>
              <HairlineRule className="my-10" />

              <div className="rounded-md border border-hair bg-white p-6">
                <p className="caps mb-3">Para demostraciones</p>
                <p className="font-sans text-t-body text-espresso-soft">
                  Si está mostrando el producto a un prospecto, entre en modo demo.
                  Verá un panel con empleados de ejemplo y cualquier evaluación que
                  alguien haya tomado en este navegador en vivo.
                </p>
                <button
                  type="button"
                  onClick={handleDemo}
                  className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
                >
                  Entrar en modo demo →
                </button>
              </div>
            </>
          )}
        </DemoGuard>
      </section>
    </main>
  );
}
