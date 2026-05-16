#!/usr/bin/env tsx
/**
 * Provision a TEST HR hotel-manager account so Diego can QA the HR
 * dashboard as a real hotel manager (role=property_admin, NOT
 * super_admin — so it can't see Master OS, exactly like a customer).
 *
 * Usage:
 *   set -a; source ../../../.env.local; set +a
 *   TEST_HR_EMAIL=diego+hotel@diegolujanstudio.com \
 *   TEST_HR_PASSWORD='TestHotel2026!' \
 *   npx tsx scripts/provision-test-hr.ts
 *
 * Idempotent: re-running resets the password so the creds are always known.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = (process.env.TEST_HR_EMAIL || "diego+hotel@diegolujanstudio.com")
  .trim()
  .toLowerCase();
const PASSWORD = process.env.TEST_HR_PASSWORD || "TestHotel2026!";
const NAME = process.env.TEST_HR_NAME || "Diego Test (gerente de hotel)";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("[provision-test-hr] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureMasterOrg(): Promise<string> {
  const { data } = await sb
    .from("organizations")
    .select("id")
    .eq("name", "Inglés Hotelero · Master")
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: created, error } = await sb
    .from("organizations")
    .insert({
      name: "Inglés Hotelero · Master",
      type: "independent",
      subscription_tier: "enterprise",
      subscription_status: "active",
      max_properties: 999,
      max_employees: 99999,
    })
    .select("id")
    .single();
  if (error) throw error;
  return created!.id as string;
}

async function ensureMasterProperty(orgId: string): Promise<string> {
  const { data } = await sb
    .from("properties")
    .select("id")
    .eq("slug", "master")
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: created, error } = await sb
    .from("properties")
    .insert({
      organization_id: orgId,
      name: "Master",
      slug: "master",
      country: "MX",
      timezone: "America/Mexico_City",
      is_active: true,
    })
    .select("id")
    .single();
  if (error) throw error;
  return created!.id as string;
}

async function findOrCreateAuthUser(): Promise<string> {
  const { data: list, error: listErr } = await sb.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listErr) throw listErr;
  const found = list.users.find(
    (u) => (u.email || "").toLowerCase() === EMAIL,
  );
  if (found) {
    await sb.auth.admin.updateUserById(found.id, {
      password: PASSWORD,
      email_confirm: true,
    });
    console.log(`[provision-test-hr] Reset password for existing ${EMAIL}.`);
    return found.id;
  }
  const { data: created, error } = await sb.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`[provision-test-hr] Created auth user ${EMAIL}.`);
  return created.user!.id;
}

async function main() {
  const orgId = await ensureMasterOrg();
  const propId = await ensureMasterProperty(orgId);
  const userId = await findOrCreateAuthUser();

  const { error } = await sb.from("hr_users").upsert(
    {
      id: userId,
      organization_id: orgId,
      property_id: propId,
      email: EMAIL,
      name: NAME,
      role: "property_admin", // hotel manager — NOT super_admin
      is_active: true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;

  console.log("\n[provision-test-hr] ✓ Test HR hotel-manager ready:");
  console.log(`  URL:      ${process.env.NEXT_PUBLIC_APP_URL || "https://ingleshotelero.netlify.app"}/hr/login`);
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log(`  Role:     property_admin (hotel manager — no Master OS)`);
}

main().catch((e) => {
  console.error("[provision-test-hr] FAILED:", e);
  process.exit(1);
});
