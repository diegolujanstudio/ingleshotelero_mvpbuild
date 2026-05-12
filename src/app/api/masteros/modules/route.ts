import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const ModuleEnum = z.enum(["bellboy", "frontdesk", "restaurant"]);
const LevelEnum = z.enum(["A1", "A2", "B1", "B2"]);
const SkillEnum = z.enum(["listening", "speaking", "vocabulary"]);
const TypeEnum = z.enum(["exam", "drill", "assessment"]);

const ContentItemInsert = z.object({
  id: z.string().uuid().optional(),
  module: ModuleEnum,
  level: LevelEnum,
  skill: SkillEnum,
  item_type: TypeEnum,
  audio_text: z.string().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  options: z.unknown().nullable().optional(),
  scenario_es: z.string().nullable().optional(),
  expected_keywords: z.array(z.string()).nullable().optional(),
  model_response: z.string().nullable().optional(),
  model_response_audio_url: z.string().nullable().optional(),
  word: z.string().nullable().optional(),
  word_audio_url: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  usage_count: z.number().int().nonnegative().optional(),
});

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

/** GET /api/masteros/modules — list all content_items (super_admin only). */
export async function GET() {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ items: [], demo: true });
  }
  const { data, error } = await sb
    .from("content_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

/** POST /api/masteros/modules — create a new item. */
export async function POST(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = ContentItemInsert.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ ok: true, demo: true, item: parsed.data });
  }

  const { data, error } = await sb
    .from("content_items")
    .insert(parsed.data as never)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: data });
}
