"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { EMPLOYEES, EMPLOYEE_STATUS_VALUES, type EmployeeStatus } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { CEFRLevel, RoleModule, Shift } from "@/lib/supabase/types";

export interface EmployeeFormValues {
  name: string;
  email: string;
  phone: string;
  hotel_role: RoleModule;
  department: string;
  shift: Shift | "";
  status: EmployeeStatus;
  whatsapp_opted_in: boolean;
  current_level: CEFRLevel | "";
}

interface Props {
  initial: EmployeeFormValues;
  onChange: (values: EmployeeFormValues) => void;
  disabled?: boolean;
}

/**
 * Editable form for an employee's contact + work + preferences.
 * Controlled — caller wires it to PATCH /api/hr/employees/[id].
 */
export function ContactEditForm({ initial, onChange, disabled }: Props) {
  const [v, setV] = React.useState<EmployeeFormValues>(initial);

  function update<K extends keyof EmployeeFormValues>(
    key: K,
    value: EmployeeFormValues[K],
  ) {
    const next = { ...v, [key]: value };
    setV(next);
    onChange(next);
  }

  return (
    <div className="space-y-5">
      <Section title={EMPLOYEES.drawer.sectionContact}>
        <Input
          label={EMPLOYEES.drawer.name}
          value={v.name}
          onChange={(e) => update("name", e.target.value)}
          disabled={disabled}
        />
        <Input
          label={EMPLOYEES.drawer.email}
          type="email"
          value={v.email}
          onChange={(e) => update("email", e.target.value)}
          disabled={disabled}
        />
        <Input
          label={EMPLOYEES.drawer.phone}
          type="tel"
          value={v.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+52 998 000 0000"
          disabled={disabled}
        />
      </Section>

      <HairlineRule />

      <Section title={EMPLOYEES.drawer.sectionWork}>
        <Field label={EMPLOYEES.drawer.role}>
          <select
            value={v.hotel_role}
            onChange={(e) => update("hotel_role", e.target.value as RoleModule)}
            disabled={disabled}
            className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
          >
            {(Object.keys(ROLES) as RoleModule[]).map((r) => (
              <option key={r} value={r}>
                {ROLES[r].label_es}
              </option>
            ))}
          </select>
        </Field>
        <Input
          label={EMPLOYEES.drawer.department}
          value={v.department}
          onChange={(e) => update("department", e.target.value)}
          disabled={disabled}
        />
        <Field label={EMPLOYEES.drawer.shift}>
          <select
            value={v.shift}
            onChange={(e) => update("shift", e.target.value as Shift)}
            disabled={disabled}
            className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
          >
            <option value="">—</option>
            <option value="morning">{EMPLOYEES.shift.morning}</option>
            <option value="afternoon">{EMPLOYEES.shift.afternoon}</option>
            <option value="night">{EMPLOYEES.shift.night}</option>
          </select>
        </Field>
        <Field label={EMPLOYEES.drawer.status}>
          <select
            value={v.status}
            onChange={(e) => update("status", e.target.value as EmployeeStatus)}
            disabled={disabled}
            className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
          >
            {EMPLOYEE_STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {EMPLOYEES.status[s]}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <HairlineRule />

      <Section title={EMPLOYEES.drawer.sectionPrefs}>
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={v.whatsapp_opted_in}
            onChange={(e) => update("whatsapp_opted_in", e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded-xs border-hair accent-ink"
          />
          <span className="font-sans text-t-body text-espresso">
            {EMPLOYEES.drawer.whatsappOpt}
          </span>
        </label>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="caps mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="caps mb-2 block">{label}</label>
      {children}
    </div>
  );
}
