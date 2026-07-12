import { NextResponse } from "next/server";
import { z } from "zod";
import { recordDrillCompletion } from "@/lib/practice/complete";
import { captureException } from "@/lib/server/sentry";

export const runtime = "nodejs";

const bodySchema = z.object({
  employee_id: z.string().uuid(),
  drill_id: z.string().min(1).max(120),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  module: z.enum(["bellboy", "frontdesk", "restaurant"]),
  listening_correct: z.boolean().nullable().optional(),
  speaking_score: z.number().int().min(0).max(100).nullable().optional(),
  vocab_known: z.number().int().min(0).max(20).optional(),
  duration_seconds: z.number().int().min(0).max(3600).optional(),
});

/**
 * POST /api/practice/complete — web daily-drill completion.
 *
 * Thin wrapper over the shared recordDrillCompletion() helper (also used
 * by the WhatsApp engine) so the web and WhatsApp channels record drills
 * identically. Demo mode returns a synthetic OK with a zero streak.
 */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  try {
    const result = await recordDrillCompletion({ ...input, channel: "web" });
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      streak: {
        current: result.streak.current_streak,
        longest: result.streak.longest_streak,
        last_practice_date: result.streak.last_practice_date,
        ticked: result.streak.ticked,
      },
    });
  } catch (err) {
    captureException(err, {
      route: "POST /api/practice/complete",
      data: { employee_id: input.employee_id, drill_id: input.drill_id },
    });
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
