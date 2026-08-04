/**
 * Speaking scoring — pure helpers only.
 *
 * This module is import-safe in both client and server contexts. It contains:
 *   - the rubric prompt builder (verbatim from bible §6 calibration)
 *   - a strict JSON parser/validator
 *   - the deterministic mock scorer used in demo mode and as a real-path
 *     fallback when an upstream call fails
 *
 * The HTTP transport, retry/claim logic, and DB writes live in
 * `@/lib/server/scoring`. Do NOT inline a fetch() in here.
 */
import type { CEFRLevel, RoleModule } from "./supabase/types";
import { scoreToLevel } from "./cefr";

export interface ScoringInput {
  scenario_es: string;
  expected_keywords: string[];
  model_response_en: string;
  level_tag: CEFRLevel;
  module: RoleModule;
  audio_blob?: Blob | null; // real mode — transcribe this
  fallback_transcript?: string; // mock mode — use this instead
}

export interface ScoringResult {
  transcript: string;
  intent: number;
  vocabulary: number;
  fluency: number;
  tone: number;
  total: number;
  level_estimate: CEFRLevel;
  feedback_es: string;
  model_response: string;
  mode: "real" | "mock";
}

/**
 * Which persona is answering.
 *
 * `assess` — the Evaluator. Placement exam and the monthly re-assessment.
 *   Produces a CEFR number. This is the evidence the hotel buys.
 *
 * `coach`  — the Coach (el padre lingüístico). Daily practice. NEVER produces
 *   a number, never corrects, never shames. It confirms understanding and
 *   models a better sentence.
 *
 * Rationale (METODO-TURNO.md, Law 1): scoring a learner every single day
 * re-creates the school experience that already failed them. The two jobs
 * are different and must not share a persona.
 */
export type CoachMode = "coach" | "assess";

/** What the Coach returns. Deliberately has no score field of any kind. */
export interface CoachResult {
  transcript: string;
  /** What the coach understood the learner to mean. Confirms, never corrects. */
  understood_es: string;
  /** One encouraging, concrete observation. Always opens with what worked. */
  feedback_es: string;
  /** A natural way to say it — modeling, not correction. */
  model_response: string;
  /** Internal only. Drives SRS scheduling. NEVER rendered to the learner. */
  internal_confidence: "low" | "medium" | "high";
  mode: "real" | "mock";
}

/**
 * The exact rubric prompt sent to Claude. Calibration phrasing
 * ("be GENEROUS", "NEVER score 0 if they attempted English") is load-bearing
 * per bible §6 — do not soften.
 */
export function buildRubricSystemPrompt(
  input: Pick<
    ScoringInput,
    "scenario_es" | "expected_keywords" | "level_tag" | "module"
  > & { transcript: string },
): string {
  return `You are an English pronunciation and communication evaluator for hotel staff in Mexico. You are scoring a spoken response from a ${input.module} at level ${input.level_tag}.

SCENARIO (what the employee was responding to):
${input.scenario_es}

EXPECTED VOCABULARY:
${input.expected_keywords.join(", ")}

EMPLOYEE'S TRANSCRIPT:
"${input.transcript}"

Score each dimension 0-25:

1. COMMUNICATIVE INTENT (0-25) — Did they understand and address the scenario?
2. VOCABULARY (0-25) — Did they use relevant hospitality vocabulary?
3. FLUENCY (0-25) — Was the response natural and connected?
4. PROFESSIONAL TONE (0-25) — Was it appropriate for hospitality?

CALIBRATION:
- For A1-A2 level employees, be GENEROUS. A bellboy who says "Yes, I help bags, room 304" should score 60-70, not 30.
- For B1-B2, expect more sophistication.
- NEVER score 0 if the employee attempted a response in English.
- The goal is placement and encouragement, not punishment.

Return ONLY this JSON (no other text):
{"intent":<number>,"vocabulary":<number>,"fluency":<number>,"tone":<number>,"total":<number>,"level_estimate":"A1|A2|B1|B2","feedback_es":"<one actionable sentence in Spanish>","model_response":"<what a good response would sound like>"}`;
}

