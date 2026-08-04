/**
 * Combinatorial drill generation — METODO-TURNO.md §6.5.
 *
 * THE PROBLEM THIS SOLVES
 * The authored library has ~5 drills per (role, level). The picker excludes
 * anything seen in the last 3 days, so a learner exhausts their level in under
 * a week and starts seeing repeats inside a 14-day pilot. An *enumerated*
 * library always runs out; a *combinatorial* one does not.
 *
 *   situation × guest personality × pressure level
 *
 * 5 authored situations become 5 × 5 × 3 = 75 distinct rehearsals per cell.
 *
 * WHY THIS IS PEDAGOGY, NOT PADDING
 * A real shift is never the neutral version of a situation. The same request
 * arrives from a guest who is late, or annoyed, or lost — while the lobby is
 * full. Rehearsing one function under varying emotional and operational load
 * is precisely the transfer we want, and it is closer to the job than five
 * unrelated neutral scripts.
 *
 * DESIGN CONSTRAINTS
 * - **Deterministic.** variantId() is stable, so drill_history and the SRS
 *   scheduler keep working. The same (base, personality, pressure) always
 *   yields the same drill.
 * - **Always grammatical.** Modifiers only ever *prepend* whole sentences.
 *   We never splice or rewrite the authored English, because a string
 *   transform cannot be trusted to keep arbitrary sentences correct.
 * - **Vocabulary is untouched.** Cards belong to the situation, not the
 *   variant, so SRS scheduling on words is unaffected.
 */

import type { Drill, Role } from "./practice-drills";
import { DRILLS } from "./practice-drills";

export type PersonalityId =
  | "neutral"
  | "apurado"
  | "molesto"
  | "confundido"
  | "formal";

export type PressureId = "tranquilo" | "ocupado" | "critico";

export interface GuestPersonality {
  id: PersonalityId;
  /** Shown to the learner before the audio, so they know who is speaking. */
  label_es: string;
  /** Whole sentences prepended to the guest's English. Never spliced. */
  opener_en: string;
  /**
   * The acknowledgement a good employee gives BEFORE the model response.
   * This is the part that actually differs by personality — the information
   * is the same, the repair is not.
   */
  ack_en: string;
  /** Why this response shape matters, in Spanish. Coach voice, `tú`. */
  note_es: string;
}

export interface PressureLevel {
  id: PressureId;
  label_es: string;
  /** The operational context sentence shown with the scenario. */
  context_es: string;
  /** Extra coaching for the harder levels; empty at `tranquilo`. */
  note_es: string;
}

export const PERSONALITIES: GuestPersonality[] = [
  {
    id: "neutral",
    label_es: "Huésped tranquilo",
    opener_en: "",
    ack_en: "",
    note_es: "",
  },
  {
    id: "apurado",
    label_es: "Huésped con prisa",
    opener_en: "Excuse me, I'm in a real hurry.",
    ack_en: "Right away, sir.",
    note_es:
      "Con alguien apurado, primero dile que ya vas. La frase corta tranquiliza más que la explicación larga.",
  },
  {
    id: "molesto",
    label_es: "Huésped molesto",
    opener_en: "Excuse me. I've been waiting quite a while.",
    ack_en: "I'm very sorry about the wait.",
    note_es:
      "Cuando alguien está molesto, reconoce la molestia antes de resolver. Sin la disculpa, la solución no se escucha.",
  },
  {
    id: "confundido",
    label_es: "Huésped perdido",
    opener_en: "Sorry, I think I'm a bit lost.",
    ack_en: "No problem at all — let me help you.",
    note_es:
      "Al que anda perdido, bájale la pena primero. «No problem at all» hace que se sienta menos tonto por preguntar.",
  },
  {
    id: "formal",
    label_es: "Huésped formal",
    opener_en: "Good evening.",
    ack_en: "Certainly, sir.",
    note_es:
      "Con un huésped formal, contesta formal. «Certainly» suena más profesional que «sure» o «okay».",
  },
];

export const PRESSURES: PressureLevel[] = [
  {
    id: "tranquilo",
    label_es: "Turno tranquilo",
    context_es: "El lobby está tranquilo. Tienes tiempo.",
    note_es: "",
  },
  {
    id: "ocupado",
    label_es: "Turno ocupado",
    context_es: "Hay fila en recepción y el teléfono está sonando.",
    note_es:
      "Cuando hay fila, la frase corta y completa gana. No cortes la cortesía, corta la explicación.",
  },
  {
    id: "critico",
    label_es: "Turno crítico",
    context_es:
      "Tres huéspedes esperando, el sistema va lento y tu compañero no llegó.",
    note_es:
      "Bajo presión, di una sola frase y cumple. Prometer de más es lo que genera la queja después.",
  },
];

const PERSONALITY_BY_ID = new Map(PERSONALITIES.map((p) => [p.id, p]));
const PRESSURE_BY_ID = new Map(PRESSURES.map((p) => [p.id, p]));

/** Stable, parseable id: `b-001~apurado~ocupado`. */
export function variantId(
  baseId: string,
  personality: PersonalityId,
  pressure: PressureId,
): string {
  return `${baseId}~${personality}~${pressure}`;
}

