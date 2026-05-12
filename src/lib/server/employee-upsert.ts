import "server-only";

/**
 * Auto-upsert employees by (property_id, lower(trim(email))).
 *
 * Phase-7 contract:
 *   - non-empty email → upsert on (property_id, lower(trim(email)))
 *     using the functional unique index `employees_property_email_unique_idx`.
 *   - null/empty email → insert a new row (no name-based dedup).
 *   - `source` is set to 'self_registered' on insert and never overwritten.
 *
 * The actual implementation lives inside `createSession()` in
 * `@/lib/server/exam` to keep one canonical write path. This module
 * exposes the standalone helper for callers that need to upsert without
 * creating an exam session (e.g. cohort imports).
 */
import type { ServiceClient } from "./supabase-service";
import type { Database, RoleModule, Shift } from "@/lib/supabase/types";

type EmployeeRow = Database["public"]["Tables"]["employees"]["Row"];

export interface UpsertEmployeeInput {
  property_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  hotel_role: RoleModule;
  shift?: Shift | null;
  department?: string | null;
  whatsapp_opted_in?: boolean;
}

function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

export async function upsertEmployee(
  sb: ServiceClient,
  input: UpsertEmployeeInput,
): Promise<EmployeeRow> {
  const email = normalizeEmail(input.email ?? null);

  if (!email) {
    const inserted = await sb
      .from("employees")
      .insert({
        property_id: input.property_id,
        name: input.name,
        email: null,
        phone: input.phone ?? null,
        hotel_role: input.hotel_role,
        shift: input.shift ?? null,
        department: input.department ?? null,
        whatsapp_opted_in: input.whatsapp_opted_in ?? Boolean(input.phone),
        source: "self_registered",
      })
      .select("*")
      .single();
    if (inserted.error || !inserted.data) {
      throw new Error(
        `employee.insert.no_email.failed: ${inserted.error?.message ?? "unknown"}`,
      );
    }
    return inserted.data;
  }

  const existing = await sb
    .from("employees")
    .select("*")
    .eq("property_id", input.property_id)
    .ilike("email", email)
    .maybeSingle();

  if (existing.data) {
    const patch: Database["public"]["Tables"]["employees"]["Update"] = {};
    if (input.name && input.name !== existing.data.name) patch.name = input.name;
    if (input.phone !== undefined && input.phone !== existing.data.phone) {
      patch.phone = input.phone;
    }
    if (input.shift !== undefined && input.shift !== existing.data.shift) {
      patch.shift = input.shift;
    }
    if (input.department !== undefined && input.department !== existing.data.department) {
      patch.department = input.department;
    }
    if (
      input.whatsapp_opted_in !== undefined &&
      input.whatsapp_opted_in !== existing.data.whatsapp_opted_in
    ) {
      patch.whatsapp_opted_in = input.whatsapp_opted_in;
    }
    if (Object.keys(patch).length > 0) {
      const updated = await sb
        .from("employees")
        .update(patch)
        .eq("id", existing.data.id)
        .select("*")
        .single();
      if (updated.data) return updated.data;
    }
    return existing.data;
  }

  const inserted = await sb
    .from("employees")
    .insert({
      property_id: input.property_id,
      name: input.name,
      email,
      phone: input.phone ?? null,
      hotel_role: input.hotel_role,
      shift: input.shift ?? null,
      department: input.department ?? null,
      whatsapp_opted_in: input.whatsapp_opted_in ?? Boolean(input.phone),
      source: "self_registered",
    })
    .select("*")
    .single();

  if (inserted.error) {
    // Race: concurrent insert won. Re-read.
    const retry = await sb
      .from("employees")
      .select("*")
      .eq("property_id", input.property_id)
      .ilike("email", email)
      .maybeSingle();
    if (retry.data) return retry.data;
    throw new Error(`employee.upsert.failed: ${inserted.error.message}`);
  }
  if (!inserted.data) throw new Error("employee.upsert.failed: no row returned");
  return inserted.data;
}
