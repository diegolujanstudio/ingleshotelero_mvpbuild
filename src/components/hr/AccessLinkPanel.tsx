"use client";

/**
 * AccessLinkPanel — HR generates + shares a personal employee link.
 *
 * One panel per employee. Shows the most recent active token (if any),
 * lets HR mint a fresh one, and provides one-tap WhatsApp / email /
 * copy-to-clipboard share. The token never expires; HR revokes by
 * minting a new one (the old one stays valid until manually revoked
 * via the API — future iteration adds an explicit revoke button).
 *
 * Why this exists: the entire employee sign-in pattern is "HR sends a
 * personal link via WhatsApp, employee taps it, they're in." Without
 * this panel, HR has no way to do that without running a script.
 */

import { useEffect, useState } from "react";
import { Link2, Send, Copy, Check, RefreshCw, MessageSquareText, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HairlineRule } from "@/components/ui/HairlineRule";

type ActiveToken = {
  id: string;
  issued_at: string;
  last_used_at: string | null;
  use_count: number;
  delivery_channel: string | null;
  delivery_target: string | null;
};

interface AccessLinkPanelProps {
  employeeId: string;
  employeeName: string;
  employeePhone?: string | null;
  employeeEmail?: string | null;
}

export function AccessLinkPanel({
  employeeId,
  employeeName,
  employeePhone,
  employeeEmail,
}: AccessLinkPanelProps) {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tokens, setTokens] = useState<ActiveToken[]>([]);
  const [freshUrl, setFreshUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/hr/employees/${employeeId}/access-link`)
      .then((r) => (r.ok ? r.json() : { tokens: [] }))
      .then((data: { tokens: ActiveToken[] }) => {
        if (cancelled) return;
        setTokens((data.tokens ?? []).filter((t) => !("revoked_at" in t && (t as { revoked_at: string | null }).revoked_at)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  const generateLink = async (channel: "whatsapp" | "email" | "manual" = "manual") => {
    setCreating(true);
    setError(null);
    setCopied(false);
    try {
      const target =
        channel === "whatsapp" ? employeePhone ?? "" : channel === "email" ? employeeEmail ?? "" : "";
      const r = await fetch(`/api/hr/employees/${employeeId}/access-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delivery_channel: channel,
          delivery_target: target || undefined,
        }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        setError(err?.error?.message ?? "No pudimos generar el enlace.");
        return;
      }
      const data: { url: string; issued_at: string; token: string } = await r.json();
      setFreshUrl(data.url);

      // Auto-open share intent for whatsapp/email
      if (channel === "whatsapp" && employeePhone) {
        const msg = waMessage(employeeName, data.url);
        const phone = employeePhone.replace(/[^0-9]/g, "");
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
      } else if (channel === "email" && employeeEmail) {
        const subject = encodeURIComponent("Tu acceso a Inglés Hotelero");
        const body = encodeURIComponent(emailBody(employeeName, data.url));
        window.open(`mailto:${employeeEmail}?subject=${subject}&body=${body}`, "_blank");
      }

      // Refresh token list
      const refreshed = await fetch(`/api/hr/employees/${employeeId}/access-link`).then((r) => r.json());
      setTokens((refreshed.tokens ?? []).filter((t: { revoked_at?: string | null }) => !t.revoked_at));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setCreating(false);
    }
  };

  const copyUrl = async () => {
    if (!freshUrl) return;
    try {
      await navigator.clipboard.writeText(freshUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="rounded-md border border-hair bg-white p-5 sm:p-7">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-ink" aria-hidden />
        <h3 className="font-serif text-t-h3 font-medium text-espresso">Enlace personal</h3>
      </div>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        Genera un enlace único que <em>{employeeName}</em> puede tocar para entrar
        directo a su práctica. Sin contraseña, sin código. Cada enlace dura un año.
      </p>

      {/* ── Fresh URL panel (after generation) ──────────────────── */}
      {freshUrl && (
        <div className="mt-5 rounded-md border border-ink-soft bg-ink-tint p-4">
          <p className="caps mb-2 text-ink">Enlace listo</p>
          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={freshUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-md border border-hair bg-white px-3 py-2 font-mono text-[0.75rem] text-espresso"
              aria-label="Enlace personal del empleado"
            />
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={copyUrl}
              aria-live="polite"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Share actions ────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {employeePhone && (
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={creating}
            onClick={() => generateLink("whatsapp")}
          >
            <MessageSquareText className="h-4 w-4" aria-hidden />
            Enviar por WhatsApp
          </Button>
        )}
        {employeeEmail && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={creating}
            onClick={() => generateLink("email")}
          >
            <Mail className="h-4 w-4" aria-hidden />
            Enviar por correo
          </Button>
        )}
        <Button
          type="button"
          variant="text"
          size="md"
          disabled={creating}
          onClick={() => generateLink("manual")}
        >
          <Send className="h-4 w-4" aria-hidden />
          Solo generar (yo lo envío)
        </Button>
      </div>

      {error && (
        <p className="mt-3 font-sans text-t-caption text-error" role="alert">
          {error}
        </p>
      )}

      {/* ── Active tokens list ───────────────────────────────────── */}
      {(loading || tokens.length > 0) && (
        <>
          <HairlineRule className="my-6" />
          <p className="caps mb-3">Enlaces activos</p>
          {loading ? (
            <p className="font-sans text-t-caption text-espresso-muted">Cargando…</p>
          ) : (
            <ul className="space-y-2">
              {tokens.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.75rem] text-espresso-soft"
                >
                  <span>
                    <span className="text-espresso-muted">Emitido</span>{" "}
                    {new Date(t.issued_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    <span className="text-espresso-muted">Usos</span> {t.use_count}
                  </span>
                  {t.last_used_at && (
                    <span>
                      <span className="text-espresso-muted">Último</span>{" "}
                      {new Date(t.last_used_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  )}
                  {t.delivery_channel && (
                    <span>
                      <span className="text-espresso-muted">Vía</span> {t.delivery_channel}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function waMessage(name: string, url: string): string {
  const first = name.split(" ")[0] ?? "Hola";
  return `Hola ${first} — este es tu acceso a Inglés Hotelero. Tócalo desde tu celular para empezar tu práctica de hoy:\n\n${url}\n\nNo necesitas contraseña. El enlace funciona siempre.`;
}

function emailBody(name: string, url: string): string {
  const first = name.split(" ")[0] ?? "Hola";
  return `Hola ${first},\n\nTu equipo de RH te dio acceso a Inglés Hotelero. Toca este enlace desde tu celular o computadora para entrar:\n\n${url}\n\nNo necesitas contraseña ni descargar nada. El enlace funciona siempre.\n\n— Inglés Hotelero`;
}
