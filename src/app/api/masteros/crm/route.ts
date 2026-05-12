import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const StatusEnum = z.enum(["pilot", "paid", "churned"]);

const PatchBody = z.object({
  organization_id: z.string().uuid(),
  status: StatusEnum.optional(),
  notes: z.string().max(8000).optional(),
});

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export interface CrmOrgRow {
  id: string;
  name: string;
  type: string;
  subscription_tier: string;
  subscription_status: string;
  billing_email: string | null;
  status: "pilot" | "paid" | "churned";
  notes: string;
  properties: Array<{
    id: string;
    name: string;
    slug: string;
    city: string | null;
    is_active: boolean;
  }>;
  hr_users: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    last_login_at: string | null;
  }>;
  n_properties: number;
  n_employees: number;
  last_login_at: string | null;
}

/**
 * GET /api/masteros/crm — returns the joined CRM dataset.
 *
 * Status + notes are NOT (yet) columns on `organizations`. They live in
 * `analytics_events` rows of type `crm_status` / `crm_note` keyed by
 * metadata.organization_id. See report — clean migration is a follow-up.
 */
export async function GET() {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ orgs: demoCrm(), demo: true });
  }

  try {
    const [orgsRes, propsRes, hrRes, employeesRes, eventsRes] =
      await Promise.all([
        sb.from("organizations").select(
          "id, name, type, subscription_tier, subscription_status, billing_email",
        ),
        sb
          .from("properties")
          .select("id, organization_id, name, slug, city, is_active"),
        sb
          .from("hr_users")
          .select(
            "id, organization_id, email, name, role, is_active, last_login_at",
          ),
        sb.from("employees").select("id, property_id, is_active"),
        sb
          .from("analytics_events")
          .select("event_type, metadata, created_at")
          .in("event_type", ["crm_status", "crm_note"])
          .order("created_at", { ascending: true }),
      ]);

    if (orgsRes.error) throw orgsRes.error;

    const propsByOrg = new Map<string, typeof propsRes.data>();
    for (const p of propsRes.data ?? []) {
      const arr = propsByOrg.get(p.organization_id) ?? [];
      arr.push(p);
      propsByOrg.set(p.organization_id, arr);
    }

    const hrByOrg = new Map<string, typeof hrRes.data>();
    for (const h of hrRes.data ?? []) {
      if (!h.organization_id) continue;
      const arr = hrByOrg.get(h.organization_id) ?? [];
      arr.push(h);
      hrByOrg.set(h.organization_id, arr);
    }

    const employeesByProperty = new Map<string, number>();
    for (const e of employeesRes.data ?? []) {
      if (!e.is_active) continue;
      employeesByProperty.set(
        e.property_id,
        (employeesByProperty.get(e.property_id) ?? 0) + 1,
      );
    }

    // Roll up status/notes from analytics_events — last write wins.
    const statusByOrg = new Map<string, "pilot" | "paid" | "churned">();
    const notesByOrg = new Map<string, string>();
    for (const ev of eventsRes.data ?? []) {
      const meta = (ev.metadata ?? {}) as Record<string, unknown>;
      const orgId = typeof meta.organization_id === "string" ? meta.organization_id : null;
      if (!orgId) continue;
      if (ev.event_type === "crm_status" && typeof meta.status === "string") {
        if (["pilot", "paid", "churned"].includes(meta.status)) {
          statusByOrg.set(orgId, meta.status as "pilot" | "paid" | "churned");
        }
      } else if (ev.event_type === "crm_note" && typeof meta.notes === "string") {
        notesByOrg.set(orgId, meta.notes);
      }
    }

    const orgs: CrmOrgRow[] = (orgsRes.data ?? []).map((org) => {
      const props = propsByOrg.get(org.id) ?? [];
      const users = (hrByOrg.get(org.id) ?? []).map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        is_active: u.is_active,
        last_login_at: u.last_login_at,
      }));
      const lastLogin =
        users
          .map((u) => u.last_login_at)
          .filter((x): x is string => Boolean(x))
          .sort()
          .pop() ?? null;
      const nEmployees = props.reduce(
        (acc, p) => acc + (employeesByProperty.get(p.id) ?? 0),
        0,
      );
      const inferredStatus: "pilot" | "paid" | "churned" =
        statusByOrg.get(org.id) ??
        (org.subscription_status === "canceled" || org.subscription_status === "archived"
          ? "churned"
          : org.subscription_tier === "pilot"
            ? "pilot"
            : "paid");
      return {
        id: org.id,
        name: org.name,
        type: org.type,
        subscription_tier: org.subscription_tier,
        subscription_status: org.subscription_status,
        billing_email: org.billing_email,
        status: inferredStatus,
        notes: notesByOrg.get(org.id) ?? "",
        properties: props.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          city: p.city,
          is_active: p.is_active,
        })),
        hr_users: users,
        n_properties: props.length,
        n_employees: nEmployees,
        last_login_at: lastLogin,
      };
    });

    return NextResponse.json({ orgs });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/masteros/crm — update status and/or notes for one organization.
 * Writes to analytics_events as `crm_status` / `crm_note` rows.
 */
