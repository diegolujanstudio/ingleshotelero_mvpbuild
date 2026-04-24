# Phase 6 — Multi-Property + Billing

**Status:** 🟡 Not started

## Scope
Turn a single-hotel product into a chain-ready platform. Add self-service billing so the business scales without manual invoicing.

## Multi-property hierarchy
- `organizations` already exists in schema (Phase 1).
- Add `org_admin` views at `/hr/org/[orgId]` — cross-property reports, property switcher, chain-wide cohorts.
- Org admins can create property admins within their org.
- Chain-wide cohorts operate across properties (e.g., "All Front Desk Q2 2026" across 8 hotels).

## Stripe integration
- Three tiers (bible §16): Starter $150, Professional $300, Enterprise $500+.
- **Checkout:** Stripe Checkout for initial subscription signup.
- **Customer portal:** Stripe Customer Portal for plan changes, card updates, invoice history.
- **Webhook:** `/api/billing/webhook` handles `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`.
- **Enforcement:** middleware checks `organizations.subscription_status='active'` + `max_employees` / `max_properties` before allowing new signups or exam purchases.
- **Placement exam ($50 one-time):** Stripe Payment Links per property, credited to an `exam_credits` count.

## Cohort management (full)
- Create cohort: name, module, target level, dates, completion target %, member list.
- Cohort dashboard: progress bar, active/inactive counts, completion rate, leaderboards.
- Cohort alerts: employees falling behind → HR gets "send encouragement" one-tap button.
- Cross-cohort comparison: Q1 vs Q2.

## Self-serve signup (optional stretch)
- `/signup` flow: hotel info → plan selection → Stripe checkout → welcome email → dashboard.
- Pre-created exam URL uses hotel slug derived from the signup.

## Acceptance criteria
- [ ] Org admin sees property switcher + aggregated metrics.
- [ ] Plan changes take effect on next billing cycle, prorated.
- [ ] Webhook handles all 3 relevant Stripe events without duplicates (idempotent via `stripe_event_id`).
- [ ] Canceled subscriptions keep data read-only for 30 days then archive.
