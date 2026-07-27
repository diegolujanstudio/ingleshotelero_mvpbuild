import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Caption-style streak chip.
 *
 *   "Racha · 7 días"  with a Lucide flame after the count once
 *                     the streak reaches 3+. No emoji.
 *
 * The chip is intentionally typographic — JetBrains Mono caps,
 * inline with surrounding text. The flame is a 12px lucide icon,
 * inheriting `text-ink` so it picks up the brand accent.
 */
export function StreakChip({
  current,
  className,
}: {
  current: number;
  className?: string;
}) {
  // A zero streak is never displayed as a zero.
  //
  // METODO-TURNO.md Law 5: a hotel worker on rotating shifts will break a
  // streak by working a double, not by quitting. Showing "Racha · 0 días" to
  // someone returning from a 12-hour turno punishes them for their job and is
  // exactly the moment cohorts die. We show a forward-looking line instead.
  if (current <= 0) {
    return (
      <span
        className={cn("caps inline-flex items-center text-espresso-muted", className)}
      >
        Empezamos hoy
      </span>
    );
  }

  const showFlame = current >= 3;
  return (
    <span
      className={cn(
        "caps inline-flex items-center gap-1.5 text-espresso",
        className,
      )}
      aria-label={`Racha de ${current} ${current === 1 ? "día" : "días"}`}
    >
      <span>
        Racha · <em className="font-serif normal-case tracking-normal">{current}</em>{" "}
        {current === 1 ? "día" : "días"}
      </span>
      {showFlame ? (
        <Flame className="h-3 w-3 text-ink" aria-hidden />
      ) : null}
    </span>
  );
}
