import "server-only";

/**
 * Leads CRM helpers — service-role-only.
 *
 * Shape and queries are shared with the /masteros leads surface (a
 * separate agent owns that UI). Keep this file the single source of truth
 * for the column → field mapping; the masteros agent imports from here.
 *
 * The leads table is defined in supabase/migrations/0006_leads.sql.
 * RLS allows super_admin SELECT/UPDATE; INSERTs are service-role only
 * (the Netlify-Forms webhook), which bypasses RLS.
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import { log } from "./log";

// ─────────────────────────────────────────────────────────────
// Shapes
// ─────────────────────────────────────────────────────────────

export type LeadFormName = "pilot" | "soporte" | "other";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed"
  | "spam";

export interface LeadRow {
  id: string;
  form_name: LeadFormName;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  hotel_count: number | null;
  city: string | null;
  role: string | null;
  message: string | null;
  source_url: string | null;
  user_agent: string | null;
  ip_country: string | null;
  netlify_submission_id: string | null;
  netlify_form_id: string | null;
  metadata: Record<string, unknown>;
  status: LeadStatus;
  notes: string | null;
  contacted_at: string | null;
  contacted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertLeadInput {
  form_name: LeadFormName;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  hotel_count?: number | null;
  city?: string | null;
  role?: string | null;
  message?: string | null;
  source_url?: string | null;
  user_agent?: string | null;
  ip_country?: string | null;
  netlify_submission_id?: string | null;
  netlify_form_id?: string | null;
  metadata?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// Upsert
// ─────────────────────────────────────────────────────────────

export type UpsertLeadResult =
  | { ok: true; id: string; created: boolean }
  | { ok: false; reason: "no_supabase" | "db_error"; error?: string };

/**
 * Insert a new lead. If a row with the same `netlify_submission_id` already
 * exists, returns the existing id with `created: false` (idempotent — Netlify
 * retries the webhook on transient failures and we MUST NOT double-store).
 *
 * Returns `no_supabase` when env vars are missing so the caller can log
 * loudly without the route 500ing.
 */
export async function upsertLead(
  input: UpsertLeadInput,
): Promise<UpsertLeadResult> {
  const supa = createServiceClient();
  if (!supa) return { ok: false, reason: "no_supabase" };

  const row = {
    form_name: input.form_name,
    name: trimOrNull(input.name),
    email: trimOrNull(input.email)?.toLowerCase() ?? null,
    phone: trimOrNull(input.phone),
    company: trimOrNull(input.company),
    hotel_count: typeof input.hotel_count === "number" ? input.hotel_count : null,
    city: trimOrNull(input.city),
    role: trimOrNull(input.role),
    message: trimOrNull(input.message),
    source_url: trimOrNull(input.source_url),
    user_agent: trimOrNull(input.user_agent),
    ip_country: trimOrNull(input.ip_country),
    netlify_submission_id: trimOrNull(input.netlify_submission_id),
    netlify_form_id: trimOrNull(input.netlify_form_id),
    metadata: input.metadata ?? {},
  };

  // Idempotency: if Netlify retries, the unique netlify_submission_id will
  // collide. Look the row up first and short-circuit before insert.
  if (row.netlify_submission_id) {
    const { data: existing, error: lookupErr } = await (supa as any)
      .from("leads")
      .select("id")
      .eq("netlify_submission_id", row.netlify_submission_id)
      .maybeSingle();

    if (lookupErr) {
      log.warn(
        { err: String(lookupErr), submissionId: row.netlify_submission_id },
        "leads.lookup.failed",
      );
    } else if (existing?.id) {
      return { ok: true, id: existing.id as string, created: false };
    }
  }

  const { data, error } = await (supa as any)
    .from("leads")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    log.error(
      { err: String(error), form: row.form_name },
      "leads.insert.failed",
    );
    return { ok: false, reason: "db_error", error: String(error) };
  }

  return { ok: true, id: data!.id as string, created: true };
}

// ─────────────────────────────────────────────────────────────
// List + Update (used by /masteros)
// ─────────────────────────────────────────────────────────────

export interface ListLeadsOpts {
  formName?: LeadFormName;
  status?: LeadStatus;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListLeadsResult {
  rows: LeadRow[];
  total: number;
}

export async function listLeads(opts: ListLeadsOpts = {}): Promise<ListLeadsResult> {
  const supa = createServiceClient();
  if (!supa) return { rows: [], total: 0 };

  const limit = clamp(opts.limit ?? 50, 1, 200);
  const offset = Math.max(0, opts.offset ?? 0);

  let query = (supa as any)
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (opts.formName) query = query.eq("form_name", opts.formName);
  if (opts.status) query = query.eq("status", opts.status);

  if (opts.search && opts.search.trim().length > 0) {
    const q = opts.search.trim().replace(/[%_]/g, "\\$&");
    // Fan out across the most common columns; ILIKE is fine at this scale.
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%,city.ilike.%${q}%,message.ilike.%${q}%`,
    );
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    log.error({ err: String(error) }, "leads.list.failed");
    return { rows: [], total: 0 };
  }

  return { rows: (data ?? []) as LeadRow[], total: count ?? 0 };
}

export interface UpdateLeadStatusResult {
  ok: boolean;
  error?: string;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string,
  byUserId?: string,
): Promise<UpdateLeadStatusResult> {
  const supa = createServiceClient();
  if (!supa) return { ok: false, error: "no_supabase" };

  const patch: Record<string, unknown> = { status };
  if (notes !== undefined) patch.notes = notes;
  if (status === "contacted") {
    patch.contacted_at = new Date().toISOString();
    if (byUserId) patch.contacted_by = byUserId;
  }

  const { error } = await (supa as any).from("leads").update(patch).eq("id", id);
  if (error) {
    log.error({ err: String(error), id }, "leads.update.failed");
    return { ok: false, error: String(error) };
  }
  return { ok: true };
}

/**
 * Permanently remove a lead. Super-admin only (enforced at the route).
 * Used to clear spam / test rows from the Inbox.
 */
export async function deleteLead(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const supa = createServiceClient();
  if (!supa) return { ok: false, error: "no_supabase" };
  const { error } = await (supa as any).from("leads").delete().eq("id", id);
  if (error) {
    log.error({ err: String(error), id }, "leads.delete.failed");
    return { ok: false, error: String(error) };
  }
  log.info({ id }, "leads.delete.ok");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
