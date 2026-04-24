import { NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { canInvite } from "@/lib/auth/roles";
import type { HRRole } from "@/lib/supabase/types";

const VALID_ROLES: HRRole[] = [
  "super_admin",
  "org_admin",
  "property_admin",
  "viewer",
];

/**
 * POST /api/hr/invite
 * Send an auth invite email and create a pending hr_users row.
 *
 * Body: { email, name, role, property_id? }
 * - org_admin: can omit property_id to create another org_admin.
 * - property_admin: must include property_id (their own).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    name?: string;
    role?: string;
    property_id?: string;
  } | null;

  if (!body?.email || !body?.name || !body?.role) {
    return NextResponse.json(
      { error: "email, name, and role are required" },
      { status: 400 },
    );
  }

  if (!VALID_ROLES.includes(body.role as HRRole)) {
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  }

  // Load calling user from their JWT/session.
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Load caller's hr_users row to check their role.
  const { data: caller } = await supabase
    .from("hr_users")
    .select("id, organization_id, property_id, role, is_active")
    .eq("id", user.id)
    .single() as unknown as {
      data: {
        id: string;
        organization_id: string | null;
        property_id: string | null;
        role: string;
        is_active: boolean;
      } | null;
    };

  if (!caller || !caller.is_active) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const callerRole = caller.role as HRRole;
  const targetRole = body.role as HRRole;

  if (!canInvite(callerRole, targetRole)) {
    return NextResponse.json(
      { error: "cannot invite a user with equal or higher role" },
      { status: 403 },
    );
  }

  // Determine org + property for the new user.
  const organizationId = caller.organization_id;
  const propertyId = body.property_id ?? caller.property_id;

  // property_admin can only invite within their own property.
  if (
    callerRole === "property_admin" &&
    propertyId !== caller.property_id
  ) {
    return NextResponse.json(
      { error: "cannot invite to a different property" },
      { status: 403 },
    );
  }

  const service = createServiceClient();

  // Send the auth invite email.
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const { error: inviteError } = await service.auth.admin.inviteUserByEmail(
    body.email,
    { redirectTo: `${origin}/hr/accept-invite` },
  );

  if (inviteError) {
    return NextResponse.json(
      { error: inviteError.message },
      { status: 500 },
    );
  }

  // Create the pending hr_users row.
  // id will be null until the user accepts (then set to auth.uid()).
  // Use email as the lookup key for the accept flow.
  const { error: insertError } = await service.from("hr_users").upsert(
    {
      id: "00000000-0000-0000-0000-000000000000", // placeholder; updated on accept
      organization_id: organizationId,
      property_id: propertyId,
      email: body.email.toLowerCase().trim(),
      name: body.name,
      role: targetRole,
      is_active: false,
      invite_sent_at: new Date().toISOString(),
    } as never, // invite_sent_at not yet in TS types — safe at runtime
    { onConflict: "email" },
  );

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
