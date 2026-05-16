import { requireSuperAdmin } from "@/lib/masteros/auth";
import { ImportClient } from "./ImportClient";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  await requireSuperAdmin();
  return <ImportClient />;
}
