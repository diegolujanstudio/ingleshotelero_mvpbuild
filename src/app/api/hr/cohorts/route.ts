import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { canManageEmployees } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody, zLevel, zModule } from "@/lib/server/api";

const PostSchema = z.object({
  name: z.string().min(1),
  module: zModule,
  target_level: zLevel,
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  completion_target_pct: z.number().int().min(0).max(100).optional(),
  property_id: z.string().uuid().optional(),
});

export async function GET() {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ cohorts: [], demo: true });
  const propertyIds = await scopedPropertyIds(user, sb);
  if (propertyIds.length === 0) return NextResponse.json({ cohorts: [] });
  const { data, error } = await sb.from("cohorts").select("*").in("property_id", propertyIds);
  if (error) return jsonError("db_error", error.message, 500);
  return NextResponse.json({ cohorts: data ?? [] });
}

export async function POST(req: Request) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  if (!canManageEmployees(user.role)) {
    return jsonError("forbidden", "Sin permiso.", 403);
  }
  const parsed = await parseBody(req, PostSchema, "/api/hr/cohorts");
  if (!parsed.ok) return parsed.response;
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  const propertyId = parsed.data.property_id ?? user.property_id;
  if (!propertyId) {
    return jsonError("invalid_property", "Falta el property_id.", 400);
  }
  const allowed = await scopedPropertyIds(user, sb);
  if (!allowed.includes(propertyId)) {
    return jsonError("forbidden", "Propiedad fuera de tu alcance.", 403);
  }

  const insert = {
    property_id: propertyId,
    name: parsed.data.name,
    module: parsed.data.module,
    target_level: parsed.data.target_level,
    start_date: parsed.data.start_date ?? null,
    end_date: parsed.data.end_date ?? null,
    completion_target_pct: parsed.data.completion_target_pct ?? 80,
    created_by: user.id,
    status: "active" as const,
  };
  const { data, error } = await sb.from("cohorts").insert(insert).select().single();
  if (error) return jsonError("db_error", error.message, 500);

  return NextResponse.json({
    cohort: {
      id: data.id,
      name: data.name,
      module: data.module,
      target_level: data.target_level,
      start_date: data.start_date,
      end_date: data.end_date,
      completion_target_pct: data.completion_target_pct,
      status: data.status,
      member_count: 0,
      avg_completion_pct: 0,
      is_demo: false,
    },
  });
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
