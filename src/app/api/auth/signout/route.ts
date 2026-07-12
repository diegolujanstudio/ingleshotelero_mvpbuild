import "server-only";

/**
 * POST /api/auth/signout
 *
 * Ends the HR session. Previously the shell's "Cerrar sesión" control was a
 * plain link to /hr/login, which never actually signed the user out — the
 * auth cookie stayed valid, so hitting Back or re-typing /hr returned them
 * to the dashboard.
 *
 * This route revokes the Supabase session (so the refresh token can't be
 * reused) AND clears the sb-*-auth-token cookies. In demo mode (no Supabase)
 * there is no session to revoke — we still clear any lingering auth cookies
 * and return ok so the client can redirect to /hr/login.
 */
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { jsonOk } from "@/lib/server/api";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = cookies();

  try {
    if (isSupabaseConfigured()) {
      const supabase = createServerClient();
      // Revokes the session server-side and clears the auth cookies via the
      // getAll/setAll adapter.
      await supabase.auth.signOut();
    }
  } catch {
    // Even if the revoke call fails, fall through and clear the cookies below
    // so the browser session still ends.
  }

  // Belt-and-suspenders: delete any remaining Supabase auth cookies
  // (sb-<ref>-auth-token, sometimes chunked as .0 / .1).
  for (const c of cookieStore.getAll()) {
    if (c.name.startsWith("sb-") && c.name.includes("auth-token")) {
      cookieStore.delete(c.name);
    }
  }

  log.info({ route: "POST /api/auth/signout" }, "auth.signout.ok");
  return jsonOk({ ok: true });
}
