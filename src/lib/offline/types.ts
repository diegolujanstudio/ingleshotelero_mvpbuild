/**
 * src/lib/offline/types.ts
 *
 * Shared type contracts for the offline layer (queue + audio store + sync).
 *
 * The offline layer never loses an exam answer or a recording. Two object
 * stores back this:
 *   - `queue`: serialisable request metadata (one row per pending API call)
 *   - `blobs`: binary audio data (referenced from queue rows by `blobKey`)
 *
 * Every row in `queue` carries a stable `idempotencyKey` so dedupe before
 * insert is cheap, and so server-side UPSERTs (`ON CONFLICT DO NOTHING`) are
 * always safe even if a request replays after a successful-but-uncommitted
 * write.
 */

/**
 * The kind of API call being deferred. Drives how `sync.ts` reconstructs
 * the request body and which store / endpoint to hit.
 */
export type QueuedRequestType = 'answer' | 'recording' | 'finalize-listening';

/**
 * Metadata for a deferred API call. The `body` field holds the
 * serialised JSON payload for `answer` / `finalize-listening`; for
 * `recording` items, `body` carries metadata only and the audio is
 * fetched from the `blobs` store via `blobKey` at drain time.
 */
export interface QueuedRequest {
  /** Stable id (crypto.randomUUID()). Primary key. */
  id: string;
  /** What kind of API call this represents. */
  type: QueuedRequestType;
  /** Absolute path of the endpoint, e.g. `/api/exams/<id>/answer`. */
  endpoint: string;
  /** HTTP method used to replay. */
  method: 'POST' | 'PATCH';
  /** Headers to send on replay. `Content-Type` is set automatically for FormData. */
  headers: Record<string, string>;
  /**
   * For `answer` / `finalize-listening`: `JSON.stringify(payload)`.
   * For `recording`: a JSON metadata blob (sessionId, prompt index, mime, etc.)
   * that is converted to FormData fields at drain time, alongside the binary
   * blob loaded by `blobKey`.
   */
  body: string;
  /** Key into the `blobs` store. Required for `recording` items. */
  blobKey?: string;
  /** `Date.now()` at enqueue. Drain order is FIFO by this value. */
  timestamp: number;
  /** How many times we've tried (and failed) to replay this item. */
  attempts: number;
  /** Owning exam session. Used for telemetry + filtering. */
  sessionId: string;
  /**
   * Stable per-(session, action) key for dedupe at enqueue time.
   * Examples: `s123-answer-q7`, `s123-recording-p3`, `s123-finalize-listening-0`.
   */
  idempotencyKey: string;
  /** Last error message recorded by `markFailure`. Diagnostic only. */
  lastError?: string;
}

/**
 * A binary audio blob stored separately from queue metadata so IDB can
 * efficiently hold it without serialising. Keyed by an app-supplied string
 * (typically `blob-<sessionId>-p<promptIndex>`).
 */
export interface BlobEntry {
  /** App-supplied stable key. Primary key. */
  key: string;
  /** The audio Blob. IDB stores binary natively. */
  blob: Blob;
  /** `Date.now()` at store time, used for `pruneOlderThan`. */
  storedAt: number;
  /** MIME type at capture time, e.g. `audio/webm;codecs=opus` or `audio/mp4`. */
  contentType: string;
}

/**
 * Summary of one drain pass. Returned by `drainQueue` and surfaced via the
 * `onProgress` callback. UI components use this to decide whether to show a
 * "synced N answers" toast.
 */
export interface DrainResult {
  /** Items examined this pass. */
  attempted: number;
  /** Items that 2xx'd and were removed. */
  succeeded: number;
  /** Items that errored this pass (transient or permanent). */
  failed: number;
  /** Items still in the queue after the pass (will retry on next drain). */
  remaining: number;
  /** Items removed because they hit the retry cap or a 4xx (non-retryable). */
  permanentlyFailed: number;
}
