import "server-only";
import { NextResponse } from "next/server";
import { upsertLead } from "@/lib/server/leads";
import { log } from "@/lib/server/log";

/**
 * POST /api/colocacion — public warm-lead intake ("examen de colocación").
 * A prospect hotel submits everything we need to quote them. Persists to
 * `leads` (form_name 'colocacion') with the full questionnaire in
 * metadata, surfaced in Master OS → Leads (Colocación) for follow-up.
 *
 * Honeypot-guarded. Always lands the visitor on /colocacion/gracias.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function s(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}
function n(v: FormDataEntryValue | null): number | null {
  const t = s(v);
  if (!t) return null;
  const x = Number.parseInt(t, 10);
  return Number.isFinite(x) ? x : null;
}

const KNOWN = new Set([
  "form-name",
  "bot-field",
  "name",
  "role",
  "email",
  "phone",
  "company",
  "hotel",
  "city",
  "hotel_count",
]);

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch (err) {
    log.error({ err: String(err) }, "colocacion.bad_body");
    return NextResponse.redirect(new URL("/colocacion", request.url), 303);
  }

  const done = () =>
    NextResponse.redirect(new URL("/colocacion/gracias", request.url), 303);

  // Honeypot.
  if ((s(form.get("bot-field")) ?? "").length > 0) return done();

  // Everything not a modeled column → metadata (areas, levels, goals,
  // timeline, team size, etc. — the quote inputs).
  const metadata: Record<string, unknown> = { kind: "colocacion" };
  for (const [k, v] of form.entries()) {
    if (!KNOWN.has(k) && typeof v === "string" && v.trim().length > 0) {
      metadata[k] = v;
    }
  }
  // Multi-value "areas" checkboxes.
  const areas = form.getAll("areas").filter((a) => typeof a === "string");
  if (areas.length) metadata.areas = areas;

  try {
    await upsertLead({
      form_name: "colocacion",
      name: s(form.get("name")),
      email: s(form.get("email")),
      phone: s(form.get("phone")),
      company: s(form.get("company")) ?? s(form.get("hotel")),
      hotel_count: n(form.get("hotel_count")),
      city: s(form.get("city")),
      role: s(form.get("role")),
      message: s(form.get("goals")),
      source_url:
        s(form.get("source_url")) ?? request.headers.get("referer") ?? null,
      user_agent: request.headers.get("user-agent"),
      metadata,
    });
  } catch (err) {
    log.error({ err: String(err) }, "colocacion.upsert.threw");
  }

  // ALSO register with Netlify Forms so the founders get the native
  // email notification (victor + diego, any-form) — Diego: use Netlify.
  // The static landing hosts the 'colocacion' Netlify form; this
  // server-side POST records the submission + fires Netlify's email.
  // Best-effort; the lead is already persisted above. The landing
  // webhook SKIPS colocacion to avoid a duplicate row.
  try {
    const params = new URLSearchParams();
    params.set("form-name", "colocacion");
    for (const [k, v] of form.entries()) {
      if (typeof v === "string" && k !== "bot-field") params.append(k, v);
    }
    await fetch("https://ingleshotelero.com/", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (err) {
    log.warn({ err: String(err) }, "colocacion.netlify_forward.failed");
  }

  return done();
}
