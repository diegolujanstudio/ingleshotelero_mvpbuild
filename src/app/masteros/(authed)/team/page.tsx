import { requireSuperAdmin } from "@/lib/masteros/auth";
import { TeamClient } from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const me = await requireSuperAdmin();
  return <TeamClient meId={me.id} />;
}
