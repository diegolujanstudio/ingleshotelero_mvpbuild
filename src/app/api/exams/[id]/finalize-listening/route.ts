import { NextResponse } from "next/server";
import { z } from "zod";
import { finalizeListening } from "@/lib/server/exam";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { captureException } from "@/lib/server/sentry";

export const runtime = "nodejs";

const idSchema = z.string().uuid();

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const idCheck = idSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  try {
    // finalizeListening is now forward-only + completeness-gated: replays on an
    // already-advanced session are a no-op, and an incomplete set is reported
    // (incomplete: true) without regressing status or persisting a wrong score.
    const result = await finalizeListening(params.id);
    // Incomplete = the final answer(s) haven't committed yet (a slow-commit /
    // in-flight race). Return a transient 5xx so the offline api-client
    // re-queues the finalize; the offline drain's per-session ordering barrier
    // replays the outstanding answers first, and the retry then finalizes over
    // the full set. Returning 200 here would let the client treat it as done
    // and lock in a listening-less score.
    if (result.incomplete) {
      return NextResponse.json(
        { error: "answers_incomplete", ...result },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, mode: "persisted", ...result });
  } catch (err) {
    // Genuinely-absent session → 404 (permanent). Any other error is treated as
    // transient and returns 5xx so the offline client re-queues the finalize
    // rather than dropping it.
    const code = (err as Error & { code?: string }).code;
    if (code === "SESSION_NOT_FOUND") {
      return NextResponse.json({ error: "session_not_found" }, { status: 404 });
    }
    captureException(err, {
      route: "POST /api/exams/:id/finalize-listening",
      data: { id: params.id },
    });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
