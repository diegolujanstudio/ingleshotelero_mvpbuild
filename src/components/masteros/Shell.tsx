"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { SHELL } from "@/content/masteros";
import {
  LayoutDashboard,
  Database,
  Users,
  Map as MapIcon,
  GitBranch,
  ShieldCheck,
  Activity,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

interface ShellProps {
  email: string;
  children: React.ReactNode;
}

export function MasterosShell({ email, children }: ShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/masteros" ? pathname === href : pathname.startsWith(href);

  const main: NavItem[] = [
    { label: SHELL.nav.dashboard, href: "/masteros", icon: LayoutDashboard, active: isActive("/masteros") && pathname === "/masteros" },
    { label: SHELL.nav.modules, href: "/masteros/modules", icon: Database, active: pathname.startsWith("/masteros/modules") },
    { label: SHELL.nav.crm, href: "/masteros/crm", icon: Users, active: pathname.startsWith("/masteros/crm") },
  ];
  const soon: Array<{ label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { label: SHELL.nav.journey, icon: MapIcon },
    { label: SHELL.nav.cohorts, icon: GitBranch },
    { label: SHELL.nav.audit, icon: ShieldCheck },
    { label: SHELL.nav.system, icon: Activity },
  ];

  return (
    <div className="flex min-h-screen bg-ivory text-espresso">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-hair bg-ivory-soft md:flex">
        <div className="px-5 pb-4 pt-6">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
            {SHELL.brand}
          </p>
          <p className="mt-1 font-serif text-t-h3 font-medium text-espresso">
            {SHELL.product}
          </p>
        </div>
        <HairlineRule />
        <nav className="flex flex-1 flex-col gap-px px-2 py-3">
          <p className="px-3 pb-2 pt-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
            {SHELL.groupMain}
          </p>
          {main.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-sm px-3 py-2 font-sans text-t-label transition-colors",
                  item.active
                    ? "bg-ink-tint text-ink-deep"
                    : "text-espresso-soft hover:bg-ivory-deep hover:text-espresso",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <div className="mt-4">
            <HairlineRule />
          </div>
          <p className="px-3 pb-2 pt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
            {SHELL.groupSoon}
          </p>
          {soon.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-2.5 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-muted/70"
                aria-disabled
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
        <HairlineRule />
        <div className="px-4 py-3">
          <p className="truncate font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
            {email}
          </p>
          <Link
            href="/hr/login"
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:text-ink"
          >
            <LogOut className="h-3 w-3" aria-hidden />
            {SHELL.signOut}
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
