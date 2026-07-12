-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0013: Stripe billing columns + webhook event dedupe (Phase 6)
--
-- Adds the Stripe linkage to organizations and an idempotency ledger for
-- webhook events. subscription_status + subscription_tier already exist
-- (0001) and are reused — this only adds the Stripe-specific fields.
--
-- ⚠️ NOT YET APPLIED to the shared project. File for the owner to run in
--    order with scripts/apply-migration.mjs after review.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.organizations
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan text,                    -- Stripe price lookup_key/nickname
  add column if not exists current_period_end timestamptz;

-- Webhook idempotency: each Stripe event id is processed at most once.
create table if not exists public.stripe_events (
  id text primary key,          -- Stripe event id (evt_...)
  type text not null,
  created_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
-- Service-role only (the webhook). No policies → no anon/authed access.
