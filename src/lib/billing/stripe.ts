import "server-only";

/**
 * Stripe helpers — no `stripe` npm dependency, just node:crypto. Inert when
 * STRIPE_WEBHOOK_SECRET is unset (isStripeConfigured() === false).
 */
import crypto from "node:crypto";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

/**
 * Verify a Stripe webhook signature (the `Stripe-Signature` header format
 * `t=<ts>,v1=<hmac>`). HMAC-SHA256 of `${t}.${payload}` with the endpoint
 * secret, timing-safe compared, rejecting timestamps outside the tolerance.
 */
export function verifyStripeSignature(
  payload: string,
  sigHeader: string | null,
  secret: string,
  toleranceSec = 300,
): boolean {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
    }),
  );
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - t) > toleranceSec) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${payload}`, "utf8")
    .digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(v1);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Map a Stripe subscription/invoice status to our org subscription_status. */
export function mapStripeStatus(
  s: string,
): "active" | "past_due" | "canceled" {
  switch (s) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
    case "incomplete":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
    default:
      return "canceled";
  }
}
