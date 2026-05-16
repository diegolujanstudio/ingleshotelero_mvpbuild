import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";

export const dynamic = "force-dynamic";

const TaskInsert = z.object({
  title: z.string().trim().min(1).max(300),
  detail: z.string().max(8000).nullable().optional(),
  status: z.enum(["todo", "doing", "done"]).optional(),
  priority: z.enum(["low", "med", "high"]).optional(),
  due_date: z.string().max(20).nullable().optional(),
});

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

/** GET /api/masteros/tasks — all startup/project tasks (super_admin). */
export async function GET() {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ items: [], demo: true });
  const { data, error } = await sb
    .from("ops_tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

/** POST /api/masteros/tasks — create a task. */
export async function POST(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = TaskInsert.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });
  const { data, error } = await sb
    .from("ops_tasks")
    .insert({ ...parsed.data, created_by: user.id } as never)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
