"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-ivory">
          <p className="caps">Cargando...</p>
        </main>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}

/**
 * Inner form — uses useSearchParams which requires a Suspense boundary.
 */
function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  // Step 1: verify the OTP from the invite link.
  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!tokenHash || type !== "invite") {
      setError("Enlace de invitación inválido o expirado.");
      setVerifying(false);
      return;
    }

    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type: "invite" })
      .then(({ error: otpError }) => {
        if (otpError) {
          setError(
            "El enlace de invitación ha expirado o ya fue utilizado. Pida a su administrador que reenvíe la invitación.",
          );
        }
        setVerifying(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 2: user sets their password.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);

    // Set the password on the now-verified auth user.
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    // Activate the hr_users row: set id = auth.uid(), is_active = true.
    // We call a server API because the client can't bypass RLS to update hr_users.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await fetch("/api/hr/activate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ auth_uid: user.id, email: user.email }),
      }).catch(() => {});
    }

    router.push("/hr");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <Card className="w-full max-w-md p-0">
        <div className="py-10 px-8">
          <h1 className="font-serif text-t-h2 font-medium text-espresso">
            Activar su cuenta
          </h1>
          <p className="mt-2 font-sans text-t-body text-espresso-soft">
            Establezca una contraseña para acceder al panel de Recursos Humanos.
          </p>

          {verifying ? (
            <p className="mt-6 font-sans text-t-body text-espresso-muted">
              Verificando invitación...
            </p>
          ) : error && !password ? (
            <p className="mt-6 font-sans text-t-body text-error">{error}</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
              {error && (
                <p className="font-sans text-t-caption text-error">{error}</p>
              )}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Activando..." : "Activar cuenta"}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </main>
  );
}
