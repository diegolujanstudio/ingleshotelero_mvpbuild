import { ChevronRight } from "lucide-react";
import { EMPLOYEE_DETAIL } from "@/content/hr";
import { ROLES } from "@/content/roles";
import { LEVEL_LABEL_ES } from "@/lib/cefr";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

interface Props {
  current_level: CEFRLevel | null;
  hotel_role: RoleModule;
  combined_score: number;
  streak: number;
  practice_completion_pct: number;
  name: string;
}

/**
 * Auto-generated next-step recommendations based on level + practice signals.
 * Pure function of the props — no side effects, no fetching.
 */
export function RecommendationsCard({
  current_level,
  hotel_role,
  combined_score,
  streak,
  practice_completion_pct,
  name,
}: Props) {
  const recs = generateRecs({
    current_level,
    hotel_role,
    combined_score,
    streak,
    practice_completion_pct,
    name,
  });

  if (recs.length === 0) {
    return (
      <p className="font-sans text-t-body text-espresso-muted">
        {EMPLOYEE_DETAIL.recommendations.none}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {recs.map((r, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-md border border-hair bg-white p-4"
        >
          <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-ink" aria-hidden />
          <div className="flex-1">
            <p className="font-serif text-t-h3 font-medium text-espresso">
              {r.title}
            </p>
            <p className="mt-1 font-sans text-t-body text-espresso-soft">
              {r.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function generateRecs(p: Props): Array<{ title: string; body: string }> {
  const out: Array<{ title: string; body: string }> = [];
  const firstName = p.name.split(" ")[0];
  const roleLabel = ROLES[p.hotel_role].label_es;

  if (!p.current_level) {
    out.push({
      title: "Tomar examen de colocación",
      body: `${firstName} aún no ha completado el examen de colocación. Sin nivel CEFR no podemos sugerir un módulo a la medida.`,
    });
    return out;
  }

  if (p.current_level === "A1") {
    out.push({
      title: `Módulo ${roleLabel} desde cero (3 meses)`,
      body: `Prioridad alta. ${firstName} necesita el módulo completo para alcanzar comunicación funcional (A2) antes de atender huéspedes internacionales sin supervisión.`,
    });
  } else if (p.current_level === "A2") {
    out.push({
      title: "Candidato al módulo B1 (3 meses)",
      body: `Módulo ${roleLabel} de 3 meses con vocabulario específico + práctica diaria de 5 min vía WhatsApp. Meta: B1 al cierre del trimestre.`,
    });
  } else if (p.current_level === "B1") {
    out.push({
      title: "Módulo B2 (3 meses)",
      body: `Enfoque en escenarios complejos (quejas, negociación, huéspedes VIP). ${firstName} tiene alta probabilidad de alcanzar B2 con consistencia diaria.`,
    });
  } else if (p.current_level === "B2") {
    out.push({
      title: "Listo para mentoría interna",
      body: `${firstName} puede mentorar a colegas del mismo puesto y eventualmente liderar la certificación "Propiedad Bilingüe" del hotel.`,
    });
  }

  if (p.streak === 0) {
    out.push({
      title: "Reactivar racha de práctica",
      body: `${firstName} no tiene racha activa. Enviar invitación de drill por WhatsApp con tono motivacional. 5 minutos diarios bastan para retomar.`,
    });
  } else if (p.practice_completion_pct < 50) {
    out.push({
      title: "Aumentar consistencia diaria",
      body: `Completitud del ${p.practice_completion_pct}%. Sugerir un horario fijo (post-shift change) con recordatorio automatizado.`,
    });
  }

  // Boundary-aware re-evaluation hint
  if (p.combined_score >= 25 && p.combined_score <= 35) {
    out.push({
      title: "Re-evaluar en 30 días",
      body: `Puntaje fronterizo entre A1 y A2. Una segunda evaluación con misma rúbrica reduce el riesgo de subestimar el nivel real.`,
    });
  } else if (p.combined_score >= 50 && p.combined_score <= 60) {
    out.push({
      title: "Re-evaluar en 30 días",
      body: `Puntaje fronterizo entre A2 y B1. Una segunda evaluación con misma rúbrica reduce el riesgo de subestimar el nivel real.`,
    });
  } else if (p.combined_score >= 73 && p.combined_score <= 83) {
    out.push({
      title: "Re-evaluar en 30 días",
      body: `Puntaje fronterizo entre B1 y B2. Una segunda evaluación con misma rúbrica reduce el riesgo de subestimar el nivel real.`,
    });
  }

  // Fold in level label for educational context
  if (p.current_level) {
    out.push({
      title: `Nivel actual: ${p.current_level} · ${LEVEL_LABEL_ES[p.current_level]}`,
      body: `Calibrado contra rúbrica de hotelería. El siguiente cambio de nivel requiere consistencia + un re-examen.`,
    });
  }

  return out;
}
