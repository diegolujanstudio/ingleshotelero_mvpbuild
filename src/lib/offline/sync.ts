/**
 * src/lib/offline/sync.ts
 *
 * Network-state-driven drain of the offline queue.
 *
 * Contract:
 *   - `startSyncListener()` registers a `window.online` listener and kicks off
 *     an immediate drain (covers the "we came back online before mount" race).
 *     Returns a teardown function that removes the listener.
 *   - `drainQueue()` walks the queue FIFO. Per item:
 *       2xx              → delete blob (if any), remove row, fire onItemSucceeded.
 *       4xx (most)       → permanent failure: remove row, fire onItemFailed(true).
 *                          (401/408/429 are treated as transient — auth churn
 *                          + rate limits + request timeout SHOULD be retried.)
 *       5xx + network    → transient: bump `attempts`, leave row in queue.
 *                          On `attempts >= MAX_ATTEMPTS` (5), promote to
 *                          permanent, remove row, fire onItemFailed(true).
 *   - Backoff is computed PER ITEM from its own `attempts` count; we sleep
 *     between transient failures so we don't hammer a struggling server.
 *     1s → 2s → 4s → 8s → 16s capped at 32s.
 *
 * Stuck-queue avoidance:
 *   - Hard cap (MAX_ATTEMPTS = 5) ensures no row can wedge the queue forever.
 *   - 4xx responses (other than 401/408/429) are treated as bugs in the
 *     payload, not as network problems — replaying them just re-fails. We
 *     remove them and emit `onItemFailed(permanent=true)` so callers can
 *     telemetry it.
 *   - Recording rows whose blob is missing (orphaned) are removed immediately
 *     instead of looping.
 *   - A drain pass NEVER throws; it only returns a `DrainResult`.
 */

import { getAll, markFailure, remove } from './queue';
import { loadBlob, deleteBlob } from './audio-store';
import type { DrainResult, QueuedRequest } from './types';

const MAX_ATTEMPTS = 5;
const BACKOFF_CAP_MS = 32_000;

export interface SyncOptions {
  /** Called once per drain pass with the aggregate result. */
  onProgress?: (result: DrainResult) => void;
  /** Called per successfully-replayed item. */
  onItemSucceeded?: (item: QueuedRequest) => void;
  /**
   * Called per failed item. `permanent === true` means the row was removed
   * (4xx bug, missing blob, or attempts exhausted). `permanent === false`
   * means the row was kept and will retry next drain.
   */
  onItemFailed?: (item: QueuedRequest, err: Error, permanent: boolean) => void;
}

/**
 * Treat as transient (keep in queue + bump attempts):
 *   401 — auth refresh might fix it
 *   408 — request timeout, server-side
 *   429 — rate limited, backoff is the right answer
 *   5xx — server error
 *   network errors (fetch throws)
 */
function isTransientStatus(status: number): boolean {
  return status === 401 || status === 408 || status === 429 || status >= 500;
}

function backoffMs(attempts: number): number {
  // attempts=0 → no sleep needed (fresh item). attempts=1 → 1s, 2 → 2s, 3 → 4s, 4 → 8s.
  if (attempts <= 0) return 0;
  return Math.min(2 ** (attempts - 1) * 1000, BACKOFF_CAP_MS);
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Build the actual fetch Request body. For `recording` items we hydrate the
 * blob from the audio store and send multipart/form-data; the metadata in
 * `item.body` becomes individual form fields.
 *
 * Returns `null` if a recording row is orphaned (blob missing). The caller
 * treats that as a permanent failure.
 */
async function buildRequestInit(item: QueuedRequest): Promise<RequestInit | null> {
  if (item.type === 'recording') {
    if (!item.blobKey) return null;
    const blob = await loadBlob(item.blobKey);
    if (!blob) return null;
    const form = new FormData();
    // Spread metadata fields onto the form. We intentionally don't set
    // Content-Type — the browser fills in the multipart boundary.
    try {
      const meta = JSON.parse(item.body) as Record<string, unknown>;
      for (const [k, v] of Object.entries(meta)) {
        form.append(k, typeof v === 'string' ? v : JSON.stringify(v));
      }
    } catch {
      // Body wasn't JSON — that's fine, the audio is what matters.
    }
    form.append('audio', blob, `recording${blobExtensionFor(blob.type)}`);
    return {
      method: item.method,
      // NB: drop Content-Type from headers — FormData needs to set it.
      headers: stripContentType(item.headers),
      body: form,
    };
  }

  // answer / finalize-listening: JSON body, headers as-is.
  const headers = { 'Content-Type': 'application/json', ...item.headers };
  return { method: item.method, headers, body: item.body };
}

function blobExtensionFor(mime: string): string {
  if (mime.includes('webm')) return '.webm';
  if (mime.includes('mp4') || mime.includes('mp4a')) return '.m4a';
  if (mime.includes('ogg')) return '.ogg';
  if (mime.includes('wav')) return '.wav';
  return '';
}

function stripContentType(headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === 'content-type') continue;
    out[k] = v;
  }
  return out;
}

