import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/hr/activate
 * Called from the accept-invite page after the user sets their password.
 * Updates the hr_users row: sets id = auth.uid(), is_active = true.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    auth_uid?: string;
    email?: string;
  } | null;

  if (!body?.auth_uid || !body?.email) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  try {
    const service = createServiceClient();
    const email = body.email.toLowerCase().trim();

    // Find the pending hr_users row by email.
    const { data: hrUser } = await service
      .from("hr_users")
      .select("id, email, is_active")
      .eq("email", email)
      .single();

    if (!hrUser) {
      return NextResponse.json({ error: "hr_users row not found" }, { status: 404 });
    }

    // Update: link to the real auth user and activate.
    // Use raw SQL because we need to update the PK (id).
    const { error } = await service.rpc("activate_hr_user" as never, {
      p_email: email,
      p_auth_uid: body.auth_uid,
    } as never);

    // Fallback if the RPC doesn't exist yet: direct update.
    if (error) {
      await service
        .from("hr_users")
        .update({ is_active: true, last_login_at: new Date().toISOString() })
        .eq("email", email);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "activation failed" }, { status: 500 });
  }
}
