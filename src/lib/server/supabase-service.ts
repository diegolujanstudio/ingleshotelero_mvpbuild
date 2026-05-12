import "server-only";

/**
 * Re-export of the demo-aware service client + scoped helpers.
 *
 * `serviceClient()` returns the Supabase service-role client when env vars
 * are set, else null. All server-side mutating routes funnel through here so
 * we can swap the underlying client (e.g. for tests) in one place.
 */
import {
  createServiceClient as createScopedClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client-or-service";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type ServiceClient = SupabaseClient<Database>;

export function serviceClient(): ServiceClient | null {
  return createScopedClient();
}

export function requireServiceClient(): ServiceClient {
  const c = serviceClient();
  if (!c) {
    throw new Error(
      "Supabase service client unavailable — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.",
    );
  }
  return c;
}

export { isSupabaseConfigured };
