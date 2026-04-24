import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
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
 */
export const getHRUser = cache(async (): Promise<HRUser | null> => {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from("hr_users")
      .select("id, organization_id, property_id, email, name, role, is_active")
      .eq("id", user.id)
      .single() as unknown as { data: HRUser | null };

    if (!data || !data.is_active) return null;

    return data;
  } catch {
    return null;
  }
});
