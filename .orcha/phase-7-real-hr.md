# Phase 7 — Real HR Dashboard (Production-Grade)

**Status:** 🔴 Not started  
**Goal:** Replace all demo-data usage with real Supabase queries. Implement proper Auth with email invites, role-scoped access, and RLS hardening. Tenant-isolated from day one. Scale from 1 hotel × 30 employees to 2,000 hotels × 500 employees without a rewrite.

---

## Decisions (answered 2026-04-24)

> **Q1 — Department-level scoping for HR users:** **No.** Property is the minimum access unit. Schema stays flexible for a future additive `department_scope` column on `hr_users` if a chain customer demands it — but no RLS, no join table, no UI for it now.

> **Q2 — Employee–exam linking contract:** **Auto-upsert with tweaks.**
> - Unique constraint: `UNIQUE(property_id, LOWER(TRIM(email)))` where email IS NOT NULL.
> - When email is missing (null), always create a new row — no name-based dedupe.
> - Add `employees.source` column: `self_registered | hr_invited | csv_imported`.
> - Include a "merge duplicates" action on the HR dashboard within Phase 7 scope.

> **Q3 — Demo mode strategy:** **Env-gate + hostname-gate, both.**
> - Demo surface lives on `demo.ingleshotelero.com` (Netlify branch deploy) with `NEXT_PUBLIC_DEMO_MODE=true`.
> - Production `main` branch deploy never has that flag.
> - Runtime assertion in root layout: if `NEXT_PUBLIC_DEMO_MODE === 'true'` AND `window.location.hostname === 'ingleshotelero.com'`, throw before rendering. Belt-and-suspenders so demo data physically cannot render on the production domain even if someone accidentally flips the env var on main.

---

## Architecture decisions

### Tenant model
Existing schema is correct: `organizations → properties → hr_users → employees`.  
No changes to the hierarchy. RLS enforces it.

| Role | Scope | Write capabilities |
|------|-------|--------------------|
| `super_admin` | All orgs | Everything. Diego + platform ops via service role. |
| `org_admin` | Own org, all its properties | Add properties, invite `property_admin`s, read all employee data. |
| `property_admin` | Own property only | Full CRUD on employees, read exam/session data, export reports. |
| `viewer` | Own property, read-only | See dashboard, employee list, reports. No writes. |

### Employee identity
Employees are **not** Supabase Auth users. They take exams anonymously via `/e/[slug]`.  
`hr_users` are the only Auth principals. RLS policies reference `auth.uid()` which resolves to an `hr_users.id`.

### Auth strategy
- Supabase Auth: email/password for HR users.
- Invite flow: `auth.admin.inviteUserByEmail()` (server-side, service role).
- Session: httpOnly cookie managed by `@supabase/ssr`. 60-minute JWT, auto-refreshed by middleware.
- Route protection: `src/middleware.ts` (does not exist yet — must create).

---

## Data flow

### HR user login
```
/hr/login → email + password
→ supabase.auth.signInWithPassword()
→ JWT stored in httpOnly cookie (@supabase/ssr)
→ middleware.ts on every /hr/* request:
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) → redirect /hr/login
    load hr_users row → verify is_active=true
→ all server components: createServerClient() → RLS applies via JWT claims
```

### Invite flow (new HR user)
```
org_admin/super_admin at /hr/invite
→ POST /api/hr/invite (body: { email, name, role, property_id })
  Server:
    1. Load calling user from DB; verify role >= requested role (no escalation)
    2. createServiceClient().auth.admin.inviteUserByEmail(email, {
         redirectTo: 'https://ingleshotelero.com/hr/accept-invite'
       })
    3. INSERT INTO hr_users (organization_id, property_id, email, name, role, is_active=false)
       — id is null until accept; email is the pending key
       — store invite_sent_at = now()
→ Email arrives (Supabase default template, customizable)
→ User clicks link → /hr/accept-invite?token_hash=xxx&type=invite
  Client:
    supabase.auth.verifyOtp({ token_hash, type: 'invite' })
    → user now has a real auth.uid()
    → UPDATE hr_users SET id = auth.uid(), is_active = true WHERE email = user.email
→ redirect /hr
```

### Dashboard real data queries (replacing demo-data.ts)
```
GET /hr (Server Component)
→ createServerClient() with user JWT
→ RLS automatically scopes to user's property/org
→ Queries:
    SELECT count(*), avg(combined_score), ... FROM employees
    JOIN exam_sessions ON employees.id = exam_sessions.employee_id
    WHERE exam_sessions.status = 'complete'
    GROUP BY employees.hotel_role, employees.current_level
    ORDER BY completed_at DESC
→ Render without any demo-data.ts import
```

