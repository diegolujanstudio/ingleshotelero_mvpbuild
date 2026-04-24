import * as React from "react";
import { cn } from "@/lib/utils";
import type { CEFRLevel } from "@/lib/supabase/types";

type BadgeTone = "neutral" | "soft" | "strong" | "success" | "warn" | "error";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/**
 * Compact label chip — mono, uppercase, 10px, tracked.
 * Matches .badge in the design system artifact.
 */
const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-ivory-deep text-espresso-muted border-hair",
  soft: "bg-ivory-deep text-espresso-soft border-hair",
  strong: "bg-ink-soft text-ink-deep border-transparent",
  success: "bg-white text-success border-success/30",
  warn: "bg-white text-warn border-warn/30",
  error: "bg-white text-error border-error/30",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2.5 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em]",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Specialized A1/A2/B1/B2 level badge — follows the artifact's progression:
 *   A1 → neutral,  A2 → soft,  B1 → strong,  B2 → filled ink.
 */
export function LevelBadge({
  level,
  className,
}: {
  level: CEFRLevel;
  className?: string;
}) {
  if (level === "B2") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-xs border border-ink bg-ink px-2.5 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-white",
          className,
        )}
      >
        {level}
      </span>
    );
  }
  const tone: BadgeTone =
    level === "A1" ? "neutral" : level === "A2" ? "soft" : "strong";
  return (
    <Badge tone={tone} className={className}>
      {level}
    </Badge>
  );
}
