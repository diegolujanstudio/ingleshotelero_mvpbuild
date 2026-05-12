import { NextResponse } from "next/server";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { toCsv } from "@/lib/masteros/csv";
import { GET as crmGet } from "../route";

export const dynamic = "force-dynamic";

interface CrmOrgRow {
  id: string;
  name: string;
  subscription_tier: string;
  status: string;
  n_properties: number;
  n_employees: number;
  last_login_at: string | null;
  billing_email: string | null;
  notes: string;
}

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export async function GET() {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  // Re-use the JSON CRM endpoint so the shape stays in lockstep.
  const res = await crmGet();
  const json = (await res.json()) as { orgs?: CrmOrgRow[] };
  const rows = json.orgs ?? [];

  const csv = toCsv(rows, [
    { key: "id", header: "org_id" },
    { key: "name", header: "org_name" },
    { key: "subscription_tier", header: "plan" },
    { key: "status", header: "status" },
    { key: "n_properties", header: "n_properties" },
    { key: "n_employees", header: "n_employees" },
    { key: "last_login_at", header: "last_login" },
    { key: "billing_email", header: "billing_email" },
    { key: "notes", header: "notes" },
  ]);

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="crm-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
