import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CEFRLevel, Database } from "@/lib/supabase/types";

/**
 * Pure aggregation helpers for the /masteros dashboard.
 *
 * Every query here uses the SERVICE client (bypasses RLS) — these are
 * super_admin reads across the whole platform. Callers must already have
 * authenticated via requireSuperAdmin().
 *
 * Cost rates are documented at the top of the file and surfaced in the UI:
 *   - Whisper:     $0.006 / minute
 *   - Claude:      $0.02 per scoring pass (estimated; depends on prompt size)
 *   - ElevenLabs:  $0.30 per 1K characters (Creator-tier-ish)
 *
 * If `analytics_events.metadata` carries a `cost_usd` value we trust it;
 * otherwise we fall back to per-event flat estimates.
 */

export const COST_RATES = {
  whisperPerMin: 0.006,
  claudePerScoring: 0.02,
  elevenLabsPer1KChars: 0.3,
} as const;

type SC = SupabaseClient<Database>;

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/** distinct employees with a practice_session OR exam_session in the window */
async function activeEmployees(sb: SC, since: string): Promise<number> {
  const [{ data: practiceRows }, { data: examRows }] = await Promise.all([
    sb.from("practice_sessions").select("employee_id").gte("created_at", since),
    sb.from("exam_sessions").select("employee_id").gte("started_at", since),
  ]);
  const set = new Set<string>();
  for (const r of practiceRows ?? []) if (r.employee_id) set.add(r.employee_id);
  for (const r of examRows ?? []) if (r.employee_id) set.add(r.employee_id);
  return set.size;
}

async function examsCompleted(sb: SC, since: string): Promise<number> {
  const { count } = await sb
    .from("exam_sessions")
    .select("id", { count: "exact", head: true })
    .eq("status", "complete")
    .gte("completed_at", since);
  return count ?? 0;
}

async function scoringQueueDepth(sb: SC): Promise<number> {
  const { count } = await sb
    .from("speaking_recordings")
    .select("id", { count: "exact", head: true })
    .in("scoring_status", ["pending", "processing"]);
  return count ?? 0;
}

/** 30-day daily-active-employees series */
async function dailyActiveSeries(
  sb: SC,
): Promise<Array<{ date: string; count: number }>> {
  const since = daysAgo(30);
  const [{ data: practice }, { data: exams }] = await Promise.all([
    sb
      .from("practice_sessions")
      .select("employee_id, created_at")
      .gte("created_at", since),
    sb
      .from("exam_sessions")
      .select("employee_id, started_at")
      .gte("started_at", since),
  ]);

  const buckets = new Map<string, Set<string>>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    buckets.set(isoDate(d), new Set());
  }
  const add = (date: string, eid: string | null) => {
    if (!eid) return;
    const k = date.slice(0, 10);
    if (buckets.has(k)) buckets.get(k)!.add(eid);
  };
  for (const r of practice ?? []) add(r.created_at, r.employee_id);
  for (const r of exams ?? []) add(r.started_at, r.employee_id);

  return [...buckets.entries()].map(([date, set]) => ({
    date,
    count: set.size,
  }));
}

/** Snapshot of employees with a final_level set on their latest exam */
async function levelDistribution(
  sb: SC,
): Promise<Array<{ level: CEFRLevel; count: number }>> {
  const { data } = await sb
    .from("employees")
    .select("current_level")
    .eq("is_active", true);
  const counts: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const r of data ?? []) {
    if (r.current_level && LEVELS.includes(r.current_level)) {
      counts[r.current_level as CEFRLevel]++;
    }
  }
  return LEVELS.map((level) => ({ level, count: counts[level] }));
}

/** 30-day drill completed vs invited series. "Invited" approximated from
 * practice_sessions.completed=false. */
async function drillSeries(
  sb: SC,
): Promise<Array<{ date: string; completed: number; invited: number }>> {
  const since = daysAgo(30);
  const { data } = await sb
    .from("practice_sessions")
    .select("created_at, completed")
    .gte("created_at", since);

  const buckets = new Map<string, { completed: number; invited: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    buckets.set(isoDate(d), { completed: 0, invited: 0 });
  }
  for (const r of data ?? []) {
    const k = r.created_at.slice(0, 10);
    const b = buckets.get(k);
    if (!b) continue;
    b.invited++;
    if (r.completed) b.completed++;
  }
  return [...buckets.entries()].map(([date, b]) => ({
    date,
    completed: b.completed,
    invited: b.invited,
  }));
}

