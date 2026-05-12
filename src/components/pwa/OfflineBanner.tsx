"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/offline/db";
import { OFFLINE_BANNER } from "@/content/pwa";

/**
 * Inline banner that surfaces ONLY when IDB is unavailable on this
 * device — the most common cause is iOS Safari Private Browsing, which
 * disables IndexedDB entirely. Without IDB the offline queue can't
 * function, so we tell the user up-front that losing connection mid-exam
 * means losing answers.
 *
 * Renders nothing when IDB works, when SSR, or before mount (avoids
 * hydration drift).
 */
export function OfflineBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // getDB() may return a non-null Dexie instance whose underlying
    // open() promise rejects asynchronously. We probe twice — once on
    // mount, once after a 250ms tick — to catch the deferred failure.
    const probe = () => setShow(getDB() === null);
    probe();
    const t = setTimeout(probe, 250);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      className="mx-auto mt-4 max-w-shell px-6 md:px-12"
    >
      <div className="rounded-md border border-hair bg-ivory-soft px-4 py-3">
        <p className="font-sans text-t-body text-espresso-soft">
          {OFFLINE_BANNER.body}
        </p>
      </div>
    </div>
  );
}
