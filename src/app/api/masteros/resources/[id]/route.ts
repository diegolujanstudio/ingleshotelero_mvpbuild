import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const ResourcePatch = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  body: z.string().max(20000).nullable().optional(),
  url: z.string().max(2000).nullable().optional(),
  kind: z.enum(["note", "link", "doc"]).optional(),
});

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();
  if (!params.id || params.id.length > 64)
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = ResourcePatch.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });
  const { error } = await (sb as any)
    .from("ops_resources")
    .update(parsed.data)
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();
  if (!params.id || params.id.length > 64)
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });
  const { error } = await (sb as any)
    .from("ops_resources")
    .delete()
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
