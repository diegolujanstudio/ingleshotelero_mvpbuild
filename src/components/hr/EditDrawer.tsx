"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HairlineRule } from "@/components/ui/HairlineRule";

interface EditDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

/**
 * Slide-in drawer from the right. White panel, hair border, full-height,
 * fixed positioning. Ivory backdrop click-to-close.
 *
 * Plain React + portal-free implementation — no Radix dialog dependency
 * needed for this surface; we already control focus via button refs in
 * forms above. Esc closes via document keydown.
 */
export function EditDrawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  widthClass = "w-full max-w-[480px]",
}: EditDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-espresso/10"
      />
      <aside
        className={cn(
          "relative flex h-full flex-col border-l border-hair bg-white",
          widthClass,
        )}
      >
        <header className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
          <div className="min-w-0">
            {eyebrow && (
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-espresso-muted hover:bg-ivory-soft hover:text-espresso"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>
        <HairlineRule />
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <>
            <HairlineRule />
            <footer className="flex items-center justify-end gap-2 px-5 py-3">
              {footer}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
