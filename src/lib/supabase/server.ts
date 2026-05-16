/**
 * Supabase server clients.
 *
 * - `createServerClient()` — reads/writes as the signed-in user (RLS applies).
 *   Use inside Server Components, Server Actions, and Route Handlers.
 *
 * - `createServiceClient()` — bypasses RLS via the service role key.
 *   Use for privileged server-only jobs: scoring pipeline, cron workers,
 *   content seeding, webhooks. NEVER import into a Client Component.
 */
import { createServerClient as _createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function createServerClient() {
  const cookieStore = cookies();

  // MUST use the getAll/setAll adapter — @supabase/ssr 0.5.x encodes &
  // chunks the auth cookie differently between the legacy get/set/remove
  // adapter and getAll/setAll. The middleware reads with getAll; if the
  // sign-in route writes with the legacy adapter the formats mismatch
  // and supabase.auth.getUser() in middleware sees no session → every
  // authenticated request bounced to /?returnTo=. Keep both sides on
  // getAll/setAll.
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>,
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as never),
            );
          } catch {
            // Called from a Server Component — cookies are read-only
            // there. The middleware performs the session refresh, so
            // this is safe to swallow.
          }
        },
      },
    },
  );
}

/**
 * Service-role client. Server-only. Bypasses RLS. Do NOT expose to browser.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local — see SETUP.md.",
    );
  }
  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
