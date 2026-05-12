import { requireHRUser } from "@/lib/hr/auth";
import { loadTeam } from "@/lib/hr/data";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { TEAM, COMMON } from "@/content/hr";
import { TeamClient } from "./TeamClient";
import { canInvite } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await requireHRUser();
  const members = await loadTeam(user);
  const isDemo = members.length > 0 && members[0].is_demo;
  // viewer cannot invite anyone
  const canInviteAny = canInvite(user.role, "viewer");

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={TEAM.eyebrow}
        title={
          <>
            {TEAM.headline.before}
            <em>{TEAM.headline.em}</em>
            {TEAM.headline.after}
          </>
        }
        sub={TEAM.sub}
        actions={
          isDemo && (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
              {COMMON.demoBadge}
            </span>
          )
        }
      />

      <div className="mt-6">
        <TeamClient initial={members} canInvite={canInviteAny} callerRole={user.role} />
      </div>
    </section>
  );
}
