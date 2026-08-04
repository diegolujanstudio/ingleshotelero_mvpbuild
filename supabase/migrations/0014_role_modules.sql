-- 0014 — widen the role/module CHECK constraints from 3 departments to 8.
--
-- The product advertised 8 departments on the contact form while the database
-- only permitted 3, so enrolling a housekeeping employee would have failed at
-- the constraint. This adds:
--   housekeeping, concierge, spa, security, maintenance
--
-- Existing rows are unaffected — this only widens what is allowed.
--
-- The canonical list lives in src/content/roles.ts (ROLE_IDS). If you add a
-- department there, add a migration like this one; the two must agree or
-- inserts will fail at runtime with a constraint violation.

begin;

-- employees.hotel_role
alter table public.employees
  drop constraint if exists employees_hotel_role_check;
alter table public.employees
  add constraint employees_hotel_role_check
  check (hotel_role in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

-- exam_sessions.module
alter table public.exam_sessions
  drop constraint if exists exam_sessions_module_check;
alter table public.exam_sessions
  add constraint exam_sessions_module_check
  check (module in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

-- content_items.module
alter table public.content_items
  drop constraint if exists content_items_module_check;
alter table public.content_items
  add constraint content_items_module_check
  check (module in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

-- vocabulary_progress.module
alter table public.vocabulary_progress
  drop constraint if exists vocabulary_progress_module_check;
alter table public.vocabulary_progress
  add constraint vocabulary_progress_module_check
  check (module in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

-- practice_sessions.module
alter table public.practice_sessions
  drop constraint if exists practice_sessions_module_check;
alter table public.practice_sessions
  add constraint practice_sessions_module_check
  check (module in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

-- drill_history.module (created in 0005)
alter table public.drill_history
  drop constraint if exists drill_history_module_check;
alter table public.drill_history
  add constraint drill_history_module_check
  check (module in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

-- whatsapp_sessions.module (created in 0012, nullable)
alter table public.whatsapp_sessions
  drop constraint if exists whatsapp_sessions_module_check;
alter table public.whatsapp_sessions
  add constraint whatsapp_sessions_module_check
  check (module is null or module in (
    'bellboy','frontdesk','restaurant',
    'housekeeping','concierge','spa','security','maintenance'
  ));

commit;
