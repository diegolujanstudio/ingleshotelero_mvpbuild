"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRACTICE_COPY } from "@/content/practice";
import { uxGradeToSm2, type Grade } from "@/lib/practice/sm2";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

const STEP = PRACTICE_COPY.steps.review;

export interface ReviewCard {
  word_en: string;
  word_es: string;
  example_en: string;
  example_es: string;
  level: CEFRLevel;
  module: RoleModule;
}

/**
 * Flashcard step. The user sees the English word + example. They tap
 * "Mostrar traducción", then grade themselves on a coarse 4-button
 * scale that maps to SM-2 grades 0/3/4/5.
 *
 * If `cards` is empty (no due reviews), we render an empty state and
 * advance immediately. Empty state is correct behavior, not a bug —
 * spaced repetition genuinely has nothing for this user today.
 */
export function StepReview({
  cards,
  employee_id,
  onComplete,
}: {
  cards: ReviewCard[];
  employee_id: string | null;
  onComplete: (input: { vocab_known: number }) => void;
}) {
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [knownCount, setKnownCount] = React.useState(0);
  const total = cards.length;

  if (total === 0) {
    return (
      <div>
        <p className="caps mb-3">
          {STEP.number} · {STEP.label}
        </p>
        <h2 className="font-serif text-t-h3 font-medium text-espresso">
          {STEP.titleEmpty}
        </h2>
        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {STEP.noteEmpty}
        </p>
        <div className="mt-10 flex justify-end">
          <Button variant="primary" onClick={() => onComplete({ vocab_known: 0 })}>
            {STEP.continue}
            <Check className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    );
  }

  const card = cards[index];
  const last = index === total - 1;

  async function grade(uxLabel: "no" | "hard" | "good" | "easy") {
    const sm2: Grade = uxGradeToSm2(uxLabel);
    const known = sm2 >= 3;
    if (known) setKnownCount((k) => k + 1);

    // Fire-and-forget the persist; UI advances immediately.
    if (employee_id) {
      try {
        await fetch("/api/practice/vocab/review", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            employee_id,
            word: card.word_en,
            module: card.module,
            level: card.level,
            grade: sm2,
          }),
        });
      } catch {
        // Soft fail — local state is still correct.
      }
    }

    if (last) {
      onComplete({ vocab_known: knownCount + (known ? 1 : 0) });
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  }

  return (
    <div>
      <p className="caps mb-3">
        {STEP.number} · {STEP.label}{" "}
        <span className="text-espresso-muted">
          · {STEP.nextOf(index + 1, total)}
        </span>
      </p>
      <h2 className="font-serif text-t-h3 font-medium text-espresso">{STEP.title}</h2>

      <div
        className={`mt-8 rounded-md border p-6 transition-colors ${
          revealed ? "border-ink bg-ink-tint" : "border-hair bg-white"
        }`}
      >
        <p className="font-serif text-[1.6rem] font-medium leading-tight text-espresso">
          {card.word_en}
        </p>
        <p className="mt-2 font-sans text-t-body text-espresso-soft">
          {card.example_en}
        </p>

        {revealed ? (
          <div className="mt-5 border-t border-hair pt-5">
            <p className="font-serif text-[1.2rem] font-medium text-espresso">
              <em>{card.word_es}</em>
            </p>
            <p className="mt-1 font-sans text-t-body text-espresso-muted">
              {card.example_es}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="caps mt-5 inline-flex items-center text-ink hover:text-ink-deep"
          >
            {STEP.reveal}
          </button>
        )}
      </div>

      {revealed ? (
        <div className="mt-8">
          <p className="caps mb-3">{STEP.gradeQuestion}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {STEP.grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() =>
                  grade(
                    g.value === 0
                      ? "no"
                      : g.value === 3
                      ? "hard"
                      : g.value === 4
                      ? "good"
                      : "easy",
                  )
                }
                className={`rounded-md border px-4 py-3 text-left font-sans text-t-body transition-colors duration-200 ease-editorial ${gradeClass(g.tone)}`}
              >
                <span className="caps mb-1 block text-espresso-muted">
                  {g.value}
                </span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!revealed ? (
        <div className="mt-8 flex justify-end">
          <span className="caps text-espresso-muted">
            <ArrowRight className="mr-1 inline h-3 w-3" aria-hidden />
            Toque &ldquo;{STEP.reveal}&rdquo; para continuar
          </span>
        </div>
      ) : null}
    </div>
  );
}

function gradeClass(tone: "error" | "warn" | "neutral" | "success") {
  switch (tone) {
    case "error":
      return "border-hair bg-white hover:border-error hover:bg-error/5";
    case "warn":
      return "border-hair bg-white hover:border-warn hover:bg-warn/5";
    case "neutral":
      return "border-hair bg-white hover:border-espresso/40";
    case "success":
      return "border-hair bg-white hover:border-success hover:bg-success/5";
  }
}
