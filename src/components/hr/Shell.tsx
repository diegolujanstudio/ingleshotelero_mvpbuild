"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { SHELL } from "@/content/hr";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  FileBarChart,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  match: (pathname: string) => boolean;
}

interface ShellProps {
  email: string;
  children: React.ReactNode;
}

/**
 * HR shell — left sidebar nav, ivory-soft surface, mono caps labels.
 * Visually identical density and rhythm to MasterosShell.
 */
export function HRShell({ email, children }: ShellProps) {
  const pathname = usePathname();

  const ops: NavItem[] = [
    {
      label: SHELL.nav.overview,
      href: "/hr",
      icon: LayoutDashboard,
      match: (p) => p === "/hr",
    },
    {
      label: SHELL.nav.employees,
      href: "/hr/employees",
      icon: Users,
      match: (p) => p.startsWith("/hr/employees"),
    },
    {
      label: SHELL.nav.cohorts,
      href: "/hr/cohorts",
      icon: GitBranch,
      match: (p) => p.startsWith("/hr/cohorts"),
    },
    {
      label: SHELL.nav.reports,
      href: "/hr/reports",
      icon: FileBarChart,
      match: (p) => p.startsWith("/hr/reports"),
    },
  ];

  const admin: NavItem[] = [
    {
      label: SHELL.nav.team,
      href: "/hr/team",
      icon: UserCog,
      match: (p) => p.startsWith("/hr/team"),
    },
    {
      label: SHELL.nav.settings,
      href: "/hr/settings",
      icon: Settings,
      match: (p) => p.startsWith("/hr/settings"),
    },
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
          <SectionLabel>{SHELL.groupOps}</SectionLabel>
          {ops.map((item) => (
            <NavLink key={item.href} item={item} active={item.match(pathname)} />
          ))}

          <div className="mt-4">
            <HairlineRule />
          </div>
          <SectionLabel className="pt-3">{SHELL.groupAdmin}</SectionLabel>
          {admin.map((item) => (
            <NavLink key={item.href} item={item} active={item.match(pathname)} />
          ))}
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

      {/* Mobile top nav — compact */}
      <div className="md:hidden">
        <header className="border-b border-hair bg-ivory-soft px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
                {SHELL.brand}
              </p>
              <p className="font-serif text-t-h3 font-medium">{SHELL.product}</p>
            </div>
            <Link
              href="/hr/login"
              className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <nav className="mt-3 flex gap-3 overflow-x-auto">
            {[...ops, ...admin].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em]",
                  item.match(pathname)
                    ? "text-ink"
                    : "text-espresso-muted hover:text-espresso",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
      </div>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-sm px-3 py-2 transition-colors",
        active
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
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "px-3 pb-2 pt-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
