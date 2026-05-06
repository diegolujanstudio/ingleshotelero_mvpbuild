/**
 * scripts/rls-audit.ts
 * ═══════════════════════════════════════════════════════════════════════
 * RLS audit — Inglés Hotelero
 *
 * Purpose
 *   Comprehensive cross-tenant Row-Level-Security test suite. Spins up
 *   fixtures inside ONE transaction (2 orgs × 2 properties × 4 HR roles ×
 *   employees / sessions / cohorts / etc.), then iterates over every
 *   (table × role) pairing and asserts the visible row count matches the
 *   matrix derived from supabase/migrations/0002_rls_hardening.sql.
 *
 *   Also drives a battery of cross-tenant INSERT attempts that MUST be
 *   rejected by the policies (writes against another tenant, viewer
 *   trying to write at all, non-super_admin touching content_items, etc.).
 *
 *   Everything happens inside BEGIN; … ROLLBACK; — no test data persists.
 *
 * How to run
 *   npm run rls:audit
 *
 * Required env
 *   SUPABASE_DB_URL   Postgres session-mode connection string. The session
 *                     pooler (port 5432) is required because we use
 *                     SET LOCAL — transaction-mode pooling on :6543 will
 *                     drop the GUC after every statement.
 *
 *                     Format:
 *                       postgresql://postgres.<ref>:<pwd>@aws-1-us-east-2.pooler.supabase.com:5432/postgres
 *
 *   STRICT_RLS_AUDIT  Optional. If "true", a missing SUPABASE_DB_URL
 *                     causes the script to exit 1 instead of skipping.
 *                     CI sets this; local dev usually leaves it unset.
 *
 * Rollback safety
 *   The whole audit runs inside a single transaction. The finally block
 *   issues ROLLBACK before closing the connection, so the database is
 *   guaranteed to be in its original state when the script exits — even
 *   if an assertion throws partway through.
 *
 *   We DO write to auth.users inside the same transaction (the service
 *   role connection has the privileges to do this on Supabase). Because
 *   hr_users.id FKs auth.users(id) ON DELETE CASCADE and the auth.users
 *   inserts live in the same transaction, ROLLBACK cleans both layers.
 *   If your Postgres role cannot write auth.users, the alternative is to
 *   pre-create the test users via supabase.auth.admin.createUser() and
 *   delete them after — but in-transaction is preferred and works on
 *   the standard service-role pooler connection.
 *
 * Exit codes
 *   0  all assertions passed (or skipped when SUPABASE_DB_URL absent
 *      and STRICT_RLS_AUDIT != "true")
 *   1  any assertion failed, or env missing under STRICT mode
 * ═══════════════════════════════════════════════════════════════════════
 */

import { Client } from "pg";

// ─────────────────────────────────────────────────────────────
// ANSI colors (no chalk dep)
// ─────────────────────────────────────────────────────────────
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";

const PASS = `${GREEN}✓ pass${RESET}`;
const FAIL = (msg: string) => `${RED}✗ ${msg}${RESET}`;
const BLOCKED = `${GREEN}✓ blocked${RESET}`;
const NOT_BLOCKED = `${RED}✗ NOT blocked${RESET}`;

// ─────────────────────────────────────────────────────────────
// Roles + tables enumerated
// ─────────────────────────────────────────────────────────────
type Role = "super_admin" | "org_admin" | "property_admin" | "viewer";
const ROLES: Role[] = ["super_admin", "org_admin", "property_admin", "viewer"];

const TABLES = [
  "organizations",
  "properties",
  "hr_users",
  "employees",
  "exam_sessions",
  "diagnostic_answers",
  "listening_answers",
  "speaking_recordings",
  "practice_sessions",
  "vocabulary_progress",
  "streaks",
  "cohorts",
  "cohort_members",
  "content_items",
  "analytics_events",
] as const;
type TableName = (typeof TABLES)[number];

