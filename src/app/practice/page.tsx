import type { Metadata } from "next";
import Link from "next/link";
import {
  isSupabaseConfigured,
  createServiceClient,
} from "@/lib/supabase/client-or-service";
import { pickDrillForEmployee } from "@/lib/practice/picker";
import { readStreak } from "@/lib/practice/streak";
import { pickDrill, ROLE_LABELS } from "@/content/practice-drills";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { StreakChip } from "@/components/practice/StreakChip";
import { LevelChip } from "@/components/practice/LevelChip";
import { PRACTICE_COPY } from "@/content/practice";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

/**
 * /practice — daily 5-minute drill entry.
 *
 * Server component. Resolves "today's drill" for the employee from
 * URL params (?employee_id, ?role, ?level). Renders an intro card
 * with the streak chip, level chip, and an "Empezar" CTA that links
 * to /practice/[drillId]?employee_id=...
 *
 * Demo mode (no Supabase): defaults to frontdesk/A2 and uses the
 * pure pickDrill from content. Streak shows 0 (the runtime fallback
 * to localStorage happens after the user lands on the runner page —
 * we don't read window.localStorage from a server component).
 */

export const metadata: Metadata = {
  title: "Práctica diaria",
  description: "Su práctica diaria de inglés hotelero — 5 minutos.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const VALID_ROLES: RoleModule[] = ["bellboy", "frontdesk", "restaurant"];
const VALID_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];

interface PageProps {
  searchParams: { employee_id?: string; role?: string; level?: string };
}

export default async function PracticeIndex({ searchParams }: PageProps) {
  const employee_id = searchParams.employee_id ?? null;
  let role: RoleModule =
    (searchParams.role && VALID_ROLES.includes(searchParams.role as RoleModule)
      ? (searchParams.role as RoleModule)
      : null) ?? "frontdesk";
  let level: CEFRLevel =
    (searchParams.level && VALID_LEVELS.includes(searchParams.level as CEFRLevel)
      ? (searchParams.level as CEFRLevel)
      : null) ?? "A2";

  // Live mode: resolve role + level from the employee row.
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
    }
  }

  // Pick the drill.
  let drillId: string;
  if (isSupabaseConfigured() && employee_id) {
    try {
      const picked = await pickDrillForEmployee(employee_id, role, level);
      drillId = picked.drill.id;
    } catch {
      drillId = pickDrill(role, level).id;
    }
  } else {
    drillId = pickDrill(role, level).id;
  }

  // Streak.
  const streak = employee_id
    ? await readStreak(employee_id)
    : { current_streak: 0, longest_streak: 0, last_practice_date: null };

  const todayIso = new Date().toISOString().slice(0, 10);
  const alreadyToday = streak.last_practice_date === todayIso;

  const params = new URLSearchParams();
  if (employee_id) params.set("employee_id", employee_id);
  params.set("role", role);
  params.set("level", level);
  const drillHref = `/practice/${encodeURIComponent(drillId)}?${params.toString()}`;

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          {PRACTICE_COPY.intro.backHome}
        </Link>
      </header>

      <section className="mx-auto max-w-prose px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10 flex items-baseline justify-between border-b border-hair pb-4">
          <p className="caps text-espresso-muted">
            {PRACTICE_COPY.intro.eyebrow}
          </p>
          <StreakChip current={streak.current_streak} />
        </div>

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
          {PRACTICE_COPY.intro.description}
        </p>

        <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <dt className="caps text-espresso-muted">
              {PRACTICE_COPY.intro.moduleLabel}
            </dt>
            <dd className="font-serif text-t-body font-medium text-espresso">
              <em>{ROLE_LABELS[role]}</em>
            </dd>
          </div>
          <div>
            <LevelChip level={level} />
          </div>
          {streak.longest_streak > 0 ? (
            <div>
              <span className="caps text-espresso-muted">
                {PRACTICE_COPY.intro.longest(streak.longest_streak)}
              </span>
            </div>
          ) : null}
        </dl>

        {alreadyToday ? (
          <div className="mt-10 rounded-md border border-hair bg-ivory-soft p-6">
            <p className="caps mb-2 text-success">Hecho</p>
            <p className="font-sans text-t-body text-espresso-soft">
              {PRACTICE_COPY.intro.alreadyDone}
            </p>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href={drillHref} variant="primary" size="lg">
            {alreadyToday
              ? PRACTICE_COPY.intro.ctaAgain
              : PRACTICE_COPY.intro.cta}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
