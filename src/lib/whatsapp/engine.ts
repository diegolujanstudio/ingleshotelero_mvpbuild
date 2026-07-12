/**
 * WhatsApp daily-drill conversation engine — PURE.
 *
 * This module has NO side effects and NO imports of `server-only`, Supabase,
 * env, or Twilio. Given the current conversation snapshot, an inbound message,
 * and the day's context, `transition()` returns the next snapshot, the reply
 * text(s) to send, and a list of side-effect descriptors for the caller
 * (the route) to execute (record completion, store a voice note, opt out).
 *
 * Keeping it pure makes the whole flow unit-testable without Twilio or a DB
 * (see engine.test.ts) and lets the same daily drill be delivered over
 * WhatsApp that the web `/practice` loop serves.
 */
import type { Drill } from "@/content/practice-drills";
import { WHATSAPP_COPY } from "@/content/whatsapp";

export type WaState =
  | "idle"
  | "drill_sent"
  | "awaiting_answer"
  | "awaiting_audio"
  | "done";

export interface WaSnapshot {
  state: WaState;
  drill_id: string | null;
  /** Recorded once the listening option is answered; null until then. */
  listening_correct: boolean | null;
}

export interface WaInbound {
  body: string;
  numMedia: number;
  mediaUrl0?: string;
  mediaContentType0?: string;
}

export interface WaContext {
  drill: Drill;
  /** When true, the flow adds a speaking step after the listening answer. */
  speakingEnabled: boolean;
  firstName: string;
}

export type WaEffect =
  | { kind: "complete_drill"; listening_correct: boolean | null }
  | { kind: "store_voice_note"; mediaUrl: string; contentType: string }
  | { kind: "opt_out" };

export interface WaTransition {
  next: WaSnapshot;
  replies: string[];
  effects: WaEffect[];
}

const OPT_OUT_RE = /^\s*(baja|stop|cancelar|cancel|unsubscribe)\s*$/i;
const DONE_TOKEN_RE = /^\s*(listo|ready|ok|terminar|termine|fin)\s*[.!]?\s*$/i;

/** Reply for a fresh drill delivery, plus the numbered options. */
export function renderDrillMessage(drill: Drill, firstName: string): string {
  const options = drill.listening.options
    .map((o, i) => `${i + 1}. ${o.text_es}`)
    .join("\n");
  return [
    WHATSAPP_COPY.greeting(firstName),
    "",
    `🎧 "${drill.listening.audio_text}"`,
    "",
    WHATSAPP_COPY.listeningPrompt,
    "",
    options,
  ].join("\n");
}

const WORD_NUMBERS: Record<string, number> = {
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
};

const KEYCAP_DIGITS: Record<string, number> = {
  "1️⃣": 1,
  "2️⃣": 2,
  "3️⃣": 3,
  "4️⃣": 4,
  "5️⃣": 5,
};

/**
 * Parse a listening-option reply into a 0-based index, or null if it doesn't
 * clearly name a valid option. Accepts a leading digit ("2", "2.", "opción 2"),
 * a keycap emoji (2️⃣), or a Spanish number word (dos). Guards the range so a
 * "4" against a 3-option drill returns null (re-prompt), never a crash.
 */
export function parseOptionReply(body: string, optionCount: number): number | null {
  const raw = (body ?? "").trim();
  if (!raw) return null;

  for (const [emoji, n] of Object.entries(KEYCAP_DIGITS)) {
    if (raw.includes(emoji)) return inRange(n, optionCount);
  }

  const digit = raw.match(/(?:^|\D)([1-9])(?:\D|$)/);
  if (digit) return inRange(Number(digit[1]), optionCount);

  const word = raw.toLowerCase().match(/[a-záéíóú]+/);
  if (word && WORD_NUMBERS[word[0]] != null) {
    return inRange(WORD_NUMBERS[word[0]], optionCount);
  }
  return null;
}

function inRange(oneBased: number, count: number): number | null {
  return oneBased >= 1 && oneBased <= count ? oneBased - 1 : null;
}

/**
 * Normalize a Twilio WhatsApp phone identifier to bare E.164.
 * Strips the "whatsapp:" prefix and, for Mexican numbers, folds the legacy
 * "+521XXXXXXXXXX" (13 digits with the historical mobile "1") to the modern
 * "+52XXXXXXXXXX" (12 digits) so both forms match the same employee row.
 */
