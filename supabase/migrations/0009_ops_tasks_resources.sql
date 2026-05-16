-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0009: Master OS operations — tasks & resources
--
-- Two internal-team surfaces requested for running the startup:
--   • ops_tasks      — pending startup/project to-dos (kanban-ish)
--   • ops_resources  — notes, links, docs the team keeps handy
--
-- Both are super_admin-only, accessed from /masteros via the service
-- role (which bypasses RLS); RLS is still enabled + locked for defense
-- in depth, mirroring the leads table (migration 0006).
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.ops_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text,
  status text not null default 'todo'
    check (status in ('todo','doing','done')),
  priority text not null default 'med'
    check (priority in ('low','med','high')),
  due_date date,
  created_by uuid references public.hr_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger ops_tasks_set_updated_at
  before update on public.ops_tasks
  for each row execute function public.set_updated_at();

create index if not exists ops_tasks_status_created_idx
  on public.ops_tasks(status, created_at desc);

create table if not exists public.ops_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,                       -- free-text notes (markdown-ish)
  url text,                        -- optional link
  kind text not null default 'note'
    check (kind in ('note','link','doc')),
  created_by uuid references public.hr_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger ops_resources_set_updated_at
  before update on public.ops_resources
  for each row execute function public.set_updated_at();

create index if not exists ops_resources_kind_created_idx
  on public.ops_resources(kind, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- RLS — super_admin only (service role bypasses; this is defense
-- in depth, identical pattern to public.leads).
-- ─────────────────────────────────────────────────────────────
alter table public.ops_tasks enable row level security;
alter table public.ops_resources enable row level security;

create policy "ops_tasks_super_admin_all" on public.ops_tasks
  for all using (
    exists (
      select 1 from public.hr_users
      where id = auth.uid() and role = 'super_admin' and is_active = true
    )
  );

create policy "ops_resources_super_admin_all" on public.ops_resources
  for all using (
    exists (
      select 1 from public.hr_users
      where id = auth.uid() and role = 'super_admin' and is_active = true
    )
  );
