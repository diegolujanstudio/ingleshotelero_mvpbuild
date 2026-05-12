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
export async function claimPending(batch: number = 10): Promise<ScoreOneOutput[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];

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
  const { data: claimed, error: claimErr } = await supabase
    .from("speaking_recordings")
    .update({
      scoring_status: "processing",
      scoring_attempts: nextAttempts,
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
  const prompt = prompts.find((p) => p.index === promptIndex);
  if (!prompt) return null;
  return {
    scenario_es: prompt.scenario_es,
    expected_keywords: prompt.expected_keywords,
    model_response_en: prompt.model_response_en,
    module: session.module,
  };
}

async function downloadAudio(audioPath: string): Promise<Blob | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage
      .from("recordings")
      .download(audioPath);
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

  const res = await fetch(`${OPENAI_API}/audio/transcriptions`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}` },
    body: form,
  });
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

  const res = await fetch(`${ANTHROPIC_API}/messages`, {
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
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as { content: { type: string; text: string }[] };
  const text = data.content.find((c) => c.type === "text")?.text ?? "";
  return parseRubricResponse(text, input.model_response_en);
}
