"use client";

/**
 * Best-effort `navigator.storage.persist()`.
 *
 * iOS evicts evictable storage aggressively (~50MB cap, can drop our IDB
 * mid-exam if the user switches apps). On exam-flow mount we ask for
 * persistent storage so blobs and the offline queue survive across tab
 * close + low-memory scenarios.
 *
 * Returns `'persisted' | 'denied' | 'unsupported'`. Never throws. Safe to
 * call multiple times — the API is idempotent on the platform side.
 */
export async function requestPersistentStorage(): Promise<
  "persisted" | "denied" | "unsupported"
> {
  if (typeof navigator === "undefined") return "unsupported";
  const storage = navigator.storage;
  if (!storage || typeof storage.persist !== "function") return "unsupported";
  try {
    // Already persisted? Skip the prompt.
    if (typeof storage.persisted === "function") {
      const already = await storage.persisted();
      if (already) return "persisted";
    }
    const granted = await storage.persist();
    return granted ? "persisted" : "denied";
  } catch {
    return "unsupported";
  }
}

/** True if `navigator.storage.persist` is callable in this browser. */
export function isPersistentStorageSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.storage &&
    typeof navigator.storage.persist === "function"
  );
}

/**
 * Best-effort current quota usage. Returns `null` if the API is missing.
 * Used by debug surfaces; not load-bearing in the exam flow.
 */
export async function getStorageEstimate(): Promise<{
  usage: number;
  quota: number;
} | null> {
  if (typeof navigator === "undefined") return null;
  if (!navigator.storage || typeof navigator.storage.estimate !== "function") {
    return null;
  }
  try {
    const est = await navigator.storage.estimate();
    return { usage: est.usage ?? 0, quota: est.quota ?? 0 };
  } catch {
    return null;
  }
}
