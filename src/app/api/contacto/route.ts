import "server-only";
import { NextResponse } from "next/server";

/**
 * /api/contacto — DEPRECATED 2026-05-11.
 *
 * The /contacto page now submits as a static HTML form intercepted by
 * Netlify Forms. Netlify then fires an outgoing webhook to
 * `/api/netlify/forms-webhook`, which persists to the `leads` table and
 * notifies victor.lujan@gmail.com + diego@diegolujanstudio.com via Resend.
 *
 * This route returns 410 Gone so any cached client / bookmark / curl
 * script gets a clear, immediate signal rather than a silent JSON 200.
 *
 * If you need a non-Netlify fallback path in the future (e.g. a CLI
 * intake), wire it through src/lib/server/leads.ts → upsertLead() instead
 * of resurrecting this handler.
 */

export const dynamic = "force-dynamic";

const BODY = {
  error: {
    code: "gone",
    message:
      "Este endpoint fue retirado. El formulario de contacto ahora se envía vía Netlify Forms; revisa /contacto.",
  },
} as const;

export async function POST() {
  return NextResponse.json(BODY, { status: 410 });
}

export async function GET() {
  return NextResponse.json(BODY, { status: 410 });
}
