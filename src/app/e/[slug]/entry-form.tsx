"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatIndex, cn } from "@/lib/utils";
import type { RoleModule, Shift } from "@/lib/supabase/types";
import { newSessionId, saveSession } from "@/lib/exam";

interface Role {
  id: RoleModule;
  label: string;
  caption: string;
}

interface EntryFormProps {
  propertySlug: string;
  propertyName: string;
  roles: Role[];
  isStub: boolean;
}

export function EntryForm({ propertySlug, propertyName, roles, isStub }: EntryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<RoleModule | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && role !== null && consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const clientId = newSessionId();
    let sessionId = clientId;
    let mode: "persisted" | "local-only" = "local-only";

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          property_slug: propertySlug,
          name,
          email: email || undefined,
          phone: phone || undefined,
          module: role,
          shift: shift || undefined,
          client_session_id: clientId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionId = data.id ?? clientId;
        mode = data.mode ?? "local-only";
      }
    } catch {
      // Network / offline → proceed in local-only mode.
    }

    // Seed localStorage with the session — the exam pages read from here.
    saveSession({
      id: sessionId,
      employee_id: mode === "persisted" ? sessionId : null,
      property_slug: propertySlug,
      employee: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        shift: shift || undefined,
      },
      module: role!,
      started_at: new Date().toISOString(),
      current_step: "diagnostic",
      diagnostic_answers: {},
      listening_answers: [],
      speaking_recordings: [],
    });

    router.push(`/exam/${sessionId}/diagnostic`);
  };

  return (
    <form className="space-y-14" onSubmit={handleSubmit}>
      <fieldset className="space-y-8">
        <legend className="caps mb-4 block">{formatIndex(1)} · Identifíquese</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Nombre completo"
            placeholder="María López"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Correo (opcional)"
            type="email"
            placeholder="maria@hotel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="WhatsApp (opcional)"
            type="tel"
            placeholder="+52 55 1234 5678"
            hint="Para recibir sus ejercicios diarios"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="caps mb-4 block">{formatIndex(2)} · Puesto</legend>
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((r, i) => (
            <RoleOption
              key={r.id}
              index={i + 1}
              label={r.label}
              caption={r.caption}
              selected={role === r.id}
              onSelect={() => setRole(r.id)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="caps mb-4 block">{formatIndex(3)} · Turno (opcional)</legend>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { id: "morning" as const, label: "Matutino" },
            { id: "afternoon" as const, label: "Vespertino" },
            { id: "night" as const, label: "Nocturno" },
          ].map((s) => (
            <ShiftOption
              key={s.id}
              label={s.label}
              selected={shift === s.id}
              onSelect={() => setShift(s.id)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="caps mb-4 block">{formatIndex(4)} · Consentimiento</legend>
        <label className="flex cursor-pointer items-start gap-4 rounded-md border border-hair bg-white p-5">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-ink"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span className="font-sans text-t-body text-espresso">
            Autorizo que se guarden mis grabaciones de voz únicamente con fines de
            evaluación y capacitación. Entiendo que puedo solicitar su eliminación en
            cualquier momento.{" "}
            <span className="text-espresso-muted">
              Sus datos son tratados conforme a la LFPDPPP de México.
            </span>
          </span>
        </label>
      </fieldset>

      <div className="space-y-4">
        {isStub && (
          <p className="flex items-start gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5" aria-hidden />
            <span className="normal-case tracking-normal">
              Hotel en modo vista previa. El examen funciona; los datos solo
              persisten en este navegador hasta que RH active el hotel en la
              base de datos.
            </span>
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Creando su sesión…
            </>
          ) : (
            <>
              Comenzar examen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function RoleOption({
  index,
  label,
  caption,
  selected,
  onSelect,
}: {
  index: number;
  label: string;
  caption: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex items-center gap-4 rounded-lg border p-5 text-left transition-colors duration-200 ease-editorial",
        selected
          ? "border-ink bg-ink-tint"
          : "border-hair bg-white hover:border-espresso/30",
      )}
    >
      <span
        className={cn(
          "font-serif text-[1.25rem] font-medium",
          selected ? "text-ink" : "text-espresso",
        )}
      >
        {formatIndex(index)}
      </span>
      <span className="flex flex-col">
        <span className="font-sans text-t-label font-semibold text-espresso">
          {label}
        </span>
        <span className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-espresso-muted">
          {caption}
        </span>
      </span>
    </button>
  );
}

function ShiftOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-pill border px-5 py-2.5 font-sans text-t-label transition-colors duration-200 ease-editorial",
        selected
          ? "border-ink bg-ink text-white"
          : "border-hair bg-white text-espresso hover:border-espresso/40",
      )}
    >
      {label}
    </button>
  );
}
