/**
 * Speaking scoring — dual-mode.
 *
 * Real path (when OPENAI_API_KEY + ANTHROPIC_API_KEY are set):
 *   1. Whisper transcribes the audio blob → English text.
 *   2. Claude scores the transcript against the rubric (bible §6).
 *
 * Mock path (no keys):
 *   Deterministic heuristic — plausible-sounding transcript + level-
 *   appropriate numerical scores. Perfect for demos without burning API credit.
 */

import type { CEFRLevel, RoleModule } from "./supabase/types";

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

const OPENAI_API = "https://api.openai.com/v1";
const ANTHROPIC_API = "https://api.anthropic.com/v1";

// ─── Real path ───────────────────────────────────────────────────────

async function transcribeWithWhisper(audio: Blob): Promise<string> {
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

  const systemPrompt = `You are an English pronunciation and communication evaluator for hotel staff in Mexico. You are scoring a spoken response from a ${input.module} at level ${input.level_tag}.

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

  const res = await fetch(`${ANTHROPIC_API}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: "Score the transcript above. JSON only." }],
    }),
  });

  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  const text = data.content.find((c) => c.type === "text")?.text ?? "";
  const parsed = JSON.parse(text);

  return {
    intent: clamp(parsed.intent, 0, 25),
    vocabulary: clamp(parsed.vocabulary, 0, 25),
    fluency: clamp(parsed.fluency, 0, 25),
    tone: clamp(parsed.tone, 0, 25),
    total: clamp(parsed.total, 0, 100),
    level_estimate: parsed.level_estimate as CEFRLevel,
    feedback_es: String(parsed.feedback_es ?? ""),
    model_response: String(parsed.model_response ?? input.model_response_en),
  };
}

// ─── Mock path ───────────────────────────────────────────────────────

/**
 * Deterministic mock scoring. Produces plausible results without burning
 * API credits — useful for demos.
 */
export function mockScore(input: ScoringInput): ScoringResult {
  // Seed using module + level + scenario length for per-prompt variation.
  const seed = input.module.length + input.level_tag.charCodeAt(1) + input.scenario_es.length;
  const jitter = (offset: number, spread: number) =>
    ((seed + offset) % (spread * 2 + 1)) - spread;

  // Base scores by level — biased generous per bible §6 calibration.
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

  // Mock transcript from the first 3 expected keywords.
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

  // level_estimate from total — same bucketing as the final level calc.
  const level_estimate: CEFRLevel =
    total < 30 ? "A1" : total < 55 ? "A2" : total < 78 ? "B1" : "B2";

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

// ─── Top-level ───────────────────────────────────────────────────────

export async function scoreSpeaking(input: ScoringInput): Promise<ScoringResult> {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

  // No keys → pure mock.
  if (!hasOpenAI || !hasAnthropic) return mockScore(input);

  // Real path — fail open to mock if anything goes wrong.
  try {
    const transcript = input.audio_blob
      ? await transcribeWithWhisper(input.audio_blob)
      : input.fallback_transcript ?? "";

    if (!transcript || transcript.split(/\s+/).length < 3) {
      return {
        transcript,
        intent: 0,
        vocabulary: 0,
        fluency: 0,
        tone: 0,
        total: 0,
        level_estimate: "A1",
        feedback_es:
          "No se detectó respuesta. Intente hablar más cerca del micrófono.",
        model_response: input.model_response_en,
        mode: "real",
      };
    }

    const scores = await scoreWithClaude({ ...input, transcript });
    return { transcript, ...scores, mode: "real" };
  } catch (err) {
    console.error("[scoring] real path failed, falling back to mock:", err);
    return mockScore(input);
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
}
