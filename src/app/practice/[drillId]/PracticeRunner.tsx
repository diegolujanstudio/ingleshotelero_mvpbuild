"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ProgressDots } from "@/components/practice/ProgressDots";
import { StreakChip } from "@/components/practice/StreakChip";
import { LevelChip } from "@/components/practice/LevelChip";
import { StepListening } from "@/components/practice/StepListening";
import { StepSpeaking } from "@/components/practice/StepSpeaking";
import { StepReinforce } from "@/components/practice/StepReinforce";
import { StepReview, type ReviewCard } from "@/components/practice/StepReview";
import { PRACTICE_COPY } from "@/content/practice";
import type { Drill } from "@/content/practice-drills";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import { recordPractice } from "@/lib/streak";

type Step = "listening" | "speaking" | "reinforce" | "review";

const STEP_ORDER: Step[] = ["listening", "speaking", "reinforce", "review"];

export interface RunnerData {
  drill: Drill;
  module: RoleModule;
  level: CEFRLevel;
  employee_id: string | null;
  due_vocab: ReviewCard[];
  streak_current: number;
  listening_audio_url: string | null;
  reinforce_audio_url: string | null;
}

export function PracticeRunner({ data }: { data: RunnerData }) {
  const router = useRouter();
  const startedAtRef = React.useRef<number>(Date.now());
  const [stepIndex, setStepIndex] = React.useState(0);
  const [listeningCorrect, setListeningCorrect] = React.useState<boolean | null>(null);
  const [speakingScore, setSpeakingScore] = React.useState<number | null>(null);
  const [vocabKnown, setVocabKnown] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const step = STEP_ORDER[stepIndex];

  // Listen for audio fallback events and (best-effort) report them.
  React.useEffect(() => {
    function onFallback(_e: Event) {
      // Sentry breadcrumb — server-side route receives nothing here;
      // we keep the event local so it is visible in DevTools and any
      // attached client-side observability layer.
    }
    window.addEventListener("practice:audio-fallback", onFallback);
    return () => window.removeEventListener("practice:audio-fallback", onFallback);
  }, []);

  function advance() {
    if (stepIndex < STEP_ORDER.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      void finish();
    }
  }

  async function finish() {
    if (submitting) return;
    setSubmitting(true);

    const duration = Math.round((Date.now() - startedAtRef.current) / 1000);

    let serverStreak: { current: number; longest: number; ticked?: boolean } | null = null;

    if (data.employee_id) {
      try {
        const res = await fetch("/api/practice/complete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            employee_id: data.employee_id,
            drill_id: data.drill.id,
            level: data.level,
            module: data.module,
            listening_correct: listeningCorrect,
            speaking_score: speakingScore,
            vocab_known: vocabKnown,
            duration_seconds: duration,
          }),
        });
        if (res.ok) {
          const json = (await res.json()) as {
            streak?: { current: number; longest: number; ticked?: boolean };
          };
          if (json.streak) serverStreak = json.streak;
        }
      } catch {
        // soft fail — local fallback below.
      }
    }

    // Local fallback / mirror.
    let localCurrent = data.streak_current;
    let localTicked = false;
    try {
      const local = recordPractice();
      localCurrent = local.streak.current;
      localTicked = local.ticked;
    } catch {
      // demo browsers without storage — ignore.
    }

    const params = new URLSearchParams({
      streak: String(serverStreak?.current ?? localCurrent),
      ticked: String(serverStreak?.ticked ?? localTicked),
      vocab: String(vocabKnown),
    });
    router.push(`/practice/done?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/practice"
          aria-label="Salir de la práctica"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          {PRACTICE_COPY.intro.backHome}
        </Link>
      </header>

      <section className="mx-auto max-w-prose px-6 py-10 md:px-12 md:py-16">
        <div className="mb-8 flex items-center justify-between border-b border-hair pb-4">
          <ProgressDots current={stepIndex} total={STEP_ORDER.length} />
          <div className="flex items-center gap-4">
            <LevelChip level={data.level} />
            <StreakChip current={data.streak_current} />
          </div>
        </div>

        {step === "listening" ? (
          <StepListening
            drill={data.drill}
            audioUrl={data.listening_audio_url}
            onComplete={({ listening_correct }) => {
              setListeningCorrect(listening_correct);
              advance();
            }}
          />
        ) : null}

        {step === "speaking" ? (
          <StepSpeaking
            drill={data.drill}
            module={data.module}
            onComplete={({ speaking_score }) => {
              setSpeakingScore(speaking_score);
              advance();
            }}
          />
        ) : null}

        {step === "reinforce" ? (
          <StepReinforce
            drill={data.drill}
            audioUrl={data.reinforce_audio_url}
            onComplete={() => advance()}
          />
        ) : null}

        {step === "review" ? (
          <StepReview
            cards={data.due_vocab}
            employee_id={data.employee_id}
            onComplete={({ vocab_known }) => {
              setVocabKnown(vocab_known);
              advance();
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
