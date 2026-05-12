import { requireSuperAdmin } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import {
  listLeads,
  type LeadFormName,
  type LeadRow,
  type LeadStatus,
} from "@/lib/server/leads";
import { demoLeads, demoCounts } from "@/lib/masteros/leads-demo";
import { LeadsClient, type LeadsTab, type LeadsStatusFilter } from "./LeadsClient";

export const dynamic = "force-dynamic";

const FORM_TABS: ReadonlyArray<LeadsTab> = ["all", "pilot", "soporte", "other"];
const STATUS_FILTERS: ReadonlyArray<LeadsStatusFilter> = [
  "all",
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { tab?: string; status?: string; search?: string };
}) {
  await requireSuperAdmin();

  const tab: LeadsTab = (FORM_TABS as ReadonlyArray<string>).includes(
    searchParams.tab ?? "all",
  )
    ? (searchParams.tab as LeadsTab)
    : "all";
  const status: LeadsStatusFilter = (
    STATUS_FILTERS as ReadonlyArray<string>
  ).includes(searchParams.status ?? "all")
    ? (searchParams.status as LeadsStatusFilter)
    : "all";
  const search = (searchParams.search ?? "").slice(0, 200);

  const sb = createServiceClient();
  let rows: LeadRow[] = [];
  let total = 0;
  let counts = { all: 0, pilot: 0, soporte: 0, other: 0 };
  let demo = false;

  if (!sb) {
    const all = demoLeads();
    counts = demoCounts(all);
    rows = filterDemo(all, tab, status, search);
    total = rows.length;
    demo = true;
  } else {
    try {
      const [list, c] = await Promise.all([
        listLeads({
          formName: tab === "all" ? undefined : (tab as LeadFormName),
          status: status === "all" ? undefined : (status as LeadStatus),
          search: search.trim() ? search.trim() : undefined,
          limit: 50,
          offset: 0,
        }),
        gatherCountsServer(sb),
      ]);
      rows = list.rows;
      total = list.total;
      counts = c;
      // If the table exists but is empty AND there are zero counts, show demo
      // rows so the surface looks alive in pitches (matches /masteros/modules
      // and /masteros/crm posture).
      if (rows.length === 0 && counts.all === 0) {
        const all = demoLeads();
        counts = demoCounts(all);
        rows = filterDemo(all, tab, status, search);
        total = rows.length;
        demo = true;
      }
    } catch {
      const all = demoLeads();
      counts = demoCounts(all);
      rows = filterDemo(all, tab, status, search);
      total = rows.length;
      demo = true;
    }
  }

  return (
    <LeadsClient
      initialRows={rows}
      initialTotal={total}
      counts={counts}
      tab={tab}
      status={status}
      search={search}
      demo={demo}
    />
  );
}

async function gatherCountsServer(
  sb: NonNullable<ReturnType<typeof createServiceClient>>,
) {
  const { data, error } = await (
    sb as unknown as { from: (t: string) => { select: (c: string) => Promise<{ data: Array<{ form_name: LeadFormName }> | null; error: { message: string } | null }> } }
  ).from("leads").select("form_name");
  if (error) throw error;
  const c = { all: 0, pilot: 0, soporte: 0, other: 0 };
  for (const r of (data as Array<{ form_name: LeadFormName }> | null) ?? []) {
    c.all++;
    if (r.form_name === "pilot") c.pilot++;
    else if (r.form_name === "soporte") c.soporte++;
    else c.other++;
  }
  return c;
}

function filterDemo(
  rows: LeadRow[],
  tab: LeadsTab,
  status: LeadsStatusFilter,
  search: string,
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
