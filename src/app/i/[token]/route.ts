import "server-only";

/**
 * GET /i/[token] — Personal-link entry for an employee.
 *
 * Must be a Route Handler (not a page) because it sets a cookie —
 * Next 14 only allows cookie mutation in Route Handlers / Server
 * Actions, never in a Server Component render.
 *
 * Flow:
 *   1. Validate the access token against employee_access_tokens.
 *   2. Valid + not revoked + employee active → set the long-lived
 *      `ih_employee_session` cookie, bump last_used_at, 302 → /practice.
 *   3. Invalid / revoked / unavailable → 302 → /acceso?e=<reason>
 *      (a friendly Spanish page that tells them to ask HR for a new
 *      link).
 */
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { EMPLOYEE_COOKIE } from "@/lib/auth/employee";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function GET(
  req: Request,
  { params }: { params: { token: string } },
) {
  const origin = new URL(req.url).origin;
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/acceso?e=${reason}`, { status: 302 });

  const token = decodeURIComponent(params.token ?? "").trim();
  if (token.length < 24) return fail("invalido");

  const sb = createServiceClient();
  if (!sb) return fail("nodisponible");

  // Types regenerated post-0007 will narrow this — cast for now.
  type TokenRow = { id: string; employee_id: string; revoked_at: string | null };
  const tokensTable = (
    sb as unknown as {
      from: (t: string) => {
        select: (c: string) => {
          eq: (k: string, v: string) => {
            maybeSingle: () => Promise<{ data: TokenRow | null }>;
          };
        };
      };
    }
  ).from("employee_access_tokens");

  const tokenResp = await tokensTable
    .select("id, employee_id, revoked_at")
    .eq("token", token)
    .maybeSingle();
  const tokenRow = tokenResp.data;

  if (!tokenRow) return fail("invalido");
  if (tokenRow.revoked_at) return fail("revocado");

  const { data: employee } = await sb
    .from("employees")
    .select("id, is_active")
    .eq("id", tokenRow.employee_id)
    .maybeSingle();

  if (!employee) return fail("invalido");
  if (!employee.is_active) return fail("revocado");

  // Bump last_used_at — fire and forget.
  const updTable = (
    sb as unknown as {
      from: (t: string) => {
        update: (v: unknown) => {
          eq: (k: string, v: string) => Promise<unknown>;
        };
      };
    }
  ).from("employee_access_tokens");
  void updTable
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenRow.id);

  // Set the session cookie on the redirect response (Route Handlers can).
  const res = NextResponse.redirect(`${origin}/practice`, { status: 302 });
  res.cookies.set(EMPLOYEE_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
  return res;
}
