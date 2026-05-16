"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

type Status = "todo" | "doing" | "done";
type Priority = "low" | "med" | "high";
interface Task {
  id: string;
  title: string;
  detail: string | null;
  status: Status;
  priority: Priority;
  due_date: string | null;
  created_at: string;
}

const STATUS: { id: Status; label: string }[] = [
  { id: "todo", label: "Pendiente" },
  { id: "doing", label: "En curso" },
  { id: "done", label: "Hecho" },
];
const PRIO: { id: Priority; label: string }[] = [
  { id: "high", label: "Alta" },
  { id: "med", label: "Media" },
  { id: "low", label: "Baja" },
];

export function TasksClient() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<Priority>("med");
  const [due, setDue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/masteros/tasks")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/masteros/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        detail: detail.trim() || null,
        priority,
        due_date: due || null,
      }),
    }).catch(() => null);
    if (res?.ok) {
      const d = await res.json();
      if (d.item) setItems((p) => [d.item, ...p]);
      setTitle("");
      setDetail("");
      setDue("");
      setPriority("med");
    }
    setSaving(false);
  }

  async function patch(id: string, p: Partial<Task>) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...p } : t)));
    await fetch(`/api/masteros/tasks/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(p),
    }).catch(() => undefined);
  }

  async function remove(id: string) {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    setItems((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/masteros/tasks/${id}`, { method: "DELETE" }).catch(
      () => undefined,
    );
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Operaciones
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Tareas del <em>proyecto</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        Pendientes generales del startup. Solo el equipo interno.
      </p>

      <form
        onSubmit={add}
        className="mt-6 rounded-md border border-hair bg-white p-4 sm:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nueva tarea…"
            className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="h-10 rounded-md border border-hair bg-white px-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-soft"
          >
            {PRIO.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="h-10 rounded-md border border-hair bg-white px-2 font-mono text-[0.6875rem] text-espresso-soft"
          />
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white hover:bg-ink-deep disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Añadir
          </button>
        </div>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Detalle (opcional)…"
          rows={2}
          className="mt-3 w-full resize-y rounded-md border border-hair bg-white p-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
        />
      </form>

      <div className="mt-8 space-y-8">
        {STATUS.map((col) => {
          const rows = items.filter((t) => t.status === col.id);
          return (
            <div key={col.id}>
              <p className="caps mb-3">
                {col.label} · {rows.length}
              </p>
              {loading ? (
                <p className="font-sans text-t-caption text-espresso-muted">
                  Cargando…
                </p>
              ) : rows.length === 0 ? (
                <p className="font-sans text-t-caption text-espresso-muted">
                  Nada aquí.
                </p>
              ) : (
                <ul className="space-y-2">
                  {rows.map((t) => (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-start gap-3 rounded-md border border-hair bg-white p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            t.status === "done"
                              ? "font-sans text-t-body text-espresso-muted line-through"
                              : "font-sans text-t-body text-espresso"
                          }
                        >
                          {t.title}
                        </p>
                        {t.detail && (
                          <p className="mt-1 whitespace-pre-wrap font-sans text-t-caption text-espresso-soft">
                            {t.detail}
                          </p>
                        )}
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
                          <span
                            className={
                              t.priority === "high"
                                ? "text-error"
                                : t.priority === "low"
                                  ? "text-espresso-muted"
                                  : "text-warn"
                            }
                          >
                            {PRIO.find((p) => p.id === t.priority)?.label}
                          </span>
                          {t.due_date && <span>vence {t.due_date}</span>}
                        </div>
                      </div>
                      <select
                        value={t.status}
                        onChange={(e) =>
                          patch(t.id, { status: e.target.value as Status })
                        }
                        className="h-8 rounded-md border border-hair bg-white px-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft"
                      >
                        {STATUS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => remove(t.id)}
                        aria-label="Eliminar"
                        className="rounded-md border border-error/30 p-2 text-error hover:bg-error/5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
