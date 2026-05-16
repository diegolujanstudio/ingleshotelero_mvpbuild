import { SOPORTE, FORM_NAME, HONEYPOT_FIELD } from "@/content/forms";

/**
 * Support intake form.
 *
 * Server Component (no "use client"). Submits a normal HTML POST to our
 * own first-party route /api/forms/submit, which persists to `leads`
 * (→ /masteros/leads) and emails victor + diego via Resend, then 303s to
 * /soporte/gracias.
 *
 * NOTE: Netlify Forms is NOT used. This is a Next.js SSR app under
 * @netlify/plugin-nextjs, so Netlify never intercepts the POST (every
 * route is a function). QA proved live submissions were silently lost on
 * that path — owning the route end-to-end is the reliable design.
 *
 * Field NAMES that overlap with `pilot` (name, email, phone, company,
 * message) map cleanly onto the same `leads` columns. The `topic` field
 * is soporte-specific and lives in `metadata.topic` server-side.
 */
export function SupportForm() {
  const f = SOPORTE.fields;

  return (
    <form
      name={FORM_NAME.soporte}
      method="POST"
      action="/api/forms/submit"
      className="space-y-8 rounded-md border border-hair bg-white p-6 md:p-8"
    >
      <input type="hidden" name="form-name" value={FORM_NAME.soporte} />
      <input type="hidden" name="redirect" value="/soporte/gracias" />

      <p hidden>
        <label>
          No completes este campo: <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-6 md:grid-cols-2">
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
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
        <Field label={f.company.label} name="company" optional={f.company.optional}>
          <input
            id="company"
            name="company"
            placeholder={f.company.placeholder}
            autoComplete="organization"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={f.topic.label} name="topic" required>
        <select
          id="topic"
          name="topic"
          required
          defaultValue=""
          className={selectClass}
        >
          <option value="" disabled>
            {f.topic.placeholder}
          </option>
          {f.topic.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={f.message.label} name="message" required>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={f.message.placeholder}
          className={`${inputClass} min-h-[150px] py-3`}
        />
      </Field>

      <div className="flex flex-col items-start gap-3 border-t border-hair pt-6 md:flex-row md:items-center md:justify-between">
        <p className="caps text-espresso-muted">{SOPORTE.reassurance}</p>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-espresso px-7 font-sans font-medium tracking-[0.01em] text-ivory transition-colors duration-200 ease-editorial hover:bg-espresso-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {SOPORTE.submit.idle}
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
