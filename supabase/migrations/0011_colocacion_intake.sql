-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0011: Colocación client-intake
--
-- The "examen de colocación" is repurposed: it is no longer the in-app
-- employee test (renamed to "Evaluación de nivel"). It is now a public
-- warm-lead INTAKE questionnaire — a prospect hotel tells us everything
-- so we can quote them. Submissions land in `leads` (new form_name
-- 'colocacion') and surface in Master OS. The page's editorial copy is
-- stored in `page_content` so the team can edit the live page from
-- Master OS.
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Allow 'colocacion' as a lead source.
alter table public.leads drop constraint if exists leads_form_name_check;
alter table public.leads
  add constraint leads_form_name_check
  check (form_name in ('pilot', 'soporte', 'colocacion', 'other'));

-- 2. Editable page content (key → jsonb). Read by public pages; edited
--    in Master OS (super_admin only via service role).
create table if not exists public.page_content (
  key text primary key,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.hr_users(id)
);

create trigger page_content_set_updated_at
  before update on public.page_content
  for each row execute function public.set_updated_at();

alter table public.page_content enable row level security;

-- Public read (the live page renders it for anonymous prospects).
create policy "page_content_public_read" on public.page_content
  for select using (true);

-- Writes go through the service role (Master OS) — no write policy needed.
