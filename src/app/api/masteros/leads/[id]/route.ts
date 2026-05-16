import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import { updateLeadStatus, deleteLead } from "@/lib/server/leads";

export const dynamic = "force-dynamic";

const StatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
]);

const PatchBody = z.object({
  status: StatusEnum.optional(),
  notes: z.string().max(8000).nullable().optional(),
});

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

/**
 * PATCH /api/masteros/leads/[id]
 *
 * Updates status and/or notes. Super-admin only. When `status === "contacted"`
 * the underlying helper stamps `contacted_at` and `contacted_by`.
 *
 * In demo mode (no Supabase or no migration applied) returns ok+demo so the
 * UI can optimistically reflect the change without a 500.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  if (!params.id || params.id.length > 64) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = PatchBody.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });

  // We need at least a status if we're going to call updateLeadStatus.
  // For notes-only edits we patch directly.
  try {
    if (parsed.data.status !== undefined) {
      const res = await updateLeadStatus(
        params.id,
        parsed.data.status,
        parsed.data.notes ?? undefined,
        user.id,
      );
      if (!res.ok) {
        return NextResponse.json(
          { error: res.error ?? "update_failed" },
          { status: 500 },
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Notes-only path.
    if (parsed.data.notes !== undefined) {
      const sbAny = sb as unknown as {
        from: (t: string) => {
          update: (p: Record<string, unknown>) => {
            eq: (c: string, v: string) => Promise<{ error: { message: string } | null }>;
          };
        };
      };
      const { error } = await sbAny
        .from("leads")
        .update({ notes: parsed.data.notes })
        .eq("id", params.id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Migration missing → degrade.
    return NextResponse.json({ ok: true, demo: true, _err: e instanceof Error ? e.message : "unknown" });
  }
}

/**
 * DELETE /api/masteros/leads/[id]
 *
 * Permanently removes a lead (spam / test cleanup). Super-admin only.
 * Demo mode (no Supabase) → ok+demo so the UI can drop the row anyway.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();
  if (!params.id || params.id.length > 64) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  const sb = createServiceClient();
  if (!sb) return NextResponse.json({ ok: true, demo: true });
  const res = await deleteLead(params.id);
  if (!res.ok) {
    return NextResponse.json(
      { error: res.error ?? "delete_failed" },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
