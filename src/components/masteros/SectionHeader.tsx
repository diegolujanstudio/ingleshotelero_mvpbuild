import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * /masteros section header — dense (smaller bottom margin than HR dashboard)
 * with optional actions row. Uses the editorial type stack.
 */
export function SectionHeader({
  eyebrow,
  title,
  sub,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-hair pb-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="caps mb-1.5">{eyebrow}</p>
        )}
        <h1 className="font-serif text-t-h2 font-medium text-espresso">
          {title}
        </h1>
        {sub && (
          <p className="mt-1.5 max-w-prose font-sans text-t-body text-espresso-soft">
            {sub}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
