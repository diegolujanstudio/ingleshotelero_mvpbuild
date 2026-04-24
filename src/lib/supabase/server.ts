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

  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component — cookies can't be set. Auth middleware handles refreshes.
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // See above.
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
