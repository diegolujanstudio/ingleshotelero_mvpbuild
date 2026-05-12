"use client";

/**
 * Page-level API client for the exam flow. Wraps every API call the
 * exam pages make so:
 *
 *   1. Idempotency-Key headers are stable per-(session, action) → the
 *      server's `lookupIdempotent` table dedupes replays cleanly even
 *      when the offline queue retries.
 *   2. Network failures and 5xx responses queue the request into IDB via
 *      `src/lib/offline/queue.ts` (and `audio-store.ts` for recordings).
 *      Pages always advance — the user never sees "upload failed".
 *   3. The sync listener auto-starts on first queueable call; the queue
 *      drains as soon as the browser fires `online`.
 *
 * The drain logic in `src/lib/offline/sync.ts` already knows how to
 * rehydrate a recording request from the audio-store (FormData rebuilt at
 * drain time using `blobKey` + the JSON metadata stored in `body`).
 */

import { enqueue } from "@/lib/offline/queue";
import { storeBlob } from "@/lib/offline/audio-store";
import { startSyncListener } from "@/lib/offline/sync";
import { extensionForMime } from "./media-recorder";

/* ──────────────────────────────────────────────────────────── */
/* Module state                                                 */
/* ──────────────────────────────────────────────────────────── */

let _syncStarted = false;
function ensureSync(): void {
  if (_syncStarted) return;
  if (typeof window === "undefined") return;
  _syncStarted = true;
  startSyncListener({
    onProgress: (result) => {
      if (typeof window === "undefined") return;
      window.dispatchEvent(
        new CustomEvent("ih:sync-progress", { detail: result }),
      );
    },
  });
}

/** Notify chip subscribers immediately after enqueue so polling lag never shows stale "0". */
function dispatchQueueChanged(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("ih:queue-changed"));
  } catch {
    // Older browsers — chip's polling fallback covers it.
  }
}

/* ──────────────────────────────────────────────────────────── */
/* Types                                                        */
/* ──────────────────────────────────────────────────────────── */

export type AnswerLevelTag = "A1" | "A2" | "B1" | "B2";

export type ExamAnswerPayload =
  | {
      kind: "diagnostic";
      question_index: number;
      answer_value: unknown;
    }
  | {
      kind: "listening";
      question_index: number;
      selected_option: number;
      is_correct: boolean;
      level_tag: AnswerLevelTag;
      response_time_ms?: number;
      replay_count?: number;
    };

export interface PostResult {
  ok: true;
  /** True if the server confirmed the write. False = queued or local-only mode. */
  persisted: boolean;
  /** True if the request was deferred to the offline queue. */
  queued?: boolean;
  /** Server-side mode hint ('persisted' | 'local-only'); present on direct success. */
  mode?: "persisted" | "local-only";
}

export interface RecordingResult extends PostResult {
  recording_id?: string;
  signed_url?: string | null;
  scoring_status?: "pending" | "complete" | "failed";
}

/* ──────────────────────────────────────────────────────────── */
/* Exam answer (diagnostic + listening)                         */
/* ──────────────────────────────────────────────────────────── */

/**
 * POST `/api/exams/[id]/answer`. On 5xx / network failure, queue for
 * later replay. The caller should advance the UI immediately regardless
 * of the persisted flag — `persisted: false` is informational only.
 */
