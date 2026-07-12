import { requireHRUser } from "@/lib/hr/auth";
import { HRShell } from "@/components/hr/Shell";
import { SubscriptionBanner } from "@/components/hr/SubscriptionBanner";
import { getSubscriptionState } from "@/lib/billing/subscription";
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
  return (
    <HRShell email={user.email} role={user.role}>
      {subscription.lapsed && <SubscriptionBanner state={subscription} />}
      {children}
    </HRShell>
  );
}
