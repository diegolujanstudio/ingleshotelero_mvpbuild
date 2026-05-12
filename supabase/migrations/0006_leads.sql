-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0006: leads (CRM intake)
--
-- Replaces the ad-hoc /api/contacto handler with a Netlify-Forms-driven
-- pipeline. Every public form on the site (pilot intake, support requests)
-- POSTs as a static HTML form → Netlify intercepts and stores → Netlify
-- fires an outgoing webhook to /api/netlify/forms-webhook → that route
-- inserts here via the service role and emails Diego + Victor via Resend.
--
-- The unique netlify_submission_id makes the webhook idempotent.
-- The status enum drives the /masteros leads workflow (separate agent).
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  -- Which form produced this lead. New form_names go here as they ship.
  form_name text not null check (form_name in ('pilot','soporte','other')),

  -- Captured fields (nullable so different forms can populate different
  -- subsets — pilot needs hotel_count, soporte needs topic, etc.).
  name text,
  email text,
  phone text,
  company text,             -- hotel name
  hotel_count integer,
  city text,
  role text,                -- HR director / GM / Owner / etc.
  message text,
  source_url text,
  user_agent text,
  ip_country text,

  -- Netlify provenance — submission_id is the dedupe key for webhook retries.
  netlify_submission_id text unique,
  netlify_form_id text,

  -- Anything we don't model explicitly stays here (topic, custom fields, …).
  metadata jsonb not null default '{}',

  -- CRM workflow state — driven from /masteros.
  status text not null default 'new'
    check (status in ('new','contacted','qualified','closed','spam')),
  notes text,
  contacted_at timestamptz,
  contacted_by uuid references public.hr_users(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create index if not exists leads_form_status_created_idx
  on public.leads(form_name, status, created_at desc);

create index if not exists leads_email_idx
  on public.leads(lower(email));

-- ─────────────────────────────────────────────────────────────
-- RLS — super_admin only via authed session.
-- INSERT is service-role only (the webhook); the service role bypasses RLS
-- so no INSERT policy is needed.
-- ─────────────────────────────────────────────────────────────
alter table public.leads enable row level security;

create policy "leads_super_admin_select" on public.leads
  for select using (
    exists (
      select 1 from public.hr_users
      where id = auth.uid()
        and role = 'super_admin'
        and is_active = true
    )
  );

create policy "leads_super_admin_update" on public.leads
  for update using (
    exists (
      select 1 from public.hr_users
      where id = auth.uid()
        and role = 'super_admin'
        and is_active = true
    )
  );
