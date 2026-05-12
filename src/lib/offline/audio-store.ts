/**
 * src/lib/offline/audio-store.ts
 *
 * Binary audio blob store. Backed by the `blobs` Dexie table.
 *
 * Contract:
 *   - All exports are server-safe and IDB-failure-safe (return `false` /
 *     `null` / `0` when persistence is unavailable).
 *   - Blob keys are app-supplied. Convention: `blob-<sessionId>-p<promptIndex>`.
 *     Stable keys mean re-recording overwrites cleanly (no stale blob lurking).
 *   - The store NEVER outlives a successful upload. `sync.ts` calls
 *     `deleteBlob` immediately after a 2xx so storage stays lean.
 */

import { getDB } from './db';
import type { BlobEntry } from './types';

/**
 * Persist a Blob. Returns `false` when IDB is unavailable (caller should
 * surface "no podemos guardar localmente" instead of pretending success).
 * Overwrites any existing entry with the same key — last write wins.
 */
export async function storeBlob(key: string, blob: Blob): Promise<boolean> {
  const db = getDB();
  if (!db) return false;
  try {
    const entry: BlobEntry = {
      key,
      blob,
      storedAt: Date.now(),
      contentType: blob.type || 'application/octet-stream',
    };
    await db.blobs.put(entry);
    return true;
  } catch (err) {
    console.warn('[ih-offline] storeBlob failed:', err);
    return false;
  }
}

/** Load a previously-stored Blob, or `null` if missing / IDB unavailable. */
export async function loadBlob(key: string): Promise<Blob | null> {
  const db = getDB();
  if (!db) return null;
  try {
    const entry = await db.blobs.get(key);
    return entry ? entry.blob : null;
  } catch (err) {
    console.warn('[ih-offline] loadBlob failed:', err);
    return null;
  }
}

/** Delete a Blob by key. No-op if missing. */
export async function deleteBlob(key: string): Promise<void> {
  const db = getDB();
  if (!db) return;
  try {
    await db.blobs.delete(key);
  } catch (err) {
    console.warn('[ih-offline] deleteBlob failed:', err);
  }
}

/**
 * Bulk-purge entries older than `maxAgeMs`. Returns the number deleted.
 * Intended for occasional cleanup (e.g., on app start) so abandoned recordings
 * don't accumulate in IDB indefinitely.
 */
export async function pruneOlderThan(maxAgeMs: number): Promise<number> {
  const db = getDB();
  if (!db) return 0;
  try {
    const cutoff = Date.now() - maxAgeMs;
    const stale = await db.blobs.where('storedAt').below(cutoff).toArray();
    if (stale.length === 0) return 0;
    await db.blobs.bulkDelete(stale.map((e) => e.key));
    return stale.length;
  } catch (err) {
    console.warn('[ih-offline] pruneOlderThan failed:', err);
    return 0;
  }
}
