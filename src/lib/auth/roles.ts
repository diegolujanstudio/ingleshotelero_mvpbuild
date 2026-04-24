import type { HRRole } from "@/lib/supabase/types";

const ROLE_RANK: Record<HRRole, number> = {
  super_admin: 4,
  org_admin: 3,
  property_admin: 2,
  viewer: 1,
};

export function canManageEmployees(role: HRRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.property_admin;
}

export function canViewReports(role: HRRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.viewer;
}

export function isOrgLevel(role: HRRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.org_admin;
}

/**
 * Can `callerRole` invite someone with `targetRole`?
 * Rule: you can only grant a role strictly below your own.
 * Viewers cannot invite anyone.
 */
export function canInvite(callerRole: HRRole, targetRole: HRRole): boolean {
  return ROLE_RANK[callerRole] > ROLE_RANK[targetRole];
}
