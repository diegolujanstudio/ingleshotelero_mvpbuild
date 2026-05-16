import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const TaskPatch = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  detail: z.string().max(8000).nullable().optional(),
  status: z.enum(["todo", "doing", "done"]).optional(),
  priority: z.enum(["low", "med", "high"]).optional(),
  due_date: z.string().max(20).nullable().optional(),
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
  const parsed = TaskPatch.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });
  const { error } = await (sb as any)
    .from("ops_tasks")
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
    .from("ops_tasks")
    .delete()
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
