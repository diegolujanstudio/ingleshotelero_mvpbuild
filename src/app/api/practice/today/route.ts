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

    const [picked, due, streak] = await Promise.all([
      pickDrillForEmployee(employee_id, role, level),
      selectDueCards(employee_id, 3, role, level),
      readStreak(employee_id),
    ]);

    return NextResponse.json(
      {
        drill: picked.drill,
        pick_reason: picked.reason,
        due_vocab: due,
        streak,
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
