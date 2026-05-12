import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { canManageEmployees } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody } from "@/lib/server/api";
import { EMPLOYEE_STATUS_VALUES } from "@/content/hr";

const Schema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  status: z.enum(EMPLOYEE_STATUS_VALUES),
});

/** POST /api/hr/employees/bulk — bulk update status (e.g., archive). */
export async function POST(req: Request) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "Sin permiso.", 403);
  }
  const parsed = await parseBody(req, Schema, "/api/hr/employees/bulk");
  if (!parsed.ok) return parsed.response;
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  // Verify every id is in scope before updating any of them.
  const propertyIds = await scopedPropertyIds(user, sb);
  const { data: rows } = await sb
    .from("employees")
    .select("id, property_id")
    .in("id", parsed.data.ids);
  const okIds = (rows ?? []).filter((r) => propertyIds.includes(r.property_id)).map((r) => r.id);
  if (okIds.length === 0) {
    return jsonError("not_found", "Ningún empleado en alcance.", 404);
  }

  const isActive =
    parsed.data.status === "active" || parsed.data.status === "promoted";
  const { error } = await sb
    .from("employees")
    .update({ is_active: isActive })
    .in("id", okIds);
  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ ok: true, updated: okIds.length });
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
