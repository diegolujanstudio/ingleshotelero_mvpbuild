-- ═══════════════════════════════════════════════════════════════════════
-- Inglés Hotelero — initial schema (v0.1.0)
-- Source of truth: Product Bible §11 + §10 (RLS).
-- Run on a fresh Supabase project via the SQL editor or `supabase db push`.
-- ═══════════════════════════════════════════════════════════════════════

-- UUID generation comes from pgcrypto (already enabled on Supabase).
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Helper: updated_at trigger
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- ORGANIZATION LAYER
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'independent' check (type in ('chain','independent')),
  logo_url text,
  subscription_tier text not null default 'pilot'
    check (subscription_tier in ('pilot','starter','professional','enterprise')),
  subscription_status text not null default 'active'
    check (subscription_status in ('active','past_due','canceled','archived')),
  max_properties integer not null default 1,
  max_employees integer not null default 100,
  billing_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null unique,
  city text,
  state text,
  country text not null default 'MX',
  room_count integer,
  timezone text not null default 'America/Mexico_City',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists properties_org_idx on public.properties(organization_id);

-- ═══════════════════════════════════════════════════════════════
-- USER LAYER
-- ═══════════════════════════════════════════════════════════════
-- hr_users.id links to auth.users(id) — Supabase Auth provisions the row there,
-- we mirror profile data here. Keep both in sync via an auth trigger (later).
create table if not exists public.hr_users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id),
  property_id uuid references public.properties(id),
  email text not null unique,
  name text not null,
  role text not null default 'property_admin'
    check (role in ('super_admin','org_admin','property_admin','viewer')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists hr_users_org_idx on public.hr_users(organization_id);
create index if not exists hr_users_property_idx on public.hr_users(property_id);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  hotel_role text not null check (hotel_role in ('bellboy','frontdesk','restaurant')),
  current_level text check (current_level in ('A1','A2','B1','B2')),
  department text,
  shift text check (shift in ('morning','afternoon','night')),
  whatsapp_opted_in boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger employees_set_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();
create index if not exists employees_property_idx on public.employees(property_id);
create index if not exists employees_phone_idx on public.employees(phone);

-- ═══════════════════════════════════════════════════════════════
-- EXAM LAYER
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  module text not null check (module in ('bellboy','frontdesk','restaurant')),
  exam_type text not null default 'placement'
    check (exam_type in ('placement','monthly','final')),
  status text not null default 'in_progress'
    check (status in ('in_progress','listening_done','speaking_done','scoring','complete','abandoned')),
  current_step text not null default 'diagnostic',
  listening_score numeric,
  listening_total integer not null default 10,
  speaking_avg_score numeric,
  final_level text check (final_level in ('A1','A2','B1','B2')),
  level_confidence numeric check (level_confidence between 0 and 1),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  scored_at timestamptz
);
create index if not exists exam_sessions_employee_idx on public.exam_sessions(employee_id);
create index if not exists exam_sessions_status_idx on public.exam_sessions(status);

create table if not exists public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions(id) on delete cascade,
  question_index integer not null,
  answer_value jsonb not null,
  created_at timestamptz not null default now(),
  unique (session_id, question_index)
);

create table if not exists public.listening_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions(id) on delete cascade,
  question_index integer not null,
  selected_option integer not null,
  is_correct boolean not null,
  level_tag text not null check (level_tag in ('A1','A2','B1','B2')),
  response_time_ms integer,
  replay_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (session_id, question_index)
);

