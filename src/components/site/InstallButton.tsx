"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { INSTALL } from "@/content/auth";
import { IOSShareSheet } from "./IOSShareSheet";
import {
  hasInstallPrompt,
  isIOS,
  isStandalone,
  subscribeToInstall,
  tryShowInstallPrompt,
} from "@/lib/pwa/install";

/**
 * Install lever on the sign-in home.
 *
 * Three branches:
 *   1. Chromium / Edge / Android Chrome — captured `beforeinstallprompt`
 *      lives in the `src/lib/pwa/install` singleton (registered at the
 *      root layout). Click → fires `tryShowInstallPrompt()` once.
 *   2. iOS Safari — no `beforeinstallprompt`. Open the share-sheet
 *      instructions overlay.
 *   3. Already installed (`display-mode: standalone`) OR no service
 *      worker support — render nothing.
 *
 * The capture itself happens in `<PWABoot />` at root mount, so this
 * component is safe to mount/unmount without losing the deferred event.
 * The same singleton is also read from `/exam/[id]/speaking` (Phase 8
 * timing) — there is no double-firing because `tryShowInstallPrompt`
 * clears the prompt synchronously on first call.
 */
export function InstallButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [iOS, setIOS] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const swSupported = "serviceWorker" in window.navigator;
    if (isStandalone() || !swSupported) {
      setHidden(true);
      return;
    }
    setIOS(isIOS());
    setHasPrompt(hasInstallPrompt());

    const unsubscribe = subscribeToInstall(() => {
      setHasPrompt(hasInstallPrompt());
      if (isStandalone()) setHidden(true);
    });
    return unsubscribe;
  }, []);

  if (!mounted || hidden) return null;

  // iOS — no native prompt, open the share-sheet instructions.
  if (iOS) {
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

  // Chromium / Edge / Android — fire the deferred prompt once.
  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      disabled={!hasPrompt || busy}
      onClick={async () => {
        if (!hasPrompt || busy) return;
        setBusy(true);
        const outcome = await tryShowInstallPrompt();
        if (outcome === "accepted") setHidden(true);
        // After a successful or dismissed call the singleton is empty,
        // so the subscription will set hasPrompt to false. Reset busy.
        setBusy(false);
      }}
      className={className}
    >
      <ArrowDownToLine className="h-4 w-4" aria-hidden />
      {hasPrompt ? INSTALL.cta : INSTALL.ctaPending}
    </Button>
  );
}
