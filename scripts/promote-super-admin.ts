#!/usr/bin/env tsx
/**
 * Bootstrap script — promote the founder (and any other initial operators)
 * to `super_admin` so the /masteros surface is reachable.
 *
 * Idempotent: safe to run on every build. If the env vars aren't set or the
 * email list is empty, it logs a notice and exits 0 — never breaks the build.
 *
 * Inputs (env):
 *   SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPER_ADMIN_EMAILS — comma-separated list, lowercased automatically
 *
 * What it does, in order:
 *   1. Ensure the "Inglés Hotelero · Master" organization row exists.
 *   2. Ensure the "master" property row exists under that org.
 *   3. For each email in SUPER_ADMIN_EMAILS:
 *        a. Find or create an auth.users row (auto-confirmed, random temp password).
 *        b. Upsert into hr_users with role=super_admin, is_active=true,
 *           pinned to the master org + property.
 *
 * Temporary passwords printed to stdout are intentional — the operator
 * uses the forgot-password flow on first sign-in to set their own. Never
 * commit the script output.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAILS = (process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.warn(
    "[promote-super-admin] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — skipping bootstrap.",
  );
  process.exit(0);
}
if (EMAILS.length === 0) {
  console.warn(
    "[promote-super-admin] SUPER_ADMIN_EMAILS empty — no admins to promote.",
  );
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureMasterOrg(): Promise<string> {
  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("name", "Inglés Hotelero · Master")
    .maybeSingle();
  if (existing?.id) return existing.id as string;

  const { data: created, error } = await supabase
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
  const { data: existing } = await supabase
    .from("properties")
    .select("id")
    .eq("slug", "master")
    .maybeSingle();
  if (existing?.id) return existing.id as string;

  const { data: created, error } = await supabase
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

async function findOrCreateAuthUser(email: string): Promise<string | null> {
  // Optional shared password override for first-run provisioning. If set,
  // newly-created users get this password AND existing users get their
  // password reset to it (so the operator always knows the credentials).
  // Use forgot-password to rotate after first sign-in.
  const sharedPassword = process.env.SUPER_ADMIN_PASSWORD;

  // Paginated search of auth.users by email. For early-scale usage one page
  // is plenty; if we ever cross 200 admins this needs a loop.
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listErr) {
    console.error("[promote-super-admin] listUsers failed:", listErr);
    return null;
  }
  const found = list.users.find(
    (u) => (u.email || "").toLowerCase() === email,
  );
  if (found) {
    // If a shared password was provided, sync the existing user's password
    // to it so the operator can sign in even on a re-run.
    if (sharedPassword) {
      const { error: updErr } = await supabase.auth.admin.updateUserById(
        found.id,
        { password: sharedPassword, email_confirm: true },
      );
      if (updErr) {
        console.warn(
          `[promote-super-admin] could not sync password for ${email}:`,
          updErr.message,
        );
      } else {
        console.log(
          `[promote-super-admin] Reset ${email} password to SUPER_ADMIN_PASSWORD.`,
        );
      }
    }
    return found.id;
  }

  const password =
    sharedPassword ?? `IH-${globalThis.crypto.randomUUID()}`;
  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password,
      user_metadata: { name: email.split("@")[0] },
    });
  if (createErr) {
    console.error(
      `[promote-super-admin] createUser failed for ${email}:`,
      createErr,
    );
    return null;
  }
  if (sharedPassword) {
    console.log(
      `[promote-super-admin] Created ${email} with the shared SUPER_ADMIN_PASSWORD.`,
    );
  } else {
    console.log(
      `[promote-super-admin] Created ${email}. Temp password (rotate via forgot-password): ${password}`,
    );
  }
  return created.user?.id ?? null;
}

async function main() {
  const orgId = await ensureMasterOrg();
  const propId = await ensureMasterProperty(orgId);

  for (const email of EMAILS) {
    const userId = await findOrCreateAuthUser(email);
    if (!userId) {
      console.warn(
        `[promote-super-admin] Skipped ${email}: could not create auth user`,
      );
      continue;
    }
    const { error } = await supabase
      .from("hr_users")
      .upsert(
        {
          id: userId,
          email,
          name: email.split("@")[0],
          role: "super_admin",
          organization_id: orgId,
          property_id: propId,
          is_active: true,
        },
        { onConflict: "id" },
      );
    if (error) {
      console.error(`[promote-super-admin] Failed for ${email}:`, error);
      continue;
    }
    console.log(`[promote-super-admin] Promoted ${email} to super_admin.`);
  }
}

main().catch((e) => {
  console.error("[promote-super-admin] Fatal:", e);
  process.exit(0); // never break the build
});
