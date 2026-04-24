import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { CEFRLevel, Json } from "@/lib/supabase/types";

/**
 * POST /api/exams/[id]/answer
 * Idempotent upsert of a diagnostic or listening answer by (session, index).
 * Supabase optional — returns ok regardless so the exam keeps flowing.
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = (await req.json().catch(() => ({}))) as {
    kind?: "diagnostic" | "listening";
    question_index?: number;
    answer_value?: unknown; // for diagnostic (string or string[])
    selected_option?: number; // for listening
    is_correct?: boolean;
    level_tag?: CEFRLevel;
    response_time_ms?: number;
    replay_count?: number;
  };

  if (!body.kind || typeof body.question_index !== "number") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // No Supabase: acknowledge without persisting.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  try {
    const supabase = createServiceClient();
    if (body.kind === "diagnostic") {
      await supabase
        .from("diagnostic_answers")
        .upsert(
          {
            session_id: params.id,
            question_index: body.question_index,
            answer_value: body.answer_value as Json,
          },
          { onConflict: "session_id,question_index" },
        );
    } else {
      await supabase
        .from("listening_answers")
        .upsert(
          {
            session_id: params.id,
            question_index: body.question_index,
            selected_option: body.selected_option ?? 0,
            is_correct: Boolean(body.is_correct),
            level_tag: body.level_tag ?? "A1",
            response_time_ms: body.response_time_ms ?? null,
            replay_count: body.replay_count ?? 0,
          },
          { onConflict: "session_id,question_index" },
        );
    }
    return NextResponse.json({ ok: true, mode: "persisted" });
  } catch {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }
}
