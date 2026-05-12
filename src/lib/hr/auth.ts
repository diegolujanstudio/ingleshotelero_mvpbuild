import "server-only";
import { redirect } from "next/navigation";
import { getHRUser, type HRUser } from "@/lib/auth/session";
import { isDemoMode } from "./demo-bridge";

/**
 * Defense-in-depth gate for every /hr/(authed) page.
 *
 * Middleware already redirects unauthenticated users to `/`. This second
 * check guarantees the page never renders without a verified hr_users row,
 * even if the matcher changes.
 *
 * In demo mode (no Supabase configured), returns a synthetic super_admin
 * so the dashboard renders for prospect pitches without auth.
 */
export async function requireHRUser(): Promise<HRUser> {
  // Demo mode short-circuit. The page can branch on demo data.
  if (isDemoMode() && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      id: "demo-super-admin",
      organization_id: "demo-org",
      property_id: "demo-property",
      email: "demo@ingleshotelero.com",
      name: "Demo Admin",
      role: "super_admin",
      is_active: true,
    };
  }

  const user = await getHRUser();
  if (!user) {
    redirect("/?returnTo=/hr");
  }
  return user;
}
