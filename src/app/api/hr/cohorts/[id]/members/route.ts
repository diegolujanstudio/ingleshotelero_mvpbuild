import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { canManageEmployees } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody } from "@/lib/server/api";

const PostSchema = z.object({
  employee_id: z.string().uuid(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "Sin permiso.", 403);
  }
  const parsed = await parseBody(req, PostSchema, "/api/hr/cohorts/[id]/members");
  if (!parsed.ok) return parsed.response;
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const propertyIds = await scopedPropertyIds(user, sb);
  // Cohort + employee must both be in scope.
  const [{ data: c }, { data: e }] = await Promise.all([
    sb.from("cohorts").select("property_id").eq("id", params.id).maybeSingle(),
    sb.from("employees").select("property_id").eq("id", parsed.data.employee_id).maybeSingle(),
  ]);
  if (!c || !e || !propertyIds.includes(c.property_id) || !propertyIds.includes(e.property_id)) {
    return jsonError("not_found", "Cohorte o empleado no encontrados.", 404);
  }
  if (c.property_id !== e.property_id) {
    return jsonError("forbidden", "Cohorte y empleado en propiedades diferentes.", 403);
  }
  const { error } = await sb.from("cohort_members").insert({
    cohort_id: params.id,
    employee_id: parsed.data.employee_id,
    status: "active",
    completion_pct: 0,
  });
  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "Sin permiso.", 403);
  }
  const url = new URL(req.url);
  const employeeId = url.searchParams.get("employee_id");
  if (!employeeId) return jsonError("invalid", "Falta employee_id.", 400);

  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const propertyIds = await scopedPropertyIds(user, sb);
  const { data: c } = await sb.from("cohorts").select("property_id").eq("id", params.id).maybeSingle();
  if (!c || !propertyIds.includes(c.property_id)) {
    return jsonError("not_found", "Cohorte no encontrada.", 404);
  }
  const { error } = await sb
    .from("cohort_members")
    .delete()
    .eq("cohort_id", params.id)
    .eq("employee_id", employeeId);
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
