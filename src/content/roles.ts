/**
 * Role module metadata — single source of truth for the three placement
 * modules (bellboy, front desk, restaurant/bar). Display strings live here
 * so the rest of the app imports Spanish copy from one place.
 */
import type { RoleModule } from "@/lib/supabase/types";

export interface RoleInfo {
  id: RoleModule;
  label_es: string;
  plural_es: string;
  scenario_caption: string;
  short_description_es: string;
  primary_skills: ["listening", "speaking"];
}

export const ROLES: Record<RoleModule, RoleInfo> = {
  bellboy: {
    id: "bellboy",
    label_es: "Botones",
    plural_es: "Botones",
    scenario_caption: "guest arriving with luggage",
    short_description_es:
      "Recibe y acompaña al huésped. Maneja equipaje, indicaciones y servicios a la habitación.",
    primary_skills: ["listening", "speaking"],
  },
  frontdesk: {
    id: "frontdesk",
    label_es: "Recepción",
    plural_es: "Recepción",
    scenario_caption: "resolving a check-in complaint",
    short_description_es:
      "Gestiona reservaciones, check-in y check-out, quejas y explicación de tarifas y políticas.",
    primary_skills: ["listening", "speaking"],
  },
  restaurant: {
    id: "restaurant",
    label_es: "Restaurante / Bar",
    plural_es: "Restaurante y Bar",
    scenario_caption: "taking an order at the table",
    short_description_es:
      "Toma órdenes, recomienda platillos, maneja alergias y resuelve quejas en sala.",
    primary_skills: ["listening", "speaking"],
  },
  housekeeping: {
    id: "housekeeping",
    label_es: "Ama de llaves",
    plural_es: "Ama de llaves",
    scenario_caption: "entering an occupied room",
    short_description_es:
      "Entra a habitaciones ocupadas, atiende peticiones de amenidades y resuelve hallazgos sin incomodar al huésped.",
    primary_skills: ["listening", "speaking"],
  },
  concierge: {
    id: "concierge",
    label_es: "Concierge",
    plural_es: "Concierge",
    scenario_caption: "booking a restaurant for a guest",
    short_description_es:
      "Reserva, recomienda y resuelve fuera del hotel: restaurantes, transporte, tours y urgencias.",
    primary_skills: ["listening", "speaking"],
  },
  spa: {
    id: "spa",
    label_es: "Spa y bienestar",
    plural_es: "Spa y bienestar",
    scenario_caption: "intake before a treatment",
    short_description_es:
      "Recibe, pregunta por contraindicaciones y acompaña el tratamiento cuidando la dignidad del huésped.",
    primary_skills: ["listening", "speaking"],
  },
  security: {
    id: "security",
    label_es: "Seguridad",
    plural_es: "Seguridad",
    scenario_caption: "verifying a guest at the door",
    short_description_es:
      "Da instrucciones claras bajo presión, verifica identidad y baja la tensión sin acusar.",
    primary_skills: ["listening", "speaking"],
  },
  maintenance: {
    id: "maintenance",
    label_es: "Mantenimiento",
    plural_es: "Mantenimiento",
    scenario_caption: "explaining a repair time",
    short_description_es:
      "Entra a habitaciones ocupadas, explica la falla y da un tiempo real de reparación.",
    primary_skills: ["listening", "speaking"],
  },
};

/**
 * THE canonical list. Everything derives from it — Zod validators, pickers,
 * dropdowns, seeding, and the DB CHECK constraints.
 *
 * Before this, the role list was hard-coded in ~20 places (a dozen
 * `z.enum([...])` validators, several `VALID_ROLES` arrays, the Master OS
 * module picker and seven SQL CHECK constraints), so adding a department
 * meant editing all of them and hoping none were missed. Adding one is now
 * a single entry in ROLES above plus a migration.
 */
export const ROLE_IDS = Object.keys(ROLES) as RoleModule[];

export function roleLabel(id: RoleModule): string {
  return ROLES[id]?.label_es ?? id;
}

export function isRoleModule(v: unknown): v is RoleModule {
  return typeof v === "string" && v in ROLES;
}

/**
 * Zod needs a non-empty tuple. ROLE_IDS is guaranteed non-empty because
 * ROLES is a non-empty object literal, so the cast is safe.
 */
export const ROLE_ENUM_VALUES = ROLE_IDS as [RoleModule, ...RoleModule[]];
