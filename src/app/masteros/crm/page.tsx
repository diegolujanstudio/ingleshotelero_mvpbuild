import { requireSuperAdmin } from "@/lib/masteros/auth";
import { GET as crmGet } from "@/app/api/masteros/crm/route";
import { CrmClient } from "./CrmClient";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  await requireSuperAdmin();

  // Re-use the API to keep one source of truth for the join + status rollup.
  const res = await crmGet();
  const json = (await res.json()) as { orgs?: unknown[]; demo?: boolean };
  return (
    <CrmClient
      initial={(json.orgs as never[]) ?? []}
      demo={Boolean(json.demo)}
    />
  );
}
