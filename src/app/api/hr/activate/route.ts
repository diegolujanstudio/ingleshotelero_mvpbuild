import { NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

// Service-role + auth.getUser() both require the Node runtime.
export const runtime = "nodejs";

/**
 * POST /api/hr/activate
 * Called from the accept-invite page after the user sets their password.
 * Links the pending hr_users row to the real auth user and activates it.
 *
 * SECURITY: identity is derived exclusively from the verified Supabase
 * session (auth.getUser()). The request body is NOT trusted — a forged body
 * must never be able to bind an arbitrary auth uid/email to an hr_users row,
 * nor re-activate someone else's (e.g. a removed admin's) account.
 */
export async function POST(_req: Request) {
  // Demo / local-only fallback: no Supabase configured.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  try {
    // Derive the caller's identity from the verified session cookie, never
    // from the request body. This is the whole fix for the forged-cookie /
    // arbitrary-email activation vulnerability.
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const service = createServiceClient();
    // Only ever the authenticated user's own email — no client-supplied value.
    const email = user.email.toLowerCase().trim();

    // Find the pending hr_users row by the authenticated email only.
    const { data: hrUser, error: lookupErr } = await service
      .from("hr_users")
      .select("id, email, is_active")
      .eq("email", email)
      .maybeSingle();

    // A DB error is transient — return 5xx so the caller can retry, rather than
    // mislabelling it as a genuinely-absent row (404).
    if (lookupErr) {
      return NextResponse.json({ error: "activation failed" }, { status: 503 });
    }
    if (!hrUser) {
      return NextResponse.json({ error: "hr_users row not found" }, { status: 404 });
    }

    // Activate: bind the row to the real auth uid from the verified session
    // (never a client-supplied value) and set it active. Binding id here is a
    // safety net — the invite now seeds id = auth.uid() up front — and covers
    // any legacy pending row created before that change. Scoped strictly to the
    // authenticated user's own email, so it can never touch another account.
    const { error: updateErr } = await service
      .from("hr_users")
      .update({
        id: user.id,
        is_active: true,
        last_login_at: new Date().toISOString(),
      } as never)
      .eq("email", email);

    if (updateErr) {
      return NextResponse.json({ error: "activation failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "activation failed" }, { status: 500 });
  }
}
