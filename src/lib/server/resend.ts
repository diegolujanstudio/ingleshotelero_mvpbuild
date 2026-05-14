import "server-only";

/**
 * Resend transactional-email helper.
 *
 * Direct REST call to Resend's API — no SDK, no peer-dep on
 * `@react-email/render` (which the resend npm package requires at v6+
 * and which silently broke the Netlify build for many commits).
 *
 * Guarded so dev / demo deployments without RESEND_API_KEY simply no-op
 * (rather than crashing the route). Used by the Netlify-Forms webhook
 * to notify Diego + Victor on every lead/support submission.
 *
 * NEVER add secrets, raw transcripts, or audio to email bodies — only
 * the human-supplied form fields, which the user already typed.
 */

import { log } from "./log";

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL || "hola@ingleshotelero.com";
const RESEND_API_URL = "https://api.resend.com/emails";

/**
 * Recipients for every lead/support notification. Hardcoded by design —
 * these two addresses are the only humans who follow up on inbound. To
 * change them, edit this constant; we do not surface a runtime config.
 */
export const RECIPIENTS = [
  "victor.lujan@gmail.com",
  "diego@diegolujanstudio.com",
] as const;

export type LeadEmailPayload = Record<string, unknown>;

export type SendLeadResult =
  | { skipped: true }
  | { ok: true; id?: string }
  | { ok: false; error: string };

/**
 * Notify the two CRM recipients about a fresh form submission. Best-effort:
 * never throws. Returns a discriminated result the caller can log.
 */
export async function sendLeadNotification(
  formName: string,
  lead: LeadEmailPayload,
): Promise<SendLeadResult> {
  if (!KEY) {
    log.warn({ formName }, "resend.skipped.no_key");
    return { skipped: true };
  }

  const subject = buildSubject(formName, lead);
  const html = renderLeadHtml(formName, lead);
  const replyTo =
    typeof lead.email === "string" && lead.email.length > 0
      ? (lead.email as string)
      : undefined;

  const body: Record<string, unknown> = {
    from: `Inglés Hotelero <${FROM}>`,
    to: [...RECIPIENTS],
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;

  try {
    const resp = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      log.error(
        { status: resp.status, formName, body: text.slice(0, 200) },
        "resend.send.error",
      );
      return { ok: false, error: `resend ${resp.status}: ${text.slice(0, 100)}` };
    }
    const json = (await resp.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: json.id };
  } catch (err) {
    log.error({ err: String(err), formName }, "resend.failed");
    return { ok: false, error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function buildSubject(formName: string, lead: LeadEmailPayload): string {
  const name = strOrEmpty(lead.name);
  const company = strOrEmpty(lead.company);
  const email = strOrEmpty(lead.email);

  if (formName === "pilot") {
    const tail = [name, company].filter(Boolean).join(" · ");
    return tail ? `Nuevo lead piloto · ${tail}` : "Nuevo lead piloto";
  }
  if (formName === "soporte") {
    const tail = [name, email].filter(Boolean).join(" · ");
    return tail ? `Soporte · ${tail}` : "Nuevo mensaje de soporte";
  }
  return `Form · ${formName}${name ? ` · ${name}` : ""}`;
}

function strOrEmpty(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// Fields we omit from the email table — already in the subject or noisy.
const OMIT = new Set([
  "id",
  "metadata",
  "netlify_submission_id",
  "netlify_form_id",
  "created_at",
  "updated_at",
  "status",
  "ip_country",
  "user_agent",
  "form_name",
  "contacted_at",
  "contacted_by",
  "notes",
]);

// Friendlier Spanish labels for the rendered table.
const LABELS: Record<string, string> = {
  name: "Nombre",
  email: "Correo",
  phone: "Teléfono / WhatsApp",
  company: "Hotel",
  hotel_count: "Número de propiedades",
  city: "Ciudad",
  role: "Cargo",
  message: "Mensaje",
  topic: "Tema",
  source_url: "Página de origen",
};

function renderLeadHtml(formName: string, lead: LeadEmailPayload): string {
  const headline =
    formName === "pilot"
      ? "Nuevo lead piloto"
      : formName === "soporte"
      ? "Nuevo mensaje de soporte"
      : `Nuevo envío · ${escapeHtml(formName)}`;

  const rows = Object.entries(lead)
    .filter(
      ([k, v]) =>
        !OMIT.has(k) && v !== null && v !== undefined && String(v).length > 0,
    )
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:6px 12px;color:#7A6352;text-transform:uppercase;font-size:11px;letter-spacing:0.1em;vertical-align:top;border-bottom:1px solid #EFE7D6;width:170px">
            ${escapeHtml(LABELS[k] ?? k)}
          </td>
          <td style="padding:6px 12px;color:#2B1D14;font-size:14px;border-bottom:1px solid #EFE7D6;white-space:pre-wrap;word-break:break-word">
            ${escapeHtml(String(v))}
          </td>
        </tr>`,
    )
    .join("");

  return [
    `<!doctype html><html><body style="font-family:Georgia,serif;background:#F5F0E6;padding:24px;margin:0">`,
    `<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #D9CEB9;border-radius:10px;padding:28px">`,
    `<p style="margin:0 0 8px;color:#7A6352;text-transform:uppercase;font-size:11px;letter-spacing:0.2em;font-family:'JetBrains Mono',monospace">Inglés Hotelero · CRM</p>`,
    `<h1 style="font-family:Georgia,serif;color:#2B1D14;margin:0 0 16px;font-weight:500;font-size:22px">${escapeHtml(headline)}</h1>`,
    `<p style="color:#4A3426;margin:0 0 20px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px">Recibido vía formulario web. Responde al correo para escribir directo a quien envió esto.</p>`,
    `<table style="width:100%;border-collapse:collapse;font-family:'Helvetica Neue',Arial,sans-serif">${rows}</table>`,
    `<p style="margin:28px 0 0;font-size:11px;color:#7A6352;text-transform:uppercase;letter-spacing:0.2em;font-family:'JetBrains Mono',monospace;border-top:1px solid #EFE7D6;padding-top:14px">Inglés Hotelero · 2026 · Hecho en México</p>`,
    `</div></body></html>`,
  ].join("");
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      } as Record<string, string>)[c]!,
  );
}
