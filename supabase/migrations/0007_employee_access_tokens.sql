-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0007 — employee_access_tokens
--
-- Personal access tokens for employees. The auth pattern is:
--
--   1. HR creates an employee row.
--   2. HR generates an access token (this table) bound to that employee_id.
--   3. HR sends the personal URL `/i/{token}` to the employee via WhatsApp,
--      email, or SMS.
--   4. Employee taps the link → server validates token → sets a long-lived
--      httpOnly `ih_employee_session` cookie → redirects to /practice.
--   5. Employees can revisit the link any time. Cookies persist across
--      sessions until the token is revoked.
--
-- Why this pattern (not Supabase Auth for employees)?
--
--   - Hotel staff in LATAM are mobile-first WhatsApp users. They don't
--     remember passwords, may not have personal email, and may share
--     devices.
--   - HR is the gatekeeper — they create employees and decide who gets
--     access. A passwordless personal link is the lowest-friction option.
--   - Tokens are revocable from HR's side at any time (set revoked_at).
--   - Each employee can have multiple active tokens (e.g., one for their
--     phone, one for HR's records, one rotated after device loss).
--
-- HR users continue to use Supabase Auth (email + password) — they have
-- desktop browsers, want a real dashboard, and need account recovery.
--
-- Scalability: the unique index on `token` is constant-time lookup. RLS
-- policies are property-scoped via the auth_user_property_ids() helper, so
-- this scales to thousands of properties without per-query overhead.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.employee_access_tokens (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,

  -- The actual access token (URL-safe random string, 32 bytes base64url ≈ 43 chars).
  -- Server-generated; never exposed to the client beyond the personal URL.
  token text not null unique,

  -- Lifecycle
  issued_at      timestamptz not null default now(),
  revoked_at     timestamptz,
  last_used_at   timestamptz,
  use_count      integer not null default 0,

  -- Provenance — who created this token and how it was delivered to the employee.
  created_by        uuid references public.hr_users(id) on delete set null,
  delivery_channel  text check (delivery_channel in ('whatsapp','email','sms','manual')),
  delivery_target   text,           -- the phone or email it was sent to (for audit)
  notes             text            -- optional HR note ("for backup phone", etc.)
);

-- Hot path: lookup by token (every personal-link tap hits this).
-- Already covered by the UNIQUE constraint, but explicit for clarity.

-- Hot path: list active tokens per employee (HR admin views).
create index if not exists employee_access_tokens_employee_active_idx
  on public.employee_access_tokens(employee_id, issued_at desc)
  where revoked_at is null;

alter table public.employee_access_tokens enable row level security;

-- HR users see + manage tokens for employees in their property scope.
create policy "tokens_hr_select" on public.employee_access_tokens
  for select using (
    employee_id in (
      select e.id from public.employees e
      where e.property_id in (select auth_user_property_ids())
    )
  );

create policy "tokens_hr_insert" on public.employee_access_tokens
  for insert with check (
    employee_id in (
      select e.id from public.employees e
      where e.property_id in (select auth_user_property_ids())
    )
  );

create policy "tokens_hr_update" on public.employee_access_tokens
  for update using (
    employee_id in (
      select e.id from public.employees e
      where e.property_id in (select auth_user_property_ids())
    )
  );

-- Service role bypasses RLS for the personal-link entry route, which needs
-- to look up tokens regardless of who's asking (the employee isn't an HR
-- user). The route validates the token itself; bypassing RLS is safe
-- because the route only ever queries by exact token value.
