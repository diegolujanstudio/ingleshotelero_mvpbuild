"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, Volume2, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  buildPerceptionQuestion,
  isPerceptionContrast,
  type PhonemeContrast,
} from "@/content/minimal-pairs";
import { cn } from "@/lib/utils";

/**
 * "La Semana Sin Pena" — minimal-pair trainer.
 *
 * Two modes, because the four contrasts are not the same kind of problem:
 *
 * PERCEPTION (i/ɪ, ch/sh, b/v) — hear a word, tap which of two real words it
 * was. Binary green/red feedback: perception is objective and CAN be marked
 * wrong (METODO-TURNO §5).
 *
 * ECHO (s-onset) — there is no English minimal pair for "stay/estay" because
 * "estay" is not a word. The old UI showed it as a tappable option anyway,
 * which asked the learner to choose between a word and a mistake — confusing,
 * and it printed the error as if it were vocabulary. Now: listen, see the
 * elongation cue (sss·tay), say it aloud, self-confirm. The learner's own
 * voice is NEVER marked wrong — production always belongs to the Coach.
 *
 * Design decisions, each deliberate:
 * - Progress = 8 dots, not "3 de 8" text. Lower-literacy users get position
 *   at a glance without parsing a sentence (NN/g); visible accomplishment is
 *   Octalysis CD2, the drive that matters most during onboarding.
 * - Option cards ≥72px, word set large in serif: this is a thumb target on a
 *   mid-range Android held one-handed on a shift break.
 * - Spanish gloss appears under EACH word after answering — meaning attaches
 *   to the word it belongs to, not in a combined footnote line.
 * - Explicit "Seguir", no auto-advance: the reveal is the teaching moment,
 *   and this audience loses the thread when the screen moves on its own.
 * - No emoji, one accent, no shadows — design system.
 */

const PERCEPTION_QUESTIONS = 8;

