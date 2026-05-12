import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { toCsv } from "@/lib/masteros/csv";
import {
  listLeads,
  type LeadFormName,
  type LeadRow,
  type LeadStatus,
} from "@/lib/server/leads";
import { demoLeads } from "@/lib/masteros/leads-demo";

export const dynamic = "force-dynamic";

const FormEnum = z.enum(["pilot", "soporte", "other"]);
const StatusEnum = z.enum(["new", "contacted", "qualified", "closed", "spam"]);

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

/**
 * GET /api/masteros/leads/export?tab=pilot&status=new
 *
 * Streams a UTF-8 CSV of every lead matching the filters. Same filters as the
 * list route. Filename embeds today's date and the tab.
 */
export async function GET(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const url = new URL(req.url);
  const tabRaw = url.searchParams.get("tab") ?? "all";
  const statusRaw = url.searchParams.get("status") ?? "all";
  const search = url.searchParams.get("search") ?? "";

  const tab: "all" | LeadFormName =
    tabRaw === "all" || FormEnum.safeParse(tabRaw).success
      ? (tabRaw as "all" | LeadFormName)
      : "all";
  const status: "all" | LeadStatus =
    statusRaw === "all" || StatusEnum.safeParse(statusRaw).success
      ? (statusRaw as "all" | LeadStatus)
      : "all";

  let rows: LeadRow[] = [];
  const sb = createServiceClient();
  if (!sb) {
    rows = demoLeads();
  } else {
    try {
      const res = await listLeads({
        formName: tab === "all" ? undefined : tab,
        status: status === "all" ? undefined : status,
        search: search.trim() ? search.trim() : undefined,
        limit: 200,
        offset: 0,
      });
      rows = res.rows;
      // Page through the rest.
      let offset = res.rows.length;
      while (offset < res.total && offset < 5000) {
        const next = await listLeads({
          formName: tab === "all" ? undefined : tab,
          status: status === "all" ? undefined : status,
          search: search.trim() ? search.trim() : undefined,
          limit: 200,
          offset,
        });
        if (next.rows.length === 0) break;
        rows.push(...next.rows);
        offset += next.rows.length;
      }
    } catch {
      rows = demoLeads();
    }
  }

  // Apply filters in-memory for the demo branch (the listLeads branch already
  // filtered server-side).
  if (!sb) {
    const q = search.trim().toLowerCase();
    rows = rows.filter((r) => {
      if (tab !== "all" && r.form_name !== tab) return false;
      if (status !== "all" && r.status !== status) return false;
      if (q) {
        const hay = [r.name, r.email, r.company, r.city, r.message]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  const csv = toCsv(rows, [
    { key: "created_at", header: "created_at" },
    { key: "form_name", header: "form_name" },
    { key: "status", header: "status" },
    { key: "name", header: "name" },
    { key: "email", header: "email" },
    { key: "phone", header: "phone" },
    { key: "company", header: "company" },
    { key: "hotel_count", header: "hotel_count" },
    { key: "city", header: "city" },
    { key: "role", header: "role" },
    { key: "message", header: "message" },
    { key: "source_url", header: "source_url" },
    { key: "notes", header: "notes" },
  ]);

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="leads-${tab}-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
