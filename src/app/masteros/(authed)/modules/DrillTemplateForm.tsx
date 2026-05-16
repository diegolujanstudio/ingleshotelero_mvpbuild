"use client";

/**
 * Friendly, template-style editor for a daily-practice DRILL.
 *
 * Edits the structured Drill object that lives in content_items.options
 * (the authoritative source the product reads — see
 * src/lib/content/drills-store.ts). No JSON typing: guided fields for the
 * listening question, the 3 answer options, the model response, and the
 * vocabulary cards. Editing here changes what employees actually
 * practice (proven end-to-end).
 */

import { Plus, Trash2 } from "lucide-react";

export interface DrillOption {
  emoji: string;
  text_es: string;
  correct: boolean;
}
export interface DrillVocab {
  word_en: string;
  word_es: string;
  example_en: string;
  example_es: string;
}
export interface Drill {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  listening: {
    audio_text: string;
    options: DrillOption[];
    explanation_es: string;
  };
  reinforce: { title_es: string; model_en: string; note_es: string };
  vocabulary: DrillVocab[];
}

export function blankDrill(): Drill {
  return {
    id: "",
    level: "A1",
    listening: {
      audio_text: "",
      options: [
        { emoji: "✅", text_es: "", correct: true },
        { emoji: "❌", text_es: "", correct: false },
        { emoji: "❌", text_es: "", correct: false },
      ],
      explanation_es: "",
    },
    reinforce: { title_es: "Frase modelo", model_en: "", note_es: "" },
    vocabulary: [{ word_en: "", word_es: "", example_en: "", example_es: "" }],
  };
}

/** Best-effort coerce an unknown content_items.options into a Drill. */
export function toDrill(v: unknown): Drill {
  const b = blankDrill();
  if (!v || typeof v !== "object") return b;
  const d = v as Record<string, unknown>;
  const l = (d.listening ?? {}) as Record<string, unknown>;
  const r = (d.reinforce ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : "",
    level: (["A1", "A2", "B1", "B2"].includes(String(d.level))
      ? d.level
      : "A1") as Drill["level"],
    listening: {
      audio_text: typeof l.audio_text === "string" ? l.audio_text : "",
      options: Array.isArray(l.options)
        ? (l.options as DrillOption[]).map((o) => ({
            emoji: typeof o?.emoji === "string" ? o.emoji : "•",
            text_es: typeof o?.text_es === "string" ? o.text_es : "",
            correct: Boolean(o?.correct),
          }))
        : b.listening.options,
      explanation_es:
        typeof l.explanation_es === "string" ? l.explanation_es : "",
    },
    reinforce: {
      title_es: typeof r.title_es === "string" ? r.title_es : "Frase modelo",
      model_en: typeof r.model_en === "string" ? r.model_en : "",
      note_es: typeof r.note_es === "string" ? r.note_es : "",
    },
    vocabulary: Array.isArray(d.vocabulary)
      ? (d.vocabulary as DrillVocab[]).map((w) => ({
          word_en: typeof w?.word_en === "string" ? w.word_en : "",
          word_es: typeof w?.word_es === "string" ? w.word_es : "",
          example_en: typeof w?.example_en === "string" ? w.example_en : "",
          example_es: typeof w?.example_es === "string" ? w.example_es : "",
        }))
      : b.vocabulary,
  };
}

const input =
  "w-full rounded-md border border-hair bg-white px-3 py-2 font-sans text-t-body text-espresso focus:border-ink focus:outline-none";
const label = "caps mb-1.5 block";

