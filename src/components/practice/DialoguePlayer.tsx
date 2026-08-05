"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Dialogue } from "@/content/dialogues";
import { MODES_COPY } from "@/content/practice-modes";
import { cn } from "@/lib/utils";

/**
 * Diálogos — shadowing player.
 *
 * One line at a time (one idea per screen — doctrine): guest lines are
 * LISTENED to, staff lines are SHADOWED — the learner says the line aloud
 * and self-confirms. Their voice is never recorded or judged here (Law 1:
 * production belongs to the Coach; this surface builds fluency privately,
 * which is the whole point of rehearsing before the real shift).
 *
 * Earlier lines stay visible as a transcript above the active one, so the
 * learner keeps the thread of the conversation without re-listening.
 */

const COPY = MODES_COPY.dialogos;

export function DialoguePlayer({ dialogue }: { dialogue: Dialogue }) {
  const [i, setI] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const total = dialogue.lines.length;
  const finished = i >= total;
  const line = dialogue.lines[Math.min(i, total - 1)];

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

  // Guest lines auto-play once; staff lines wait for the learner.
  useEffect(() => {
    if (finished || !voiceReady) return;
    if (dialogue.lines[i].speaker === "guest") {
      const t = setTimeout(() => say(dialogue.lines[i].en), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, voiceReady, finished]);

  function next() {
    setI((n) => n + 1);
  }

  function restart() {
    setI(0);
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

  const isStaff = line.speaker === "staff";

  return (
    <div className="rounded-md border border-hair bg-white p-5 md:p-6">
      {/* Scene + position */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-1.5"
          role="progressbar"
          aria-valuenow={i + 1}
          aria-valuemax={total}
          aria-label={`Línea ${i + 1} de ${total}`}
        >
          {dialogue.lines.map((l, d) => (
            <span
              key={d}
              className={cn(
                "h-1.5 rounded-full transition-all",
                d === i ? "w-5 bg-ink" : "w-1.5",
                d < i ? "bg-success" : d === i ? "bg-ink" : "bg-hair",
              )}
            />
          ))}
        </div>
      </div>

      {/* Transcript of what already happened — context without re-listening */}
      {i > 0 && (
        <ol className="mb-5 space-y-2 border-b border-hair pb-5">
          {dialogue.lines.slice(0, i).map((l, d) => (
            <li key={d} className="flex gap-3">
              <span className="caps w-16 shrink-0 pt-0.5 text-espresso-muted">
                {l.speaker === "guest" ? COPY.guestLabel : COPY.staffLabel}
              </span>
              <button
                type="button"
                onClick={() => say(l.en)}
                className="min-h-[44px] text-left font-sans text-t-body text-espresso-soft"
              >
                {l.en}
              </button>
            </li>
          ))}
        </ol>
      )}

      {/* The active line */}
      <p className="caps mb-2 text-espresso-muted">
        {isStaff ? COPY.staffLabel : COPY.guestLabel}
      </p>
      <p
        className={cn(
          "font-serif font-medium leading-snug",
          "text-[clamp(1.35rem,5vw,1.9rem)]",
          isStaff ? "text-ink" : "text-espresso",
        )}
      >
        {line.en}
      </p>
      <p className="mt-2 font-sans text-t-body text-espresso-muted">
        {line.es}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => say(line.en)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink px-5 font-sans text-t-body text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <Volume2 className="h-4 w-4" aria-hidden />
          {COPY.listen}
        </button>
        <Button variant="primary" onClick={next}>
          {isStaff ? COPY.saidIt : COPY.next}
        </Button>
      </div>
    </div>
  );
}