// ─────────────────────────────────────────────────────────────
// Expected SELECT counts per (role, table)
//
// Derived from supabase/migrations/0002_rls_hardening.sql.
// All four test users live inside org_a. Their visible counts depend on
// auth_user_property_ids():
//   super_admin_a, org_admin_a → both properties in org_a (p_a1, p_a2)
//   property_admin_a, viewer_a → only p_a1
//
// Fixture cardinalities (inside org_a):
//   2 properties; 2 employees per property = 4 employees in org_a
//   1 exam_session per employee → 4 sessions
//   1 of each (diagnostic_answer, listening_answer, speaking_recording)
//     per session → 4 of each
//   1 cohort per property → 2 cohorts; 2 cohort_members per cohort → 4
//   1 practice_session, 1 vocabulary_progress, 1 streak per employee → 4
//   1 analytics_event per property → 2
//
// content_items: any authenticated user sees rows where is_active = true.
// We seed exactly 1 active + 1 inactive content row → everyone sees 1.
//
// hr_users matrix is the most subtle:
//   Policy "hr_select": id = auth.uid() OR (is_active AND (
//     property_id IN auth_user_property_ids() OR
//     (organization_id IN own_org AND auth_user_role() IN ('super_admin','org_admin'))
//   ))
//
//   Per org we insert 4 users (one per role). property_admin/viewer carry
//   property_id=p_X1; super_admin/org_admin carry property_id=NULL.
//   Org_b mirrors. Total seeded hr_users = 8.
//
//   For super_admin_a: own row + (org_a users where active+org match) →
//     all 4 org_a users visible. Org_b users not visible. → 4
//   For org_admin_a: same logic → 4
//   For property_admin_a: own row, plus active rows where
//     property_id ∈ {p_a1} (matches viewer_a who has property_id=p_a1)
//     The org-wide branch needs role super/org_admin → does not apply.
//     property_admin_a + viewer_a both have property_id=p_a1 → 2 visible
//   For viewer_a: same logic → 2 visible (self + property_admin_a)
// ─────────────────────────────────────────────────────────────
const EXPECTED: Record<TableName, Record<Role, number>> = {
  organizations: { super_admin: 1, org_admin: 1, property_admin: 1, viewer: 1 },
  properties: { super_admin: 2, org_admin: 2, property_admin: 1, viewer: 1 },
  hr_users: { super_admin: 4, org_admin: 4, property_admin: 2, viewer: 2 },
  employees: { super_admin: 4, org_admin: 4, property_admin: 2, viewer: 2 },
  exam_sessions: { super_admin: 4, org_admin: 4, property_admin: 2, viewer: 2 },
  diagnostic_answers: {
    super_admin: 4,
    org_admin: 4,
    property_admin: 2,
    viewer: 2,
  },
  listening_answers: {
    super_admin: 4,
    org_admin: 4,
    property_admin: 2,
    viewer: 2,
  },
  speaking_recordings: {
    super_admin: 4,
    org_admin: 4,
    property_admin: 2,
    viewer: 2,
  },
  practice_sessions: {
    super_admin: 4,
    org_admin: 4,
    property_admin: 2,
    viewer: 2,
  },
  vocabulary_progress: {
    super_admin: 4,
    org_admin: 4,
    property_admin: 2,
    viewer: 2,
  },
  streaks: { super_admin: 4, org_admin: 4, property_admin: 2, viewer: 2 },
  cohorts: { super_admin: 2, org_admin: 2, property_admin: 1, viewer: 1 },
  cohort_members: {
    super_admin: 4,
    org_admin: 4,
    property_admin: 2,
    viewer: 2,
  },
  content_items: { super_admin: 1, org_admin: 1, property_admin: 1, viewer: 1 },
  analytics_events: {
    super_admin: 2,
    org_admin: 2,
    property_admin: 1,
    viewer: 1,
  },
};

// ─────────────────────────────────────────────────────────────
// Result tracking
// ─────────────────────────────────────────────────────────────
type SelectResult = {
  table: TableName;
  role: Role;
  expected: number;
  actual: number | null;
  pass: boolean;
  error?: string;
};

type WriteResult = {
  description: string;
  blocked: boolean;
  errorMessage?: string;
};

const selectResults: SelectResult[] = [];
const writeResults: WriteResult[] = [];

// ─────────────────────────────────────────────────────────────
// Fixture context — populated during seed()
// ─────────────────────────────────────────────────────────────
type Fixtures = {
  org_a: string;
  org_b: string;
  p_a1: string;
  p_a2: string;
  p_b1: string;
  p_b2: string;
  users: Record<"a" | "b", Record<Role, string>>;
  // employee samples for write-test targets
  emp_a1: string;
  emp_b1: string;
  cohort_a1: string;
  cohort_b1: string;
};

