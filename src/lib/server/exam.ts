import "server-only";

/**
 * Server-only exam helpers.
 *
 * The route handlers in `src/app/api/exams/*` are thin layers — they parse
 * input with zod, then delegate here. All DB writes use the service client
 * (RLS bypass); ownership is validated explicitly via property-scope helpers.
 */
import type { Database, Json } from "@/lib/supabase/types";
import type { CEFRLevel, ExamStatus, RoleModule, Shift } from "@/lib/supabase/types";

type ExamSessionUpdate = Database["public"]["Tables"]["exam_sessions"]["Update"];
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { calculateListeningScore, calculateCombinedScore, scoreToLevel } from "@/lib/cefr";
import type { ListeningItemResult } from "@/lib/cefr";
import { log } from "./log";

const RESUMABLE_STATUSES: ExamStatus[] = [
  "in_progress",
  "listening_done",
  "speaking_done",
  "scoring",
];

const ANSWERABLE_STATUSES: ExamStatus[] = ["in_progress", "listening_done"];

export interface CreateSessionInput {
  property_slug: string;
  employee: {
    name: string;
    email?: string | null;
    phone?: string | null;
    hotel_role: RoleModule;
    department?: string | null;
    shift?: Shift | null;
    whatsapp_opted_in?: boolean;
  };
  module: RoleModule;
  exam_type?: "placement" | "monthly" | "final";
  consent_version?: string;
}

export interface CreateSessionResult {
  session_id: string;
  current_step: string;
  employee_id: string;
  resumed: boolean;
}

/**
 * Create (or resume) an exam session for an employee at a property.
 *
 * Auto-upserts the employee per migration 0004 contract:
 *   - non-empty email → upsert on (property_id, lower(trim(email)))
 *   - null/empty email → insert a new row (no dedupe)
 *
 * If the same employee already has a resumable session for the same module,
 * returns it instead of creating a duplicate.
 */
export async function createSession(
  input: CreateSessionInput,
): Promise<CreateSessionResult> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("createSession");

  // 1. Resolve property.
  const { data: property, error: propErr } = await supabase
    .from("properties")
    .select("id, organization_id, is_active")
    .eq("slug", input.property_slug)
    .maybeSingle();
  if (propErr) throw propErr;
  if (!property || !property.is_active) {
    const e = new Error(`property '${input.property_slug}' not found or inactive`);
    (e as Error & { code?: string }).code = "PROPERTY_NOT_FOUND";
    throw e;
  }

  // 2. Upsert employee.
  const employeeId = await upsertEmployee(supabase, property.id, input.employee);

  // 3. Resume check.
  const { data: existing } = await supabase
    .from("exam_sessions")
    .select("id, current_step, status, module")
    .eq("employee_id", employeeId)
    .eq("module", input.module)
    .in("status", RESUMABLE_STATUSES)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    log.info(
      { route: "POST /api/exams", session_id: existing.id, resumed: true },
      "exam.resumed",
    );
    return {
      session_id: existing.id,
      current_step: existing.current_step,
      employee_id: employeeId,
      resumed: true,
    };
  }

  // 4. Insert new session.
  const { data: session, error: sessErr } = await supabase
    .from("exam_sessions")
    .insert({
      employee_id: employeeId,
      module: input.module,
      exam_type: input.exam_type ?? "placement",
      status: "in_progress",
      current_step: "diagnostic",
    })
    .select("id, current_step")
    .single();
  if (sessErr || !session) throw sessErr ?? new Error("session insert failed");

  // 5. Analytics breadcrumb (best-effort).
  void supabase
    .from("analytics_events")
    .insert({
      event_type: "exam_started",
      employee_id: employeeId,
      property_id: property.id,
      session_id: session.id,
      metadata: {
        module: input.module,
        source: "web",
        consent_version: input.consent_version ?? null,
      } as Json,
    })
    .then(({ error }) => {
      if (error) log.warn({ err: error.message }, "analytics.exam_started.failed");
    });

  log.info(
    { route: "POST /api/exams", session_id: session.id, resumed: false },
    "exam.created",
  );

  return {
    session_id: session.id,
    current_step: session.current_step,
    employee_id: employeeId,
    resumed: false,
  };
}