export function normalizePhone(raw: string): string {
  let s = (raw ?? "").trim().replace(/^whatsapp:/i, "");
  s = s.replace(/[^\d+]/g, "");
  if (!s.startsWith("+")) s = "+" + s;
  // MX legacy mobile fold: +521 + 10 digits → +52 + 10 digits.
  if (/^\+521\d{10}$/.test(s)) {
    s = "+52" + s.slice(4);
  }
  return s;
}

/** The correct option index for a drill (first `correct: true`), or -1. */
function correctIndex(drill: Drill): number {
  return drill.listening.options.findIndex((o) => o.correct);
}

function answerFeedback(drill: Drill, chosen: number): { text: string; isCorrect: boolean } {
  const correct = correctIndex(drill);
  const isCorrect = chosen === correct;
  const head = isCorrect
    ? WHATSAPP_COPY.correct
    : WHATSAPP_COPY.incorrect(correct + 1);
  const text = [
    head,
    drill.listening.explanation_es,
    "",
    WHATSAPP_COPY.modelLabel,
    `"${drill.reinforce.model_en}"`,
  ].join("\n");
  return { text, isCorrect };
}

/**
 * Core state machine. Deterministic and side-effect-free: the returned
 * `effects` are executed by the route, not here.
 */
export function transition(
  current: WaSnapshot,
  inbound: WaInbound,
  ctx: WaContext,
): WaTransition {
  const body = inbound.body ?? "";

  // Opt-out overrides every state.
  if (OPT_OUT_RE.test(body)) {
    return {
      next: { state: "done", drill_id: current.drill_id, listening_correct: current.listening_correct },
      replies: [WHATSAPP_COPY.optOutConfirm],
      effects: [{ kind: "opt_out" }],
    };
  }

  switch (current.state) {
    case "idle":
    case "drill_sent": {
      // Any inbound opens the session and delivers today's drill.
      return {
        next: { state: "awaiting_answer", drill_id: ctx.drill.id, listening_correct: null },
        replies: [renderDrillMessage(ctx.drill, ctx.firstName)],
        effects: [],
      };
    }

    case "awaiting_answer": {
      const chosen = parseOptionReply(body, ctx.drill.listening.options.length);
      if (chosen === null) {
        return {
          next: current,
          replies: [WHATSAPP_COPY.notRecognized(ctx.drill.listening.options.length)],
          effects: [],
        };
      }
      const { text, isCorrect } = answerFeedback(ctx.drill, chosen);
      if (ctx.speakingEnabled) {
        return {
          next: { state: "awaiting_audio", drill_id: ctx.drill.id, listening_correct: isCorrect },
          replies: [text, WHATSAPP_COPY.speakingPrompt],
          effects: [],
        };
      }
      return {
        next: { state: "done", drill_id: ctx.drill.id, listening_correct: isCorrect },
        replies: [text, WHATSAPP_COPY.doneCore],
        effects: [{ kind: "complete_drill", listening_correct: isCorrect }],
      };
    }

    case "awaiting_audio": {
      if (inbound.numMedia > 0 && inbound.mediaUrl0) {
        return {
          next: { state: "done", drill_id: current.drill_id, listening_correct: current.listening_correct },
          replies: [WHATSAPP_COPY.audioReceived, WHATSAPP_COPY.doneCore],
          effects: [
            {
              kind: "store_voice_note",
              mediaUrl: inbound.mediaUrl0,
              contentType: inbound.mediaContentType0 ?? "audio/ogg",
            },
            { kind: "complete_drill", listening_correct: current.listening_correct },
          ],
        };
      }
      // Any text (LISTO or otherwise) skips the optional audio and completes.
      return {
        next: { state: "done", drill_id: current.drill_id, listening_correct: current.listening_correct },
        replies: [WHATSAPP_COPY.skipAudioOk, WHATSAPP_COPY.doneCore],
        effects: [{ kind: "complete_drill", listening_correct: current.listening_correct }],
      };
    }

    case "done":
    default: {
      return {
        next: current,
        replies: [WHATSAPP_COPY.alreadyDone],
        effects: [],
      };
    }
  }
}
