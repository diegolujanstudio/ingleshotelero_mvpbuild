import "server-only";
import { createServiceClient } from "@/lib/supabase/client-or-service";

/**
 * Append-only audit log writer. Best-effort: NEVER throws and never
 * blocks the mutation it records (a missing audit row must not break a
 * module save). Reads are super_admin-only via RLS; writes go through
 * the service role here.
 */
export async function logAudit(entry: {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string; // 'module.update' | 'lead.delete' | 'team.role' ...
  entity: string; // 'module' | 'lead' | 'team' | 'task' | 'resource'
  entityId?: string | null;
  detail?: Record<string, unknown>;
}): Promise<void> {
  try {
    const sb = createServiceClient();
    if (!sb) return;
    await (sb as unknown as {
      from: (t: string) => {
        insert: (r: Record<string, unknown>) => Promise<unknown>;
      };
    })
      .from("ops_audit")
      .insert({
        actor_id: entry.actorId ?? null,
        actor_email: entry.actorEmail ?? null,
        action: entry.action,
        entity: entry.entity,
        entity_id: entry.entityId ?? null,
        detail: entry.detail ?? {},
      });
  } catch {
    // swallow — audit must never break the operation
  }
}
