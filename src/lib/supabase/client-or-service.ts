import "server-only";

/**
 * Demo-mode-aware service client.
 *
 * Returns the Supabase service client when both NEXT_PUBLIC_SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set. Returns `null` otherwise — callers MUST
 * branch on null to fall back to localStorage-only behavior so the demo
 * still flows without env vars.
 *
 * This wrapper is the only place that decides "are we in demo mode?". Every
 * server-side route should import from here, not directly from
 * `@/lib/supabase/server`.
 */
import { createServiceClient as createReal } from "./server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function createServiceClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  try {
    return createReal();
  } catch {
    return null;
  }
}
