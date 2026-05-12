import "server-only";

/**
 * POST /api/exams/[id]/finalize
 *
 * Server-side state-machine transition. Body: `{ to: <next status> }`
 * where `to` is one of `listening_done | speaking_done | scoring | complete`.
 *
 * - `listening_done` → recompute weighted listening_score from
 *   listening_answers and persist; set current_step = 'speaking'.
 * - `speaking_done`  → set current_step = 'results'.
 * - `scoring`        → mark waiting on the worker; no aggregate change.
 * - `complete`       → set completed_at if not already; assumes the worker
 *   has already populated final_level + speaking_avg_score.
 *
 * Idempotent — repeated calls don't double-write timestamps. Each transition
 * checks the current status to avoid moving backwards.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/client-or-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { captureException } from "@/lib/server/sentry";
import { finalizeListening } from "@/lib/server/exam";
import { jsonError, jsonOk, parseBody, zUuid } from "@/lib/server/api";

export const runtime = "nodejs";

const Body = z.object({
  to: z.enum(["listening_done", "speaking_done", "scoring", "complete"]),
});

const FORWARD_ORDER: Record<string, number> = {
  in_progress: 0,
  listening_done: 1,
  speaking_done: 2,
  scoring: 3,
  complete: 4,
  abandoned: 99,
};

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const idCheck = zUuid.safeParse(params.id);
  if (!idCheck.success) return jsonError("invalid_id", "Sesión inválida.", 400);

  const ip = getClientIp(req);
  const rl = await checkRateLimit("exams", ip);
  if (!rl.ok) {
    return new NextResponse(JSON.stringify({ error: { code: "rate_limited", message: "Demasiadas solicitudes." } }), {
      status: 429,
      headers: { "content-type": "application/json", "retry-after": "60" },
    });
  }

  const parsed = await parseBody(req, Body, "POST /api/exams/:id/finalize");
  if (!parsed.ok) return parsed.response;
  const target = parsed.data.to;

  if (!isSupabaseConfigured()) {
    // Demo mode: acknowledge but do nothing.
    return jsonOk({ ok: true, mode: "local-only", to: target });
  }
  const supabase = createServiceClient();
  if (!supabase) return jsonOk({ ok: true, mode: "local-only", to: target });

  try {
    const { data: session } = await supabase
      .from("exam_sessions")
      .select("id, status, current_step, listening_score, speaking_avg_score, final_level")
      .eq("id", params.id)
      .maybeSingle();
    if (!session) return jsonError("session_not_found", "Sesión no encontrada.", 404);

    const currentRank = FORWARD_ORDER[session.status] ?? 0;
    const targetRank = FORWARD_ORDER[target] ?? 0;

    // No-op when we're already at or past the requested status.
    if (currentRank >= targetRank) {
      return jsonOk({
        ok: true,
        mode: "persisted",
        from: session.status,
        to: session.status,
        unchanged: true,
      });
    }

    if (target === "listening_done") {
      const result = await finalizeListening(params.id);
      return jsonOk({
        ok: true,
        mode: "persisted",
        from: session.status,
        to: result.status,
        listening_score: result.listening_score,
        listening_total: result.listening_total,
        current_step: result.current_step,
      });
    }

    if (target === "speaking_done") {
      await supabase
        .from("exam_sessions")
        .update({ status: "speaking_done", current_step: "results" })
        .eq("id", params.id);
      return jsonOk({ ok: true, mode: "persisted", from: session.status, to: "speaking_done" });
    }

    if (target === "scoring") {
      await supabase
        .from("exam_sessions")
        .update({ status: "scoring" })
        .eq("id", params.id);
      return jsonOk({ ok: true, mode: "persisted", from: session.status, to: "scoring" });
    }

    // target === "complete"
    await supabase
      .from("exam_sessions")
      .update({
        status: "complete",
        completed_at: new Date().toISOString(),
        scored_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    return jsonOk({ ok: true, mode: "persisted", from: session.status, to: "complete" });
  } catch (err) {
    captureException(err, {
      route: "POST /api/exams/:id/finalize",
      data: { id: params.id, to: target },
    });
    return jsonError("server_error", "Error interno.", 500);
  }
}
