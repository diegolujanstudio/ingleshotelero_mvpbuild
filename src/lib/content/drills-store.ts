import "server-only";
import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { DRILLS, type Drill, type Role } from "@/content/practice-drills";
import { log } from "@/lib/server/log";

/**
 * Content store — makes the Master OS modules editor actually drive the
 * product.
 *
 * BEFORE: the practice loop read drills only from the static
 * `src/content/practice-drills.ts` file. `/masteros/modules` wrote to the
 * `content_items` table, which NOTHING in the product read. Editing a
 * module changed nothing for employees — a CRUD screen over an orphan
 * table.
 *
 * NOW: the product reads drills through here. We prefer DB rows
 * (`content_items` where item_type='drill'); if there are none for a
 * role — or a row is malformed — we fall back to the static file. So:
 *   • the product can NEVER break (static is the guaranteed floor),
 *   • once `content_items` is seeded, editing a row in Master OS
 *     genuinely changes what employees practice.
 *
 * Storage shape: each drill is ONE `content_items` row. The full,
 * nested Drill object is stored verbatim in the `options` jsonb column
 * (authoritative for the product). Flat columns (audio_text,
 * model_response, scenario_es, topic=Drill.id) are mirrored so the
 * existing modules list UI shows something readable.
 */

const ROLES: Role[] = ["bellboy", "frontdesk", "restaurant"];

/** Structural guard — a DB row's `options` must be a real Drill or we skip it. */
function isDrill(v: unknown): v is Drill {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  const l = d.listening as Record<string, unknown> | undefined;
  const r = d.reinforce as Record<string, unknown> | undefined;
  return (
    typeof d.id === "string" &&
    typeof d.level === "string" &&
    !!l &&
    typeof l.audio_text === "string" &&
    Array.isArray(l.options) &&
    !!r &&
    typeof r.model_en === "string" &&
    Array.isArray(d.vocabulary)
  );
}

async function loadFromDb(role: Role): Promise<Drill[] | null> {
  const svc = createServiceClient();
  if (!svc) return null; // demo / no Supabase → caller uses static
  try {
    const { data, error } = await svc
      .from("content_items")
      .select("options, topic, created_at")
      .eq("module", role)
      .eq("item_type", "drill")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (error) {
      log.warn({ role, err: error.message }, "drills_store.db_error");
      return null;
    }
    if (!data || data.length === 0) return null;
    const drills: Drill[] = [];
    for (const row of data as Array<{ options: unknown }>) {
      if (isDrill(row.options)) drills.push(row.options);
    }
    return drills.length > 0 ? drills : null;
  } catch (e) {
    log.warn({ role, err: String(e) }, "drills_store.threw");
    return null;
  }
}

/**
 * All drills for a role. DB-first; static file is the guaranteed
 * fallback. Memoized per request so picker + page don't double-query.
 */
export const getDrillsForRole = cache(
  async (role: Role): Promise<Drill[]> => {
    if (!ROLES.includes(role)) return [];
    const fromDb = await loadFromDb(role);
    return fromDb ?? DRILLS[role] ?? [];
  },
);

/** Resolve one drill by its stable id (e.g. "b-001"), DB-first. */
export async function getDrillById(
  role: Role,
  id: string,
): Promise<Drill | null> {
  const pool = await getDrillsForRole(role);
  return pool.find((d) => d.id === id) ?? null;
}
