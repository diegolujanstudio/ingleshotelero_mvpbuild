"use client";

/**
 * MediaRecorder feature detection + mime-type negotiation.
 *
 * iOS Safari only added MediaRecorder in 14.3, and even then it only
 * supports `audio/mp4` — not the WebM/Opus that desktop Chrome and Android
 * Chrome prefer. We probe for what's actually supported at recording
 * start; the speaking-section page feature-gates on
 * `isMediaRecorderAvailable()` and shows a fallback screen if neither
 * MediaRecorder nor `getUserMedia` is present.
 */

const CANDIDATES: readonly string[] = [
  "audio/webm;codecs=opus", // Chrome desktop, Android Chrome (preferred)
  "audio/webm",
  "audio/mp4;codecs=mp4a.40.2", // iOS Safari 14.3+
  "audio/mp4",
  "audio/ogg;codecs=opus", // Firefox desktop
  "audio/ogg",
];

/**
 * Best supported recording mime, or `''` if MediaRecorder exists but
 * doesn't accept any of our candidates. Callers can pass `''` to the
 * MediaRecorder constructor and let the browser pick a default — but at
 * that point we're flying blind on the upload extension, so we prefer to
 * fall back to the feature-gate when this returns `''`.
 */
export function getSupportedAudioMimeType(): string {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return "";
  }
  for (const t of CANDIDATES) {
    try {
      if (MediaRecorder.isTypeSupported(t)) return t;
    } catch {
      // Some old WebKit builds throw on isTypeSupported with parameters —
      // try the next candidate.
    }
  }
  return "";
}

/**
 * True iff the page can record audio at all. Checks both `MediaRecorder`
 * and `navigator.mediaDevices.getUserMedia`. Use this to gate the
 * speaking section so the user never hits the record button on a
 * platform that will throw.
 */
export function isMediaRecorderAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof MediaRecorder === "undefined") return false;
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
    return false;
  }
  return true;
}

/**
 * Convenience wrapper: pick a mime type, build a MediaRecorder. Returns
 * `null` if the browser refuses every candidate (caller should already
 * have feature-gated via `isMediaRecorderAvailable`).
 */
export function createSupportedRecorder(stream: MediaStream): {
  recorder: MediaRecorder;
  mimeType: string;
} | null {
  const mimeType = getSupportedAudioMimeType();
  try {
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    return { recorder, mimeType: recorder.mimeType || mimeType || "audio/webm" };
  } catch {
    return null;
  }
}

/**
 * Pick a sensible file extension for a given mime string. Mirrors the
 * server-side `extFromMime` in `/api/recordings` so uploads land with
 * predictable storage keys.
 */
export function extensionForMime(mime: string): string {
  const lc = (mime || "").toLowerCase();
  if (lc.startsWith("audio/webm")) return "webm";
  if (lc.startsWith("audio/mp4")) return "mp4";
  if (lc.startsWith("audio/mpeg")) return "mp3";
  if (lc.startsWith("audio/ogg")) return "ogg";
  return "webm";
}
