-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0008: Fix infinite recursion in hr_users SELECT policy
--
-- The 0002 "hr_select" policy contained an INLINE subquery against
-- public.hr_users itself:
--
--   organization_id in (
--     select organization_id from public.hr_users
--     where id = auth.uid() and is_active = true
--   )
--
-- Evaluating the hr_users SELECT policy therefore required SELECTing
-- from hr_users, which re-applied the same policy → Postgres aborted
-- every RLS-bound read with:
--
--   42P17: infinite recursion detected in policy for relation "hr_users"
--
-- Effect in the app: getHRUser() caught the thrown query and returned
-- null, so EVERY authenticated /hr and /masteros request 307-redirected
-- to "/". HR sign-in appeared to "succeed" (cookie set, getUser() OK)
-- but no protected page would ever render.
--
-- Fix: move the self-referential lookup into a SECURITY DEFINER helper
-- (same pattern as auth_user_role() / auth_user_property_ids() in 0002),
-- which executes as the function owner and bypasses RLS — no recursion.
-- ═══════════════════════════════════════════════════════════════════════

-- Helper: the current auth user's organization_id. SECURITY DEFINER so
-- the read does not re-enter hr_users RLS. STABLE = cached per statement.
create or replace function public.auth_user_org_id()
returns uuid
language sql security definer stable
as $$
  select organization_id
  from public.hr_users
  where id = auth.uid() and is_active = true
$$;

-- Recreate hr_select without the recursive inline subquery. Semantics
-- are preserved: a user sees their own row, plus active rows in a
-- property they can see, plus active rows in their org when they are a
-- super_admin / org_admin.
drop policy if exists "hr_select" on public.hr_users;
create policy "hr_select" on public.hr_users for select using (
  id = auth.uid()
  or (
    is_active = true
    and (
      property_id in (select auth_user_property_ids())
      or (
        organization_id = public.auth_user_org_id()
        and auth_user_role() in ('super_admin', 'org_admin')
      )
    )
  )
);
