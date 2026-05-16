"use client";

import { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";

/**
 * Master OS login — the INTERNAL TEAM door (Diego, Victor, future ops).
 *
 * Deliberately separate from /hr/login (which is for hotel HR managers,
 * `rh@suhotel.com`). Same Supabase auth backend, but only `super_admin`
 * accounts may enter the console — the server enforces this in
 * requireSuperAdmin(); here we also surface a clear message instead of a
 * confusing bounce when a non-team account signs in.
 *
 * Public route (allow-listed in middleware) so it can render before auth.
 */
export default function MasterosLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          return_to: "/masteros",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        role?: string;
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
      // Master OS is team-only. A valid HR account that isn't super_admin
      // must NOT be dumped into a 404 — tell them plainly.
      if (json.role !== "super_admin") {
        setError(
          "Esta consola es solo para el equipo interno de Inglés Hotelero. " +
            "Si administra un hotel, ingrese en el panel de Recursos Humanos.",
        );
        setBusy(false);
        return;
      }
      window.location.assign("/masteros");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory">
      <header className="mx-auto flex max-w-shell items-center px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
      </header>

      <section className="mx-auto max-w-prose px-6 py-24 md:px-12 md:py-32">
        <p className="caps mb-6 inline-flex items-center gap-2 text-ink">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Master OS · Consola interna del equipo
        </p>
        <h1 className="font-serif text-t-h1 font-medium text-espresso">
          Operación <em>interna</em>.
        </h1>
        <p className="mt-4 font-sans text-t-body-lg text-espresso-soft">
          Acceso exclusivo del equipo de Inglés Hotelero — leads, contenido,
          clientes y métricas. No es para hoteles ni para Recursos Humanos.
        </p>

        <HairlineRule className="my-10" />

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Correo del equipo"
            type="email"
            placeholder="tu@ingleshotelero.com"
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
            <p className="font-sans text-t-caption text-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" size="lg" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Entrando…
              </>
            ) : (
              <>
                Entrar a Master OS
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
        </form>

        <p className="caps mt-10 text-espresso-muted">
          ¿Administra un hotel? El panel de Recursos Humanos está en /hr/login
        </p>
      </section>
    </main>
  );
}