/**
 * One drain pass. Idempotent — call as often as you like; it's a no-op when
 * the queue is empty or IDB is unavailable.
 */
export async function drainQueue(options: SyncOptions = {}): Promise<DrainResult> {
  const items = await getAll();
  const result: DrainResult = {
    attempted: items.length,
    succeeded: 0,
    failed: 0,
    remaining: items.length,
    permanentlyFailed: 0,
  };

  if (items.length === 0) {
    options.onProgress?.(result);
    return result;
  }

  // If we're definitively offline, skip the pass entirely. (`navigator.onLine`
  // is best-effort — `false` is reliable, `true` is a hint.)
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    options.onProgress?.(result);
    return result;
  }

  let sawFailure = false;

  for (const item of items) {
    // Per-item backoff sleep BEFORE retry, scaled by previous attempts.
    if (sawFailure) {
      await sleep(backoffMs(item.attempts));
    }

    let init: RequestInit | null;
    try {
      init = await buildRequestInit(item);
    } catch (err) {
      // Should never happen, but guard so a single bad row can't stop the drain.
      await remove(item.id);
      result.failed += 1;
      result.permanentlyFailed += 1;
      result.remaining -= 1;
      options.onItemFailed?.(item, err as Error, true);
      sawFailure = true;
      continue;
    }

    if (init === null) {
      // Recording row whose blob disappeared — orphaned. Drop it.
      await remove(item.id);
      result.failed += 1;
      result.permanentlyFailed += 1;
      result.remaining -= 1;
      const err = new Error('Orphaned recording (blob missing)');
      console.warn('[ih-offline] drain: orphaned recording', item.id);
      options.onItemFailed?.(item, err, true);
      sawFailure = true;
      continue;
    }

    let response: Response | null = null;
    let networkError: Error | null = null;
    try {
      response = await fetch(item.endpoint, init);
    } catch (err) {
      networkError = err instanceof Error ? err : new Error(String(err));
    }

    if (response && response.ok) {
      // 2xx: clean up.
      if (item.blobKey) {
        await deleteBlob(item.blobKey);
      }
      await remove(item.id);
      result.succeeded += 1;
      result.remaining -= 1;
      options.onItemSucceeded?.(item);
      continue;
    }

    // From here on: failure of some kind.
    sawFailure = true;
    result.failed += 1;

    if (response && !isTransientStatus(response.status)) {
      // Permanent client error (likely a payload bug). Log + drop.
      const body = await safeReadBody(response);
      const err = new Error(`HTTP ${response.status}: ${body.slice(0, 200)}`);
      if (item.blobKey) {
        await deleteBlob(item.blobKey);
      }
      await remove(item.id);
      result.permanentlyFailed += 1;
      result.remaining -= 1;
      options.onItemFailed?.(item, err, true);
      continue;
    }

    // Transient (5xx, network, 401/408/429): bump attempts.
    const err =
      networkError ??
      new Error(`HTTP ${response?.status ?? 0}`);
    const nextAttempts = item.attempts + 1;
    if (nextAttempts >= MAX_ATTEMPTS) {
      // Exhausted retry budget. Promote to permanent failure to keep the
      // queue from wedging forever.
      if (item.blobKey) {
        await deleteBlob(item.blobKey);
      }
      await remove(item.id);
      result.permanentlyFailed += 1;
      result.remaining -= 1;
      options.onItemFailed?.(item, err, true);
    } else {
      await markFailure(item.id, err.message);
      options.onItemFailed?.(item, err, false);
    }
  }

  options.onProgress?.(result);
  return result;
}

async function safeReadBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

/**
 * Wire `drainQueue` to the browser's `online` event and run an initial
 * drain immediately (covers the case where connectivity returned before the
 * page mounted).
 *
 * Returns a teardown function that removes the listener. Safe to call on the
 * server — it returns a no-op teardown.
 */
export function startSyncListener(options: SyncOptions = {}): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let cancelled = false;

  const handler = () => {
    if (cancelled) return;
    void drainQueue(options).catch((err) => {
      console.warn('[ih-offline] drain (online event) failed:', err);
    });
  };

  window.addEventListener('online', handler);

  // Fire-and-forget initial drain. We don't await here — listener registration
  // must be synchronous to satisfy the teardown contract, and a slow drain
  // shouldn't block the caller.
  void drainQueue(options).catch((err) => {
    console.warn('[ih-offline] drain (initial) failed:', err);
  });

  return () => {
    cancelled = true;
    window.removeEventListener('online', handler);
  };
}
