"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressHeader } from "@/components/exam/ProgressHeader";
import { cn } from "@/lib/utils";
import { DIAGNOSTIC_QUESTIONS } from "@/content/exam";
import { loadSession, updateSession, DIAGNOSTIC_TOTAL } from "@/lib/exam";
import { postExamAnswer } from "@/lib/pwa/api-client";

/**
 * /exam/[id]/diagnostic — 13 questions, one per screen.
 *
 * Saves the active answer to:
 *   1. localStorage (immediate, sync) — drives back-button + resume.
 *   2. The server via `postExamAnswer` (best-effort, queues offline).
 *
 * The UI advances on `Continuar` regardless of whether the API call
 * persisted, queued, or failed. The offline queue replays everything on
 * reconnect; the server is idempotent on `(session_id, question_index)`.
 */
export default function DiagnosticPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const question = useMemo(() => DIAGNOSTIC_QUESTIONS[idx], [idx]);

  // Hydrate from localStorage.
  useEffect(() => {
    const session = loadSession(params.id);
    if (session) {
      setAnswers(session.diagnostic_answers ?? {});
    }
    setSessionReady(true);
  }, [params.id]);

  if (!sessionReady) return null;
  if (!question) return null;

  const selected = answers[question.id];

  const selectOption = (value: string) => {
    setAnswers((prev) => {
      if (question.type === "multi") {
        const arr = Array.isArray(prev[question.id])
          ? (prev[question.id] as string[])
          : [];
        const next = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
        const updated = { ...prev, [question.id]: next };
        persist(idx, updated);
        return updated;
      }
      const updated = { ...prev, [question.id]: value };
      persist(idx, updated);
      return updated;
    });
  };

  const persist = (qIdx: number, all: Record<string, string | string[]>) => {
    updateSession(params.id, {
      diagnostic_answers: all,
      current_step: "diagnostic",
    });
    // Server upsert via the offline-aware client. Don't block the UI on
    // the response — it auto-queues on network failure.
    void postExamAnswer(params.id, {
      kind: "diagnostic",
      question_index: qIdx,
      answer_value: all[DIAGNOSTIC_QUESTIONS[qIdx].id] ?? null,
    });
  };

  const hasAnswer = Array.isArray(selected)
    ? selected.length > 0
    : Boolean(selected);

  const goNext = () => {
    if (idx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setIdx(idx + 1);
    } else {
      updateSession(params.id, { current_step: "listening" });
      // Best-effort PATCH for the step transition. Not queued — it's
      // purely a UX hint for resume; the listening page reads from
      // localStorage primarily.
      void fetch(`/api/exams/${params.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ current_step: "listening" }),
      }).catch(() => {});
      router.push(`/exam/${params.id}/listening`);
    }
  };

  const goBack = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  return (
    <section className="mx-auto max-w-prose px-6 py-16 md:px-12 md:py-24">
      <ProgressHeader
        section={`01 · Cuestionario breve`}
        title={question.prompt_es}
        current={idx + 1}
        total={DIAGNOSTIC_TOTAL}
        note={question.hint_es}
      />

      <ul className="space-y-3">
        {(question.options ?? []).map((opt) => {
          const isSelected = Array.isArray(selected)
            ? selected.includes(opt.value)
            : selected === opt.value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => selectOption(opt.value)}
                className={cn(
                  "w-full rounded-md border px-5 py-4 text-left font-sans text-t-body-lg transition-colors duration-200 ease-editorial",
                  isSelected
                    ? "border-ink bg-ink-tint text-espresso"
                    : "border-hair bg-white text-espresso hover:border-espresso/30",
                )}
              >
                {opt.label_es}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={idx === 0}
          className="caps text-espresso-muted hover:text-espresso disabled:opacity-40"
        >
          ← Anterior
        </button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!hasAnswer}
          onClick={goNext}
        >
          {idx === DIAGNOSTIC_QUESTIONS.length - 1
            ? "Continuar a escucha"
            : "Continuar"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </section>
  );
}
