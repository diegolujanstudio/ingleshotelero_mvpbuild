import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const ModuleEnum = z.enum(["bellboy", "frontdesk", "restaurant"]);
const LevelEnum = z.enum(["A1", "A2", "B1", "B2"]);
const SkillEnum = z.enum(["listening", "speaking", "vocabulary"]);
const TypeEnum = z.enum(["exam", "drill", "assessment"]);

const ContentItemUpdate = z.object({
  module: ModuleEnum.optional(),
  level: LevelEnum.optional(),
  skill: SkillEnum.optional(),
  item_type: TypeEnum.optional(),
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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ item: null, demo: true });

  const { data, error } = await sb
    .from("content_items")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !data) return notFound();
  return NextResponse.json({ item: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = ContentItemUpdate.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ ok: true, demo: true });
  }
  const { data, error } = await sb
    .from("content_items")
    .update(parsed.data as never)
    .eq("id", params.id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });

  const { error } = await sb.from("content_items").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
