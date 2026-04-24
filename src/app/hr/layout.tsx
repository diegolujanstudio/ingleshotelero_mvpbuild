import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { LogOut } from "lucide-react";

/**
 * HR dashboard shell. Minimal nav, same editorial language as the marketing
 * site — so the experience feels continuous from sales → product.
 */
export const metadata = {
  title: "Panel RH",
  robots: { index: false, follow: false },
};

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <div className="flex items-center gap-8">
          <Logo showSub={false} href="/hr" />
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/hr" className="caps hover:text-ink">
              Resumen
            </Link>
            <Link href="/hr/employees" className="caps hover:text-ink">
              Empleados
            </Link>
            <Link href="/hr/reports" className="caps hover:text-ink">
              Reportes
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="caps hidden md:inline">Panel de Recursos Humanos</span>
          <Link
            href="/hr/login"
            className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted hover:text-ink"
          >
            <LogOut className="h-3 w-3" aria-hidden />
            Salir
          </Link>
        </div>
      </header>
      <HairlineRule className="mx-auto mt-6 max-w-shell px-6 md:px-12" />
      <main>{children}</main>
    </div>
  );
}
