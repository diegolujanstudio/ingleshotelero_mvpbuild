import { formatIndex } from "@/lib/utils";

/**
 * Section header inside the exam shell. Numbered, with progress fraction
 * and a hairline progress bar underneath.
 */
export function ProgressHeader({
  section,
  title,
  current,
  total,
  note,
}: {
  section: string;
  title: string;
  current: number; // 1-based
  total: number;
  note?: string;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <header className="mb-10">
      <div className="flex items-baseline justify-between">
        <p className="caps">{section}</p>
        <p className="caps">
          {formatIndex(current)} / {formatIndex(total)}
        </p>
      </div>
      <h1 className="mt-3 font-serif text-t-h2 font-medium text-espresso md:text-t-h1">
        {title}
      </h1>
      {note && (
        <p className="mt-2 font-sans text-t-body text-espresso-muted">{note}</p>
      )}
      <div
        aria-hidden
        className="mt-6 h-px w-full bg-hair"
      >
        <div
          className="h-px bg-ink transition-all duration-500 ease-editorial"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
}
