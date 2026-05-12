"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, ArrowRight, RefreshCcw, ArrowDownToLine } from "lucide-react";
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
import { postRecording } from "@/lib/pwa/api-client";
import {
  createSupportedRecorder,
  getSupportedAudioMimeType,
  isMediaRecorderAvailable,
} from "@/lib/pwa/media-recorder";
import {
  hasInstallPrompt,
  isIOS,
  isStandalone,
  subscribeToInstall,
  tryShowInstallPrompt,
} from "@/lib/pwa/install";
import { IOSShareSheet } from "@/components/site/IOSShareSheet";
import { INSTALL } from "@/content/auth";
import { INSTALL_HINT } from "@/content/pwa";

type RecorderState = "idle" | "requesting" | "recording" | "recorded" | "uploading";

const INSTALL_PROMPT_FLAG = "ih.install.prompt.shown.v1";

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
  const [recorderAvailable, setRecorderAvailable] = useState<boolean | null>(null);

  // Install-prompt UX (Phase 8 timing — fire on first speaking-section mount).
  const [showInstallNudge, setShowInstallNudge] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [iosSheetOpen, setIosSheetOpen] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const mimeRef = useRef<string>("");

  // Load session.
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

  // Feature-gate MediaRecorder availability.
  useEffect(() => {
    setRecorderAvailable(isMediaRecorderAvailable());
  }, []);

  // Install-prompt timing — first speaking-section mount, once per device.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    let shown = false;
    try {
      shown = localStorage.getItem(INSTALL_PROMPT_FLAG) === "1";
    } catch {
      shown = false;
    }
    if (shown) return;

    setIsIOSDevice(isIOS());

    if (isIOS()) {
      // iOS path — surface the share-sheet nudge inline (manual install).
      setShowInstallNudge(true);
      return;
    }

    // Chromium path — wait for the deferred prompt to be available, then
    // show the nudge. Subscribe so we update if the prompt arrives late.
    if (hasInstallPrompt()) {
      setShowInstallNudge(true);
    }
    const unsubscribe = subscribeToInstall(() => {
      if (hasInstallPrompt()) setShowInstallNudge(true);
    });
    return unsubscribe;
  }, []);

  const dismissInstallNudge = () => {
    setShowInstallNudge(false);
    try {
      localStorage.setItem(INSTALL_PROMPT_FLAG, "1");
    } catch {
      // ignore — flag is best-effort
    }
  };

  const fireInstallPrompt = async () => {
    const outcome = await tryShowInstallPrompt();
    // Whether accepted or dismissed, retire the nudge — Chrome won't
    // re-fire the deferred event for ~90 days after a dismiss.
    dismissInstallNudge();
    if (outcome === "unavailable") {
      // No deferred prompt (e.g. came from page reload). Nothing to do.
    }
  };

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

  // Feature gate — hard block if the browser can't record.
  if (recorderAvailable === false) {
    return (
      <section className="mx-auto max-w-prose px-6 py-16 md:px-12 md:py-24">
        <p className="caps mb-3">03 · Expresión oral</p>
        <h1 className="font-serif text-t-h2 font-medium text-espresso">
          Su navegador no puede grabar audio.
        </h1>
        <p className="mt-4 font-sans text-t-body-lg text-espresso-soft">
          Para terminar la evaluación, abra este enlace en{" "}
          <em>Safari</em> (iPhone) o <em>Chrome</em> (Android, computadora).
          La parte de comprensión auditiva ya quedó guardada — su Recursos
          Humanos puede continuar el examen desde otro dispositivo.
        </p>
        <p className="caps mt-10">Ya puede cerrar esta pestaña.</p>
      </section>
    );
  }
  if (recorderAvailable === null) {
    // Probing — render nothing for one tick so we don't flash.
    return null;
  }

  const startRecording = async () => {
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const built = createSupportedRecorder(stream);
      if (!built) {
        setState("idle");
        alert(
          "No se pudo iniciar la grabación. Cierre y abra otra vez la página.",
        );
        return;
      }
      const { recorder, mimeType } = built;
      mediaRef.current = recorder;
      mimeRef.current = mimeType || getSupportedAudioMimeType() || "audio/webm";
      chunksRef.current = [];
      recorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      });
      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeRef.current || "audio/webm",
        });
        blobRef.current = blob;
        setState("recorded");
        streamRef.current?.getTracks().forEach((t) => t.stop());
      });
      recorder.start();
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
    } catch {
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

    const blob = blobRef.current;

    // Base64 fallback for localStorage persistence (used by demo-mode
    // scoring + the results page).
    let dataUrl: string | null = null;
    try {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      });
    } catch {
      dataUrl = null;
    }

    // Upload via the offline-aware client. On 5xx / network failure it
    // stores the Blob in IDB and queues the recording for replay; the
    // user never sees "upload failed".
    await postRecording(params.id, idx, blob, {
      level_tag: current.level,
      audio_duration_seconds: elapsed,
    });

    // Persist locally regardless. Includes the data URL so demo-mode
    // scoring on the results page works without a server round-trip.
    const rec = {
      prompt_index: idx,
      audio_data_url: dataUrl,
      audio_duration_seconds: elapsed,
      level_tag: current.level,
      scoring_status: "pending" as const,
    };
    const existing = session.speaking_recordings ?? [];
    const filtered = existing.filter((r) => r.prompt_index !== idx);
    const next = [...filtered, rec].sort(
      (a, b) => a.prompt_index - b.prompt_index,
    );
    const updated = updateSession(params.id, { speaking_recordings: next });
    if (updated) setSession(updated);

    // Best-effort scoring kickoff for the demo path. Persisted-mode
    // scoring is triggered server-side from /api/recordings.
    void fetch("/api/score-speaking", {
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
        audio_data_url: dataUrl,
      }),
    }).catch(() => {});

    if (idx < SPEAKING_TOTAL - 1) {
      setIdx(idx + 1);
      blobRef.current = null;
      setElapsed(0);
      setState("idle");
    } else {
      updateSession(params.id, { current_step: "results" });
      void fetch(`/api/exams/${params.id}`, {
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
        note={`Responda en inglés. Puede grabar hasta 45 segundos. ${
          retriesForThis > 0
            ? "Ya usó su regrabación."
            : "Tiene una regrabación disponible."
        }`}
      />

      {/* Install nudge — Phase 8 timing. Once per device, dismissible. */}
      {showInstallNudge && (
        <div className="mb-8 rounded-md border border-hair bg-ivory-soft p-4">
          <p className="font-sans text-t-body text-espresso-soft">
            {isIOSDevice
              ? INSTALL_HINT.fallbackIOS
              : INSTALL_HINT.beforeFirstPrompt}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="accent"
              size="md"
              onClick={() => {
                if (isIOSDevice) {
                  setIosSheetOpen(true);
                } else {
                  void fireInstallPrompt();
                }
              }}
            >
              <ArrowDownToLine className="h-4 w-4" aria-hidden />
              {INSTALL.cta}
            </Button>
            <button
              type="button"
              onClick={dismissInstallNudge}
              className="caps text-espresso-muted hover:text-espresso"
            >
              Ahora no
            </button>
          </div>
        </div>
      )}
      {iosSheetOpen && (
        <IOSShareSheet
          open={iosSheetOpen}
          onClose={() => {
            setIosSheetOpen(false);
            dismissInstallNudge();
          }}
        />
      )}

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
              {idx === SPEAKING_TOTAL - 1
                ? "Ver mis resultados"
                : "Enviar y continuar"}
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
            Guardando su respuesta…
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
