import "server-only";

/**
 * Speaking scoring worker — server-side only.
 *
 * Two pickup modes:
 *   - claimOne(recordingId)  → score that one row
 *   - claimPending(batch)    → claim up to N pending rows and score each
 *
 * Pickup pattern (chosen approach): postgrest UPDATE-then-verify.
 *
 *   1. SELECT the row to read scoring_attempts.
 *   2. UPDATE WHERE id=$1 AND scoring_status='pending' AND scoring_attempts=$expected
 *      RETURNING *. If RETURNING is empty, another worker won — abort silently.
 *   3. Run Whisper + Claude (or mock).
 *   4. UPDATE WHERE id=$1 AND scoring_attempts=$expected+1
 *      SET scoring_status='complete' + ai_* fields. If empty, abort.
 *
 * This is a small race window (the SELECT-then-UPDATE in step 2 isn't a true
 * SELECT FOR UPDATE) but the conditional UPDATE in steps 2 + 4 makes the
 * critical sections atomic per row. The `pg` library is available if we
 * later need a real `SELECT ... FOR UPDATE SKIP LOCKED`.
 *
 * Multi-pass for borderline scores is noted as TODO.
 */
import { createServiceClient } from "@/lib/supabase/client-or-service";
import {
  buildRubricSystemPrompt,
  parseRubricResponse,
  mockScore,
  noResponseResult,
  transcriptIsEmpty,
  type ScoringInput,
  type ScoringResult,
} from "@/lib/scoring";
import { recomputeFinalLevel } from "./exam";
import { addBreadcrumb, captureException } from "./sentry";
import { log } from "./log";
import type { Json } from "@/lib/supabase/types";
import { EXAM_CONTENT } from "@/content/exam";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

const OPENAI_API = "https://api.openai.com/v1";
const ANTHROPIC_API = "https://api.anthropic.com/v1";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_SCORING_MODEL ?? "claude-sonnet-4-5";

export interface ScoreOneOutput {
  recording_id: string;
  status: "complete" | "skipped" | "failed";
  reason?: string;
}

/**
 * Score one specific recording by id. Used by the inline best-effort call
 * from /api/recordings, and by the cron-driven batch worker.
 */
export async function scoreOne(recordingId: string): Promise<ScoreOneOutput> {
  const supabase = createServiceClient();
  if (!supabase) {
    return { recording_id: recordingId, status: "skipped", reason: "DEMO_MODE" };
  }

  // Step 1: read current state.
  const { data: rec } = await supabase
    .from("speaking_recordings")
    .select(
      "id, session_id, prompt_index, audio_url, level_tag, scoring_status, scoring_attempts",
    )
    .eq("id", recordingId)
    .maybeSingle();
  if (!rec) return { recording_id: recordingId, status: "skipped", reason: "NOT_FOUND" };
  if (rec.scoring_status !== "pending") {
    return { recording_id: recordingId, status: "skipped", reason: rec.scoring_status };
  }

  return scoreClaimedRow(rec);
}

interface ClaimableRow {
  id: string;
  session_id: string;
  prompt_index: number;
  audio_url: string;
  level_tag: CEFRLevel;
  scoring_status: string;
  scoring_attempts: number;
}

/**
 * Claim up to `batch` pending rows and score them sequentially.
 * Returns per-row outcomes.
 */
// Rows claimed as 'processing' are normally reset by the in-process catch in
// scoreClaimedRow. But a hard function timeout / OOM kills the worker before
// that catch runs, stranding the row in 'processing' forever (claimPending only
// picked 'pending'). Reap rows whose claim is older than this threshold back to
// 'pending' so a later batch retries them. scoring_attempts capping still
// applies, so a genuinely-failing row eventually gives up.
const STALE_PROCESSING_MS = 5 * 60 * 1000; // 5 minutes

export async function claimPending(batch: number = 10): Promise<ScoreOneOutput[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];

  // Reaper: reset stale 'processing' rows (dead worker) back to 'pending'
  // before selecting candidates. Only touch rows still under the attempt cap so
  // permanently-failing rows are not resurrected indefinitely. The claim UPDATE
  // in scoreClaimedRow stamps `scored_at` at claim time (there is no
  // `updated_at` column on this table), so for a 'processing' row `scored_at`
  // reflects when it was claimed. A row still processing with a claim older than
  // the threshold means the worker died before its catch could reset it.
  const staleCutoff = new Date(Date.now() - STALE_PROCESSING_MS).toISOString();
  await supabase
    .from("speaking_recordings")
    .update({ scoring_status: "pending" })
    .eq("scoring_status", "processing")
    .lt("scoring_attempts", 3)
    .lt("scored_at", staleCutoff);

  const { data: candidates } = await supabase
    .from("speaking_recordings")
    .select(
      "id, session_id, prompt_index, audio_url, level_tag, scoring_status, scoring_attempts",
    )
    .eq("scoring_status", "pending")
    .lt("scoring_attempts", 3)
    .limit(batch);

  const out: ScoreOneOutput[] = [];
  for (const r of candidates ?? []) {
    out.push(await scoreClaimedRow(r as ClaimableRow));
  }
  return out;
}

