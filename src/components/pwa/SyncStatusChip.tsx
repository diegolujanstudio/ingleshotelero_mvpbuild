"use client";

import { useEffect, useRef, useState } from "react";
import { count as queueCount } from "@/lib/offline/queue";
import type { DrainResult } from "@/lib/offline/types";
import { SYNC_CHIP } from "@/content/pwa";

type ChipState =
  | { kind: "hidden" }
  | { kind: "queued"; count: number; offline: boolean }
  | { kind: "synced"; count: number };

const POLL_MS = 2000;
const SYNCED_FADE_MS = 3000;

/**
 * Quiet mono caption that mirrors the offline queue's state. Designed to
 * never become a banner — the chip is at most one line of mono text in
 * espresso-muted, sitting in the exam layout footer.
 *
 * State machine:
 *   - count === 0           → render nothing.
 *   - count > 0,  online    → "Guardando localmente · N pendientes"
 *   - count > 0,  offline   → "Sin conexión · N pendientes"
 *   - last drain succeeded  → "Sincronizado · N respuestas" for 3s, then hide.
 *
 * Reactivity:
 *   - Subscribes to `ih:queue-changed` (dispatched by `api-client.ts` on
 *     enqueue) and `ih:sync-progress` (dispatched after each drain pass).
 *   - Falls back to polling `count()` every 2s in case a queue write
 *     happens outside the api-client (e.g. tests / dev tools).
 *   - Listens to `online` / `offline` browser events for the network
 *     state line.
 */
export function SyncStatusChip() {
  const [state, setState] = useState<ChipState>({ kind: "hidden" });
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDrainSucceeded = useRef<{ count: number; at: number } | null>(null);

  // Network-state line — pure event-driven, no polling.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Compute the next state from the current queue depth + last drain hint.
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const refresh = async () => {
      const n = await queueCount();
      if (cancelled) return;

      // If we just drained successfully and the queue is now empty, show
      // the "synced N" pill briefly. Otherwise update against current depth.
      if (n === 0) {
        const recent = lastDrainSucceeded.current;
        if (recent && Date.now() - recent.at < SYNCED_FADE_MS) {
          setState({ kind: "synced", count: recent.count });
          if (fadeTimer.current) clearTimeout(fadeTimer.current);
          fadeTimer.current = setTimeout(() => {
            setState({ kind: "hidden" });
          }, SYNCED_FADE_MS - (Date.now() - recent.at));
        } else {
          setState({ kind: "hidden" });
        }
        return;
      }
      setState({ kind: "queued", count: n, offline: !online });
    };

    void refresh();

    // Event-driven refresh: queue mutations (enqueue) + drain completions.
    const onQueueChanged = () => void refresh();
    const onSyncProgress = (ev: Event) => {
      const detail = (ev as CustomEvent<DrainResult>).detail;
      if (detail && detail.succeeded > 0 && detail.remaining === 0) {
        lastDrainSucceeded.current = {
          count: detail.succeeded,
          at: Date.now(),
        };
      }
      void refresh();
    };
    window.addEventListener("ih:queue-changed", onQueueChanged);
    window.addEventListener("ih:sync-progress", onSyncProgress as EventListener);

    // Polling fallback in case anything mutates the queue outside our hooks.
    const poll = setInterval(refresh, POLL_MS);

    return () => {
      cancelled = true;
      window.removeEventListener("ih:queue-changed", onQueueChanged);
      window.removeEventListener(
        "ih:sync-progress",
        onSyncProgress as EventListener,
      );
      clearInterval(poll);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [online]);

  if (state.kind === "hidden") return null;

  const text =
    state.kind === "synced"
      ? SYNC_CHIP.synced(state.count)
      : state.offline
        ? SYNC_CHIP.offline(state.count)
        : SYNC_CHIP.queued(state.count);

  return (
    <span
      role="status"
      aria-live="polite"
      className="caps text-espresso-muted"
    >
      {text}
    </span>
  );
}
