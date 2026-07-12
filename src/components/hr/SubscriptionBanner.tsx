import { AlertTriangle } from "lucide-react";
import { HR_BILLING } from "@/content/hr-billing";
import type { SubscriptionState } from "@/lib/billing/subscription";

/**
 * Soft subscription-lapse notice. Informational only — it never gates a route
 * or hides data (a pilot hotel must never be locked out mid-conversation).
 * Rendered above the HR dashboard when getSubscriptionState().lapsed is true.
 */
export function SubscriptionBanner({ state }: { state: SubscriptionState }) {
  const mailto = state.billing_email
    ? `mailto:${state.billing_email}`
    : "mailto:hola@ingleshotelero.com";
  const copy = state.status === "past_due" ? HR_BILLING.pastDue : HR_BILLING.canceled;

  return (
    <div className="flex items-start gap-3 border-b border-hair bg-ivory-soft px-6 py-3 md:px-10">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden />
      <p className="font-sans text-t-caption text-espresso-soft">
        {copy}{" "}
        <a href={mailto} className="text-ink underline hover:no-underline">
          {HR_BILLING.cta}
        </a>
      </p>
    </div>
  );
}
