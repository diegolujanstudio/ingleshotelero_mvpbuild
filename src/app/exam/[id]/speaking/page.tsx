"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, ArrowRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressHeader } from "@/components/exam/ProgressHeader";
import { cn } from "@/lib/utils";
import { getSpeaking } from "@/content/exam";
import {
  loadSession,
  updateSession,
  SPEAKING_TOTAL,
  type ExamSessionState,
} from "@/lib/exam";

type RecorderState = "idle" | "requesting" | "recording" | "recorded" | "uploading";

export default function SpeakingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [session, setSession] = useState<ExamSessionState | null>(null);
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [retries, setRetries] = useState<Record<number, number>>({});

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    const s = loadSession(params.id);
    if (!s) {
      router.push("/");
      return;
    }
    setSession(s);
    const answered = s.speaking_recordings?.length ?? 0;
    setIdx(Math.min(answered, SPEAKING_TOTAL - 1));
  }, [params.id, router]);

  const prompts = useMemo(
    () => (session ? getSpeaking(session.module) : []),
    [session],
  );
  const current = prompts[idx];

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  if (!session || !current) return null;

  const startRecording = async () => {
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      });
      mr.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
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
            stopRecording();
            return 45;
          }
          return e + 1;
        });
      }, 1000);
    } catch (err) {
      setState("idle");
      alert(
        "No se pudo acceder al micrófono. Revise los permisos en su navegador y vuelva a intentar.",
      );
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    if (tickRef.current) clearInterval(tickRef.current);
  };

  const redo = () => {
    blobRef.current = null;
    setElapsed(0);
    setState("idle");
    setRetries((r) => ({ ...r, [idx]: (r[idx] ?? 0) + 1 }));
  };

  const submit = async () => {
    if (!blobRef.current) return;
    setState("uploading");

    // Base64 fallback for localStorage persistence.
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

    // Upload with retry.
    const form = new FormData();
    form.append("session_id", params.id);
    form.append("prompt_index", String(idx));
    form.append("level_tag", current.level);
    form.append("duration_seconds", String(elapsed));
    form.append("audio", blobRef.current, `prompt-${idx}.webm`);

    let uploaded = false;
    for (let attempt = 0; attempt < 3 && !uploaded; attempt++) {
      try {
        const res = await fetch("/api/recordings", { method: "POST", body: form });
        if (res.ok) {
          uploaded = true;
          break;
        }
      } catch {
        // retry
      }
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }

    // Persist locally regardless.
    const rec = {
      prompt_index: idx,
      audio_data_url: dataUrl,
      audio_duration_seconds: elapsed,
      level_tag: current.level,
      scoring_status: "pending" as const,
    };
    const existing = session.speaking_recordings ?? [];
    const filtered = existing.filter((r) => r.prompt_index !== idx);
    const next = [...filtered, rec].sort((a, b) => a.prompt_index - b.prompt_index);
    const updated = updateSession(params.id, { speaking_recordings: next });
    if (updated) setSession(updated);

    // Kick off scoring (fire-and-forget — the results page polls).
    fetch("/api/score-speaking", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        session_id: params.id,
        prompt_index: idx,
        scenario_es: current.scenario_es,
        expected_keywords: current.expected_keywords,
        model_response_en: current.model_response_en,
        level_tag: current.level,
        module: session.module,
        audio_data_url: dataUrl, // for local-only scoring
      }),
    }).catch(() => {});

    if (idx < SPEAKING_TOTAL - 1) {
      setIdx(idx + 1);
      blobRef.current = null;
      setElapsed(0);
      setState("idle");
    } else {
      updateSession(params.id, { current_step: "results" });
      fetch(`/api/exams/${params.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ current_step: "results", status: "speaking_done" }),
      }).catch(() => {});
      router.push(`/exam/${params.id}/results`);
    }
  };

  const retriesForThis = retries[idx] ?? 0;
  const canRedo = retriesForThis < 1 && state === "recorded";

  return (
    <section className="mx-auto max-w-prose px-6 py-16 md:px-12 md:py-24">
      <ProgressHeader
        section="03 · Expresión oral"
        title={current.scenario_es}
        current={idx + 1}
        total={SPEAKING_TOTAL}
        note={`Responda en inglés. Puede grabar hasta 45 segundos. ${retriesForThis > 0 ? "Ya usó su regrabación." : "Tiene una regrabación disponible."}`}
      />

      <div className="rounded-md border border-hair bg-white p-6 md:p-8">
        <p className="caps mb-4">Su respuesta en inglés</p>

        {state === "idle" && (
          <Button variant="accent" size="lg" onClick={startRecording}>
            <Mic className="h-4 w-4" aria-hidden />
            Grabar respuesta
          </Button>
        )}

        {state === "requesting" && (
          <p className="font-sans text-t-body text-espresso-muted">
            Solicitando acceso al micrófono…
          </p>
        )}

        {state === "recording" && (
          <div className="flex items-center gap-6">
            <Button variant="primary" size="lg" onClick={stopRecording}>
              <Square className="h-4 w-4" aria-hidden />
              Detener
            </Button>
            <div className="flex items-center gap-3 font-mono text-t-body text-ink">
              <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
              {formatDuration(elapsed)} / 00:45
            </div>
          </div>
        )}

        {state === "recorded" && (
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" onClick={submit}>
              {idx === SPEAKING_TOTAL - 1 ? "Ver mis resultados" : "Enviar y continuar"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="caps flex items-center gap-2 text-espresso-muted hover:text-espresso disabled:opacity-40"
            >
              <RefreshCcw className="h-3 w-3" aria-hidden />
              Regrabar
            </button>
          </div>
        )}

        {state === "uploading" && (
          <p className="font-sans text-t-body text-espresso-muted">
            Subiendo su respuesta…
          </p>
        )}
      </div>

      <p className="caps mt-8">
        Tip · Hable en voz clara y natural. La IA entiende acentos.
      </p>
    </section>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
