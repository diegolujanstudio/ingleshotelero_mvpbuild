import "server-only";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { log } from "@/lib/server/log";
import { upsertLead, type LeadFormName, type UpsertLeadInput } from "@/lib/server/leads";
import { sendLeadNotification } from "@/lib/server/resend";

/**
 * POST /api/netlify/forms-webhook
 *
 * Netlify Forms posts a JSON envelope here for every accepted submission
 * (configured per-site in Netlify dashboard → Forms → Notifications →
 * Outgoing webhook). The envelope shape is documented at
 * https://docs.netlify.com/forms/notifications/#outgoing-webhook and looks
 * roughly like:
 *
 *   {
 *     "id": "<submission-id>",
 *     "form_id": "<netlify form id>",
 *     "form_name": "pilot",
 *     "site_url": "https://app.ingleshotelero.com",
 *     "data": { "name": "...", "email": "...", ... },
 *     "ordered_human_fields": [...],
 *     "human_fields": { ... },
 *     "created_at": "...",
 *     "ip": "...",
 *     "user_agent": "..."
 *   }
 *
 * We:
 *   1. Optionally verify the X-Webhook-Signature JWT (HS256) using
 *      NETLIFY_WEBHOOK_SECRET. If the secret isn't set we accept anyway —
 *      Netlify Forms webhook signing is recent and not always available;
 *      log loudly so Diego knows to wire it up in production.
 *   2. Map known fields (form-name + data.*) onto our `leads` columns.
 *      Anything we don't model lands in `metadata` so we never lose data.
 *   3. Upsert idempotently keyed on netlify_submission_id.
 *   4. Best-effort notify Victor + Diego via Resend.
 *   5. Always 200 — Netlify retries non-2xx responses aggressively.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Forms we recognize. Anything else is bucketed as `other` so a stray
// HTML form doesn't blow up the webhook — the row is still searchable.
const KNOWN_FORMS = new Set<LeadFormName>(["pilot", "soporte"]);

interface NetlifyEnvelope {
  id?: string;
  form_id?: string;
  form_name?: string;
  site_url?: string;
  data?: Record<string, unknown>;
  human_fields?: Record<string, unknown>;
  ordered_human_fields?: unknown;
  created_at?: string;
  ip?: string;
  user_agent?: string;
  referrer?: string;
}

export async function POST(request: Request) {
  // ── 1. Read raw body once — needed both for JSON parsing and for HMAC
  //       verification (signature is computed over the exact bytes Netlify
  //       sent, not the re-serialized form).
  const raw = await request.text();

  // ── 2. Optional signature verification.
  const verification = verifySignature(request.headers, raw);
  if (verification === "rejected") {
    log.warn({ route: "POST /api/netlify/forms-webhook" }, "netlify.webhook.bad_signature");
    return NextResponse.json({ ok: false, reason: "bad_signature" }, { status: 401 });
  }
  if (verification === "skipped") {
    log.warn(
      { route: "POST /api/netlify/forms-webhook" },
      "netlify.webhook.signature_skipped",
    );
  }

  // ── 3. Parse envelope.
  let envelope: NetlifyEnvelope;
  try {
    envelope = JSON.parse(raw) as NetlifyEnvelope;
  } catch (err) {
    log.error({ err: String(err) }, "netlify.webhook.bad_json");
    // Still 200 — replays would never succeed.
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 200 });
  }

  // ── 4. Map.
  const data = (envelope.data ?? {}) as Record<string, unknown>;
  const rawFormName = String(envelope.form_name ?? data["form-name"] ?? "").trim();
  const formName: LeadFormName = KNOWN_FORMS.has(rawFormName as LeadFormName)
    ? (rawFormName as LeadFormName)
    : "other";

  // Honeypot — if the bot-field is filled, drop silently. Netlify already
  // does this server-side when `netlify-honeypot` is configured on the
  // form, but defense-in-depth is cheap.
  if (typeof data["bot-field"] === "string" && data["bot-field"].length > 0) {
    log.warn({ formName }, "netlify.webhook.honeypot_tripped");
    return NextResponse.json({ ok: true, dropped: "honeypot" });
  }

  const known = new Set([
    "form-name",
    "bot-field",
    "name",
    "email",
    "phone",
    "company",
    "hotel_count",
    "city",
    "role",
    "message",
    "topic",
    "source_url",
  ]);
  const metadata: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (!known.has(k)) metadata[k] = v;
  }
  // Topic is soporte-specific; we keep the column generic and stash it in
  // metadata where /masteros and the email renderer can both see it.
  if (typeof data.topic === "string") metadata.topic = data.topic;

  const input: UpsertLeadInput = {
    form_name: formName,
    name: pickStr(data.name),
    email: pickStr(data.email),
    phone: pickStr(data.phone),
    company: pickStr(data.company),
    hotel_count: pickInt(data.hotel_count),
    city: pickStr(data.city),
    role: pickStr(data.role),
    message: pickStr(data.message),
    source_url: pickStr(data.source_url) ?? pickStr(envelope.referrer),
    user_agent: pickStr(envelope.user_agent),
    netlify_submission_id: pickStr(envelope.id),
    netlify_form_id: pickStr(envelope.form_id),
    metadata,
  };

  // ── 5. Persist.
  const result = await upsertLead(input);
  if (!result.ok) {
    log.error(
      { reason: result.reason, formName, submissionId: input.netlify_submission_id },
      "netlify.webhook.upsert.failed",
    );
    // Still 200 so Netlify doesn't hammer retries — we'll see it in logs.
    return NextResponse.json({ ok: false, reason: result.reason });
  }

  log.info(
    {
      formName,
      leadId: result.id,
      created: result.created,
      submissionId: input.netlify_submission_id,
    },
    "netlify.webhook.upserted",
  );

  // ── 6. Notify (best-effort; do not block the webhook on email failure).
  if (result.created) {
    const emailPayload = {
      ...input,
      ...(typeof data.topic === "string" ? { topic: data.topic } : {}),
    };
    const notify = await sendLeadNotification(formName, emailPayload);
    log.info({ formName, notify }, "netlify.webhook.notify.done");
  }

  return NextResponse.json({ ok: true, id: result.id, created: result.created });
}

// GET for liveness — handy when configuring the URL in the Netlify dashboard.
export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "POST /api/netlify/forms-webhook",
    accepts: "application/json (Netlify Forms outgoing webhook envelope)",
  });
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function pickStr(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

function pickInt(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string") {
    const n = Number.parseInt(v.trim(), 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Verify the Netlify outgoing-webhook JWT signature.
 *
 * Netlify sends the token in the `X-Webhook-Signature` header. The token is
 * a JWT (HS256) whose payload contains a `sha256` claim — the SHA-256 hash
 * of the request body. We:
 *
 *   1. Verify the JWT signature using NETLIFY_WEBHOOK_SECRET.
 *   2. Confirm the embedded sha256 matches our recomputed hash of `raw`.
 *
 * Returns:
 *   "verified" — signature checked and matches.
 *   "skipped"  — no secret configured (dev/demo); accept anyway.
 *   "rejected" — signature present but invalid; refuse.
 */
