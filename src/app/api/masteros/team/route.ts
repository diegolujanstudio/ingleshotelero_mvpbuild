import { NextResponse } from "next/server";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

/** GET /api/masteros/team — all hr_users with org name (super_admin). */
export async function GET() {
  const user = await requireSuperAdminAPI();
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ members: [], demo: true });

  const { data: members, error } = await sb
    .from("hr_users")
    .select("id, email, name, role, is_active, organization_id, last_login_at")
    .order("role", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: orgs } = await sb.from("organizations").select("id, name");
  const orgName = new Map(
    ((orgs as { id: string; name: string }[] | null) ?? []).map((o) => [
      o.id,
      o.name,
    ]),
  );
  const out = ((members as Array<Record<string, unknown>> | null) ?? []).map(
    (m) => ({
      ...m,
      org_name: m.organization_id
        ? (orgName.get(m.organization_id as string) ?? null)
        : null,
    }),
  );
  return NextResponse.json({ members: out });
}