async function upsertEmployee(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  propertyId: string,
  e: CreateSessionInput["employee"],
): Promise<string> {
  const normalizedEmail = e.email?.trim().toLowerCase();
  const hasEmail = normalizedEmail && normalizedEmail.length > 0;

  if (hasEmail) {
    // Look up by normalized email within the property.
    const { data: existing } = await supabase
      .from("employees")
      .select("id, source")
      .eq("property_id", propertyId)
      // The functional unique index is on lower(trim(email)). Postgrest
      // doesn't expose that expression directly, so we filter by the
      // normalized form via `ilike` on email. False positives are blocked
      // by the unique-index conflict on insert below.
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      // UPDATE name/phone/hotel_role/department/shift/whatsapp_opted_in.
      // DO NOT change source on update.
      const { error: updErr } = await supabase
        .from("employees")
        .update({
          name: e.name,
          phone: e.phone ?? null,
          hotel_role: e.hotel_role,
          department: e.department ?? null,
          shift: e.shift ?? null,
          whatsapp_opted_in: Boolean(e.whatsapp_opted_in ?? Boolean(e.phone)),
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      return existing.id;
    }

    const { data: inserted, error: insErr } = await supabase
      .from("employees")
      .insert({
        property_id: propertyId,
        name: e.name,
        email: normalizedEmail,
        phone: e.phone ?? null,
        hotel_role: e.hotel_role,
        department: e.department ?? null,
        shift: e.shift ?? null,
        whatsapp_opted_in: Boolean(e.whatsapp_opted_in ?? Boolean(e.phone)),
        source: "self_registered",
      })
      .select("id")
      .single();
    if (insErr || !inserted) throw insErr ?? new Error("employee insert failed");
    return inserted.id;
  }

  // No email → always insert a new row, no dedup.
  const { data: inserted, error: insErr } = await supabase
    .from("employees")
    .insert({
      property_id: propertyId,
      name: e.name,
      email: null,
      phone: e.phone ?? null,
      hotel_role: e.hotel_role,
      department: e.department ?? null,
      shift: e.shift ?? null,
      whatsapp_opted_in: Boolean(e.whatsapp_opted_in ?? Boolean(e.phone)),
      source: "self_registered",
    })
    .select("id")
    .single();
  if (insErr || !inserted) throw insErr ?? new Error("employee insert failed");
  return inserted.id;
}

// ─── Answer recording ─────────────────────────────────────────────────

export interface DiagnosticAnswerInput {
  session_id: string;
  question_index: number;
  answer_value: unknown;
}

export interface ListeningAnswerInput {
  session_id: string;
  question_index: number;
  selected_option: number;
  is_correct: boolean;
  level_tag: CEFRLevel;
  response_time_ms?: number | null;
  replay_count?: number;
}

export async function recordDiagnosticAnswer(
  input: DiagnosticAnswerInput,
): Promise<{ persisted: boolean }> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("recordDiagnosticAnswer");

  await assertSessionAnswerable(supabase, input.session_id);

  // INSERT ... ON CONFLICT DO NOTHING — first write wins.
  // postgrest-js exposes this via .upsert with `ignoreDuplicates: true`.
  const { data, error } = await supabase
    .from("diagnostic_answers")
    .upsert(
      {
        session_id: input.session_id,
        question_index: input.question_index,
        answer_value: (input.answer_value ?? null) as Json,
      },
      { onConflict: "session_id,question_index", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw error;

  return { persisted: Array.isArray(data) && data.length > 0 };
}

export async function recordListeningAnswer(
  input: ListeningAnswerInput,
): Promise<{ persisted: boolean }> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("recordListeningAnswer");

  await assertSessionAnswerable(supabase, input.session_id);

  const { data, error } = await supabase
    .from("listening_answers")
    .upsert(
      {
        session_id: input.session_id,
        question_index: input.question_index,
        selected_option: input.selected_option,
        is_correct: input.is_correct,
        level_tag: input.level_tag,
        response_time_ms: input.response_time_ms ?? null,
        replay_count: input.replay_count ?? 0,
      },
      { onConflict: "session_id,question_index", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw error;

  // Bump current_step to listening if we're still on diagnostic.
  await maybeAdvanceStep(supabase, input.session_id, "diagnostic", "listening");

  return { persisted: Array.isArray(data) && data.length > 0 };
}

async function assertSessionAnswerable(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  sessionId: string,
): Promise<void> {
  const { data: session } = await supabase
    .from("exam_sessions")
    .select("status")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) {
    const e = new Error(`session ${sessionId} not found`);
    (e as Error & { code?: string }).code = "SESSION_NOT_FOUND";
    throw e;
  }
  if (!ANSWERABLE_STATUSES.includes(session.status)) {
    const e = new Error(
      `session ${sessionId} status '${session.status}' not answerable`,
    );
    (e as Error & { code?: string }).code = "INVALID_STATUS";
    throw e;
  }
}

async function maybeAdvanceStep(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  sessionId: string,
  fromStep: string,
  toStep: string,
): Promise<void> {
  await supabase
    .from("exam_sessions")
    .update({ current_step: toStep })
    .eq("id", sessionId)
    .eq("current_step", fromStep);
}

// ─── Finalize listening + recompute final ─────────────────────────────

export async function finalizeListening(sessionId: string): Promise<{
  listening_score: number;
  listening_total: number;
  current_step: string;
  status: ExamStatus;
}> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("finalizeListening");

  const { data: rows, error } = await supabase
    .from("listening_answers")
    .select("is_correct, level_tag")
    .eq("session_id", sessionId);
  if (error) throw error;

  const items: ListeningItemResult[] = (rows ?? []).map((r) => ({
    correct: r.is_correct,
    level: r.level_tag,
  }));
  const listening_score = calculateListeningScore(items);
  const listening_total = items.length;

  const { data: updated, error: upErr } = await supabase
    .from("exam_sessions")
    .update({
      listening_score,
      listening_total,
      status: "listening_done",
      current_step: "speaking",
    })
    .eq("id", sessionId)
    .select("current_step, status")
    .single();
  if (upErr || !updated) throw upErr ?? new Error("finalize update failed");

  log.info(
    { route: "POST /api/exams/:id/finalize-listening", session_id: sessionId, listening_score },
    "exam.listening.finalized",
  );

  return {
    listening_score,
    listening_total,
    current_step: updated.current_step,
    status: updated.status,
  };
}

/**
 * After a speaking recording is scored, recompute the session's
 * speaking_avg_score and (if all 6 prompts have scored) the final_level
 * + complete status. Idempotent.
 */
export async function recomputeFinalLevel(
  sessionId: string,
  expectedSpeakingPrompts = 6,
): Promise<void> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("recomputeFinalLevel");

  const { data: recs } = await supabase
    .from("speaking_recordings")
    .select("ai_score_total, scoring_status")
    .eq("session_id", sessionId);

  const scored = (recs ?? []).filter(
    (r) => r.scoring_status === "complete" && typeof r.ai_score_total === "number",
  );

  if (scored.length === 0) return;

  const avg =
    scored.reduce((sum, r) => sum + (r.ai_score_total ?? 0), 0) / scored.length;
  const speaking_avg_score = Math.round(avg);

  const patch: ExamSessionUpdate = { speaking_avg_score };

  // Final level only when all expected prompts are scored.
  if (scored.length >= expectedSpeakingPrompts) {
    const { data: session } = await supabase
      .from("exam_sessions")
      .select("listening_score")
      .eq("id", sessionId)
      .maybeSingle();
    const listeningScore = session?.listening_score ?? 0;
    const combined = calculateCombinedScore({
      listeningScore,
      speakingScore: speaking_avg_score,
    });
    const final_level = scoreToLevel(combined);
    patch.final_level = final_level;
    patch.level_confidence = 0.85; // single-pass placeholder; multi-pass pending
    patch.status = "complete";
    patch.scored_at = new Date().toISOString();
    patch.completed_at = new Date().toISOString();
  }

  await supabase.from("exam_sessions").update(patch).eq("id", sessionId);
}

function notConfigured(fn: string): Error {
  const e = new Error(`Supabase not configured (${fn})`);
  (e as Error & { code?: string }).code = "DEMO_MODE";
  return e;
}
