import { requireSuperAdmin } from "@/lib/masteros/auth";
import {
  Smartphone,
  Building2,
  ClipboardList,
  Presentation,
  Globe,
  GraduationCap,
  LineChart,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

const APP = "https://ingleshotelero.netlify.app";
const LANDING = "https://ingleshotelero.com";

interface Card {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const SURFACES: Card[] = [
  {
    label: "App del producto",
    desc: "El PWA que usan los empleados (entrada por enlace personal).",
    href: APP,
    icon: Smartphone,
    external: true,
  },
  {
    label: "Dashboard de RH",
    desc: "Panel para gerentes de hotel: empleados, resultados, reportes.",
    href: `${APP}/hr/login`,
    icon: Building2,
    external: true,
  },
  {
    label: "Examen de colocación",
    desc: "Intake público para prospectos (warm leads) — para cotizar.",
    href: `${APP}/colocacion`,
    icon: ClipboardList,
    external: true,
  },
  {
    label: "Onboarding",
    desc: "Guías paso a paso: hotel nuevo y empleado nuevo.",
    href: `${APP}/onboarding`,
    icon: GraduationCap,
    external: true,
  },
  {
    label: "Slidedeck / Pitch",
    desc: "Deck interactivo para presentar y vender.",
    href: `${APP}/pitch`,
    icon: Presentation,
    external: true,
  },
  {
    label: "Landing marketing",
    desc: "El sitio público ingleshotelero.com.",
    href: LANDING,
    icon: Globe,
    external: true,
  },
  {
    label: "Progreso del aprendiz",
    desc: "Vista de avance del empleado (comprensión, habla, vocabulario).",
    href: `${APP}/practice/progress`,
    icon: LineChart,
    external: true,
  },
];

export default async function LaunchPage() {
  await requireSuperAdmin();
  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Atajos
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Todo en <em>un lugar</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        Accede a cada superficie del producto con un clic.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SURFACES.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              className="group rounded-md border border-hair bg-white p-5 transition-colors hover:border-ink/40"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-ink" aria-hidden />
                {c.external && (
                  <ExternalLink className="h-3.5 w-3.5 text-espresso-muted group-hover:text-ink" aria-hidden />
                )}
              </div>
              <h2 className="mt-3 font-serif text-t-h3 font-medium text-espresso">
                {c.label}
              </h2>
              <p className="mt-1.5 font-sans text-t-caption text-espresso-soft">
                {c.desc}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
