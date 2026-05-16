import { Check } from "lucide-react";

/**
 * StreakRibbon — the daily reward, made tangible.
 *
 * A 7-day window of marks. Days already practiced are filled ink;
 * today (the just-completed day) gets a ring; future days are empty
 * hairline cells. A milestone line gives the streak a destination
 * ("a los 7 desbloqueas tu primera semana").
 *
 * Editorial, not gamey: no confetti, no bounce, single ink accent,
 * hairline borders, 10px radius — fits the design system while still
 * giving the loop an emotional payoff worth coming back for. Pure
 * server component (derived from `streak`); a soft fade-in honors
 * prefers-reduced-motion via the global rule.
 */

const WINDOW = 7;

const MILESTONES: { at: number; label: string }[] = [
  { at: 3, label: "primer hábito" },
  { at: 7, label: "primera semana" },
  { at: 14, label: "dos semanas seguidas" },
  { at: 30, label: "un mes de constancia" },
  { at: 90, label: "el módulo completo" },
];

function nextMilestone(streak: number) {
  return MILESTONES.find((m) => m.at > streak) ?? null;
}
function hitMilestone(streak: number) {
  return MILESTONES.find((m) => m.at === streak) ?? null;
}

export function StreakRibbon({ streak }: { streak: number }) {
  const s = Math.max(0, streak | 0);
  // Show the 7-day window ending today. Filled = practiced within
  // the current run; the last filled cell (today) gets the ring.
  const filledInWindow = Math.min(s, WINDOW);
  const cells = Array.from({ length: WINDOW }, (_, i) => {
    // Right-align the run: the rightmost `filledInWindow` cells are on.
    const on = i >= WINDOW - filledInWindow;
    const isToday = i === WINDOW - 1 && filledInWindow > 0;
    return { on, isToday };
  });

  const hit = hitMilestone(s);
  const next = nextMilestone(s);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-2" aria-hidden>
        {cells.map((c, i) => (
          <div
            key={i}
            className={[
              "flex h-11 w-11 items-center justify-center rounded-md border transition-colors",
              c.on
                ? "border-ink bg-ink text-white"
                : "border-hair bg-white text-transparent",
              c.isToday ? "ring-2 ring-ink ring-offset-2 ring-offset-ivory" : "",
            ].join(" ")}
          >
            {c.on ? <Check className="h-5 w-5" aria-hidden /> : null}
          </div>
        ))}
      </div>

      <p className="mt-4 font-sans text-t-body text-espresso-soft">
        {hit ? (
          <>
            <em>¡{capitalize(hit.label)}!</em> Llevas {s}{" "}
            {s === 1 ? "día" : "días"} seguidos.
          </>
        ) : next ? (
          <>
            Vas por <em>{s}</em> {s === 1 ? "día" : "días"}. A los{" "}
            <em>{next.at}</em> desbloqueas tu {next.label}.
          </>
        ) : (
          <>
            <em>{s}</em> días seguidos. Constancia de élite — sigue así.
          </>
        )}
      </p>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
