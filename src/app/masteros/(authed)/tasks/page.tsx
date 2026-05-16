import { requireSuperAdmin } from "@/lib/masteros/auth";
import { TasksClient } from "./TasksClient";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  await requireSuperAdmin();
  return <TasksClient />;
}
