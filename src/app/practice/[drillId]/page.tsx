import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { pickDrillForEmployee } from "@/lib/practice/picker";
import { selectDueCards } from "@/lib/practice/vocab";
import { seedVocabularyIfEmpty } from "@/lib/practice/seed-vocab";
import { readStreak } from "@/lib/practice/streak";
import { ensureAudio } from "@/lib/tts/audio-bucket";
import { DRILLS, pickDrill, type Role } from "@/content/practice-drills";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import { PracticeRunner, type RunnerData } from "./PracticeRunner";

export const metadata: Metadata = {
  title: "Práctica diaria",
  description: "Su práctica diaria de inglés hotelero — 5 minutos.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { drillId: string };
  searchParams: { employee_id?: string; role?: string; level?: string };
}

const VALID_ROLES: RoleModule[] = ["bellboy", "frontdesk", "restaurant"];
const VALID_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

/**
 * /practice/[drillId] — runs a specific drill.
 *
 * The drill id is part of the URL so the user can bookmark / share /
 * resume. We resolve the drill by id from the static DRILLS pool. If
 * drillId === "today", we let the picker decide.
 *
 * Server work:
 *   1. Resolve role + level (from URL params, then employee row, then
 *      defaults).
 *   2. Pick drill (or look it up by id).
 *   3. Pre-resolve audio URLs for the listening prompt and reinforce
 *      model_response so the client renders a real <audio src=...>
 *      from the first frame.
 *   4. Read streak + due vocabulary.
 *
 * The runner client component takes RunnerData and runs the loop.
 */
export default async function PracticeDrillPage({ params, searchParams }: PageProps) {
  const employee_id = searchParams.employee_id ?? null;
  let role: RoleModule =
    (searchParams.role && VALID_ROLES.includes(searchParams.role as RoleModule)
      ? (searchParams.role as RoleModule)
      : null) ?? "frontdesk";
  let level: CEFRLevel =
    (searchParams.level && VALID_LEVELS.includes(searchParams.level as CEFRLevel)
      ? (searchParams.level as CEFRLevel)
      : null) ?? "A2";

  // Resolve role + level from the employee row when present.
  if (isSupabaseConfigured() && employee_id) {
    const supabase = createServiceClient();
    if (supabase) {
      const { data: emp } = await supabase
        .from("employees")
        .select("hotel_role, current_level")
        .eq("id", employee_id)
        .maybeSingle();
      if (emp) {
        role = emp.hotel_role as RoleModule;
        level = (emp.current_level as CEFRLevel | null) ?? level;
      }
      // First-time seeding so the review step has cards from day 1.
      await seedVocabularyIfEmpty(employee_id, role);
    }
  }

  // Resolve the drill.
  let drill =
    params.drillId === "today" || params.drillId === "next"
      ? null
      : DRILLS[role as Role]?.find((d) => d.id === params.drillId) ?? null;

  if (!drill) {
    if (isSupabaseConfigured() && employee_id) {
      const picked = await pickDrillForEmployee(employee_id, role, level);
      drill = picked.drill;
    } else {
      drill = pickDrill(role, level);
    }
  }
  if (!drill) notFound();

  // Pre-resolve audio.
  const [listening, reinforce, due, streak] = await Promise.all([
    resolveAudio(drill.id, role, drill.level, drill.listening.audio_text, "guest"),
    resolveAudio(drill.id, role, drill.level, drill.reinforce.model_en, "role"),
    employee_id ? selectDueCards(employee_id, 3, role, drill.level) : Promise.resolve([]),
    employee_id
      ? readStreak(employee_id)
      : Promise.resolve({ current_streak: 0, longest_streak: 0, last_practice_date: null }),
  ]);

  // Promote due cards' fields to the ReviewCard shape (already same).
  const due_vocab = due.map((c) => ({
    word_en: c.word_en,
    word_es: c.word_es,
    example_en: c.example_en,
    example_es: c.example_es,
    level: c.level,
    module: c.module,
  }));

  // Fallback: if no due cards (demo or unseeded), pull the drill's
  // own vocab so the review step is still present.
  const reviewCards =
    due_vocab.length > 0
      ? due_vocab
      : drill.vocabulary.slice(0, 3).map((v) => ({
          word_en: v.word_en,
          word_es: v.word_es,
          example_en: v.example_en,
          example_es: v.example_es,
          level: drill!.level,
          module: role,
        }));

  const data: RunnerData = {
    drill,
    module: role,
    level: drill.level,
    employee_id,
    due_vocab: reviewCards,
    streak_current: streak.current_streak,
    listening_audio_url: listening,
    reinforce_audio_url: reinforce,
  };

  return <PracticeRunner data={data} />;
}

async function resolveAudio(
  itemId: string,
  module: RoleModule,
  level: CEFRLevel,
  text: string,
  speaker: "guest" | "role",
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const result = await ensureAudio({
      // Suffix the speaker so guest + role audio coexist in the bucket.
      id: speaker === "guest" ? `${itemId}-listen` : `${itemId}-model`,
      module,
      level,
      audio_text: text,
      speaker,
    });
    return result.url || null;
  } catch {
    return null;
  }
}
