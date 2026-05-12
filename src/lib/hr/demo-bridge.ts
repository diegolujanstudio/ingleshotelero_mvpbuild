import "server-only";

/**
 * HR demo-data bridge.
 *
 * The HR pages are Server Components that prefer real Supabase data. When
 * Supabase isn't configured (DEMO_MODE) or the property has no data yet,
 * these helpers synthesize a populated dashboard from
 * `src/lib/demo-data.ts` so prospect pitches always look alive.
 *
 * Real DB rows always win — demo data is only the fallback. Every helper
 * here is pure (no side effects) so callers can safely cache the result.
 */

import type { CEFRLevel, RoleModule, Shift } from "@/lib/supabase/types";
import { DEMO_EMPLOYEES, type DemoEmployee } from "@/lib/demo-data";
import type { EmployeeStatus } from "@/content/hr";

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Should the page show demo data? True when (a) demo mode is on AND
 * (b) the caller has no real rows to show.
 */
export function shouldUseDemoFallback(realCount: number): boolean {
  if (!isDemoMode()) return false;
  return realCount === 0;
}

export interface HREmployeeView {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  hotel_role: RoleModule;
  current_level: CEFRLevel | null;
  department: string | null;
  shift: Shift | null;
  whatsapp_opted_in: boolean;
  is_active: boolean;
  status: EmployeeStatus;
  source: "self_registered" | "hr_invited" | "csv_imported";
  created_at: string;
  updated_at: string;
  // derived metrics
  combined_score: number;
  listening_score: number;
  speaking_score: number;
  last_active_days_ago: number;
  streak: number;
  practice_completion_pct: number;
  exam_completed_at: string | null;
  is_demo: boolean;
}

function deriveStatus(emp: { is_active: boolean }): EmployeeStatus {
  return emp.is_active ? "active" : "inactive";
}

export function getDemoEmployees(): HREmployeeView[] {
  return DEMO_EMPLOYEES.map((d: DemoEmployee) => ({
    id: d.id,
    name: d.name,
    email: `${d.name.toLowerCase().replace(/\s+/g, ".")}@hotel-demo.mx`,
    phone: "+52 998 000 0000",
    hotel_role: d.hotel_role,
    current_level: d.current_level,
    department: d.hotel_role === "frontdesk" ? "Recepción" : d.hotel_role === "bellboy" ? "Servicios al huésped" : "Alimentos y bebidas",
    shift: d.shift,
    whatsapp_opted_in: true,
    is_active: true,
    status: "active" as EmployeeStatus,
    source: "csv_imported" as const,
    created_at: d.completed_at,
    updated_at: d.completed_at,
    combined_score: d.combined_score,
    listening_score: d.listening_score,
    speaking_score: d.speaking_score,
    last_active_days_ago: d.last_active_days_ago,
    streak: d.streak,
    practice_completion_pct: d.practice_completion_pct,
    exam_completed_at: d.completed_at,
    is_demo: true,
  }));
}

export interface HRCohortView {
  id: string;
  name: string;
  module: RoleModule;
  target_level: CEFRLevel;
  start_date: string | null;
  end_date: string | null;
  completion_target_pct: number;
  status: "draft" | "active" | "completed" | "archived";
  member_count: number;
  avg_completion_pct: number;
  is_demo: boolean;
}

export function getDemoCohorts(): HRCohortView[] {
  return [
    {
      id: "demo-cohort-1",
      name: "Recepción · Q2 2026",
      module: "frontdesk",
      target_level: "B1",
      start_date: new Date(Date.now() - 45 * 86400000).toISOString().slice(0, 10),
      end_date: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
      completion_target_pct: 80,
      status: "active",
      member_count: 6,
      avg_completion_pct: 62,
      is_demo: true,
    },
    {
      id: "demo-cohort-2",
      name: "Restaurante · Verano",
      module: "restaurant",
      target_level: "B2",
      start_date: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
      end_date: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      completion_target_pct: 75,
      status: "active",
      member_count: 4,
      avg_completion_pct: 78,
      is_demo: true,
    },
    {
      id: "demo-cohort-3",
      name: "Botones · Onboarding",
      module: "bellboy",
      target_level: "A2",
      start_date: new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
      end_date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
      completion_target_pct: 70,
      status: "completed",
      member_count: 5,
      avg_completion_pct: 84,
      is_demo: true,
    },
  ];
}

export interface HRTeamMember {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "org_admin" | "property_admin" | "viewer";
  is_active: boolean;
  last_login_at: string | null;
  invite_sent_at: string | null;
  is_demo: boolean;
}

export function getDemoTeam(): HRTeamMember[] {
  return [
    {
      id: "demo-team-1",
      email: "ana.martinez@hotel-demo.mx",
      name: "Ana Martínez",
      role: "property_admin",
      is_active: true,
      last_login_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      invite_sent_at: null,
      is_demo: true,
    },
    {
      id: "demo-team-2",
      email: "javier.ruiz@hotel-demo.mx",
      name: "Javier Ruiz",
      role: "viewer",
      is_active: true,
      last_login_at: new Date(Date.now() - 36 * 3600000).toISOString(),
      invite_sent_at: null,
      is_demo: true,
    },
    {
      id: "demo-team-3",
      email: "carmen.lopez@hotel-demo.mx",
      name: "Carmen López",
      role: "viewer",
      is_active: false,
      last_login_at: null,
      invite_sent_at: new Date(Date.now() - 30 * 3600000).toISOString(),
      is_demo: true,
    },
  ];
}

export interface HROrgInfo {
  id: string;
  name: string;
  type: "chain" | "independent";
  subscription_tier: "pilot" | "starter" | "professional" | "enterprise";
  subscription_status: "active" | "past_due" | "canceled" | "archived";
  billing_email: string | null;
}

export interface HRPropertyInfo {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  country: string;
  room_count: number | null;
  timezone: string;
}

export function getDemoOrg(): HROrgInfo {
  return {
    id: "demo-org",
    name: "Hotel Demostración Cancún",
    type: "independent",
    subscription_tier: "professional",
    subscription_status: "active",
    billing_email: "facturacion@hotel-demo.mx",
  };
}

export function getDemoProperty(): HRPropertyInfo {
  return {
    id: "demo-property",
    name: "Hotel Demostración Cancún",
    slug: "demo-cancun",
    city: "Cancún",
    state: "Quintana Roo",
    country: "MX",
    room_count: 142,
    timezone: "America/Cancun",
  };
}
