-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0002: RLS hardening
-- Drops all Phase 1 policies and replaces with auth_user_property_ids()
-- helper pattern. Separate SELECT/INSERT/UPDATE/DELETE per role level.
-- ═══════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Helper: returns the set of property IDs the current auth user can see.
-- org_admin/super_admin → all properties in their org.
-- property_admin/viewer → only their assigned property.
-- SECURITY DEFINER + STABLE = executes as owner, cached per statement.
-- ─────────────────────────────────────────────────────────────
create or replace function public.auth_user_property_ids()
returns setof uuid
language sql security definer stable
as $$
  select p.id
  from public.properties p
  join public.hr_users h on (
    h.property_id = p.id
    or (
      h.organization_id = p.organization_id
      and h.role in ('super_admin', 'org_admin')
    )
  )
  where h.id = auth.uid()
    and h.is_active = true
    and p.is_active = true
$$;

-- Helper: returns the role of the current auth user.
create or replace function public.auth_user_role()
returns text
language sql security definer stable
as $$
  select role from public.hr_users where id = auth.uid() and is_active = true
$$;

-- ─────────────────────────────────────────────────────────────
-- Drop all Phase 1 policies (safe: IF EXISTS)
-- ─────────────────────────────────────────────────────────────
drop policy if exists "hr_sees_own_org"          on public.organizations;
drop policy if exists "hr_sees_own_properties"   on public.properties;
drop policy if exists "hr_self_read"             on public.hr_users;
drop policy if exists "hr_sees_own_employees"    on public.employees;
drop policy if exists "content_items_readable"   on public.content_items;
drop policy if exists "hr_sees_own_exam_sessions" on public.exam_sessions;
drop policy if exists "hr_sees_own_recordings"   on public.speaking_recordings;
drop policy if exists "hr_sees_own_listening"    on public.listening_answers;
drop policy if exists "hr_sees_own_diagnostic"   on public.diagnostic_answers;
drop policy if exists "hr_sees_own_practice"     on public.practice_sessions;
drop policy if exists "hr_sees_own_vocab"        on public.vocabulary_progress;
drop policy if exists "hr_sees_own_streaks"      on public.streaks;
drop policy if exists "hr_sees_own_cohorts"      on public.cohorts;
drop policy if exists "hr_sees_own_cohort_members" on public.cohort_members;
drop policy if exists "hr_sees_own_analytics"    on public.analytics_events;

-- ═══════════════════════════════════════════════════════════════
-- ORGANIZATIONS
-- ═══════════════════════════════════════════════════════════════
create policy "org_select" on public.organizations for select using (
  id in (select organization_id from public.hr_users where id = auth.uid() and is_active = true)
);
create policy "org_update" on public.organizations for update using (
  auth_user_role() in ('super_admin', 'org_admin')
  and id in (select organization_id from public.hr_users where id = auth.uid() and is_active = true)
);

-- ═══════════════════════════════════════════════════════════════
-- PROPERTIES
-- ═══════════════════════════════════════════════════════════════
create policy "prop_select" on public.properties for select using (
  id in (select auth_user_property_ids())
);
create policy "prop_insert" on public.properties for insert with check (
  auth_user_role() in ('super_admin', 'org_admin')
  and organization_id in (select organization_id from public.hr_users where id = auth.uid() and is_active = true)
);
create policy "prop_update" on public.properties for update using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and id in (select auth_user_property_ids())
);

-- ═══════════════════════════════════════════════════════════════
-- HR_USERS
-- ═══════════════════════════════════════════════════════════════
-- Can see own row + users within same property/org scope.
create policy "hr_select" on public.hr_users for select using (
  id = auth.uid()
  or (
    is_active = true
    and (
      property_id in (select auth_user_property_ids())
      or (
        organization_id in (select organization_id from public.hr_users where id = auth.uid() and is_active = true)
        and auth_user_role() in ('super_admin', 'org_admin')
      )
    )
  )
);
-- Only self can update own row (name, last_login_at).
create policy "hr_update_self" on public.hr_users for update using (
  id = auth.uid()
);
-- Insert handled by service role during invite flow.

