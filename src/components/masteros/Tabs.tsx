"use client";

import Link from "next/link";

export interface MasterosTabItem {
  id: string;
  label: string;
  count: number;
  href: string;
}

/**
 * Editorial caps tabs for /masteros surfaces.
 *
 * Bottom-rule with a 0.5px ink underline on the active item. Counts render
 * in the muted mono after the label so the eye reads label-first.
 */
export function MasterosTabs({
  items,
  active,
}: {
  items: MasterosTabItem[];
  active: string;
}) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1 border-b border-hair">
      {items.map((t) => {
        const isActive = active === t.id;
        return (
          <Link
            key={t.id}
            href={t.href}
            role="tab"
            aria-selected={isActive}
            className={[
              "relative px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors",
              isActive
                ? "text-ink"
                : "text-espresso-muted hover:text-espresso",
            ].join(" ")}
          >
            {t.label}
            <span
              className={[
                "ml-2 font-mono text-[0.6875rem] tabular-nums",
                isActive ? "text-ink-deep" : "text-espresso-muted",
              ].join(" ")}
            >
              {t.count.toLocaleString("es-MX")}
            </span>
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-0.5 bg-ink"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
