"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Lead capture form. Posts to /api/contacto which:
 *   - tries to insert into Supabase `leads` table when configured
 *   - falls back to forwarding via Resend email when Supabase is unset
 *   - logs to server console as last resort so leads never disappear
 *
 * Honeypot anti-spam ("nombre_alterno" — invisible field, bots fill it).
 */

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok"; ref: string }
  | { kind: "error"; message: string };

const ROLES = [
  { value: "rh-director", label: "Director(a) de Recursos Humanos" },
  { value: "rh-gerente", label: "Gerente de Recursos Humanos" },
  { value: "gm", label: "Gerente General" },
  { value: "operaciones", label: "Operaciones" },
  { value: "dueno", label: "Dueño(a) o socio(a)" },
  { value: "otro", label: "Otro" },
];

const DEPARTAMENTOS = [
  { value: "recepcion", label: "Recepción" },
  { value: "botones", label: "Botones" },
  { value: "restaurante", label: "Restaurante / Bar" },
  { value: "varios", label: "Varios departamentos" },
  { value: "no-seguro", label: "Aún no estoy seguro(a)" },
];

const TAMANO = [
  { value: "1-30", label: "Hasta 30 empleados" },
  { value: "31-75", label: "Entre 31 y 75 empleados" },
  { value: "76-200", label: "Entre 76 y 200 empleados" },
  { value: "201+", label: "Más de 200 empleados" },
];

export function ContactForm() {
  const [state, setState] = useState<FormState>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "submitting" });

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          body?.error?.message ??
          "No pudimos guardar su mensaje. Intente de nuevo o escríbanos a hola@ingleshotelero.com.";
        setState({ kind: "error", message });
        return;
      }

      setState({ kind: "ok", ref: body?.data?.ref ?? "—" });
    } catch {
      setState({
        kind: "error",
        message:
          "Falló la conexión. Verifique su red e intente de nuevo, o escríbanos directamente a hola@ingleshotelero.com.",
      });
    }
  }

  if (state.kind === "ok") {
    return (
      <div className="rounded-md border border-hair bg-white p-8">
        <p className="caps mb-3 text-success">Solicitud recibida</p>
        <h2 className="font-serif text-t-h2 font-medium text-espresso">
          Le respondemos <em>en menos de 24 horas</em>.
        </h2>
        <p className="mt-6 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Diego, el fundador, recibirá su mensaje y le escribirá personalmente
          desde <em>hola@ingleshotelero.com</em>. Si pasa el día y no recibe
          respuesta, revise su carpeta de correo no deseado o escríbanos
          directamente.
        </p>
        <p className="caps mt-8 text-espresso-muted">
          Folio interno · {state.ref}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 border-t border-hair pt-8">
          <Link
            href="/pitch"
            className="caps inline-flex items-center text-ink underline-offset-4 hover:underline"
          >
            Mientras tanto, vea el pitch →
          </Link>
          <Link
            href="/demo/conversacion"
            className="caps inline-flex items-center text-ink underline-offset-4 hover:underline"
          >
            Pruebe el simulador de WhatsApp →
          </Link>
        </div>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-md border border-hair bg-white p-6 md:p-8"
      aria-busy={submitting}
    >
      {/* Honeypot — real users never see this; bots fill every field they find. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          No completar
          <input
            type="text"
            name="nombre_alterno"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Field label="Nombre completo" name="nombre" required>
        <input
          name="nombre"
          required
          placeholder="María López"
          className={inputClass}
        />
      </Field>

      <Field label="Cargo" name="cargo" required>
        <select name="cargo" required defaultValue="" className={selectClass}>
          <option value="" disabled>
            Seleccione su cargo
          </option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Hotel" name="hotel" required>
          <input
            name="hotel"
            required
            placeholder="Hotel Casa de la Marquesa"
            className={inputClass}
          />
        </Field>
        <Field label="Ciudad" name="ciudad" required>
          <input
            name="ciudad"
            required
            placeholder="Querétaro, MX"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Correo de trabajo" name="correo" required>
          <input
            type="email"
            name="correo"
            required
            placeholder="maria.lopez@hotel.com"
            className={inputClass}
          />
        </Field>
        <Field label="WhatsApp (opcional)" name="whatsapp">
          <input
            type="tel"
            name="whatsapp"
            placeholder="+52 55 1234 5678"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Departamento que evaluaría primero" name="departamento" required>
        <select
          name="departamento"
          required
          defaultValue=""
          className={selectClass}
        >
          <option value="" disabled>
            Elija el departamento del piloto
          </option>
          {DEPARTAMENTOS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tamaño del equipo" name="tamano" required>
        <select name="tamano" required defaultValue="" className={selectClass}>
          <option value="" disabled>
            ¿Cuántos empleados aproximadamente?
          </option>
          {TAMANO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cualquier contexto adicional" name="mensaje">
        <textarea
          name="mensaje"
          rows={4}
          placeholder="Estoy buscando arrancar antes del verano, prioridad recepción internacional…"
          className={`${inputClass} min-h-[120px] py-3`}
        />
      </Field>

      <label className="flex items-start gap-3 rounded-md border border-hair bg-ivory-soft p-4">
        <input
          type="checkbox"
          name="acepta"
          required
          className="mt-1 h-4 w-4 accent-ink"
        />
        <span className="font-sans text-t-body text-espresso-soft">
          Acepto el{" "}
          <Link
            href="/aviso-de-privacidad"
            className="text-ink underline-offset-4 hover:underline"
          >
            aviso de privacidad
          </Link>{" "}
          y los{" "}
          <Link
            href="/terminos"
            className="text-ink underline-offset-4 hover:underline"
          >
            términos del servicio
          </Link>
          . Mis datos se usarán únicamente para responder a esta solicitud.
        </span>
      </label>

      {state.kind === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-error/30 bg-error/5 p-4 font-sans text-t-body text-error"
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col items-start gap-3 border-t border-hair pt-6 md:flex-row md:items-center md:justify-between">
        <p className="caps text-espresso-muted">
          Respuesta personal en menos de 24 horas hábiles
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-espresso px-7 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Enviando…" : "Pedir mi piloto gratis"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "h-11 w-full rounded-md border border-hair bg-white px-4 font-sans text-espresso placeholder:text-espresso-muted transition-colors duration-200 ease-editorial focus:border-ink focus:outline-none focus-visible:border-ink";

const selectClass =
  "h-11 w-full rounded-md border border-hair bg-white px-3 font-sans text-espresso transition-colors duration-200 ease-editorial focus:border-ink focus:outline-none focus-visible:border-ink";

function Field({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="caps mb-2 block">
        {label}
        {required ? null : (
          <span className="ml-2 text-espresso-muted">opcional</span>
        )}
      </label>
      {children}
    </div>
  );
}
