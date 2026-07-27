import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { pickDrillForEmployee } from "@/lib/practice/picker";
import { selectDueCards } from "@/lib/practice/vocab";
import { seedVocabularyIfEmpty } from "@/lib/practice/seed-vocab";
import { readStreak } from "@/lib/practice/streak";
import { planPracticeSession } from "@/lib/practice/lapse";
import { pickDrill } from "@/content/practice-drills";
import { captureException } from "@/lib/server/sentry";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

export const runtime = "nodejs";

const querySchema = z.object({
  employee_id: z.string().uuid().optional(),
  /** Demo-mode fallback when there is no employee row. */
  role: z.enum(["bellboy", "frontdesk", "restaurant"]).optional(),
  level: z.enum(["A1", "A2", "B1", "B2"]).optional(),
});

/**
 * GET /api/practice/today
 *
 * Returns:
 *   {
 *     drill: Drill,
 *     due_vocab: VocabCard[],
 *     streak: { current, longest, last_practice_date }
 *   }
 *
 * If `employee_id` is provided AND Supabase is configured: uses the
 * server picker, real streak, and SM-2-due cards. Otherwise demo
 * mode: deterministic pickDrill + empty vocab + zero streak.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    employee_id: url.searchParams.get("employee_id") ?? undefined,
    role: url.searchParams.get("role") ?? undefined,
    level: url.searchParams.get("level") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { employee_id } = parsed.data;
  let role: RoleModule = parsed.data.role ?? "frontdesk";
  let level: CEFRLevel = parsed.data.level ?? "A2";

  // Demo mode short-circuit.
  if (!isSupabaseConfigured() || !employee_id) {
    const drill = pickDrill(role, level);
    return NextResponse.json(
      {
        drill,
        due_vocab: [],
        streak: { current: 0, longest: 0, last_practice_date: null },
        mode: "demo",
      },
      { headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const supabase = createServiceClient();
    if (!supabase) {
      const drill = pickDrill(role, level);
      return NextResponse.json({
        drill,
        due_vocab: [],
        streak: { current: 0, longest: 0, last_practice_date: null },
        mode: "demo",
      });
    }

    // Resolve role + level from the employee row when present.
    const { data: emp } = await supabase
      .from("employees")
      .select("hotel_role, current_level")
      .eq("id", employee_id)
      .maybeSingle();
    if (emp) {
      role = emp.hotel_role as RoleModule;
      level = (emp.current_level as CEFRLevel | null) ?? level;
    }

    // First-time vocab seeding (idempotent).
    await seedVocabularyIfEmpty(employee_id, role);

    // Read the streak first: it tells us whether this learner is returning
    // from a lapse, which decides how heavy today's session may be.
    const streak = await readStreak(employee_id);

    // Law 5 — protect the habit above the backlog. A shift worker WILL miss
    // days; we never greet them with a pile. See lib/practice/lapse.ts.
    const plan = planPracticeSession(streak?.last_practice_date ?? null);

    const [picked, due] = await Promise.all([
      pickDrillForEmployee(employee_id, role, level),
      selectDueCards(employee_id, plan.dueCardCount, role, level),
    ]);

    return NextResponse.json(
      {
        drill: picked.drill,
        pick_reason: picked.reason,
        due_vocab: due,
        streak,
        // The client uses this to show "qué bueno que volviste" instead of a
        // broken-streak graphic, and to keep the session visibly short.
        posture: plan.posture,
        show_return_welcome: plan.showReturnWelcome,
        days_since_last_practice: plan.daysSinceLastPractice,
        mode: "live",
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    captureException(err, {
      route: "GET /api/practice/today",
      data: { employee_id, role, level },
    });
    // Last-ditch: return a demo drill so the UI still renders.
    const drill = pickDrill(role, level);
    return NextResponse.json(
      {
        drill,
        due_vocab: [],
        streak: { current: 0, longest: 0, last_practice_date: null },
        mode: "fallback",
      },
      { status: 200 },
    );
  }
}