/** 7-day USD cost per provider, from analytics_events. */
async function costSeries(
  sb: SC,
): Promise<
  Array<{ date: string; whisper: number; claude: number; elevenlabs: number }>
> {
  const since = daysAgo(7);
  const { data } = await sb
    .from("analytics_events")
    .select("event_type, metadata, created_at")
    .in("event_type", ["scoring.run", "tts.generated"])
    .gte("created_at", since);

  const buckets = new Map<
    string,
    { whisper: number; claude: number; elevenlabs: number }
  >();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    buckets.set(isoDate(d), { whisper: 0, claude: 0, elevenlabs: 0 });
  }

  for (const ev of data ?? []) {
    const k = ev.created_at.slice(0, 10);
    const b = buckets.get(k);
    if (!b) continue;
    const meta = (ev.metadata ?? {}) as Record<string, unknown>;

    if (ev.event_type === "scoring.run") {
      // Whisper cost: from audio_seconds in metadata; fall back to a flat 30s estimate.
      const seconds =
        typeof meta.audio_seconds === "number" ? meta.audio_seconds : 30;
      b.whisper += (seconds / 60) * COST_RATES.whisperPerMin;
      // Claude cost: trust meta.claude_cost_usd if present, else flat per-pass.
      b.claude +=
        typeof meta.claude_cost_usd === "number"
          ? meta.claude_cost_usd
          : COST_RATES.claudePerScoring;
    } else if (ev.event_type === "tts.generated") {
      const chars = typeof meta.chars === "number" ? meta.chars : 200;
      b.elevenlabs += (chars / 1000) * COST_RATES.elevenLabsPer1KChars;
    }
  }

  return [...buckets.entries()].map(([date, b]) => ({
    date,
    whisper: round2(b.whisper),
    claude: round2(b.claude),
    elevenlabs: round2(b.elevenlabs),
  }));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface MetricsPayload {
  generated_at: string;
  totals: {
    activeEmployees7d: number;
    examsCompleted30d: number;
    scoringQueue: number;
  };
  charts: {
    dailyActive: Array<{ date: string; count: number }>;
    levelDistribution: Array<{ level: CEFRLevel; count: number }>;
    drills: Array<{ date: string; completed: number; invited: number }>;
    cost: Array<{
      date: string;
      whisper: number;
      claude: number;
      elevenlabs: number;
    }>;
  };
  costRates: typeof COST_RATES;
}

export async function gatherMetrics(sb: SC): Promise<MetricsPayload> {
  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [active, exams, queue, daily, levels, drills, cost] = await Promise.all(
    [
      activeEmployees(sb, since7),
      examsCompleted(sb, since30),
      scoringQueueDepth(sb),
      dailyActiveSeries(sb),
      levelDistribution(sb),
      drillSeries(sb),
      costSeries(sb),
    ],
  );

  return {
    generated_at: new Date().toISOString(),
    totals: {
      activeEmployees7d: active,
      examsCompleted30d: exams,
      scoringQueue: queue,
    },
    charts: {
      dailyActive: daily,
      levelDistribution: levels,
      drills,
      cost,
    },
    costRates: COST_RATES,
  };
}

/** Demo-mode payload — used when Supabase isn't configured so the dashboard
 * still renders for screenshots / local dev. Deterministic. */
export function demoMetrics(): MetricsPayload {
  const dailyActive: Array<{ date: string; count: number }> = [];
  const drills: Array<{ date: string; completed: number; invited: number }> =
    [];
  const cost: Array<{
    date: string;
    whisper: number;
    claude: number;
    elevenlabs: number;
  }> = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const date = isoDate(d);
    const base = 12 + Math.round(8 * Math.sin(i / 4));
    dailyActive.push({ date, count: base + (i % 5) });
    drills.push({
      date,
      completed: base + 2,
      invited: base + 6,
    });
  }
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    cost.push({
      date: isoDate(d),
      whisper: round2(0.4 + i * 0.05),
      claude: round2(0.9 + i * 0.08),
      elevenlabs: round2(0.6 + i * 0.04),
    });
  }

  return {
    generated_at: new Date().toISOString(),
    totals: {
      activeEmployees7d: 47,
      examsCompleted30d: 134,
      scoringQueue: 3,
    },
    charts: {
      dailyActive,
      levelDistribution: [
        { level: "A1", count: 28 },
        { level: "A2", count: 41 },
        { level: "B1", count: 22 },
        { level: "B2", count: 9 },
      ],
      drills,
      cost,
    },
    costRates: COST_RATES,
  };
}
