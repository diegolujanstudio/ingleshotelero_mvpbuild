import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { canManageEmployees } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody, zEmail } from "@/lib/server/api";
import type { RoleModule, Shift, CEFRLevel } from "@/lib/supabase/types";

const PostSchema = z.object({
  name: z.string().min(1),
  email: zEmail.optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  hotel_role: z.enum(["bellboy", "frontdesk", "restaurant"]),
  department: z.string().optional(),
  shift: z.enum(["morning", "afternoon", "night"]).optional().or(z.literal("")),
  current_level: z.enum(["A1", "A2", "B1", "B2"]).optional().or(z.literal("")),
  whatsapp_opted_in: z.boolean().optional(),
  property_id: z.string().uuid().optional(),
});

/**
 * GET /api/hr/employees — list employees scoped to caller's properties.
 * POST /api/hr/employees — create a new employee with source=hr_invited.
 */
export async function GET() {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ employees: [], demo: true });

  const propertyIds = await scopedPropertyIds(user, sb);
  if (propertyIds.length === 0) return NextResponse.json({ employees: [] });

  const { data, error } = await sb
    .from("employees")
    .select("*")
    .in("property_id", propertyIds)
    .order("created_at", { ascending: false });

  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ employees: data ?? [] });
}

export async function POST(req: Request) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "No tienes permiso para crear empleados.", 403);
  }
  const parsed = await parseBody(req, PostSchema, "/api/hr/employees");
  if (!parsed.ok) return parsed.response;
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const propertyId = parsed.data.property_id ?? user.property_id;
  if (!propertyId) {
    return jsonError("invalid_property", "Falta el property_id.", 400);
  }
  const allowedProperties = await scopedPropertyIds(user, sb);
  if (!allowedProperties.includes(propertyId)) {
    return jsonError("forbidden", "Propiedad fuera de tu alcance.", 403);
  }

  const insert: {
    property_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    hotel_role: RoleModule;
    department: string | null;
    shift: Shift | null;
    current_level: CEFRLevel | null;
    whatsapp_opted_in: boolean;
    source: "hr_invited";
  } = {
    property_id: propertyId,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    hotel_role: parsed.data.hotel_role,
    department: parsed.data.department || null,
    shift: (parsed.data.shift || null) as Shift | null,
    current_level: (parsed.data.current_level || null) as CEFRLevel | null,
    whatsapp_opted_in: parsed.data.whatsapp_opted_in ?? false,
    source: "hr_invited",
  };

  const { data, error } = await sb
    .from("employees")
    .insert(insert)
    .select()
    .single();
  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ employee: data });
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