create table if not exists public.speaking_recordings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions(id) on delete cascade,
  prompt_index integer not null,
  audio_url text not null,
  audio_duration_seconds numeric,
  level_tag text not null check (level_tag in ('A1','A2','B1','B2')),
  transcript text,
  ai_score_intent integer check (ai_score_intent between 0 and 25),
  ai_score_vocabulary integer check (ai_score_vocabulary between 0 and 25),
  ai_score_fluency integer check (ai_score_fluency between 0 and 25),
  ai_score_tone integer check (ai_score_tone between 0 and 25),
  ai_score_total integer check (ai_score_total between 0 and 100),
  ai_feedback_es text,
  ai_model_response text,
  ai_level_estimate text check (ai_level_estimate in ('A1','A2','B1','B2')),
  scoring_status text not null default 'pending'
    check (scoring_status in ('pending','processing','complete','failed')),
  scoring_attempts integer not null default 0,
  created_at timestamptz not null default now(),
  scored_at timestamptz,
  unique (session_id, prompt_index)
);
create index if not exists speaking_recordings_scoring_idx
  on public.speaking_recordings(scoring_status)
  where scoring_status in ('pending','processing');

-- ═══════════════════════════════════════════════════════════════
-- PRACTICE LAYER (daily learning)
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null default current_date,
  channel text not null default 'web' check (channel in ('web','whatsapp')),
  listening_correct boolean,
  speaking_score integer check (speaking_score between 0 and 100),
  vocabulary_reviewed integer not null default 0,
  duration_seconds integer,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (employee_id, date)
);

create table if not exists public.vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  word text not null,
  module text not null check (module in ('bellboy','frontdesk','restaurant')),
  level text not null check (level in ('A1','A2','B1','B2')),
  ease_factor numeric not null default 2.5,
  interval_days integer not null default 1,
  repetitions integer not null default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  times_correct integer not null default 0,
  times_incorrect integer not null default 0,
  unique (employee_id, word, module)
);
create index if not exists vocabulary_due_idx
  on public.vocabulary_progress(employee_id, next_review_at);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade unique,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_practice_date date
);

-- ═══════════════════════════════════════════════════════════════
-- COHORT LAYER
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  module text not null check (module in ('bellboy','frontdesk','restaurant')),
  target_level text check (target_level in ('A1','A2','B1','B2')),
  start_date date not null,
  end_date date not null,
  completion_target_pct integer not null default 80,
  status text not null default 'active'
    check (status in ('draft','active','completed','archived')),
  created_by uuid references public.hr_users(id),
  created_at timestamptz not null default now()
);
create index if not exists cohorts_property_idx on public.cohorts(property_id);

create table if not exists public.cohort_members (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  enrollment_date date not null default current_date,
  status text not null default 'active'
    check (status in ('active','completed','dropped','paused')),
  completion_pct numeric not null default 0 check (completion_pct between 0 and 100),
  unique (cohort_id, employee_id)
);

-- ═══════════════════════════════════════════════════════════════
-- CONTENT LAYER
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  module text not null check (module in ('bellboy','frontdesk','restaurant')),
  level text not null check (level in ('A1','A2','B1','B2')),
  skill text not null check (skill in ('listening','speaking','vocabulary')),
  item_type text not null check (item_type in ('exam','drill','assessment')),
  -- listening fields
  audio_text text,
  audio_url text,
  options jsonb, -- [{ "emoji": "🧳", "text_es": "...", "is_correct": true }]
  -- speaking fields
  scenario_es text,
  expected_keywords text[],
  model_response text,
  model_response_audio_url text,
  -- vocabulary fields
  word text,
  word_audio_url text,
  -- metadata
  topic text,
  is_active boolean not null default true,
  usage_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists content_items_lookup_idx
  on public.content_items(module, level, skill, item_type)
  where is_active = true;

-- ═══════════════════════════════════════════════════════════════
-- ANALYTICS LAYER
-- ═══════════════════════════════════════════════════════════════
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  employee_id uuid,
  property_id uuid,
  session_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_type_date_idx
  on public.analytics_events(event_type, created_at desc);
create index if not exists analytics_events_property_idx
  on public.analytics_events(property_id, created_at desc);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════
-- Pattern: enable RLS on every table, then allow access scoped to
-- (a) the employee themself, or (b) an HR user with matching property/org.
-- Server-side API routes use the service role key and BYPASS RLS.