// ─────────────────────────────────────────────────────────────
// Auth GUC helpers
//
// Supabase's PostgREST sets `request.jwt.claims` as a JSON string GUC
// on every connection. auth.uid() reads `sub` out of that JSON. To
// impersonate a user inside a transaction we set the same GUC with
// SET LOCAL — it lasts only until COMMIT/ROLLBACK.
// ─────────────────────────────────────────────────────────────
async function asUser(client: Client, userId: string): Promise<void> {
  const claims = JSON.stringify({ sub: userId, role: "authenticated" });
  await client.query(`SET LOCAL ROLE authenticated`);
  // SET LOCAL with a literal — escape single quotes by doubling them.
  await client.query(
    `SET LOCAL "request.jwt.claims" = '${claims.replace(/'/g, "''")}'`
  );
}

async function resetRole(client: Client): Promise<void> {
  await client.query(`RESET ROLE`);
  await client.query(`RESET "request.jwt.claims"`);
}

// ─────────────────────────────────────────────────────────────
// Seed fixtures inside the open transaction
// ─────────────────────────────────────────────────────────────
async function seed(client: Client): Promise<Fixtures> {
  // Two organizations
  const { rows: orgA } = await client.query<{ id: string }>(
    `INSERT INTO organizations (name, type, max_properties, max_employees)
     VALUES ('Test Org A', 'chain', 10, 1000) RETURNING id`
  );
  const { rows: orgB } = await client.query<{ id: string }>(
    `INSERT INTO organizations (name, type, max_properties, max_employees)
     VALUES ('Test Org B', 'chain', 10, 1000) RETURNING id`
  );
  const org_a = orgA[0].id;
  const org_b = orgB[0].id;

  // Two properties per org
  const insertProperty = async (orgId: string, slug: string) => {
    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO properties (organization_id, name, slug)
       VALUES ($1, $2, $3) RETURNING id`,
      [orgId, `Property ${slug}`, `rls-audit-${slug}-${Date.now()}`]
    );
    return rows[0].id;
  };
  const p_a1 = await insertProperty(org_a, "a1");
  const p_a2 = await insertProperty(org_a, "a2");
  const p_b1 = await insertProperty(org_b, "b1");
  const p_b2 = await insertProperty(org_b, "b2");

  // Helper: create an auth.users row + matching hr_users row, return uid.
  // Supabase service-role connection has INSERT on auth.users.
  const insertUser = async (
    orgId: string,
    propertyId: string | null,
    role: Role,
    email: string,
    name: string
  ): Promise<string> => {
    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO auth.users (
         instance_id, id, aud, role, email, encrypted_password,
         email_confirmed_at, created_at, updated_at,
         raw_app_meta_data, raw_user_meta_data, is_super_admin
       )
       VALUES (
         '00000000-0000-0000-0000-000000000000',
         gen_random_uuid(),
         'authenticated',
         'authenticated',
         $1,
         '$2a$10$abcdefghijklmnopqrstuv',
         now(), now(), now(),
         '{"provider":"email","providers":["email"]}'::jsonb,
         '{}'::jsonb,
         false
       )
       RETURNING id`,
      [email]
    );
    const uid = rows[0].id;
    await client.query(
      `INSERT INTO hr_users (id, organization_id, property_id, email, name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)`,
      [uid, orgId, propertyId, email, name, role]
    );
    return uid;
  };

  const stamp = Date.now();
  const users: Fixtures["users"] = {
    a: {
      super_admin: await insertUser(
        org_a,
        null,
        "super_admin",
        `super-a-${stamp}@test.local`,
        "Super A"
      ),
      org_admin: await insertUser(
        org_a,
        null,
        "org_admin",
        `org-a-${stamp}@test.local`,
        "Org A"
      ),
      property_admin: await insertUser(
        org_a,
        p_a1,
        "property_admin",
        `prop-a-${stamp}@test.local`,
        "Prop A"
      ),
      viewer: await insertUser(
        org_a,
        p_a1,
        "viewer",
        `view-a-${stamp}@test.local`,
        "View A"
      ),
    },
    b: {
      super_admin: await insertUser(
        org_b,
        null,
        "super_admin",
        `super-b-${stamp}@test.local`,
        "Super B"
      ),
      org_admin: await insertUser(
        org_b,
        null,
        "org_admin",
        `org-b-${stamp}@test.local`,
        "Org B"
      ),
      property_admin: await insertUser(
        org_b,
        p_b1,
        "property_admin",
        `prop-b-${stamp}@test.local`,
        "Prop B"
      ),
      viewer: await insertUser(
        org_b,
        p_b1,
        "viewer",
        `view-b-${stamp}@test.local`,
        "View B"
      ),
    },
  };

  // 2 employees per property (8 total, 4 per org)
  const insertEmployee = async (
    propertyId: string,
    label: string
  ): Promise<string> => {
    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO employees (property_id, name, hotel_role, source, email)
       VALUES ($1, $2, 'bellboy', 'self_registered', $3)
       RETURNING id`,
      [propertyId, `Employee ${label}`, `${label}-${stamp}@test.local`]
    );
    return rows[0].id;
  };

  const employees: Record<string, string> = {};
  for (const prop of [
    ["p_a1", p_a1],
    ["p_a2", p_a2],
    ["p_b1", p_b1],
    ["p_b2", p_b2],
  ] as const) {
    employees[`${prop[0]}_e1`] = await insertEmployee(prop[1], `${prop[0]}-e1`);
    employees[`${prop[0]}_e2`] = await insertEmployee(prop[1], `${prop[0]}-e2`);
  }

  // 1 exam session per employee + dependent answers/recordings
  for (const empKey of Object.keys(employees)) {
    const empId = employees[empKey];
    const { rows: sessRows } = await client.query<{ id: string }>(
      `INSERT INTO exam_sessions (employee_id, module, exam_type, status)
       VALUES ($1, 'bellboy', 'placement', 'in_progress')
       RETURNING id`,
      [empId]
    );
    const sessionId = sessRows[0].id;
    await client.query(
      `INSERT INTO diagnostic_answers (session_id, question_index, answer_value)
       VALUES ($1, 0, '{"v":"a"}'::jsonb)`,
      [sessionId]
    );
    await client.query(
      `INSERT INTO listening_answers (session_id, question_index, selected_option, is_correct, level_tag)
       VALUES ($1, 0, 1, true, 'A1')`,
      [sessionId]
    );
    await client.query(
      `INSERT INTO speaking_recordings (session_id, prompt_index, audio_url, level_tag)
       VALUES ($1, 0, 'fixture://test.webm', 'A1')`,
      [sessionId]
    );
    await client.query(
      `INSERT INTO practice_sessions (employee_id, channel)
       VALUES ($1, 'web')`,
      [empId]
    );
    await client.query(
      `INSERT INTO vocabulary_progress (employee_id, word, module, level)
       VALUES ($1, $2, 'bellboy', 'A1')`,
      [empId, `word-${empKey}`]
    );
    await client.query(
      `INSERT INTO streaks (employee_id, current_streak, longest_streak)
       VALUES ($1, 1, 1)`,
      [empId]
    );
  }

  // 1 cohort per property + 2 cohort_members each
  const cohorts: Record<string, string> = {};
  for (const [propKey, propId, e1Key, e2Key] of [
    ["p_a1", p_a1, "p_a1_e1", "p_a1_e2"],
    ["p_a2", p_a2, "p_a2_e1", "p_a2_e2"],
    ["p_b1", p_b1, "p_b1_e1", "p_b1_e2"],
    ["p_b2", p_b2, "p_b2_e1", "p_b2_e2"],
  ] as const) {
    const { rows: cRows } = await client.query<{ id: string }>(
      `INSERT INTO cohorts (property_id, name, module, target_level, start_date, end_date)
       VALUES ($1, $2, 'bellboy', 'A1', current_date, current_date + 30)
       RETURNING id`,
      [propId, `Cohort ${propKey}`]
    );
    const cohortId = cRows[0].id;
    cohorts[propKey] = cohortId;
    await client.query(
      `INSERT INTO cohort_members (cohort_id, employee_id) VALUES ($1, $2), ($1, $3)`,
      [cohortId, employees[e1Key], employees[e2Key]]
    );
  }

  // 2 content items: one active, one inactive
  await client.query(
    `INSERT INTO content_items (module, level, skill, item_type, is_active, audio_text)
     VALUES ('bellboy', 'A1', 'listening', 'exam', true, 'active fixture')`
  );
  await client.query(
    `INSERT INTO content_items (module, level, skill, item_type, is_active, audio_text)
     VALUES ('bellboy', 'A1', 'listening', 'exam', false, 'inactive fixture')`
  );

  // 1 analytics event per property
  for (const pid of [p_a1, p_a2, p_b1, p_b2]) {
    await client.query(
      `INSERT INTO analytics_events (event_type, property_id, metadata)
       VALUES ('rls_audit_seed', $1, '{"audit":true}'::jsonb)`,
      [pid]
    );
  }

  return {
    org_a,
    org_b,
    p_a1,
    p_a2,
    p_b1,
    p_b2,
    users,
    emp_a1: employees["p_a1_e1"],
    emp_b1: employees["p_b1_e1"],
    cohort_a1: cohorts["p_a1"],
    cohort_b1: cohorts["p_b1"],
  };
}

// ─────────────────────────────────────────────────────────────
// SELECT count assertions
// ─────────────────────────────────────────────────────────────
async function runSelectAudits(
  client: Client,
  fx: Fixtures
): Promise<void> {
  for (const role of ROLES) {
    const userId = fx.users.a[role];
    for (const table of TABLES) {
      const expected = EXPECTED[table][role];
      // Use a savepoint so a per-query failure doesn't poison the outer tx.
      await client.query("SAVEPOINT sp_select");
      try {
        await asUser(client, userId);
        const { rows } = await client.query<{ c: string }>(
          `SELECT count(*)::text AS c FROM public.${table}`
        );
        const actual = Number(rows[0].c);
        await resetRole(client);
        await client.query("RELEASE SAVEPOINT sp_select");
        const pass = actual === expected;
        selectResults.push({ table, role, expected, actual, pass });
      } catch (err) {
        await client.query("ROLLBACK TO SAVEPOINT sp_select");
        await client.query("RELEASE SAVEPOINT sp_select");
        selectResults.push({
          table,
          role,
          expected,
          actual: null,
          pass: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Cross-tenant + role-violation INSERT assertions
// ─────────────────────────────────────────────────────────────
type WriteAttempt = {
  description: string;
  asUserId: string;
  sql: string;
  params: unknown[];
};

async function runWriteAudits(
  client: Client,
  fx: Fixtures
): Promise<void> {
  const attempts: WriteAttempt[] = [
    // Cross-tenant employees insert: property_admin_a → p_b1
    {
      description: "property_admin_a INSERT employees into p_b1 (cross-tenant)",
      asUserId: fx.users.a.property_admin,
      sql: `INSERT INTO employees (property_id, name, hotel_role, source) VALUES ($1, 'X', 'bellboy', 'self_registered')`,
      params: [fx.p_b1],
    },
    // Cross-tenant employees insert: org_admin_a → p_b1
    {
      description: "org_admin_a INSERT employees into p_b1 (cross-org)",
      asUserId: fx.users.a.org_admin,
      sql: `INSERT INTO employees (property_id, name, hotel_role, source) VALUES ($1, 'X', 'bellboy', 'self_registered')`,
      params: [fx.p_b1],
    },
    // Viewer cannot INSERT employees even into own property
    {
      description: "viewer_a INSERT employees into own p_a1 (role-blocked)",
      asUserId: fx.users.a.viewer,
      sql: `INSERT INTO employees (property_id, name, hotel_role, source) VALUES ($1, 'X', 'bellboy', 'self_registered')`,
      params: [fx.p_a1],
    },
    // Cross-tenant cohort insert
    {
      description: "property_admin_a INSERT cohorts into p_b1 (cross-tenant)",
      asUserId: fx.users.a.property_admin,
      sql: `INSERT INTO cohorts (property_id, name, module, target_level, start_date, end_date) VALUES ($1, 'X', 'bellboy', 'A1', current_date, current_date + 1)`,
      params: [fx.p_b1],
    },
    // Viewer cannot INSERT cohort
    {
      description: "viewer_a INSERT cohorts into own p_a1 (role-blocked)",
      asUserId: fx.users.a.viewer,
      sql: `INSERT INTO cohorts (property_id, name, module, target_level, start_date, end_date) VALUES ($1, 'X', 'bellboy', 'A1', current_date, current_date + 1)`,
      params: [fx.p_a1],
    },
    // Cross-tenant cohort_members
    {
      description:
        "property_admin_a INSERT cohort_members into cohort_b1 (cross-tenant)",
      asUserId: fx.users.a.property_admin,
      sql: `INSERT INTO cohort_members (cohort_id, employee_id) VALUES ($1, $2)`,
      params: [fx.cohort_b1, fx.emp_b1],
    },
    // Cross-tenant property insert (org_admin_a trying to add to org_b)
    {
      description:
        "org_admin_a INSERT properties into org_b (cross-org property add)",
      asUserId: fx.users.a.org_admin,
      sql: `INSERT INTO properties (organization_id, name, slug) VALUES ($1, 'X', 'rls-test-block-' || extract(epoch from now())::text)`,
      params: [fx.org_b],
    },
    // property_admin cannot INSERT properties at all (role-blocked)
    {
      description: "property_admin_a INSERT properties (role-blocked)",
      asUserId: fx.users.a.property_admin,
      sql: `INSERT INTO properties (organization_id, name, slug) VALUES ($1, 'X', 'rls-test-block2-' || extract(epoch from now())::text)`,
      params: [fx.org_a],
    },
    // Non-super_admin INSERT into content_items
    {
      description: "org_admin_a INSERT content_items (role-blocked)",
      asUserId: fx.users.a.org_admin,
      sql: `INSERT INTO content_items (module, level, skill, item_type, is_active) VALUES ('bellboy', 'A1', 'listening', 'exam', true)`,
      params: [],
    },
    // viewer_a cannot UPDATE own hr_users to escalate role
    // (this one is via UPDATE — included for completeness; INSERT-style audit)
    {
      description: "viewer_a UPDATE hr_users set role=super_admin (escalation)",
      asUserId: fx.users.a.viewer,
      // hr_update_self lets you write your OWN row, but role isn't column-restricted at the
      // policy level — this assertion documents an open question. Track A may need a column
      // grant or a CHECK to truly block this. We assert blocked, but if it succeeds the
      // failure surfaces here instead of being silently OK.
      sql: `UPDATE hr_users SET role = 'super_admin' WHERE id = $1`,
      params: [fx.users.a.viewer],
    },
  ];

  for (const att of attempts) {
    await client.query("SAVEPOINT sp_write");
    let blocked = false;
    let errorMessage: string | undefined;
    try {
      await asUser(client, att.asUserId);
      const res = await client.query(att.sql, att.params as unknown[]);
      // For INSERT, if no exception was thrown, RLS did NOT block.
      // For UPDATE, rowCount === 0 also counts as blocked (RLS hides the row).
      const isUpdate = att.sql.trim().toUpperCase().startsWith("UPDATE");
      if (isUpdate && res.rowCount === 0) {
        blocked = true;
      } else {
        blocked = false;
      }
      await resetRole(client);
      await client.query("ROLLBACK TO SAVEPOINT sp_write");
      await client.query("RELEASE SAVEPOINT sp_write");
    } catch (err) {
      blocked = true;
      errorMessage = err instanceof Error ? err.message : String(err);
      await client.query("ROLLBACK TO SAVEPOINT sp_write");
      await client.query("RELEASE SAVEPOINT sp_write");
    }
    writeResults.push({
      description: att.description,
      blocked,
      errorMessage,
    });
  }
}

// ─────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────
function printReport(): boolean {
  const now = new Date().toISOString().replace("T", " ").replace(/\..+/, "");
  console.log(`\n${BOLD}RLS Audit — ${now}${RESET}`);
  console.log(
    "─────────────────────────────────────────────────────────────────"
  );

  const headers = ["table".padEnd(22), ...ROLES.map((r) => r.padEnd(16))];
  console.log(`${DIM}${headers.join("")}${RESET}`);

  for (const table of TABLES) {
    const cells = [table.padEnd(22)];
    for (const role of ROLES) {
      const r = selectResults.find(
        (x) => x.table === table && x.role === role
      );
      if (!r) {
        cells.push(`${YELLOW}? missing${RESET}`.padEnd(16 + 9));
        continue;
      }
      if (r.pass) {
        cells.push(PASS.padEnd(16 + 9));
      } else {
        const detail = r.error
          ? `err`
          : `${r.actual ?? "null"}≠${r.expected}`;
        cells.push(FAIL(detail).padEnd(16 + 9));
      }
    }
    console.log(cells.join(""));
  }

  console.log(
    "─────────────────────────────────────────────────────────────────"
  );
  console.log(`${BOLD}Cross-tenant write blocks:${RESET}`);
  for (const w of writeResults) {
    const status = w.blocked ? BLOCKED : NOT_BLOCKED;
    console.log(`  ${w.description.padEnd(64)} ${status}`);
  }

  // Detailed failure dump
  const selectFails = selectResults.filter((r) => !r.pass);
  const writeFails = writeResults.filter((w) => !w.blocked);

  if (selectFails.length > 0 || writeFails.length > 0) {
    console.log(`\n${RED}${BOLD}Failures:${RESET}`);
    for (const f of selectFails) {
      console.log(
        `  ${RED}SELECT${RESET} ${f.table} as ${f.role}: expected ${f.expected}, got ${
          f.actual ?? "null"
        }${f.error ? ` (${f.error})` : ""}`
      );
    }
    for (const f of writeFails) {
      console.log(
        `  ${RED}WRITE NOT BLOCKED${RESET} ${f.description}${
          f.errorMessage ? ` — ${f.errorMessage}` : ""
        }`
      );
    }
  }

  const totalSelect = selectResults.length;
  const passedSelect = selectResults.filter((r) => r.pass).length;
  const totalWrite = writeResults.length;
  const passedWrite = writeResults.filter((w) => w.blocked).length;
  const total = totalSelect + totalWrite;
  const passed = passedSelect + passedWrite;

  console.log(
    "─────────────────────────────────────────────────────────────────"
  );
  const summary = `${passed} / ${total} passed`;
  if (passed === total) {
    console.log(`${GREEN}${BOLD}Result: ${summary}${RESET}\n`);
  } else {
    console.log(`${RED}${BOLD}Result: ${summary}${RESET}\n`);
  }
  return passed === total;
}

// ─────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const dbUrl = process.env.SUPABASE_DB_URL;
  const strict = process.env.STRICT_RLS_AUDIT === "true";

  if (!dbUrl) {
    if (strict) {
      console.error(
        `${RED}${BOLD}SUPABASE_DB_URL is required when STRICT_RLS_AUDIT=true${RESET}`
      );
      process.exit(1);
    }
    console.warn(
      `${YELLOW}SUPABASE_DB_URL not set — skipping RLS audit (set STRICT_RLS_AUDIT=true to fail).${RESET}`
    );
    process.exit(0);
  }

  const client = new Client({
    connectionString: dbUrl,
    // Supabase pooler requires SSL; node-postgres needs us to disable strict
    // CA verification because the pooler presents a non-default cert chain.
    ssl: { rejectUnauthorized: false },
  });

  console.log(`${CYAN}Connecting to Supabase…${RESET}`);
  await client.connect();

  let allPassed = false;
  try {
    await client.query("BEGIN");
    console.log(`${CYAN}Seeding fixtures…${RESET}`);
    const fx = await seed(client);
    console.log(`${CYAN}Running SELECT audits (15 tables × 4 roles = 60)…${RESET}`);
    await runSelectAudits(client, fx);
    console.log(`${CYAN}Running cross-tenant write audits…${RESET}`);
    await runWriteAudits(client, fx);
    // ALWAYS roll back. Test data must never persist.
    await client.query("ROLLBACK");
    allPassed = printReport();
  } catch (err) {
    // Surface the seed/setup error before bailing.
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    console.error(`\n${RED}${BOLD}Audit aborted:${RESET}`, err);
    await client.end();
    process.exit(1);
  } finally {
    await client.end();
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error(`${RED}${BOLD}Unhandled error:${RESET}`, err);
  process.exit(1);
});
