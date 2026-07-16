"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PropertyLite } from "@/lib/hr/scope";
import { SHELL } from "@/content/hr";

interface PropertySwitcherProps {
  properties: PropertyLite[];
  activePropertyId: string;
  className?: string;
}

/**
 * Sidebar / mobile-header control that lets org_admin and super_admin pin
 * the dashboard to a single property (or clear back to "all"). Persists the
 * pick server-side via POST /api/hr/property-context, then refreshes the
 * current route so every Server Component re-reads the new scope.
 *
 * Only rendered by HRShell when properties.length > 1 — single-property
 * pilots never see this control.
 */
export function PropertySwitcher({
  properties,
  activePropertyId,
  className,
}: PropertySwitcherProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(activePropertyId);
  const [pending, setPending] = React.useState(false);

  // Resync when the server-resolved scope changes for a reason other than
  // this control (e.g. the /hr/org table's "focus this property" action, or
  // a stale/foreign cookie server-side resolving back to "all").
  React.useEffect(() => {
    setValue(activePropertyId);
  }, [activePropertyId]);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    setPending(true);
    try {
      await fetch("/api/hr/property-context", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ property_id: next }),
      });
      router.refresh();
    } catch {
      // Best-effort — leave the select at the new value; a refresh will
      // reconcile it against the persisted cookie on next navigation.
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <label className="caps mb-1.5 block">{SHELL.propertySwitcher.label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={pending}
        className="h-9 w-full rounded-md border border-hair bg-white px-2.5 font-sans text-t-caption text-espresso transition-colors focus:border-ink focus:outline-none disabled:opacity-60"
      >
        <option value="all">{SHELL.propertySwitcher.all}</option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
