/**
 * HR dashboard data loader — merges live local sessions with demo data.
 *
 * Called from Client Components. Reads any completed exam sessions from
 * localStorage and fuses them with the DEMO_EMPLOYEES list so the
 * dashboard feels populated in pitches.
 *
 * When Supabase is wired + an HR user is authenticated, a future version
 * will prefer real DB data over demo. For now: demo + live local.
 */

import { SESSION_KEY_PREFIX, type ExamSessionState } from "./exam";
import { DEMO_EMPLOYEES, type DemoEmployee } from "./demo-data";
import { calculateCombinedScore, scoreToLevel } from "./cefr";
import type { CEFRLevel, RoleModule } from "./supabase/types";

export interface EmployeeRow {
  id: string;
  name: string;
  hotel_role: RoleModule;
  current_level: CEFRLevel;
  shift: "morning" | "afternoon" | "night";
  listening_score: number;
  speaking_score: number;
  combined_score: number;
  last_active_days_ago: number;
  streak: number;
  practice_completion_pct: number;
  completed_at: string;
  is_live: boolean; // true when sourced from a local exam session
  strengths: string[];
  areas_to_improve: string[];
  transcripts: {
    prompt_index: number;
    scenario_es: string;
    transcript_en: string;
    ai_feedback_es: string;
    ai_score_total: number;
    level: CEFRLevel;
  }[];
}

function daysAgo(iso: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function liveSessionToRow(s: ExamSessionState): EmployeeRow | null {
  if (!s.final_level || typeof s.listening_score !== "number") return null;

  const speaking = (s.speaking_recordings ?? [])
    .filter((r) => typeof r.ai_score_total === "number")
    .map((r) => r.ai_score_total as number);
  const speakingAvg = speaking.length
    ? Math.round(speaking.reduce((a, b) => a + b, 0) / speaking.length)
    : 0;

  const combined = calculateCombinedScore({
    listeningScore: s.listening_score,
    speakingScore: speakingAvg,
  });

  return {
    id: s.id,
    name: s.employee?.name ?? "Empleado en vivo",
    hotel_role: s.module,
    current_level: s.final_level ?? scoreToLevel(combined),
    shift: s.employee?.shift ?? "morning",
    listening_score: s.listening_score,
    speaking_score: speakingAvg,
    combined_score: combined,
    last_active_days_ago: 0,
    streak: 1,
    practice_completion_pct: 100,
    completed_at: s.started_at,
    is_live: true,
    strengths: ["Recién evaluado — datos crudos"],
    areas_to_improve: ["Por determinar en próxima sesión"],
    transcripts: (s.speaking_recordings ?? [])
      .filter((r) => r.transcript && r.ai_score_total !== undefined)
      .map((r) => ({
        prompt_index: r.prompt_index,
        scenario_es: "Escenario en vivo",
        transcript_en: r.transcript ?? "",
        ai_feedback_es: r.ai_feedback_es ?? "",
        ai_score_total: r.ai_score_total ?? 0,
        level: r.level_tag,
      })),
  };
}

function demoEmployeeToRow(e: DemoEmployee): EmployeeRow {
  return { ...e, is_live: false };
}

export function loadEmployees(): EmployeeRow[] {
  const rows: EmployeeRow[] = [...DEMO_EMPLOYEES.map(demoEmployeeToRow)];

  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(SESSION_KEY_PREFIX)) continue;
      try {
        const s = JSON.parse(localStorage.getItem(key) ?? "") as ExamSessionState;
        const row = liveSessionToRow(s);
        if (row) rows.unshift(row); // live first
      } catch {
        // skip malformed
      }
    }
  }

  return rows;
}

export function findEmployee(id: string): EmployeeRow | undefined {
  return loadEmployees().find((e) => e.id === id);
}

// ─── Aggregates ──────────────────────────────────────────────────────

export function aggregateLevels(rows: EmployeeRow[]): Record<CEFRLevel, number> {
  const out: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const r of rows) out[r.current_level]++;
  return out;
}

export function aggregateRoles(rows: EmployeeRow[]): Record<RoleModule, number> {
  const out: Record<RoleModule, number> = { bellboy: 0, frontdesk: 0, restaurant: 0 };
  for (const r of rows) out[r.hotel_role]++;
  return out;
}

export function averageScore(rows: EmployeeRow[]): number {
  if (rows.length === 0) return 0;
  return Math.round(
    rows.reduce((sum, r) => sum + r.combined_score, 0) / rows.length,
  );
}

export function activeThisWeek(rows: EmployeeRow[]): number {
  return rows.filter((r) => r.last_active_days_ago <= 7).length;
}
