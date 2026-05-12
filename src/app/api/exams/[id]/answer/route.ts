import { NextResponse } from "next/server";
import { z } from "zod";
import {
  recordDiagnosticAnswer,
  recordListeningAnswer,
} from "@/lib/server/exam";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { captureException } from "@/lib/server/sentry";

export const runtime = "nodejs";

const idSchema = z.string().uuid();

const baseSchema = z.object({
  question_index: z.number().int().min(0).max(50),
});

const diagnosticSchema = baseSchema.extend({
  kind: z.literal("diagnostic"),
  answer_value: z.unknown(),
});

const listeningSchema = baseSchema.extend({
  kind: z.literal("listening"),
  selected_option: z.number().int().min(0).max(10),
  is_correct: z.boolean(),
  level_tag: z.enum(["A1", "A2", "B1", "B2"]),
  response_time_ms: z.number().int().min(0).max(600_000).optional().nullable(),
  replay_count: z.number().int().min(0).max(20).optional(),
});

const schema = z.discriminatedUnion("kind", [diagnosticSchema, listeningSchema]);

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const idCheck = idSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false, mode: "local-only" });
  }

  try {
    const result =
      parsed.data.kind === "diagnostic"
        ? await recordDiagnosticAnswer({
            session_id: params.id,
            question_index: parsed.data.question_index,
            answer_value: parsed.data.answer_value,
          })
        : await recordListeningAnswer({
            session_id: params.id,
            question_index: parsed.data.question_index,
            selected_option: parsed.data.selected_option,
            is_correct: parsed.data.is_correct,
            level_tag: parsed.data.level_tag,
            response_time_ms: parsed.data.response_time_ms ?? null,
            replay_count: parsed.data.replay_count ?? 0,
          });
    return NextResponse.json({
      ok: true,
      persisted: result.persisted,
      mode: "persisted",
    });
  } catch (err) {
    const code = (err as Error & { code?: string }).code;
    if (code === "SESSION_NOT_FOUND") {
      return NextResponse.json({ error: "session_not_found" }, { status: 404 });
    }
    if (code === "INVALID_STATUS") {
      return NextResponse.json({ error: "invalid_status" }, { status: 409 });
    }
    captureException(err, {
      route: "POST /api/exams/:id/answer",
      data: { id: params.id, kind: parsed.data.kind, question_index: parsed.data.question_index },
    });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
