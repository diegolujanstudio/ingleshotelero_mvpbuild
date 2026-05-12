import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { isOrgLevel } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { jsonError, parseBody } from "@/lib/server/api";
import { loadOrgInfo, loadPropertyInfo } from "@/lib/hr/data";

const PatchSchema = z.object({
  org: z
    .object({
      name: z.string().min(1).optional(),
      billing_email: z.string().email().optional().or(z.literal("")),
    })
    .optional(),
  property: z
    .object({
      name: z.string().min(1).optional(),
      city: z.string().optional().nullable(),
      state: z.string().optional().nullable(),
      country: z.string().optional(),
      room_count: z.number().int().nullable().optional(),
      timezone: z.string().optional(),
    })
    .optional(),
});

export async function GET() {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const [org, property] = await Promise.all([loadOrgInfo(user), loadPropertyInfo(user)]);
  return NextResponse.json({ org, property });
}

export async function PATCH(req: Request) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const parsed = await parseBody(req, PatchSchema, "/api/hr/settings");
  if (!parsed.ok) return parsed.response;
  const sb = createServiceClient();
  if (!sb) return jsonError("not_configured", "Supabase no configurado.", 503);

  if (parsed.data.org) {
    if (!isOrgLevel(user.role) || !user.organization_id) {
      return jsonError("forbidden", "Sin permiso para editar la organización.", 403);
    }
    const update: Record<string, unknown> = {};
    if (parsed.data.org.name !== undefined) update.name = parsed.data.org.name;
    if (parsed.data.org.billing_email !== undefined) {
      update.billing_email = parsed.data.org.billing_email || null;
    }
    if (Object.keys(update).length) {
      const { error } = await sb.from("organizations").update(update as never).eq("id", user.organization_id);
      if (error) return jsonError("db_error", error.message, 500);
    }
  }

  if (parsed.data.property) {
    if (!user.property_id) {
      return jsonError("forbidden", "Sin propiedad asignada.", 403);
    }
    const update: Record<string, unknown> = {};
    const p = parsed.data.property;
    if (p.name !== undefined) update.name = p.name;
    if (p.city !== undefined) update.city = p.city;
    if (p.state !== undefined) update.state = p.state;
    if (p.country !== undefined) update.country = p.country;
    if (p.room_count !== undefined) update.room_count = p.room_count;
    if (p.timezone !== undefined) update.timezone = p.timezone;
    if (Object.keys(update).length) {
      const { error } = await sb.from("properties").update(update as never).eq("id", user.property_id);
      if (error) return jsonError("db_error", error.message, 500);
    }
  }

  return NextResponse.json({ ok: true });
}
