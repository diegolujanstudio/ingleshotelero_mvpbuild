/**
 * Exam session helpers — dual-mode storage.
 *
 * When Supabase is configured, session state persists to the database and
 * survives across devices. When it isn't, everything lives in localStorage
 * so the demo still walks end-to-end.
 *
 * The session id is generated client-side (UUID v4) so the URL can be shared
 * before the DB round-trip completes. On DB save, the same id is written.
 */

import type { CEFRLevel, RoleModule } from "./supabase/types";

export const SESSION_KEY_PREFIX = "ih.exam.session.";
export const CURRENT_SESSION_KEY = "ih.exam.current";

export interface ExamSessionState {
  id: string;
  employee_id: string | null; // null if localStorage-only
  property_slug: string;
  employee: {
    name: string;
    email?: string;
    phone?: string;
    shift?: "morning" | "afternoon" | "night";
  };
  module: RoleModule;
  started_at: string;
  current_step:
    | "diagnostic"
    | "listening"
    | "speaking"
    | "results"
    | "complete";
  diagnostic_answers: Record<string, string | string[]>;
  listening_answers: {
    question_index: number;
    selected_option: number;
    is_correct: boolean;
    level_tag: CEFRLevel;
    replay_count: number;
  }[];
  speaking_recordings: {
    prompt_index: number;
    audio_data_url: string | null; // base64 fallback for localStorage mode
    audio_duration_seconds: number;
    level_tag: CEFRLevel;
    scoring_status: "pending" | "processing" | "complete" | "failed";
    transcript?: string;
    ai_score_total?: number;
    ai_feedback_es?: string;
    ai_model_response?: string;
  }[];
  listening_score?: number;
  speaking_avg_score?: number;
  final_level?: CEFRLevel;
}

/** Generate a RFC 4122 v4 UUID in the browser without deps. */
export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for old browsers.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function saveSession(state: ExamSessionState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY_PREFIX + state.id, JSON.stringify(state));
    localStorage.setItem(CURRENT_SESSION_KEY, state.id);
  } catch {
    // localStorage full / disabled — swallow. The server persists to Supabase
    // separately when configured.
  }
}

export function loadSession(id: string): ExamSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY_PREFIX + id);
    return raw ? (JSON.parse(raw) as ExamSessionState) : null;
  } catch {
    return null;
  }
}

export function updateSession(
  id: string,
  patch: Partial<ExamSessionState>,
): ExamSessionState | null {
  const existing = loadSession(id);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  saveSession(next);
  return next;
}

/** Try to reach the server. Fails silently if Supabase/API isn't set up. */
export async function syncSessionToServer(
  state: ExamSessionState,
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/exams/" + state.id, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

/** Total listening items per the bible §4 distribution. */
export const LISTENING_TOTAL = 10;
export const SPEAKING_TOTAL = 6;
export const DIAGNOSTIC_TOTAL = 13;
