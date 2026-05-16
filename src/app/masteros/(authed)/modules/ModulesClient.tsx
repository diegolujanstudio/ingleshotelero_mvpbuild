"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Pencil, Power, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { DenseDataTable } from "@/components/masteros/DenseDataTable";
import { JsonEditor } from "@/components/masteros/JsonEditor";
import {
  DrillTemplateForm,
  toDrill,
  type Drill,
} from "./DrillTemplateForm";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, LevelBadge } from "@/components/ui/Badge";
import { MODULES } from "@/content/masteros";
import type { CEFRLevel, Database, RoleModule } from "@/lib/supabase/types";

type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];

type SkillFilter = "all" | "listening" | "speaking" | "vocabulary";
type ModuleFilter = "all" | RoleModule;
type LevelFilter = "all" | CEFRLevel;
type TypeFilter = "all" | "exam" | "drill" | "assessment";

interface Props {
  initial: ContentItem[];
  demo?: boolean;
}

export function ModulesClient({ initial, demo }: Props) {
  const [items, setItems] = useState<ContentItem[]>(initial);
  const [search, setSearch] = useState("");
  const [moduleF, setModuleF] = useState<ModuleFilter>("all");
  const [levelF, setLevelF] = useState<LevelFilter>("all");
  const [skillF, setSkillF] = useState<SkillFilter>("all");
  const [typeF, setTypeF] = useState<TypeFilter>("all");
  const [editing, setEditing] = useState<ContentItem | null>(null);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (moduleF !== "all" && it.module !== moduleF) return false;
      if (levelF !== "all" && it.level !== levelF) return false;
      if (skillF !== "all" && it.skill !== skillF) return false;
      if (typeF !== "all" && it.item_type !== typeF) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [
          it.audio_text,
          it.scenario_es,
          it.word,
          it.topic,
          it.model_response,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, moduleF, levelF, skillF, typeF]);

  function exportJson() {
    const rows = filtered;
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `modules-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function toggleActive(row: ContentItem) {
    const next = { ...row, is_active: !row.is_active };
    setItems((prev) => prev.map((x) => (x.id === row.id ? next : x)));
    await fetch(`/api/masteros/modules/${row.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_active: next.is_active }),
    }).catch(() => undefined);
  }

  async function duplicate(row: ContentItem) {
    const { id, created_at, usage_count, ...rest } = row;
    void id;
    void created_at;
    void usage_count;
    const res = await fetch("/api/masteros/modules", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...rest, usage_count: 0 }),
    });
    if (res.ok) {
      const json = (await res.json()) as { item?: ContentItem };
      if (json.item) setItems((prev) => [json.item!, ...prev]);
    }
  }

  async function remove(row: ContentItem) {
    if (!confirm(MODULES.delete.confirm)) return;
    setItems((prev) => prev.filter((x) => x.id !== row.id));
    await fetch(`/api/masteros/modules/${row.id}`, {
      method: "DELETE",
    }).catch(() => undefined);
  }

  function openNew() {
    setEditing({
      id: "" as unknown as string,
      module: "bellboy",
      level: "A1",
      skill: "listening",
      item_type: "drill",
      audio_text: null,
      audio_url: null,
      options: null,
      scenario_es: null,
      expected_keywords: null,
      model_response: null,
      model_response_audio_url: null,
      word: null,
      word_audio_url: null,
      topic: null,
      is_active: true,
      usage_count: 0,
      created_at: new Date().toISOString(),
    });
  }

  const columns = useMemo<ColumnDef<ContentItem>[]>(
    () => [
      {
        accessorKey: "module",
        header: MODULES.table.module,
        cell: ({ row }) => (
          <Badge tone="soft" className="capitalize">
            {row.original.module}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "level",
        header: MODULES.table.level,
        cell: ({ row }) => <LevelBadge level={row.original.level} />,
        enableSorting: true,
      },
      {
        accessorKey: "skill",
        header: MODULES.table.skill,
        cell: ({ row }) => (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft">
            {row.original.skill}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "item_type",
        header: MODULES.table.type,
        cell: ({ row }) => (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft">
            {row.original.item_type}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "preview",
        header: MODULES.table.preview,
        cell: ({ row }) => {
          const text =
            row.original.audio_text ??
            row.original.scenario_es ??
            row.original.word ??
            row.original.topic ??
            "—";
          return (
            <span className="line-clamp-1 text-espresso-soft">
              {String(text).slice(0, 90)}
            </span>
          );
        },
      },
      {
        accessorKey: "usage_count",
        header: MODULES.table.usage,
        cell: ({ row }) => (
          <span className="block text-right font-mono text-[0.75rem] tabular-nums text-espresso">
            {row.original.usage_count}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "created_at",
        header: MODULES.table.updated,
        cell: ({ row }) => (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
            {new Date(row.original.created_at).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "is_active",
        header: MODULES.table.active,
        cell: ({ row }) =>
          row.original.is_active ? (
            <Badge tone="success">Activo</Badge>
          ) : (
            <Badge tone="neutral">Inactivo</Badge>
          ),
      },
      {
        id: "actions",
        header: MODULES.table.actions,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <IconBtn
              label={MODULES.actions.edit}
              onClick={(e) => {
                e.stopPropagation();
                setEditing(row.original);
              }}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
            </IconBtn>
            <IconBtn
              label={MODULES.actions.toggleActive}
              onClick={(e) => {
                e.stopPropagation();
                void toggleActive(row.original);
              }}
            >
              <Power className="h-3.5 w-3.5" aria-hidden />
            </IconBtn>
            <IconBtn
              label={MODULES.actions.duplicate}
              onClick={(e) => {
                e.stopPropagation();
                void duplicate(row.original);
              }}
            >
              <Copy className="h-3.5 w-3.5" aria-hidden />
            </IconBtn>
            <IconBtn
              label={MODULES.actions.delete}
              onClick={(e) => {
                e.stopPropagation();
                void remove(row.original);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </IconBtn>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={MODULES.eyebrow}
        title={
          <>
            {MODULES.headline.before}
            <em>{MODULES.headline.em}</em>
            {MODULES.headline.after}
          </>
        }
        sub={MODULES.sub}
        actions={
          <>
            {demo && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
                Modo demo
              </span>
            )}
            <ButtonLink href="/masteros/modules/import" variant="ghost">
              {MODULES.actions.import}
            </ButtonLink>
            <Button variant="ghost" onClick={exportJson}>
              <Download className="h-3.5 w-3.5" aria-hidden />
              {MODULES.actions.export}
            </Button>
            <Button variant="primary" onClick={openNew}>
              {MODULES.actions.new}
            </Button>
          </>
        }
      />

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={MODULES.search}
            className="h-9 min-w-[240px] flex-1 rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none"
          />
        </div>

        <FilterRow
          label={MODULES.filters.module}
          value={moduleF}
          options={[
            { v: "all", l: MODULES.filters.all },
            { v: "bellboy", l: "bellboy" },
            { v: "frontdesk", l: "frontdesk" },
            { v: "restaurant", l: "restaurant" },
          ]}
          onChange={(v) => setModuleF(v as ModuleFilter)}
        />
        <FilterRow
          label={MODULES.filters.level}
          value={levelF}
          options={[
            { v: "all", l: MODULES.filters.all },
            { v: "A1", l: "A1" },
            { v: "A2", l: "A2" },
            { v: "B1", l: "B1" },
            { v: "B2", l: "B2" },
          ]}
          onChange={(v) => setLevelF(v as LevelFilter)}
        />
        <FilterRow
          label={MODULES.filters.skill}
          value={skillF}
          options={[
            { v: "all", l: MODULES.filters.all },
            { v: "listening", l: "listening" },
            { v: "speaking", l: "speaking" },
            { v: "vocabulary", l: "vocabulary" },
          ]}
          onChange={(v) => setSkillF(v as SkillFilter)}
        />
        <FilterRow
          label={MODULES.filters.type}
          value={typeF}
          options={[
            { v: "all", l: MODULES.filters.all },
            { v: "exam", l: "exam" },
            { v: "drill", l: "drill" },
            { v: "assessment", l: "assessment" },
          ]}
          onChange={(v) => setTypeF(v as TypeFilter)}
        />
      </div>

      <div className="mt-5">
        <DenseDataTable<ContentItem>
          data={filtered}
          columns={columns}
          emptyMessage={MODULES.empty}
          initialSorting={[{ id: "created_at", desc: true }]}
        />
      </div>

      {editing && (
        <EditDrawer
          initial={editing}
          isNew={editing.id === ""}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setItems((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists
                ? prev.map((x) => (x.id === saved.id ? saved : x))
                : [saved, ...prev];
            });
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-sm border border-transparent p-1.5 text-espresso-muted transition hover:border-hair hover:bg-ivory-soft hover:text-ink"
    >
      {children}
    </button>
  );
}

function FilterRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ v: string; l: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
        {label}
      </span>
      {options.map((o) => {
        const active = o.v === value;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={
              active
                ? "rounded-pill border border-ink bg-ink-tint px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-deep"
                : "rounded-pill border border-hair bg-white px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:border-espresso/30 hover:text-espresso"
            }
          >
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

function EditDrawer({
  initial,
  isNew,
  onClose,
  onSaved,
}: {
  initial: ContentItem;
  isNew: boolean;
  onClose: () => void;
  onSaved: (item: ContentItem) => void;
}) {
  // A drill is editable with the friendly template; anything else (or an
  // explicit opt-in) uses the raw JSON editor — nothing is ever lost.
  const isDrill = initial.item_type === "drill";
  const [mode, setMode] = useState<"form" | "json">(
    isDrill ? "form" : "json",
  );

  // ── Template (form) state ──
  const [moduleSel, setModuleSel] = useState<RoleModule>(
    (initial.module as RoleModule) ?? "frontdesk",
  );
  const [drill, setDrill] = useState<Drill>(() => toDrill(initial.options));

  // ── JSON state ──
  const original = useMemo(() => JSON.stringify(initial, null, 2), [initial]);
  const [text, setText] = useState<string>(original);
  const [parsed, setParsed] = useState<unknown>(initial);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const formValid =
    drill.id.trim().length > 0 &&
    drill.listening.audio_text.trim().length > 0 &&
    drill.reinforce.model_en.trim().length > 0 &&
    drill.listening.options.some((o) => o.correct);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      let payload: Record<string, unknown>;
      if (mode === "form") {
        if (!formValid) {
          setError(
            "Falta: ID, audio, frase modelo o marcar la opción correcta.",
          );
          return;
        }
        // Mirror the seed contract (scripts/seed-content-items.mjs):
        // the full Drill is authoritative in `options`; flat columns
        // mirror it for the table/preview.
        payload = {
          module: moduleSel,
          level: drill.level,
          skill: "listening",
          item_type: "drill",
          topic: drill.id.trim(),
          audio_text: drill.listening.audio_text,
          scenario_es: drill.listening.explanation_es || null,
          model_response: drill.reinforce.model_en,
          options: { ...drill, id: drill.id.trim() },
          is_active: initial.is_active ?? true,
        };
      } else {
        if (!parsed || typeof parsed !== "object") {
          setError("JSON inválido.");
          return;
        }
        payload = parsed as Record<string, unknown>;
      }

      const url = isNew
        ? "/api/masteros/modules"
        : `/api/masteros/modules/${initial.id}`;
      const method = isNew ? "POST" : "PATCH";
      const finalBody =
        isNew || mode === "form"
          ? payload
          : Object.fromEntries(
              Object.entries(payload).filter(
                ([k]) => k !== "id" && k !== "created_at",
              ),
            );
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(finalBody),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(typeof j.error === "string" ? j.error : "Error al guardar.");
        return;
      }
      const json = (await res.json()) as { item?: ContentItem };
      if (json.item) onSaved(json.item);
      else onSaved({ ...(initial as ContentItem) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex"
      onClick={onClose}
    >
      <div className="flex-1 bg-espresso/40" />
      <div
        className="flex h-full w-full max-w-2xl flex-col border-l border-hair bg-ivory shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-baseline justify-between border-b border-hair bg-ivory-soft px-5 py-3">
          <div>
            <p className="caps">{isNew ? "Nuevo" : "Editando"}</p>
            <h2 className="font-serif text-t-h3 font-medium text-espresso">
              {isNew ? MODULES.drawer.titleNew : MODULES.drawer.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {isDrill && (
              <div className="flex rounded-pill border border-hair bg-white p-0.5">
                {(["form", "json"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={
                      mode === m
                        ? "rounded-pill bg-ink px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white"
                        : "rounded-pill px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft"
                    }
                  >
                    {m === "form" ? "Plantilla" : "JSON"}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft hover:text-ink"
            >
              ✕
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          {mode === "form" ? (
            <div className="space-y-5">
              <div>
                <label className="caps mb-1.5 block">Módulo (rol)</label>
                <select
                  className="w-full rounded-md border border-hair bg-white px-3 py-2 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
                  value={moduleSel}
                  onChange={(e) =>
                    setModuleSel(e.target.value as RoleModule)
                  }
                >
                  {["bellboy", "frontdesk", "restaurant"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <DrillTemplateForm drill={drill} onChange={setDrill} />
            </div>
          ) : (
            <JsonEditor
              value={text}
              onChange={(v, p, e) => {
                setText(v);
                setParsed(p);
                setError(e);
              }}
              rows={28}
              ariaLabel="Editor JSON del item"
            />
          )}
          {error && (
            <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
              {error}
            </p>
          )}
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-hair bg-ivory-soft px-5 py-3">
          <Button variant="ghost" onClick={onClose}>
            {MODULES.drawer.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={save}
            disabled={saving || (mode === "form" && !formValid)}
          >
            {saving ? MODULES.drawer.saving : MODULES.drawer.save}
          </Button>
        </footer>
      </div>
    </div>
  );
}

