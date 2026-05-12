"use client";

import * as React from "react";
import { ArrowRight, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AudioPlayer } from "./AudioPlayer";
import { PRACTICE_COPY } from "@/content/practice";
import type { Drill } from "@/content/practice-drills";

const STEP = PRACTICE_COPY.steps.reinforce;

/**
 * Reinforce step: hear the gold-standard response in English, see the
 * Spanish note about why this phrasing works, optionally re-record
 * yourself imitating it. The re-record is purely practice — we do
 * not score it. The drill counts as complete either way.
 */
export function StepReinforce({
  drill,
  audioUrl,
  onComplete,
}: {
  drill: Drill;
  audioUrl: string | null;
  onComplete: () => void;
}) {
  const [recording, setRecording] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      mr.addEventListener("stop", () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setSubmitted(true);
      });
      mr.start();
      setRecording(true);
      // Auto-stop after 12 seconds — short echo, not a full take.
      setTimeout(() => {
        if (mediaRef.current?.state === "recording") mediaRef.current.stop();
      }, 12_000);
    } catch {
      // Soft fail — re-record is optional.
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
  }

  return (
    <div>
      <p className="caps mb-3">
        {STEP.number} · {STEP.label}
      </p>
      <h2 className="font-serif text-t-h3 font-medium text-espresso">{STEP.title}</h2>

      <blockquote className="mt-6 rounded-md border border-hair bg-white p-6">
        <p className="font-serif text-[1.35rem] font-medium leading-[1.4] text-espresso">
          &ldquo;{drill.reinforce.model_en}&rdquo;
        </p>
        <div className="mt-4">
          <AudioPlayer
            url={audioUrl}
            fallbackText={drill.reinforce.model_en}
            label={STEP.listen}
            replayLabel={STEP.listen}
          />
        </div>
      </blockquote>

      <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
        {drill.reinforce.note_es}
      </p>

      <div className="mt-8 rounded-md border border-hair bg-ivory-soft p-5">
        {!recording && !submitted ? (
          <button
            type="button"
            onClick={startRecording}
            className="caps inline-flex items-center gap-2 text-ink hover:text-ink-deep"
          >
            <Mic className="h-3 w-3" aria-hidden />
            {STEP.practiceAgain}
          </button>
        ) : null}

        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="caps inline-flex items-center gap-2 text-error"
          >
            <Square className="h-3 w-3" aria-hidden />
            {STEP.stopRecording}
          </button>
        ) : null}

        {submitted ? (
          <p className="font-sans text-t-body text-success">{STEP.attemptSent}</p>
        ) : null}
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="accent" onClick={onComplete}>
          {STEP.continue}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
