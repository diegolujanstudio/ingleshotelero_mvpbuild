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
 *                          + rate limits + request timeout SHOULD be retried.
 *                          409 is permanent-but-non-destructive: the row is
 *                          dropped but the recording blob is NEVER deleted — a
 *                          late recording the server now holds.)
 *       5xx / 429 / etc. → transient SERVER failure: bump `attempts`, leave row
 *                          in queue. On `attempts >= MAX_ATTEMPTS` (5), promote
 *                          to permanent, remove row, fire onItemFailed(true).
 *       network error    → transient, but NEVER counts toward MAX_ATTEMPTS and
 *                          never deletes the row (flaky/captive-portal wifi must
 *                          not lose a queued recording). Retries next drain.
 *   - After the first transient failure for a session, later queued items for
 *     the SAME session are held back this pass (ordering barrier) so a
 *     finalize-listening can't land ahead of its answers.
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

import { getAll, markFailure, recordSoftFailure, remove } from './queue';
import { loadBlob, deleteBlob } from './audio-store';
import type { DrainResult, QueuedRequest } from './types';

const MAX_ATTEMPTS = 5;
const BACKOFF_CAP_MS = 32_000;
/**
 * Fix 5 (re-drain scheduler): when a drain leaves items behind (transient
 * failure or a session held back by the ordering barrier), re-arm a delayed
 * drain after this interval so queued data doesn't wait indefinitely for the
 * next `online` / visibility transition.
 */
const RE_ARM_MS = 15_000;

/**
 * Fire the queue-changed event so the pending-count chip refreshes. Kept local
 * (rather than importing from api-client, which imports us) to avoid a cycle.
 * Server-safe: no-op when there's no `window`.
 */
function dispatchQueueChanged(): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('ih:queue-changed'));
  } catch {
    // Older browsers without CustomEvent ctor — the chip's polling covers it.
  }
}

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
 * Fix 1 (concurrency latch): a single in-flight drain shared by all callers.
 * `drainQueue` returns this promise instead of starting a second pass, so the
 * initial drain + an `online` event + two mounted components can't run
 * concurrently. Without it, pass B could observe a blob that pass A already
 * deleted mid-flight and report a false PERMANENT failure.
 */
let inFlight: Promise<DrainResult> | null = null;

/**
 * One drain pass. Idempotent — call as often as you like; it's a no-op when
 * the queue is empty or IDB is unavailable. Concurrent calls coalesce onto the
 * same in-flight pass (see `inFlight` above).
 */
export function drainQueue(options: SyncOptions = {}): Promise<DrainResult> {
  if (inFlight) return inFlight;
  const run = drainQueueImpl(options);
  inFlight = run;
  // Clear the latch once the pass settles, regardless of outcome.
  void run.then(
    () => {
      inFlight = null;
    },
    () => {
      inFlight = null;
    },
  );
  return run;
}

