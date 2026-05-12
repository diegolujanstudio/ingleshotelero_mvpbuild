import Link from "next/link";
import { PILOT, FORM_NAME, HONEYPOT_FIELD } from "@/content/forms";

/**
 * Pilot lead-capture form — Netlify Forms compatible.
 *
 * IMPORTANT: this is intentionally a Server Component (no "use client").
 * Netlify scrapes the static HTML at build time to register the form, so
 * everything must render server-side and submit via a normal HTML POST.
 * The handler that runs after submission lives at
 * /api/netlify/forms-webhook (configured in the Netlify dashboard).
 *
 * Required Netlify markers (do not remove):
 *   - data-netlify="true"
 *   - netlify-honeypot="bot-field"
 *   - hidden <input name="form-name" value="pilot" />  (FIRST input)
 *   - hidden honeypot <input name="bot-field" />
 *
 * Validation is handled by the browser via `required` and `type=email`.
 * The webhook does not re-validate field shape — Netlify accepts whatever
 * the visitor types, and a human reads every submission. Spam control is
 * the honeypot + Netlify's built-in Akismet pass.
 */
export function ContactForm() {
  const f = PILOT.fields;

  return (
    <form
      name={FORM_NAME.pilot}
      method="POST"
      action="/contacto/gracias"
      data-netlify="true"
      netlify-honeypot={HONEYPOT_FIELD}
      className="space-y-8 rounded-md border border-hair bg-white p-6 md:p-8"
    >
      {/* form-name MUST be the first input — Netlify routes by it. */}
      <input type="hidden" name="form-name" value={FORM_NAME.pilot} />

      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <p hidden>
        <label>
          No completes este campo: <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <Field label={f.name.label} name="name" required>
        <input
          id="name"
          name="name"
          required
          placeholder={f.name.placeholder}
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field label={f.role.label} name="role" required>
        <select
          id="role"
          name="role"
          required
          defaultValue=""
          className={selectClass}
        >
          <option value="" disabled>
            {f.role.placeholder}
          </option>
          {f.role.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label={f.company.label} name="company" required>
          <input
            id="company"
            name="company"
            required
            placeholder={f.company.placeholder}
            autoComplete="organization"
            className={inputClass}
          />
        </Field>
        <Field label={f.city.label} name="city" optional={f.city.optional}>
          <input
            id="city"
            name="city"
            placeholder={f.city.placeholder}
            autoComplete="address-level2"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label={f.email.label} name="email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={f.email.placeholder}
            autoComplete="email"
            className={inputClass}
          />
        </Field>
        <Field label={f.phone.label} name="phone" optional={f.phone.optional}>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder={f.phone.placeholder}
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label={f.hotelCount.label}
        name="hotel_count"
        optional={f.hotelCount.optional}
      >
        <input
          id="hotel_count"
          name="hotel_count"
          type="number"
          min={1}
          step={1}
          placeholder={f.hotelCount.placeholder}
          className={inputClass}
        />
      </Field>

      <Field
        label={f.message.label}
        name="message"
        optional={f.message.optional}
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={f.message.placeholder}
          className={`${inputClass} min-h-[120px] py-3`}
        />
      </Field>

      <label className="flex items-start gap-3 rounded-md border border-hair bg-ivory-soft p-4">
        <input
          type="checkbox"
          name="acepta_privacidad"
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
          . Mis datos se usan únicamente para responder a esta solicitud.
        </span>
      </label>

      <div className="flex flex-col items-start gap-3 border-t border-hair pt-6 md:flex-row md:items-center md:justify-between">
        <p className="caps text-espresso-muted">{PILOT.reassurance}</p>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-espresso px-7 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {PILOT.submit.idle}
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
  optional,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="caps mb-2 block">
        {label}
        {!required && optional ? (
          <span className="ml-2 text-espresso-muted">{optional}</span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
