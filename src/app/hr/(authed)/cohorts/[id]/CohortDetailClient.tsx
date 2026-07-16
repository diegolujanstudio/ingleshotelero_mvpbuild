"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Plus, Pencil, Archive, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MetricCard } from "@/components/masteros/MetricCard";
import { LevelChip } from "@/components/hr/LevelChip";
import { EditDrawer } from "@/components/hr/EditDrawer";
import { COHORTS } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import type { HREmployeeView } from "@/lib/hr/demo-bridge";
import type { HRCohortDetail } from "@/lib/hr/data";
import type { CohortProgress } from "@/lib/hr/cohort-progress";

interface Props {
  cohort: HRCohortDetail;
  candidates: HREmployeeView[];
  progress: CohortProgress;
}

export function CohortDetailClient({ cohort, candidates, progress }: Props) {
  const router = useRouter();
  type Member = HRCohortDetail["members"][number];
  const [members, setMembers] = React.useState<Member[]>(cohort.members);
  const [pool, setPool] = React.useState(candidates);
  const [search, setSearch] = React.useState("");
  const [pending, setPending] = React.useState<string | null>(null);

  // Merge the persisted member rows with the freshly computed progress —
  // real cohorts get live completion/exam/last-practice; demo cohorts (whose
  // progress computation soft-fails to []) fall back to the member's own
  // stored completion_pct so the UI still reads sensibly.
  const mergedMembers = React.useMemo(
    () =>
      members.map((m) => {
        const p = progress.members.find((pm) => pm.employee_id === m.employee_id);
        return {
          ...m,
          completion_pct: p ? p.completion_pct : m.completion_pct,
          exam_completed: p?.exam_completed ?? false,
          last_practice_date: p?.last_practice_date ?? null,
        };
      }),
    [members, progress.members],
  );

  const avgPct = mergedMembers.length
    ? Math.round(mergedMembers.reduce((sum, m) => sum + m.completion_pct, 0) / mergedMembers.length)
    : 0;
  const onTrackCount = mergedMembers.filter(
    (m) => m.completion_pct >= cohort.completion_target_pct,
  ).length;

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

  // ─── Edit ───────────────────────────────────────────────────────────
  const [editOpen, setEditOpen] = React.useState(false);
  const [editSaving, setEditSaving] = React.useState(false);
  const [editError, setEditError] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState({
    name: cohort.name,
    module: cohort.module,
    target_level: cohort.target_level,
    start_date: cohort.start_date ?? "",
    end_date: cohort.end_date ?? "",
    completion_target_pct: cohort.completion_target_pct,
  });

  async function saveEdit() {
    setEditSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/hr/cohorts/${cohort.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: editDraft.name,
          module: editDraft.module,
          target_level: editDraft.target_level,
          start_date: editDraft.start_date || null,
          end_date: editDraft.end_date || null,
          completion_target_pct: editDraft.completion_target_pct,
        }),
      });
      if (!res.ok) {
        setEditError("No se pudo guardar. Revisa los campos.");
        return;
      }
      setEditOpen(false);
      router.refresh();
    } catch {
      setEditError("No se pudo guardar. Revisa los campos.");
    } finally {
      setEditSaving(false);
    }
  }

  // ─── Archive ────────────────────────────────────────────────────────
  const [archiving, setArchiving] = React.useState(false);

  async function archive() {
    if (!window.confirm(COHORTS.archiveConfirm)) return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/hr/cohorts/${cohort.id}`, { method: "DELETE" });
      if (!res.ok) {
        setArchiving(false);
        return;
      }
      router.push("/hr/cohorts");
    } catch {
      setArchiving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => setEditOpen(true)}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          {COHORTS.actions.edit}
        </Button>
        <Button variant="ghost" onClick={archive} disabled={archiving}>
          <Archive className="h-3.5 w-3.5" aria-hidden />
          {archiving ? COHORTS.actions.archiving : COHORTS.actions.archive}
        </Button>
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        <MetricCard eyebrow={COHORTS.detail.metrics.avg} value={`${avgPct}%`} />
        <MetricCard
          eyebrow={COHORTS.detail.metrics.onTrack}
          value={`${onTrackCount}/${mergedMembers.length}`}
        />
        <MetricCard eyebrow={COHORTS.detail.metrics.members} value={mergedMembers.length} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-t-h2 font-medium text-espresso">
              {COHORTS.detail.membersTitle}
            </h2>
            <p className="caps">{mergedMembers.length} en cohorte</p>
          </div>
          {mergedMembers.length === 0 ? (
            <p className="font-sans text-t-body text-espresso-muted">
              {COHORTS.detail.none}
            </p>
          ) : (
            <ul className="divide-y divide-hair rounded-md border border-hair bg-white">
              {mergedMembers.map((m) => (
                <li key={m.id} className="flex flex-col gap-2.5 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-t-body font-medium text-espresso">
                        {m.employee_name}
                      </p>
                      <p className="caps">{ROLES[m.employee_role].label_es}</p>
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
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-pill bg-ivory-deep">
                      <div
                        className="h-1.5 rounded-pill bg-ink"
                        style={{ width: `${m.completion_pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-muted">
                      {m.completion_pct}%
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {m.exam_completed && (
                      <span className="inline-flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-success">
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                        {COHORTS.detail.examDone}
                      </span>
                    )}
                    <span className="caps">
                      {COHORTS.detail.lastPractice}:{" "}
                      {m.last_practice_date ?? COHORTS.detail.noPractice}
                    </span>
                  </div>
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

      <EditDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={COHORTS.modal.titleEdit}
        eyebrow="EDITAR COHORTE"
        footer={
          <>
            {editError && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
                {editError}
              </span>
            )}
            <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={editSaving}>
              {COHORTS.modal.cancel}
            </Button>
            <Button variant="primary" onClick={saveEdit} disabled={editSaving || !editDraft.name.trim()}>
              {editSaving ? COHORTS.modal.saving : COHORTS.modal.save}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={COHORTS.modal.name}
            value={editDraft.name}
            onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
            placeholder={COHORTS.modal.namePlaceholder}
          />
          <FieldRow>
            <Field label={COHORTS.modal.module}>
              <select
                value={editDraft.module}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, module: e.target.value as RoleModule })
                }
                className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
              >
                {(Object.keys(ROLES) as RoleModule[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLES[r].label_es}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={COHORTS.modal.targetLevel}>
              <select
                value={editDraft.target_level}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, target_level: e.target.value as CEFRLevel })
                }
                className="h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
              >
                {(["A1", "A2", "B1", "B2"] as CEFRLevel[]).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </FieldRow>
          <FieldRow>
            <Input
              label={COHORTS.modal.startDate}
              type="date"
              value={editDraft.start_date}
              onChange={(e) => setEditDraft({ ...editDraft, start_date: e.target.value })}
            />
            <Input
              label={COHORTS.modal.endDate}
              type="date"
              value={editDraft.end_date}
              onChange={(e) => setEditDraft({ ...editDraft, end_date: e.target.value })}
            />
          </FieldRow>
          <Input
            label={COHORTS.modal.completionTarget}
            type="number"
            min={0}
            max={100}
            value={String(editDraft.completion_target_pct)}
            onChange={(e) =>
              setEditDraft({
                ...editDraft,
                completion_target_pct: Number(e.target.value) || 0,
              })
            }
          />
        </div>
      </EditDrawer>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="caps mb-2 block">{label}</label>
      {children}
    </div>
  );
}
