import "server-only";

/**
 * WhatsApp persistence adapter — server-only. Bridges the pure engine to
 * Supabase: find the employee behind a phone number, get/create today's
 * conversation row, and save a transition. Inert (returns null) when
 * Supabase isn't configured.
 */
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { pickDrillForEmployee } from "@/lib/practice/picker";
import { isoDate } from "@/lib/practice/streak";
import { normalizePhone } from "@/lib/whatsapp/engine";
import type { WaSnapshot } from "@/lib/whatsapp/engine";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

export interface WaEmployee {
  id: string;
  name: string;
  phone: string | null;
  hotel_role: RoleModule;
  current_level: CEFRLevel | null;
}

export interface WaSessionRow {
  id: string;
  employee_id: string;
  phone: string;
  date: string;
  state: WaSnapshot["state"];
  drill_id: string | null;
  module: RoleModule | null;
  level: CEFRLevel | null;
  listening_correct: boolean | null;
}

/** Two E.164 forms an MX number might be stored as (with/without legacy 1). */
function mxVariants(normalized: string): string[] {
  const out = new Set<string>([normalized]);
  if (/^\+52\d{10}$/.test(normalized)) out.add("+521" + normalized.slice(3));
  return [...out];
}

/**
 * Resolve the active, opted-in employee behind an inbound phone number.
 * Tries indexed exact matches on the E.164 variants first (fast path), then
 * a bounded normalized scan to tolerate free-form stored numbers. Returns
 * null for unknown / opted-out numbers.
 */
export async function findOptedInEmployeeByPhone(
  normalizedPhone: string,
): Promise<WaEmployee | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const cols = "id, name, phone, hotel_role, current_level";

  // Fast path: indexed exact match on the E.164 variants.
  const { data: exact } = await sb
    .from("employees")
    .select(cols)
    .eq("is_active", true)
    .eq("whatsapp_opted_in", true)
    .in("phone", mxVariants(normalizedPhone))
    .limit(1);
  if (exact && exact.length > 0) return exact[0] as WaEmployee;

  // Fallback: bounded scan tolerating free-form stored numbers.
  const { data: scan } = await sb
    .from("employees")
    .select(cols)
    .eq("is_active", true)
    .eq("whatsapp_opted_in", true)
    .not("phone", "is", null)
    .limit(2000);
  const match = (scan ?? []).find(
    (e) => e.phone && normalizePhone(e.phone) === normalizedPhone,
  );
  return (match as WaEmployee) ?? null;
}

/**
 * Get or create today's whatsapp_sessions row for an employee. On create,
 * the day's drill is chosen with the SAME picker the web loop uses.
 */
export async function getOrCreateTodaySession(
  employee: WaEmployee,
  phone: string,
  today: Date = new Date(),
): Promise<WaSessionRow | null> {
  const sb = createServiceClient();
  if (!sb) return null;
  const date = isoDate(today);

  const { data: existing } = await sb
    .from("whatsapp_sessions")
    .select("id, employee_id, phone, date, state, drill_id, module, level, listening_correct")
    .eq("employee_id", employee.id)
    .eq("date", date)
    .maybeSingle();
  if (existing) return existing as WaSessionRow;

  const level = (employee.current_level ?? "A2") as CEFRLevel;
  let drillId: string | null = null;
  try {
    const picked = await pickDrillForEmployee(employee.id, employee.hotel_role, level, today);
    drillId = picked.drill.id;
  } catch {
    drillId = null; // content gap — the route falls back to the picker again
  }

  const { data: created } = await sb
    .from("whatsapp_sessions")
    .insert({
      employee_id: employee.id,
      phone,
      date,
      state: "idle",
      drill_id: drillId,
      module: employee.hotel_role,
      level,
      last_inbound_at: today.toISOString(),
    })
    .select("id, employee_id, phone, date, state, drill_id, module, level, listening_correct")
    .maybeSingle();
  return (created as WaSessionRow) ?? null;
}

/** Persist a transition's next snapshot onto the session row. */
export async function saveTransition(
  row: WaSessionRow,
  next: WaSnapshot,
  patch: { audio_path?: string; speaking_score?: number } = {},
  now: Date = new Date(),
): Promise<void> {
  const sb = createServiceClient();
  if (!sb) return;
  await sb
    .from("whatsapp_sessions")
    .update({
      state: next.state,
      drill_id: next.drill_id,
      listening_correct: next.listening_correct,
      last_inbound_at: now.toISOString(),
      ...(patch.audio_path ? { audio_path: patch.audio_path } : {}),
      ...(typeof patch.speaking_score === "number"
        ? { speaking_score: patch.speaking_score }
        : {}),
    })
    .eq("id", row.id);
}

/** Opt an employee out of WhatsApp practice (BAJA/STOP compliance). */
export async function optOutEmployee(employeeId: string): Promise<void> {
  const sb = createServiceClient();
  if (!sb) return;
  await sb
    .from("employees")
    .update({ whatsapp_opted_in: false })
    .eq("id", employeeId);
}
