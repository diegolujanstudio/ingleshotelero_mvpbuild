import "server-only";

/**
 * Shared API helpers for Route Handlers.
 *
 * Every endpoint validates its input with zod and returns errors in a
 * consistent shape: `{ error: { code, message, details? } }`. The body
 * helper wraps NextResponse.json so we can layer on Sentry breadcrumbs
 * and structured logs in one place.
 */
import { NextResponse } from "next/server";
import { z, type ZodSchema } from "zod";
import { addBreadcrumb } from "./sentry";
import { log } from "./log";

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export function jsonError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
): NextResponse {
  const body: { error: ApiError } = { error: { code, message } };
  if (details !== undefined) body.error.details = details;
  return NextResponse.json(body, { status });
}

/**
 * Parse + validate a JSON request body. Returns either `{ ok: true, data }`
 * or `{ ok: false, response }`. The route handler should `return response`
 * on the failure branch.
 */
export async function parseBody<T>(
  req: Request,
  schema: ZodSchema<T>,
  route: string,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    addBreadcrumb({ route, level: "warning", data: { reason: "invalid_json" } });
    return {
      ok: false,
      response: jsonError("invalid_json", "Cuerpo de la solicitud no es JSON válido.", 400),
    };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    log.warn(
      { route, issues: parsed.error.issues },
      "api.validation.failed",
    );
    return {
      ok: false,
      response: jsonError(
        "validation_error",
        "Faltan campos o son inválidos.",
        400,
        parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      ),
    };
  }
  return { ok: true, data: parsed.data };
}

/**
 * Common zod primitives reused across routes.
 */
export const zUuid = z.string().uuid();
export const zModule = z.enum(["bellboy", "frontdesk", "restaurant"]);
export const zLevel = z.enum(["A1", "A2", "B1", "B2"]);
export const zShift = z.enum(["morning", "afternoon", "night"]);
export const zEmail = z
  .string()
  .trim()
  .email()
  .transform((s) => s.toLowerCase());