function verifySignature(
  headers: Headers,
  raw: string,
): "verified" | "skipped" | "rejected" {
  const secret = process.env.NETLIFY_WEBHOOK_SECRET;
  if (!secret) return "skipped";

  const token = headers.get("x-webhook-signature") ?? headers.get("X-Webhook-Signature");
  if (!token) return "rejected";

  const parts = token.split(".");
  if (parts.length !== 3) return "rejected";
  const [encodedHeader, encodedPayload, encodedSig] = parts;

  // 1. Recompute HMAC-SHA256 over `${header}.${payload}` and compare.
  const expected = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  let received: Buffer;
  try {
    received = base64UrlDecode(encodedSig);
  } catch {
    return "rejected";
  }
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return "rejected";
  }

  // 2. Cross-check the body hash claim if present. (Netlify's payload uses
  //    `sha256` but we accept missing — JWT signature alone proves the
  //    sender knows the secret.)
  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8")) as {
      sha256?: string;
    };
    if (payload.sha256) {
      const bodyHash = createHmac("sha256", secret).update(raw).digest("hex");
      // Some Netlify variants put a plain SHA-256 here instead of HMAC.
      // Be permissive: accept either to avoid false rejects.
      const plainHash = require("node:crypto")
        .createHash("sha256")
        .update(raw)
        .digest("hex");
      if (payload.sha256 !== bodyHash && payload.sha256 !== plainHash) {
        return "rejected";
      }
    }
  } catch {
    // Malformed payload — JWT verified, body hash unverifiable. Accept.
  }

  return "verified";
}

function base64UrlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}
