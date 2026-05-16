import "server-only";

/**
 * POST /api/auth/signin
 *
 * Email + password sign-in for HR users (Track B sign-in form posts here).
 * Calls supabase.auth.signInWithPassword with the SSR client so the session
 * cookie is set on the response.
 *
 * Body: { email, password }
 * Response (200): { ok: true, redirect_to }
 * Response (401): { error: { code: 'invalid_credentials', message } }
 *
 * Rate limit: 10/min per IP via the `exams` bucket (re-used as
 * "publicWrite" — sign-in is a low-volume endpoint and Upstash isn't
 * required for security here).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { jsonError, jsonOk, parseBody } from "@/lib/server/api";
import { addBreadcrumb, captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  return_to: z.string().max(500).optional(),
});

function safeReturnPath(input: string | undefined): string {
  if (!input) return "/hr";
  // Only allow same-origin paths.
  if (!input.startsWith("/")) return "/hr";
  if (input.startsWith("//")) return "/hr";
  return input;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit("exams", ip);
  if (!rl.ok) {
    return new NextResponse(
      JSON.stringify({
        error: { code: "rate_limited", message: "Demasiados intentos. Intente en un momento." },
      }),
      { status: 429, headers: { "content-type": "application/json", "retry-after": "60" } },
    );
  }

  const parsed = await parseBody(req, Body, "POST /api/auth/signin");
  if (!parsed.ok) return parsed.response;
  const { email, password, return_to } = parsed.data;

  if (!isSupabaseConfigured()) {
    return jsonError(
      "not_configured",
      "El inicio de sesión real no está disponible en modo demo.",
      503,
    );
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user || !data.session) {
      // Sentry breadcrumb only — never include the raw email in metadata.
      addBreadcrumb({
        route: "POST /api/auth/signin",
        level: "warning",
        data: { reason: error?.message ?? "no_session" },
      });
      return jsonError(
        "invalid_credentials",
        "Correo o contraseña incorrectos.",
        401,
      );
    }

    // Verify the user has a matching active hr_users row.
    //
    // IMPORTANT: use the SERVICE client (bypasses RLS), not the
    // RLS-bound `supabase` client. Right after signInWithPassword on
    // the server-side @supabase/ssr client, the new session's JWT is
    // written to the response cookies but is NOT attached to the
    // immediate next PostgREST call — so the `hr_self_read` RLS policy
    // (`id = auth.uid()`) sees a null uid and returns zero rows,
    // producing a false `no_hr_profile`. We've already proven identity
    // via signInWithPassword; a service-role lookup by the verified
    // user id is correct and safe.
    const svc = createServiceClient();
    const { data: hr } = (svc
      ? await svc
          .from("hr_users")
          .select("id, role, is_active")
          .eq("id", data.user.id)
          .maybeSingle()
      : { data: null }) as unknown as {
      data: { id: string; role: string; is_active: boolean } | null;
    };

    if (!hr || !hr.is_active) {
      // Sign them back out so the cookie doesn't linger.
      await supabase.auth.signOut();
      return jsonError(
        "no_hr_profile",
        "Su cuenta aún no está activa. Pida a su administrador que la active.",
        403,
      );
    }

    log.info(
      { route: "POST /api/auth/signin", role: hr.role },
      "auth.signin.ok",
    );

    return jsonOk({
      ok: true,
      role: hr.role,
      redirect_to: safeReturnPath(return_to),
    });
  } catch (err) {
    captureException(err, { route: "POST /api/auth/signin", data: {} });
    return jsonError("server_error", "Error interno.", 500);
  }
}
