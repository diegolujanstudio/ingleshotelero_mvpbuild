import { cn } from "@/lib/utils";
import { CRM } from "@/content/masteros";

export type CrmStatus = "pilot" | "paid" | "churned";

interface StatusChipProps {
  status: CrmStatus;
  className?: string;
}

const styles: Record<CrmStatus, string> = {
  pilot: "bg-white text-warn border-warn/40",
  paid: "bg-white text-success border-success/40",
  churned: "bg-ivory-deep text-espresso-muted border-hair",
};

const labels: Record<CrmStatus, string> = {
  pilot: CRM.status.pilot,
  paid: CRM.status.paid,
  churned: CRM.status.churned,
};

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em]",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}

export const STATUS_VALUES: CrmStatus[] = ["pilot", "paid", "churned"];
