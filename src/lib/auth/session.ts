import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import type { HRRole } from "@/lib/supabase/types";

export interface HRUser {
  id: string;
  organization_id: string | null;
  property_id: string | null;
  email: string;
  name: string;
  role: HRRole;
  is_active: boolean;
}

/**
 * Load the current HR user from the database.
 * Memoized per request via React `cache()` so multiple Server Components
 * calling getHRUser() in the same render only hit the DB once.
 *
 * Returns null if not authenticated or if the hr_users row doesn't exist / is inactive.
 *
 * IDENTITY vs PROFILE — two separate steps, on purpose:
 *   1. Identity is verified with the RLS-bound SSR client's
 *      supabase.auth.getUser() — a signature-checked call to GoTrue.
 *   2. The hr_users PROFILE row is then loaded with the SERVICE client,
 *      scoped to that verified user.id.
 *
 * Why the profile read bypasses RLS: the hr_users SELECT policy is
 * self-referential and Postgres aborts the query with
 * `42P17: infinite recursion detected in policy for relation "hr_users"`.
 * Under the RLS-bound client every profile read threw, getHRUser()
 * caught it and returned null, and EVERY authenticated /hr and /masteros
 * request 307-redirected to "/". Reading by the already-verified user.id
 * with the service client is ownership-scoped and safe (per CLAUDE.md:
 * "Server routes that bypass RLS must validate ownership explicitly").
 * The recursive policy itself is fixed in migration 0008.
 */
export const getHRUser = cache(async (): Promise<HRUser | null> => {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Profile lookup via service client — RLS policy on hr_users
    // self-recurses (42P17). Identity is already proven above.
    const svc = createServiceClient();
    const client = (svc ?? supabase) as typeof supabase;

    const { data } = (await client
      .from("hr_users")
      .select("id, organization_id, property_id, email, name, role, is_active")
      .eq("id", user.id)
      .single()) as unknown as { data: HRUser | null };

    if (!data || !data.is_active) return null;

    return data;
  } catch {
    return null;
  }
});
