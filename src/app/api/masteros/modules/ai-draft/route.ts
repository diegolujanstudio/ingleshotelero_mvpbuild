import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { draftDrill } from "@/lib/server/ai-draft";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  role: z.enum(["bellboy", "frontdesk", "restaurant"]),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  scenario: z.string().trim().min(3).max(600),
});

/** POST /api/masteros/modules/ai-draft — Claude drafts a full drill. */
export async function POST(req: Request) {
  const user = await requireSuperAdminAPI();
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const out = await draftDrill(parsed.data);
    return NextResponse.json(out); // { drill, source: "ai" | "scaffold" }
  } catch {
    return NextResponse.json({ error: "draft_failed" }, { status: 500 });
  }
}
