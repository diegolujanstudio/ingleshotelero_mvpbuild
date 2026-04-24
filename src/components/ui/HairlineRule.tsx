import { cn } from "@/lib/utils";

/**
 * Full-bleed 1px hairline rule. Preferred over <hr> everywhere.
 * Use between sections to keep rhythm without heavy dividers.
 */
export function HairlineRule({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "block bg-hair",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
