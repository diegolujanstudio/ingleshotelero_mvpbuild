import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { CEFRLevel } from "@/lib/supabase/types";

/**
 * POST /api/recordings (multipart/form-data)
 *
 * Fields:
 *   - session_id (string)
 *   - prompt_index (number)
 *   - level_tag ("A1"|"A2"|"B1"|"B2")
 *   - duration_seconds (number)
 *   - audio (Blob)
 *
 * Stores audio in Supabase Storage (`recordings/` bucket) and creates a
 * speaking_recordings row with scoring_status='pending'. Returns the row id.
 *
 * In local-only mode (no Supabase), returns a mock id and no-op.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const session_id = String(form.get("session_id") ?? "");
  const prompt_index = Number(form.get("prompt_index") ?? 0);
  const level_tag = String(form.get("level_tag") ?? "A1") as CEFRLevel;
  const duration_seconds = Number(form.get("duration_seconds") ?? 0);
  const audio = form.get("audio") as File | null;

  if (!session_id || !audio) {
    return NextResponse.json({ error: "missing session_id or audio" }, { status: 400 });
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({
      id: `local-${session_id}-${prompt_index}`,
      mode: "local-only",
      scoring_status: "pending",
    });
  }

  try {
    const supabase = createServiceClient();
    const key = `${session_id}/${prompt_index}-${Date.now()}.webm`;
    const arrayBuf = await audio.arrayBuffer();

    const { error: upErr } = await supabase.storage
      .from("recordings")
      .upload(key, arrayBuf, {
        contentType: audio.type || "audio/webm",
        upsert: true,
      });

    if (upErr) throw upErr;

    const { data: row, error: dbErr } = await supabase
      .from("speaking_recordings")
      .upsert(
        {
          session_id,
          prompt_index,
          audio_url: key,
          audio_duration_seconds: duration_seconds,
          level_tag,
          scoring_status: "pending",
          scoring_attempts: 0,
        },
        { onConflict: "session_id,prompt_index" },
      )
      .select("id")
      .single();

    if (dbErr || !row) throw dbErr ?? new Error("row missing");

    return NextResponse.json({
      id: row.id,
      mode: "persisted",
      scoring_status: "pending",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "upload failed" },
      { status: 500 },
    );
  }
}
