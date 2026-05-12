import { Clock, CheckCircle2, FileText, ArrowUpRight } from "lucide-react";
import { EMPLOYEE_DETAIL } from "@/content/hr";

export interface TimelineEvent {
  type: "exam_started" | "exam_completed" | "practice_completed" | "level_updated";
  when_iso: string;
  detail?: string;
}

const ICONS = {
  exam_started: FileText,
  exam_completed: CheckCircle2,
  practice_completed: Clock,
  level_updated: ArrowUpRight,
};

function eventLabel(t: TimelineEvent["type"], detail?: string): string {
  if (t === "exam_started") return EMPLOYEE_DETAIL.timeline.examStarted;
  if (t === "exam_completed") return EMPLOYEE_DETAIL.timeline.examCompleted;
  if (t === "practice_completed") return EMPLOYEE_DETAIL.timeline.practiceCompleted;
  return `${EMPLOYEE_DETAIL.timeline.levelUpdated} ${detail ?? ""}`;
}

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="font-sans text-t-body text-espresso-muted">
        {EMPLOYEE_DETAIL.timeline.none}
      </p>
    );
  }
  return (
    <ol className="divide-y divide-hair rounded-md border border-hair bg-white">
      {events.map((e, i) => {
        const Icon = ICONS[e.type];
        return (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <span className="rounded-pill bg-ivory-soft p-1.5 text-ink">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-t-body text-espresso">
                {eventLabel(e.type, e.detail)}
              </p>
            </div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-muted">
              {new Date(e.when_iso).toLocaleString("es-MX", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
