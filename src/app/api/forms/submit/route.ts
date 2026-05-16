import "server-only";
import { NextResponse } from "next/server";
import { log } from "@/lib/server/log";
import {
  upsertLead,
  type LeadFormName,
  type UpsertLeadInput,
} from "@/lib/server/leads";
import { sendLeadNotification } from "@/lib/server/resend";

/**
 * POST /api/forms/submit  —  first-party form intake.
 *
 * WHY THIS EXISTS (and /api/contacto + the Netlify-Forms path did not work):
 * Netlify Forms only intercepts a submission when the POST is served by the
 * static deploy layer. This site is a Next.js SSR app under
 * @netlify/plugin-nextjs — EVERY route (incl. "/" and "/soporte/gracias") is
 * a server function, so Netlify's form processor never sees the POST.
 * `__forms.html` still let Netlify *register* the forms, but real
 * submissions (verified in QA via the live rendered form) were never
 * captured: 0 submissions, no webhook, no email.
 *
 * So we own the whole path here, no Netlify interception required:
 *   1. parse the urlencoded form body
 *   2. honeypot drop
 *   3. upsertLead()           → persists to `leads` (powers /masteros/leads)
 *   4. sendLeadNotification() → emails victor.lujan@gmail.com +
 *                               diego@diegolujanstudio.com via Resend
 *   5. 303 redirect to the per-form thank-you page
 *
 * The visitor ALWAYS lands on the gracias page — persistence/email are
 * best-effort and never block or 500 the human.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KNOWN_FORMS = new Set<LeadFormName>(["pilot", "soporte"]);

// Open-redirect guard: only ever bounce to a known internal gracias page.
const REDIRECTS: Record<string, string> = {
  pilot: "/contacto/gracias",
  soporte: "/soporte/gracias",
};
const ALLOWED_REDIRECTS = new Set<string>([
  "/contacto/gracias",
  "/soporte/gracias",
]);

const KNOWN_FIELDS = new Set([
  "form-name",
  "bot-field",
  "redirect",
  "ajax",
  "name",
  "email",
  "phone",
  "company",
  "hotel", // aliased → company (landing site field name)
  "hotel_count",
  "city",
  "role",
  "message",
  "note", // aliased → message (landing site field name)
]);

// The marketing landing (ingleshotelero.com) submits cross-origin via
// fetch(). Echo back an allowed origin so its `res.ok` check works. The
// PWA's own same-origin forms don't need this and are unaffected.
const ALLOWED_ORIGINS = new Set<string>([
  "https://ingleshotelero.com",
  "https://www.ingleshotelero.com",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
  }
  return {};
}

function str(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

function int(v: FormDataEntryValue | null): number | null {
  const s = str(v);
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

// CORS preflight for the cross-origin landing fetch (only fires for some
// browsers; urlencoded POSTs are "simple" and usually skip this).
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const cors = corsHeaders(origin);

  let form: FormData;
  try {
    form = await request.formData();
  } catch (err) {
    log.error({ err: String(err) }, "forms.submit.bad_body");
    return NextResponse.redirect(new URL("/", request.url), 303);
  }

  // The landing site posts via fetch() and only inspects res.ok — it owns
  // its own inline thank-you. Reply JSON (not a 303) so the cross-origin
  // fetch resolves cleanly. Same-origin PWA forms omit `ajax` → 303 as before.
  const isAjax = (str(form.get("ajax")) ?? "") === "1";

  const rawName = (str(form.get("form-name")) ?? "").toLowerCase();
  const formName: LeadFormName = KNOWN_FORMS.has(rawName as LeadFormName)
    ? (rawName as LeadFormName)
    : "other";

  // Resolve the thank-you destination up front so every exit path is safe.
  const requested = str(form.get("redirect")) ?? "";
  const dest =
    ALLOWED_REDIRECTS.has(requested) && requested
      ? requested
      : REDIRECTS[formName] ?? "/";
  // AJAX callers get JSON+CORS; classic form posts get a 303 to gracias.
  const done = () =>
    isAjax
      ? NextResponse.json({ ok: true }, { status: 200, headers: cors })
      : NextResponse.redirect(new URL(dest, request.url), 303);

  // Honeypot — bots fill the hidden field. Drop silently (still thank them).
  if ((str(form.get("bot-field")) ?? "").length > 0) {
    log.warn({ formName }, "forms.submit.honeypot");
    return done();
  }

  // Anything not modeled as a column is preserved in metadata so we never
  // lose a field (topic for soporte, acepta_privacidad for pilot, etc.).
  const metadata: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) {
    if (!KNOWN_FIELDS.has(k) && typeof v === "string" && v.trim().length > 0) {
      metadata[k] = v;
    }
  }
  const topic = str(form.get("topic"));
  if (topic) metadata.topic = topic;

  const input: UpsertLeadInput = {
    form_name: formName,
    name: str(form.get("name")),
    email: str(form.get("email")),
    phone: str(form.get("phone")),
    // Landing site labels the org field "hotel"; PWA forms use "company".
    company: str(form.get("company")) ?? str(form.get("hotel")),
    hotel_count: int(form.get("hotel_count")),
    city: str(form.get("city")),
    role: str(form.get("role")),
    // Landing site labels the free-text field "note"; PWA uses "message".
    message: str(form.get("message")) ?? str(form.get("note")),
    source_url:
      str(form.get("source_url")) ?? request.headers.get("referer") ?? null,
    user_agent: request.headers.get("user-agent"),
    metadata,
  };

  // Persist — best effort. Never block the visitor on a DB hiccup.
  let created = true;
  try {
    const result = await upsertLead(input);
    if (!result.ok) {
      log.error({ reason: result.reason, formName }, "forms.submit.upsert.fail");
    } else {
      created = result.created;
      log.info(
        { formName, leadId: result.id, created },
        "forms.submit.upserted",
      );
    }
  } catch (err) {
    log.error({ err: String(err), formName }, "forms.submit.upsert.threw");
  }

  // Notify victor + diego — best effort, only on a genuinely new lead.
  if (created) {
    try {
      const notify = await sendLeadNotification(formName, {
        ...input,
        ...(topic ? { topic } : {}),
      });
      log.info({ formName, notify }, "forms.submit.notified");
    } catch (err) {
      log.error({ err: String(err), formName }, "forms.submit.notify.threw");
    }
  }

  return done();
}

// Visiting the endpoint directly is not meaningful — send people to support.
export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/soporte", request.url), 303);
}
