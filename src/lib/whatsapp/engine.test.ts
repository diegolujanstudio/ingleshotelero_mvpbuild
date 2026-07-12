import { describe, it, expect } from "vitest";
import {
  transition,
  parseOptionReply,
  normalizePhone,
  renderDrillMessage,
  type WaSnapshot,
  type WaContext,
} from "./engine";
import type { Drill } from "@/content/practice-drills";

const DRILL: Drill = {
  id: "f-001",
  level: "A2",
  listening: {
    audio_text: "Hi, I have a reservation under Smith.",
    options: [
      { emoji: "📋", text_es: "Buscar la reservación y comenzar el check-in", correct: true },
      { emoji: "🛎️", text_es: "Llamar al botones", correct: false },
      { emoji: "🍳", text_es: "Reservar mesa en el restaurante", correct: false },
    ],
    explanation_es: "El huésped llega con una reservación.",
  },
  reinforce: {
    title_es: "Frase modelo",
    model_en: "Welcome, Mr. Smith. I have your reservation right here.",
    note_es: "Confirmar la reservación genera confianza.",
  },
  vocabulary: [
    { word_en: "reservation", word_es: "reservación", example_en: "x", example_es: "y" },
    { word_en: "ID", word_es: "identificación", example_en: "x", example_es: "y" },
    { word_en: "check-in", word_es: "registro", example_en: "x", example_es: "y" },
  ],
};

const ctx = (over: Partial<WaContext> = {}): WaContext => ({
  drill: DRILL,
  speakingEnabled: false,
  firstName: "María",
  ...over,
});

const snap = (over: Partial<WaSnapshot> = {}): WaSnapshot => ({
  state: "idle",
  drill_id: null,
  listening_correct: null,
  ...over,
});

describe("parseOptionReply", () => {
  it("parses a bare digit within range", () => {
    expect(parseOptionReply("1", 3)).toBe(0);
    expect(parseOptionReply("3", 3)).toBe(2);
  });
  it("parses digit with punctuation and surrounding words", () => {
    expect(parseOptionReply("2.", 3)).toBe(1);
    expect(parseOptionReply("opción 2", 3)).toBe(1);
    expect(parseOptionReply(" 1 ", 3)).toBe(0);
  });
  it("parses keycap emoji digits", () => {
    expect(parseOptionReply("2️⃣", 3)).toBe(1);
  });
  it("parses Spanish number words", () => {
    expect(parseOptionReply("uno", 3)).toBe(0);
    expect(parseOptionReply("Dos", 3)).toBe(1);
  });
  it("returns null for out-of-range and gibberish", () => {
    expect(parseOptionReply("4", 3)).toBeNull();
    expect(parseOptionReply("no sé", 3)).toBeNull();
    expect(parseOptionReply("", 3)).toBeNull();
  });
});

describe("normalizePhone", () => {
  it("strips the whatsapp: prefix", () => {
    expect(normalizePhone("whatsapp:+525512345678")).toBe("+525512345678");
  });
  it("folds legacy MX +521 mobile to +52", () => {
    expect(normalizePhone("whatsapp:+5215512345678")).toBe("+525512345678");
    expect(normalizePhone("+5215512345678")).toBe("+525512345678");
  });
  it("does not fold non-mobile-length or non-MX numbers", () => {
    expect(normalizePhone("+525512345678")).toBe("+525512345678"); // already 12
    expect(normalizePhone("+14155550123")).toBe("+14155550123"); // US
  });
  it("adds a leading + and strips spaces/dashes", () => {
    expect(normalizePhone("52 55 1234 5678")).toBe("+525512345678");
  });
});

