import { NextResponse } from "next/server";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { isStripeConfigured, verifyStripeSignature, mapStripeStatus } from "@/lib/billing/stripe";
import { logAudit } from "@/lib/server/audit";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook
 *
 * Handles invoice.paid + customer.subscription.updated/deleted. Verifies the
 * signature, dedupes on the Stripe event id, and reflects billing state onto
 * organizations. Inert (200 ok, no-op) when STRIPE_WEBHOOK_SECRET is unset.
 *
 * Never hard-locks a hotel — enforcement is a soft banner (SubscriptionBanner)
 * driven by getSubscriptionState(). This route only records state.
 */
export async function POST(req: Request) {
  const payload = await req.text(); // RAW body — required for signature verification.

  if (!isStripeConfigured()) {
    log.warn({}, "stripe.webhook.disabled — STRIPE_WEBHOOK_SECRET unset");
    return NextResponse.json({ ok: true, mode: "disabled" });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET as string;
  if (!verifyStripeSignature(payload, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  let event: {
    id: string;
    type: string;
    data: { object: Record<string, unknown> };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "no_db" });
  }
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, mode: "no_db" });

  // Idempotency: insert the event id; a duplicate (23505) is a replay.
  const { error: dupErr } = await sb
    .from("stripe_events")
    .insert({ id: event.id, type: event.type } as never);
  if (dupErr) {
    // Unique-violation → already processed. Anything else → surface for retry.
    if ((dupErr as { code?: string }).code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: "ledger_error" }, { status: 500 });
  }

  try {
    const obj = event.data.object;
    const customerId = String(obj.customer ?? "");

    switch (event.type) {
      case "invoice.paid": {
        if (customerId) {
          await sb
            .from("organizations")
            .update({ subscription_status: "active" } as never)
            .eq("stripe_customer_id", customerId);
          await logAudit({ action: "billing.invoice_paid", entity: "organization", entityId: customerId });
        }
        break;
      }
      case "customer.subscription.updated": {
        const status = mapStripeStatus(String(obj.status ?? ""));
        const periodEnd =
          typeof obj.current_period_end === "number"
            ? new Date(obj.current_period_end * 1000).toISOString()
            : null;
        await sb
          .from("organizations")
          .update({
            subscription_status: status,
            stripe_subscription_id: String(obj.id ?? ""),
            current_period_end: periodEnd,
          } as never)
          .eq("stripe_customer_id", customerId);
        await logAudit({ action: "billing.subscription_updated", entity: "organization", entityId: customerId, detail: { status } });
        break;
      }
      case "customer.subscription.deleted": {
        await sb
          .from("organizations")
          .update({ subscription_status: "canceled" } as never)
          .eq("stripe_customer_id", customerId);
        await logAudit({ action: "billing.subscription_deleted", entity: "organization", entityId: customerId });
        break;
      }
      default:
        // Unhandled event types are acknowledged (200) so Stripe stops retrying.
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    captureException(err, { route: "POST /api/stripe/webhook", data: { type: event.type } });
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }
}