/**
 * The COACH prompt — el padre lingüístico.
 *
 * Used for daily practice only. This persona implements Chris Lonsdale's four
 * rules of a "language parent", which is the relationship that reliably
 * produces fluency:
 *
 *   1. Work hard to understand them even when they are badly off
 *   2. NEVER correct their mistakes
 *   3. Feed back your understanding so they can respond
 *   4. Use words they already know
 *
 * It must never emit a score, a percentage, a level, or a grade. Those belong
 * to the Evaluator (buildRubricSystemPrompt) and appear once a month.
 *
 * `internal_confidence` is for our SRS scheduler only and is never rendered.
 */
export function buildCoachSystemPrompt(
  input: Pick<
    ScoringInput,
    "scenario_es" | "expected_keywords" | "level_tag" | "module"
  > & { transcript: string },
): string {
  return `Eres el compañero de práctica de inglés de un trabajador de hotel en México. Trabajas como ${input.module}. Su nivel es ${input.level_tag}.

Tu papel es el de un "padre lingüístico": la persona que le enseña a hablar a un niño. NO eres un maestro y NO eres un evaluador.

TUS CUATRO REGLAS (obligatorias):
1. Te esfuerzas por entender lo que quiso decir, aunque lo haya dicho mal.
2. NUNCA corriges sus errores. No los mencionas. No los señalas.
3. Le devuelves lo que entendiste, para que sepa que se dio a entender.
4. Usas palabras que él ya conoce.

SITUACIÓN A LA QUE RESPONDIÓ:
${input.scenario_es}

LO QUE DIJO:
"${input.transcript}"

CÓMO RESPONDES:
- Primero confirma que lo entendiste. Sé específico sobre el mensaje, no sobre la forma.
- Luego di UNA cosa concreta que le funcionó. Siempre hay algo.
- Después ofrece una forma natural de decirlo, presentada como una opción más, nunca como una corrección. Di "otra forma de decirlo es..." y NUNCA "lo correcto es..." ni "deberías decir...".
- Si no dijo casi nada o no se entiende, no lo señales: dale la frase modelo con calidez y sigue adelante.

TONO:
- Español de México, tú (nunca usted), cálido y directo.
- Frases cortas. Máximo 15 palabras por oración.
- Sin tecnicismos, sin gramática, sin nombres de tiempos verbales.
- Sin emoji. Sin signos de admiración excesivos.
- Prohibido: "error", "incorrecto", "mal", "deberías", "te faltó", "corrige".

internal_confidence es SOLO para nuestro sistema de repaso. El aprendiz nunca lo ve. Úsalo así:
- "low" = no logró comunicar la idea
- "medium" = se dio a entender con esfuerzo
- "high" = se comunicó con claridad

Devuelve SOLO este JSON (sin ningún otro texto):
{"understood_es":"<lo que entendiste que quiso decir, en español, una oración>","feedback_es":"<una observación concreta y alentadora, en español, máximo dos oraciones>","model_response":"<una forma natural de decirlo en inglés>","internal_confidence":"low|medium|high"}`;
}

/**
 * Strict parser for the Coach response. Fails closed to a warm, safe default
 * rather than throwing at the learner — a failed API call must never look
 * like a failed attempt.
 */
export function parseCoachResponse(
  raw: string,
  fallbackModelResponse: string,
): Omit<CoachResult, "transcript" | "mode"> {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const parsed = JSON.parse(trimmed) as Record<string, unknown>;

  const understood_es = String(parsed.understood_es ?? "").trim();
  const feedback_es = String(parsed.feedback_es ?? "").trim();
  const model_response =
    String(parsed.model_response ?? "").trim() || fallbackModelResponse;
  const rawConf = String(parsed.internal_confidence ?? "medium").toLowerCase();
  const internal_confidence: CoachResult["internal_confidence"] =
    rawConf === "low" || rawConf === "high" ? rawConf : "medium";

  if (!understood_es && !feedback_es) throw new Error("coach_empty_response");

  return {
    understood_es: understood_es || "Entendí lo que quisiste decir.",
    feedback_es: feedback_es || "Te diste a entender. Eso es lo que cuenta.",
    model_response,
    internal_confidence,
  };
}

