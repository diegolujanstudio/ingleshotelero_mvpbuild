/**
 * Demo data for the HR dashboard. Seeded pseudo-employees so the
 * dashboard looks populated during a prospect pitch, even without a
 * database. A real live session taken in-demo by the prospect's volunteer
 * appears alongside these records naturally.
 *
 * Nothing here is persisted; Diego can replace or drop this file entirely
 * once real hotels start running exams through Supabase.
 */

import type { CEFRLevel, RoleModule, Shift } from "./supabase/types";

export interface DemoEmployee {
  id: string;
  name: string;
  hotel_role: RoleModule;
  current_level: CEFRLevel;
  shift: Shift;
  listening_score: number;
  speaking_score: number;
  combined_score: number;
  last_active_days_ago: number;
  streak: number;
  practice_completion_pct: number; // 0-100
  strengths: string[];
  areas_to_improve: string[];
  transcripts: {
    prompt_index: number;
    scenario_es: string;
    transcript_en: string;
    ai_feedback_es: string;
    ai_score_total: number;
    level: CEFRLevel;
  }[];
  completed_at: string; // ISO
}

const iso = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_EMPLOYEES: DemoEmployee[] = [
  {
    id: "demo-001",
    name: "María López",
    hotel_role: "frontdesk",
    current_level: "B1",
    shift: "morning",
    listening_score: 82,
    speaking_score: 74,
    combined_score: 77,
    last_active_days_ago: 0,
    streak: 14,
    practice_completion_pct: 92,
    strengths: ["Vocabulario de check-in", "Tono profesional", "Manejo de quejas simples"],
    areas_to_improve: ["Verbos modales (would, could)", "Indicaciones complejas"],
    transcripts: [
      {
        prompt_index: 0,
        scenario_es:
          "Un huésped llega y se presenta. Salúdelo y confirme su reservación a nombre de 'Johnson'.",
        transcript_en:
          "Welcome, Mr. Johnson. I see your reservation. Let me check you in.",
        ai_feedback_es:
          "Claro y profesional. Pruebe añadir 'May I see your passport?' para el flujo completo.",
        ai_score_total: 78,
        level: "A1",
      },
      {
        prompt_index: 3,
        scenario_es:
          "El aire acondicionado del cuarto no funciona. Discúlpese y ofrezca enviar mantenimiento.",
        transcript_en:
          "I am sorry for that. I will send maintenance to your room right away. If it is not fixed, we move you to another room.",
        ai_feedback_es:
          "Bien resuelto. Use 'we'll move you' (contracción) para sonar más natural.",
        ai_score_total: 76,
        level: "B1",
      },
    ],
    completed_at: iso(14),
  },
  {
    id: "demo-002",
    name: "Juan Carlos Peña",
    hotel_role: "bellboy",
    current_level: "A2",
    shift: "afternoon",
    listening_score: 65,
    speaking_score: 52,
    combined_score: 57,
    last_active_days_ago: 1,
    streak: 7,
    practice_completion_pct: 68,
    strengths: ["Números y direcciones", "Frases de cortesía básicas"],
    areas_to_improve: ["Cláusulas condicionales", "Escucha con acentos"],
    transcripts: [
      {
        prompt_index: 0,
        scenario_es: "Huésped llega con dos maletas. Ofrezca ayuda.",
        transcript_en: "Yes, I help with bags. Room number please?",
        ai_feedback_es:
          "Comunicación efectiva. Pruebe 'Of course, sir — let me take those for you.'",
        ai_score_total: 64,
        level: "A1",
      },
    ],
    completed_at: iso(21),
  },
  {
    id: "demo-003",
    name: "Sofía Ramírez",
    hotel_role: "restaurant",
    current_level: "B2",
    shift: "night",
    listening_score: 91,
    speaking_score: 88,
    combined_score: 89,
    last_active_days_ago: 0,
    streak: 28,
    practice_completion_pct: 100,
    strengths: ["Recomendaciones de platillos", "Manejo de alergias", "Registro formal"],
    areas_to_improve: ["Vocabulario enológico específico"],
    transcripts: [
      {
        prompt_index: 5,
        scenario_es: "Huésped VIP con restricciones veganas. Recomiende y ofrezca bebidas.",
        transcript_en:
          "Of course — our kitchen handles this beautifully. For a main I'd recommend the roasted cauliflower steak with tahini, naturally vegan. May I suggest a natural wine to pair?",
        ai_feedback_es: "Respuesta excelente. Nivel B2 consolidado.",
        ai_score_total: 94,
        level: "B2",
      },
    ],
    completed_at: iso(9),
  },
  {
    id: "demo-004",
    name: "Roberto Vázquez",
    hotel_role: "frontdesk",
    current_level: "A2",
    shift: "night",
    listening_score: 58,
    speaking_score: 48,
    combined_score: 52,
    last_active_days_ago: 4,
    streak: 0,
    practice_completion_pct: 42,
    strengths: ["Saludos", "Horarios"],
    areas_to_improve: ["Resolución de quejas", "Vocabulario OTA"],
    transcripts: [],
    completed_at: iso(18),
  },
  {
    id: "demo-005",
    name: "Guadalupe Torres",
    hotel_role: "restaurant",
    current_level: "A2",
    shift: "morning",
    listening_score: 62,
    speaking_score: 55,
    combined_score: 58,
    last_active_days_ago: 2,
    streak: 5,
    practice_completion_pct: 74,
    strengths: ["Toma de órdenes", "Recomendar ensaladas"],
    areas_to_improve: ["Manejo de alergias (vocabulario técnico)"],
    transcripts: [],
    completed_at: iso(12),
  },
  {
    id: "demo-006",
    name: "Alejandro Méndez",
    hotel_role: "bellboy",
    current_level: "B1",
    shift: "morning",
    listening_score: 76,
    speaking_score: 71,
    combined_score: 73,
    last_active_days_ago: 1,
    streak: 11,
    practice_completion_pct: 81,
    strengths: ["Proactividad con huéspedes VIP", "Coordinación con valet"],
    areas_to_improve: ["Explicación de procedimientos complejos"],
    transcripts: [],
    completed_at: iso(10),
  },
  {
    id: "demo-007",
    name: "Fernanda Jiménez",
    hotel_role: "frontdesk",
    current_level: "B1",
    shift: "afternoon",
    listening_score: 79,
    speaking_score: 68,
    combined_score: 72,
    last_active_days_ago: 0,
    streak: 21,
    practice_completion_pct: 89,
    strengths: ["Explicación de tarifas", "Empatía en quejas"],
    areas_to_improve: ["Third-party bookings", "Contracciones"],
    transcripts: [],
    completed_at: iso(7),
  },
  {
    id: "demo-008",
    name: "Diego Hernández",
    hotel_role: "bellboy",
    current_level: "A1",
    shift: "night",
    listening_score: 42,
    speaking_score: 38,
    combined_score: 40,
    last_active_days_ago: 6,
    streak: 0,
    practice_completion_pct: 24,
    strengths: ["Intención de comunicarse"],
    areas_to_improve: ["Vocabulario base", "Números en inglés"],
    transcripts: [],
    completed_at: iso(22),
  },
  {
    id: "demo-009",
    name: "Paulina Morales",
    hotel_role: "restaurant",
    current_level: "B1",
    shift: "afternoon",
    listening_score: 73,
    speaking_score: 69,
    combined_score: 71,
    last_active_days_ago: 1,
    streak: 9,
    practice_completion_pct: 76,
    strengths: ["Split de cuentas", "Recomendaciones"],
    areas_to_improve: ["Quejas agresivas"],
    transcripts: [],
    completed_at: iso(11),
  },
  {
    id: "demo-010",
    name: "Héctor Ríos",
    hotel_role: "frontdesk",
    current_level: "A1",
    shift: "night",
    listening_score: 38,
    speaking_score: 32,
    combined_score: 34,
    last_active_days_ago: 9,
    streak: 0,
    practice_completion_pct: 12,
    strengths: ["Saludo básico"],
    areas_to_improve: ["Todo lo anterior — recomendación: módulo completo 3 meses"],
    transcripts: [],
    completed_at: iso(25),
  },
  {
    id: "demo-011",
    name: "Laura Castillo",
    hotel_role: "restaurant",
    current_level: "B2",
    shift: "night",
    listening_score: 88,
    speaking_score: 84,
    combined_score: 86,
    last_active_days_ago: 0,
    streak: 32,
    practice_completion_pct: 98,
    strengths: ["Maridajes", "Explicaciones culinarias extensas"],
    areas_to_improve: ["Ya en nivel objetivo — listo para mentoría interna"],
    transcripts: [],
    completed_at: iso(5),
  },
  {
    id: "demo-012",
    name: "Omar Salazar",
    hotel_role: "bellboy",
    current_level: "A2",
    shift: "afternoon",
    listening_score: 61,
    speaking_score: 54,
    combined_score: 57,
    last_active_days_ago: 3,
    streak: 6,
    practice_completion_pct: 62,
    strengths: ["Luggage vocabulary"],
    areas_to_improve: ["Instrucciones largas"],
    transcripts: [],
    completed_at: iso(15),
  },
];
