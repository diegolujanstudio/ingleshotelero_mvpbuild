"use client";

import { useEffect, useState } from "react";
import { SW_UPDATE } from "@/content/pwa";

/**
 * Bottom-right toast that surfaces "a new build is live" without forcing
 * the user to reload mid-flow. Dispatched by `installSWUpdateListener()`
 * (registered once at root layout mount) via the `ih:sw-updated` window
 * event.
 *
 * Behaviour:
 *   - Renders nothing until the event fires.
 *   - On click of the underlined em "Recargar", reloads the page so
 *     Workbox swaps the active controller. Does NOT auto-reload.
 *   - Auto-dismisses after 30 seconds — if the user is mid-recording we
 *     don't want a stale toast lingering.
 */
export function SWUpdateToast() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setOpen(true);
    window.addEventListener("ih:sw-updated", handler);
    return () => window.removeEventListener("ih:sw-updated", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 30_000);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 w-[280px] rounded-md border border-hair bg-ivory p-4 font-sans text-t-body text-espresso"
    >
      <p className="leading-snug">
        {SW_UPDATE.prefix}
        <button
          type="button"
          aria-label={SW_UPDATE.ariaLabel}
          onClick={() => {
            try {
              window.location.reload();
            } catch {
              // unreachable in any modern browser
            }
          }}
          className="appearance-none border-0 bg-transparent p-0 text-t-body underline-offset-4 hover:underline focus-visible:underline"
        >
          <em>{SW_UPDATE.cta}</em>
        </button>
      </p>
    </div>
  );
}
