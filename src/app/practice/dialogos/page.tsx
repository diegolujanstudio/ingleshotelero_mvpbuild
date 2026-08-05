import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { DialoguePlayer } from "@/components/practice/DialoguePlayer";
import { dialogueFor } from "@/content/dialogues";
import { MODES_COPY } from "@/content/practice-modes";
import { ROLE_LABELS, type Role } from "@/content/practice-drills";
import { ROLE_IDS } from "@/content/roles";
import type { CEFRLevel } from "@/lib/supabase/types";

/**
 * /practice/dialogos — shadowing mode.
 *
 * One dialogue per role × level (32 total). Role + level via query params
 * from the hub; defaults mirror /practice so the page demos cold.
 */

export const metadata: Metadata = {
  title: "Diálogos del turno",
  description: "Una conversación real de tu puesto, línea por línea.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const COPY = MODES_COPY.dialogos;
const VALID_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

export default function DialogosPage({
  searchParams,
}: {
  searchParams: { role?: string; level?: string };
}) {
  const role: Role = (ROLE_IDS as readonly string[]).includes(
    searchParams.role ?? "",
  )
    ? (searchParams.role as Role)
    : "frontdesk";
  const level: CEFRLevel = VALID_LEVELS.includes(
    searchParams.level as CEFRLevel,
  )
    ? (searchParams.level as CEFRLevel)
    : "A2";

  const dialogue = dialogueFor(role, level);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <Logo className="min-h-[44px] items-center" />
        <Link
          href="/practice"
          aria-label={COPY.back}
          className="caps inline-flex min-h-[44px] items-center text-espresso transition-colors hover:text-ink"
        >
          Salir
        </Link>
      </header>

      <section className="mx-auto max-w-[40rem] px-6 py-8 md:py-12">
        <p className="caps mb-4 text-espresso-muted">
          {COPY.eyebrow} · {ROLE_LABELS[role]} · {level}
        </p>
        {dialogue ? (
          <>
            <h1 className="font-serif text-[clamp(1.5rem,4.5vw,2rem)] font-medium leading-tight tracking-[-0.02em]">
              {dialogue.title_es}
            </h1>
            <p className="mt-3 font-sans text-t-body text-espresso-soft">
              {dialogue.scene_es}
            </p>
            <p className="mt-2 font-sans text-t-caption text-espresso-muted">
              {COPY.description}
            </p>
            <div className="mt-6">
              <DialoguePlayer dialogue={dialogue} />
            </div>
          </>
        ) : (
          <div className="rounded-md border border-hair bg-white p-6">
            <p className="font-sans text-t-body text-espresso-soft">
              {COPY.empty}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
