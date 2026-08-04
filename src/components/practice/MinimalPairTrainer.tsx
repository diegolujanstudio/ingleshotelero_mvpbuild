"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  buildPerceptionQuestion,
  isPerceptionContrast,
  type PhonemeContrast,
} from "@/content/minimal-pairs";
import { cn } from "@/lib/utils";

/**
 * "La Semana Sin Pena" — minimal-pair perception trainer.
 *
 * 60–90 seconds. Hear a word, choose which of two it was. Binary feedback,
 * because perception is objective and can be marked wrong.
 *
 * PRODUCTION IS NEVER MARKED WRONG. This component only ever grades what the
 * learner *heard*. Their own voice is handled by the Coach, which opens with
 * what worked (Law 1). Putting a red X on someone's speech is precisely the
 * humiliation this whole module exists to undo.
 */

const QUESTIONS_PER_SESSION = 8;

export function MinimalPairTrainer({
  contrast,
  onDone,
}: {
  contrast: PhonemeContrast;
  onDone?: (correct: number, total: number) => void;
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const seedRef = useRef(Math.floor(Date.now() / 86_400_000)); // stable per day

  const perception = isPerceptionContrast(contrast);
  const q = buildPerceptionQuestion(contrast, seedRef.current + i);
  const answer = q.target === "a" ? q.pair.a : q.pair.b;
  const done = i >= QUESTIONS_PER_SESSION;

  // SpeechSynthesis needs its voice list loaded before the first utterance or
  // the first word plays in the wrong accent (or silently).
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
    u.rate = 0.85; // minimal pairs need to be slow enough to discriminate
    const en = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("en"));
    if (en) u.voice = en;
    window.speechSynthesis.speak(u);
  }, []);

  // Auto-play each new question once the voices are available.
  useEffect(() => {
    if (done || !voiceReady || picked) return;
    const t = setTimeout(() => say(answer), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, voiceReady, done]);

  function choose(word: string) {
    if (picked) return;
    setPicked(word);
    if (word === answer) setCorrect((c) => c + 1);
  }

  function next() {
    setPicked(null);
    setI((n) => n + 1);
  }

  if (done) {
    const pct = Math.round((correct / QUESTIONS_PER_SESSION) * 100);
    return (
      <div className="rounded-md border border-hair bg-white p-8">
        <p className="caps mb-3 text-success">Listo por hoy</p>
        <h2 className="font-serif text-t-h2 font-medium">
          {correct} de {QUESTIONS_PER_SESSION} <em>bien</em>.
        </h2>
        <p className="mt-4 max-w-prose font-sans text-t-body text-espresso-soft">
          {pct >= 75
            ? "Ya distingues el sonido. Eso es justo lo que hace que un huésped te entienda a la primera."
            : "Este sonido no existe en español, así que al principio cuesta. Con dos minutos al día el oído se acomoda en cuestión de días."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setI(0);
              setCorrect(0);
              setPicked(null);
              seedRef.current += QUESTIONS_PER_SESSION;
            }}
          >
            Otra ronda
          </Button>
          {onDone && (
            <Button variant="ghost" onClick={() => onDone(correct, QUESTIONS_PER_SESSION)}>
              Continuar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-hair bg-white p-6 md:p-8">
      <div className="mb-6 flex items-baseline justify-between border-b border-hair pb-4">
        <p className="caps text-espresso-muted">
          {i + 1} de {QUESTIONS_PER_SESSION}
        </p>
        <p className="caps text-espresso-muted">
          /{contrast.symbol_a}/ · /{contrast.symbol_b}/
        </p>
      </div>

      <h2 className="font-serif text-t-h3 font-medium leading-tight">
        {perception ? (
          <>
            Escucha. <em>¿Cuál oíste?</em>
          </>
        ) : (
          <>
            Escucha y <em>repite</em>.
          </>
        )}
      </h2>

      <div className="mt-6">
        <Button variant="accent" onClick={() => say(answer)} disabled={!voiceReady}>
          <Volume2 className="mr-2 h-4 w-4" aria-hidden />
          {voiceReady ? "Escuchar otra vez" : "Cargando audio…"}
        </Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {q.options.map((word) => {
          const isAnswer = word === answer;
          const isPicked = picked === word;
          const reveal = picked !== null;
          return (
            <button
              key={word}
              type="button"
              onClick={() => choose(word)}
              disabled={reveal}
              className={cn(
                // 56px min height — thumb input, mid-range Android.
                "flex min-h-[56px] items-center justify-between rounded-md border px-5 py-4 text-left transition-colors",
                !reveal && "border-hair bg-white hover:border-ink",
                reveal && isAnswer && "border-success bg-success/5",
                reveal && isPicked && !isAnswer && "border-error bg-error/5",
                reveal && !isPicked && !isAnswer && "border-hair opacity-50",
              )}
            >
              <span className="font-serif text-t-body-lg font-medium text-espresso">
                {word}
              </span>
              {reveal && isAnswer && <Check className="h-5 w-5 text-success" aria-hidden />}
              {reveal && isPicked && !isAnswer && (
                <X className="h-5 w-5 text-error" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-6 border-t border-hair pt-5">
          <p className="font-sans text-t-body text-espresso-soft">
            <em>{q.pair.a}</em> = {q.pair.a_es} · <em>{q.pair.b}</em> = {q.pair.b_es}
          </p>
          <div className="mt-5">
            <Button variant="primary" onClick={next}>
              Seguir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