/**
 * Lower-level entry used by the deprecated direct `scoreSpeaking` import in
 * `src/lib/scoring.ts`. Runs the real path against a freshly-supplied
 * audio blob without any DB ownership.
 */
export async function runScoringOnce(input: ScoringInput): Promise<ScoringResult> {
  const transcript = input.audio_blob
    ? await transcribe(input.audio_blob)
    : input.fallback_transcript ?? "";
  if (transcriptIsEmpty(transcript)) {
    return noResponseResult(transcript, input.model_response_en);
  }
  try {
    const scores = await scoreWithClaude({ ...input, transcript });
    return { transcript, ...scores, mode: "real" };
  } catch (err) {
    log.warn({ err: String(err) }, "scoring.real.failed-fallback-mock");
    return mockScore(input);
  }
}

// ─── Internal: claim + score one row ─────────────────────────────────

async function scoreClaimedRow(rec: ClaimableRow): Promise<ScoreOneOutput> {
  const supabase = createServiceClient();
  if (!supabase) return { recording_id: rec.id, status: "skipped", reason: "DEMO_MODE" };

  const expectedAttempts = rec.scoring_attempts;
  const nextAttempts = expectedAttempts + 1;

  // Step 2: claim — conditional UPDATE.
  // Stamp scored_at at claim time so the stale-'processing' reaper in
  // claimPending can tell an actively-processing row from one stranded by a
  // dead worker (this table has no updated_at column). On success step 4
  // overwrites scored_at with the real completion time.
  const { data: claimed, error: claimErr } = await supabase
    .from("speaking_recordings")
    .update({
      scoring_status: "processing",
      scoring_attempts: nextAttempts,
      scored_at: new Date().toISOString(),
    })
    .eq("id", rec.id)
    .eq("scoring_status", "pending")
    .eq("scoring_attempts", expectedAttempts)
    .select("id")
    .maybeSingle();

  if (claimErr) {
    captureException(claimErr, { route: "scoring.claim", data: { recording_id: rec.id } });
    return { recording_id: rec.id, status: "failed", reason: "CLAIM_ERROR" };
  }
  if (!claimed) {
    // Lost the race — another worker took this row.
    return { recording_id: rec.id, status: "skipped", reason: "RACE_LOST" };
  }

  addBreadcrumb({
    route: "scoring.claim",
    data: { recording_id: rec.id, attempts: nextAttempts },
  });

  const startedMs = Date.now();
  let result: ScoringResult;
  try {
    // Pull the prompt/scenario from content.
    const ctx = await loadPromptContext(rec.session_id, rec.prompt_index);
    if (!ctx) {
      throw new Error("prompt context missing for session/prompt");
    }
    const audioBlob = await downloadAudio(rec.audio_url);
    // A claimed exam recording always has real uploaded audio, so a null blob
    // here means the storage read failed or timed out (transient). Throw so the
    // catch below resets the row to 'pending' for retry instead of finalizing a
    // bogus no-response (score 0) as 'complete'.
    if (!audioBlob) {
      throw new Error("audio download failed or timed out");
    }

    result = await runScoringOnce({
      scenario_es: ctx.scenario_es,
      expected_keywords: ctx.expected_keywords,
      model_response_en: ctx.model_response_en,
      level_tag: rec.level_tag,
      module: ctx.module,
      audio_blob: audioBlob,
    });
  } catch (err) {
    captureException(err, {
      route: "scoring.run",
      data: { recording_id: rec.id, attempts: nextAttempts },
    });
    // Decide: retry or fail. Retry up to 3 attempts; otherwise mark failed.
    const finalStatus = nextAttempts >= 3 ? "failed" : "pending";
    await supabase
      .from("speaking_recordings")
      .update({ scoring_status: finalStatus })
      .eq("id", rec.id)
      .eq("scoring_attempts", nextAttempts);
    return {
      recording_id: rec.id,
      status: "failed",
      reason: err instanceof Error ? err.message : "unknown",
    };
  }

  const durationMs = Date.now() - startedMs;

  // Step 4: write result — conditional on attempts to avoid clobbering a
  // racing worker's write (defense in depth; the claim already prevented it).
  const { data: written, error: writeErr } = await supabase
    .from("speaking_recordings")
    .update({
      transcript: result.transcript,
      ai_score_intent: result.intent,
      ai_score_vocabulary: result.vocabulary,
      ai_score_fluency: result.fluency,
      ai_score_tone: result.tone,
      ai_score_total: result.total,
      ai_feedback_es: result.feedback_es,
      ai_model_response: result.model_response,
      ai_level_estimate: result.level_estimate,
      scoring_status: "complete",
      scored_at: new Date().toISOString(),
    })
    .eq("id", rec.id)
    .eq("scoring_attempts", nextAttempts)
    .select("id")
    .maybeSingle();
  if (writeErr) {
    captureException(writeErr, {
      route: "scoring.write",
      data: { recording_id: rec.id },
    });
    return { recording_id: rec.id, status: "failed", reason: "WRITE_ERROR" };
  }
  if (!written) {
    return { recording_id: rec.id, status: "skipped", reason: "WRITE_RACE_LOST" };
  }

  // Recompute speaking_avg + final_level (idempotent).
  try {
    await recomputeFinalLevel(rec.session_id);
  } catch (err) {
    captureException(err, { route: "scoring.recompute", data: { session_id: rec.session_id } });
  }

  // Analytics.
  void supabase
    .from("analytics_events")
    .insert({
      event_type: "recording_scored",
      session_id: rec.session_id,
      metadata: {
        recording_id: rec.id,
        prompt_index: rec.prompt_index,
        duration_ms: durationMs,
        model: result.mode === "real" ? ANTHROPIC_MODEL : "mock",
        score: result.total,
        level_estimate: result.level_estimate,
      } as Json,
    });

  // TODO multi-pass: if `distanceFromBoundary(combined) <= 5`, re-score and
  // take the lower if disagreement > 3. Pending until cost analysis.

  log.info(
    {
      route: "scoring.run",
      recording_id: rec.id,
      session_id: rec.session_id,
      duration_ms: durationMs,
      score: result.total,
      mode: result.mode,
    },
    "scoring.complete",
  );

  return { recording_id: rec.id, status: "complete" };
}

