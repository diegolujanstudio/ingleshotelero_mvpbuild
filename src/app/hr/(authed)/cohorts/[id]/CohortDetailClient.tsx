"use client";

import * as React from "react";
import { Search, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LevelChip } from "@/components/hr/LevelChip";
import { COHORTS } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { HREmployeeView } from "@/lib/hr/demo-bridge";
import type { HRCohortDetail } from "@/lib/hr/data";

interface Props {
  cohort: HRCohortDetail;
  candidates: HREmployeeView[];
}

export function CohortDetailClient({ cohort, candidates }: Props) {
  type Member = HRCohortDetail["members"][number];
  const [members, setMembers] = React.useState<Member[]>(cohort.members);
  const [pool, setPool] = React.useState(candidates);
  const [search, setSearch] = React.useState("");
  const [pending, setPending] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return pool.slice(0, 25);
    const q = search.toLowerCase();
    return pool.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 25);
  }, [pool, search]);

  async function addMember(e: HREmployeeView) {
    setPending(e.id);
    try {
      const res = await fetch(`/api/hr/cohorts/${cohort.id}/members`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ employee_id: e.id }),
      });
      if (!res.ok) return;
      setMembers((prev) => [
        ...prev,
        {
          id: `temp-${e.id}`,
          employee_id: e.id,
          employee_name: e.name,
          employee_role: e.hotel_role,
          employee_level: e.current_level,
          enrollment_date: new Date().toISOString().slice(0, 10),
          status: "active",
          completion_pct: 0,
        },
      ]);
      setPool((prev) => prev.filter((p) => p.id !== e.id));
    } finally {
      setPending(null);
    }
  }

  async function removeMember(memberId: string, employeeId: string) {
    setPending(memberId);
    try {
      const res = await fetch(
        `/api/hr/cohorts/${cohort.id}/members?employee_id=${employeeId}`,
        { method: "DELETE" },
      );
      if (!res.ok) return;
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      const back = candidates.find((c) => c.id === employeeId);
      if (back) setPool((prev) => [back, ...prev]);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-t-h2 font-medium text-espresso">
            {COHORTS.detail.membersTitle}
          </h2>
          <p className="caps">{members.length} en cohorte</p>
        </div>
        {members.length === 0 ? (
          <p className="font-sans text-t-body text-espresso-muted">
            {COHORTS.detail.none}
          </p>
        ) : (
          <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-t-body font-medium text-espresso">
                    {m.employee_name}
                  </p>
                  <p className="caps">
                    {ROLES[m.employee_role].label_es} · {m.completion_pct}% avance
                  </p>
                </div>
                <LevelChip level={m.employee_level} />
                <button
                  type="button"
                  disabled={pending === m.id}
                  onClick={() => removeMember(m.id, m.employee_id)}
                  className="rounded-sm p-1 text-espresso-muted hover:bg-ivory-soft hover:text-error disabled:opacity-50"
                  aria-label={COHORTS.detail.removeMember}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside>
        <h2 className="mb-3 font-serif text-t-h2 font-medium text-espresso">
          {COHORTS.detail.addMember}
        </h2>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-espresso-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={COHORTS.detail.addMemberSearch}
            className="h-10 w-full rounded-md border border-hair bg-white pl-9 pr-4 font-sans text-t-body text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none"
          />
        </div>
        <ul className="max-h-[400px] divide-y divide-hair overflow-y-auto rounded-md border border-hair bg-white">
          {filtered.length === 0 ? (
            <li className="px-4 py-3">
              <p className="font-sans text-t-caption text-espresso-muted">
                Sin candidatos disponibles.
              </p>
            </li>
          ) : (
            filtered.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-t-body text-espresso">{e.name}</p>
                  <p className="caps">{ROLES[e.hotel_role].label_es}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => addMember(e)}
                  disabled={pending === e.id}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </li>
            ))
          )}
        </ul>
      </aside>
    </div>
  );
}
