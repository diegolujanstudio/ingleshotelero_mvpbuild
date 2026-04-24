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
};

export const ROLE_IDS: RoleModule[] = ["bellboy", "frontdesk", "restaurant"];
