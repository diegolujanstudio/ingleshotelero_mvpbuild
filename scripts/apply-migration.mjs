#!/usr/bin/env node
/**
 * Apply a SQL migration directly to production Supabase via pg.
 *
 * Usage:
 *   set -a; source ../../../.env.local; set +a
 *   node scripts/apply-migration.mjs supabase/migrations/0007_employee_access_tokens.sql
 *
 * Reads SUPABASE_DB_PASSWORD + the project URL to construct a pooler
 * connection string, then runs the SQL file. Idempotent on
 * `create table if not exists` migrations.
 */
import { readFile } from "node:fs/promises";
import pg from "pg";

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-sql>");
  process.exit(1);
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const PASSWORD = process.env.SUPABASE_DB_PASSWORD;
if (!SUPABASE_URL || !PASSWORD) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_DB_PASSWORD — source .env.local first.",
  );
  process.exit(1);
}

// Project ref is the subdomain of the Supabase URL: https://<ref>.supabase.co
const ref = new URL(SUPABASE_URL).hostname.split(".")[0];

// Session-mode pooler (port 5432) — supports DDL statements.
const conn = `postgresql://postgres.${ref}:${encodeURIComponent(PASSWORD)}@aws-1-us-east-2.pooler.supabase.com:5432/postgres`;

// Supabase pooler uses TLS with a Supabase-issued cert that may not chain to
// a public CA in the local trust store; the connection IS over TLS, we just
// don't pin the chain.
const client = new pg.Client({
  connectionString: conn,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log(`[apply-migration] Connecting to project ${ref}...`);
  await client.connect();
  console.log(`[apply-migration] Connected. Reading ${sqlFile}...`);
  const sql = await readFile(sqlFile, "utf-8");
  console.log(`[apply-migration] Applying ${sql.length} bytes of SQL...`);
  await client.query(sql);
  console.log(`[apply-migration] ✓ Migration applied successfully.`);
}

main()
  .catch((err) => {
    console.error(`[apply-migration] ✗ Failed:`, err.message);
    process.exit(1);
  })
  .finally(() => client.end());
