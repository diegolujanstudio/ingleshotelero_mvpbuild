import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  eyebrow?: string;
  title: string;
  caption?: string;
  footnote?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wrapper around a recharts container. Editorial-dense (less padding than
 * HR cards) and tokenized — white surface, hairline border, no shadows.
 *
 * Pass the recharts <ResponsiveContainer> tree as children.
 */
export function ChartCard({
  eyebrow,
  title,
  caption,
  footnote,
  className,
  children,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-hair bg-white p-5",
        className,
      )}
    >
      <div className="mb-4">
        {eyebrow && <p className="caps mb-1">{eyebrow}</p>}
        <h3 className="font-serif text-t-h3 font-medium text-espresso">{title}</h3>
        {caption && (
          <p className="mt-1 font-sans text-t-caption text-espresso-muted">
            {caption}
          </p>
        )}
      </div>
      <div className="min-h-[220px] flex-1">{children}</div>
      {footnote && (
        <p className="mt-3 border-t border-hair pt-2 font-sans text-t-caption text-espresso-muted">
          {footnote}
        </p>
      )}
    </div>
  );
}
