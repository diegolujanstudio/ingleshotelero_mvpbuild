"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressHeader } from "@/components/exam/ProgressHeader";
import { cn } from "@/lib/utils";
import { getListening } from "@/content/exam";
import {
  calculateListeningScore,
  type ListeningItemResult,
} from "@/lib/cefr";
import {
  loadSession,
  updateSession,
  LISTENING_TOTAL,
  type ExamSessionState,
} from "@/lib/exam";

const MAX_REPLAYS = 2;

export default function ListeningPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [session, setSession] = useState<ExamSessionState | null>(null);
  const [idx, setIdx] = useState(0);
  const [replayCount, setReplayCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const questionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const s = loadSession(params.id);
    if (!s) {
      router.push("/");
      return;
    }
    setSession(s);
    // Resume from existing answers.
    const answered = s.listening_answers?.length ?? 0;
    setIdx(Math.min(answered, LISTENING_TOTAL - 1));
  }, [params.id, router]);

  const items = useMemo(
    () => (session ? getListening(session.module) : []),
    [session],
  );
  const current = items[idx];

  // Play on arrival at each new question (after a brief hold so users see it).
  useEffect(() => {
    if (!current) return;
    setSelected(null);
    setReplayCount(0);
    questionStartRef.current = Date.now();
    const t = setTimeout(() => play(current.audio_en), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, current?.audio_en]);

  const play = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = current?.level === "A1" ? 0.85 : current?.level === "A2" ? 0.9 : 1.0;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  if (!session || !current) return null;

  const submit = (optIdx: number) => {
    const isCorrect = current.options[optIdx].is_correct;
    const ms = Date.now() - questionStartRef.current;

    const newAnswer = {
      question_index: idx,
      selected_option: optIdx,
      is_correct: isCorrect,
      level_tag: current.level,
      replay_count: replayCount,
    };
    const existing = session.listening_answers ?? [];
    const filtered = existing.filter((a) => a.question_index !== idx);
    const next = [...filtered, newAnswer].sort(
      (a, b) => a.question_index - b.question_index,
    );
    const updated = updateSession(params.id, { listening_answers: next });
    if (updated) setSession(updated);

    fetch(`/api/exams/${params.id}/answer`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "listening",
        question_index: idx,
        selected_option: optIdx,
        is_correct: isCorrect,
        level_tag: current.level,
        response_time_ms: ms,
        replay_count: replayCount,
      }),
    }).catch(() => {});

    setSelected(optIdx);

    setTimeout(() => {
      if (idx < LISTENING_TOTAL - 1) {
        setIdx(idx + 1);
      } else {
        // Compute listening score + advance.
        const results: ListeningItemResult[] = next.map((a) => ({
          level: a.level_tag,
          correct: a.is_correct,
        }));
        const score = calculateListeningScore(results);
        updateSession(params.id, {
          listening_score: score,
          current_step: "speaking",
        });
        fetch(`/api/exams/${params.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            current_step: "speaking",
            listening_score: score,
            status: "listening_done",
          }),
        }).catch(() => {});
        router.push(`/exam/${params.id}/speaking`);
      }
    }, 650);
  };

  const canReplay = replayCount < MAX_REPLAYS;

  return (
    <section className="mx-auto max-w-prose px-6 py-16 md:px-12 md:py-24">
      <ProgressHeader
        section="02 · Comprensión auditiva"
        title="Escuche y elija la acción correcta."
        current={idx + 1}
        total={LISTENING_TOTAL}
        note={`Puede repetir el audio hasta ${MAX_REPLAYS} veces.`}
      />

      <div className="rounded-md border border-hair bg-white p-6 md:p-8">
        <button
          type="button"
          onClick={() => {
            if (!canReplay && replayCount > 0) return;
            if (replayCount > 0) setReplayCount((c) => c + 1);
            else setReplayCount(1);
            play(current.audio_en);
          }}
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-label="Reproducir audio"
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-pill border border-ink bg-ink-tint text-ink",
                speaking && "animate-pulse",
              )}
            >
              <Volume2 className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-serif text-t-h3 text-espresso">
              {speaking ? "Reproduciendo…" : replayCount === 0 ? "Tocar para reproducir" : "Repetir audio"}
            </span>
          </div>
          <span className="caps">
            {replayCount}/{MAX_REPLAYS + 1}
          </span>
        </button>
      </div>

      <p className="caps mt-8 mb-4">Elija la respuesta</p>
      <ul className="space-y-3">
        {current.options.map((opt, i) => {
          const isSel = selected === i;
          const revealCorrect = selected !== null && opt.is_correct;
          const revealWrong = isSel && !opt.is_correct;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={selected !== null}
                onClick={() => submit(i)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-md border px-5 py-4 text-left font-sans text-t-body-lg transition-colors duration-200 ease-editorial disabled:cursor-not-allowed",
                  selected === null &&
                    "border-hair bg-white text-espresso hover:border-espresso/30",
                  revealCorrect && "border-success bg-success/5 text-espresso",
                  revealWrong && "border-error bg-error/5 text-espresso",
                  selected !== null && !isSel && !opt.is_correct && "opacity-60",
                )}
              >
                <span
                  className="text-2xl"
                  aria-hidden
                >
                  {opt.emoji}
                </span>
                <span>{opt.label_es}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
