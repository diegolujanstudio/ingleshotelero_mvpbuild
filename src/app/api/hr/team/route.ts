import { NextResponse } from "next/server";
import { getHRUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/server/api";
import { loadTeam } from "@/lib/hr/data";

/** GET /api/hr/team — list HR users in the caller's scope. */
export async function GET() {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const team = await loadTeam(user);
  return NextResponse.json({ team });
}
