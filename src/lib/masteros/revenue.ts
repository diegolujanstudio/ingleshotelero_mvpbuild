import "server-only";
import { createServiceClient } from "@/lib/supabase/client-or-service";

/**
 * Revenue & pipeline snapshot from data we already hold:
 *   • MRR/ARR estimate from organizations.subscription_tier × the
 *     published /precios price points (exact once Stripe is connected —
 *     STRIPE_SECRET_KEY pending; same honest pattern as the AI keys).
 *   • Sales funnel from leads.status (new → contacted → qualified →
 *     closed), with conversion.
 */

const TIER_MRR: Record<string, number> = {
  pilot: 0,
  starter: 150,
  professional: 300,
  enterprise: 500,
};

export interface RevenueSnapshot {
  has_data: boolean;
  mrr_estimate: number;
  arr_estimate: number;
  active_customers: number;
  at_risk_revenue: number; // MRR in past_due/canceled
  by_tier: { tier: string; count: number; mrr: number }[];
  by_status: { status: string; count: number }[];
  funnel: { stage: string; count: number }[];
  lead_conversion_pct: number | null; // closed / total non-spam
}

const EMPTY: RevenueSnapshot = {
  has_data: false,
  mrr_estimate: 0,
  arr_estimate: 0,
  active_customers: 0,
  at_risk_revenue: 0,
  by_tier: [],
  by_status: [],
  funnel: [],
  lead_conversion_pct: null,
};

export async function getRevenue(): Promise<RevenueSnapshot> {
  const sb = createServiceClient();
  if (!sb) return EMPTY;
  try {
    const [orgsRes, leadsRes] = await Promise.all([
      sb
        .from("organizations")
        .select("subscription_tier, subscription_status"),
      sb.from("leads").select("status"),
    ]);
    const orgs =
      (orgsRes.data as
        | { subscription_tier: string; subscription_status: string }[]
        | null) ?? [];
    const leads =
      (leadsRes.data as { status: string }[] | null) ?? [];

    if (orgs.length === 0 && leads.length === 0) return EMPTY;

    let mrr = 0;
    let atRisk = 0;
    let active = 0;
    const tierAgg = new Map<string, { count: number; mrr: number }>();
    const statusAgg = new Map<string, number>();
    for (const o of orgs) {
      const price = TIER_MRR[o.subscription_tier] ?? 0;
      const t = tierAgg.get(o.subscription_tier) ?? { count: 0, mrr: 0 };
      t.count++;
      t.mrr += price;
      tierAgg.set(o.subscription_tier, t);
      statusAgg.set(
        o.subscription_status,
        (statusAgg.get(o.subscription_status) ?? 0) + 1,
      );
      if (o.subscription_status === "active") {
        mrr += price;
        if (price > 0) active++;
      } else if (
        o.subscription_status === "past_due" ||
        o.subscription_status === "canceled"
      ) {
        atRisk += price;
      }
    }

    // Funnel from leads.status.
    const order = ["new", "contacted", "qualified", "closed"];
    const leadStatus = new Map<string, number>();
    for (const l of leads)
      leadStatus.set(l.status, (leadStatus.get(l.status) ?? 0) + 1);
    const nonSpam = leads.filter((l) => l.status !== "spam").length;
    const closed = leadStatus.get("closed") ?? 0;

    return {
      has_data: true,
      mrr_estimate: mrr,
      arr_estimate: mrr * 12,
      active_customers: active,
      at_risk_revenue: atRisk,
      by_tier: Array.from(tierAgg.entries())
        .map(([tier, v]) => ({ tier, count: v.count, mrr: v.mrr }))
        .sort((a, b) => b.mrr - a.mrr),
      by_status: Array.from(statusAgg.entries()).map(([status, count]) => ({
        status,
        count,
      })),
      funnel: order.map((stage) => ({
        stage,
        count: leadStatus.get(stage) ?? 0,
      })),
      lead_conversion_pct: nonSpam
        ? Math.round((closed / nonSpam) * 100)
        : null,
    };
  } catch {
    return EMPTY;
  }
}
