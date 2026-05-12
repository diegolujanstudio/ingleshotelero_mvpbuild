import "server-only";

/**
 * GET/POST /api/cron/score-pending
 *
 * Drains up to 10 pending speaking_recordings rows in a single invocation.
 * Designed to be called from a Netlify scheduled function (every minute) or
 * any external cron.
 *
 * Auth: requires `?token=<INTERNAL_API_TOKEN>` query param OR an
 * `Authorization: Bearer <INTERNAL_API_TOKEN>` header. Without the env var
 * set the endpoint is open in dev (logs a warning on every call).
 *
 * Response:
 *   { ok: true, attempted, succeeded, failed }
 */
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { claimPending } from "@/lib/server/scoring";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";

export const runtime = "nodejs";
// Don't cache at the edge.
export const dynamic = "force-dynamic";

const BATCH_SIZE = 10;

function authorize(req: Request): boolean {
  const token = process.env.INTERNAL_API_TOKEN;
  if (!token) {
    log.warn({}, "cron.score-pending.open — INTERNAL_API_TOKEN unset");
    return true;
  }
  const url = new URL(req.url);
  const queryToken = url.searchParams.get("token");
  const header = req.headers.get("authorization");
  const bearer = header?.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : null;
  return queryToken === token || bearer === token;
}

async function handle(req: Request): Promise<NextResponse> {
  if (!authorize(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "local-only",
      attempted: 0,
      succeeded: 0,
      failed: 0,
    });
  }
  try {
    const out = await claimPending(BATCH_SIZE);
    const attempted = out.length;
    const succeeded = out.filter((r) => r.status === "complete").length;
    const failed = out.filter((r) => r.status === "failed").length;
    log.info(
      { route: "cron.score-pending", attempted, succeeded, failed },
      "cron.score-pending.done",
    );
    return NextResponse.json({
      ok: true,
      mode: "persisted",
      attempted,
      succeeded,
      failed,
      results: out,
    });
  } catch (err) {
    captureException(err, { route: "cron.score-pending", data: { batch: BATCH_SIZE } });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
