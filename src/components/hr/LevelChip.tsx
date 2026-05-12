import { LevelBadge } from "@/components/ui/Badge";
import type { CEFRLevel } from "@/lib/supabase/types";

/** Null-safe wrapper around LevelBadge — emits an em-dash chip when no level. */
export function LevelChip({
  level,
  className,
}: {
  level: CEFRLevel | null;
  className?: string;
}) {
  if (!level) {
    return (
      <span className="inline-flex items-center rounded-xs border border-hair bg-ivory-deep px-2.5 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-espresso-muted">
        —
      </span>
    );
  }
  return <LevelBadge level={level} className={className} />;
}
