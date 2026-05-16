"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AudioPlayer } from "./AudioPlayer";
import { PRACTICE_COPY } from "@/content/practice";
import type { Drill } from "@/content/practice-drills";

const STEP = PRACTICE_COPY.steps.listening;

export function StepListening({
  drill,
  audioUrl,
  onComplete,
}: {
  drill: Drill;
  audioUrl: string | null;
  onComplete: (input: { listening_correct: boolean }) => void;
}) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const correctIndex = drill.listening.options.findIndex((o) => o.correct);
  const isCorrectPick = picked === correctIndex;

  function next() {
    if (picked === null) return;
    onComplete({ listening_correct: isCorrectPick });
  }

  return (
    <div>
      <p className="caps mb-3">
        {STEP.number} · {STEP.label}
      </p>
      <h2 className="font-serif text-t-h3 font-medium text-espresso">{STEP.title}</h2>

      <div className="mt-8">
        <AudioPlayer
          url={audioUrl}
          fallbackText={drill.listening.audio_text}
          label={STEP.play}
          replayLabel={STEP.replay}
        />
      </div>

      <ul className="mt-8 space-y-3">
        {drill.listening.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === correctIndex;
          const showState = picked !== null;
          let stateClass = "border-hair bg-white hover:border-espresso/40";
          if (showState) {
            if (isCorrect) stateClass = "border-success bg-success/5";
            else if (isPicked) stateClass = "border-error bg-error/5";
            else stateClass = "border-hair bg-white opacity-60";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(i)}
                className={`flex w-full items-center gap-4 rounded-md border-2 p-5 text-left font-sans text-t-body-lg text-espresso transition-colors duration-200 ease-editorial ${stateClass}`}
              >
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hair font-sans text-t-label font-medium text-espresso-muted"
                  aria-hidden
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt.text_es}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null ? (
        <div className="mt-6 rounded-md border border-hair bg-ivory-soft p-4 font-sans text-t-body text-espresso-soft">
          {drill.listening.explanation_es}
        </div>
      ) : null}

      <div className="mt-8">
        <Button
          variant="accent"
          size="lg"
          onClick={next}
          disabled={picked === null}
          aria-label={STEP.continue}
          className="w-full sm:w-auto"
        >
          {STEP.continue}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
