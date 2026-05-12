import { cn } from "@/lib/utils";

interface MetricCardProps {
  eyebrow: string;
  value: string | number;
  caption?: string;
  className?: string;
}

/**
 * Editorial metric tile — eyebrow (mono caps) + serif numeral + caption.
 * Dense version of the HR dashboard's <Stat> with a subtle ivory-soft hover.
 */
export function MetricCard({ eyebrow, value, caption, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-hair bg-white p-5 transition-colors hover:bg-ivory-soft",
        className,
      )}
    >
      <p className="caps mb-2">{eyebrow}</p>
      <p className="font-serif text-[2.25rem] font-medium leading-none tracking-tight text-espresso">
        {value}
      </p>
      {caption && <p className="caps mt-2.5">{caption}</p>}
    </div>
  );
}
