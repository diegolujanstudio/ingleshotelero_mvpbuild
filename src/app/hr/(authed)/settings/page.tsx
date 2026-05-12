import { requireHRUser } from "@/lib/hr/auth";
import { loadOrgInfo, loadPropertyInfo } from "@/lib/hr/data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { SETTINGS } from "@/content/hr";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireHRUser();
  const [org, property] = await Promise.all([loadOrgInfo(user), loadPropertyInfo(user)]);

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={SETTINGS.eyebrow}
        title={
          <>
            {SETTINGS.headline.before}
            <em>{SETTINGS.headline.em}</em>
            {SETTINGS.headline.after}
          </>
        }
        sub={SETTINGS.sub}
      />

      <div className="mt-6">
        <SettingsClient org={org} property={property} canEditOrg={user.role === "super_admin" || user.role === "org_admin"} />
      </div>
    </section>
  );
}
