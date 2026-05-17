-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0010: Master OS audit log (append-only)
--
-- Tamper-evident-by-policy record of every sensitive mutation in
-- /masteros (module edits, lead deletes, team/role changes). Insert-only
-- for the team via RLS; only the service role writes. This is what makes
-- it safe to give Editor/Admin seats — every write is attributable.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.ops_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.hr_users(id),
  actor_email text,
  action text not null,          -- e.g. 'module.update', 'lead.delete'
  entity text not null,          -- 'module' | 'lead' | 'team' | 'task' | ...
  entity_id text,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists ops_audit_created_idx
  on public.ops_audit(created_at desc);
create index if not exists ops_audit_entity_idx
  on public.ops_audit(entity, created_at desc);

alter table public.ops_audit enable row level security;

-- Read: super_admin only. No UPDATE/DELETE policy → append-only even for
-- the team (service role writes; nobody can edit/erase history via RLS).
create policy "ops_audit_super_admin_select" on public.ops_audit
  for select using (
    exists (
      select 1 from public.hr_users
      where id = auth.uid() and role = 'super_admin' and is_active = true
    )
  );