---

## File changes

### New files
| File | Purpose |
|------|---------|
| `src/middleware.ts` | Protect `/hr/*`; refresh session; redirect unauthenticated users to `/hr/login` |
| `src/lib/auth/roles.ts` | `canManageEmployees(role)`, `canViewReports(role)`, `isOrgLevel(role)`, `canInvite(callerRole, targetRole)` |
| `src/lib/auth/session.ts` | `getHRUser()` — loads `hr_users` row from DB; memoized per request via React `cache()` |
| `src/app/hr/invite/page.tsx` | Invite form: email, name, role selector, property selector (org_admin sees all, property_admin sees own) |
| `src/app/hr/accept-invite/page.tsx` | Accept-invite + set password form |
| `src/app/api/hr/invite/route.ts` | POST: validate caller role, send auth invite, insert hr_users row |
| `supabase/migrations/0002_rls_hardening.sql` | Complete + correct all 15-table RLS policies using the helper function pattern |
| `supabase/migrations/0003_indexes_scale.sql` | Composite indexes for 100K+ employee queries |
| `supabase/migrations/0004_employees_source_unique.sql` | Add `employees.source` column (`self_registered\|hr_invited\|csv_imported`), functional unique index `UNIQUE(property_id, LOWER(TRIM(email))) WHERE email IS NOT NULL`, `invite_sent_at` column on hr_users |
| `supabase/tests/rls.test.sql` | RLS test suite (see RLS test strategy section) |

### Modified files
| File | Change |
|------|--------|
| `src/lib/supabase/types.ts` | Already done — all 15 tables typed with `Relationships: []` for GenericSchema |
| `src/app/hr/layout.tsx` | Remove demo guard; rely on middleware for auth |
| `src/app/hr/login/page.tsx` | Remove "Entrar en modo demo" button unless `NEXT_PUBLIC_DEMO_MODE=true` |
| `src/app/hr/page.tsx` | Replace `demo-data.ts` import with real Supabase aggregate queries |
| `src/app/hr/employees/page.tsx` | Replace `demo-data.ts` with paginated real employee + session queries; add "Unificar duplicados" merge action |
| `src/app/hr/employees/[id]/page.tsx` | Replace `demo-data.ts` with real employee detail, transcripts, speaking_recordings |
| `src/app/hr/reports/page.tsx` | Replace `demo-data.ts` with real cohort/level aggregate queries |
| `src/app/api/exams/route.ts` | Auto-upsert `employees` row with `source: 'self_registered'` on exam creation |
| `src/app/layout.tsx` | Add hostname-gate assertion: throw if `NEXT_PUBLIC_DEMO_MODE=true` AND hostname is `ingleshotelero.com` |
| `next.config.mjs` | Add production domain to `serverActions.allowedOrigins` |

### Env-gated + hostname-gated (not deleted)
| File | Change |
|------|--------|
| `src/lib/demo-data.ts` | Add runtime assertion: throws if `NEXT_PUBLIC_DEMO_MODE !== 'true'` OR if hostname is `ingleshotelero.com` |

---

## RLS design

### Core helper function (run once in 0002_rls_hardening.sql)
Extracting the scope predicate into a single stable function avoids N policy plan evaluations per query:

```sql
CREATE OR REPLACE FUNCTION auth_user_property_ids()
RETURNS SETOF uuid
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT p.id
  FROM properties p
  JOIN hr_users h ON (
    h.property_id = p.id
    OR (
      h.organization_id = p.organization_id
      AND h.role IN ('super_admin', 'org_admin')
    )
  )
  WHERE h.id = auth.uid()
    AND h.is_active = true
    AND p.is_active = true
$$;
```

All SELECT policies then become:
```sql
CREATE POLICY "employees_select" ON employees FOR SELECT
USING (property_id IN (SELECT auth_user_property_ids()));
```