export function parseVariantId(
  id: string,
): { baseId: string; personality: PersonalityId; pressure: PressureId } | null {
  const parts = id.split("~");
  if (parts.length !== 3) return null;
  const [baseId, personality, pressure] = parts;
  if (!PERSONALITY_BY_ID.has(personality as PersonalityId)) return null;
  if (!PRESSURE_BY_ID.has(pressure as PressureId)) return null;
  return {
    baseId,
    personality: personality as PersonalityId,
    pressure: pressure as PressureId,
  };
}

/** Join sentences without producing double spaces or stray punctuation. */
function joinSentences(...parts: string[]): string {
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ");
}

/**
 * Does the authored response already perform this personality's repair?
 *
 * Many authored drills — especially the B1/B2 "something went wrong" ones —
 * already apologise, because that IS the correct answer to the neutral
 * situation. Prepending the `molesto` acknowledgement on top produced real
 * stutters like:
 *
 *   "I'm very sorry about the wait. I'm very sorry. I'll stop the water..."
 *   "I'm very sorry about the wait. I completely understand, and I'm sorry
 *    for the inconvenience. ..."
 *
 * A learner repeating that aloud sounds broken, which is the opposite of the
 * point. Checking only the first characters missed the second case, where the
 * apology sits mid-sentence — so we match on MEANING anywhere in the response,
 * keyed per personality, and let the modifier step aside when the job is done.
 */
const ACK_KEYWORDS: Record<PersonalityId, string[]> = {
  neutral: [],
  apurado: ["right away", "right now", "immediately", "straight away"],
  molesto: ["sorry", "apolog", "i understand", "you're right"],
  confundido: ["no problem", "let me help", "happy to help", "of course"],
  formal: ["certainly", "of course", "absolutely"],
};

function alreadyAcknowledges(model: string, personality: PersonalityId): boolean {
  const m = model.toLowerCase();
  return ACK_KEYWORDS[personality].some((k) => m.includes(k));
}

/**
 * Build a concrete drill from a base situation plus a personality and a
 * pressure level. Pure — no clock, no randomness.
 */
export function generateVariant(
  base: Drill,
  personalityId: PersonalityId,
  pressureId: PressureId,
): Drill {
  const p = PERSONALITY_BY_ID.get(personalityId);
  const pr = PRESSURE_BY_ID.get(pressureId);
  // Unknown ids degrade to the authored drill rather than throwing — a bad
  // id in a URL must never break someone's daily practice.
  if (!p || !pr) return base;
  if (personalityId === "neutral" && pressureId === "tranquilo") {
    return { ...base, id: variantId(base.id, personalityId, pressureId) };
  }

  return {
    ...base,
    id: variantId(base.id, personalityId, pressureId),
    listening: {
      ...base.listening,
      audio_text: joinSentences(p.opener_en, base.listening.audio_text),
      // Options are untouched: the correct ACTION does not change with mood.
      // That is the point — same job, different weather.
      explanation_es: joinSentences(
        pr.context_es,
        base.listening.explanation_es,
      ),
    },
    reinforce: {
      ...base.reinforce,
      // Only add the personality's acknowledgement when the authored response
      // does not already perform it — otherwise the learner is taught to
      // apologise twice in a row.
      model_en: alreadyAcknowledges(base.reinforce.model_en, personalityId)
        ? base.reinforce.model_en
        : joinSentences(p.ack_en, base.reinforce.model_en),
      note_es: joinSentences(base.reinforce.note_es, p.note_es, pr.note_es),
    },
  };
}

/**
 * Every variant for a (role, level) cell, in a deterministic order.
 * Ordering matters: the picker walks this list by day-of-year, so a stable
 * order is what guarantees a learner does not see the same variant twice in
 * a cycle.
 */
export function variantsFor(
  role: Role,
  level: Drill["level"],
): { baseId: string; personality: PersonalityId; pressure: PressureId }[] {
  const bases = (DRILLS[role] ?? []).filter((d) => d.level === level);
  const out: {
    baseId: string;
    personality: PersonalityId;
    pressure: PressureId;
  }[] = [];
  // Pressure is the outer loop so early cycles stay calm: a learner meets
  // every situation and personality at `tranquilo` before the shift gets hard.
  for (const pr of PRESSURES) {
    for (const p of PERSONALITIES) {
      for (const b of bases) {
        out.push({ baseId: b.id, personality: p.id, pressure: pr.id });
      }
    }
  }
  return out;
}

/** How many distinct rehearsals a cell can produce. */
export function countVariants(role: Role, level: Drill["level"]): number {
  const bases = (DRILLS[role] ?? []).filter((d) => d.level === level).length;
  return bases * PERSONALITIES.length * PRESSURES.length;
}

/** Resolve any drill id — authored or variant — to a concrete drill. */
export function resolveDrill(role: Role, id: string): Drill | null {
  const parsed = parseVariantId(id);
  const baseId = parsed?.baseId ?? id;
  const base = (DRILLS[role] ?? []).find((d) => d.id === baseId);
  if (!base) return null;
  if (!parsed) return base;
  return generateVariant(base, parsed.personality, parsed.pressure);
}
