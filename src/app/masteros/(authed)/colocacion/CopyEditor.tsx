"use client";

import { useState } from "react";
import type { ColocacionCopy } from "@/content/colocacion";

const FIELDS: { key: keyof ColocacionCopy; label: string; area?: boolean }[] = [
  { key: "eyebrow", label: "Eyebrow (línea superior)" },
  { key: "headline_before", label: "Título — antes" },
  { key: "headline_em", label: "Título — resaltado" },
  { key: "headline_after", label: "Título — después" },
  { key: "intro", label: "Introducción", area: true },
  { key: "submit_label", label: "Texto del botón" },
  { key: "reassurance", label: "Microcopy de confianza" },
  { key: "thankyou_title", label: "Gracias — título" },
  { key: "thankyou_body", label: "Gracias — cuerpo", area: true },
];

export function CopyEditor({ initial }: { initial: ColocacionCopy }) {
  const [copy, setCopy] = useState<ColocacionCopy>(initial);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setNote(null);
    const res = await fetch("/api/masteros/colocacion", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(copy),
    }).catch(() => null);
    setNote(res?.ok ? "Guardado. La página en vivo ya muestra los cambios." : "No se pudo guardar.");
    setSaving(false);
  }

  return (
    <div className="rounded-md border border-hair bg-white p-5">
      <p className="caps mb-3">Editar la página en vivo</p>
      <div className="space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="caps mb-1.5 block text-espresso-muted">{f.label}</label>
            {f.area ? (
              <textarea
                value={copy[f.key]}
                onChange={(e) => setCopy({ ...copy, [f.key]: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-hair bg-white p-2.5 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
              />
            ) : (
              <input
                value={copy[f.key]}
                onChange={(e) => setCopy({ ...copy, [f.key]: e.target.value })}
                className="h-10 w-full rounded-md border border-hair bg-white px-3 font-sans text-t-body text-espresso focus:border-ink focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white hover:bg-ink-deep disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {note && (
          <span className="font-sans text-t-caption text-espresso-soft">{note}</span>
        )}
      </div>
    </div>
  );
}
