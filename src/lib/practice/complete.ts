import "server-only";

/**
 * Shared drill-completion recorder used by BOTH the web practice loop
 * (POST /api/practice/complete) and the WhatsApp engine, so a drill
 * finished over WhatsApp counts identically to one finished on the web.
 *
 * Extracted verbatim from the original /api/practice/complete route. The
 * only parameter that varies by caller is `channel` ('web' | 'whatsapp'),
 * which is stamped on practice_sessions and the analytics event.
 *
 * Steps, in order:
 *   1. Insert drill_history (deduped per (employee, drill, calendar day)).
 *   2. Upsert practice_sessions for today (one row per employee per day).
 *   3. Tick the streak server-side (idempotent for the same day).
 *   4. Best-effort analytics_events row (awaited — Netlify freezes on return).
 */
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client-or-service";
import { tickStreak, isoDate, type StreakState } from "@/lib/practice/streak";
import { log } from "@/lib/server/log";
import type { Json } from "@/lib/supabase/types";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

export interface DrillCompletionInput {
  employee_id: string;
  drill_id: string;
  level: CEFRLevel;
  module: RoleModule;
  listening_correct?: boolean | null;
  speaking_score?: number | null;
  vocab_known?: number;
  duration_seconds?: number;
  channel: "web" | "whatsapp";
}

export interface DrillCompletionResult {
  mode: "demo" | "live";
  streak: StreakState & { ticked: boolean };
}

const DEMO_RESULT: DrillCompletionResult = {
  mode: "demo",
  streak: { current_streak: 0, longest_streak: 0, last_practice_date: null, ticked: false },
};

export async function recordDrillCompletion(
  input: DrillCompletionInput,
  now: Date = new Date(),
): Promise<DrillCompletionResult> {
  if (!isSupabaseConfigured()) return DEMO_RESULT;
  const supabase = createServiceClient();
  if (!supabase) return DEMO_RESULT;

  const dayStr = isoDate(now);

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
        { err: histErr.message, employee_id: input.employee_id, channel: input.channel },
        "practice.complete.history.failed",
      );
    }
  }

  // 2. practice_sessions — upsert one per (employee, date).
  const { error: sessErr } = await supabase.from("practice_sessions").upsert(
    {
      employee_id: input.employee_id,
      date: dayStr,
      channel: input.channel,
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
      { err: sessErr.message, employee_id: input.employee_id, channel: input.channel },
      "practice.complete.session.failed",
    );
  }

  // 3. Streak.
  const streak = await tickStreak(input.employee_id, now);

  // 4. Analytics — awaited (Netlify freezes the function on return).
  try {
    await supabase.from("analytics_events").insert({
      event_type: "drill_completed",
      employee_id: input.employee_id,
      metadata: {
        drill_id: input.drill_id,
        module: input.module,
        level: input.level,
        channel: input.channel,
        listening_correct: input.listening_correct ?? null,
        speaking_score: input.speaking_score ?? null,
        vocab_known: input.vocab_known ?? 0,
        duration_seconds: input.duration_seconds ?? null,
        ticked: streak.ticked,
      } as Json,
    });
  } catch (analyticsErr) {
    log.warn(
      { err: String(analyticsErr), employee_id: input.employee_id, channel: input.channel },
      "practice.complete.analytics.failed",
    );
  }

  return { mode: "live", streak };
}