alter table public.organizations       enable row level security;
alter table public.properties          enable row level security;
alter table public.hr_users            enable row level security;
alter table public.employees           enable row level security;
alter table public.exam_sessions       enable row level security;
alter table public.diagnostic_answers  enable row level security;
alter table public.listening_answers   enable row level security;
alter table public.speaking_recordings enable row level security;
alter table public.practice_sessions   enable row level security;
alter table public.vocabulary_progress enable row level security;
alter table public.streaks             enable row level security;
alter table public.cohorts             enable row level security;
alter table public.cohort_members      enable row level security;
alter table public.content_items       enable row level security;
alter table public.analytics_events    enable row level security;

-- HR user → organization visibility
create policy "hr_sees_own_org" on public.organizations
  for select using (
    id = (select organization_id from public.hr_users where id = auth.uid())
  );

create policy "hr_sees_own_properties" on public.properties
  for select using (
    organization_id = (select organization_id from public.hr_users where id = auth.uid())
    or id = (select property_id from public.hr_users where id = auth.uid())
  );

create policy "hr_self_read" on public.hr_users
  for select using (id = auth.uid());

-- HR user → employees in their property (or any property within their org if org_admin)
create policy "hr_sees_own_employees" on public.employees
  for all using (
    property_id in (
      select p.id
      from public.properties p
      join public.hr_users h on h.id = auth.uid()
      where p.organization_id = h.organization_id
        or p.id = h.property_id
    )
  );

-- Content items are shared across tenants — any authenticated user can read active items.
create policy "content_items_readable" on public.content_items
  for select using (is_active = true);

-- All exam/practice/cohort tables follow the same pattern: access is granted
-- when the row's employee/property belongs to the HR user's scope.
create policy "hr_sees_own_exam_sessions" on public.exam_sessions
  for all using (
    employee_id in (
      select e.id from public.employees e
      where e.property_id in (
        select p.id from public.properties p
        join public.hr_users h on h.id = auth.uid()
        where p.organization_id = h.organization_id or p.id = h.property_id
      )
    )
  );

create policy "hr_sees_own_recordings" on public.speaking_recordings
  for all using (
    session_id in (select id from public.exam_sessions)
  );

create policy "hr_sees_own_listening" on public.listening_answers
  for all using (
    session_id in (select id from public.exam_sessions)
  );

create policy "hr_sees_own_diagnostic" on public.diagnostic_answers
  for all using (
    session_id in (select id from public.exam_sessions)
  );

create policy "hr_sees_own_practice" on public.practice_sessions
  for all using (
    employee_id in (select id from public.employees)
  );

create policy "hr_sees_own_vocab" on public.vocabulary_progress
  for all using (
    employee_id in (select id from public.employees)
  );

create policy "hr_sees_own_streaks" on public.streaks
  for all using (
    employee_id in (select id from public.employees)
  );

create policy "hr_sees_own_cohorts" on public.cohorts
  for all using (
    property_id in (
      select p.id from public.properties p
      join public.hr_users h on h.id = auth.uid()
      where p.organization_id = h.organization_id or p.id = h.property_id
    )
  );

create policy "hr_sees_own_cohort_members" on public.cohort_members
  for all using (
    cohort_id in (select id from public.cohorts)
  );

-- Analytics: HR sees rows tagged with their property.
create policy "hr_sees_own_analytics" on public.analytics_events
  for select using (
    property_id in (
      select p.id from public.properties p
      join public.hr_users h on h.id = auth.uid()
      where p.organization_id = h.organization_id or p.id = h.property_id
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════
-- Private buckets for voice recordings and generated reports.
-- Run these once after creating the project — they're idempotent.
insert into storage.buckets (id, name, public)
  values ('recordings', 'recordings', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('reports', 'reports', false)
  on conflict (id) do nothing;

-- Public bucket for vocabulary / model-response audio (CDN-friendly).
insert into storage.buckets (id, name, public)
  values ('audio', 'audio', true)
  on conflict (id) do nothing;
