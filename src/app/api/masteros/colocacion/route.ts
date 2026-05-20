import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { setPageContent } from "@/lib/server/page-content";
import { logAudit } from "@/lib/server/audit";
import { COLOCACION_COPY_KEY } from "@/content/colocacion";

export const dynamic = "force-dynamic";

const CopySchema = z.object({
  eyebrow: z.string().max(200),
  headline_before: z.string().max(200),
  headline_em: z.string().max(80),
  headline_after: z.string().max(200),
  intro: z.string().max(2000),
  submit_label: z.string().max(80),
  reassurance: z.string().max(200),
  thankyou_title: z.string().max(200),
  thankyou_body: z.string().max(2000),
});

/** POST /api/masteros/colocacion — save the live page copy (super_admin). */
export async function POST(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = CopySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const res = await setPageContent(COLOCACION_COPY_KEY, parsed.data, user.id);
  if (!res.ok)
    return NextResponse.json({ error: res.error ?? "save_failed" }, { status: 500 });
  await logAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "page.update",
    entity: "page",
    entityId: "colocacion",
  });
  return NextResponse.json({ ok: true });
}
