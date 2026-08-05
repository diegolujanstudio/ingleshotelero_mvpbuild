"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildNumberSession, type NumberQuestion } from "@/lib/practice/numbers";
import { MODES_COPY } from "@/content/practice-modes";
import type { CEFRLevel } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * Números y horas — the infinite listening trainer.
 *
 * Same deliberate interaction grammar as MinimalPairTrainer (one system,
 * not four apps): dots for position, ≥72px option cards, binary feedback
 * on perception (objective, so it CAN be marked wrong — Law 1 only bans
 * scoring *production*), explicit "Seguir", auto-play once per item.
 *
 * The reveal teaches: after answering, the number is shown written out in
 * English ("two fifteen") so the learner binds sound → digits → words.
 */

const COPY = MODES_COPY.numeros;

export function NumberTrainer({ level }: { level: CEFRLevel }) {
  // Seed stable per day+round so refresh mid-round doesn't re-roll answers.
  const [round, setRound] = useState(0);
  const dayRef = useRef(Math.floor(Date.now() / 86_400_000));
  const [session, setSession] = useState<NumberQuestion[]>(() =>
    buildNumberSession(level, dayRef.current),
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<("correct" | "wrong")[]>([]);
  const [voiceReady, setVoiceReady] = useState(false);

  const q = session[Math.min(i, session.length - 1)];
  const finished = i >= session.length;

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () =>
      setVoiceReady(window.speechSynthesis.getVoices().length > 0);
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const say = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    const en = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("en"));
    if (en) u.voice = en;
    window.speechSynthesis.speak(u);
  }, []);

  useEffect(() => {
    if (finished || !voiceReady || picked) return;
    const t = setTimeout(() => say(q.audio_en), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, voiceReady, finished]);

  function choose(display: string) {
    if (picked) return;
    setPicked(display);
    const correct = q.options.find((o) => o.display === display)?.correct;
    setResults((r) => [...r, correct ? "correct" : "wrong"]);
  }

  function next() {
    setPicked(null);
    setI((n) => n + 1);
  }

  function restart() {
    const nextRound = round + 1;
    setRound(nextRound);
    setSession(buildNumberSession(level, dayRef.current + nextRound * 1000));
    setI(0);
    setPicked(null);
    setResults([]);
  }

  const dots = (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={Math.min(i + 1, session.length)}
      aria-valuemax={session.length}
      aria-label={`Paso ${Math.min(i + 1, session.length)} de ${session.length}`}
    >
      {session.map((_, d) => (
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

  if (finished) {
    return (
      <div className="rounded-md border border-hair bg-white p-6">
        <p className="caps mb-2 text-success">{COPY.doneTitle}</p>
        <p className="font-sans text-t-body text-espresso-soft">
          {COPY.doneNote}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" onClick={restart}>
            {COPY.again}
          </Button>
        </div>
      </div>
    );
  }

  const revealed = picked !== null;

  return (
    <div className="rounded-md border border-hair bg-white p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        {dots}
        <span className="caps text-espresso-muted">{q.prompt_es}</span>
      </div>

      <button
        type="button"
        onClick={() => say(q.audio_en)}
        className="mb-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink px-5 font-sans text-t-body text-ink transition-colors hover:bg-ink hover:text-white"
      >
        <Volume2 className="h-4 w-4" aria-hidden />
        {revealed ? COPY.replay : COPY.play}
      </button>

      <div className="grid gap-3">
        {q.options.map((o) => {
          const isPicked = picked === o.display;
          const showState = revealed && (o.correct || isPicked);
          return (
            <button
              key={o.display}
              type="button"
              onClick={() => choose(o.display)}
              disabled={revealed}
              className={cn(
                "flex min-h-[72px] items-center justify-center rounded-md border px-4 font-serif text-[1.75rem] font-medium transition-colors",
                !revealed && "border-hair hover:border-ink",
                showState && o.correct && "border-success bg-success/5 text-success",
                showState && !o.correct && "border-error bg-error/5 text-error",
                revealed && !showState && "border-hair text-espresso-muted",
              )}
            >
              {o.display}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-hair pt-4">
          <p className="font-sans text-t-body text-espresso-soft">
            Se dice: <em>{q.reveal_en}</em>
          </p>
          <Button variant="primary" onClick={next}>
            {COPY.next}
          </Button>
        </div>
      )}
    </div>
  );
}
