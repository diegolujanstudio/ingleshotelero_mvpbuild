"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, ExternalLink } from "lucide-react";

type Kind = "note" | "link" | "doc";
interface Resource {
  id: string;
  title: string;
  body: string | null;
  url: string | null;
  kind: Kind;
  created_at: string;
}

const KIND: { id: Kind; label: string }[] = [
  { id: "note", label: "Nota" },
  { id: "link", label: "Enlace" },
  { id: "doc", label: "Documento" },
];

export function ResourcesClient() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("note");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/masteros/resources")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/masteros/resources", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        kind,
        url: url.trim() || null,
        body: body.trim() || null,
      }),
    }).catch(() => null);
    if (res?.ok) {
      const d = await res.json();
      if (d.item) setItems((p) => [d.item, ...p]);
      setTitle("");
      setUrl("");
      setBody("");
      setKind("note");
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!window.confirm("¿Eliminar este recurso?")) return;
    setItems((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/masteros/resources/${id}`, { method: "DELETE" }).catch(
      () => undefined,
    );
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-espresso-muted">
        Operaciones
      </p>
      <h1 className="mt-1 font-serif text-t-h2 font-medium text-espresso">
        Recursos del <em>equipo</em>
      </h1>
      <p className="mt-2 max-w-prose font-sans text-t-body text-espresso-soft">
        Notas, enlaces y documentos que el equipo necesita a mano.
      </p>

      <form
        onSubmit={add}
        className="mt-6 rounded-md border border-hair bg-white p-4 sm:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título…"
            className="h-10 rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
          />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
            className="h-10 rounded-md border border-hair bg-white px-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-espresso-soft"
          >
            {KIND.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
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
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (opcional)…"
          className="mt-3 h-10 w-full rounded-md border border-hair bg-white px-3 font-mono text-[0.75rem] text-espresso focus:border-ink focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Notas (opcional)…"
          rows={3}
          className="mt-3 w-full resize-y rounded-md border border-hair bg-white p-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
        />
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="font-sans text-t-caption text-espresso-muted">
            Cargando…
          </p>
        ) : items.length === 0 ? (
          <p className="font-sans text-t-caption text-espresso-muted">
            Aún no hay recursos.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-start gap-3 rounded-md border border-hair bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="caps text-ink">
                      {KIND.find((k) => k.id === r.kind)?.label}
                    </span>
                    <p className="font-serif text-t-h3 font-medium text-espresso">
                      {r.title}
                    </p>
                  </div>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 break-all font-mono text-[0.6875rem] text-ink underline-offset-4 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {r.url}
                    </a>
                  )}
                  {r.body && (
                    <p className="mt-2 whitespace-pre-wrap font-sans text-t-body text-espresso-soft">
                      {r.body}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
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
    </div>
  );
}
