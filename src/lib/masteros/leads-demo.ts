import "server-only";

import type { LeadRow } from "@/lib/server/leads";

/**
 * Inline placeholder leads used when:
 *   - Supabase is not configured (`createServiceClient()` returns null), or
 *   - migration 0006_leads has not been applied (the query throws).
 *
 * Deterministic dates spaced over the past two weeks so the dashboard always
 * looks populated in pitches.
 */
export function demoLeads(): LeadRow[] {
  const now = Date.now();
  const ago = (h: number) => new Date(now - h * 3600_000).toISOString();
  return [
    {
      id: "demo-lead-001",
      form_name: "pilot",
      name: "Mariana López",
      email: "mariana@granhotelcancun.com",
      phone: "+52 998 123 4567",
      company: "Gran Hotel Cancún",
      hotel_count: 1,
      city: "Cancún",
      role: "Directora de RH",
      message:
        "Buen día. Estamos evaluando un piloto para 24 colaboradores entre recepción y restaurante. ¿Podríamos agendar una llamada esta semana?",
      source_url: "https://ingleshotelero.com/contacto",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3)",
      ip_country: "MX",
      netlify_submission_id: "demo-submission-001",
      netlify_form_id: "pilot",
      metadata: { utm_source: "linkedin", utm_campaign: "abril-2026" },
      status: "new",
      notes: null,
      contacted_at: null,
      contacted_by: null,
      created_at: ago(2),
      updated_at: ago(2),
    },
    {
      id: "demo-lead-002",
      form_name: "pilot",
      name: "Roberto Castillo",
      email: "rcastillo@marinapacifico.mx",
      phone: "+52 322 555 9911",
      company: "Cadena Marina Pacífico",
      hotel_count: 3,
      city: "Puerto Vallarta",
      role: "VP Operaciones",
      message:
        "Operamos tres hoteles y queremos comparar Inglés Hotelero contra dos opciones que estamos evaluando. ¿Tienen referencias en cadenas medianas?",
      source_url: "https://ingleshotelero.com/precios",
      user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)",
      ip_country: "MX",
      netlify_submission_id: "demo-submission-002",
      netlify_form_id: "pilot",
      metadata: {},
      status: "contacted",
      notes:
        "Llamada agendada 13/05. Mandar deck de cadenas. Punto de contacto secundario: María (CFO).",
      contacted_at: ago(20),
      contacted_by: null,
      created_at: ago(26),
      updated_at: ago(20),
    },
    {
      id: "demo-lead-003",
      form_name: "pilot",
      name: "Carla Mendoza",
      email: "carla@boutiquesanmiguel.com",
      phone: null,
      company: "Boutique San Miguel",
      hotel_count: 1,
      city: "San Miguel de Allende",
      role: "Gerente General",
      message: "Quisiera más información sobre el examen de colocación.",
      source_url: "https://ingleshotelero.com",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      ip_country: "MX",
      netlify_submission_id: "demo-submission-003",
      netlify_form_id: "pilot",
      metadata: {},
      status: "qualified",
      notes: "Quiere arrancar piloto en junio con 14 colaboradores.",
      contacted_at: ago(72),
      contacted_by: null,
      created_at: ago(96),
      updated_at: ago(72),
    },
    {
      id: "demo-lead-004",
      form_name: "soporte",
      name: "Luis Vega",
      email: "luis.vega@hotelmaya.com",
      phone: null,
      company: "Hotel Maya",
      hotel_count: null,
      city: "Mérida",
      role: "Coordinador RH",
      message:
        "Un colaborador no puede ingresar al examen — dice que la página se queda cargando en el paso de listening.",
      source_url: "https://ingleshotelero.com/soporte",
      user_agent: "Mozilla/5.0 (Linux; Android 11; SM-A125F)",
      ip_country: "MX",
      netlify_submission_id: "demo-submission-004",
      netlify_form_id: "soporte",
      metadata: { topic: "examen" },
      status: "new",
      notes: null,
      contacted_at: null,
      contacted_by: null,
      created_at: ago(5),
      updated_at: ago(5),
    },
    {
      id: "demo-lead-005",
      form_name: "other",
      name: "Andrea Soto",
      email: "andrea@prensaviajera.mx",
      phone: null,
      company: "Prensa Viajera",
      hotel_count: null,
      city: "Ciudad de México",
      role: "Periodista",
      message:
        "Hola, escribo una nota sobre formación de personal en hospitalidad. ¿Podrían darme cinco minutos para una cita por correo?",
      source_url: "https://ingleshotelero.com/contacto",
      user_agent: "Mozilla/5.0",
      ip_country: "MX",
      netlify_submission_id: "demo-submission-005",
      netlify_form_id: "other",
      metadata: {},
      status: "new",
      notes: null,
      contacted_at: null,
      contacted_by: null,
      created_at: ago(48),
      updated_at: ago(48),
    },
  ];
}

export function demoCounts(rows: LeadRow[]) {
  const c = { all: 0, pilot: 0, soporte: 0, other: 0 };
  for (const r of rows) {
    c.all++;
    if (r.form_name === "pilot") c.pilot++;
    else if (r.form_name === "soporte") c.soporte++;
    else c.other++;
  }
  return c;
}