describe("transition — happy path (no speaking)", () => {
  it("idle + any text delivers the drill and awaits an answer", () => {
    const t = transition(snap({ state: "idle" }), { body: "hola", numMedia: 0 }, ctx());
    expect(t.next.state).toBe("awaiting_answer");
    expect(t.next.drill_id).toBe("f-001");
    expect(t.replies[0]).toContain("María");
    expect(t.replies[0]).toContain("1. Buscar la reservación");
    expect(t.effects).toHaveLength(0);
  });

  it("correct answer completes and emits complete_drill(true)", () => {
    const t = transition(
      snap({ state: "awaiting_answer", drill_id: "f-001" }),
      { body: "1", numMedia: 0 },
      ctx(),
    );
    expect(t.next.state).toBe("done");
    expect(t.next.listening_correct).toBe(true);
    expect(t.replies[0]).toContain("Correcto");
    expect(t.effects).toEqual([{ kind: "complete_drill", listening_correct: true }]);
  });

  it("wrong answer completes and emits complete_drill(false) with the correct number", () => {
    const t = transition(
      snap({ state: "awaiting_answer", drill_id: "f-001" }),
      { body: "2", numMedia: 0 },
      ctx(),
    );
    expect(t.next.state).toBe("done");
    expect(t.next.listening_correct).toBe(false);
    expect(t.replies[0]).toContain("opción 1");
    expect(t.effects).toEqual([{ kind: "complete_drill", listening_correct: false }]);
  });

  it("unparseable answer re-prompts without changing state or emitting effects", () => {
    const before = snap({ state: "awaiting_answer", drill_id: "f-001" });
    const t = transition(before, { body: "mmm no sé", numMedia: 0 }, ctx());
    expect(t.next).toEqual(before);
    expect(t.replies[0]).toContain("número del 1 al 3");
    expect(t.effects).toHaveLength(0);
  });
});

describe("transition — speaking enabled", () => {
  it("answer moves to awaiting_audio (no completion yet) and prompts for a voice note", () => {
    const t = transition(
      snap({ state: "awaiting_answer", drill_id: "f-001" }),
      { body: "1", numMedia: 0 },
      ctx({ speakingEnabled: true }),
    );
    expect(t.next.state).toBe("awaiting_audio");
    expect(t.next.listening_correct).toBe(true);
    expect(t.effects).toHaveLength(0);
    expect(t.replies[1]).toContain("nota de voz");
  });

  it("a voice note stores it and completes, carrying the earlier listening result", () => {
    const t = transition(
      snap({ state: "awaiting_audio", drill_id: "f-001", listening_correct: false }),
      { body: "", numMedia: 1, mediaUrl0: "https://media/x", mediaContentType0: "audio/ogg" },
      ctx({ speakingEnabled: true }),
    );
    expect(t.next.state).toBe("done");
    expect(t.effects).toEqual([
      { kind: "store_voice_note", mediaUrl: "https://media/x", contentType: "audio/ogg" },
      { kind: "complete_drill", listening_correct: false },
    ]);
  });

  it("LISTO skips the audio and still completes once", () => {
    const t = transition(
      snap({ state: "awaiting_audio", drill_id: "f-001", listening_correct: true }),
      { body: "LISTO", numMedia: 0 },
      ctx({ speakingEnabled: true }),
    );
    expect(t.next.state).toBe("done");
    expect(t.effects).toEqual([{ kind: "complete_drill", listening_correct: true }]);
  });
});

describe("transition — opt-out and idempotence", () => {
  it.each(["BAJA", "stop", "Cancelar"])(
    "%s opts out from any state with a single opt_out effect",
    (word) => {
      const t = transition(snap({ state: "awaiting_answer", drill_id: "f-001" }), { body: word, numMedia: 0 }, ctx());
      expect(t.next.state).toBe("done");
      expect(t.effects).toEqual([{ kind: "opt_out" }]);
    },
  );

  it("done + any further message never re-completes (no duplicate drill credit)", () => {
    const t = transition(
      snap({ state: "done", drill_id: "f-001", listening_correct: true }),
      { body: "1", numMedia: 0 },
      ctx(),
    );
    expect(t.next.state).toBe("done");
    expect(t.effects).toHaveLength(0);
    expect(t.replies[0]).toContain("Ya completó");
  });
});

describe("renderDrillMessage", () => {
  it("numbers every option and includes the audio text", () => {
    const msg = renderDrillMessage(DRILL, "");
    expect(msg).toContain("Hi, I have a reservation under Smith.");
    expect(msg).toContain("1. Buscar la reservación y comenzar el check-in");
    expect(msg).toContain("2. Llamar al botones");
    expect(msg).toContain("3. Reservar mesa en el restaurante");
  });
});
