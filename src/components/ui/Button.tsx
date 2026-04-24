import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "ghost" | "text";
type ButtonSize = "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

// Pill buttons by default. `text` variant drops horizontal padding + radius to
// read as an inline link with accent color.
const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-[0.01em] transition-colors duration-200 ease-editorial disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
  md: "h-10 px-5 text-t-label",
  lg: "h-12 px-6 text-t-body-lg",
};

// Primary = espresso (principle: texto y acción son la misma voz).
// Accent  = ink   (una sola nota de color — use when the CTA is "the moment").
// Ghost   = hair outline on ivory.
// Text    = inline anchor-style with ink.
const variants: Record<ButtonVariant, string> = {
  primary:
    "rounded-pill bg-espresso text-ivory hover:bg-espresso-soft focus-visible:bg-espresso-soft",
  accent:
    "rounded-pill bg-ink text-white hover:bg-ink-deep focus-visible:bg-ink-deep",
  ghost:
    "rounded-pill border border-hair bg-transparent text-espresso hover:border-espresso/40 hover:bg-ivory-soft",
  text:
    "!h-auto !px-0 rounded-none bg-transparent text-ink hover:text-ink-deep underline-offset-4 hover:underline",
};

export interface ButtonProps
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps
  extends ButtonBaseProps,
    Omit<React.ComponentProps<typeof Link>, keyof ButtonBaseProps> {}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
