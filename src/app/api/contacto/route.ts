import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * POST /api/contacto — lead intake.
 *
 * Three-tier graceful degradation so a lead is never silently dropped:
 *   1. Insert into Supabase `leads` table (when SUPABASE_SERVICE_ROLE_KEY is set).
 *   2. Forward to founder via Resend email (when RESEND_API_KEY is set).
 *   3. Log to server console (always).
 *
 * Returns { data: { ref } } where `ref` is a short identifier the user
 * can quote when following up. Spam (honeypot tripped, missing required
 * fields) returns 400 with a vague message.
 */

const ContactSchema = z.object({
  nombre: z.string().min(2, "Nombre demasiado corto").max(120),
  cargo: z.string().min(1, "Indique un cargo"),
  hotel: z.string().min(2, "Hotel requerido").max(160),
  ciudad: z.string().min(2, "Ciudad requerida").max(120),
  correo: z.string().email("Correo inválido").max(160),
  whatsapp: z
    .string()
    .max(40)
    .optional()
    .or(z.literal("")),
  departamento: z.string().min(1),
  tamano: z.string().min(1),
  mensaje: z.string().max(2000).optional().or(z.literal("")),
  acepta: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === "on" || v === "true" || v === true, {
      message: "Debe aceptar el aviso de privacidad",
    }),
  nombre_alterno: z.string().max(0).optional().or(z.literal("")), // honeypot — must be empty
});

type ContactInput = z.infer<typeof ContactSchema>;

const FOUNDER_EMAIL = process.env.RESEND_FROM_EMAIL ?? "hola@ingleshotelero.com";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "bad_request", message: "JSON inválido" } },
      { status: 400 },
    );
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    // Honeypot trips silently — we 200-OK so the bot doesn't learn.
    if ((raw as { nombre_alterno?: unknown })?.nombre_alterno) {
      return NextResponse.json({ data: { ref: makeRef() } });
    }
    const first = parsed.error.errors[0];
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: first?.message ?? "Datos del formulario incompletos",
        },
      },
      { status: 400 },
    );
  }

  // Honeypot — silently accept and drop.
  if (parsed.data.nombre_alterno) {
    return NextResponse.json({ data: { ref: makeRef() } });
  }

  const ref = makeRef();
  const lead = parsed.data;

  // Tier 1 — Supabase
  const supaResult = await tryInsertSupabase(lead, ref);

  // Tier 2 — Resend email (best-effort, even if Supabase succeeded; it's the founder's notification path)
  const emailResult = await tryNotifyByEmail(lead, ref);

  // Tier 3 — server log, always
  console.log("[contacto:lead]", {
    ref,
    name: lead.nombre,
    hotel: lead.hotel,
    ciudad: lead.ciudad,
    correo: lead.correo,
    departamento: lead.departamento,
    tamano: lead.tamano,
    supabase: supaResult,
    email: emailResult,
  });

  return NextResponse.json({ data: { ref } });
}

/* ──────────────────────────── Helpers ──────────────────────────── */

function makeRef(): string {
  // Compact random ref: timestamp base36 + 4-char random.
  const t = Date.now().toString(36).slice(-5).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IH-${t}${r}`;
}

async function tryInsertSupabase(
  lead: ContactInput,
  ref: string,
): Promise<"ok" | "skipped" | "error"> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return "skipped";

  try {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ref,
        source: "contacto",
        nombre: lead.nombre,
        cargo: lead.cargo,
        hotel: lead.hotel,
        ciudad: lead.ciudad,
        correo: lead.correo,
        whatsapp: lead.whatsapp || null,
        departamento: lead.departamento,
        tamano: lead.tamano,
        mensaje: lead.mensaje || null,
      }),
    });
    if (!res.ok) {
      console.error("[contacto:supabase]", res.status, await res.text());
      return "error";
    }
    return "ok";
  } catch (err) {
    console.error("[contacto:supabase]", err);
    return "error";
  }
}

async function tryNotifyByEmail(
  lead: ContactInput,
  ref: string,
): Promise<"ok" | "skipped" | "error"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "skipped";

  const subject = `[IH] ${lead.hotel} · ${lead.ciudad} · ${lead.departamento} · ${ref}`;
  const text = [
    `Nuevo lead — folio ${ref}`,
    "",
    `Nombre:        ${lead.nombre}`,
    `Cargo:         ${lead.cargo}`,
    `Hotel:         ${lead.hotel}`,
    `Ciudad:        ${lead.ciudad}`,
    `Correo:        ${lead.correo}`,
    `WhatsApp:      ${lead.whatsapp || "—"}`,
    `Departamento:  ${lead.departamento}`,
    `Tamaño:        ${lead.tamano}`,
    "",
    `Mensaje:`,
    lead.mensaje || "(sin mensaje)",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Inglés Hotelero <${FOUNDER_EMAIL}>`,
        to: [FOUNDER_EMAIL],
        reply_to: lead.correo,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[contacto:resend]", res.status, await res.text());
      return "error";
    }
    return "ok";
  } catch (err) {
    console.error("[contacto:resend]", err);
    return "error";
  }
}
