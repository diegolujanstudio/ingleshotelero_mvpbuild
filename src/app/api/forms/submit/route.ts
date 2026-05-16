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
  "name",
  "email",
  "phone",
  "company",
  "hotel_count",
  "city",
  "role",
  "message",
]);

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

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch (err) {
    log.error({ err: String(err) }, "forms.submit.bad_body");
    return NextResponse.redirect(new URL("/", request.url), 303);
  }

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
  const redirectResponse = () =>
    NextResponse.redirect(new URL(dest, request.url), 303);

  // Honeypot — bots fill the hidden field. Drop silently (still thank them).
  if ((str(form.get("bot-field")) ?? "").length > 0) {
    log.warn({ formName }, "forms.submit.honeypot");
    return redirectResponse();
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
    company: str(form.get("company")),
    hotel_count: int(form.get("hotel_count")),
    city: str(form.get("city")),
    role: str(form.get("role")),
    message: str(form.get("message")),
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

  return redirectResponse();
}

// Visiting the endpoint directly is not meaningful — send people to support.
export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/soporte", request.url), 303);
}
