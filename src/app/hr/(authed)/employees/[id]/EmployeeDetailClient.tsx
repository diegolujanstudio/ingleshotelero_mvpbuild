"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditDrawer } from "@/components/hr/EditDrawer";
import {
  ContactEditForm,
  type EmployeeFormValues,
} from "@/components/hr/ContactEditForm";
import { EMPLOYEES, EMPLOYEE_DETAIL } from "@/content/hr";
import type { HREmployeeView } from "@/lib/hr/demo-bridge";

interface Props {
  employee: HREmployeeView;
}

export function EmployeeDetailClient({ employee }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<EmployeeFormValues>({
    name: employee.name,
    email: employee.email ?? "",
    phone: employee.phone ?? "",
    hotel_role: employee.hotel_role,
    department: employee.department ?? "",
    shift: (employee.shift ?? "") as EmployeeFormValues["shift"],
    status: employee.status,
    whatsapp_opted_in: employee.whatsapp_opted_in,
    current_level: (employee.current_level ?? "") as EmployeeFormValues["current_level"],
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/hr/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        setError(EMPLOYEES.drawer.saveError);
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError(EMPLOYEES.drawer.saveError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <Pencil className="h-3.5 w-3.5" aria-hidden />
        {EMPLOYEE_DETAIL.edit}
      </Button>
      <EditDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={EMPLOYEES.drawer.titleEdit}
        eyebrow={employee.name.toUpperCase()}
        footer={
          <>
            {error && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
                {error}
              </span>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
              {EMPLOYEES.drawer.cancel}
            </Button>
            <Button variant="primary" onClick={save} disabled={saving}>
              {saving ? EMPLOYEES.drawer.saving : EMPLOYEES.drawer.save}
            </Button>
          </>
        }
      >
        <ContactEditForm initial={draft} onChange={setDraft} disabled={saving} />
      </EditDrawer>
    </>
  );
}
