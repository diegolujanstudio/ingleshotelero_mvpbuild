import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

/**
 * Wordmark — "Inglés Hotelero" set in New Spirit 500. The second word is
 * wrapped in <em>, which the global stylesheet renders as non-italic,
 * medium-weight, ink-colored text — the brand's signature editorial touch.
 */
/**
 * The old "est. 2026 · MX" sub-line was removed at Diego's request: it added
 * reading load without meaning anything to a learner or a buyer.
 */
export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-baseline", className)}
      aria-label="Inglés Hotelero — inicio"
    >
      <span className="font-serif text-[1.25rem] font-medium leading-none tracking-[-0.02em] text-espresso md:text-[1.5rem]">
        Inglés <em>Hotelero</em>
      </span>
    </Link>
  );
}
