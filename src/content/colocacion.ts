/**
 * Default editorial copy for the public colocación intake page.
 * Stored in page_content (key "colocacion") and editable from Master OS;
 * these are the floor so the page renders even before any edit.
 */
export interface ColocacionCopy {
  eyebrow: string;
  headline_before: string;
  headline_em: string;
  headline_after: string;
  intro: string;
  submit_label: string;
  reassurance: string;
  thankyou_title: string;
  thankyou_body: string;
}

export const COLOCACION_COPY_KEY = "colocacion";

export const DEFAULT_COLOCACION_COPY: ColocacionCopy = {
  eyebrow: "Examen de colocación · Diagnóstico para tu hotel",
  headline_before: "Cuéntanos de tu ",
  headline_em: "hotel",
  headline_after: ". Te armamos un plan y una cotización.",
  intro:
    "Un diagnóstico rápido: nos dices cuántas propiedades operas, qué áreas necesitan inglés y dónde está tu equipo hoy. Con eso te enviamos una propuesta concreta — sin compromiso.",
  submit_label: "Solicitar mi cotización",
  reassurance: "Respuesta en menos de 24 horas hábiles. Sin compromiso.",
  thankyou_title: "¡Recibido! Te armamos tu plan.",
  thankyou_body:
    "Un miembro del equipo revisará tu información y te enviará una propuesta a la medida — con niveles, áreas y precio — en menos de 24 horas hábiles.",
};

// Department chips (areas that may need English).
export const COLOCACION_AREAS = [
  "Recepción / Front Desk",
  "Botones / Concierge",
  "Restaurante / Bar",
  "Ama de llaves",
  "Spa / Wellness",
  "Seguridad",
  "Gerencia",
  "Ventas / Eventos",
] as const;