async function drainQueueImpl(options: SyncOptions = {}): Promise<DrainResult> {
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
  // Fix 4: did this pass mutate the queue (a row removed via success or
  // permanent failure)? If so we dispatch `ih:queue-changed` at the end.
  let mutated = false;
  // Fix 3: sessions that hit a transient failure this pass. Later queued items
  // for the same session (e.g. finalize-listening after its answers) must not
  // replay ahead of the failed earlier write, so we hold them back this pass.
  const blockedSessions = new Set<string>();

  for (const item of items) {
    // Fix 3 (session ordering barrier): skip — without bumping attempts — any
    // item whose session already failed transiently earlier this pass.
    if (blockedSessions.has(item.sessionId)) {
      continue;
    }

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
      mutated = true;
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
      mutated = true;
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
      // 2xx: clean up. A confirmed 2xx is the ONLY signal that lets us delete
      // the recording blob (see the 409 carve-out below).
      if (item.blobKey) {
        await deleteBlob(item.blobKey);
      }
      await remove(item.id);
      mutated = true;
      result.succeeded += 1;
      result.remaining -= 1;
      options.onItemSucceeded?.(item);
      continue;
    }

    // From here on: failure of some kind.
    sawFailure = true;
    result.failed += 1;

    if (response && !isTransientStatus(response.status)) {
      // Permanent client error (likely a payload bug). Log + drop the row.
      const status = response.status;
      const body = await safeReadBody(response);
      const err = new Error(`HTTP ${status}: ${body.slice(0, 200)}`);
      // Contract carve-out: a 409 conflict means the server already holds this
      // logical write (idempotent duplicate) or the session advanced past it —
      // a late recording the server now accepts. Stop retrying, but NEVER
      // destroy the blob on a 409. Only a genuine, non-409 permanent 4xx
      // deletes the recording.
      if (item.blobKey && status !== 409) {
        await deleteBlob(item.blobKey);
      }
      await remove(item.id);
      mutated = true;
      result.permanentlyFailed += 1;
      result.remaining -= 1;
      options.onItemFailed?.(item, err, true);
      continue;
    }

    // Fix 3: this session now failed transiently — hold back its later items.
    blockedSessions.add(item.sessionId);

    if (networkError) {
      // Fix 2: pure NETWORK error (fetch threw — offline / captive portal).
      // Do NOT increment attempts and NEVER delete the row: flaky wifi must
      // not consume the retry budget or lose a queued recording. It simply
      // retries on the next drain.
      await recordSoftFailure(item.id, networkError.message);
      options.onItemFailed?.(item, networkError, false);
      continue;
    }

    // Transient SERVER response (5xx / 429 / 408 / 401): bump attempts. The
    // attempt cap is reserved for real server failures like these.
    const err = new Error(`HTTP ${response?.status ?? 0}`);
    const nextAttempts = item.attempts + 1;
    if (nextAttempts >= MAX_ATTEMPTS) {
      // Exhausted retry budget against a persistently-failing server. Promote
      // to permanent failure to keep the queue from wedging forever.
      if (item.blobKey) {
        await deleteBlob(item.blobKey);
      }
      await remove(item.id);
      mutated = true;
      result.permanentlyFailed += 1;
      result.remaining -= 1;
      options.onItemFailed?.(item, err, true);
    } else {
      await markFailure(item.id, err.message);
      options.onItemFailed?.(item, err, false);
    }
  }

  // Fix 4: if the queue changed, refresh the pending-count chip.
  if (mutated) {
    dispatchQueueChanged();
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
  let reArmTimer: ReturnType<typeof setTimeout> | null = null;

  const kick = (reason: string) => {
    if (cancelled) return;
    void drainQueue(options)
      .then((result) => {
        if (cancelled) return;
        // Fix 5: if items remain (transient failures, or a session held back
        // by the ordering barrier), re-arm a delayed drain so they don't wait
        // indefinitely for the next `online` / visibility transition.
        if (result.remaining > 0) {
          if (reArmTimer) clearTimeout(reArmTimer);
          reArmTimer = setTimeout(() => kick('re-arm'), RE_ARM_MS);
        }
      })
      .catch((err) => {
        console.warn(`[ih-offline] drain (${reason}) failed:`, err);
      });
  };

  const onlineHandler = () => kick('online');
  // Fix 5: a tab returning to the foreground is a strong signal that
  // connectivity may have recovered (mobile browsers suspend background tabs);
  // attempt a drain then.
  const visibilityHandler = () => {
    if (document.visibilityState === 'visible') kick('visibility');
  };

  window.addEventListener('online', onlineHandler);
  document.addEventListener('visibilitychange', visibilityHandler);

  // Fire-and-forget initial drain. We don't await here — listener registration
  // must be synchronous to satisfy the teardown contract, and a slow drain
  // shouldn't block the caller.
  kick('initial');

  return () => {
    cancelled = true;
    if (reArmTimer) clearTimeout(reArmTimer);
    window.removeEventListener('online', onlineHandler);
    document.removeEventListener('visibilitychange', visibilityHandler);
  };
}
