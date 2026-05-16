import { requireSuperAdmin } from "@/lib/masteros/auth";
import { ResourcesClient } from "./ResourcesClient";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  await requireSuperAdmin();
  return <ResourcesClient />;
}