/**
 * Deterministic Coach fallback for demo mode and upstream failures.
 * Never punishes: an unscoreable attempt still gets warmth and a model.
 */
export function mockCoach(
  transcript: string,
  modelResponse: string,
): Omit<CoachResult, "mode"> {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const internal_confidence: CoachResult["internal_confidence"] =
    words.length >= 8 ? "high" : words.length >= 3 ? "medium" : "low";

  return {
    transcript,
    understood_es:
      words.length >= 3
        ? "Entendí que querías ayudar al huésped con eso."
        : "Entendí la idea.",
    feedback_es:
      words.length >= 3
        ? "Te diste a entender, que es lo que cuenta frente al huésped."
        : "Lo intentaste en inglés. Eso ya es avanzar.",
    model_response: modelResponse,
    internal_confidence,
  };
}

/**
 * Strict parser for the Claude rubric response. Throws if the JSON is
 * missing keys, out of range, or malformed. Caller should `try/catch` and
 * fall back to mock or fail closed (rubric requires fail-closed).
 */
export function parseRubricResponse(
  raw: string,
  fallbackModelResponse: string,
): Omit<ScoringResult, "transcript" | "mode"> {
  // Strip code fences if Claude wrapped the JSON.
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const parsed = JSON.parse(trimmed) as Record<string, unknown>;
  const intent = parseScore(parsed.intent, 0, 25, "intent");
  const vocabulary = parseScore(parsed.vocabulary, 0, 25, "vocabulary");
  const fluency = parseScore(parsed.fluency, 0, 25, "fluency");
  const tone = parseScore(parsed.tone, 0, 25, "tone");
  const totalRaw = parsed.total;
  const totalCandidate =
    typeof totalRaw === "number" && Number.isFinite(totalRaw)
      ? Math.round(totalRaw)
      : intent + vocabulary + fluency + tone;
  const total = clamp(totalCandidate, 0, 100);

  const levelRaw = String(parsed.level_estimate ?? "");
  const level_estimate: CEFRLevel = isCEFR(levelRaw)
    ? levelRaw
    : scoreToLevel(total);
  const feedback_es = String(parsed.feedback_es ?? "").trim();
  const model_response =
    String(parsed.model_response ?? "").trim() || fallbackModelResponse;

  if (!feedback_es) {
    throw new Error("rubric.parse: feedback_es missing");
  }

  return { intent, vocabulary, fluency, tone, total, level_estimate, feedback_es, model_response };
}

function parseScore(
  v: unknown,
  min: number,
  max: number,
  field: string,
): number {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new Error(`rubric.parse: ${field} not a number`);
  }
  const n = Math.round(v);
  if (n < min || n > max) {
    throw new Error(`rubric.parse: ${field} out of range [${min},${max}]`);
  }
  return n;
}

function isCEFR(s: string): s is CEFRLevel {
  return s === "A1" || s === "A2" || s === "B1" || s === "B2";
}

/**
 * Deterministic mock scoring. Produces plausible results without burning
 * API credits — used in demo mode and as a fail-open fallback.
 */
