import { requireHRUser } from "@/lib/hr/auth";
import { HRShell } from "@/components/hr/Shell";
import { SubscriptionBanner } from "@/components/hr/SubscriptionBanner";
import { getSubscriptionState } from "@/lib/billing/subscription";
import { resolveActiveScope } from "@/lib/hr/scope";
import { isOrgLevel } from "@/lib/auth/roles";
import { META } from "@/content/hr";

export const metadata = {
  title: META.title,
  description: META.description,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function HRAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireHRUser();
  // Soft billing enforcement: a lapsed PAID subscription shows an informational
  // banner but never gates the dashboard (pilots never lapse — fail-open).
  const subscription = await getSubscriptionState(user.organization_id ?? null);
  // Chain/org scope: which properties this user can switch between, and
  // which one is currently active (cookie-backed). Single-property pilots
  // get properties.length === 1, so the switcher + org nav stay hidden.
  const scope = await resolveActiveScope(user);
  const showOrg = isOrgLevel(user.role) && scope.all.length > 1;
  return (
    <HRShell
      email={user.email}
      role={user.role}
      properties={scope.all}
      activePropertyId={scope.activeId}
      showOrg={showOrg}
    >
      {subscription.lapsed && <SubscriptionBanner state={subscription} />}
      {children}
    </HRShell>
  );
}
