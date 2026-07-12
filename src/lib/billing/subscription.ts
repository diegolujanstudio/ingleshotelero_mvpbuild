import "server-only";

/**
 * Subscription-state reader for soft enforcement. Fail-OPEN: a null org, no
 * Supabase, or a missing row all resolve to an active pilot that never lapses,
 * so a pilot hotel is never accidentally locked out. `lapsed` is only ever
 * true for a genuinely past_due/canceled PAID org — pilots never lapse.
 */
import { createServiceClient } from "@/lib/supabase/client-or-service";

export interface SubscriptionState {
  status: "active" | "past_due" | "canceled" | "archived";
  tier: "pilot" | "starter" | "professional" | "enterprise";
  plan: string | null;
  current_period_end: string | null;
  billing_email: string | null;
  /** (past_due | canceled) AND tier !== 'pilot' — drives the soft banner only. */
  lapsed: boolean;
}

const PILOT: SubscriptionState = {
  status: "active",
  tier: "pilot",
  plan: null,
  current_period_end: null,
  billing_email: null,
  lapsed: false,
};

export async function getSubscriptionState(
  organizationId: string | null,
): Promise<SubscriptionState> {
  if (!organizationId) return PILOT;
  const sb = createServiceClient();
  if (!sb) return PILOT;

  const { data } = await sb
    .from("organizations")
    .select("subscription_status, subscription_tier, plan, current_period_end, billing_email")
    .eq("id", organizationId)
    .maybeSingle();
  if (!data) return PILOT;

  const status = data.subscription_status;
  const tier = data.subscription_tier;
  const lapsed =
    tier !== "pilot" && (status === "past_due" || status === "canceled");

  return {
    status,
    tier,
    plan: data.plan ?? null,
    current_period_end: data.current_period_end ?? null,
    billing_email: data.billing_email ?? null,
    lapsed,
  };
}
