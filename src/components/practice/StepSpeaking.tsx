"use client";

import * as React from "react";
import { ArrowRight, Mic, RefreshCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRACTICE_COPY } from "@/content/practice";
import type { Drill } from "@/content/practice-drills";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

const STEP = PRACTICE_COPY.steps.speaking;

type RecorderState = "idle" | "requesting" | "recording" | "recorded" | "scoring" | "done";

interface SpeakingResult {
  score: number;
  feedback_es: string;
  level_estimate?: string;
  model_response?: string;
}

/**
 * Practice speaking step. Single 45-sec MediaRecorder capture →
 * /api/score-speaking with the demo body. The route's persisted
 * branch ignores demo bodies, so we always run via the demo path
 * here; if Supabase + AI keys are present, the real Whisper+Claude
 * pipeline runs server-side and we get a real score back. Otherwise
 * we get the deterministic mock.
 *
 * Recording type: when wired to /api/recordings (a future enhancement
 * post-MVP), we'd pass `recording_type='practice'` so the row lands
 * with the right tag. For now we keep this lightweight and demo-mode
 * compatible — no upload, just inline scoring.
 */
export function StepSpeaking({
  drill,
  module,
  onComplete,
}: {
  drill: Drill;
  module: RoleModule;
  onComplete: (input: { speaking_score: number | null; skipped: boolean }) => void;
}) {
  const [state, setState] = React.useState<RecorderState>("idle");
  const [elapsed, setElapsed] = React.useState(0);
  const [retries, setRetries] = React.useState(0);
  const [result, setResult] = React.useState<SpeakingResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = React.useRef<Blob | null>(null);

  React.useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Use the listening drill's audio_text as a synthetic "scenario" because
  // V0 drills don't carry a Spanish speaking scenario; the reinforce note
  // is the closest narrative substitute.
  const scenario_es = drill.reinforce.note_es;
  const expected_keywords = pickKeywords(drill.reinforce.model_en);
  const level: CEFRLevel = drill.level;

  async function start() {
    setError(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      });
      mr.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
        blobRef.current = blob;
        setState("recorded");
        streamRef.current?.getTracks().forEach((t) => t.stop());
      });
      mr.start();
      setState("recording");
      setElapsed(0);
      tickRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= 45) {
            stop();
            return 45;
          }
          return e + 1;
        });
      }, 1000);
    } catch {
      setState("idle");
      setError(STEP.micDenied);
    }
  }

  function stop() {
    mediaRef.current?.stop();
    if (tickRef.current) clearInterval(tickRef.current);
  }

  function reRecord() {
    blobRef.current = null;
    setElapsed(0);
    setState("idle");
    setRetries((r) => r + 1);
  }

  async function evaluate() {
    if (!blobRef.current) return;
    setState("scoring");
    setError(null);
    let dataUrl: string | null = null;
    try {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = reject;
        fr.readAsDataURL(blobRef.current!);
      });
    } catch {
      dataUrl = null;
    }

    try {
      const res = await fetch("/api/score-speaking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenario_es,
          expected_keywords,
          model_response_en: drill.reinforce.model_en,
          level_tag: level,
          module,
          audio_data_url: dataUrl,
        }),
      });
      if (!res.ok) throw new Error(`status_${res.status}`);
      const json = (await res.json()) as Record<string, unknown>;
      const total =
        typeof json.total === "number"
          ? json.total
          : typeof (json.scored as { total?: number } | undefined)?.total === "number"
          ? (json.scored as { total: number }).total
          : null;
      if (total === null) throw new Error("no_score");
      setResult({
        score: total,
        feedback_es:
          typeof json.feedback_es === "string"
            ? json.feedback_es
            : "Buena respuesta. Continúe practicando.",
        level_estimate:
          typeof json.level_estimate === "string" ? json.level_estimate : undefined,
        model_response:
          typeof json.model_response === "string"
            ? json.model_response
            : drill.reinforce.model_en,
      });
      setState("done");
    } catch {
      // Fail soft — still let the user advance with no score.
      setResult({
        score: 0,
        feedback_es:
          "No pudimos evaluar su respuesta esta vez. Su práctica de hoy sigue contando.",
        model_response: drill.reinforce.model_en,
      });
      setState("done");
    }
  }

  function complete() {
    onComplete({ speaking_score: result?.score ?? null, skipped: false });
  }

  return (
    <div>
      <p className="caps mb-3">
        {STEP.number} · {STEP.label}
      </p>
      <h2 className="font-serif text-t-h3 font-medium text-espresso">{STEP.title}</h2>

      <div className="mt-6 rounded-md border border-hair bg-ivory-soft p-5 font-sans text-t-body text-espresso">
        {scenario_es}
      </div>

      <div className="mt-6 rounded-md border border-hair bg-white p-6">
        {state === "idle" ? (
          <Button variant="accent" size="lg" onClick={start}>
            <Mic className="h-4 w-4" aria-hidden />
            {STEP.record}
          </Button>
        ) : null}

        {state === "requesting" ? (
          <p className="font-sans text-t-body text-espresso-muted">{STEP.micRequest}</p>
        ) : null}

        {state === "recording" ? (
          <div className="flex items-center gap-6">
            <Button variant="primary" size="lg" onClick={stop}>
              <Square className="h-4 w-4" aria-hidden />
              {STEP.stop}
            </Button>
            <span className="flex items-center gap-3 font-mono text-t-body text-ink">
              <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
              {formatDuration(elapsed)} / 00:45
            </span>
          </div>
        ) : null}

        {state === "recorded" ? (
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" onClick={evaluate}>
              {STEP.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            {retries < 1 ? (
              <button
                type="button"
                onClick={reRecord}
                className="caps inline-flex items-center gap-2 text-espresso-muted hover:text-espresso"
              >
                <RefreshCcw className="h-3 w-3" aria-hidden />
                {STEP.reRecord}
              </button>
            ) : null}
          </div>
        ) : null}

        {state === "scoring" ? (
          <p className="font-sans text-t-body text-espresso-muted">{STEP.evaluating}</p>
        ) : null}

        {state === "done" && result ? (
          <div>
            <p className="caps mb-2">{STEP.yourScore}</p>
            <p className="font-serif text-[2.5rem] font-medium leading-none text-espresso">
              <em>{result.score}</em>
              <span className="ml-1 font-sans text-t-body text-espresso-muted">/ 100</span>
            </p>
            <p className="caps mt-6 mb-1">{STEP.feedback}</p>
            <p className="font-sans text-t-body text-espresso-soft">{result.feedback_es}</p>
            {result.model_response ? (
              <>
                <p className="caps mt-6 mb-1">{STEP.modelResponse}</p>
                <p className="font-serif text-[1.15rem] font-medium text-espresso">
                  &ldquo;{result.model_response}&rdquo;
                </p>
              </>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 font-sans text-t-caption text-error">{error}</p>
        ) : null}

        <p className="caps mt-6 text-espresso-muted">{STEP.maxDuration}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          className="caps text-espresso-muted hover:text-espresso"
          onClick={() => onComplete({ speaking_score: null, skipped: true })}
        >
          {STEP.skip}
        </button>
        {state === "done" ? (
          <Button variant="accent" onClick={complete}>
            {STEP.continue}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

/**
 * Cheap keyword pick — content words >= 4 chars, dedup, max 6.
 * The scoring rubric uses these as anchors.
 */
function pickKeywords(text: string): string[] {
  const STOP = new Set([
    "your", "this", "that", "with", "from", "have", "will", "would", "could",
    "should", "they", "them", "than", "then", "into", "what", "when", "were",
    "been", "being", "while", "where", "which", "there", "their", "about",
    "right", "just", "some", "more", "much", "very", "also", "like",
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP.has(w));
  const out: string[] = [];
  for (const w of words) {
    if (!out.includes(w)) out.push(w);
    if (out.length >= 6) break;
  }
  return out;
}
