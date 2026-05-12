import { LevelBadge } from "@/components/ui/Badge";
import type { CEFRLevel } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * Thin wrapper around `LevelBadge` that adds the "Nivel" caption.
 * Used in the practice intro header where the chip needs an inline
 * label rather than standing alone.
 */
export function LevelChip({
  level,
  className,
}: {
  level: CEFRLevel;
  className?: string;
}) {
  return (
    <span className={cn("caps inline-flex items-center gap-2", className)}>
      <span className="text-espresso-muted">Nivel</span>
      <LevelBadge level={level} />
    </span>
  );
}
