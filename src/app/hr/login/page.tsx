"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { createClient } from "@/lib/supabase/client";
import { formatIndex } from "@/lib/utils";

/**
 * HR login.
 *
 * When Supabase is configured, authenticates via email + password.
 * When not (demo mode), "Entrar en modo demo" bypasses auth and drops
 * the HR into the dashboard with demo data + live exam sessions.
 */
export default function HRLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const supabaseConfigured =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(err.message);
      } else {
        router.push("/hr");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
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
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
        <Link href="/" className="caps hover:text-ink">
          ← Sitio público
        </Link>
      </header>

      <section className="mx-auto max-w-prose px-6 py-24 md:px-12 md:py-32">
        <p className="caps mb-6">{formatIndex(1)} · Acceso para Recursos Humanos</p>
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
      </section>
    </main>
  );
}
