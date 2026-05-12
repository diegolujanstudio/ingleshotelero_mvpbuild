-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0005: speaking_recordings.recording_type, drill_history,
-- idempotency_keys.
--
-- Phase A (real backend) needs:
--   1. recording_type on speaking_recordings to distinguish exam vs daily
--      practice recordings (Phase D).
--   2. drill_history table for the daily practice loop (Phase D — schema
--      lands now so the scoring worker can write to it without a follow-up
--      migration).
--   3. idempotency_keys table for server-side replay protection on every
--      mutating endpoint.
-- ═══════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- 1. speaking_recordings.recording_type
-- ─────────────────────────────────────────────────────────────
alter table public.speaking_recordings
  add column if not exists recording_type text not null default 'exam'
    check (recording_type in ('exam','practice'));

-- ─────────────────────────────────────────────────────────────
-- 2. drill_history (daily practice loop, Phase D)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.drill_history (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  drill_id text not null,
  level text not null check (level in ('A1','A2','B1','B2')),
  module text not null check (module in ('bellboy','frontdesk','restaurant')),
  listening_correct boolean,
  speaking_score integer check (speaking_score between 0 and 100),
  vocab_known integer not null default 0,
  duration_seconds integer,
  completed_at timestamptz not null default now(),
  unique (employee_id, drill_id, completed_at)
);

create index if not exists drill_history_employee_date_idx
  on public.drill_history(employee_id, completed_at desc);

alter table public.drill_history enable row level security;

create policy "drill_history_select" on public.drill_history
  for select using (
    employee_id in (
      select e.id from public.employees e
      where e.property_id in (select auth_user_property_ids())
    )
  );
-- writes are service-role only — no INSERT/UPDATE/DELETE policies.

-- ─────────────────────────────────────────────────────────────
-- 3. idempotency_keys
-- ─────────────────────────────────────────────────────────────
-- Stores the response body for a successful mutation keyed by an
-- Idempotency-Key header. Replay returns the cached response.
-- 24h TTL; cleanup is a periodic delete (skip for now — at this scale
-- the table stays small).
create table if not exists public.idempotency_keys (
  key text primary key,
  response jsonb not null,
  status_code integer not null default 200,
  created_at timestamptz not null default now()
);

create index if not exists idempotency_keys_created_idx
  on public.idempotency_keys(created_at);

alter table public.idempotency_keys enable row level security;
-- no select policies — service role only via bypass.
