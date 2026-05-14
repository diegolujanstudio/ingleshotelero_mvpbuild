import "server-only";

/**
 * Employee session — passwordless personal-link auth.
 *
 * Employees never use Supabase Auth (per the brief). They access the app
 * via a personal URL `/i/{token}` that HR generates and sends them. The
 * route at `src/app/i/[token]/page.tsx` validates the token and sets a
 * long-lived httpOnly cookie `ih_employee_session` containing the raw
 * token. On every subsequent request, helpers in this file resolve the
 * cookie back to an employee row.
 *
 * Cookie config:
 *   - httpOnly + secure + sameSite=lax
 *   - 1-year expiry (revocation handled DB-side via revoked_at)
 *   - path=/
 *
 * Tokens are revocable: setting `revoked_at` invalidates them everywhere
 * on the next request (no cache to bust).
 */
import { cookies } from "next/headers";
import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { log } from "@/lib/server/log";

export const EMPLOYEE_COOKIE = "ih_employee_session";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export interface EmployeeSession {
  employee_id: string;
  property_id: string;
  organization_id: string;
  name: string;
  email: string | null;
  hotel_role: "bellboy" | "frontdesk" | "restaurant";
  current_level: "A1" | "A2" | "B1" | "B2" | null;
  is_active: boolean;
}

/**
 * Read the employee session from the request cookie. Returns null if no
 * cookie set, the token is unknown/revoked, or the employee row is
 * inactive. Memoized per render via React `cache()`.
 */
export const getEmployeeSession = cache(
  async (): Promise<EmployeeSession | null> => {
    const cookieStore = cookies();
    const token = cookieStore.get(EMPLOYEE_COOKIE)?.value;
    if (!token) return null;

    const sb = createServiceClient();
    if (!sb) return null;

    try {
      // Supabase types haven't been regenerated post-0007 yet — cast.
      type TokenRow = { employee_id: string; revoked_at: string | null };
      const tokensTable = (sb as unknown as {
        from: (t: string) => {
          select: (cols: string) => {
            eq: (k: string, v: string) => {
              maybeSingle: () => Promise<{ data: TokenRow | null }>;
            };
          };
        };
      }).from("employee_access_tokens");
      const tokenResp = await tokensTable
        .select("employee_id, revoked_at")
        .eq("token", token)
        .maybeSingle();
      const tokenRow = tokenResp.data;

      if (!tokenRow || tokenRow.revoked_at) return null;

      type EmpRow = {
        id: string;
        property_id: string;
        name: string;
        email: string | null;
        hotel_role: "bellboy" | "frontdesk" | "restaurant";
        current_level: "A1" | "A2" | "B1" | "B2" | null;
        is_active: boolean;
        properties: { organization_id: string };
      };
      const empResp = await sb
        .from("employees")
        .select(
          "id, property_id, name, email, hotel_role, current_level, is_active, properties!inner(organization_id)",
        )
        .eq("id", tokenRow.employee_id)
        .maybeSingle();
      const employee = empResp.data as unknown as EmpRow | null;

      if (!employee || !employee.is_active) return null;

      return {
        employee_id: employee.id,
        property_id: employee.property_id,
        organization_id: employee.properties?.organization_id ?? "",
        name: employee.name,
        email: employee.email,
        hotel_role: employee.hotel_role,
        current_level: employee.current_level,
        is_active: employee.is_active,
      };
    } catch (err) {
      log.warn({ err: String(err) }, "employee.session.lookup_failed");
      return null;
    }
  },
);

/**
 * Generate a fresh URL-safe access token (32 bytes ≈ 43 base64url chars).
 * Used by HR when minting a personal link for an employee.
 */
export function generateAccessToken(): string {
  // 32 bytes of randomness → ~256 bits of entropy. base64url-safe, no padding.
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  // btoa → base64; replace + / = with URL-safe variants
  return globalThis.btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
