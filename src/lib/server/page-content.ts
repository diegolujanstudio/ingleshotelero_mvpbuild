import "server-only";
import { createServiceClient } from "@/lib/supabase/client-or-service";

/**
 * DB-backed editable page copy. Public pages read it (with code defaults
 * as the floor so the page never breaks); Master OS edits it via the
 * service role. Lets the team change the live colocación page without a
 * deploy.
 */
export async function getPageContent<T extends object>(
  key: string,
  defaults: T,
): Promise<T> {
  try {
    const sb = createServiceClient();
    if (!sb) return defaults;
    const { data } = await sb
      .from("page_content")
      .select("content")
      .eq("key", key)
      .maybeSingle();
    const stored = (data as { content?: Record<string, unknown> } | null)
      ?.content;
    if (!stored || typeof stored !== "object") return defaults;
    // Merge so newly-added default keys still appear even if the stored
    // row predates them.
    return { ...defaults, ...(stored as Partial<T>) } as T;
  } catch {
    return defaults;
  }
}

export async function setPageContent(
  key: string,
  content: Record<string, unknown>,
  userId?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const sb = createServiceClient();
  if (!sb) return { ok: false, error: "no_supabase" };
  const { error } = await (sb as any)
    .from("page_content")
    .upsert(
      { key, content, updated_by: userId ?? null },
      { onConflict: "key" },
    );
  if (error) return { ok: false, error: String(error) };
  return { ok: true };
}
