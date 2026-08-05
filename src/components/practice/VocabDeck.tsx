"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { vocabSession, type VocabCard } from "@/lib/practice/vocab-deck";
import { MODES_COPY } from "@/content/practice-modes";
import type { Role } from "@/content/practice-drills";
import type { CEFRLevel } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * Vocabulario — standalone flashcard mode.
 *
 * Recall before recognition (Law 4): the English word + audio show first,
 * the Spanish stays hidden until the learner taps. Self-grading is
 *3-way and NEVER red — remembering is production, and production belongs
 * to the Coach (Law 1). "No la sabía" is a neutral fact, not a failure.
 *
 * Missed cards re-queue at the end of the same session (the immediate
 * second exposure is where the memory actually forms), max one requeue
 * per card so a hard session still ends.
 */

const COPY = MODES_COPY.vocabulario;

export function VocabDeck({ role, level }: { role: Role; level: CEFRLevel }) {
  const dayRef = useRef(Math.floor(Date.now() / 86_400_000));
  const [round, setRound] = useState(0);
  const [queue, setQueue] = useState<VocabCard[]>(() =>
    vocabSession(role, level, dayRef.current),
  );
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(0);
  const requeuedRef = useRef(new Set<string>());
  const [voiceReady, setVoiceReady] = useState(false);

  const total = queue.length;
  const card = queue[Math.min(i, total - 1)];
  const finished = total === 0 || i >= total;

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
    u.rate = 0.92;
    const en = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("en"));
    if (en) u.voice = en;
    window.speechSynthesis.speak(u);
  }, []);

  useEffect(() => {
    if (finished || !voiceReady || revealed) return;
    const t = setTimeout(() => say(card.word_en), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, voiceReady, finished]);

  function grade(missed: boolean) {
    if (missed && !requeuedRef.current.has(card.word_en)) {
      requeuedRef.current.add(card.word_en);
      setQueue((q) => [...q, card]);
    }
    setGraded((g) => g + 1);
    setRevealed(false);
    setI((n) => n + 1);
  }

  function restart() {
    const nextRound = round + 1;
    setRound(nextRound);
    requeuedRef.current = new Set();
    setQueue(vocabSession(role, level, dayRef.current + nextRound));
    setI(0);
    setRevealed(false);
    setGraded(0);
  }

  if (total === 0) {
    return (
      <div className="rounded-md border border-hair bg-white p-6">
        <p className="font-sans text-t-body text-espresso-soft">{COPY.empty}</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="rounded-md border border-hair bg-white p-6">
        <p className="caps mb-2 text-success">{COPY.doneTitle}</p>
        <p className="font-sans text-t-body text-espresso-soft">
          {COPY.doneNote}
        </p>
        <div className="mt-6">
          <Button variant="primary" onClick={restart}>
            {COPY.again}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-hair bg-white p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div
          className="flex items-center gap-1.5"
          role="progressbar"
          aria-valuenow={Math.min(i + 1, total)}
          aria-valuemax={total}
          aria-label={`Tarjeta ${Math.min(i + 1, total)} de ${total}`}
        >
          {queue.map((_, d) => (
            <span
              key={d}
              className={cn(
                "h-1.5 rounded-full transition-all",
                d === i ? "w-5 bg-ink" : "w-1.5",
                d < graded ? "bg-success" : d === i ? "bg-ink" : "bg-hair",
              )}
            />
          ))}
        </div>
        <span className="caps text-espresso-muted">{card.level}</span>
      </div>

      {/* The word — audio-first, meaning hidden until tapped. */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-medium leading-tight">
          {card.word_en}
        </p>
        <button
          type="button"
          onClick={() => say(card.word_en)}
          aria-label={COPY.listen}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <Volume2 className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-5 flex min-h-[72px] w-full items-center justify-center rounded-md border border-dashed border-hair font-sans text-t-body text-espresso-muted transition-colors hover:border-ink hover:text-ink"
        >
          {COPY.reveal}
        </button>
      ) : (
        <div className="mt-5 rounded-md bg-ivory-soft p-4">
          <p className="font-serif text-t-h3 font-medium text-espresso">
            {card.word_es}
          </p>
          <button
            type="button"
            onClick={() => say(card.example_en)}
            className="mt-3 flex min-h-[44px] items-center gap-2 text-left font-sans text-t-body text-espresso-soft"
          >
            <Volume2 className="h-4 w-4 shrink-0 text-ink" aria-hidden />
            <span>
              <em>{card.example_en}</em>
              <span className="block text-t-caption text-espresso-muted">
                {card.example_es}
              </span>
            </span>
          </button>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-hair pt-4">
            <Button variant="primary" size="md" onClick={() => grade(false)}>
              {COPY.knewIt}
            </Button>
            <Button variant="ghost" size="md" onClick={() => grade(false)}>
              {COPY.almost}
            </Button>
            <Button variant="ghost" size="md" onClick={() => grade(true)}>
              {COPY.missedIt}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
