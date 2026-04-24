-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0004: employees.source column + functional unique email index
-- + hr_users.invite_sent_at for invite tracking
-- ═══════════════════════════════════════════════════════════════════════

-- Source of the employee row: how they entered the system.
alter table public.employees
  add column if not exists source text not null default 'self_registered'
  check (source in ('self_registered', 'hr_invited', 'csv_imported'));

-- Functional unique index: dedupe by normalized email within a property.
-- Rows where email IS NULL are excluded (no name-based dedup).
create unique index if not exists employees_property_email_unique_idx
  on public.employees (property_id, lower(trim(email)))
  where email is not null;

-- HR invite tracking: when the invite email was last sent.
alter table public.hr_users
  add column if not exists invite_sent_at timestamptz;
