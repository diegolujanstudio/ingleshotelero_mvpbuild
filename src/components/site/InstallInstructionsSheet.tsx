"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SHEET } from "@/content/auth";

export type InstallPlatform = "ios" | "android" | "desktop";

/**
 * Bottom-sheet instructions for installing the PWA when the browser's
 * native prompt isn't available (iOS always; Android Chrome before the
 * `beforeinstallprompt` engagement threshold; desktop without the
 * install icon visible).
 *
 * Same component, three platforms — keeps the brand voice consistent
 * and the surface footprint small.
 */
export function InstallInstructionsSheet({
  open,
  onClose,
  platform,
}: {
  open: boolean;
  onClose: () => void;
  platform: InstallPlatform;
}) {
  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const copy = SHEET[platform];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 px-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-md border border-hair bg-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="install-sheet-title"
            className="font-serif text-t-h3 font-medium text-espresso"
          >
            {copy.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-espresso-muted transition-colors hover:bg-ivory-soft hover:text-ink"
            aria-label={SHEET.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className="caps mb-4">{copy.intro}</p>

        <ol className="space-y-3">
          {copy.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="caps mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-ink-tint text-ink">
                {i + 1}
              </span>
              <span className="font-sans text-t-body text-espresso-soft">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-5 border-t border-hair pt-4 font-sans text-t-caption text-espresso-muted">
          {copy.note}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-pill bg-espresso px-5 font-sans text-t-label font-medium text-ivory transition-colors hover:bg-espresso-soft"
        >
          {SHEET.close}
        </button>
      </div>
    </div>
  );
}
