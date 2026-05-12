"use client";

/**
 * Service-worker `controllerchange` listener.
 *
 * `@ducanh2912/next-pwa` ships a fresh Workbox SW on every build. When a
 * new SW activates and calls `clients.claim()`, the page's
 * `navigator.serviceWorker.controller` swaps under us — Workbox fires
 * `controllerchange`. We dispatch a custom `ih:sw-updated` window event
 * so the React tree (the `<SWUpdateToast />` component) can react.
 *
 * We intentionally do NOT force-reload. The user might be mid-recording.
 * The toast offers a "Recargar" button; nothing else changes.
 */

const FLAG = "__ihSwUpdateInstalled" as const;
type W = Window & { [FLAG]?: boolean };

export function installSWUpdateListener(): void {
  if (typeof window === "undefined") return;
  if ((window as W)[FLAG]) return;
  if (!("serviceWorker" in navigator)) return;
  (window as W)[FLAG] = true;

  // Skip the first controller swap that fires when a SW first takes
  // control of the page (no prior controller). We only want to react when
  // a NEW build has activated and replaced an existing controller.
  let initialControllerSeen = navigator.serviceWorker.controller !== null;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!initialControllerSeen) {
      initialControllerSeen = true;
      return;
    }
    try {
      window.dispatchEvent(new CustomEvent("ih:sw-updated"));
    } catch {
      // CustomEvent constructor missing on very old browsers — fall back
      // to a plain Event so the listener at least fires.
      const fallback = document.createEvent("Event");
      fallback.initEvent("ih:sw-updated", false, false);
      window.dispatchEvent(fallback);
    }
  });
}

/** Manual trigger for the update toast — used by tests / debug surfaces. */
export function dispatchSWUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ih:sw-updated"));
}
