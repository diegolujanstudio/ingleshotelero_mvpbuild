import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { applyReview } from "@/lib/practice/vocab";
import { captureException } from "@/lib/server/sentry";

export const runtime = "nodejs";

const bodySchema = z.object({
  employee_id: z.string().uuid(),
  word: z.string().min(1).max(80),
  module: z.enum(["bellboy", "frontdesk", "restaurant"]),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  grade: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
});

/**
 * POST /api/practice/vocab/review
 *
 * Records an SM-2 grade for one vocabulary word. Returns the new
 * scheduling state so the client can show a "next review in N days"
 * confirmation if it wants.
 *
 * Demo mode: returns a synthetic OK; nothing persists. SM-2 math is
 * still pure-functional so the client can compute its own preview.
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

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  try {
    const result = await applyReview(input);
    if (!result) {
      return NextResponse.json({ ok: false, error: "write_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, mode: "live", ...result });
  } catch (err) {
    captureException(err, {
      route: "POST /api/practice/vocab/review",
      data: { employee_id: input.employee_id, word: input.word },
    });
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
