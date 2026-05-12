import "server-only";

/**
 * Idempotency-Key handling.
 *
 * Two layers of protection:
 *   1. Header-driven: clients send `Idempotency-Key: <uuid>` and the same
 *      key within 24h returns the original response (status + body) verbatim.
 *   2. DB-constraint-driven: e.g. UNIQUE(session_id, question_index) on
 *      diagnostic_answers/listening_answers acts as a per-resource natural
 *      key. ON CONFLICT DO UPDATE makes the write itself idempotent.
 *
 * The cache table `idempotency_keys` is wiped lazily — at this scale
 * a periodic delete is fine and not yet implemented.
 */
import type { NextResponse } from "next/server";
import { serviceClient } from "./supabase-service";
import { log } from "./log";
import type { Json } from "@/lib/supabase/types";

const KEY_HEADER = "idempotency-key";
const MAX_KEY_LEN = 200;

export function readIdempotencyKey(req: Request): string | null {
  const raw = req.headers.get(KEY_HEADER);
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_KEY_LEN) return null;
  return trimmed;
}

export interface CachedResponse {
  body: Json;
  status: number;
}

/**
 * Look up a previously-cached response. Returns null if not found, or if
 * Supabase is not configured (we degrade gracefully — repeat client calls
 * just hit the underlying logic again, which is itself idempotent).
 */
export async function lookupIdempotent(key: string): Promise<CachedResponse | null> {
  const sb = serviceClient();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("idempotency_keys")
      .select("response, status_code")
      .eq("key", key)
      .maybeSingle();
    if (!data) return null;
    return { body: data.response, status: data.status_code };
  } catch (err) {
    log.warn({ err: String(err), key: key.slice(0, 16) }, "idempotency.lookup.failed");
    return null;
  }
}

/**
 * Persist a response keyed by an Idempotency-Key. Best-effort — failures
 * never block the user-visible response.
 */
export async function storeIdempotent(
  key: string,
  body: Json,
  status: number,
): Promise<void> {
  const sb = serviceClient();
  if (!sb) return;
  try {
    await sb
      .from("idempotency_keys")
      .upsert(
        { key, response: body, status_code: status },
        { onConflict: "key" },
      );
  } catch (err) {
    log.warn(
      { err: String(err), key: key.slice(0, 16) },
      "idempotency.store.failed",
    );
  }
}

/**
 * Helper: wraps a route handler so that the same Idempotency-Key returns
 * the same response. Caller passes a function that returns the body + status.
 */
export async function withIdempotency(
  req: Request,
  fn: () => Promise<{ body: Json; status: number }>,
  buildResponse: (body: Json, status: number) => NextResponse,
): Promise<NextResponse> {
  const key = readIdempotencyKey(req);
  if (key) {
    const cached = await lookupIdempotent(key);
    if (cached) return buildResponse(cached.body, cached.status);
  }
  const result = await fn();
  if (key) await storeIdempotent(key, result.body, result.status);
  return buildResponse(result.body, result.status);
}
