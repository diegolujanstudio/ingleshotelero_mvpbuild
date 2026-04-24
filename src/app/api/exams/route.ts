import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { RoleModule } from "@/lib/supabase/types";

/**
 * POST /api/exams
 * Create a new exam session tied to a property slug + employee identity.
 * Returns `{ id }`. Client redirects to `/exam/[id]/diagnostic`.
 *
 * Falls back to a "mock" success when Supabase isn't configured so the
 * entry form still works end-to-end in demos.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    property_slug?: string;
    name?: string;
    email?: string;
    phone?: string;
    module?: RoleModule;
    shift?: "morning" | "afternoon" | "night";
    client_session_id?: string;
  };

  if (!body.property_slug || !body.name || !body.module) {
    return NextResponse.json(
      { error: "Missing required fields: property_slug, name, module" },
      { status: 400 },
    );
  }

  // No Supabase → return the client-generated id so the flow continues locally.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({
      id: body.client_session_id ?? crypto.randomUUID(),
      mode: "local-only",
    });
  }

  try {
    const supabase = createServiceClient();

    // Resolve property by slug.
    const { data: property, error: propErr } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", body.property_slug)
      .maybeSingle();

    if (propErr || !property) {
      // Unknown slug → still allow demo flow to continue.
      return NextResponse.json({
        id: body.client_session_id ?? crypto.randomUUID(),
        mode: "local-only",
      });
    }

    // Create or reuse employee by (property_id, email or name).
    const { data: employee } = await supabase
      .from("employees")
      .insert({
        property_id: property.id,
        name: body.name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        hotel_role: body.module,
        shift: body.shift ?? null,
        whatsapp_opted_in: Boolean(body.phone),
      })
      .select("id")
      .single();

    if (!employee) {
      return NextResponse.json({
        id: body.client_session_id ?? crypto.randomUUID(),
        mode: "local-only",
      });
    }

    // Create exam session.
    const { data: session, error: sessErr } = await supabase
      .from("exam_sessions")
      .insert({
        employee_id: employee.id,
        module: body.module,
        exam_type: "placement",
        status: "in_progress",
        current_step: "diagnostic",
      })
      .select("id")
      .single();

    if (sessErr || !session) {
      return NextResponse.json({
        id: body.client_session_id ?? crypto.randomUUID(),
        mode: "local-only",
      });
    }

    return NextResponse.json({ id: session.id, mode: "persisted" });
  } catch {
    return NextResponse.json({
      id: body.client_session_id ?? crypto.randomUUID(),
      mode: "local-only",
    });
  }
}
