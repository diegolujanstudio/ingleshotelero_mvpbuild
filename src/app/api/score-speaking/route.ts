import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/client-or-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { captureException } from "@/lib/server/sentry";
import { claimPending, scoreOne, runScoringOnce } from "@/lib/server/scoring";
import { mockScore } from "@/lib/scoring";

export const runtime = "nodejs";

const persistedSchema = z
  .object({
    recording_id: z.string().uuid().optional(),
  })
  .optional();

// Demo-mode passthrough body (preserves the v0 client contract).
const demoSchema = z.object({
  scenario_es: z.string().min(1).max(500),
  expected_keywords: z.array(z.string().max(40)).max(20),
  model_response_en: z.string().max(500).optional(),
  level_tag: z.enum(["A1", "A2", "B1", "B2"]),
  module: z.enum(["bellboy", "frontdesk", "restaurant"]),
  audio_data_url: z.string().optional().nullable(),
  session_id: z.string().optional(),
  prompt_index: z.number().int().min(0).max(20).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit("score-speaking", ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "retry-after": "60" } },
    );
  }

  // Body parse — tolerate empty body (claim batch) and rich body (single).
  let raw: unknown = {};
  try {
    raw = await req.json();
  } catch {
    raw = {};
  }

  // Persisted mode: scoring worker invocation (recording_id or empty body).
  if (isSupabaseConfigured()) {
    const parsed = persistedSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_input", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    try {
      if (parsed.data?.recording_id) {
        const out = await scoreOne(parsed.data.recording_id);
        return NextResponse.json({ mode: "persisted", scored: [out] });
      }
      const out = await claimPending(10);
      return NextResponse.json({ mode: "persisted", scored: out });
    } catch (err) {
      captureException(err, { route: "POST /api/score-speaking", data: {} });
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
  }

  // Demo mode: client passes scenario + audio_data_url and we return a
  // score for it. This preserves the existing client contract end-to-end
  // without Supabase.
  const parsed = demoSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let audioBlob: Blob | null = null;
  if (parsed.data.audio_data_url) {
    try {
      const res = await fetch(parsed.data.audio_data_url);
      audioBlob = await res.blob();
    } catch {
      audioBlob = null;
    }
  }

  const input = {
    scenario_es: parsed.data.scenario_es,
    expected_keywords: parsed.data.expected_keywords,
    model_response_en: parsed.data.model_response_en ?? "",
    level_tag: parsed.data.level_tag,
    module: parsed.data.module,
    audio_blob: audioBlob,
  };

  // If both AI keys are present (developer testing without Supabase), run
  // the real path. Otherwise mock.
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  try {
    const result =
      hasOpenAI && hasAnthropic ? await runScoringOnce(input) : mockScore(input);
    return NextResponse.json(result);
  } catch (err) {
    captureException(err, { route: "POST /api/score-speaking (demo)", data: {} });
    return NextResponse.json(mockScore(input));
  }
}