export function MinimalPairTrainer({
  contrast,
  onDone,
}: {
  contrast: PhonemeContrast;
  onDone?: (correct: number, total: number) => void;
}) {
  const perception = isPerceptionContrast(contrast);
  const total = perception ? PERCEPTION_QUESTIONS : contrast.pairs.length;

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  /** Per-step outcome for the progress dots. */
  const [results, setResults] = useState<("correct" | "wrong" | "done")[]>([]);
  const [voiceReady, setVoiceReady] = useState(false);
  const seedRef = useRef(Math.floor(Date.now() / 86_400_000)); // stable per day

  const q = buildPerceptionQuestion(contrast, seedRef.current + i);
  const echoPair = contrast.pairs[i % contrast.pairs.length];
  const answer = perception ? (q.target === "a" ? q.pair.a : q.pair.b) : echoPair.a;
  const finished = i >= total;
  const correct = results.filter((r) => r === "correct").length;

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => setVoiceReady(window.speechSynthesis.getVoices().length > 0);
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const say = useCallback((word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.85; // slow enough to discriminate the contrast
    const en = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("en"));
    if (en) u.voice = en;
    window.speechSynthesis.speak(u);
  }, []);

  // Auto-play each new item once voices are ready.
  useEffect(() => {
    if (finished || !voiceReady || picked) return;
    const t = setTimeout(() => say(answer), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, voiceReady, finished]);

  function choose(word: string) {
    if (picked) return;
    setPicked(word);
    setResults((r) => [...r, word === answer ? "correct" : "wrong"]);
  }

  function confirmEcho() {
    setResults((r) => [...r, "done"]);
    setI((n) => n + 1);
  }

  function next() {
    setPicked(null);
    setI((n) => n + 1);
  }

  function restart() {
    setI(0);
    setPicked(null);
    setResults([]);
    seedRef.current += total;
  }

  /* ── Progress dots — position at a glance, no reading required ── */
  const dots = (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={Math.min(i + 1, total)}
      aria-valuemax={total}
      aria-label={`Paso ${Math.min(i + 1, total)} de ${total}`}
    >
      {Array.from({ length: total }, (_, d) => (
        <span
          key={d}
          className={cn(
            "h-1.5 rounded-full transition-all",
            d === i && !finished ? "w-5 bg-ink" : "w-1.5",
            d < results.length
              ? results[d] === "wrong"
                ? "bg-error"
                : "bg-success"
              : d === i && !finished
                ? "bg-ink"
                : "bg-hair",
          )}
        />
      ))}
    </div>
  );

  /* ── Done ── */
  if (finished) {
    const pct = perception ? Math.round((correct / total) * 100) : 100;
    return (
      <div className="rounded-md border border-hair bg-white p-6 md:p-8">
        <p className="caps mb-3 text-success">Listo por hoy</p>
        {perception ? (
          <>
            <h2 className="font-serif text-t-h2 font-medium">
              {correct} de {total} <em>bien</em>.
            </h2>
            <p className="mt-4 max-w-prose font-sans text-t-body text-espresso-soft">
              {pct >= 75
                ? "Ya distingues el sonido. Eso es justo lo que hace que un huésped te entienda a la primera."
                : "Este sonido no existe en español, así que al principio cuesta. Con dos minutos al día el oído se acomoda en cuestión de días."}
            </p>
          </>
        ) : (
          <>
            {/* Echo mode never shows a score: the learner produced with their
                own voice, and production is never graded (Law 1). */}
            <h2 className="font-serif text-t-h2 font-medium">
              Cinco palabras, <em>sin la e</em>.
            </h2>
            <p className="mt-4 max-w-prose font-sans text-t-body text-espresso-soft">
              Ese arranque con s es lo que más marca el acento — y acabas de
              practicarlo cinco veces. Mañana sale más natural.
            </p>
          </>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" onClick={restart}>
            Otra ronda
          </Button>
          {onDone && (
            <Button variant="ghost" onClick={() => onDone(correct, total)}>
              Continuar
            </Button>
          )}
        </div>
      </div>
    );
  }

  /* ── Echo mode (s-onset): listen → cue → say it → confirm ── */
  if (!perception) {
    const word = echoPair.a;
    const cue = `sss·${word.slice(1)}`;
    return (
      <div className="rounded-md border border-hair bg-white p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-hair pb-4">
          {dots}
          <p className="caps text-espresso-muted">Escucha y repite</p>
        </div>

        <div className="text-center">
          <p className="font-serif text-[clamp(2.5rem,9vw,3.5rem)] font-medium leading-none tracking-[-0.02em] text-espresso">
            {word}
          </p>
          <p className="mt-2 font-sans text-t-body text-espresso-muted">
            {echoPair.a_es}
          </p>

          {/* The cue: stretch the s before the consonant. The common error is
              named once, visually struck through — never spoken, never a
              tappable option. */}
          <div className="mx-auto mt-6 max-w-xs rounded-md bg-ivory-soft px-5 py-4">
            <p className="caps mb-1 text-ink">Alarga la s</p>
            <p className="font-serif text-t-h3 font-medium text-ink">{cue}</p>
            <p className="mt-2 font-sans text-t-body text-espresso-muted">
              sin decir{" "}
              <span className="text-error line-through decoration-error/60">
                e
              </span>
              <span className="text-espresso-muted">{word}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="accent" className="min-h-[44px]" onClick={() => say(word)} disabled={!voiceReady}>
            <Volume2 className="mr-2 h-4 w-4" aria-hidden />
            {voiceReady ? "Escuchar otra vez" : "Cargando audio…"}
          </Button>
          <Button variant="primary" className="min-h-[44px]" onClick={confirmEcho}>
            <Mic className="mr-2 h-4 w-4" aria-hidden />
            Lo dije en voz alta
          </Button>
        </div>
      </div>
    );
  }

  /* ── Perception mode: hear it, tap which word it was ── */
  return (
    <div className="rounded-md border border-hair bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-hair pb-4">
        {dots}
        <p className="caps text-espresso-muted">
          /{contrast.symbol_a}/ · /{contrast.symbol_b}/
        </p>
      </div>

      <h2 className="font-serif text-t-h3 font-medium leading-tight">
        Escucha. <em>¿Cuál oíste?</em>
      </h2>

      <div className="mt-5">
        <Button variant="accent" className="min-h-[44px]" onClick={() => say(answer)} disabled={!voiceReady}>
          <Volume2 className="mr-2 h-4 w-4" aria-hidden />
          {voiceReady ? "Escuchar otra vez" : "Cargando audio…"}
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((word) => {
          const isAnswer = word === answer;
          const isPicked = picked === word;
          const reveal = picked !== null;
          const gloss = word === q.pair.a ? q.pair.a_es : q.pair.b_es;
          return (
            <button
              key={word}
              type="button"
              onClick={() => choose(word)}
              disabled={reveal}
              className={cn(
                // ≥72px: a confident thumb target, one-handed, mid-range Android.
                "flex min-h-[72px] flex-col items-center justify-center rounded-md border px-5 py-4 text-center transition-colors",
                !reveal && "border-hair bg-white hover:border-ink active:bg-ivory-soft",
                reveal && isAnswer && "border-success bg-success/5",
                reveal && isPicked && !isAnswer && "border-error bg-error/5",
                reveal && !isPicked && !isAnswer && "border-hair opacity-45",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-serif text-[1.75rem] font-medium leading-none text-espresso">
                  {word}
                </span>
                {reveal && isAnswer && (
                  <Check className="h-5 w-5 text-success" aria-hidden />
                )}
                {reveal && isPicked && !isAnswer && (
                  <X className="h-5 w-5 text-error" aria-hidden />
                )}
              </span>
              {/* Meaning attaches to its own word, only after the answer —
                  before that it would give the question away. */}
              {reveal && (
                <span className="mt-1.5 font-sans text-t-body text-espresso-muted">
                  {gloss}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-6 flex justify-center border-t border-hair pt-5">
          <Button variant="primary" size="lg" onClick={next}>
            Seguir
          </Button>
        </div>
      )}
    </div>
  );
}
