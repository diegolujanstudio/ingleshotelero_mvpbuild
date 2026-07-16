import { requireHRUser } from "@/lib/hr/auth";
import { loadEmployees } from "@/lib/hr/data";
import { resolveActiveScope } from "@/lib/hr/scope";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { EMPLOYEES, COMMON } from "@/content/hr";
import { EmployeesClient } from "./EmployeesClient";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const user = await requireHRUser();
  const { propertyIds } = await resolveActiveScope(user);
  const employees = await loadEmployees(user, propertyIds);
  const isDemo = employees.length > 0 && employees[0].is_demo;

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={EMPLOYEES.eyebrow}
        title={
          <>
            {EMPLOYEES.headline.before}
            <em>{EMPLOYEES.headline.em}</em>
            {EMPLOYEES.headline.after}
          </>
        }
        sub={EMPLOYEES.sub}
        actions={
          isDemo && (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
              {COMMON.demoBadge}
            </span>
          )
        }
      />

      <div className="mt-6">
        <EmployeesClient initial={employees} />
      </div>
    </section>
  );
}
