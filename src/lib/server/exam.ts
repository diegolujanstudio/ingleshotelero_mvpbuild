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
import { getListening } from "@/content/exam";
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
      // Exact-equality match, NOT `ilike`. `normalizedEmail` is user-supplied,
      // and `ilike`/`like` treat `%`, `_` (and PostgREST's `*`) as wildcards —
      // an address like `a_b@x.com` would then match multiple rows and either
      // overwrite the wrong employee or blow up on `.maybeSingle()`. Every row
      // this code inserts stores `email` already lower-cased (see insert below),
      // so `.eq` on the normalized value is a true case-insensitive match with
      // zero LIKE semantics. Any residual conflict is still caught by the
      // functional unique index on insert.
      .select("id, source")
      .eq("property_id", propertyId)
      .eq("email", normalizedEmail)
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
  // NOTE: `is_correct` and `level_tag` are intentionally NOT accepted from the
  // caller. They are recomputed server-side from the content bank so a forged
  // client payload cannot inflate the finalize score.
  response_time_ms?: number | null;
  replay_count?: number;
}

export async function recordDiagnosticAnswer(
  input: DiagnosticAnswerInput,
): Promise<{ persisted: boolean }> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("recordDiagnosticAnswer");

  await assertSessionAnswerable(supabase, input.session_id);

  // INSERT ... ON CONFLICT DO UPDATE — latest write wins. The UI re-posts on
  // edits and multi-select toggles, so `ignoreDuplicates` (DO NOTHING) would
  // freeze the first, often-incomplete value. Overwrite keyed on
  // (session_id, question_index) so the latest answer is what persists.
  const { data, error } = await supabase
    .from("diagnostic_answers")
    .upsert(
      {
        session_id: input.session_id,
        question_index: input.question_index,
        answer_value: (input.answer_value ?? null) as Json,
      },
      { onConflict: "session_id,question_index" },
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

  const session = await assertSessionAnswerable(supabase, input.session_id);

  // Recompute is_correct + level_tag SERVER-SIDE from the content bank keyed on
  // (module, question_index, selected_option). Client-sent values are forgeable
  // and feed the authoritative finalize score, so they are never trusted here.
  // Also cap question_index / selected_option to the real bank so forged rows
  // (indices beyond the item count) cannot pad or inflate the listening set.
  const bank = getListening(session.module);
  const item = bank[input.question_index];
  if (!item || input.selected_option >= item.options.length) {
    const e = new Error(
      `listening index out of range (q=${input.question_index}, opt=${input.selected_option})`,
    );
    (e as Error & { code?: string }).code = "INVALID_INDEX";
    throw e;
  }
  const is_correct = item.options[input.selected_option].is_correct;
  const level_tag: CEFRLevel = item.level;

  // Overwrite on conflict so a re-answer / toggle updates the stored value
  // (DO NOTHING would freeze the first tap). Correctness is server-derived, so
  // there is no forgeable field to protect by ignoring duplicates.
  const { data, error } = await supabase
    .from("listening_answers")
    .upsert(
      {
        session_id: input.session_id,
        question_index: input.question_index,
        selected_option: input.selected_option,
        is_correct,
        level_tag,
        response_time_ms: input.response_time_ms ?? null,
        replay_count: input.replay_count ?? 0,
      },
      { onConflict: "session_id,question_index" },
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
): Promise<{ status: ExamStatus; module: RoleModule }> {
  const { data: session, error } = await supabase
    .from("exam_sessions")
    .select("status, module")
    .eq("id", sessionId)
    .maybeSingle();
  // A DB error is TRANSIENT and must not be conflated with a missing session
  // (a permanent 404). Propagate it so the route returns 5xx and the offline
  // client re-queues the answer instead of silently dropping it.
  if (error) throw error;
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
  return { status: session.status, module: session.module };
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
  incomplete?: boolean;
}> {
  const supabase = createServiceClient();
  if (!supabase) throw notConfigured("finalizeListening");

  // Read status + module first. This helper is called from BOTH the legacy
  // /finalize-listening route (which has no guard of its own) and the newer
  // /finalize route, so the forward-only guard has to live here.
  const { data: sessionRow, error: sessErr } = await supabase
    .from("exam_sessions")
    .select("status, module, listening_score, listening_total, current_step")
    .eq("id", sessionId)
    .maybeSingle();
  if (sessErr) throw sessErr; // transient → propagate as 5xx
  if (!sessionRow) {
    const e = new Error(`session ${sessionId} not found`);
    (e as Error & { code?: string }).code = "SESSION_NOT_FOUND";
    throw e;
  }

  // Forward-only guard: only an in_progress session may transition to
  // listening_done. Any later status (listening_done / speaking_done / scoring
  // / complete / abandoned) is a no-op that echoes the already-persisted values,
  // so a replay can never regress an advanced session back to 'speaking'.
  if (sessionRow.status !== "in_progress") {
    return {
      listening_score: sessionRow.listening_score ?? 0,
      listening_total: sessionRow.listening_total ?? 0,
      current_step: sessionRow.current_step,
      status: sessionRow.status,
    };
  }

  const bank = getListening(sessionRow.module);

  const { data: rows, error } = await supabase
    .from("listening_answers")
    .select("question_index, selected_option")
    .eq("session_id", sessionId);
  if (error) throw error;

  // Dedupe by question_index and recompute correctness + level authoritatively
  // from the content bank — never trust stored is_correct/level_tag. Forged rows
  // whose index is outside the bank are ignored so they can't pad the set.
  const byIndex = new Map<number, number>();
  for (const r of rows ?? []) {
    if (r.question_index >= 0 && r.question_index < bank.length) {
      byIndex.set(r.question_index, r.selected_option);
    }
  }

  const items: ListeningItemResult[] = [];
  for (const [qIndex, selected] of byIndex) {
    const item = bank[qIndex];
    const opt = item.options[selected];
    items.push({ correct: Boolean(opt?.is_correct), level: item.level });
  }

  const listening_score = calculateListeningScore(items);
  const listening_total = items.length;

  // Completeness gate: require every bank item answered before persisting an
  // authoritative score. A slow commit / race that leaves fewer rows must not
  // lock in a low score or advance the state machine — report incomplete and
  // leave the session untouched so a later call can finalize correctly.
  if (byIndex.size < bank.length) {
    log.warn(
      {
        route: "finalizeListening",
        session_id: sessionId,
        answered: byIndex.size,
        expected: bank.length,
      },
      "exam.listening.incomplete",
    );
    return {
      listening_score, // provisional — NOT persisted
      listening_total,
      current_step: sessionRow.current_step,
      status: sessionRow.status,
      incomplete: true,
    };
  }

  const { data: updated, error: upErr } = await supabase
    .from("exam_sessions")
    .update({
      listening_score,
      listening_total,
      status: "listening_done",
      current_step: "speaking",
    })
    .eq("id", sessionId)
    // Forward-only at the DB layer too: guards against a concurrent finalize
    // that advanced the row between our read and this write.
    .eq("status", "in_progress")
    .select("current_step, status")
    .maybeSingle();
  if (upErr) throw upErr;

  // Update matched zero rows → a concurrent finalize already advanced it.
  // Re-read and report the authoritative state rather than throwing.
  if (!updated) {
    const { data: after } = await supabase
      .from("exam_sessions")
      .select("current_step, status, listening_score, listening_total")
      .eq("id", sessionId)
      .maybeSingle();
    return {
      listening_score: after?.listening_score ?? listening_score,
      listening_total: after?.listening_total ?? listening_total,
      current_step: after?.current_step ?? "speaking",
      status: (after?.status as ExamStatus) ?? "listening_done",
    };
  }

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
      .select("listening_score, module")
      .eq("id", sessionId)
      .maybeSingle();

    // Self-heal: if listening was never finalized (e.g. its finalize is still
    // queued offline), recompute the listening score authoritatively from the
    // answer rows + content bank so the final level is never computed with
    // listening weighted as 0. Persist it so HR sees the real number too.
    let listeningScore = session?.listening_score ?? null;
    if ((listeningScore == null || listeningScore === 0) && session?.module) {
      const bank = getListening(session.module);
      const { data: la } = await supabase
        .from("listening_answers")
        .select("question_index, selected_option")
        .eq("session_id", sessionId);
      const byIndex = new Map<number, number>();
      for (const r of la ?? []) {
        if (r.question_index >= 0 && r.question_index < bank.length) {
          byIndex.set(r.question_index, r.selected_option);
        }
      }
      if (byIndex.size > 0) {
        const items: ListeningItemResult[] = [];
        for (const [qIndex, selected] of byIndex) {
          const item = bank[qIndex];
          items.push({ correct: Boolean(item.options[selected]?.is_correct), level: item.level });
        }
        const healed = calculateListeningScore(items);
        if (healed > (listeningScore ?? 0)) {
          listeningScore = healed;
          patch.listening_score = healed;
          patch.listening_total = items.length;
        }
      }
    }
    const combined = calculateCombinedScore({
      listeningScore: listeningScore ?? 0,
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
