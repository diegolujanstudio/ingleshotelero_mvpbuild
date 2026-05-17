import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { logAudit } from "@/lib/server/audit";

export const dynamic = "force-dynamic";

const Patch = z.object({
  role: z.enum(["super_admin", "org_admin", "property_admin", "viewer"]).optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!params.id || params.id.length > 64)
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  // Guardrail: never let the only super_admin demote/deactivate themselves
  // into lockout.
  if (params.id === user.id) {
    return NextResponse.json(
      { error: "cannot_modify_self", message: "No puedes cambiar tu propio rol o estado aquí." },
      { status: 409 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Patch.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });

  const { error } = await (sb as any)
    .from("hr_users")
    .update(parsed.data)
    .eq("id", params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "team.update",
    entity: "team",
    entityId: params.id,
    detail: parsed.data,
  });
  return NextResponse.json({ ok: true });
}
