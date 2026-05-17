/* eslint-disable no-console */
/**
 * Seed Master OS → Recursos with the canonical access + links + infra
 * notes so the team has one place with everything. Idempotent: keyed on
 * title (existing rows are updated, not duplicated).
 *
 * Run: set -a; source .env.local; set +a; \
 *   EMP_LINK="https://.../i/xxx" node scripts/seed-ops-resources.mjs
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Missing SUPABASE creds.");
  process.exit(1);
}
const sb = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const EMP_LINK =
  process.env.EMP_LINK ||
  "Genera uno en HR → Empleado → Enlace personal, o corre scripts/provision-test-employee.ts";

const RESOURCES = [
  {
    title: "🔑 Accesos — equipo y pruebas",
    kind: "note",
    url: "https://ingleshotelero.com/admin",
    body: [
      "MASTER OS (equipo interno) — https://ingleshotelero.com/admin",
      "  Diego (co-fundador):  diego@diegolujanstudio.com  /  IngHotel2026!",
      "  Victor (co-fundador): victor.lujan@gmail.com      /  IngHotel2026!",
      "",
      "HR — GERENTE DE HOTEL (cuenta de PRUEBA, vista de cliente real, sin Master OS)",
      "  https://ingleshotelero.netlify.app/hr/login",
      "  diego+hotel@diegolujanstudio.com  /  TestHotel2026!",
      "",
      "EMPLEADO (cuenta de PRUEBA, sin contraseña — un toque):",
      `  ${EMP_LINK}`,
    ].join("\n"),
  },
  {
    title: "🔗 Links de producción",
    kind: "link",
    url: "https://ingleshotelero.netlify.app",
    body: [
      "PWA producto (empleados):  https://ingleshotelero.netlify.app",
      "Landing marketing:         https://ingleshotelero.com",
      "Master OS (equipo):        https://ingleshotelero.com/admin",
      "HR dashboard (hoteles):    https://ingleshotelero.netlify.app/hr/login",
      "Progreso del aprendiz:     https://ingleshotelero.netlify.app/practice/progress",
    ].join("\n"),
  },
  {
    title: "🗄️ Dónde está todo (infraestructura)",
    kind: "doc",
    url: null,
    body: [
      "Base de datos / auth / audio: Supabase proyecto ngllenlyhykeauknpctq",
      "  Tablas: leads, employees, content_items (módulos editables),",
      "  drill_history, ops_tasks, ops_resources, ops_audit, hr_users.",
      "  Audio: Supabase Storage bucket 'audio'.",
      "",
      "Código:",
      "  Producto:  github diegolujanstudio/ingleshotelero_mvpbuild",
      "             → Netlify proyecto 'ingleshotelero'",
      "  Landing:   github diegolujanstudio/ingleshotelero-landing",
      "             → Netlify proyecto 'cheerful-brioche-4dfe7f' (ingleshotelero.com)",
      "",
      "Claves PENDIENTES (las pones tú; ya están cableadas, son plug-and-play):",
      "  ANTHROPIC_API_KEY → activa el borrador de drills con IA real",
      "  OPENAI_API_KEY    → activa la transcripción real del speaking (Whisper)",
      "  STRIPE_SECRET_KEY → cifras de ingresos exactas (hoy es estimado por plan)",
    ].join("\n"),
  },
];

let ins = 0,
  upd = 0;
for (const r of RESOURCES) {
  const { data: existing } = await sb
    .from("ops_resources")
    .select("id")
    .eq("title", r.title)
    .maybeSingle();
  if (existing?.id) {
    const { error } = await sb
      .from("ops_resources")
      .update({ body: r.body, url: r.url, kind: r.kind })
      .eq("id", existing.id);
    if (error) throw error;
    upd++;
    console.log(`[upd] ${r.title}`);
  } else {
    const { error } = await sb.from("ops_resources").insert(r);
    if (error) throw error;
    ins++;
    console.log(`[ins] ${r.title}`);
  }
}
console.log(`\nDone. inserted=${ins} updated=${upd}`);
