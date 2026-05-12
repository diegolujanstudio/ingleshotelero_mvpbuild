import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/server/exam";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";

const schema = z.object({
  property_slug: z.string().min(1).max(120),
  employee: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(200).optional().nullable(),
    phone: z.string().max(40).optional().nullable(),
    hotel_role: z.enum(["bellboy", "frontdesk", "restaurant"]),
    department: z.string().max(80).optional().nullable(),
    shift: z.enum(["morning", "afternoon", "night"]).optional().nullable(),
    whatsapp_opted_in: z.boolean().optional(),
  }),
  module: z.enum(["bellboy", "frontdesk", "restaurant"]),
  exam_type: z.enum(["placement", "monthly", "final"]).optional(),
  consent_version: z.string().max(40).optional(),
  // Demo-mode passthrough so the client can keep its localStorage id stable.
  client_session_id: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  // Rate limit (best-effort).
  const ip = getClientIp(req);
  const rl = await checkRateLimit("exams", ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "retry-after": "60" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Demo mode: no Supabase → return the client-supplied id (or a fresh uuid)
  // and let the client run from localStorage.
  if (!isSupabaseConfigured()) {
    const id = parsed.data.client_session_id ?? crypto.randomUUID();
    log.info({ route: "POST /api/exams", mode: "demo" }, "exam.demo.passthrough");
    return NextResponse.json({
      session_id: id,
      current_step: "diagnostic",
      employee_id: id, // placeholder — client doesn't use it in demo
      resumed: false,
      mode: "local-only",
    });
  }

  try {
    const result = await createSession({
      property_slug: parsed.data.property_slug,
      employee: parsed.data.employee,
      module: parsed.data.module,
      exam_type: parsed.data.exam_type,
      consent_version: parsed.data.consent_version,
    });
    return NextResponse.json({ ...result, mode: "persisted" });
  } catch (err) {
    const code = (err as Error & { code?: string }).code;
    if (code === "PROPERTY_NOT_FOUND") {
      return NextResponse.json({ error: "property_not_found" }, { status: 404 });
    }
    captureException(err, {
      route: "POST /api/exams",
      data: { property_slug: parsed.data.property_slug, module: parsed.data.module },
    });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
