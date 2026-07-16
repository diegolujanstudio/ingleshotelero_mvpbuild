import "server-only";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import type { HRUser } from "@/lib/auth/session";

/**
 * Chain/org property scope.
 *
 * org_admin and super_admin can read across every property in their org (or
 * the whole platform for super_admin). This module resolves WHICH of those
 * properties is currently "active" for the dashboard — either every property
 * in scope ("all") or a single one the user picked via the property switcher
 * — persisted as an httpOnly cookie.
 *
 * property_admin and viewer are always pinned to their single property; the
 * cookie is irrelevant for them (there is nothing to switch between).
 */

export const PROPERTY_COOKIE = "ih_hr_property";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export interface PropertyLite {
  id: string;
  name: string;
  slug: string;
  city: string | null;
}

/**
 * Every property the user is allowed to read, full scope (ignores the
 * active-property cookie). property_admin / viewer always get their single
 * property (or [] if they somehow have none assigned).
 */
export async function listScopedProperties(user: HRUser): Promise<PropertyLite[]> {
  const sb = createServiceClient();
  if (!sb) return [];
  try {
    if (user.role === "super_admin") {
      const { data } = await sb
        .from("properties")
        .select("id, name, slug, city")
        .eq("is_active", true)
        .order("name", { ascending: true });
      return data ?? [];
    }
    if (user.role === "org_admin" && user.organization_id) {
      const { data } = await sb
        .from("properties")
        .select("id, name, slug, city")
        .eq("organization_id", user.organization_id)
        .eq("is_active", true)
        .order("name", { ascending: true });
      return data ?? [];
    }
    if (user.property_id) {
      const { data } = await sb
        .from("properties")
        .select("id, name, slug, city")
        .eq("id", user.property_id)
        .maybeSingle();
      return data ? [data] : [];
    }
    return [];
  } catch {
    return [];
  }
}

/** Property ids the user can read — full scope, no cookie applied. */
export async function scopedPropertyIds(user: HRUser): Promise<string[]> {
  const properties = await listScopedProperties(user);
  return properties.map((p) => p.id);
}

export interface ActiveScope {
  /** Every property in the user's scope (full list, regardless of the active pick). */
  all: PropertyLite[];
  /** "all" or a single property id — the currently active pick. */
  activeId: string;
  /** Property ids to actually filter queries by: full scope for "all", else a single id. */
  propertyIds: string[];
}

/**
 * Resolve the active property scope for this request: reads the
 * `ih_hr_property` cookie, validates it against the user's full scope, and
 * falls back to "all" when the cookie is missing, malformed, or points at a
 * property outside the user's scope (e.g. stale cookie from a previous org).
 */
export async function resolveActiveScope(user: HRUser): Promise<ActiveScope> {
  const all = await listScopedProperties(user);
  const allIds = all.map((p) => p.id);

  // property_admin / viewer have nothing to switch between — always full
  // (single-property) scope, cookie ignored.
  if (user.role === "property_admin" || user.role === "viewer") {
    return { all, activeId: "all", propertyIds: allIds };
  }

  const cookieValue = cookies().get(PROPERTY_COOKIE)?.value;
  if (!cookieValue || cookieValue === "all" || !allIds.includes(cookieValue)) {
    return { all, activeId: "all", propertyIds: allIds };
  }
  return { all, activeId: cookieValue, propertyIds: [cookieValue] };
}

export const PROPERTY_COOKIE_MAX_AGE = ONE_YEAR_SECONDS;
