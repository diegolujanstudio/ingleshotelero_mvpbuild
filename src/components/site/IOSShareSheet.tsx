"use client";

import { useEffect } from "react";
import { IOS_SHEET } from "@/content/auth";

interface IOSShareSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Bottom-sheet overlay with the iOS "Add to Home Screen" instructions.
 *
 * iOS Safari does not implement `beforeinstallprompt`; the only path
 * to install a PWA on iOS is the Share Sheet → Add to Home Screen flow.
 * We surface that flow as a guided sheet — small SVG of the iOS share
 * glyph, three numbered steps, and a close affordance.
 *
 * Triggered from `InstallButton` when the device is detected as iOS.
 */
export function IOSShareSheet({ open, onClose }: IOSShareSheetProps) {
  // Lock body scroll while the sheet is open. Restore on unmount or close.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Dismiss on Escape.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-share-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-t-md border-t border-x border-hair bg-white p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="caps mb-3">{IOS_SHEET.title}</p>
        <ol className="mt-4 space-y-5">
          <li className="flex gap-4">
            <Marker label={IOS_SHEET.step1.label} />
            <p className="font-sans text-t-body text-espresso-soft">
              {IOS_SHEET.step1.body}{" "}
              <ShareGlyph aria-label={IOS_SHEET.shareIconAria} />
            </p>
          </li>
          <li className="flex gap-4">
            <Marker label={IOS_SHEET.step2.label} />
            <p className="font-sans text-t-body text-espresso-soft">
              {IOS_SHEET.step2.body.split("Añadir a Inicio").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <em>Añadir a Inicio</em>}
                </span>
              ))}
            </p>
          </li>
          <li className="flex gap-4">
            <Marker label={IOS_SHEET.step3.label} />
            <p className="font-sans text-t-body text-espresso-soft">
              {IOS_SHEET.step3.body}
            </p>
          </li>
        </ol>
        <div className="mt-7 border-t border-hair pt-4">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
          >
            {IOS_SHEET.close} →
          </button>
        </div>
      </div>
    </div>
  );
}

function Marker({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="mt-[2px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hair bg-ivory-soft font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-espresso"
    >
      {label}
    </span>
  );
}

/**
 * Inline SVG of the iOS Share glyph — square with an arrow exiting the top.
 * Sized to sit on the same baseline as surrounding text.
 */
function ShareGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      className="ml-1 inline-block -translate-y-[1px] text-ink"
      {...props}
    >
      <path d="M12 4v12" />
      <path d="m8 8 4-4 4 4" />
      <path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}
