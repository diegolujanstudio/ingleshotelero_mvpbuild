"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { INSTALL } from "@/content/auth";
import {
  InstallInstructionsSheet,
  type InstallPlatform,
} from "./InstallInstructionsSheet";
import {
  hasInstallPrompt,
  isIOS,
  isStandalone,
  subscribeToInstall,
  tryShowInstallPrompt,
} from "@/lib/pwa/install";

/**
 * Install lever — always actionable, never stuck on "preparing".
 *
 * On click:
 *   1. If we have a deferred prompt (Android/desktop Chrome that hit
 *      the engagement threshold) → fire it natively.
 *   2. Otherwise → open the platform-specific instructions sheet
 *      (iOS share-sheet steps, Android menu steps, desktop address-
 *      bar icon steps).
 *
 * If the page is already running standalone (added to home screen) we
 * render a small "Ya está instalada" pill instead of a CTA. If the
 * browser doesn't support service workers at all, we hide the button.
 */
export function InstallButton({
  className,
  variant = "primary",
  size = "lg",
  label,
}: {
  className?: string;
  variant?: "primary" | "accent" | "ghost";
  size?: "md" | "lg";
  label?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const swSupported = "serviceWorker" in window.navigator;
    if (!swSupported) {
      setHidden(true);
      return;
    }
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    setPlatform(detectPlatform());
    setHasPrompt(hasInstallPrompt());

    const unsubscribe = subscribeToInstall(() => {
      setHasPrompt(hasInstallPrompt());
      if (isStandalone()) setInstalled(true);
    });
    return unsubscribe;
  }, []);

  if (!mounted || hidden) return null;

  if (installed) {
    return (
      <span
        className={[
          "inline-flex items-center gap-1.5 rounded-pill border border-hair bg-ivory-soft px-4 py-2 font-sans text-t-label text-espresso-muted",
          className ?? "",
        ].join(" ")}
      >
        <Check className="h-3.5 w-3.5" aria-hidden />
        {INSTALL.ctaInstalled}
      </span>
    );
  }

  const handleClick = async () => {
    // Try native prompt first if available — best UX on Android Chrome.
    if (hasPrompt) {
      const outcome = await tryShowInstallPrompt();
      if (outcome === "accepted") {
        setInstalled(true);
        return;
      }
      if (outcome === "dismissed") {
        // Even after a native dismiss, fall through to the sheet so the
        // user can still see how to install manually if they change their
        // mind in 5 seconds.
        setSheetOpen(true);
        return;
      }
      // outcome === "unavailable" — fall through to the sheet.
    }
    // No native prompt → instructional sheet.
    setSheetOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        <ArrowDownToLine className="h-4 w-4" aria-hidden />
        {label ?? INSTALL.cta}
      </Button>
      <InstallInstructionsSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        platform={platform}
      />
    </>
  );
}

function detectPlatform(): InstallPlatform {
  if (typeof window === "undefined") return "desktop";
  if (isIOS()) return "ios";
  const ua = window.navigator.userAgent || "";
  // Android UA always contains "Android"; some tablets too.
  if (/Android/i.test(ua)) return "android";
  // Mobile Chrome on Windows / Linux is rare; treat anything with mobile
  // hint as android steps (closer than desktop).
  if (/Mobi|Tablet/i.test(ua)) return "android";
  return "desktop";
}
