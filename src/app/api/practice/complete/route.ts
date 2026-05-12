import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client-or-service";
import { tickStreak, isoDate } from "@/lib/practice/streak";
import { captureException } from "@/lib/server/sentry";
import { log } from "@/lib/server/log";
import type { Json } from "@/lib/supabase/types";

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
 * POST /api/practice/complete
 *
 * Records a drill completion. The work, in order:
 *   1. Insert drill_history (deduped per (employee, drill, calendar
 *      day) — same drill twice the same day is collapsed).
 *   2. Upsert practice_sessions for today (one row per employee per
 *      calendar day).
 *   3. Tick the streak server-side. Idempotent for the same calendar
 *      day.
 *   4. Best-effort analytics_events row.
 *
 * Returns { ok, streak: { current, longest, last_practice_date } }.
 *
 * Demo mode: returns a synthetic OK with zero streak so the client
 * can still flow into /practice/done; the client falls back to its
 * localStorage streak in that branch.
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
    return NextResponse.json({
      ok: true,
      mode: "demo",
      streak: { current: 0, longest: 0, last_practice_date: null },
    });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      streak: { current: 0, longest: 0, last_practice_date: null },
    });
  }

  const today = new Date();
  const dayStr = isoDate(today);

  try {
    // 1. drill_history — dedupe within the calendar day.
    const startOfDay = `${dayStr}T00:00:00.000Z`;
    const endOfDay = `${dayStr}T23:59:59.999Z`;
    const { data: existing } = await supabase
      .from("drill_history")
      .select("id")
      .eq("employee_id", input.employee_id)
      .eq("drill_id", input.drill_id)
      .gte("completed_at", startOfDay)
      .lte("completed_at", endOfDay)
      .maybeSingle();
    if (!existing) {
      const { error: histErr } = await supabase.from("drill_history").insert({
        employee_id: input.employee_id,
        drill_id: input.drill_id,
        level: input.level,
        module: input.module,
        listening_correct: input.listening_correct ?? null,
        speaking_score: input.speaking_score ?? null,
        vocab_known: input.vocab_known ?? 0,
        duration_seconds: input.duration_seconds ?? null,
      });
      if (histErr) {
        log.warn(
          { err: histErr.message, employee_id: input.employee_id },
          "practice.complete.history.failed",
        );
      }
    }

    // 2. practice_sessions — upsert one per (employee, date).
    const { error: sessErr } = await supabase
      .from("practice_sessions")
      .upsert(
        {
          employee_id: input.employee_id,
          date: dayStr,
          channel: "web",
          listening_correct:
            typeof input.listening_correct === "boolean"
              ? input.listening_correct
                ? 1
                : 0
              : null,
          speaking_score: input.speaking_score ?? null,
          vocabulary_reviewed: input.vocab_known ?? 0,
          duration_seconds: input.duration_seconds ?? null,
          completed: true,
        },
        { onConflict: "employee_id,date" },
      );
    if (sessErr) {
      log.warn(
        { err: sessErr.message, employee_id: input.employee_id },
        "practice.complete.session.failed",
      );
    }

    // 3. Streak.
    const streak = await tickStreak(input.employee_id, today);

    // 4. Analytics best-effort.
    void supabase.from("analytics_events").insert({
      event_type: "drill_completed",
      employee_id: input.employee_id,
      metadata: {
        drill_id: input.drill_id,
        module: input.module,
        level: input.level,
        listening_correct: input.listening_correct ?? null,
        speaking_score: input.speaking_score ?? null,
        vocab_known: input.vocab_known ?? 0,
        duration_seconds: input.duration_seconds ?? null,
        ticked: streak.ticked,
      } as Json,
    });

    return NextResponse.json({
      ok: true,
      mode: "live",
      streak: {
        current: streak.current_streak,
        longest: streak.longest_streak,
        last_practice_date: streak.last_practice_date,
        ticked: streak.ticked,
      },
    });
  } catch (err) {
    captureException(err, {
      route: "POST /api/practice/complete",
      data: { employee_id: input.employee_id, drill_id: input.drill_id },
    });
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
