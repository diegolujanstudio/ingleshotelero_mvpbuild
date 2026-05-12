import { NextResponse } from "next/server";
import { z } from "zod";
import { finalizeListening } from "@/lib/server/exam";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { captureException } from "@/lib/server/sentry";

export const runtime = "nodejs";

const idSchema = z.string().uuid();

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const idCheck = idSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "local-only" });
  }

  try {
    const result = await finalizeListening(params.id);
    return NextResponse.json({ ok: true, mode: "persisted", ...result });
  } catch (err) {
    captureException(err, {
      route: "POST /api/exams/:id/finalize-listening",
      data: { id: params.id },
    });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
