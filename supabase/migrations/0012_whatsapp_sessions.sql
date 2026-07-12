-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0012: WhatsApp daily-drill conversation state (Phase 5)
--
-- One row per (employee, calendar day) tracking the inbound WhatsApp drill
-- conversation. The engine (src/lib/whatsapp/engine.ts) is pure; this table
-- persists the snapshot between webhook calls. Drill completions still land
-- in drill_history / practice_sessions (channel='whatsapp') / streaks via the
-- shared recordDrillCompletion() helper — this table is only conversation
-- state, never the system of record for progress.
--
-- Reuses existing surfaces (no duplication): employees.whatsapp_opted_in,
-- employees.phone (indexed), practice_sessions.channel already allows
-- 'whatsapp'. speaking_recordings CANNOT hold practice voice notes (its
-- session_id is NOT NULL → exam_sessions), so the optional voice-note path
-- stores only its storage path here.
--
-- ⚠️ NOT YET APPLIED to the shared project. Apply with the owner's
--    scripts/apply-migration.mjs after review, in numeric order.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.whatsapp_sessions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  phone text not null,                       -- normalized E.164, no 'whatsapp:' prefix
  date date not null default current_date,
  state text not null default 'idle'
    check (state in ('idle', 'drill_sent', 'awaiting_answer', 'awaiting_audio', 'done')),
  drill_id text,
  module text check (module in ('bellboy', 'frontdesk', 'restaurant')),
  level text check (level in ('A1', 'A2', 'B1', 'B2')),
  listening_correct boolean,
  audio_path text,                           -- storage path in 'recordings' bucket (optional speaking step)
  speaking_score integer check (speaking_score between 0 and 100),
  last_inbound_at timestamptz,
  last_outbound_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, date)
);

create trigger whatsapp_sessions_set_updated_at
  before update on public.whatsapp_sessions
  for each row execute function public.set_updated_at();

create index if not exists whatsapp_sessions_phone_date_idx
  on public.whatsapp_sessions(phone, date);

alter table public.whatsapp_sessions enable row level security;

-- HR can read conversation state for employees within their property scope
-- (dashboards/support). Writes are service-role only (webhook + cron) —
-- no insert/update/delete policy.
create policy "wa_select" on public.whatsapp_sessions
  for select using (
    employee_id in (
      select e.id from public.employees e
      where e.property_id in (select auth_user_property_ids())
    )
  );
