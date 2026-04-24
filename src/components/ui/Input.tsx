import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/**
 * Boxed input — white surface, hairline border, 10px radius, ink on focus.
 * Matches .input in the design system artifact.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="caps mb-2 block">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-11 w-full rounded-md border border-hair bg-white px-4",
            "font-sans text-t-body text-espresso",
            "placeholder:text-espresso-muted",
            "transition-colors duration-200 ease-editorial",
            "focus:border-ink focus:outline-none focus-visible:border-ink",
            error && "border-error focus:border-error",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-2 font-sans text-t-caption text-error">{error}</p>
        ) : hint ? (
          <p className="caps mt-2">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
