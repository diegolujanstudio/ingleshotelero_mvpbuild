"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { INSTALL } from "@/content/auth";
import { IOSShareSheet } from "./IOSShareSheet";

/**
 * Web App `BeforeInstallPromptEvent` (Chromium). Not in lib.dom yet.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * The install lever on the sign-in home.
 *
 * Three branches:
 *
 *   1. Chromium / Edge / Android Chrome → captures `beforeinstallprompt`.
 *      Click calls `.prompt()` directly. After the user picks, the deferred
 *      event is one-shot — we drop it.
 *
 *   2. iOS Safari → no `beforeinstallprompt`. Show a bottom sheet with the
 *      Share Sheet → Add to Home Screen instructions.
 *
 *   3. Already installed (display-mode: standalone) OR no SW support →
 *      hide the button entirely.
 *
 * We render `null` until the first effect tick to avoid hydration drift,
 * since the install state is window-only.
 */
export function InstallButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") return;

    // Already running as an installed PWA, or in iOS Safari standalone mode,
    // or the platform has no service worker support. Hide the lever.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS exposes its own legacy bool on navigator
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const swSupported = "serviceWorker" in window.navigator;

    if (standalone || !swSupported) {
      setHidden(true);
      return;
    }

    // Detect iOS Safari (iPhone, iPad, iPod). iPad on iOS 13+ identifies as
    // Macintosh with touch — we add the `maxTouchPoints` heuristic.
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile =
      /iphone|ipod/.test(ua) ||
      (ua.includes("mac") && (window.navigator.maxTouchPoints ?? 0) > 1);
    setIsIOS(isAppleMobile);

    // Capture the install prompt for non-iOS platforms.
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // If the install completes mid-session, hide the lever.
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!mounted || hidden || installed) return null;

  // iOS — no native prompt, open the share-sheet instructions.
  if (isIOS) {
    return (
      <>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => setSheetOpen(true)}
          className={className}
        >
          <ArrowDownToLine className="h-4 w-4" aria-hidden />
          {INSTALL.cta}
        </Button>
        <IOSShareSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      </>
    );
  }

  // Chromium / Edge / Android — fire the deferred prompt.
  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      disabled={!deferredPrompt}
      onClick={async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setInstalled(true);
        }
        setDeferredPrompt(null);
      }}
      className={className}
    >
      <ArrowDownToLine className="h-4 w-4" aria-hidden />
      {deferredPrompt ? INSTALL.cta : INSTALL.ctaPending}
    </Button>
  );
}
