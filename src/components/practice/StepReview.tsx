"use client";

import * as React from "react";
import { Check, Eye } from "lucide-react";
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
        <p className="mt-2 font-sans text-t-body-lg text-espresso-soft">
          {card.example_en}
        </p>

        {revealed ? (
          <div className="mt-6 border-t border-hair pt-6">
            <p className="font-serif text-[1.4rem] font-medium text-espresso">
              <em>{card.word_es}</em>
            </p>
            <p className="mt-1.5 font-sans text-t-body-lg text-espresso-muted">
              {card.example_es}
            </p>
          </div>
        ) : null}
      </div>

      {/* Big, unmistakable reveal action — full-width, eye icon, clear
          label. Replaces the old faint mono caption that 50+yo users
          could not see was a button. */}
      {!revealed ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex w-full items-center justify-center gap-2.5 rounded-md border-2 border-ink bg-white px-6 py-4 font-sans text-t-body-lg font-medium text-ink transition-colors duration-200 ease-editorial hover:bg-ink-tint"
          >
            <Eye className="h-5 w-5" aria-hidden />
            {STEP.reveal}
          </button>
          <p className="mt-3 text-center font-sans text-t-body text-espresso-muted">
            {STEP.revealHint}
          </p>
        </div>
      ) : null}

      {revealed ? (
        <div className="mt-8">
          <p className="font-sans text-t-body-lg font-medium text-espresso">
            {STEP.gradeQuestion}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                className={`flex min-h-[56px] items-center rounded-md border-2 px-5 py-4 text-left font-sans text-t-body-lg font-medium transition-colors duration-200 ease-editorial ${gradeClass(g.tone)}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function gradeClass(tone: "error" | "warn" | "neutral" | "success") {
  // Resting borders carry a faint tone hint so the four choices read
  // as a clear scale at a glance (not four identical grey boxes);
  // hover/active fills the tone. Semantic colors used as states, per
  // the design system — never as decoration.
  switch (tone) {
    case "error":
      return "border-error/30 bg-white text-espresso hover:border-error hover:bg-error/10";
    case "warn":
      return "border-warn/30 bg-white text-espresso hover:border-warn hover:bg-warn/10";
    case "neutral":
      return "border-ink-soft bg-white text-espresso hover:border-ink hover:bg-ink-tint";
    case "success":
      return "border-success/40 bg-white text-espresso hover:border-success hover:bg-success/10";
  }
}
