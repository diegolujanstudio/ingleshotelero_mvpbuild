import { NextResponse } from "next/server";

/**
 * POST /api/whatsapp/incoming
 *
 * Twilio WhatsApp inbound webhook. Real in Phase 5 when env vars are set;
 * Phase 1-4 just log + echo a TwiML ack so Twilio stops retrying.
 *
 * Expected form-encoded body from Twilio:
 *   From: whatsapp:+52..., Body: "1", MediaUrl0: "..." (voice note), ...
 *
 * Full conversation state machine (idle → listening → speaking → review)
 * and daily-drill dispatcher live in a later milestone. For now this endpoint
 * is infrastructure: Twilio can point at it and it'll always 200.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const from = form?.get("From")?.toString() ?? "unknown";
  const body = form?.get("Body")?.toString() ?? "";
  const numMedia = Number(form?.get("NumMedia") ?? 0);

  console.log("[whatsapp.incoming]", {
    from,
    body: body.slice(0, 120),
    numMedia,
    ts: new Date().toISOString(),
  });

  // TwiML acknowledgment. Real session routing arrives with full Phase 5.
  const reply =
    numMedia > 0
      ? "¡Recibimos su audio! Lo estamos evaluando y le respondemos en un momento."
      : body.trim()
        ? "¡Gracias! Su respuesta fue registrada. Mañana le enviamos su siguiente ejercicio."
        : "Hola, soy su asistente de Inglés Hotelero. Responda cualquier mensaje para empezar su evaluación diaria.";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(
    reply,
  )}</Message></Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { "content-type": "text/xml; charset=utf-8" },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
