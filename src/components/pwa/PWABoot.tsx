"use client";

import { useEffect } from "react";
import { installInstallPromptCapture } from "@/lib/pwa/install";
import { installSWUpdateListener } from "@/lib/pwa/sw-update";

/**
 * Root-level PWA bootstrap. Mounted once in the root layout.
 *
 * The Chromium `beforeinstallprompt` event must be captured the moment
 * the page boots — if no listener is attached when it fires, Chrome
 * suppresses it for ~90 days. We register the capture in a root client
 * effect so both the home page (`<InstallButton />`) and the exam
 * speaking section can read from the same singleton without racing each
 * other.
 *
 * Same idea for the SW `controllerchange` listener: register once,
 * dispatch a custom `ih:sw-updated` event that any toast in the tree
 * can react to.
 */
export function PWABoot() {
  useEffect(() => {
    installInstallPromptCapture();
    installSWUpdateListener();
  }, []);
  return null;
}
