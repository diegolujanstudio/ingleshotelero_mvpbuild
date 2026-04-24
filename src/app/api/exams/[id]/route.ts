import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ExamSessionUpdate = Database["public"]["Tables"]["exam_sessions"]["Update"];

/**
 * PATCH /api/exams/[id]
 * Update session status or aggregates. Best-effort — if Supabase isn't wired
 * we still return 200 so the client doesn't break.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  const body = await req.json().catch(() => ({}));
  try {
    const supabase = createServiceClient();
    const patch: ExamSessionUpdate = {};
    if (typeof body.current_step === "string") patch.current_step = body.current_step;
    if (typeof body.status === "string") patch.status = body.status;
    if (typeof body.listening_score === "number") patch.listening_score = body.listening_score;
    if (typeof body.speaking_avg_score === "number")
      patch.speaking_avg_score = body.speaking_avg_score;
    if (typeof body.final_level === "string") patch.final_level = body.final_level;
    if (typeof body.level_confidence === "number")
      patch.level_confidence = body.level_confidence;
    if (body.completed) patch.completed_at = new Date().toISOString();

    if (Object.keys(patch).length > 0) {
      await supabase.from("exam_sessions").update(patch).eq("id", params.id);
    }
    return NextResponse.json({ ok: true, mode: "persisted" });
  } catch {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }
}
