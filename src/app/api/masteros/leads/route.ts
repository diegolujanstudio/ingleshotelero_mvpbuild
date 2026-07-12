import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import {
  listLeads,
  type LeadFormName,
  type LeadRow,
  type LeadStatus,
} from "@/lib/server/leads";
import { demoLeads, demoCounts } from "@/lib/masteros/leads-demo";

export const dynamic = "force-dynamic";

// 'colocacion' is a real lead form (high-intent placement-exam requests). It
// must be its own tab, otherwise those rows fall between the exact-match tabs
// (they are not "other") and never appear in the list or export.
const FormEnum = z.enum(["pilot", "soporte", "colocacion", "other"]);
const StatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
]);

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export interface LeadCounts {
  all: number;
  pilot: number;
  soporte: number;
  colocacion: number;
  other: number;
}

export interface LeadsListResponse {
  rows: LeadRow[];
  total: number;
  counts: LeadCounts;
  demo?: boolean;
}

/**
 * GET /api/masteros/leads
 *
 * Query:
 *   tab     = 'all' | 'pilot' | 'soporte' | 'colocacion' | 'other' (default 'all')
 *   status  = 'all' | LeadStatus                       (default 'all')
 *   search  = free-text                                (optional)
 *   limit   = 1..200                                   (default 50)
 *   offset  = >= 0                                     (default 0)
 *
 * Response:
 *   { rows, total, counts: { all, pilot, soporte, other }, demo? }
 *
 * `counts` are global per-form (NOT filtered by status/search) so the tab
 * row reads as "47 total · 31 piloto · ...". The table `total` reflects the
 * applied filters and drives pagination.
 */
export async function GET(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const url = new URL(req.url);
  const tabRaw = url.searchParams.get("tab") ?? "all";
  const statusRaw = url.searchParams.get("status") ?? "all";
  const search = url.searchParams.get("search") ?? "";
  const limit = clamp(numberOr(url.searchParams.get("limit"), 50), 1, 200);
  const offset = Math.max(0, numberOr(url.searchParams.get("offset"), 0));

  const tab: "all" | LeadFormName =
    tabRaw === "all" || FormEnum.safeParse(tabRaw).success
      ? (tabRaw as "all" | LeadFormName)
      : "all";
  const status: "all" | LeadStatus =
    statusRaw === "all" || StatusEnum.safeParse(statusRaw).success
      ? (statusRaw as "all" | LeadStatus)
      : "all";

  const sb = createServiceClient();
  if (!sb) {
    const all = demoLeads();
    const filtered = applyFilters(all, { tab, status, search });
    const sliced = filtered.slice(offset, offset + limit);
    return NextResponse.json<LeadsListResponse>({
      rows: sliced,
      total: filtered.length,
      counts: { colocacion: 0, ...demoCounts(all) },
      demo: true,
    });
  }

  try {
    const [list, counts] = await Promise.all([
      listLeads({
        formName: tab === "all" ? undefined : tab,
        status: status === "all" ? undefined : status,
        search: search.trim() ? search.trim() : undefined,
        limit,
        offset,
      }),
      gatherCounts(sb),
    ]);
    return NextResponse.json<LeadsListResponse>({
      rows: list.rows,
      total: list.total,
      counts,
    });
  } catch (e) {
    // Migration not applied yet OR DB blip → degrade gracefully.
    const all = demoLeads();
    const filtered = applyFilters(all, { tab, status, search });
    const sliced = filtered.slice(offset, offset + limit);
    void e;
    return NextResponse.json<LeadsListResponse>({
      rows: sliced,
      total: filtered.length,
      counts: { colocacion: 0, ...demoCounts(all) },
      demo: true,
    });
  }
}

async function gatherCounts(
  sb: NonNullable<ReturnType<typeof createServiceClient>>,
): Promise<LeadCounts> {
  // Exact head-counts, NOT a fetch-and-tally. A bare select caps at Supabase's
  // 1000-row limit, so the tab badges would silently freeze at 1000 once the
  // table grows — right when pagination starts to matter. head:true returns no
  // rows, just the count, at any scale.
  const countFor = async (form?: LeadFormName): Promise<number> => {
    const base = (
      sb as unknown as {
        from: (t: string) => {
          select: (
            c: string,
            o: { count: "exact"; head: true },
          ) => {
            eq: (
              col: string,
              val: string,
            ) => Promise<{ count: number | null; error: { message: string } | null }>;
          } & Promise<{ count: number | null; error: { message: string } | null }>;
        };
      }
    )
      .from("leads")
      .select("id", { count: "exact", head: true });
    const { count, error } = await (form ? base.eq("form_name", form) : base);
    if (error) throw error;
    return count ?? 0;
  };

  const [all, pilot, soporte, colocacion] = await Promise.all([
    countFor(),
    countFor("pilot"),
    countFor("soporte"),
    countFor("colocacion"),
  ]);
  // form_name is constrained to the four known values, so "other" is the
  // remainder — no separate query needed.
  return {
    all,
    pilot,
    soporte,
    colocacion,
    other: Math.max(0, all - pilot - soporte - colocacion),
  };
}

function applyFilters(
  rows: LeadRow[],
  { tab, status, search }: { tab: "all" | LeadFormName; status: "all" | LeadStatus; search: string },
): LeadRow[] {
  const q = search.trim().toLowerCase();
  return rows.filter((r) => {
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

function numberOr(v: string | null, d: number): number {
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) ? n : d;
}
function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
