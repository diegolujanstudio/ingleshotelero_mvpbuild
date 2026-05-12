"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { LevelBadge } from "@/components/ui/Badge";
import { ProgressHeader } from "@/components/exam/ProgressHeader";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { formatIndex } from "@/lib/utils";
import { getSpeaking } from "@/content/exam";
import {
  calculateCombinedScore,
  calculateSpeakingAverage,
  scoreToLevel,
  LEVEL_LABEL_ES,
  LEVEL_DESCRIPTION_ES,
} from "@/lib/cefr";
import { loadSession, updateSession, type ExamSessionState } from "@/lib/exam";
import type { CEFRLevel } from "@/lib/supabase/types";
import { drainQueue } from "@/lib/offline/sync";

export default function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const [session, setSession] = useState<ExamSessionState | null>(null);
  const [tick, setTick] = useState(0);

  // Drain the offline queue on mount — non-blocking. Anything queued
  // during a flaky-network exam (answers, recordings, finalize-listening)
  // gets one more chance to land before scoring kicks off. The
  // <SyncStatusChip /> in the footer surfaces any remaining items.
  useEffect(() => {
    void drainQueue({
      onProgress: (result) => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(
          new CustomEvent("ih:sync-progress", { detail: result }),
        );
      },
    });
  }, []);

  // Load session, and kick off scoring for any pending recordings.
  useEffect(() => {
    const s = loadSession(params.id);
    if (!s) return;
    setSession(s);

    const promptsLocal = getSpeaking(s.module);
    const pending = (s.speaking_recordings ?? []).filter(
      (r) => r.scoring_status === "pending",
    );

    pending.forEach((rec) => {
      const prompt = promptsLocal[rec.prompt_index];
      if (!prompt) return;

      // Mark as processing locally so we don't double-dispatch.
      updateSession(params.id, {
        speaking_recordings: (loadSession(params.id)?.speaking_recordings ?? []).map(
          (r) =>
            r.prompt_index === rec.prompt_index
              ? { ...r, scoring_status: "processing" as const }
              : r,
        ),
      });

      fetch("/api/score-speaking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          session_id: params.id,
          prompt_index: rec.prompt_index,
          scenario_es: prompt.scenario_es,
          expected_keywords: prompt.expected_keywords,
          model_response_en: prompt.model_response_en,
          level_tag: prompt.level,
          module: s.module,
          audio_data_url: rec.audio_data_url,
        }),
      })
        .then((r) => r.json())
        .then((result) => {
          const latest = loadSession(params.id);
          if (!latest) return;
          updateSession(params.id, {
            speaking_recordings: (latest.speaking_recordings ?? []).map((r) =>
              r.prompt_index === rec.prompt_index
                ? {
                    ...r,
                    scoring_status: "complete" as const,
                    transcript: result.transcript,
                    ai_score_total: result.total,
                    ai_feedback_es: result.feedback_es,
                    ai_model_response: result.model_response,
                  }
                : r,
            ),
          });
          setSession(loadSession(params.id));
        })
        .catch(() => {
          // Mark failed locally.
          const latest = loadSession(params.id);
          if (!latest) return;
          updateSession(params.id, {
            speaking_recordings: (latest.speaking_recordings ?? []).map((r) =>
              r.prompt_index === rec.prompt_index
                ? { ...r, scoring_status: "failed" as const }
                : r,
            ),
          });
          setSession(loadSession(params.id));
        });
    });

    // Also poll localStorage every 2s to reflect background updates.
    const poll = setInterval(() => {
      setTick((t) => t + 1);
      const s2 = loadSession(params.id);
      if (s2) setSession(s2);
    }, 2000);
    return () => clearInterval(poll);
  }, [params.id]);

  const prompts = session ? getSpeaking(session.module) : [];
  const recs = session?.speaking_recordings ?? [];
  const allScored =
    recs.length > 0 &&
    prompts.length > 0 &&
    recs.length === prompts.length &&
    recs.every((r) => r.scoring_status === "complete");

  const speakingTotals = recs
    .filter((r) => typeof r.ai_score_total === "number")
    .map((r) => r.ai_score_total as number);

  const speakingAvg = speakingTotals.length
    ? calculateSpeakingAverage(speakingTotals)
    : undefined;
  const listening = session?.listening_score ?? 0;

  let combined: number | undefined;
  let finalLevel: CEFRLevel | undefined;
  if (typeof speakingAvg === "number") {
    combined = calculateCombinedScore({
      listeningScore: listening,
      speakingScore: speakingAvg,
    });
    finalLevel = scoreToLevel(combined);
  }

  // Persist final level once scoring finishes — must be before early return.
  useEffect(() => {
    if (allScored && finalLevel && session && !session.final_level) {
      updateSession(params.id, {
        final_level: finalLevel,
        speaking_avg_score: speakingAvg,
        current_step: "complete",
      });
      fetch(`/api/exams/${params.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          current_step: "complete",
          status: "complete",
          completed: true,
          final_level: finalLevel,
          speaking_avg_score: speakingAvg,
          listening_score: listening,
        }),
      }).catch(() => {});
    }
  }, [allScored, finalLevel, speakingAvg, listening, params.id, session]);

  if (!session) return null;

  return (
    <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-24">
      <ProgressHeader
        section="04 · Resultados"
        title={
          allScored
            ? "Listo. Aquí está su diagnóstico."
            : "Procesando su evaluación…"
        }
        current={4}
        total={4}
        note={
          allScored
            ? "Su Recursos Humanos recibe este mismo reporte en PDF."
            : "La comprensión auditiva ya está lista. Estamos evaluando sus respuestas habladas. Esto toma unos 30 segundos."
        }
      />

      {/* Big level card */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <div className="rounded-md border border-hair bg-white p-8">
          <p className="caps mb-4">Su nivel</p>
          {finalLevel ? (
            <>
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-[clamp(4.5rem,14vw,7rem)] font-medium leading-none tracking-tight text-espresso">
                  {finalLevel}
                </span>
                <LevelBadge level={finalLevel} />
              </div>
              <p className="mt-4 font-serif text-t-h3 font-medium">
                {LEVEL_LABEL_ES[finalLevel]}
              </p>
              <p className="mt-2 font-sans text-t-body text-espresso-soft">
                {LEVEL_DESCRIPTION_ES[finalLevel]}
              </p>
            </>
          ) : (
            <div className="flex items-center gap-3 font-sans text-t-body-lg text-espresso-muted">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Calculando su nivel final…
            </div>
          )}
          <HairlineRule className="my-6" />
          <dl className="space-y-3 font-sans text-t-body">
            <div className="flex justify-between">
              <dt className="text-espresso-muted">Comprensión auditiva</dt>
              <dd className="font-medium text-espresso">{listening} / 100</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-espresso-muted">Expresión oral</dt>
              <dd className="font-medium text-espresso">
                {typeof speakingAvg === "number" ? `${speakingAvg} / 100` : "En proceso"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-hair pt-3">
              <dt className="text-espresso-muted">Puntaje combinado (60% habla + 40% escucha)</dt>
              <dd className="font-medium text-espresso">
                {typeof combined === "number" ? `${combined} / 100` : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Per-prompt breakdown */}
        <div>
          <p className="caps mb-4">Su respuesta en cada escenario</p>
          <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
            {prompts.map((p, i) => {
              const rec = recs.find((r) => r.prompt_index === i);
              const status = rec?.scoring_status ?? "pending";
              return (
                <li key={i} className="p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="caps">
                        Escenario {formatIndex(i + 1)} · {p.level}
                      </span>
                      <p className="mt-1 font-sans text-t-body text-espresso">
                        {p.scenario_es}
                      </p>
                    </div>
                    <StatusDot status={status} score={rec?.ai_score_total} />
                  </div>
                  {rec?.transcript && (
                    <p className="mt-3 rounded-sm bg-ivory-soft p-3 font-mono text-[0.75rem] text-espresso-soft">
                      Usted dijo: &ldquo;{rec.transcript}&rdquo;
                    </p>
                  )}
                  {rec?.ai_feedback_es && (
                    <p className="mt-3 font-sans text-t-body text-ink">
                      <em>Sugerencia:</em> {rec.ai_feedback_es}
                    </p>
                  )}
                  {rec?.ai_model_response && (
                    <p className="mt-2 font-sans text-t-body text-espresso-muted">
                      Respuesta modelo: &ldquo;{rec.ai_model_response}&rdquo;
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="caps mt-12">
        Su Recursos Humanos recibirá el reporte completo con sus grabaciones y
        recomendaciones.
      </p>
    </section>
  );
}

function StatusDot({
  status,
  score,
}: {
  status: "pending" | "processing" | "complete" | "failed";
  score?: number;
}) {
  if (status === "complete") {
    return (
      <span className="flex items-center gap-2 font-mono text-[0.75rem] text-success">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        {typeof score === "number" ? `${score}/100` : ""}
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="font-mono text-[0.75rem] text-error">No se pudo evaluar</span>
    );
  }
  return (
    <span className="flex items-center gap-2 font-mono text-[0.75rem] text-espresso-muted">
      <Clock className="h-4 w-4 animate-pulse" aria-hidden />
      Evaluando…
    </span>
  );
}
