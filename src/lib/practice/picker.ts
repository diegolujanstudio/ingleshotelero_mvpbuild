import "server-only";

/**
 * Daily drill picker.
 *
 * The algorithm:
 *
 *   1. Filter the role's drill pool to the employee's current level.
 *      If empty (e.g. employee has B2 but pool only has A1-B1), fall
 *      back to the highest level <= employee's level. If still empty,
 *      use the whole pool.
 *
 *   2. Read the last 14 days of drill_history for this employee. From
 *      that, compute weak-skill weights:
 *        - listening_correct=false → +2 weight to drills that exercise
 *          the missed listening sub-skill (we use drill_id as the
 *          finest grain; in v2 add `topic` to the drill model).
 *        - speaking_score < 60 → +2 weight to other speaking-heavy
 *          drills at the same level.
 *      A "weak" drill is one whose id matches a recent miss; we re-
 *      surface it (spaced rotation) but never on the same day.
 *
 *   3. Among candidates, demote any drill the employee completed in
 *      the last 3 days (anti-back-to-back). If everything is demoted,
 *      use the full filtered pool.
 *
 *   4. Day-of-year rotation: take `day_of_year % candidates.length`.
 *      This is deterministic per (date, employee_id-bucketed-pool) so
 *      a refresh returns the same drill, but a new day rotates.
 *
 * The picker is intentionally additive over the existing `pickDrill`
 * helper in `src/content/practice-drills.ts` — that function stays the
 * pure-content fallback for demo mode (no Supabase).
 */

import { createServiceClient } from "@/lib/supabase/client-or-service";
import { DRILLS, type Drill, type Role } from "@/content/practice-drills";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import { log } from "@/lib/server/log";

type DrillHistoryRow = {
  drill_id: string;
  level: CEFRLevel;
  module: RoleModule;
  listening_correct: boolean | null;
  speaking_score: number | null;
  completed_at: string;
};

const LEVEL_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

function dayOfYear(d: Date): number {
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function preferredLevels(target: CEFRLevel): CEFRLevel[] {
  const idx = LEVEL_ORDER.indexOf(target);
  if (idx < 0) return LEVEL_ORDER.slice();
  // Prefer same level, then walk down (never up — we don't push
  // students above their assessed level on autopilot).
  return [LEVEL_ORDER[idx], ...LEVEL_ORDER.slice(0, idx).reverse()];
}

export interface PickedDrill {
  drill: Drill;
  reason: "level_match" | "weak_skill" | "level_fallback" | "default";
}

export async function pickDrillForEmployee(
  employee_id: string,
  role: RoleModule,
  level: CEFRLevel,
  today: Date = new Date(),
): Promise<PickedDrill> {
  const pool = DRILLS[role as Role] ?? [];
  if (pool.length === 0) {
    // Truly empty pool — caller should treat this as a content gap.
    throw new Error(`No drills configured for role ${role}`);
  }

  // Gate by level: walk preferred levels until we find candidates.
  let levelMatched: CEFRLevel | null = null;
  let candidates: Drill[] = [];
  for (const lv of preferredLevels(level)) {
    const matched = pool.filter((d) => d.level === lv);
    if (matched.length > 0) {
      candidates = matched;
      levelMatched = lv;
      break;
    }
  }
  if (candidates.length === 0) {
    candidates = pool.slice();
  }

  // Weak-skill weighting from recent drill history.
  const history = await loadRecentHistory(employee_id, 14);
  const recentIds = new Set(
    history
      .filter((h) => isWithinDays(h.completed_at, today, 3))
      .map((h) => h.drill_id),
  );
  const weakIds = new Set(
    history
      .filter(
        (h) =>
          h.listening_correct === false ||
          (typeof h.speaking_score === "number" && h.speaking_score < 60),
      )
      .map((h) => h.drill_id),
  );

  // Anti-back-to-back: drop any drill seen in last 3 days.
  let filtered = candidates.filter((d) => !recentIds.has(d.id));
  if (filtered.length === 0) filtered = candidates.slice();

  // Weighted shuffle by weak skills: a weak drill is worth 3 entries
  // in the rotation pool, a fresh drill is worth 1. Day-of-year picks
  // an index into the expanded pool.
  const weighted: Drill[] = [];
  for (const d of filtered) {
    const w = weakIds.has(d.id) ? 3 : 1;
    for (let i = 0; i < w; i++) weighted.push(d);
  }

  const idx = dayOfYear(today) % weighted.length;
  const picked = weighted[idx];

  let reason: PickedDrill["reason"] = "default";
  if (weakIds.has(picked.id)) reason = "weak_skill";
  else if (levelMatched === level) reason = "level_match";
  else if (levelMatched && levelMatched !== level) reason = "level_fallback";

  return { drill: picked, reason };
}

async function loadRecentHistory(
  employee_id: string,
  days: number,
): Promise<DrillHistoryRow[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from("drill_history")
    .select("drill_id, level, module, listening_correct, speaking_score, completed_at")
    .eq("employee_id", employee_id)
    .gte("completed_at", since.toISOString())
    .order("completed_at", { ascending: false })
    .limit(40);
  if (error) {
    log.warn({ err: error.message, employee_id }, "picker.history.failed");
    return [];
  }
  return (data ?? []) as DrillHistoryRow[];
}

function isWithinDays(iso: string, anchor: Date, days: number): boolean {
  const t = new Date(iso).getTime();
  const cutoff = anchor.getTime() - days * 24 * 60 * 60 * 1000;
  return t >= cutoff;
}
