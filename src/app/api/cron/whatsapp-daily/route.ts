import "server-only";

/**
 * GET/POST /api/cron/whatsapp-daily
 *
 * Sends the daily-drill invitation to every active, opted-in employee with a
 * phone. Intended for a once-a-day scheduled function. Creates each
 * employee's whatsapp_sessions row (state='drill_sent') and sends the invite.
 *
 * Business-initiated WhatsApp sends require an APPROVED Meta template; until
 * that approval lands, sendTemplateMessage() is a stub and this dispatcher is
 * effectively a no-op in production (it still works against the Twilio
 * sandbox). The inbound flow (/api/whatsapp/incoming) is approval-independent.
 *
 * Auth mirrors /api/cron/score-pending: `?token=` or Bearer INTERNAL_API_TOKEN;
 * open-with-warning when the env var is unset. Fully inert when WhatsApp env
 * is absent (returns mode:'disabled').
 */
import { NextResponse } from "next/server";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/client-or-service";
import { isWhatsAppEnabled, sendTemplateMessage } from "@/lib/whatsapp/twilio";
import { pickDrillForEmployee } from "@/lib/practice/picker";
import { isoDate } from "@/lib/practice/streak";
import { WHATSAPP_TEMPLATES } from "@/content/whatsapp";
import { normalizePhone } from "@/lib/whatsapp/engine";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";
import type { CEFRLevel } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request): boolean {
  const token = process.env.INTERNAL_API_TOKEN;
  if (!token) {
    log.warn({}, "cron.whatsapp-daily.open — INTERNAL_API_TOKEN unset");
    return true;
  }
  const url = new URL(req.url);
  const header = req.headers.get("authorization");
  const bearer = header?.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
  return url.searchParams.get("token") === token || bearer === token;
}

async function handle(req: Request): Promise<NextResponse> {
  if (!authorize(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured() || !isWhatsAppEnabled()) {
    return NextResponse.json({ ok: true, mode: "disabled", sent: 0 });
  }

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, mode: "disabled", sent: 0 });

  try {
    const date = isoDate();
    // Bounded batch per invocation to stay within function limits; a scheduler
    // can call repeatedly. Only employees without a session row for today.
    const { data: employees } = await sb
      .from("employees")
      .select("id, name, phone, hotel_role, current_level")
      .eq("is_active", true)
      .eq("whatsapp_opted_in", true)
      .not("phone", "is", null)
      .limit(200);

    let sent = 0;
    let skipped = 0;
    for (const emp of employees ?? []) {
      const phone = normalizePhone(emp.phone as string);

      // Skip if a session already exists for today (idempotent).
      const { data: existing } = await sb
        .from("whatsapp_sessions")
        .select("id")
        .eq("employee_id", emp.id)
        .eq("date", date)
        .maybeSingle();
      if (existing) {
        skipped++;
        continue;
      }

      let drillId: string | null = null;
      try {
        const picked = await pickDrillForEmployee(
          emp.id,
          emp.hotel_role,
          (emp.current_level ?? "A2") as CEFRLevel,
        );
        drillId = picked.drill.id;
      } catch {
        drillId = null;
      }

      await sb.from("whatsapp_sessions").insert({
        employee_id: emp.id,
        phone,
        date,
        state: "drill_sent",
        drill_id: drillId,
        module: emp.hotel_role,
        level: (emp.current_level ?? "A2") as CEFRLevel,
        last_outbound_at: new Date().toISOString(),
      });

      const firstName = String(emp.name).trim().split(/\s+/)[0] ?? "";
      const res = await sendTemplateMessage(phone, WHATSAPP_TEMPLATES.daily_invite.name, {
        "1": firstName,
      });
      if (res.ok) sent++;
    }

    return NextResponse.json({ ok: true, mode: "live", sent, skipped });
  } catch (err) {
    captureException(err, { route: "GET /api/cron/whatsapp-daily" });
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
