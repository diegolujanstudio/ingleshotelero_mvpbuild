import { NextResponse } from "next/server";
import { requireSuperAdminAPI } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import {
  demoMetrics,
  gatherMetrics,
  type MetricsPayload,
} from "@/lib/masteros/metrics";

export const dynamic = "force-dynamic";

const CACHE_MS = 60_000;
let cached: { at: number; payload: MetricsPayload } | null = null;

function notFound() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export async function GET() {
  const user = await requireSuperAdminAPI();
  if (!user) return notFound();

  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) {
    return NextResponse.json({ ...cached.payload, cached: true });
  }

  const sb = createServiceClient();
  let payload: MetricsPayload;
  let demo = false;
  if (!sb) {
    payload = demoMetrics();
    demo = true;
  } else {
    try {
      payload = await gatherMetrics(sb);
    } catch {
      payload = demoMetrics();
      demo = true;
    }
  }

  cached = { at: now, payload };
  return NextResponse.json({ ...payload, cached: false, demo });
}