export async function postExamAnswer(
  sessionId: string,
  payload: ExamAnswerPayload,
): Promise<PostResult> {
  const idempotencyKey = `${sessionId}-${payload.kind}-${payload.question_index}`;
  const endpoint = `/api/exams/${sessionId}/answer`;
  const headers = {
    "content-type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };
  const body = JSON.stringify(payload);

  try {
    const r = await fetch(endpoint, { method: "POST", headers, body });
    if (r.ok) {
      const json = (await r.json().catch(() => ({}))) as {
        mode?: "persisted" | "local-only";
        persisted?: boolean;
      };
      return {
        ok: true,
        persisted: json.persisted ?? json.mode !== "local-only",
        mode: json.mode,
      };
    }
    if (r.status >= 500) {
      throw new Error(`server ${r.status}`);
    }
    // 4xx (validation, 409 invalid_status, etc.) — caller should keep going.
    // We don't queue 4xx because the request is bad and replaying it just
    // re-fails. Return ok:true so the UX moves on; persisted:false signals
    // the data didn't make it server-side.
    return { ok: true, persisted: false };
  } catch {
    ensureSync();
    await enqueue({
      type: "answer",
      endpoint,
      method: "POST",
      headers,
      body,
      sessionId,
      idempotencyKey,
    });
    dispatchQueueChanged();
    return { ok: true, persisted: false, queued: true };
  }
}

/* ──────────────────────────────────────────────────────────── */
/* Speaking recording                                            */
/* ──────────────────────────────────────────────────────────── */

/**
 * POST `/api/recordings` as multipart. On failure, store the audio Blob
 * in the audio-store and queue a `recording` row that the sync drain
 * will rehydrate into FormData on retry.
 *
 * Note: we never queue if `storeBlob` itself fails (IDB unavailable).
 * Callers see `queued: false, persisted: false` and should warn the user
 * once via the OfflineBanner.
 */
export async function postRecording(
  sessionId: string,
  promptIndex: number,
  blob: Blob,
  meta: {
    level_tag: AnswerLevelTag;
    audio_duration_seconds?: number;
  },
): Promise<RecordingResult> {
  const idempotencyKey = `${sessionId}-recording-p${promptIndex}`;
  const endpoint = `/api/recordings`;
  const ext = extensionForMime(blob.type);

  try {
    const fd = new FormData();
    fd.append("session_id", sessionId);
    fd.append("prompt_index", String(promptIndex));
    fd.append("level_tag", meta.level_tag);
    if (typeof meta.audio_duration_seconds === "number") {
      fd.append("audio_duration_seconds", String(meta.audio_duration_seconds));
    }
    fd.append("audio", blob, `p${promptIndex}.${ext}`);

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: fd,
    });
    if (r.ok) {
      const json = (await r.json().catch(() => ({}))) as {
        recording_id?: string;
        signed_url?: string | null;
        mode?: "persisted" | "local-only";
        scoring_status?: "pending" | "complete" | "failed";
      };
      return {
        ok: true,
        persisted: json.mode !== "local-only",
        mode: json.mode,
        recording_id: json.recording_id,
        signed_url: json.signed_url ?? null,
        scoring_status: json.scoring_status ?? "pending",
      };
    }
    if (r.status >= 500) {
      throw new Error(`server ${r.status}`);
    }
    return { ok: true, persisted: false };
  } catch {
    // Stash the blob in IDB; on success the sync drain rehydrates it.
    const blobKey = `blob-${sessionId}-p${promptIndex}-${Date.now()}`;
    const stored = await storeBlob(blobKey, blob);
    if (!stored) {
      // No IDB available (Private Browsing, etc.) — return ok so the page
      // moves on, but flag that the data is gone.
      return { ok: true, persisted: false };
    }
    ensureSync();
    await enqueue({
      type: "recording",
      endpoint,
      method: "POST",
      // Drain will strip Content-Type so the browser writes the multipart
      // boundary. We still record the Idempotency-Key so the server
      // dedupes replays after a successful-but-uncommitted write.
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        session_id: sessionId,
        prompt_index: promptIndex,
        level_tag: meta.level_tag,
        audio_duration_seconds: meta.audio_duration_seconds ?? null,
        mime_type: blob.type,
      }),
      blobKey,
      sessionId,
      idempotencyKey,
    });
    dispatchQueueChanged();
    return { ok: true, persisted: false, queued: true };
  }
}

/* ──────────────────────────────────────────────────────────── */
/* Finalize listening                                            */
/* ──────────────────────────────────────────────────────────── */

/**
 * POST `/api/exams/[id]/finalize-listening` to compute the listening
 * score server-side and advance status to `listening_done`. Queues on
 * failure so the score lands eventually even if the user navigates
 * offline at the boundary.
 */
export async function finalizeListening(sessionId: string): Promise<PostResult> {
  const idempotencyKey = `${sessionId}-finalize-listening-0`;
  const endpoint = `/api/exams/${sessionId}/finalize-listening`;
  const headers = {
    "content-type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };
  const body = "{}";

  try {
    const r = await fetch(endpoint, { method: "POST", headers, body });
    if (r.ok) {
      const json = (await r.json().catch(() => ({}))) as {
        mode?: "persisted" | "local-only";
      };
      return {
        ok: true,
        persisted: json.mode !== "local-only",
        mode: json.mode,
      };
    }
    if (r.status >= 500) throw new Error(`server ${r.status}`);
    return { ok: true, persisted: false };
  } catch {
    ensureSync();
    await enqueue({
      type: "finalize-listening",
      endpoint,
      method: "POST",
      headers,
      body,
      sessionId,
      idempotencyKey,
    });
    dispatchQueueChanged();
    return { ok: true, persisted: false, queued: true };
  }
}

/* ──────────────────────────────────────────────────────────── */
/* Session create / read                                         */
/* ──────────────────────────────────────────────────────────── */

/**
 * POST `/api/exams`. Never queues — session creation must succeed online
 * because the server-issued id is the URL the user lands on. Callers
 * should surface a clear error if this throws (the exam can't start).
 */
export async function createSession(payload: unknown): Promise<unknown> {
  const r = await fetch("/api/exams", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`createSession failed: ${r.status} ${text.slice(0, 200)}`);
  }
  return r.json();
}

/**
 * GET `/api/exams/[id]`. Throws on offline / 5xx so callers can fall
 * back to the localStorage cache for resume UX. 404 returns `null` (the
 * server returns 404 in demo mode for sessions that only live client-side).
 */
export async function getSession(sessionId: string): Promise<unknown | null> {
  const r = await fetch(`/api/exams/${sessionId}`, {
    method: "GET",
    headers: { accept: "application/json" },
  });
  if (r.status === 404) return null;
  if (!r.ok) {
    throw new Error(`getSession failed: ${r.status}`);
  }
  return r.json();
}
