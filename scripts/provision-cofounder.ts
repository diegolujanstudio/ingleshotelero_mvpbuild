#!/usr/bin/env tsx
/**
 * Provision a co-founder as super_admin (full Master OS access),
 * pinned to the internal "Inglés Hotelero · Master" org. Idempotent:
 * re-running resets the password so the credential is always known.
 *
 * Usage:
 *   set -a; source ../../../.env.local; set +a
 *   COFOUNDER_EMAIL=victor.lujan@gmail.com \
 *   COFOUNDER_NAME="Victor Lujan" \
 *   COFOUNDER_PASSWORD='IngHotel2026!' \
 *   npx tsx scripts/provision-cofounder.ts
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = (process.env.COFOUNDER_EMAIL || "victor.lujan@gmail.com")
  .trim()
  .toLowerCase();
const NAME = process.env.COFOUNDER_NAME || "Victor Lujan";
const PASSWORD = process.env.COFOUNDER_PASSWORD || "IngHotel2026!";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("[cofounder] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing.");
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function masterOrg(): Promise<string> {
  const { data } = await sb
    .from("organizations")
    .select("id")
    .eq("name", "Inglés Hotelero · Master")
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: c, error } = await sb
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
  return c!.id as string;
}
async function masterProp(orgId: string): Promise<string> {
  const { data } = await sb
    .from("properties")
    .select("id")
    .eq("slug", "master")
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: c, error } = await sb
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
  return c!.id as string;
}
async function authUser(): Promise<string> {
  const { data: list, error } = await sb.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw error;
  const found = list.users.find(
    (u) => (u.email || "").toLowerCase() === EMAIL,
  );
  if (found) {
    await sb.auth.admin.updateUserById(found.id, {
      password: PASSWORD,
      email_confirm: true,
    });
    console.log(`[cofounder] reset password for existing ${EMAIL}`);
    return found.id;
  }
  const { data: c, error: e2 } = await sb.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (e2) throw e2;
  console.log(`[cofounder] created ${EMAIL}`);
  return c.user!.id;
}

async function main() {
  const orgId = await masterOrg();
  const propId = await masterProp(orgId);
  const uid = await authUser();
  const { error } = await sb.from("hr_users").upsert(
    {
      id: uid,
      organization_id: orgId,
      property_id: propId,
      email: EMAIL,
      name: NAME,
      role: "super_admin",
      is_active: true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
  console.log(`\n[cofounder] ✓ ${NAME} is super_admin`);
  console.log(`  Master OS: https://ingleshotelero.com/admin`);
  console.log(`  Email:     ${EMAIL}`);
  console.log(`  Password:  ${PASSWORD}`);
}
main().catch((e) => {
  console.error("[cofounder] FAILED:", e);
  process.exit(1);
});
