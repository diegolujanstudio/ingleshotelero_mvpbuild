import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { canManageEmployees } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody, zLevel, zModule } from "@/lib/server/api";

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  module: zModule.optional(),
  target_level: zLevel.optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  completion_target_pct: z.number().int().min(0).max(100).optional(),
  status: z.enum(["draft", "active", "completed", "archived"]).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);
  const { data: c } = await sb.from("cohorts").select("*").eq("id", params.id).maybeSingle();
  if (!c) return jsonError("not_found", "Cohorte no encontrada.", 404);
  const propertyIds = await scopedPropertyIds(user, sb);
  if (!propertyIds.includes(c.property_id)) {
    return jsonError("not_found", "Cohorte no encontrada.", 404);
  }
  return NextResponse.json({ cohort: c });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "Sin permiso.", 403);
  }
  const parsed = await parseBody(req, PatchSchema, "/api/hr/cohorts/[id]");
  if (!parsed.ok) return parsed.response;
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const { data: c } = await sb.from("cohorts").select("property_id").eq("id", params.id).maybeSingle();
  if (!c) return jsonError("not_found", "Cohorte no encontrada.", 404);
  const propertyIds = await scopedPropertyIds(user, sb);
  if (!propertyIds.includes(c.property_id)) {
    return jsonError("not_found", "Cohorte no encontrada.", 404);
  }

  const { error } = await sb.from("cohorts").update(parsed.data).eq("id", params.id);
  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "Sin permiso.", 403);
  }
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);
  const { data: c } = await sb.from("cohorts").select("property_id").eq("id", params.id).maybeSingle();
  if (!c) return jsonError("not_found", "Cohorte no encontrada.", 404);
  const propertyIds = await scopedPropertyIds(user, sb);
  if (!propertyIds.includes(c.property_id)) {
    return jsonError("not_found", "Cohorte no encontrada.", 404);
  }
  const { error } = await sb.from("cohorts").update({ status: "archived" }).eq("id", params.id);
  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ ok: true });
}

async function scopedPropertyIds(
  user: { role: string; organization_id: string | null; property_id: string | null },
  sb: NonNullable<ReturnType<typeof createServiceClient>>,
): Promise<string[]> {
  if (user.role === "super_admin") {
    const { data } = await sb.from("properties").select("id").eq("is_active", true);
    return (data ?? []).map((p) => p.id);
  }
  if (user.role === "org_admin" && user.organization_id) {
    const { data } = await sb
      .from("properties")
      .select("id")
      .eq("organization_id", user.organization_id)
      .eq("is_active", true);
    return (data ?? []).map((p) => p.id);
  }
  if (user.property_id) return [user.property_id];
  return [];
}
