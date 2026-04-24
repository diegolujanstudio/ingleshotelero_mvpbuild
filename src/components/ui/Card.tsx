import * as React from "react";
import { cn } from "@/lib/utils";

type CardSurface = "white" | "ivory-soft";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: CardSurface;
}

/**
 * Editorial card. 10px radius, hairline border, white or ivory-soft bg.
 * No drop shadow — layering is always via color only (principle 02).
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ surface = "white", className, children, ...props }, ref) => {
    const surfaceClass = surface === "white" ? "bg-white" : "bg-ivory-soft";
    return (
      <div
        ref={ref}
        className={cn("rounded-md border border-hair p-6", surfaceClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

/**
 * Optional header strip — ivory-soft, hairline underline, small type.
 * Matches .comp-header in the design system artifact.
 */
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "-mx-6 -mt-6 mb-6 flex items-baseline justify-between border-b border-hair bg-ivory-soft px-5 py-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardEyebrow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("caps", className)} {...props}>
      {children}
    </span>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-serif text-t-h3 font-medium text-espresso",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