export async function PATCH(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = PatchBody.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });

  const writes: Array<{
    event_type: string;
    metadata: Record<string, unknown>;
  }> = [];
  if (parsed.data.status !== undefined) {
    writes.push({
      event_type: "crm_status",
      metadata: {
        organization_id: parsed.data.organization_id,
        status: parsed.data.status,
        actor_id: user.id,
      },
    });
  }
  if (parsed.data.notes !== undefined) {
    writes.push({
      event_type: "crm_note",
      metadata: {
        organization_id: parsed.data.organization_id,
        notes: parsed.data.notes,
        actor_id: user.id,
      },
    });
  }

  if (writes.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await sb.from("analytics_events").insert(writes as never);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

function demoCrm(): CrmOrgRow[] {
  return [
    {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Gran Hotel Cancún",
      type: "independent",
      subscription_tier: "professional",
      subscription_status: "active",
      billing_email: "facturacion@granhotelcancun.com",
      status: "paid",
      notes: "Renovación 2026-08. Punto de contacto: Mariana López.",
      properties: [
        {
          id: "p1",
          name: "Gran Hotel Cancún",
          slug: "gran-hotel-cancun",
          city: "Cancún",
          is_active: true,
        },
      ],
      hr_users: [
        {
          id: "u1",
          email: "rh@granhotelcancun.com",
          name: "Mariana López",
          role: "org_admin",
          is_active: true,
          last_login_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ],
      n_properties: 1,
      n_employees: 47,
      last_login_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Cadena Marina Pacífico",
      type: "chain",
      subscription_tier: "enterprise",
      subscription_status: "active",
      billing_email: "ap@marinapacifico.mx",
      status: "paid",
      notes: "3 propiedades activas, 2 más en piloto Q3.",
      properties: [
        { id: "p2", name: "Marina Vallarta", slug: "marina-vallarta", city: "Puerto Vallarta", is_active: true },
        { id: "p3", name: "Marina Mazatlán", slug: "marina-mazatlan", city: "Mazatlán", is_active: true },
        { id: "p4", name: "Marina Manzanillo", slug: "marina-manzanillo", city: "Manzanillo", is_active: true },
      ],
      hr_users: [
        {
          id: "u2",
          email: "rh@marinapacifico.mx",
          name: "Roberto Castillo",
          role: "org_admin",
          is_active: true,
          last_login_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      n_properties: 3,
      n_employees: 184,
      last_login_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      name: "Hotel Boutique San Miguel",
      type: "independent",
      subscription_tier: "pilot",
      subscription_status: "active",
      billing_email: "info@boutiquesanmiguel.com",
      status: "pilot",
      notes: "Piloto $50/empleado. Decisión 2026-06.",
      properties: [
        { id: "p5", name: "Boutique San Miguel", slug: "boutique-san-miguel", city: "San Miguel de Allende", is_active: true },
      ],
      hr_users: [
        {
          id: "u3",
          email: "carla@boutiquesanmiguel.com",
          name: "Carla Mendoza",
          role: "property_admin",
          is_active: true,
          last_login_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ],
      n_properties: 1,
      n_employees: 14,
      last_login_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];
}
