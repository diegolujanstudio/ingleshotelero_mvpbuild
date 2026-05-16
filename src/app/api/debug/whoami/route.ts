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
import { createServerClient } from "@/lib/supabase/server";

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

  let userResult: unknown = null;
  let userError: string | null = null;
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.getUser();
    userResult = data?.user
      ? { id: data.user.id, email: data.user.email }
      : null;
    userError = error ? `${error.name}: ${error.message}` : null;
  } catch (e) {
    userError = `threw: ${String(e)}`;
  }

  return NextResponse.json({
    cookieCount: all.length,
    sbCookies,
    userResult,
    userError,
    env: {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
  });
}
