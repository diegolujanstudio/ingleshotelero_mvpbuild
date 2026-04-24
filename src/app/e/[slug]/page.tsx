import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Mic, ShieldCheck, Headphones } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { ROLES, ROLE_IDS } from "@/content/roles";
import { formatIndex } from "@/lib/utils";
import { createServerClient } from "@/lib/supabase/server";
import { EntryForm } from "./entry-form";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Evaluación de inglés · ${params.slug}`,
    description:
      "Evaluación de inglés hotelero — 15 minutos. Un diagnóstico honesto de su nivel funcional.",
    robots: { index: false, follow: false },
  };
}

/**
 * Hotel-scoped exam entry.
 *
 * Phase 1: loads property by slug when Supabase is configured; otherwise
 * falls back to a stub that still demonstrates the full UX so Diego can
 * review the entry experience without a database.
 *
 * Phase 2 will: create an `exam_sessions` row on submit → redirect to
 * `/exam/[id]/diagnostic`. For now, the form surfaces the fields we need
 * without persisting them.
 */
export default async function HotelEntryPage({ params }: PageProps) {
  const property = await loadProperty(params.slug);

  if (!params.slug || params.slug.length < 2) notFound();

  return (
    <main className="min-h-screen bg-ivory">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo showSub={false} />
        <span className="caps">Evaluación · 15 minutos</span>
      </header>

      <section className="mx-auto max-w-shell px-6 pb-20 pt-16 md:px-12 md:pb-32 md:pt-20">
        <p className="caps mb-6">{formatIndex(0)} · Preparación</p>
        <h1 className="max-w-[20ch] font-serif text-[clamp(2rem,6vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Bienvenido a <em>{property.displayName}</em>.
        </h1>
        <p className="mt-8 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Este diagnóstico mide el inglés que usted usa en su puesto. Dura alrededor de
          15 minutos, tiene tres partes y se puede pausar y retomar en cualquier momento.
        </p>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          <PrepStep
            icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
            index={1}
            title="Cuestionario breve"
            body="Trece preguntas sobre su historia con el inglés. Sin respuestas correctas o incorrectas."
          />
          <PrepStep
            icon={<Headphones className="h-4 w-4" aria-hidden />}
            index={2}
            title="Comprensión auditiva"
            body="Diez situaciones en inglés. Escuche y elija la acción correcta. Puede repetir el audio dos veces."
          />
          <PrepStep
            icon={<Mic className="h-4 w-4" aria-hidden />}
            index={3}
            title="Expresión oral"
            body="Seis escenarios. Lea en español, responda en inglés. Puede regrabar una vez por pregunta."
          />
        </ol>

        <HairlineRule className="my-16" />

        <EntryForm
          propertySlug={params.slug}
          propertyName={property.displayName}
          roles={ROLE_IDS.map((id) => ({
            id,
            label: ROLES[id].label_es,
            caption: ROLES[id].scenario_caption,
          }))}
          isStub={property.isStub}
        />
      </section>
    </main>
  );
}

function PrepStep({
  icon,
  index,
  title,
  body,
}: {
  icon: React.ReactNode;
  index: number;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-md border border-hair bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-hair bg-ivory-soft text-ink">
          {icon}
        </span>
        <span className="caps">Parte {formatIndex(index)}</span>
      </div>
      <h2 className="font-serif text-t-h3 font-medium">{title}</h2>
      <p className="mt-3 font-sans text-t-body text-espresso-soft">{body}</p>
    </li>
  );
}

async function loadProperty(slug: string): Promise<{
  displayName: string;
  isStub: boolean;
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { displayName: toDisplayName(slug), isStub: true };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select("name, is_active")
      .eq("slug", slug)
      .maybeSingle() as unknown as {
        data: { name: string; is_active: boolean } | null;
        error: unknown;
      };

    if (error || !data) {
      return { displayName: toDisplayName(slug), isStub: true };
    }
    return { displayName: data.name, isStub: false };
  } catch {
    return { displayName: toDisplayName(slug), isStub: true };
  }
}

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
