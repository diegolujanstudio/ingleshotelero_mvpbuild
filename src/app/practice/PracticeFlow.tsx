"use client";

/**
 * /practice — daily 5-minute drill flow.
 *
 * V0 SCAFFOLD: this file renders a minimal "today's drill" UI so the
 * route exists and the contract is visible. The full flow (state
 * machine, MediaRecorder, Supabase sync, streak ticks tied to drill
 * completion, vocabulary spaced-repetition) belongs to Claude Code —
 * see docs/CLAUDE-BRIEF.md, Phase D ("Daily practice loop").
 *
 * What this V0 does:
 *   - reads role + level from URL params (?role=frontdesk&level=A2)
 *   - falls back to localStorage hint written by the exam results page
 *   - picks today's drill from the static pool in @/content/practice-drills
 *   - shows a 3-step micro-flow: listen → reinforce → vocab
 *   - records the streak via @/lib/streak when the user finishes
 *
 * What it does NOT do (Claude Code's job):
 *   - speaking step (MediaRecorder + scoring)
 *   - per-employee personalization beyond role + level
 *   - real audio asset playback (uses browser SpeechSynthesis)
 *   - server-side persistence of completion (only localStorage)
 *   - install-as-PWA prompt timing
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import {
  DRILLS,
  ROLE_LABELS,
  pickDrill,
  type Drill,
  type Role,
} from "@/content/practice-drills";
import {
  alreadyPracticedToday,
  readStreak,
  recordPractice,
  type Streak,
} from "@/lib/streak";

type Step = "intro" | "listening" | "reinforce" | "vocab" | "done";

const VALID_ROLES: Role[] = ["bellboy", "frontdesk", "restaurant"];
const VALID_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export default function PracticeFlow() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("intro");
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    longest: 0,
    lastPracticeDate: null,
    totalDays: 0,
  });
  const [alreadyToday, setAlreadyToday] = useState(false);
  const [tickedToday, setTickedToday] = useState(false);

  // Role + level resolution (URL params → localStorage → defaults)
  const role: Role = useMemo(() => {
    const fromUrl = searchParams.get("role");
    if (fromUrl && VALID_ROLES.includes(fromUrl as Role)) return fromUrl as Role;
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("ih.lastRole");
      if (stored && VALID_ROLES.includes(stored as Role)) return stored as Role;
    }
    return "frontdesk";
  }, [searchParams]);

  const level = useMemo(() => {
    const fromUrl = searchParams.get("level");
    if (fromUrl && (VALID_LEVELS as readonly string[]).includes(fromUrl)) {
      return fromUrl as (typeof VALID_LEVELS)[number];
    }
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("ih.lastLevel");
      if (stored && (VALID_LEVELS as readonly string[]).includes(stored)) {
        return stored as (typeof VALID_LEVELS)[number];
      }
    }
    return "A2";
  }, [searchParams]);

  const drill: Drill = useMemo(() => pickDrill(role, level), [role, level]);

  useEffect(() => {
    setStreak(readStreak());
    setAlreadyToday(alreadyPracticedToday());
  }, []);

  function finish() {
    const result = recordPractice();
    setStreak(result.streak);
    setTickedToday(result.ticked);
    setStep("done");
  }

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          Salir
        </Link>
      </header>

      <section className="mx-auto max-w-prose px-6 py-10 md:px-12 md:py-16">
        <StreakBadge streak={streak} />

        {step === "intro" ? (
          <Intro
            role={role}
            level={level}
            alreadyToday={alreadyToday}
            onStart={() => setStep("listening")}
          />
        ) : null}

        {step === "listening" ? (
          <ListeningStep drill={drill} onContinue={() => setStep("reinforce")} />
        ) : null}

        {step === "reinforce" ? (
          <ReinforceStep drill={drill} onContinue={() => setStep("vocab")} />
        ) : null}

        {step === "vocab" ? (
          <VocabStep drill={drill} onContinue={finish} />
        ) : null}

        {step === "done" ? (
          <Done
            streak={streak}
            ticked={tickedToday}
            onAgain={() => setStep("intro")}
          />
        ) : null}
      </section>
    </main>
  );
}

/* ────────────────────── Streak badge ────────────────────── */