### Full RLS matrix (15 tables)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `organizations` | own org | `super_admin` only | own org (`org_admin`+) | `super_admin` only |
| `properties` | via `auth_user_property_ids()` | `org_admin`+ | own property (`property_admin`+) | `super_admin` only |
| `hr_users` | own row + same org/property scope | `org_admin`+ (service role for invite) | own row only | `super_admin` only |
| `employees` | via `auth_user_property_ids()` | `property_admin`+ | `property_admin`+ | `property_admin`+ |
| `exam_sessions` | via property scope | service role only | service role only | never |
| `diagnostic_answers` | via property scope | service role only | never | never |
| `listening_answers` | via property scope | service role only | never | never |
| `speaking_recordings` | via property scope | service role only | service role only | never |
| `practice_sessions` | via property scope | service role only | service role only | never |
| `vocabulary_progress` | via property scope | service role only | service role only | never |
| `streaks` | via property scope | service role only | service role only | never |
| `cohorts` | via property scope | `property_admin`+ | `property_admin`+ | `property_admin`+ |
| `cohort_members` | via property scope | `property_admin`+ | `property_admin`+ | `property_admin`+ |
| `content_items` | any authenticated user (`is_active=true`) | `super_admin` only | `super_admin` only | `super_admin` only |
| `analytics_events` | via property scope | service role only | never | never |

"Via property scope" = `property_id IN (SELECT auth_user_property_ids())`.  
For tables without `property_id` directly (e.g., `exam_sessions` joined via `employees`) — join through `employees.property_id`.

### RLS test strategy

`supabase/tests/rls.test.sql` — run via `supabase db reset && psql -f supabase/tests/rls.test.sql`:

```sql
-- Setup: 2 orgs, 2 properties each, 1 user per role
-- Tests (pattern for each table × each role):
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims = '{"sub": "<property_admin_hotel_a_uuid>"}';
SELECT count(*) FROM employees;
-- Assert: returns only Hotel A employees

SET LOCAL request.jwt.claims = '{"sub": "<property_admin_hotel_b_uuid>"}';
SELECT count(*) FROM employees;
-- Assert: returns only Hotel B employees (not Hotel A)

SET LOCAL request.jwt.claims = '{"sub": "<org_admin_uuid>"}';
SELECT count(*) FROM employees;
-- Assert: returns Hotel A + Hotel B combined count

-- Cross-tenant INSERT must fail:
SET LOCAL request.jwt.claims = '{"sub": "<property_admin_hotel_a_uuid>"}';
INSERT INTO employees (property_id, name, email, hotel_role)
VALUES ('<hotel_b_property_id>', 'Test', 'x@x.com', 'bellboy');
-- Assert: ERROR (RLS violation)
```

Run this suite in CI on every migration PR. Also run manually after any Supabase policy edit.

---

## Scale ceiling analysis

### Current architecture handles:
| Metric | Ceiling | Bottleneck |
|--------|---------|------------|
| Employees per property | ~500 | HR dashboard aggregate: <200ms up to ~500 |
| Properties per org | Unlimited | Simple FK join |
| Total employees | ~100K | Unindexed `GROUP BY` queries on dashboard |
| Concurrent exam sessions (writes) | ~200 | Supabase free = 60 connections; Pro = 200 |
| Total registered users (1M) | Requires Pro + pgBouncer | Connection pool exhaustion |

### Changes needed at each tier

**10K employees (~200 properties) — no schema changes:**
- Upgrade to Supabase Pro ($25/mo).
- Enable pgBouncer (transaction mode) in Supabase dashboard immediately — serverless functions need it.

**100K employees (~2,000 properties) — migration 0003_indexes_scale.sql:**
```sql
-- Hot query paths for HR dashboard
CREATE INDEX employees_property_active_role_idx
  ON employees(property_id, is_active, hotel_role);

CREATE INDEX exam_sessions_employee_completed_idx
  ON exam_sessions(employee_id, completed_at DESC)
  WHERE status = 'complete';

CREATE INDEX speaking_recordings_scoring_pending_idx
  ON speaking_recordings(scoring_status, created_at)
  WHERE scoring_status IN ('pending', 'processing');
```
- Introduce `property_stats` materialized view (refreshed every 5 min via pg_cron):
  ```sql
  CREATE MATERIALIZED VIEW property_stats AS
  SELECT property_id, count(*) as employee_count,
         avg(combined_score) as avg_score,
         count(*) FILTER (WHERE last_active > now() - interval '7 days') as active_this_week
  FROM employees JOIN exam_sessions ...
  GROUP BY property_id;
  ```
  Dashboard reads from view instead of live JOIN.

**1M employees (2,000 hotels × 500 employees) — infrastructure changes:**
- Partition `exam_sessions` and `analytics_events` by `created_at` (monthly partitions, Postgres 14+).
- Move audio storage from Supabase Storage to Cloudflare R2 (10× cheaper at TB scale).
- Add read replica for dashboard queries; writes go to primary.
- Supabase Enterprise or self-hosted Postgres on Neon/Fly.io.
- Edge caching for `/e/[slug]` — hotel entry page is static per property; cache at Vercel Edge with `revalidate: 300`.

