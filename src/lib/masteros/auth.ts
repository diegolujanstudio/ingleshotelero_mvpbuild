import "server-only";
import { redirect } from "next/navigation";
import { getHRUser, type HRUser } from "@/lib/auth/session";

/**
 * Defense-in-depth gate for every /masteros page and /api/masteros route.
 *
 * Middleware already rewrites non-super_admin requests to /__notfound — but
 * we re-check here so a misconfigured matcher, a leaked test route, or a
 * future refactor can't bypass the gate. If there's no user, or the user
 * isn't a super_admin, we redirect to /__notfound (Next falls back to the
 * global 404 surface).
 *
 * Returns the HRUser on success so callers can use it without a second DB
 * round-trip — getHRUser() is React-cached per request anyway.
 */
export async function requireSuperAdmin(): Promise<HRUser> {
  const user = await getHRUser();
  if (!user || user.role !== "super_admin") {
    redirect("/__notfound");
  }
  return user;
}

/**
 * API-route equivalent — returns null when access should be denied so the
 * caller can return a 404 JSON response (we never reveal that the route
 * exists). Use in /api/masteros/* route handlers.
 */
export async function requireSuperAdminAPI(): Promise<HRUser | null> {
  const user = await getHRUser();
  if (!user || user.role !== "super_admin") return null;
  return user;
}
