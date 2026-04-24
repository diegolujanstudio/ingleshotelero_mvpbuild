/**
 * Supabase browser client.
 *
 * Use this inside Client Components and browser-only helpers. Reads are
 * subject to RLS using the signed-in user's JWT. For privileged operations
 * (scoring pipeline, HR exports) use the server client with the service role.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
