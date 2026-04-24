import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { scoreSpeaking } from "@/lib/scoring";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

/**
 * POST /api/score-speaking
 *
 * Body:
 *   - session_id (string)
 *   - prompt_index (number)
 *   - scenario_es (string)
 *   - expected_keywords (string[])
 *   - model_response_en (string)
 *   - level_tag (CEFRLevel)
 *   - module (RoleModule)
 *   - audio_data_url? (base64 data URL — local-only mode)
 *
 * Returns: ScoringResult. Also writes back to speaking_recordings when
 * Supabase is configured so the HR dashboard can read it later.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    session_id?: string;
    prompt_index?: number;
    scenario_es?: string;
    expected_keywords?: string[];
    model_response_en?: string;
    level_tag?: CEFRLevel;
    module?: RoleModule;
    audio_data_url?: string | null;
  };

  if (
    !body.scenario_es ||
    !body.level_tag ||
    !body.module ||
    !Array.isArray(body.expected_keywords)
  ) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  // Attempt to recover the audio blob.
  let audioBlob: Blob | null = null;
  if (body.audio_data_url) {
    try {
      const res = await fetch(body.audio_data_url);
      audioBlob = await res.blob();
    } catch {
      audioBlob = null;
    }
  } else if (
    body.session_id &&
    typeof body.prompt_index === "number" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createServiceClient();
      const { data: rec } = await supabase
        .from("speaking_recordings")
        .select("audio_url")
        .eq("session_id", body.session_id)
        .eq("prompt_index", body.prompt_index)
        .maybeSingle();
      if (rec?.audio_url) {
        const { data: file } = await supabase.storage
          .from("recordings")
          .download(rec.audio_url);
        if (file) audioBlob = file;
      }
    } catch {
      audioBlob = null;
    }
  }

  const result = await scoreSpeaking({
    scenario_es: body.scenario_es,
    expected_keywords: body.expected_keywords,
    model_response_en: body.model_response_en ?? "",
    level_tag: body.level_tag,
    module: body.module,
    audio_blob: audioBlob,
  });

  // Write back to DB when persisted.
  if (
    body.session_id &&
    typeof body.prompt_index === "number" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createServiceClient();
      await supabase
        .from("speaking_recordings")
        .update({
          transcript: result.transcript,
          ai_score_intent: result.intent,
          ai_score_vocabulary: result.vocabulary,
          ai_score_fluency: result.fluency,
          ai_score_tone: result.tone,
          ai_score_total: result.total,
          ai_feedback_es: result.feedback_es,
          ai_model_response: result.model_response,
          ai_level_estimate: result.level_estimate,
          scoring_status: "complete",
          scored_at: new Date().toISOString(),
        })
        .eq("session_id", body.session_id)
        .eq("prompt_index", body.prompt_index);
    } catch {
      // keep going — client still gets the result in the response
    }
  }

  return NextResponse.json(result);
}
