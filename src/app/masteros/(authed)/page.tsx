import { requireSuperAdmin } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { gatherMetrics, demoMetrics } from "@/lib/masteros/metrics";
import { DashboardClient } from "./DashboardClient";
import { CommandCenter } from "./CommandCenter";

export const dynamic = "force-dynamic";

/**
 * Live Metrics — landing page of /masteros.
 *
 * Server-side initial fetch via the SERVICE client (super_admin reads all
 * orgs). The client component re-fetches via /api/masteros/metrics on
 * refresh, which is rate-limited by a 60s in-memory cache.
 */
export default async function MasterosDashboardPage() {
  await requireSuperAdmin();

  const sb = createServiceClient();
  let initial;
  let demo = false;
  if (!sb) {
    initial = demoMetrics();
    demo = true;
  } else {
    try {
      initial = await gatherMetrics(sb);
    } catch {
      initial = demoMetrics();
      demo = true;
    }
  }

  return (
    <>
      <CommandCenter />
      <DashboardClient initial={initial} initialDemo={demo} />
    </>
  );
}
