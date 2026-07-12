import "server-only";

/**
 * Twilio WhatsApp adapter — no SDK dependency, just fetch + node:crypto.
 *
 * Entirely inert when the TWILIO_* env vars are absent: isWhatsAppEnabled()
 * is false, sends are no-ops, and signature validation passes with a warn
 * (so the webhook still works in local/dev without a Twilio account).
 */
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { log } from "@/lib/server/log";

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+52..."

/** True only when every Twilio credential is configured. */
export function isWhatsAppEnabled(): boolean {
  return Boolean(ACCOUNT_SID && AUTH_TOKEN && FROM);
}

let warnedUnsigned = false;

/**
 * Validate Twilio's X-Twilio-Signature (HMAC-SHA1 of the full URL plus the
 * sorted POST params, base64). When TWILIO_AUTH_TOKEN is unset we cannot
 * validate — return true once with a warning so dev works, but production
 * with a token set enforces it strictly.
 */
export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  header: string | null,
): boolean {
  if (!AUTH_TOKEN) {
    if (!warnedUnsigned) {
      log.warn({}, "whatsapp.twilio.signature.unenforced — TWILIO_AUTH_TOKEN unset");
      warnedUnsigned = true;
    }
    return true;
  }
  if (!header) return false;
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((k) => k + params[k])
      .join("");
  const expected = crypto
    .createHmac("sha1", AUTH_TOKEN)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(header);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Build a TwiML <Response> that sends zero or more <Message> replies. */
export function twimlResponse(messages: string[]): NextResponse {
  const body = messages.map((m) => `<Message>${escapeXml(m)}</Message>`).join("");
  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`;
  return new NextResponse(twiml, {
    status: 200,
    headers: { "content-type": "text/xml; charset=utf-8" },
  });
}

/**
 * Send a free-form WhatsApp message (only valid inside the 24h window an
 * inbound message opens; business-initiated sends need approved templates —
 * see sendTemplateMessage). No-op returning ok:false when disabled.
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!isWhatsAppEnabled()) return { ok: false, error: "disabled" };
  const toAddr = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          authorization:
            "Basic " + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64"),
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: toAddr, From: FROM as string, Body: body }),
      },
    );
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      log.warn({ status: res.status, body: t.slice(0, 200) }, "whatsapp.send.failed");
      return { ok: false, error: `twilio_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    log.warn({ err: String(err) }, "whatsapp.send.error");
    return { ok: false, error: "network" };
  }
}

/**
 * Business-initiated template send (daily dispatcher). Stubbed until the
 * Meta templates in src/content/whatsapp.ts are approved — returns
 * ok:false so the dispatcher degrades gracefully. Wiring is a drop-in once
 * a Content SID exists.
 */
export async function sendTemplateMessage(
  _to: string,
  _contentSid: string,
  _vars: Record<string, string>,
): Promise<{ ok: boolean; reason?: string }> {
  return { ok: false, reason: "templates_pending" };
}

/** Fetch a Twilio-hosted media URL (voice notes) with basic auth. */
export async function fetchTwilioMedia(
  url: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isWhatsAppEnabled()) return null;
  try {
    const res = await fetch(url, {
      headers: {
        authorization:
          "Basic " + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64"),
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "audio/ogg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return { buffer, contentType };
  } catch {
    return null;
  }
}