---

## Top 10 production failure modes

### 1. RLS gap exposes cross-tenant data
**Risk:** Misconfigured policy returns rows from another hotel's employees.  
**Prevention:** RLS test suite on every migration. Spot-check in SQL editor: `SET LOCAL request.jwt.claims = '{"sub": "hotel-a-user"}'; SELECT * FROM employees;` — count must match exactly.  
**Detection:** Daily Supabase scheduled query: `SELECT property_id, count(*) FROM employees GROUP BY property_id` — alert if counts drift from expected range.

### 2. Auth session expiry breaks the dashboard mid-use
**Risk:** JWT expires (60-minute default) while an HR director is reviewing reports. Next Supabase call returns `AuthSessionMissingError`. Page shows empty or crashes.  
**Prevention:** `middleware.ts` calls `supabase.auth.getUser()` on every `/hr/*` request — this triggers the auto-refresh flow via `@supabase/ssr`. If refresh also fails (user closed laptop for 8 hours), middleware redirects to `/hr/login` with `?returnTo=<current path>` so they land back on the same page after re-auth.

### 3. Invite token expires before HR director acts
**Risk:** Supabase Auth invite links expire in 24 hours by default. A busy HR director misses it.  
**Prevention:**
- Set invite token expiry to 72 hours in Supabase Auth settings.
- Store `invite_sent_at` on `hr_users`; show "Invitación enviada hace X días" in the invite list.
- Add "Reenviar invitación" button that calls `auth.admin.inviteUserByEmail()` again (Supabase resets the token).
- Email subject line: "Tienes 72 horas para activar tu cuenta en Inglés Hotelero."

### 4. Demo data visible in production
**Risk:** `NEXT_PUBLIC_DEMO_ENABLED=true` accidentally set on Vercel Production environment.  
**Prevention:**
- Vercel: env var set only on "Preview" + "Development" environments, never "Production."
- Runtime guard in `demo-data.ts`:
  ```typescript
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEMO_ENABLED !== 'true') {
    throw new Error('demo-data imported in production without DEMO_ENABLED')
  }
  ```
- CI lint step: `grep -r "demo-data" src/app --include="*.tsx" | grep -v "DEMO_ENABLED"` must be empty.

### 5. Timezone errors in dashboard date display
**Risk:** `exam_sessions.completed_at` is stored as UTC. HR director in Cancún (UTC-5) sees "completed at 11pm" for a session that finished at 6pm local time.  
**Prevention:** All `timestamptz` columns already correct in Postgres. Server-side formatting: always convert to `properties.timezone` using `date-fns-tz` or Postgres `AT TIME ZONE`. Never call `toLocaleDateString()` client-side without the property timezone string passed from the server.

### 6. Role escalation via invite API
**Risk:** A `viewer` role user POSTs to `/api/hr/invite` and grants themselves `property_admin`.  
**Prevention:** `/api/hr/invite` route handler:
```typescript
const callerUser = await getHRUser(); // loads from DB, not from request body
if (!canInvite(callerUser.role, body.role)) return 403;
if (callerUser.organization_id !== body.organization_id) return 403;
```
`canInvite()` rule: you can only grant a role ≤ your own. `viewer` cannot invite anyone. `property_admin` can invite `viewer` only.

### 7. Service role key in client bundle
**Risk:** `createServiceClient()` imported in a `"use client"` file or a shared utility that gets bundled for the browser. Service role key exposed in network tab.  
**Prevention:**
- `createServiceClient()` already throws if key missing. Good but not enough.
- ESLint rule `no-restricted-imports` in `.eslintrc.json`:
  ```json
  { "paths": [{ "name": "@/lib/supabase/server", "importNames": ["createServiceClient"],
    "message": "createServiceClient is server-only. Use createServerClient() in Route Handlers." }] }
  ```
  (Actual enforcement: only flag in files without `route.ts` or `actions.ts` suffix.)
- Vercel build check in CI: scan bundle output for the service role key substring.

