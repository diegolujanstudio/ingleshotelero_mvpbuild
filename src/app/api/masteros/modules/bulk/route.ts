import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const ModuleEnum = z.enum(["bellboy", "frontdesk", "restaurant"]);
const LevelEnum = z.enum(["A1", "A2", "B1", "B2"]);
const SkillEnum = z.enum(["listening", "speaking", "vocabulary"]);
const TypeEnum = z.enum(["exam", "drill", "assessment"]);

const Item = z.object({
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

const Body = z.object({
  items: z.array(z.unknown()).min(1).max(2000),
  dryRun: z.boolean().optional(),
});

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

/**
 * POST /api/masteros/modules/bulk
 *
 * UPSERTs an array of content_items.
 *  - rows with `id` → update path
 *  - rows without `id` → insert path
 *
 * Per-row validation; invalid rows are reported back with their index but
 * don't abort the batch (we return both successes and failures).
 */
export async function POST(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const body = Body.safeParse(raw);
  if (!body.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: body.error.issues },
      { status: 422 },
    );
  }

  const valid: z.infer<typeof Item>[] = [];
  const invalid: Array<{ index: number; error: string }> = [];
  body.data.items.forEach((it, i) => {
    const r = Item.safeParse(it);
    if (r.success) valid.push(r.data);
    else invalid.push({ index: i, error: r.error.issues.map((x) => x.message).join("; ") });
  });

  const willInsert = valid.filter((v) => !v.id).length;
  const willUpdate = valid.length - willInsert;

  if (body.data.dryRun) {
    return NextResponse.json({
      dryRun: true,
      validCount: valid.length,
      invalidCount: invalid.length,
      willInsert,
      willUpdate,
      invalid,
    });
  }

  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({
      demo: true,
      inserted: willInsert,
      updated: willUpdate,
      failed: invalid.length,
      invalid,
    });
  }

  let inserted = 0;
  let updated = 0;
  const failed: Array<{ index: number; error: string }> = [...invalid];

  // Process in chunks of 100 to keep the round-trip reasonable.
  for (let i = 0; i < valid.length; i += 100) {
    const chunk = valid.slice(i, i + 100);

    // FETCH-MERGE (not defaultToNull:false, which still nulls omitted columns
    // to their DEFAULT on the ON CONFLICT DO UPDATE path and resets
    // is_active/usage_count). Bulk imports are mixed-shape — a vocabulary row
    // omits audio_url/options; a listening row omits word/model_response — so
    // we load each existing row and merge the incoming fields OVER it. Omitted
    // fields keep their current value; an explicit null still clears. This
    // preserves pre-generated audio_url / options / usage_count.
    const ids = chunk.map((c) => c.id).filter((x): x is string => Boolean(x));
    const existingById = new Map<string, Record<string, unknown>>();
    if (ids.length > 0) {
      const { data: existingRows, error: fetchErr } = await sb
        .from("content_items")
        .select("*")
        .in("id", ids);
      if (fetchErr) {
        chunk.forEach((_, j) => failed.push({ index: i + j, error: fetchErr.message }));
        continue;
      }
      for (const row of (existingRows ?? []) as Record<string, unknown>[]) {
        existingById.set(row.id as string, row);
      }
    }

    const merged = chunk.map((c) => {
      const prior = c.id ? existingById.get(c.id) : undefined;
      return prior ? { ...prior, ...c } : c;
    });

    const { error } = await sb
      .from("content_items")
      .upsert(merged as never, { onConflict: "id" });
    if (error) {
      // Mark the whole chunk as failed; could refine later.
      chunk.forEach((_, j) =>
        failed.push({ index: i + j, error: error.message }),
      );
    } else {
      chunk.forEach((c) => (c.id && existingById.has(c.id) ? updated++ : inserted++));
    }
  }

  return NextResponse.json({
    inserted,
    updated,
    failed: failed.length,
    invalid: failed,
  });
}
