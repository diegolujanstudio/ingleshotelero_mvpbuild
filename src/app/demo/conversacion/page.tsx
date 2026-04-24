"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, Send, ArrowLeft, MoreVertical, Phone, Video, Play } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn, formatIndex } from "@/lib/utils";
import { HairlineRule } from "@/components/ui/HairlineRule";

/**
 * Interactive WhatsApp daily-drill simulator for prospect demos.
 *
 * Runs through the full 5-minute loop with animated bubbles:
 *   greeting → listening drill → answer → speaking prompt → voice note →
 *   AI feedback → model response → streak summary.
 *
 * No real WhatsApp or Twilio is involved. Diego taps through while the
 * prospect watches on his laptop.
 */

type Bubble =
  | { kind: "bot"; text: string; ts: string }
  | { kind: "user"; text: string; ts: string }
  | { kind: "bot-audio"; duration: number; label: string; ts: string }
  | { kind: "user-audio"; duration: number; label: string; ts: string }
  | { kind: "bot-buttons"; question: string; options: string[]; ts: string }
  | { kind: "bot-feedback"; yourText: string; suggestion: string; model: string; ts: string }
  | { kind: "bot-streak"; streak: number; level: string; pct: number; ts: string };

const TIMESTAMP = () =>
  new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

export default function WhatsAppSimulator() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [step, setStep] = useState<
    "idle" | "listening" | "answering" | "speaking" | "recording" | "scoring" | "review" | "done"
  >("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to latest.
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [bubbles.length]);

  const push = (b: Bubble) => setBubbles((bs) => [...bs, b]);
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const start = async () => {
    setBubbles([]);
    setStep("idle");
    await wait(300);
    push({
      kind: "bot",
      text: "¡Buenos días, María! 🌅 Lista para su ejercicio de hoy? Son solo 5 minutos.",
      ts: TIMESTAMP(),
    });
    await wait(1200);
    push({
      kind: "bot",
      text: "Primero, escuche lo que dice el huésped y elija la acción correcta.",
      ts: TIMESTAMP(),
    });
    await wait(800);
    push({
      kind: "bot-audio",
      duration: 4,
      label: "🎧 Audio del huésped",
      ts: TIMESTAMP(),
    });
    await wait(600);
    push({
      kind: "bot-buttons",
      question: "¿Qué le está pidiendo el huésped?",
      options: [
        "1️⃣ 🧳 Ayudar con el equipaje",
        "2️⃣ 📍 Dar indicaciones",
        "3️⃣ 🍽️ Llevar al restaurante",
      ],
      ts: TIMESTAMP(),
    });
    setStep("listening");
  };

  const answerListening = async () => {
    push({ kind: "user", text: "1️⃣", ts: TIMESTAMP() });
    setStep("answering");
    await wait(700);
    push({
      kind: "bot",
      text: "✅ ¡Correcto! El huésped pidió ayuda con sus maletas.",
      ts: TIMESTAMP(),
    });
    await wait(900);
    push({
      kind: "bot",
      text: "Ahora practiquemos lo que usted le diría.\n\nEscenario: El huésped le pide que lleve sus maletas a la habitación 304. Responda en inglés 👇",
      ts: TIMESTAMP(),
    });
    await wait(600);
    push({
      kind: "bot",
      text: "🎙️ Envíe un audio en inglés (15–30 segundos)",
      ts: TIMESTAMP(),
    });
    setStep("speaking");
  };

  const recordVoice = async () => {
    setStep("recording");
    push({
      kind: "user-audio",
      duration: 12,
      label: "🎙️ Su respuesta",
      ts: TIMESTAMP(),
    });
    await wait(1200);
    push({ kind: "bot", text: "Procesando su audio…", ts: TIMESTAMP() });
    setStep("scoring");
    await wait(2400);
    push({
      kind: "bot-feedback",
      yourText: "Yes, I take bags to room three-oh-four.",
      suggestion:
        "Pruebe: “Of course, sir. I'll take your luggage to room 304 right away.”",
      model: "🎧 Audio modelo nativo (0:08)",
      ts: TIMESTAMP(),
    });
    await wait(900);
    push({
      kind: "bot",
      text: "💡 Trabajamos tres vocabularios nuevos hoy: luggage (equipaje) · right away (ahora mismo) · sir (señor).",
      ts: TIMESTAMP(),
    });
    setStep("review");
    await wait(900);
    push({
      kind: "bot-streak",
      streak: 8,
      level: "A2",
      pct: 52,
      ts: TIMESTAMP(),
    });
    await wait(500);
    push({
      kind: "bot",
      text: "Mañana a las 9 a.m. le llega el siguiente ejercicio. ¡Buen día! 🌤️",
      ts: TIMESTAMP(),
    });
    setStep("done");
  };

  const reset = () => {
    setBubbles([]);
    setStep("idle");
  };

  return (
    <main className="min-h-screen bg-ivory">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
        <Link href="/" className="caps hover:text-ink">
          ← Sitio público
        </Link>
      </header>

      <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-24">
        <p className="caps mb-3">{formatIndex(1)} · Demo interactivo</p>
        <h1 className="max-w-[22ch] font-serif text-t-h1 font-medium">
          Así se ve <em>un día</em> de capacitación en WhatsApp.
        </h1>
        <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Cinco minutos. La misma app que su equipo ya usa. Toque los botones
          para avanzar — las respuestas son reales, el audio del ejemplo
          es simulado.
        </p>

        <HairlineRule className="my-10" />

        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
          {/* Controls / explanation */}
          <aside className="space-y-6">
            <div className="rounded-md border border-hair bg-white p-6">
              <p className="caps mb-3">Controles</p>
              {step === "idle" && (
                <button
                  type="button"
                  onClick={start}
                  className="rounded-pill bg-ink px-6 py-2.5 font-sans text-t-label font-medium text-white hover:bg-ink-deep"
                >
                  Iniciar ejercicio del día →
                </button>
              )}
              {step === "listening" && (
                <button
                  type="button"
                  onClick={answerListening}
                  className="rounded-pill bg-ink px-6 py-2.5 font-sans text-t-label font-medium text-white hover:bg-ink-deep"
                >
                  Tocar opción 1 (respuesta correcta)
                </button>
              )}
              {(step === "speaking") && (
                <button
                  type="button"
                  onClick={recordVoice}
                  className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-2.5 font-sans text-t-label font-medium text-white hover:bg-ink-deep"
                >
                  <Mic className="h-4 w-4" aria-hidden />
                  Enviar audio de respuesta
                </button>
              )}
              {(step === "answering" || step === "recording" || step === "scoring") && (
                <p className="caps">Procesando…</p>
              )}
              {step === "review" && <p className="caps">Mostrando recap…</p>}
              {step === "done" && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-pill border border-hair bg-white px-6 py-2.5 font-sans text-t-label font-medium text-espresso hover:border-espresso/40"
                >
                  Reiniciar demo
                </button>
              )}
            </div>

            <div className="rounded-md border border-hair bg-ivory-soft p-6">
              <p className="caps mb-3">Lo que está viendo el prospecto</p>
              <ul className="space-y-3 font-sans text-t-body text-espresso-soft">
                <li>
                  <strong className="font-semibold">No es una app nueva.</strong> Es
                  un mensaje de WhatsApp que ya saben recibir.
                </li>
                <li>
                  <strong className="font-semibold">Cinco minutos.</strong> El ciclo completo —
                  escuchar, hablar, reforzar, repasar — termina en un tiempo que
                  cabe entre dos tareas.
                </li>
                <li>
                  <strong className="font-semibold">Retroalimentación inmediata.</strong>
                  {" "}Audio modelo, vocabulario del día, y la racha como motivación.
                </li>
                <li>
                  <strong className="font-semibold">Datos para RH.</strong> Cada
                  interacción alimenta el panel — el reporte mensual se arma solo.
                </li>
              </ul>
            </div>
          </aside>

          {/* Phone frame */}
          <div className="mx-auto w-full max-w-[400px]">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-espresso/15 bg-espresso p-2 shadow-lg">
              {/* Status bar */}
              <div className="flex items-center justify-between px-4 pb-2 pt-3 font-mono text-[0.625rem] text-ivory">
                <span>9:14 AM</span>
                <span>WhatsApp Business</span>
                <span>●●●</span>
              </div>
              {/* WhatsApp-styled header */}
              <div className="flex items-center gap-3 rounded-t-[1.6rem] bg-[#075E54] px-4 py-3 text-white">
                <ArrowLeft className="h-5 w-5" />
                <div className="flex h-9 w-9 items-center justify-center rounded-pill bg-[#128C7E] font-mono text-[0.625rem] font-medium">
                  IH
                </div>
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium">Inglés Hotelero</p>
                  <p className="text-[0.6875rem] text-white/70">en línea</p>
                </div>
                <Video className="h-5 w-5" />
                <Phone className="h-5 w-5" />
                <MoreVertical className="h-5 w-5" />
              </div>
              {/* Message area */}
              <div
                ref={scrollRef}
                className="h-[520px] overflow-y-auto bg-[#ECE5DD] p-3"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.02) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.02) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                {bubbles.length === 0 && (
                  <p className="mt-20 text-center font-sans text-[0.75rem] text-espresso-muted">
                    Toque &ldquo;Iniciar ejercicio del día&rdquo; para comenzar.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {bubbles.map((b, i) => (
                    <BubbleView key={i} b={b} />
                  ))}
                </div>
              </div>
              {/* Input bar */}
              <div className="flex items-center gap-2 rounded-b-[1.6rem] bg-[#F0F0F0] px-3 py-2">
                <div className="flex-1 rounded-pill border border-hair bg-white px-4 py-2 font-sans text-[0.75rem] text-espresso-muted">
                  Mensaje…
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-pill bg-[#128C7E] text-white"
                  aria-label="Micrófono"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BubbleView({ b }: { b: Bubble }) {
  const isUser = "kind" in b && (b.kind === "user" || b.kind === "user-audio");
  const common = isUser
    ? "ml-auto bg-[#DCF8C6] text-espresso"
    : "bg-white text-espresso";

  if (b.kind === "bot" || b.kind === "user") {
    return (
      <div
        className={cn(
          "max-w-[85%] rounded-md px-3 py-2 text-[0.8125rem] leading-snug shadow-sm",
          common,
        )}
      >
        <p className="whitespace-pre-line">{b.text}</p>
        <p className="mt-1 text-right text-[0.625rem] text-espresso-muted">{b.ts}</p>
      </div>
    );
  }

  if (b.kind === "bot-audio" || b.kind === "user-audio") {
    const width = Math.min(100, (b.duration / 15) * 100);
    return (
      <div
        className={cn(
          "flex max-w-[85%] items-center gap-3 rounded-md px-3 py-2 shadow-sm",
          common,
        )}
      >
        <button className="flex h-8 w-8 items-center justify-center rounded-pill bg-[#128C7E] text-white">
          <Play className="h-4 w-4" aria-hidden />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block w-[2px] rounded-full bg-[#128C7E]/60",
                  i / 20 > width / 100 && "bg-[#128C7E]/20",
                )}
                style={{ height: 4 + ((i * 3) % 10) }}
              />
            ))}
          </div>
          <p className="mt-1 font-mono text-[0.625rem] text-espresso-muted">
            {b.label} · 0:{b.duration.toString().padStart(2, "0")}
          </p>
        </div>
        <p className="text-[0.625rem] text-espresso-muted">{b.ts}</p>
      </div>
    );
  }

  if (b.kind === "bot-buttons") {
    return (
      <div className="max-w-[85%] space-y-2">
        <div className="rounded-md bg-white px-3 py-2 text-[0.8125rem] leading-snug shadow-sm">
          <p>{b.question}</p>
          <p className="mt-1 text-right text-[0.625rem] text-espresso-muted">{b.ts}</p>
        </div>
        {b.options.map((opt, i) => (
          <button
            key={i}
            className="w-full rounded-md border border-[#128C7E]/40 bg-white px-3 py-2 text-left text-[0.8125rem] text-[#128C7E] shadow-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (b.kind === "bot-feedback") {
    return (
      <div className="max-w-[85%] space-y-2 rounded-md bg-white px-3 py-3 shadow-sm">
        <p className="font-mono text-[0.6875rem] text-espresso-muted">Usted dijo:</p>
        <p className="text-[0.8125rem] italic text-espresso">&ldquo;{b.yourText}&rdquo;</p>
        <HairlineRule />
        <p className="font-mono text-[0.6875rem] text-ink">💡 Sugerencia</p>
        <p className="text-[0.8125rem] text-espresso">{b.suggestion}</p>
        <HairlineRule />
        <div className="flex items-center gap-2 rounded-sm bg-ivory-soft px-2 py-1">
          <Play className="h-3 w-3 text-[#128C7E]" aria-hidden />
          <span className="font-mono text-[0.6875rem] text-espresso-muted">{b.model}</span>
        </div>
        <p className="text-right text-[0.625rem] text-espresso-muted">{b.ts}</p>
      </div>
    );
  }

  if (b.kind === "bot-streak") {
    return (
      <div className="max-w-[85%] rounded-md bg-white px-3 py-3 shadow-sm">
        <p className="font-mono text-[0.6875rem] text-espresso-muted">Su progreso</p>
        <div className="mt-2 flex items-center gap-4">
          <div>
            <p className="font-serif text-[1.75rem] font-medium text-espresso">
              🔥 {b.streak}
            </p>
            <p className="caps">días seguidos</p>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="caps">Nivel</span>
              <span className="font-serif text-[1rem] font-medium text-ink">{b.level}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-deep">
              <div
                className="h-full bg-ink transition-all duration-500"
                style={{ width: `${b.pct}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-[0.625rem] text-espresso-muted">
              {b.pct}% del mes
            </p>
          </div>
        </div>
        <p className="mt-2 text-right text-[0.625rem] text-espresso-muted">{b.ts}</p>
      </div>
    );
  }

  return null;
}
