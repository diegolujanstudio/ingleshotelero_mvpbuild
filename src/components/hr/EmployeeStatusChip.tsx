import { cn } from "@/lib/utils";
import { EMPLOYEES, type EmployeeStatus } from "@/content/hr";

const styles: Record<EmployeeStatus, string> = {
  active: "bg-white text-success border-success/40",
  paused: "bg-white text-warn border-warn/40",
  inactive: "bg-ivory-deep text-espresso-muted border-hair",
  promoted: "bg-ink-tint text-ink-deep border-ink/30",
  terminated: "bg-white text-error border-error/40",
};

export function EmployeeStatusChip({
  status,
  className,
}: {
  status: EmployeeStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em]",
        styles[status],
        className,
      )}
    >
      {EMPLOYEES.status[status]}
    </span>
  );
}
