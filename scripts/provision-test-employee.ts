#!/usr/bin/env tsx
/**
 * One-shot script: provision a test employee + generate a personal access
 * link. Run this locally with `.env.local` sourced to seed Diego's testing
 * account against production Supabase.
 *
 * Usage:
 *   set -a; source ../../../.env.local; set +a
 *   TEST_EMPLOYEE_EMAIL=diego+empleado@diegolujanstudio.com \
 *   TEST_EMPLOYEE_NAME="Diego Test (empleado)" \
 *   TEST_EMPLOYEE_ROLE=frontdesk \
 *   npx tsx scripts/provision-test-employee.ts
 *
 * What it does:
 *   1. Ensures the "Inglés Hotelero · Master" org + "master" property
 *      exist (created by promote-super-admin if not).
 *   2. Auto-upserts the employee row by (property_id, lower(trim(email))).
 *   3. Mints a fresh access token in employee_access_tokens.
 *   4. Prints the personal URL — paste it into a browser to sign in as
 *      that employee.
 *
 * Idempotent. Safe to re-run; each run mints a new token (the previous
 * tokens stay active until you revoke them via the HR dashboard).
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.URL ||
  "https://ingleshotelero.netlify.app";

const EMAIL = (process.env.TEST_EMPLOYEE_EMAIL || "diego+empleado@diegolujanstudio.com")
  .trim()
  .toLowerCase();
const NAME = process.env.TEST_EMPLOYEE_NAME || "Diego Test (empleado)";
const ROLE = (process.env.TEST_EMPLOYEE_ROLE || "frontdesk") as
  | "bellboy"
  | "frontdesk"
  | "restaurant";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("[provision-test-employee] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function generateToken(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return globalThis.btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function masterPropertyId(): Promise<string> {
  const { data } = await sb
    .from("properties")
    .select("id")
    .eq("slug", "master")
    .maybeSingle();
  if (data?.id) return data.id;
  throw new Error(
    "Master property not found — run `npm run promote-admins` first to bootstrap the org + property.",
  );
}

async function upsertEmployee(propertyId: string): Promise<string> {
  // Try by property + lower(trim(email))
  const normalizedEmail = EMAIL.trim().toLowerCase();
  const { data: existing } = await sb
    .from("employees")
    .select("id")
    .eq("property_id", propertyId)
    .filter("email", "ilike", normalizedEmail)
    .maybeSingle();
  if (existing?.id) {
    console.log(`[provision-test-employee] Employee already exists: ${existing.id}`);
    return existing.id;
  }
  const { data: created, error } = await sb
    .from("employees")
    .insert({
      property_id: propertyId,
      name: NAME,
      email: normalizedEmail,
      hotel_role: ROLE,
      source: "manual",
      is_active: true,
    })
    .select("id")
    .single();
  if (error) throw error;
  console.log(`[provision-test-employee] Created employee: ${created.id}`);
  return created.id;
}

async function mintToken(employeeId: string): Promise<string> {
  const token = generateToken();
  const { error } = await sb.from("employee_access_tokens").insert({
    employee_id: employeeId,
    token,
    delivery_channel: "manual",
    notes: "test seed (provision-test-employee.ts)",
  });
  if (error) throw error;
  return token;
}

async function main() {
  const propId = await masterPropertyId();
  const empId = await upsertEmployee(propId);
  const token = await mintToken(empId);
  const url = `${APP_URL}/i/${token}`;

  console.log("");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Personal link minted. Open this URL in any browser to sign");
  console.log("  in as the test employee.");
  console.log("");
  console.log(`  ${url}`);
  console.log("");
  console.log(`  Employee: ${NAME} <${EMAIL}>`);
  console.log(`  Role:     ${ROLE}`);
  console.log(`  Property: master`);
  console.log("═══════════════════════════════════════════════════════════════");
}

main().catch((e) => {
  console.error("[provision-test-employee] Fatal:", e);
  process.exit(1);
});
