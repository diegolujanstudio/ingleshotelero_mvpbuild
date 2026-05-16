import "server-only";

/**
 * TEMPORARY diagnostic — remove after the HR-auth bug is fixed.
 *
 * GET /api/debug/whoami?t=<INTERNAL_API_TOKEN or 'ihdebug'>
 *
 * Reports, from a NORMAL request context (no signInWithPassword in
 * the same request — exactly what the middleware experiences):
 *   - which sb-* cookies arrived
 *   - the raw getUser() result + any error
 *   - the decoded JWT exp (if a token cookie is present)
 *
 * Gated by a token so it's not a public info leak.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  if (t !== (process.env.INTERNAL_API_TOKEN ?? "ihdebug")) {
    return NextResponse.json({ error: "nope" }, { status: 404 });
  }

  const jar = cookies();
  const all = jar.getAll();
  const sbCookies = all
    .filter((c) => c.name.startsWith("sb-"))
    .map((c) => ({ name: c.name, len: c.value.length, head: c.value.slice(0, 12) }));

  let userResult: { id: string; email?: string } | null = null;
  let userError: string | null = null;
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    userResult = data?.user
      ? { id: data.user.id, email: data.user.email }
      : null;
    userError = error ? `${error.name}: ${error.message}` : null;
  } catch (e) {
    userError = `threw: ${String(e)}`;
  }

  // Reproduce getHRUser()'s profile lookup BOTH ways to isolate the 307.
  let rlsRow: unknown = "skipped";
  let rlsErr: string | null = null;
  let svcRow: unknown = "skipped";
  let svcErr: string | null = null;
  if (userResult?.id) {
    try {
      const { data, error } = await supabase
        .from("hr_users")
        .select("id, email, role, is_active")
        .eq("id", userResult.id)
        .single();
      rlsRow = data ?? null;
      rlsErr = error ? `${error.code ?? ""}: ${error.message}` : null;
    } catch (e) {
      rlsErr = `threw: ${String(e)}`;
    }
    try {
      const svc = createServiceClient();
      const { data, error } = await svc
        .from("hr_users")
        .select("id, email, role, is_active")
        .eq("id", userResult.id)
        .single();
      svcRow = data ?? null;
      svcErr = error ? `${error.code ?? ""}: ${error.message}` : null;
    } catch (e) {
      svcErr = `threw: ${String(e)}`;
    }
  }

  return NextResponse.json({
    cookieCount: all.length,
    sbCookies,
    userResult,
    userError,
    hrLookup: { rlsRow, rlsErr, svcRow, svcErr },
    env: {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
  });
}
