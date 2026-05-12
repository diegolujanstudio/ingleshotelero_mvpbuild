"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface JsonEditorProps {
  value: string;
  onChange: (value: string, parsed: unknown | null, error: string | null) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}

/**
 * Plain controlled <textarea> with JSON validation feedback.
 *
 * Not Monaco — keeps the bundle lean and stays on-brand. Validates on every
 * change and surfaces parse errors with a small mono caption underneath.
 * Calls `onChange(rawValue, parsedOrNull, errorOrNull)` so the caller can
 * decide how to gate save buttons.
 */
export function JsonEditor({
  value,
  onChange,
  className,
  rows = 18,
  placeholder,
  readOnly,
  ariaLabel,
}: JsonEditorProps) {
  const { parsed, error } = useMemo(() => parse(value), [value]);

  // Re-broadcast on mount so callers see the initial validation state.
  useEffect(() => {
    onChange(value, parsed, error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <textarea
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          const next = parse(v);
          onChange(v, next.parsed, next.error);
        }}
        spellCheck={false}
        rows={rows}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "w-full resize-y rounded-md border border-hair bg-white p-3",
          "font-mono text-[0.75rem] leading-[1.55] text-espresso",
          "focus:border-ink focus:outline-none",
          error && "border-error focus:border-error",
          readOnly && "bg-ivory-soft",
        )}
      />
      {error ? (
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
          {error}
        </p>
      ) : (
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
          JSON válido
        </p>
      )}
    </div>
  );
}

function parse(value: string): { parsed: unknown | null; error: string | null } {
  if (!value.trim()) return { parsed: null, error: "Vacío" };
  try {
    return { parsed: JSON.parse(value), error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return { parsed: null, error: msg };
  }
}
