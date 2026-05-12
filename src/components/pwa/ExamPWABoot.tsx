"use client";

import { useEffect } from "react";
import { requestPersistentStorage } from "@/lib/pwa/storage";
import { startSyncListener } from "@/lib/offline/sync";

/**
 * Exam-flow PWA bootstrap. Mounted once at the exam layout.
 *
 * Two responsibilities:
 *
 *   1. Ask for persistent storage on exam start so iOS doesn't evict our
 *      IDB (queue + audio blobs) under memory pressure. The first-time
 *      call surfaces a permission dialog; subsequent calls are no-ops.
 *
 *   2. Start the offline-queue drain listener. The api-client also calls
 *      this lazily on first enqueue, but kicking it off here covers the
 *      "user came back online before submitting an answer" race.
 *
 * Returns null — pure side-effect component.
 */
export function ExamPWABoot() {
  useEffect(() => {
    // Best-effort, never throws. We don't surface the result — the user
    // doesn't need to know whether the browser said yes.
    void requestPersistentStorage();

    // Drain anything left over from a previous session (the listener also
    // installs a `window.online` handler that auto-fires on reconnect).
    const teardown = startSyncListener({
      onProgress: (result) => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(
          new CustomEvent("ih:sync-progress", { detail: result }),
        );
      },
    });

    return () => {
      teardown();
    };
  }, []);
  return null;
}
