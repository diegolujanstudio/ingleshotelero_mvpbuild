/**
 * src/lib/offline/queue.ts
 *
 * The deferred-request queue. Wraps the `queue` Dexie table with a small,
 * server-safe API.
 *
 * Contract:
 *   - Every export returns a sensible empty value when IDB is unavailable
 *     (`null`, `0`, `[]`, `undefined`). Pages must NOT crash when offline
 *     persistence is absent.
 *   - `enqueue` dedupes by `idempotencyKey` BEFORE insert. If a row with
 *     the same key exists, the existing id is returned and no new row is
 *     written. (Server is also idempotent — this is a second layer.)
 *   - `getAll` returns rows sorted by `timestamp` ASC (FIFO drain order).
 */

import { getDB } from './db';
import type { QueuedRequest } from './types';

/**
 * Insert a request into the queue. Returns the id of the inserted (or
 * already-present) row, or `null` if IDB is unavailable.
 */
export async function enqueue(
  item: Omit<QueuedRequest, 'id' | 'timestamp' | 'attempts'>,
): Promise<string | null> {
  const db = getDB();
  if (!db) return null;

  try {
    // Dedupe: same idempotencyKey means the caller is replaying the same
    // logical action (e.g., user double-tapped Submit while offline).
    const existing = await db.queue
      .where('idempotencyKey')
      .equals(item.idempotencyKey)
      .first();
    if (existing) return existing.id;

    const row: QueuedRequest = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      attempts: 0,
    };
    await db.queue.add(row);
    return row.id;
  } catch (err) {
    console.warn('[ih-offline] enqueue failed:', err);
    return null;
  }
}

/**
 * Pop a single row by id (post-success cleanup is the main caller).
 * Equivalent to `remove` — kept for symmetry with the contract.
 */
export async function dequeue(id: string): Promise<void> {
  return remove(id);
}

/** All queued rows in FIFO (timestamp ASC) order. Empty array when IDB is missing. */
export async function getAll(): Promise<QueuedRequest[]> {
  const db = getDB();
  if (!db) return [];
  try {
    return await db.queue.orderBy('timestamp').toArray();
  } catch (err) {
    console.warn('[ih-offline] getAll failed:', err);
    return [];
  }
}

/** Delete a row by id. No-op if missing or IDB unavailable. */
export async function remove(id: string): Promise<void> {
  const db = getDB();
  if (!db) return;
  try {
    await db.queue.delete(id);
  } catch (err) {
    console.warn('[ih-offline] remove failed:', err);
  }
}

/** Total queued rows. Returns 0 when IDB is unavailable. */
export async function count(): Promise<number> {
  const db = getDB();
  if (!db) return 0;
  try {
    return await db.queue.count();
  } catch (err) {
    console.warn('[ih-offline] count failed:', err);
    return 0;
  }
}

/** Drop every queued row. Used by tests / dev tooling. */
export async function clearAll(): Promise<void> {
  const db = getDB();
  if (!db) return;
  try {
    await db.queue.clear();
  } catch (err) {
    console.warn('[ih-offline] clearAll failed:', err);
  }
}

/**
 * Increment attempt counter and record the failure message. Called by
 * `sync.ts` after a transient (5xx / network / 401 / 408 / 429) failure.
 */
export async function markFailure(id: string, error: string): Promise<void> {
  const db = getDB();
  if (!db) return;
  try {
    const row = await db.queue.get(id);
    if (!row) return;
    await db.queue.update(id, {
      attempts: row.attempts + 1,
      lastError: error.slice(0, 500), // cap to keep IDB rows lean
    });
  } catch (err) {
    console.warn('[ih-offline] markFailure failed:', err);
  }
}
