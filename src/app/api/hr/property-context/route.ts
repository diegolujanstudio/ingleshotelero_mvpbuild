import "server-only";

/**
 * POST /api/hr/property-context
 *
 * Persists the HR user's active-property pick (from the sidebar
 * PropertySwitcher) as an httpOnly cookie so subsequent /hr page loads scope
 * their queries to it. "all" clears the pick back to full org/platform
 * scope. The chosen property must be within the user's own scope — an
 * org_admin can't pin a property from another organization.
 */
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { jsonError, jsonOk, parseBody, zUuid } from "@/lib/server/api";
import { PROPERTY_COOKIE, PROPERTY_COOKIE_MAX_AGE, scopedPropertyIds } from "@/lib/hr/scope";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";

const BodySchema = z.object({
  property_id: z.union([z.literal("all"), zUuid]),
});

export async function POST(req: Request) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);

  const parsed = await parseBody(req, BodySchema, "/api/hr/property-context");
  if (!parsed.ok) return parsed.response;

  const { property_id } = parsed.data;

  if (property_id !== "all") {
    const allowed = await scopedPropertyIds(user);
    if (!allowed.includes(property_id)) {
      log.warn(
        { route: "/api/hr/property-context", user_id: user.id, property_id },
        "hr.property_context.forbidden",
      );
      return jsonError("forbidden", "Propiedad fuera de tu alcance.", 403);
    }
  }

  const res = jsonOk({ ok: true, property_id });
  res.cookies.set(PROPERTY_COOKIE, property_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: PROPERTY_COOKIE_MAX_AGE,
  });
  log.info(
    { route: "/api/hr/property-context", user_id: user.id, property_id },
    "hr.property_context.set",
  );
  return res;
}
