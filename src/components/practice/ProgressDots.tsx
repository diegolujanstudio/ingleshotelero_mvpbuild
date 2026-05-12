import { cn } from "@/lib/utils";

/**
 * Four hairline dots showing position in the practice loop.
 * Filled = past or current; outline = future. No motion — the loop is
 * short enough that animation would feel busier than honest.
 */
export function ProgressDots({
  current,
  total = 4,
  className,
}: {
  current: number; // 0-based step index
  total?: number;
  className?: string;
}) {
  return (
    <ol
      className={cn("flex items-center gap-2", className)}
      aria-label={`Paso ${current + 1} de ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={i} aria-hidden>
            <span
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-full border border-hair",
                done && "bg-ink border-ink",
                active && "bg-espresso border-espresso",
                !done && !active && "bg-transparent",
              )}
            />
          </li>
        );
      })}
    </ol>
  );
}