### 8. pgBouncer connection pool exhaustion
**Risk:** Each Vercel Serverless Function holds a Postgres connection during execution. 50 concurrent exam submissions = 50 connections. Supabase Free = 60 connections max. Dashboard + exams + scoring workers = exhaustion.  
**Prevention:** Enable pgBouncer (transaction mode) in Supabase dashboard before any real hotel goes live. With pgBouncer, 200 app connections multiplex to 5-10 real Postgres connections. Set `?pgbouncer=true` in connection string (Supabase's `.env.local` template includes this).

### 9. Concurrent scoring updates corrupt speaking_recordings
**Risk:** Two `/api/score-speaking` calls for the same recording race to write results back. Second write overwrites first with a different (possibly worse) score.  
**Prevention:** In scoring worker:
```sql
UPDATE speaking_recordings
SET scoring_status = 'processing', scoring_attempts = scoring_attempts + 1
WHERE id = $1
  AND scoring_status = 'pending'  -- only claim if still pending
RETURNING id;
```
If `RETURNING` returns 0 rows, another worker claimed it — abort. Write results only when `scoring_status = 'processing'` and `scoring_attempts` matches expected value.

### 10. Supabase Storage recordings accessible without auth
**Risk:** `recordings` bucket created as public (accidental misconfiguration). Any user who guesses the storage path can download voice recordings from other hotels.  
**Prevention:**
- `recordings` bucket: private (set in 0001_initial_schema.sql — already correct per migration, verify in Supabase dashboard).
- All audio URLs in API responses are signed URLs with 1-hour expiry:
  ```typescript
  const { data } = await createServiceClient().storage
    .from('recordings')
    .createSignedUrl(audioPath, 3600);
  ```
- Storage RLS policy: INSERT restricted to `auth.role() = 'service_role'`; no public GET.
- Quarterly review: check bucket settings in Supabase dashboard haven't been changed.

---

## Observability hooks

### Events to log (→ `analytics_events` table via service role)
| Event type | When | Metadata |
|------------|------|---------|
| `hr_login` | Every successful HR login | `{ role, property_id, user_agent }` |
| `hr_login_failed` | Failed login attempt | `{ email_hash, reason }` — never store raw email |
| `hr_invite_sent` | Invite email dispatched | `{ target_role, property_id, sent_by }` |
| `hr_invite_accepted` | Invite link clicked + password set | `{ role, property_id }` |
| `hr_export_pdf` | PDF report generated | `{ property_id, scope: 'employee' | 'report' }` |
| `hr_export_csv` | CSV exported | `{ property_id, employee_count }` |

### Vercel monitoring
- Enable Vercel Analytics + Speed Insights (free on Pro).
- Alert threshold: p95 latency > 2s on `/hr/*` routes.
- Monitor: `/api/score-speaking` error rate — alert if > 5% over 1 hour.

### Supabase logs
- Enable Auth logs: watch for `invite_not_found` errors (expired tokens).
- Enable Database logs: watch for `rls_policy_violation` events (potential probing).
- Weekly: `SELECT count(*) FROM hr_users WHERE last_login_at > now() - interval '7 days'` — active HR user count.

---

## Cost estimates

| Tier | Scale | Supabase | Vercel | Total/mo |
|------|-------|----------|--------|----------|
| Seed | <500 employees, 10 hotels | Free | Hobby (free) | $0 |
| Early pilots | 10K employees, 200 hotels | Pro ($25) | Pro ($20) | ~$50 |
| Growth | 100K employees, 2K hotels | Pro + compute add-on (~$100) | Pro ($20) | ~$150 |
| Scale | 1M employees | Enterprise (~$2K) or self-hosted | Enterprise (~$400) | ~$2,400 |

---

## Acceptance criteria

- [ ] `src/lib/demo-data.ts` not imported in any production build (CI grep check)
- [ ] New HR user invited, email received, password set, and dashboard accessible — end-to-end < 5 min
- [ ] `property_admin` at Hotel A: `SELECT * FROM employees` returns 0 rows from Hotel B
- [ ] `org_admin`: sees all properties in own org, 0 rows from other orgs
- [ ] `viewer`: cannot INSERT or UPDATE any row (all write policies reject)
- [ ] JWT expiry: page transparently refreshes; no broken dashboard or lost state
- [ ] `/hr/login` demo bypass: absent in production build, visible only when `NEXT_PUBLIC_DEMO_ENABLED=true`
- [ ] All 15 DB tables typed in `src/lib/supabase/types.ts`
- [ ] `src/middleware.ts` redirects unauthenticated requests on all `/hr/*` routes
- [ ] Invite expiry 72h; resend button functional
- [ ] RLS test suite passes for all 4 roles × all 15 tables
- [ ] pgBouncer enabled in Supabase before first hotel goes live