-- ═══════════════════════════════════════════════════════════════
-- EMPLOYEES
-- ═══════════════════════════════════════════════════════════════
create policy "emp_select" on public.employees for select using (
  property_id in (select auth_user_property_ids())
);
create policy "emp_insert" on public.employees for insert with check (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and property_id in (select auth_user_property_ids())
);
create policy "emp_update" on public.employees for update using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and property_id in (select auth_user_property_ids())
);
create policy "emp_delete" on public.employees for delete using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and property_id in (select auth_user_property_ids())
);

-- ═══════════════════════════════════════════════════════════════
-- EXAM_SESSIONS (read-only via RLS; writes via service role)
-- ═══════════════════════════════════════════════════════════════
create policy "exam_select" on public.exam_sessions for select using (
  employee_id in (
    select e.id from public.employees e
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- DIAGNOSTIC_ANSWERS (read-only via RLS)
-- ═══════════════════════════════════════════════════════════════
create policy "diag_select" on public.diagnostic_answers for select using (
  session_id in (
    select es.id from public.exam_sessions es
    join public.employees e on e.id = es.employee_id
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- LISTENING_ANSWERS (read-only via RLS)
-- ═══════════════════════════════════════════════════════════════
create policy "listen_select" on public.listening_answers for select using (
  session_id in (
    select es.id from public.exam_sessions es
    join public.employees e on e.id = es.employee_id
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- SPEAKING_RECORDINGS (read-only via RLS)
-- ═══════════════════════════════════════════════════════════════
create policy "speak_select" on public.speaking_recordings for select using (
  session_id in (
    select es.id from public.exam_sessions es
    join public.employees e on e.id = es.employee_id
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- PRACTICE_SESSIONS (read-only via RLS)
-- ═══════════════════════════════════════════════════════════════
create policy "practice_select" on public.practice_sessions for select using (
  employee_id in (
    select e.id from public.employees e
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- VOCABULARY_PROGRESS (read-only via RLS)
-- ═══════════════════════════════════════════════════════════════
create policy "vocab_select" on public.vocabulary_progress for select using (
  employee_id in (
    select e.id from public.employees e
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- STREAKS (read-only via RLS)
-- ═══════════════════════════════════════════════════════════════
create policy "streak_select" on public.streaks for select using (
  employee_id in (
    select e.id from public.employees e
    where e.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- COHORTS
-- ═══════════════════════════════════════════════════════════════
create policy "cohort_select" on public.cohorts for select using (
  property_id in (select auth_user_property_ids())
);
create policy "cohort_insert" on public.cohorts for insert with check (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and property_id in (select auth_user_property_ids())
);
create policy "cohort_update" on public.cohorts for update using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and property_id in (select auth_user_property_ids())
);
create policy "cohort_delete" on public.cohorts for delete using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and property_id in (select auth_user_property_ids())
);

-- ═══════════════════════════════════════════════════════════════
-- COHORT_MEMBERS
-- ═══════════════════════════════════════════════════════════════
create policy "cm_select" on public.cohort_members for select using (
  cohort_id in (
    select c.id from public.cohorts c
    where c.property_id in (select auth_user_property_ids())
  )
);
create policy "cm_insert" on public.cohort_members for insert with check (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and cohort_id in (
    select c.id from public.cohorts c
    where c.property_id in (select auth_user_property_ids())
  )
);
create policy "cm_update" on public.cohort_members for update using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and cohort_id in (
    select c.id from public.cohorts c
    where c.property_id in (select auth_user_property_ids())
  )
);
create policy "cm_delete" on public.cohort_members for delete using (
  auth_user_role() in ('super_admin', 'org_admin', 'property_admin')
  and cohort_id in (
    select c.id from public.cohorts c
    where c.property_id in (select auth_user_property_ids())
  )
);

-- ═══════════════════════════════════════════════════════════════
-- CONTENT_ITEMS (read-only, any authenticated user)
-- ═══════════════════════════════════════════════════════════════
create policy "content_select" on public.content_items for select using (
  is_active = true
);
create policy "content_admin" on public.content_items for all using (
  auth_user_role() = 'super_admin'
);

-- ═══════════════════════════════════════════════════════════════
-- ANALYTICS_EVENTS (read-only via RLS; writes via service role)
-- ═══════════════════════════════════════════════════════════════
create policy "analytics_select" on public.analytics_events for select using (
  property_id in (select auth_user_property_ids())
);