export function DrillTemplateForm({
  drill,
  onChange,
}: {
  drill: Drill;
  onChange: (d: Drill) => void;
}) {
  const set = (patch: Partial<Drill>) => onChange({ ...drill, ...patch });
  const setListening = (p: Partial<Drill["listening"]>) =>
    set({ listening: { ...drill.listening, ...p } });
  const setReinforce = (p: Partial<Drill["reinforce"]>) =>
    set({ reinforce: { ...drill.reinforce, ...p } });

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>ID del drill</label>
          <input
            className={input}
            value={drill.id}
            onChange={(e) => set({ id: e.target.value.trim() })}
            placeholder="ej. f-006"
          />
        </div>
        <div>
          <label className={label}>Nivel</label>
          <select
            className={input}
            value={drill.level}
            onChange={(e) =>
              set({ level: e.target.value as Drill["level"] })
            }
          >
            {["A1", "A2", "B1", "B2"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Listening ── */}
      <section className="rounded-md border border-hair bg-white p-4">
        <p className="caps mb-3 text-ink">1 · Escucha</p>
        <label className={label}>Audio en inglés (lo que se escucha)</label>
        <textarea
          className={input}
          rows={2}
          value={drill.listening.audio_text}
          onChange={(e) => setListening({ audio_text: e.target.value })}
          placeholder="Hi, I have a reservation under García."
        />
        <p className="caps mb-1.5 mt-4 block">
          Opciones de respuesta (marca la correcta)
        </p>
        <div className="space-y-2">
          {drill.listening.options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="w-12 rounded-md border border-hair bg-white px-2 py-2 text-center"
                value={o.emoji}
                onChange={(e) => {
                  const opts = [...drill.listening.options];
                  opts[i] = { ...o, emoji: e.target.value };
                  setListening({ options: opts });
                }}
              />
              <input
                className={input}
                value={o.text_es}
                onChange={(e) => {
                  const opts = [...drill.listening.options];
                  opts[i] = { ...o, text_es: e.target.value };
                  setListening({ options: opts });
                }}
                placeholder="Acción en español"
              />
              <label className="flex shrink-0 items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft">
                <input
                  type="radio"
                  name="correct-opt"
                  checked={o.correct}
                  onChange={() => {
                    const opts = drill.listening.options.map((x, xi) => ({
                      ...x,
                      correct: xi === i,
                    }));
                    setListening({ options: opts });
                  }}
                  className="accent-ink"
                />
                Correcta
              </label>
              {drill.listening.options.length > 2 && (
                <button
                  type="button"
                  onClick={() =>
                    setListening({
                      options: drill.listening.options.filter(
                        (_, xi) => xi !== i,
                      ),
                    })
                  }
                  className="rounded-md border border-error/30 p-2 text-error hover:bg-error/5"
                  aria-label="Quitar opción"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          {drill.listening.options.length < 4 && (
            <button
              type="button"
              onClick={() =>
                setListening({
                  options: [
                    ...drill.listening.options,
                    { emoji: "•", text_es: "", correct: false },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
            >
              <Plus className="h-3 w-3" /> Añadir opción
            </button>
          )}
        </div>
        <label className={label + " mt-4"}>
          Explicación (se muestra tras responder)
        </label>
        <textarea
          className={input}
          rows={2}
          value={drill.listening.explanation_es}
          onChange={(e) => setListening({ explanation_es: e.target.value })}
        />
      </section>

      {/* ── Reinforce ── */}
      <section className="rounded-md border border-hair bg-white p-4">
        <p className="caps mb-3 text-ink">2 · Refuerzo</p>
        <label className={label}>Frase modelo (inglés)</label>
        <textarea
          className={input}
          rows={2}
          value={drill.reinforce.model_en}
          onChange={(e) => setReinforce({ model_en: e.target.value })}
          placeholder="Of course. Let me check your reservation right away."
        />
        <label className={label + " mt-4"}>Por qué esta frase (nota)</label>
        <textarea
          className={input}
          rows={2}
          value={drill.reinforce.note_es}
          onChange={(e) => setReinforce({ note_es: e.target.value })}
        />
      </section>

      {/* ── Vocabulary ── */}
      <section className="rounded-md border border-hair bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="caps text-ink">3 · Vocabulario</p>
          <button
            type="button"
            onClick={() =>
              set({
                vocabulary: [
                  ...drill.vocabulary,
                  { word_en: "", word_es: "", example_en: "", example_es: "" },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink hover:text-ink-deep"
          >
            <Plus className="h-3 w-3" /> Tarjeta
          </button>
        </div>
        <div className="space-y-3">
          {drill.vocabulary.map((w, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-2 rounded-md border border-hair p-3"
            >
              <input
                className={input}
                value={w.word_en}
                onChange={(e) => {
                  const v = [...drill.vocabulary];
                  v[i] = { ...w, word_en: e.target.value };
                  set({ vocabulary: v });
                }}
                placeholder="word (EN)"
              />
              <input
                className={input}
                value={w.word_es}
                onChange={(e) => {
                  const v = [...drill.vocabulary];
                  v[i] = { ...w, word_es: e.target.value };
                  set({ vocabulary: v });
                }}
                placeholder="palabra (ES)"
              />
              <input
                className={input}
                value={w.example_en}
                onChange={(e) => {
                  const v = [...drill.vocabulary];
                  v[i] = { ...w, example_en: e.target.value };
                  set({ vocabulary: v });
                }}
                placeholder="example (EN)"
              />
              <input
                className={input}
                value={w.example_es}
                onChange={(e) => {
                  const v = [...drill.vocabulary];
                  v[i] = { ...w, example_es: e.target.value };
                  set({ vocabulary: v });
                }}
                placeholder="ejemplo (ES)"
              />
              {drill.vocabulary.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    set({
                      vocabulary: drill.vocabulary.filter((_, xi) => xi !== i),
                    })
                  }
                  className="col-span-2 justify-self-end rounded-md border border-error/30 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error hover:bg-error/5"
                >
                  Quitar tarjeta
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
