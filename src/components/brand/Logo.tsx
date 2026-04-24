import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  showSub?: boolean;
}

/**
 * Wordmark — "Inglés Hotelero" set in New Spirit 500. The second word is
 * wrapped in <em>, which the global stylesheet renders as non-italic,
 * medium-weight, ink-colored text — the brand's signature editorial touch.
 */
export function Logo({ className, href = "/", showSub = true }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-baseline gap-3", className)}
      aria-label="Inglés Hotelero — inicio"
    >
      <span className="font-serif text-[1.25rem] font-medium leading-none tracking-[-0.02em] text-espresso md:text-[1.5rem]">
        Inglés <em>Hotelero</em>
      </span>
      {showSub && (
        <>
          <span className="h-px w-6 bg-hair" aria-hidden />
          <span className="hidden font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em] text-espresso-muted md:inline">
            est. 2026 · MX
          </span>
        </>
      )}
    </Link>
  );
}
