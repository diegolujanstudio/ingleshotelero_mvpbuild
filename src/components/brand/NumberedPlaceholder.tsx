import { cn, formatIndex } from "@/lib/utils";

interface NumberedPlaceholderProps {
  index: number;
  caption: string;
  className?: string;
  /**
   * Aspect ratio — defaults to 4/3 for editorial hero imagery.
   * Use "square" for gallery tiles, "wide" for full-bleed banners.
   */
  aspect?: "4/3" | "square" | "wide" | "portrait";
}

const aspectClass: Record<NonNullable<NumberedPlaceholderProps["aspect"]>, string> = {
  "4/3": "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
};

/**
 * "Not yet photographed" signal. Diagonal ivory-deep stripes on ivory, with a
 * small mono caption chip anchored at the bottom-left. Matches .placeholder
 * in the design system artifact — intentional, editorial, never a broken
 * image icon.
 */
export function NumberedPlaceholder({
  index,
  caption,
  aspect = "4/3",
  className,
}: NumberedPlaceholderProps) {
  return (
    <figure
      className={cn(
        "placeholder-pattern flex items-end rounded-sm p-3",
        aspectClass[aspect],
        className,
      )}
    >
      <figcaption className="caps flex items-center gap-2 rounded-xs border border-hair bg-white px-2 py-1 text-[9px] tracking-[0.14em] text-espresso-muted">
        <span>Fig. {formatIndex(index)}</span>
        <span aria-hidden className="h-3 w-px bg-hair" />
        <span className="normal-case tracking-[0.04em]">{caption}</span>
      </figcaption>
    </figure>
  );
}
