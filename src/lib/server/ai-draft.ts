import "server-only";

/**
 * AI drill drafting — the content-scale unlock.
 *
 * Given a role + CEFR level + a one-line scenario, Claude returns a full
 * structured Drill (the exact shape content_items.options stores and the
 * practice loop reads). The team tweaks + publishes via the existing
 * template editor; audio auto-generates on first serve. Authoring goes
 * from ~an hour to ~a minute — this is how the catalog reaches
 * Duolingo-class breadth.
 *
 * If ANTHROPIC_API_KEY is absent we return a deterministic, usable
 * scaffold (never broken — same honest fallback pattern as scoring): the
 * editor opens pre-filled and the human finishes it.
 */

const ANTHROPIC_API = "https://api.anthropic.com/v1";
const MODEL = process.env.ANTHROPIC_SCORING_MODEL ?? "claude-sonnet-4-5";

export type Role = "bellboy" | "frontdesk" | "restaurant";
export type Level = "A1" | "A2" | "B1" | "B2";

export interface DraftDrill {
  id: string;
  level: Level;
  listening: {
    audio_text: string;
    options: { emoji: string; text_es: string; correct: boolean }[];
    explanation_es: string;
  };
  reinforce: { title_es: string; model_en: string; note_es: string };
  vocabulary: {
    word_en: string;
    word_es: string;
    example_en: string;
    example_es: string;
  }[];
}

const ROLE_CONTEXT: Record<Role, string> = {
  bellboy:
    "a hotel bellboy/porter: luggage, escorting guests, directions, amenities",
  frontdesk:
    "a hotel front-desk agent: check-in/out, reservations, requests, problems",
  restaurant:
    "hotel restaurant/bar staff: greeting, taking orders, recommendations, the bill",
};

function scaffold(role: Role, level: Level, scenario: string): DraftDrill {
  const id = `${role[0]}-draft-${Date.now().toString(36)}`;
  return {
    id,
    level,
    listening: {
      audio_text: scenario.trim() || "Hello, can you help me, please?",
      options: [
        { emoji: "✅", text_es: "Atender la petición del huésped", correct: true },
        { emoji: "❌", text_es: "Ignorar al huésped", correct: false },
        { emoji: "❌", text_es: "Cobrar la cuenta", correct: false },
      ],
      explanation_es:
        "Edita esta explicación: por qué la primera opción es la correcta.",
    },
    reinforce: {
      title_es: "Frase modelo",
      model_en: "Of course. Let me help you with that right away.",
      note_es: "Edita: por qué esta frase suena profesional y cálida.",
    },
    vocabulary: [
      {
        word_en: "right away",
        word_es: "enseguida",
        example_en: "I'll take care of that right away.",
        example_es: "Me encargo de eso enseguida.",
      },
    ],
  };
}

export async function draftDrill(input: {
  role: Role;
  level: Level;
  scenario: string;
}): Promise<{ drill: DraftDrill; source: "ai" | "scaffold" }> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return {
      drill: scaffold(input.role, input.level, input.scenario),
      source: "scaffold",
    };
  }

  const system = `You are an expert ESL curriculum designer for hospitality staff in Latin America. You write ONE daily-practice drill for ${ROLE_CONTEXT[input.role]}, CEFR level ${input.level}.

Return STRICT JSON only (no prose, no markdown fences), exactly this shape:
{
  "id": "short-kebab-id",
  "level": "${input.level}",
  "listening": {
    "audio_text": "<a natural English line a hotel GUEST would say, level-appropriate for ${input.level}>",
    "options": [
      {"emoji":"<relevant emoji>","text_es":"<correct action in Spanish>","correct":true},
      {"emoji":"<emoji>","text_es":"<plausible wrong action ES>","correct":false},
      {"emoji":"<emoji>","text_es":"<another wrong action ES>","correct":false}
    ],
    "explanation_es": "<1-2 sentences in Spanish explaining why the correct option is right>"
  },
  "reinforce": {
    "title_es": "Frase modelo",
    "model_en": "<the gold-standard English response the staff member should say>",
    "note_es": "<1-2 sentences in Spanish: why this phrasing is professional/warm>"
  },
  "vocabulary": [
    {"word_en":"<key term>","word_es":"<ES>","example_en":"<sentence using it>","example_es":"<ES translation>"},
    {"word_en":"...","word_es":"...","example_en":"...","example_es":"..."},
    {"word_en":"...","word_es":"...","example_en":"...","example_es":"..."}
  ]
}
Rules: exactly 3 options with exactly one correct; exactly 3 vocabulary cards; English natural and ${input.level}-appropriate; Spanish is Mexican, professional, never condescending. Scenario from the team: "${input.scenario}".`;

  try {
    const res = await fetch(`${ANTHROPIC_API}/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system,
        messages: [
          { role: "user", content: "Generate the drill. JSON only." },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Claude ${res.status}`);
    const data = (await res.json()) as {
      content: { type: string; text: string }[];
    };
    const text = data.content.find((c) => c.type === "text")?.text ?? "";
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as DraftDrill;
    // Minimal shape guard — fall back to scaffold if Claude drifted.
    if (
      !parsed?.listening?.audio_text ||
      !Array.isArray(parsed.listening.options) ||
      !parsed?.reinforce?.model_en ||
      !Array.isArray(parsed.vocabulary)
    ) {
      throw new Error("bad_shape");
    }
    parsed.level = input.level;
    if (!parsed.id) parsed.id = `${input.role[0]}-ai-${Date.now().toString(36)}`;
    return { drill: parsed, source: "ai" };
  } catch {
    return {
      drill: scaffold(input.role, input.level, input.scenario),
      source: "scaffold",
    };
  }
}