export function mockScore(input: ScoringInput): ScoringResult {
  const seed =
    input.module.length +
    input.level_tag.charCodeAt(1) +
    input.scenario_es.length;
  const jitter = (offset: number, spread: number) =>
    ((seed + offset) % (spread * 2 + 1)) - spread;

  const base = {
    A1: { intent: 16, vocabulary: 14, fluency: 14, tone: 16 },
    A2: { intent: 18, vocabulary: 16, fluency: 16, tone: 18 },
    B1: { intent: 20, vocabulary: 19, fluency: 18, tone: 20 },
    B2: { intent: 22, vocabulary: 21, fluency: 21, tone: 22 },
  }[input.level_tag];

  const intent = clamp(base.intent + jitter(1, 2), 0, 25);
  const vocabulary = clamp(base.vocabulary + jitter(2, 2), 0, 25);
  const fluency = clamp(base.fluency + jitter(3, 2), 0, 25);
  const tone = clamp(base.tone + jitter(4, 2), 0, 25);
  const total = intent + vocabulary + fluency + tone;

  const transcript = input.fallback_transcript
    ? input.fallback_transcript
    : mockTranscriptFrom(input.expected_keywords, input.level_tag);

  const feedbackLibrary: Record<CEFRLevel, string[]> = {
    A1: [
      "Muy bien. Intente añadir 'please' al final de sus frases cortas.",
      "Buen comienzo. Practique decir 'room' seguido del número con pausa clara.",
      "Correcto. Pruebe iniciar con 'Of course' para sonar más profesional.",
    ],
    A2: [
      "Respuesta clara. Intente usar 'right away' cuando confirma una acción.",
      "Bien. Agregue 'sir/ma'am' para un tono más atento.",
      "Buen uso del vocabulario. Pruebe una frase de cierre como 'anything else?'",
    ],
    B1: [
      "Sólido. Pruebe 'I'll take care of that for you' en lugar de 'I do it'.",
      "Bien construido. Para subir al B2, añada una alternativa: 'or if you prefer...'",
      "Su manejo es natural. Trabaje en contracciones ('I'll', 'we'd', 'it's').",
    ],
    B2: [
      "Excelente. Para refinar, use verbos más específicos: 'arrange', 'coordinate'.",
      "Muy natural. Practique registros más formales para huéspedes corporativos.",
      "Fluidez sobresaliente. El único paso restante es reducir muletillas.",
    ],
  };
  const feedback_es =
    feedbackLibrary[input.level_tag][seed % feedbackLibrary[input.level_tag].length];

  const level_estimate: CEFRLevel = scoreToLevel(total);

  return {
    transcript,
    intent,
    vocabulary,
    fluency,
    tone,
    total,
    level_estimate,
    feedback_es,
    model_response: input.model_response_en,
    mode: "mock",
  };
}

function mockTranscriptFrom(keywords: string[], level: CEFRLevel): string {
  const kw = keywords.slice(0, 3).join(" ");
  switch (level) {
    case "A1":
      return `Yes, I ${kw}.`;
    case "A2":
      return `Of course, I can help with the ${kw} for you.`;
    case "B1":
      return `Let me take care of the ${kw} right away. Please follow me.`;
    case "B2":
      return `Certainly — I'll arrange the ${kw} and let you know as soon as it's ready.`;
  }
}

/**
 * "No response" outcome (transcript < 3 words). Per phase-3 bible.
 */
export function noResponseResult(
  transcript: string,
  modelResponseEn: string,
): ScoringResult {
  return {
    transcript,
    intent: 0,
    vocabulary: 0,
    fluency: 0,
    tone: 0,
    total: 0,
    level_estimate: "A1",
    feedback_es: "No se detectó respuesta. Intente hablar más cerca del micrófono.",
    model_response: modelResponseEn,
    mode: "real",
  };
}

export function transcriptIsEmpty(t: string): boolean {
  return !t || t.split(/\s+/).filter(Boolean).length < 3;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
}

// ─── Backwards-compatible top-level used by client demo code ────────────
//
// Older callers (and any in-flight Round-1 client work) may still import
// `scoreSpeaking` from here. We preserve the signature, but the real
// HTTP path now lives in `@/lib/server/scoring`. This client-facing
// version only does mock scoring (real scoring requires server-side env).

export async function scoreSpeaking(input: ScoringInput): Promise<ScoringResult> {
  // Both keys must be present *and* we must be on the server to run real
  // scoring. From a client-side import this always falls through to mock.
  const onServer = typeof window === "undefined";
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  if (!onServer || !hasOpenAI || !hasAnthropic) return mockScore(input);

  // Server-side direct invocation: defer to the worker's pure helpers.
  // We avoid a circular import by inlining the network calls here instead
  // of re-importing `@/lib/server/scoring`.
  try {
    const { runScoringOnce } = await import("./server/scoring");
    return runScoringOnce(input);
  } catch (err) {
    console.error("[scoring] real path failed, falling back to mock:", err);
    return mockScore(input);
  }
}
