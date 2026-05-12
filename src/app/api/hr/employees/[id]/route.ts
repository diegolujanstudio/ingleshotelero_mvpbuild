import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { canManageEmployees } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody, zEmail } from "@/lib/server/api";
import { EMPLOYEE_STATUS_VALUES } from "@/content/hr";

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  email: zEmail.optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  hotel_role: z.enum(["bellboy", "frontdesk", "restaurant"]).optional(),
  department: z.string().optional(),
  shift: z.enum(["morning", "afternoon", "night"]).optional().or(z.literal("")),
  current_level: z.enum(["A1", "A2", "B1", "B2"]).optional().or(z.literal("")),
  whatsapp_opted_in: z.boolean().optional(),
  status: z.enum(EMPLOYEE_STATUS_VALUES).optional(),
});

/** GET single employee — scoped read. */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);
  const propertyIds = await scopedPropertyIds(user, sb);
  const { data: emp } = await sb.from("employees").select("*").eq("id", params.id).maybeSingle();
  if (!emp || !propertyIds.includes(emp.property_id)) {
    return jsonError("not_found", "Empleado no encontrado.", 404);
  }
  return NextResponse.json({ employee: emp });
}

/** PATCH — update contact info, work info, status. Status maps to is_active. */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "No tienes permiso para editar empleados.", 403);
  }
  const parsed = await parseBody(req, PatchSchema, "/api/hr/employees/[id]");
  if (!parsed.ok) return parsed.response;

  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const propertyIds = await scopedPropertyIds(user, sb);
  const { data: emp } = await sb
    .from("employees")
    .select("property_id")
    .eq("id", params.id)
    .maybeSingle();
  if (!emp || !propertyIds.includes(emp.property_id)) {
    return jsonError("not_found", "Empleado no encontrado.", 404);
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.email !== undefined) update.email = parsed.data.email || null;
  if (parsed.data.phone !== undefined) update.phone = parsed.data.phone || null;
  if (parsed.data.hotel_role !== undefined) update.hotel_role = parsed.data.hotel_role;
  if (parsed.data.department !== undefined) update.department = parsed.data.department || null;
  if (parsed.data.shift !== undefined) update.shift = parsed.data.shift || null;
  if (parsed.data.current_level !== undefined) {
    update.current_level = parsed.data.current_level || null;
  }
  if (parsed.data.whatsapp_opted_in !== undefined) {
    update.whatsapp_opted_in = parsed.data.whatsapp_opted_in;
  }
  if (parsed.data.status !== undefined) {
    update.is_active = parsed.data.status === "active" || parsed.data.status === "promoted";
  }

  const { data, error } = await sb
    .from("employees")
    .update(update as never)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return jsonError("db_error", error.message, 500);

  // Best-effort analytics event for status changes.
  if (parsed.data.status !== undefined) {
    try {
      await sb.from("analytics_events").insert({
        event_type: "hr.employee.status_change",
        employee_id: params.id,
        property_id: emp.property_id,
        metadata: { status: parsed.data.status, by: user.id } as never,
      });
    } catch {
      /* best-effort */
    }
  }

  return NextResponse.json({ employee: data });
}

/** DELETE — soft delete via is_active=false. */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "No tienes permiso para eliminar empleados.", 403);
  }
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const propertyIds = await scopedPropertyIds(user, sb);
  const { data: emp } = await sb
    .from("employees")
    .select("property_id")
    .eq("id", params.id)
    .maybeSingle();
  if (!emp || !propertyIds.includes(emp.property_id)) {
    return jsonError("not_found", "Empleado no encontrado.", 404);
  }
  const { error } = await sb.from("employees").update({ is_active: false }).eq("id", params.id);
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
