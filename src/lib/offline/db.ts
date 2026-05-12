/**
 * src/lib/offline/db.ts
 *
 * Lazy Dexie singleton for the offline layer. Two object stores:
 *   - `queue`: pending API requests (see `types.ts#QueuedRequest`)
 *   - `blobs`: binary audio blobs (see `types.ts#BlobEntry`)
 *
 * Contract:
 *   - `getDB()` returns `null` on the server, in iOS Private Browsing, or
 *     anywhere `new Dexie(...)` throws. Callers MUST handle null and degrade
 *     gracefully (the exam still works, answers just aren't persisted across
 *     a network drop).
 *   - The constructor runs at most once per page load. If init fails the
 *     result is cached as `null` so we don't repeatedly throw.
 */

import Dexie, { type Table } from 'dexie';
import type { QueuedRequest, BlobEntry } from './types';

class OfflineDB extends Dexie {
  queue!: Table<QueuedRequest, string>;
  blobs!: Table<BlobEntry, string>;

  constructor() {
    super('ih-offline');
    // Indexes:
    //   queue.id              (primary)
    //   queue.idempotencyKey  → dedupe lookup at enqueue
    //   queue.sessionId       → debugging / per-session purge
    //   queue.timestamp       → FIFO ordering for drain
    //   queue.type            → telemetry filters
    //   blobs.key             (primary)
    //   blobs.storedAt        → `pruneOlderThan`
    this.version(1).stores({
      queue: 'id, idempotencyKey, sessionId, timestamp, type',
      blobs: 'key, storedAt',
    });
  }
}

let _db: OfflineDB | null = null;
let _initialized = false;

/**
 * Returns the lazy singleton, or `null` if IndexedDB is unavailable.
 *
 * Failure modes that resolve to `null`:
 *   - Server-side render (`window` undefined).
 *   - iOS Safari Private Browsing (Dexie throws on construction).
 *   - Storage policies that disable IDB entirely.
 */
export function getDB(): OfflineDB | null {
  if (typeof window === 'undefined') return null;
  if (_initialized) return _db;
  _initialized = true;
  try {
    _db = new OfflineDB();
    // Surface async-open failures (e.g., Private Browsing) without crashing.
    // Dexie defers the actual IDB open until first use, so we catch + null
    // there too if it eventually rejects.
    _db.open().catch((err) => {
      console.warn('[ih-offline] IDB open failed:', err);
      _db = null;
    });
    return _db;
  } catch (e) {
    console.warn('[ih-offline] IDB unavailable (likely Private Browsing):', e);
    _db = null;
    return null;
  }
}

/** Convenience predicate for UI banners ("modo privado detectado..."). */
export function isOfflineSupported(): boolean {
  return getDB() !== null;
}
