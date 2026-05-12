import "server-only";

/**
 * Property + session scope helpers.
 *
 * Every server route that mutates exam data MUST derive the property and
 * employee from the URL/session, never trust the client. These helpers are
 * the single point that enforces that.
 *
 * `createServiceClient()` bypasses RLS — that's appropriate for these
 * privileged paths because we explicitly validate ownership here.
 */
import { createServiceClient } from "@/lib/supabase/client-or-service";
import type { Database } from "@/lib/supabase/types";

type Property = Pick<
  Database["public"]["Tables"]["properties"]["Row"],
  "id" | "organization_id" | "timezone" | "is_active" | "slug"
>;

type ExamSession = Database["public"]["Tables"]["exam_sessions"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export interface SessionWithEmployee {
  session: ExamSession;
  employee: Employee;
  property: Property;
}

/**
 * Resolve a property by slug. Returns null if not found or inactive.
 * Caller should 404 on null.
 */
export async function resolvePropertyBySlug(
  slug: string,
): Promise<Property | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("properties")
    .select("id, organization_id, timezone, is_active, slug")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  if (!data.is_active) return null;
  return data;
}

/**
 * Load a session + its employee + the property the employee belongs to.
 * Returns null if anything in the chain is missing. Caller 404s.
 */
export async function loadSessionWithEmployee(
  sessionId: string,
): Promise<SessionWithEmployee | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data: session } = await supabase
    .from("exam_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) return null;
  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("id", session.employee_id)
    .maybeSingle();
  if (!employee) return null;
  const { data: property } = await supabase
    .from("properties")
    .select("id, organization_id, timezone, is_active, slug")
    .eq("id", employee.property_id)
    .maybeSingle();
  if (!property) return null;
  return { session, employee, property };
}

/**
 * Status guard for answer-writing routes. Throws an Error with `.code` so
 * the route handler can map to a clean HTTP status.
 */
export function assertWritableStatus(
  status: ExamSession["status"],
  allowed: ExamSession["status"][],
): void {
  if (!allowed.includes(status)) {
    const err = new Error(
      `session status '${status}' not in allowed: ${allowed.join(",")}`,
    );
    (err as Error & { code?: string }).code = "INVALID_STATUS";
    throw err;
  }
}

/**
 * Aliases matching the contract names used by route handlers.
 */
export const getSessionWithEmployee = loadSessionWithEmployee;

/**
 * Cross-tenant guard. Returns the employee row if and only if it belongs to
 * the given property; null otherwise. Caller MUST 404 on null — never leak
 * "exists in another property".
 */
export async function getEmployeeForExam(
  propertyId: string,
  employeeId: string,
): Promise<Employee | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("employees")
    .select("*")
    .eq("id", employeeId)
    .eq("property_id", propertyId)
    .maybeSingle();
  return data ?? null;
}
