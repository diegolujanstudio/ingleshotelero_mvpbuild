import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { captureException } from "@/lib/server/sentry";
import type { Database } from "@/lib/supabase/types";

type ExamSessionUpdate = Database["public"]["Tables"]["exam_sessions"]["Update"];

export const runtime = "nodejs";

const idSchema = z.string().uuid();

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const idCheck = idSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "demo_mode", message: "session lives in client localStorage only" },
      { status: 404 },
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "demo_mode" }, { status: 404 });
  }

  try {
    const { data: session } = await supabase
      .from("exam_sessions")
      .select(
        "id, employee_id, module, exam_type, status, current_step, listening_score, listening_total, speaking_avg_score, final_level, level_confidence, started_at, completed_at, scored_at",
      )
      .eq("id", params.id)
      .maybeSingle();
    if (!session) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const [{ count: diagnosticCount }, { data: listening }, { data: speaking }] =
      await Promise.all([
        supabase
          .from("diagnostic_answers")
          .select("id", { count: "exact", head: true })
          .eq("session_id", params.id),
        supabase
          .from("listening_answers")
          .select("question_index, is_correct, level_tag")
          .eq("session_id", params.id)
          .order("question_index", { ascending: true }),
        supabase
          .from("speaking_recordings")
          .select(
            "prompt_index, scoring_status, ai_score_total, ai_feedback_es, ai_model_response, ai_level_estimate",
          )
          .eq("session_id", params.id)
          .order("prompt_index", { ascending: true }),
      ]);

    return NextResponse.json({
      ...session,
      diagnostic_answers: diagnosticCount ?? 0,
      listening_answers: listening ?? [],
      speaking_recordings: speaking ?? [],
    });
  } catch (err) {
    captureException(err, { route: "GET /api/exams/:id", data: { id: params.id } });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// Legacy PATCH preserved for the existing client (writes through to a few
// fields). New code should use /finalize-listening or post answers instead.
const patchSchema = z.object({
  current_step: z.string().max(40).optional(),
  status: z
    .enum([
      "in_progress",
      "listening_done",
      "speaking_done",
      "scoring",
      "complete",
      "abandoned",
    ])
    .optional(),
  listening_score: z.number().min(0).max(100).optional(),
  listening_total: z.number().int().min(0).max(50).optional(),
  speaking_avg_score: z.number().min(0).max(100).optional(),
  final_level: z.enum(["A1", "A2", "B1", "B2"]).optional(),
  level_confidence: z.number().min(0).max(1).optional(),
  completed: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const idCheck = idSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ ok: true, mode: "local-only" });

  const patch: ExamSessionUpdate = {};
  if (parsed.data.current_step) patch.current_step = parsed.data.current_step;
  if (parsed.data.status) patch.status = parsed.data.status;
  if (typeof parsed.data.listening_score === "number")
    patch.listening_score = parsed.data.listening_score;
  if (typeof parsed.data.listening_total === "number")
    patch.listening_total = parsed.data.listening_total;
  if (typeof parsed.data.speaking_avg_score === "number")
    patch.speaking_avg_score = parsed.data.speaking_avg_score;
  if (parsed.data.final_level) patch.final_level = parsed.data.final_level;
  if (typeof parsed.data.level_confidence === "number")
    patch.level_confidence = parsed.data.level_confidence;
  if (parsed.data.completed) patch.completed_at = new Date().toISOString();

  try {
    if (Object.keys(patch).length > 0) {
      await supabase.from("exam_sessions").update(patch).eq("id", params.id);
    }
    return NextResponse.json({ ok: true, mode: "persisted" });
  } catch (err) {
    captureException(err, {
      route: "PATCH /api/exams/:id",
      data: { id: params.id, fields: Object.keys(patch) },
    });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
