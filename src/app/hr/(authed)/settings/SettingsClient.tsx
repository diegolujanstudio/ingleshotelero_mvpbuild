"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { SETTINGS } from "@/content/hr";
import type { HROrgInfo, HRPropertyInfo } from "@/lib/hr/demo-bridge";

interface Props {
  org: HROrgInfo;
  property: HRPropertyInfo;
  canEditOrg: boolean;
}

export function SettingsClient({ org, property, canEditOrg }: Props) {
  const [tab, setTab] = React.useState<"org" | "property">("org");
  const [orgD, setOrgD] = React.useState(org);
  const [propD, setPropD] = React.useState(property);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setToast(null);
    try {
      const body =
        tab === "org"
          ? { org: { name: orgD.name, billing_email: orgD.billing_email } }
          : {
              property: {
                name: propD.name,
                city: propD.city,
                state: propD.state,
                country: propD.country,
                room_count: propD.room_count,
                timezone: propD.timezone,
              },
            };
      const res = await fetch("/api/hr/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setToast({ kind: "err", text: SETTINGS.error });
        return;
      }
      setToast({ kind: "ok", text: SETTINGS.saved });
    } catch {
      setToast({ kind: "err", text: SETTINGS.error });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1 border-b border-hair">
        <TabButton active={tab === "org"} onClick={() => setTab("org")}>
          {SETTINGS.tabs.org}
        </TabButton>
        <TabButton active={tab === "property"} onClick={() => setTab("property")}>
          {SETTINGS.tabs.property}
        </TabButton>
      </nav>

      {tab === "org" && (
        <div className="rounded-md border border-hair bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="caps">{SETTINGS.tabs.org}</p>
            {!canEditOrg && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
                {SETTINGS.readOnly}
              </span>
            )}
          </div>
          <div className="space-y-4">
            <Input
              label={SETTINGS.org.name}
              value={orgD.name}
              onChange={(e) => setOrgD({ ...orgD, name: e.target.value })}
              disabled={!canEditOrg}
            />
            <Input
              label={SETTINGS.org.billingEmail}
              type="email"
              value={orgD.billing_email ?? ""}
              onChange={(e) => setOrgD({ ...orgD, billing_email: e.target.value })}
              disabled={!canEditOrg}
            />
            <HairlineRule />
            <div className="grid gap-4 md:grid-cols-3">
              <ReadField label={SETTINGS.org.tier} value={orgD.subscription_tier} />
              <ReadField label={SETTINGS.org.status} value={orgD.subscription_status} />
              <ReadField label={SETTINGS.org.type} value={orgD.type === "chain" ? "Cadena" : "Independiente"} />
            </div>
          </div>
        </div>
      )}

      {tab === "property" && (
        <div className="rounded-md border border-hair bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="caps">{SETTINGS.tabs.property}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={SETTINGS.property.name}
              value={propD.name}
              onChange={(e) => setPropD({ ...propD, name: e.target.value })}
            />
            <Input
              label={SETTINGS.property.slug}
              value={propD.slug}
              disabled
              hint={SETTINGS.readOnly}
            />
            <Input
              label={SETTINGS.property.city}
              value={propD.city ?? ""}
              onChange={(e) => setPropD({ ...propD, city: e.target.value })}
            />
            <Input
              label={SETTINGS.property.state}
              value={propD.state ?? ""}
              onChange={(e) => setPropD({ ...propD, state: e.target.value })}
            />
            <Input
              label={SETTINGS.property.country}
              value={propD.country}
              onChange={(e) => setPropD({ ...propD, country: e.target.value })}
            />
            <Input
              label={SETTINGS.property.rooms}
              type="number"
              value={String(propD.room_count ?? "")}
              onChange={(e) =>
                setPropD({
                  ...propD,
                  room_count: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <Input
              label={SETTINGS.property.timezone}
              value={propD.timezone}
              onChange={(e) => setPropD({ ...propD, timezone: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        {toast && (
          <span
            className={
              "font-mono text-[0.625rem] uppercase tracking-[0.14em] " +
              (toast.kind === "ok" ? "text-success" : "text-error")
            }
          >
            {toast.text}
          </span>
        )}
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? SETTINGS.saving : SETTINGS.save}
        </Button>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] " +
        (active
          ? "border-b-2 border-ink text-ink"
          : "border-b-2 border-transparent text-espresso-muted hover:text-espresso")
      }
    >
      {children}
    </button>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="caps mb-2">{label}</p>
      <Badge tone="soft" className="capitalize">
        {value}
      </Badge>
    </div>
  );
}