function StreakBadge({ streak }: { streak: Streak }) {
  return (
    <div className="mb-10 flex items-baseline justify-between border-b border-hair pb-4">
      <p className="caps text-espresso-muted">Su práctica diaria</p>
      <p className="caps">
        Racha · <em>{streak.current}</em> {streak.current === 1 ? "día" : "días"}
      </p>
    </div>
  );
}

/* ────────────────────── Intro ────────────────────── */

function Intro({
  role,
  level,
  alreadyToday,
  onStart,
}: {
  role: Role;
  level: string;
  alreadyToday: boolean;
  onStart: () => void;
}) {
  return (
    <div>
      <h1 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
        {alreadyToday ? (
          <>
            Ya practicó hoy. <em>Vuelva mañana.</em>
          </>
        ) : (
          <>
            Su práctica de <em>cinco minutos</em>.
          </>
        )}
      </h1>
      <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
        Módulo: <em>{ROLE_LABELS[role]}</em> · Nivel: <em>{level}</em>. Tres
        pasos: escuchar, reforzar la frase modelo, y repasar tres palabras.
      </p>

      {alreadyToday ? (
        <div className="mt-10 rounded-md border border-hair bg-ivory-soft p-6">
          <p className="caps mb-2 text-success">Hecho</p>
          <p className="font-sans text-t-body text-espresso-soft">
            Hoy cuenta para su racha. Si quiere repasar otra vez sin afectar la
            racha, puede continuar — solo cuenta una práctica por día.
          </p>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex h-12 items-center gap-2 rounded-pill bg-espresso px-6 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft"
        >
          {alreadyToday ? "Practicar otra vez" : "Comenzar"}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── Listening ────────────────────── */

function ListeningStep({
  drill,
  onContinue,
}: {
  drill: Drill;
  onContinue: () => void;
}) {
  const [played, setPlayed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const correctIndex = drill.listening.options.findIndex((o) => o.correct);

  function play() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(drill.listening.audio_text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPlayed(true);
  }

  return (
    <div>
      <p className="caps mb-3">01 · Escuchar</p>
      <h2 className="font-serif text-t-h3 font-medium">
        Un huésped le dice algo en inglés. Elija la acción correcta.
      </h2>

      <div className="mt-8">
        <button
          type="button"
          onClick={play}
          className="inline-flex h-11 items-center gap-2 rounded-pill border border-hair bg-white px-5 font-sans text-espresso transition-colors duration-200 ease-editorial hover:border-ink"
        >
          {played ? "Repetir audio" : "Reproducir audio"}
        </button>
      </div>

      <ul className="mt-8 space-y-3">
        {drill.listening.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === correctIndex;
          const showState = picked !== null;
          const stateClass = !showState
            ? "border-hair bg-white hover:border-espresso/40"
            : isCorrect
            ? "border-success bg-success/5"
            : isPicked
            ? "border-error bg-error/5"
            : "border-hair bg-white opacity-60";
          return (
            <li key={i}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(i)}
                className={`flex w-full items-center gap-4 rounded-md border p-4 text-left font-sans text-t-body-lg text-espresso transition-colors duration-200 ease-editorial ${stateClass}`}
              >
                <span className="text-[1.5rem]">{opt.emoji}</span>
                <span>{opt.text_es}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null ? (
        <div className="mt-6 rounded-md border border-hair bg-ivory-soft p-4 font-sans text-t-body text-espresso-soft">
          {drill.listening.explanation_es}
        </div>
      ) : null}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={picked === null}
          onClick={onContinue}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-5 font-sans font-medium tracking-[0.01em] text-white transition-colors duration-200 ease-editorial hover:bg-ink-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── Reinforce ────────────────────── */

function ReinforceStep({
  drill,
  onContinue,
}: {
  drill: Drill;
  onContinue: () => void;
}) {
  function play() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(drill.reinforce.model_en);
    utter.lang = "en-US";
    utter.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  return (
    <div>
      <p className="caps mb-3">02 · Reforzar</p>
      <h2 className="font-serif text-t-h3 font-medium">
        {drill.reinforce.title_es}
      </h2>

      <blockquote className="mt-6 rounded-md border border-hair bg-white p-6">
        <p className="font-serif text-[1.35rem] font-medium leading-[1.4] text-espresso">
          “{drill.reinforce.model_en}”
        </p>
        <button
          type="button"
          onClick={play}
          className="caps mt-4 text-ink underline-offset-4 hover:underline"
        >
          ▸ Escuchar
        </button>
      </blockquote>

      <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
        {drill.reinforce.note_es}
      </p>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-5 font-sans font-medium tracking-[0.01em] text-white transition-colors duration-200 ease-editorial hover:bg-ink-deep"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── Vocabulary ────────────────────── */

function VocabStep({
  drill,
  onContinue,
}: {
  drill: Drill;
  onContinue: () => void;
}) {
  const [revealed, setRevealed] = useState<boolean[]>(
    drill.vocabulary.map(() => false),
  );

  function reveal(i: number) {
    setRevealed((r) => r.map((v, idx) => (idx === i ? true : v)));
  }

  const allRevealed = revealed.every(Boolean);

  return (
    <div>
      <p className="caps mb-3">03 · Repasar</p>
      <h2 className="font-serif text-t-h3 font-medium">
        Tres palabras de su puesto. Toque para ver la traducción.
      </h2>

      <ul className="mt-8 space-y-4">
        {drill.vocabulary.map((v, i) => (
          <li key={v.word_en}>
            <button
              type="button"
              onClick={() => reveal(i)}
              className={`block w-full rounded-md border p-5 text-left transition-colors duration-200 ease-editorial ${
                revealed[i]
                  ? "border-ink bg-ink-tint"
                  : "border-hair bg-white hover:border-espresso/40"
              }`}
            >
              <p className="font-serif text-[1.4rem] font-medium text-espresso">
                {v.word_en}
              </p>
              {revealed[i] ? (
                <div className="mt-3 space-y-1">
                  <p className="font-sans text-t-body text-espresso">
                    <em>{v.word_es}</em>
                  </p>
                  <p className="font-sans text-t-body text-espresso-soft">
                    {v.example_en}{" "}
                    <span className="text-espresso-muted">— {v.example_es}</span>
                  </p>
                </div>
              ) : (
                <p className="caps mt-2 text-espresso-muted">
                  Toque para revelar
                </p>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          disabled={!allRevealed}
          onClick={onContinue}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-espresso px-5 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          Terminar
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── Done ────────────────────── */

function Done({
  streak,
  ticked,
  onAgain,
}: {
  streak: Streak;
  ticked: boolean;
  onAgain: () => void;
}) {
  return (
    <div>
      <p className="caps mb-3 text-success">{ticked ? "Día completo" : "Listo"}</p>
      <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
        {ticked ? (
          <>
            Racha de <em>{streak.current}</em>{" "}
            {streak.current === 1 ? "día" : "días"}.
          </>
        ) : (
          <>
            Buena práctica. <em>Vuelva mañana.</em>
          </>
        )}
      </h1>
      <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
        {ticked
          ? "Vuelva mañana para sumar el siguiente día. Si pasa más de un día sin practicar, la racha se reinicia — pero el conteo total se conserva."
          : "Esta práctica adicional no afecta su racha — solo cuenta una por día. Pero el repaso siempre suma."}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onAgain}
          className="inline-flex h-11 items-center gap-2 rounded-pill border border-hair bg-white px-5 font-sans text-espresso transition-colors duration-200 ease-editorial hover:border-ink"
        >
          Practicar otra
        </button>
        <Link
          href="/"
          className="caps inline-flex items-center text-ink underline-offset-4 hover:underline"
        >
          Salir →
        </Link>
      </div>

      <div className="mt-12 border-t border-hair pt-8">
        <p className="caps mb-2 text-espresso-muted">Su progreso</p>
        <p className="font-sans text-t-body text-espresso">
          Racha actual: <em>{streak.current}</em> · Racha más larga:{" "}
          <em>{streak.longest}</em> · Total de días practicados:{" "}
          <em>{streak.totalDays}</em>
        </p>
      </div>
    </div>
  );
}

// Acknowledge the static pool exists, even if pickDrill is the official entry.
DRILLS.bellboy;
