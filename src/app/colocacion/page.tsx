import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { getPageContent } from "@/lib/server/page-content";
import {
  COLOCACION_COPY_KEY,
  DEFAULT_COLOCACION_COPY,
  COLOCACION_AREAS,
  type ColocacionCopy,
} from "@/content/colocacion";

export const metadata: Metadata = {
  title: "Examen de colocación · Inglés Hotelero",
  description:
    "Diagnóstico para tu hotel. Cuéntanos de tu equipo y te enviamos un plan y una cotización a la medida.",
};

export const dynamic = "force-dynamic";

const input =
  "h-11 w-full rounded-md border border-hair bg-white px-4 font-sans text-espresso placeholder:text-espresso-muted focus:border-ink focus:outline-none";
const label = "caps mb-2 block";

export default async function ColocacionPage() {
  const c = await getPageContent<ColocacionCopy>(
    COLOCACION_COPY_KEY,
    DEFAULT_COLOCACION_COPY,
  );

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logo />
        <Link href="/" className="caps text-espresso transition-colors hover:text-ink">
          Inglés Hotelero
        </Link>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10 md:px-8 md:py-14">
        <p className="caps mb-3">{c.eyebrow}</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {c.headline_before}
          <em>{c.headline_em}</em>
          {c.headline_after}
        </h1>
        <p className="mt-4 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          {c.intro}
        </p>

        <form
          method="POST"
          action="/api/colocacion"
          className="mt-8 space-y-8 rounded-md border border-hair bg-white p-6 md:p-8"
        >
          <input type="hidden" name="form-name" value="colocacion" />
          <input
            type="hidden"
            name="source_url"
            value="https://ingleshotelero.netlify.app/colocacion"
          />
          <p hidden>
            <label>
              No completar:{" "}
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          {/* Contact */}
          <div>
            <p className="caps mb-3 text-ink">1 · Tus datos</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Nombre *</label>
                <input name="name" required placeholder="Tu nombre" className={input} />
              </div>
              <div>
                <label className={label}>Puesto</label>
                <input name="role" placeholder="HR · Ops · GM · Dueño" className={input} />
              </div>
              <div>
                <label className={label}>Email corporativo *</label>
                <input name="email" type="email" required placeholder="tu@hotel.com" className={input} />
              </div>
              <div>
                <label className={label}>WhatsApp</label>
                <input name="phone" type="tel" placeholder="+52 …" className={input} />
              </div>
            </div>
          </div>

          {/* Hotel */}
          <div>
            <p className="caps mb-3 text-ink">2 · Tu propiedad</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Hotel / Grupo *</label>
                <input name="hotel" required placeholder="Nombre de la propiedad o grupo" className={input} />
              </div>
              <div>
                <label className={label}>Ciudad(es)</label>
                <input name="city" placeholder="Los Cabos, CDMX…" className={input} />
              </div>
              <div>
                <label className={label}>Número de ubicaciones</label>
                <input name="hotel_count" type="number" min={1} placeholder="1" className={input} />
              </div>
              <div>
                <label className={label}>Tipo</label>
                <select name="org_type" className={input} defaultValue="independiente">
                  <option value="independiente">Hotel independiente</option>
                  <option value="cadena">Cadena / grupo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <p className="caps mb-3 text-ink">3 · Tu equipo</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Empleados que necesitan inglés</label>
                <select name="team_size" className={input} defaultValue="25-100">
                  <option>Menos de 25</option>
                  <option>25–100</option>
                  <option>100–300</option>
                  <option>300–800</option>
                  <option>Más de 800</option>
                </select>
              </div>
              <div>
                <label className={label}>Nivel de inglés actual (aprox.)</label>
                <select name="level_now" className={input} defaultValue="no-se">
                  <option value="no-se">No estoy seguro</option>
                  <option value="basico">Básico / principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="mixto">Muy variado</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>Áreas que necesitan inglés</label>
              <div className="flex flex-wrap gap-2">
                {COLOCACION_AREAS.map((a) => (
                  <label
                    key={a}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-pill border border-hair bg-white px-3 py-1.5 font-sans text-t-caption text-espresso-soft has-[:checked]:border-ink has-[:checked]:bg-ink-tint has-[:checked]:text-ink-deep"
                  >
                    <input type="checkbox" name="areas" value={a} className="accent-ink" />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Goals */}
          <div>
            <p className="caps mb-3 text-ink">4 · Tu objetivo</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>¿Cuándo querrían arrancar?</label>
                <select name="timeline" className={input} defaultValue="30-dias">
                  <option value="esta-semana">Esta semana</option>
                  <option value="30-dias">Próximos 30 días</option>
                  <option value="trimestre">Próximo trimestre</option>
                  <option value="explorando">Solo explorando</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>¿Qué quieren lograr? (opcional)</label>
              <textarea
                name="goals"
                rows={3}
                placeholder="Retos actuales, temporadas altas, objetivos específicos…"
                className={`${input} h-auto py-3`}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 border-t border-hair pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="caps text-espresso-muted">{c.reassurance}</p>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-7 font-sans text-t-label font-medium text-white transition-colors hover:bg-ink-deep"
            >
              {c.submit_label}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
