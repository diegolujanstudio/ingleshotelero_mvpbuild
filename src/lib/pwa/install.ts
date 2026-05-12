"use client";

/**
 * Install-prompt singleton.
 *
 * The Chromium `beforeinstallprompt` event must be captured the moment the
 * page boots — if it fires before a listener is attached, Chrome won't
 * fire it again for ~90 days after a dismiss. We capture it once at root
 * layout mount and stash the event in a module-scope ref. Both the home
 * page (existing `InstallButton`) and the speaking section (Phase 8 timing)
 * read from the same singleton, so neither double-fires nor races the
 * other.
 *
 * iOS Safari has no `beforeinstallprompt`. Callers should branch on
 * `isIOS()` and surface the share-sheet instructions instead.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listenerInstalled = false;
let installedListenerInstalled = false;
let isInstalled = false;

const SUBSCRIBERS = new Set<() => void>();
function notify() {
  for (const fn of SUBSCRIBERS) {
    try {
      fn();
    } catch {
      // never let one bad subscriber break the others
    }
  }
}

/**
 * Attach the global `beforeinstallprompt` capture. Idempotent — call from
 * the root layout client effect; subsequent calls are no-ops. Also wires
 * an `appinstalled` listener so we can hide install affordances mid-session.
 */
export function installInstallPromptCapture(): void {
  if (typeof window === "undefined") return;
  if (!listenerInstalled) {
    listenerInstalled = true;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      notify();
    });
  }
  if (!installedListenerInstalled) {
    installedListenerInstalled = true;
    window.addEventListener("appinstalled", () => {
      isInstalled = true;
      deferredPrompt = null;
      notify();
    });
  }
}

/**
 * Fire the captured Chromium prompt. Returns `'unavailable'` if no prompt
 * was captured (iOS, already installed, never fired). The prompt is
 * one-shot — after a successful or dismissed call, the deferred event is
 * dropped and the singleton has nothing to fire next time.
 */
export async function tryShowInstallPrompt(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredPrompt) return "unavailable";
  const event = deferredPrompt;
  // Clear synchronously so a double-tap can't re-prompt.
  deferredPrompt = null;
  notify();
  try {
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") {
      isInstalled = true;
    }
    return choice.outcome;
  } catch {
    return "unavailable";
  }
}

/** True iff a Chromium install prompt is captured and ready to fire. */
export function hasInstallPrompt(): boolean {
  return deferredPrompt !== null;
}

/** True iff the app is already running in a standalone PWA window. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (isInstalled) return true;
  const mql = window.matchMedia?.("(display-mode: standalone)");
  if (mql && mql.matches) return true;
  // iOS exposes a legacy boolean.
  if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
    return true;
  }
  return false;
}

/**
 * UA-sniff for iOS Safari (iPhone, iPad on iOS 13+, iPod). The iPad
 * `maxTouchPoints` heuristic catches modern iPads that report as Mac.
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipod|ipad/.test(ua)) return true;
  if (ua.includes("mac") && (window.navigator.maxTouchPoints ?? 0) > 1) return true;
  return false;
}

/**
 * Subscribe to install-state changes. Returns an unsubscribe function.
 * Components use this to re-render when a prompt is captured / fired /
 * the app is installed.
 */
export function subscribeToInstall(fn: () => void): () => void {
  SUBSCRIBERS.add(fn);
  return () => {
    SUBSCRIBERS.delete(fn);
  };
}
