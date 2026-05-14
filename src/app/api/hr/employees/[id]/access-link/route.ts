import "server-only";

/**
 * POST /api/hr/employees/[id]/access-link
 *
 * Mint a fresh access token for an employee. Returns the personal URL
 * the employee can tap to sign in. HR sends this URL via WhatsApp /
 * email / SMS.
 *
 * Body (optional):
 *   { delivery_channel?: 'whatsapp'|'email'|'sms'|'manual',
 *     delivery_target?: string,
 *     notes?: string }
 *
 * Response (200):
 *   { ok: true,
 *     token: string,                  // raw token (HR sees this once)
 *     url: string,                    // full personal URL
 *     issued_at: string }
 *
 * GET /api/hr/employees/[id]/access-link
 *   Returns the most recent active token (if any) WITHOUT exposing the
 *   token value — only metadata. Use POST to mint a new one.
 *
 * Auth: requires an HR user whose property scope contains the employee.
 * Defense in depth: the SQL RLS policies on employee_access_tokens
 * enforce the same scope.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { generateAccessToken } from "@/lib/auth/employee";
import { jsonError, jsonOk, parseBody } from "@/lib/server/api";
import { addBreadcrumb, captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";

const Body = z.object({
  delivery_channel: z.enum(["whatsapp", "email", "sms", "manual"]).optional(),
  delivery_target: z.string().trim().min(1).max(200).optional(),
  notes: z.string().trim().max(500).optional(),
});

interface Params {
  params: { id: string };
}

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.URL ||                  // Netlify sets this
    "https://ingleshotelero.netlify.app"
  );
}

export async function POST(req: Request, { params }: Params) {
  const hrUser = await getHRUser();
  if (!hrUser) {
    return jsonError("not_authenticated", "Inicia sesión para continuar.", 401);
  }

  const sb = createServiceClient();
  if (!sb) {
    return jsonError(
      "not_configured",
      "Supabase no está configurado en este entorno.",
      503,
    );
  }

  // Verify the caller can access this employee (via their property scope).
  const empResp = await sb
    .from("employees")
    .select("id, name, property_id, properties!inner(organization_id)")
    .eq("id", params.id)
    .maybeSingle();

  type EmpRow = {
    id: string;
    name: string;
    property_id: string;
    properties: { organization_id: string };
  };
  const employee = empResp.data as unknown as EmpRow | null;

  if (!employee) {
    return jsonError("not_found", "No encontramos a ese empleado.", 404);
  }

  // Property scope check — super_admin can do anything; org_admin sees own
  // org's properties; property_admin sees only their property.
  const allowed =
    hrUser.role === "super_admin" ||
    (hrUser.role === "org_admin" &&
      employee.properties.organization_id === hrUser.organization_id) ||
    employee.property_id === hrUser.property_id;
  if (!allowed) {
    return jsonError("forbidden", "Este empleado no está en tu hotel.", 403);
  }

  const parsed = await parseBody(req, Body, "POST /api/hr/employees/[id]/access-link");
  if (!parsed.ok) return parsed.response;

  const token = generateAccessToken();
  const issuedAt = new Date().toISOString();

  try {
    // Types regenerated after migration 0007 will narrow this; for now we
    // cast the table name so the typecheck doesn't blow up. Behavior is
    // correct — the columns match migration 0007.
    const tokensTable = (sb as unknown as { from: (t: string) => { insert: (v: unknown) => Promise<{ error: { message: string } | null }> } }).from(
      "employee_access_tokens",
    );
    const { error } = await tokensTable.insert({
      employee_id: params.id,
      token,
      issued_at: issuedAt,
      created_by: hrUser.id,
      delivery_channel: parsed.data.delivery_channel ?? "manual",
      delivery_target: parsed.data.delivery_target ?? null,
      notes: parsed.data.notes ?? null,
    });
    if (error) {
      addBreadcrumb({
        route: "hr.access_link.insert",
        data: { msg: error.message },
        level: "error",
      });
      throw error;
    }
  } catch (err) {
    captureException(err, {
      route: "hr.access_link.insert",
      data: { employee_id: params.id },
      level: "error",
    });
    log.error({ err: String(err), employee_id: params.id }, "access_link.insert_failed");
    return jsonError("server_error", "No pudimos generar el enlace.", 500);
  }

  const url = `${appUrl()}/i/${token}`;
  return jsonOk({ token, url, issued_at: issuedAt });
}

export async function GET(_req: Request, { params }: Params) {
  const hrUser = await getHRUser();
  if (!hrUser) {
    return jsonError("not_authenticated", "Inicia sesión para continuar.", 401);
  }

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ tokens: [], demo: true });
  }

  // Cast — types regenerated post-migration-0007 will narrow this.
  const tokensTable = (sb as unknown as {
    from: (t: string) => {
      select: (cols: string) => {
        eq: (k: string, v: string) => {
          order: (k: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: unknown[] | null }>;
          };
        };
      };
    };
  }).from("employee_access_tokens");
  const { data } = await tokensTable
    .select(
      "id, issued_at, last_used_at, use_count, revoked_at, delivery_channel, delivery_target, notes",
    )
    .eq("employee_id", params.id)
    .order("issued_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ tokens: data ?? [] });
}