// ─── Helpers ──────────────────────────────────────────────────────────

async function loadPromptContext(
  sessionId: string,
  promptIndex: number,
): Promise<{
  scenario_es: string;
  expected_keywords: string[];
  model_response_en: string;
  module: RoleModule;
} | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data: session } = await supabase
    .from("exam_sessions")
    .select("module")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) return null;
  const prompts = EXAM_CONTENT[session.module]?.speaking ?? [];
  // Indexing convention: recordings store `prompt_index` 0-based (the exam
  // speaking page uses the array position; DB schema allows min 0). Content
  // `prompt.index` is 1-based (see EXAM_CONTENT speaking prompts). Map across
  // the boundary so stored index 0 resolves to content index 1.
  const prompt = prompts.find((p) => p.index === promptIndex + 1);
  if (!prompt) return null;
  return {
    scenario_es: prompt.scenario_es,
    expected_keywords: prompt.expected_keywords,
    model_response_en: prompt.model_response_en,
    module: session.module,
  };
}

// Per-upstream timeouts. Without these, a hung Whisper/Claude/storage call
// would stall the whole batch until the platform hard-kills the function,
// stranding the claimed row (its catch never runs). On timeout we throw so the
// caller's catch resets the row to 'pending' for a later retry.
const UPSTREAM_TIMEOUT_MS = 25_000;
const DOWNLOAD_TIMEOUT_MS = 20_000;

// Wrap a fetch with an AbortController-backed timeout. Rethrows as a labelled
// error on timeout so logs make the cause obvious.
async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
  label: string,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(`${label} timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function downloadAudio(audioPath: string): Promise<Blob | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  try {
    // supabase-js storage .download() takes no AbortSignal, so bound it with a
    // timeout race. On timeout we throw (caught below) so a hung storage read
    // doesn't stall the batch indefinitely.
    const { data, error } = await Promise.race([
      supabase.storage.from("recordings").download(audioPath),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`audio download timed out after ${DOWNLOAD_TIMEOUT_MS}ms`)),
          DOWNLOAD_TIMEOUT_MS,
        ),
      ),
    ]);
    if (error) throw error;
    return data ?? null;
  } catch (err) {
    log.warn({ err: String(err), audioPath }, "scoring.download.failed");
    return null;
  }
}

async function transcribe(audio: Blob): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing");
  const form = new FormData();
  form.append("file", audio, "recording.webm");
  form.append("model", "whisper-1");
  form.append("language", "en");
  form.append("response_format", "text");

  const res = await fetchWithTimeout(
    `${OPENAI_API}/audio/transcriptions`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${key}` },
      body: form,
    },
    UPSTREAM_TIMEOUT_MS,
    "Whisper",
  );
  if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text()}`);
  return (await res.text()).trim();
}

async function scoreWithClaude(
  input: ScoringInput & { transcript: string },
): Promise<Omit<ScoringResult, "transcript" | "mode">> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");

  const systemPrompt = buildRubricSystemPrompt({
    scenario_es: input.scenario_es,
    expected_keywords: input.expected_keywords,
    level_tag: input.level_tag,
    module: input.module,
    transcript: input.transcript,
  });

  const res = await fetchWithTimeout(
    `${ANTHROPIC_API}/messages`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 512,
        system: systemPrompt,
        messages: [
          { role: "user", content: "Score the transcript above. JSON only." },
        ],
      }),
    },
    UPSTREAM_TIMEOUT_MS,
    "Claude",
  );
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as { content: { type: string; text: string }[] };
  const text = data.content.find((c) => c.type === "text")?.text ?? "";
  return parseRubricResponse(text, input.model_response_en);
}
