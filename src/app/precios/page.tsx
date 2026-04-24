import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { formatIndex } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Planes de Inglés Hotelero. Examen de colocación puntual + subscripción mensual por propiedad.",
};

const PILOT_MAILTO =
  "mailto:hola@ingleshotelero.com?subject=Piloto%20gratis%20para%20mi%20hotel&body=Hola%20Diego%2C%0A%0AMe%20interesa%20un%20piloto%20gratis%20para%20un%20departamento.";

const PLANS = [
  {
    name: "Inicial",
    priceUSD: 150,
    cadence: "/ mes · por propiedad",
    cap: "Hasta 30 empleados",
    includes: [
      "1 módulo de puesto (recepción, botones, o restaurante)",
      "Examen de colocación para cada empleado",
      "Capacitación diaria de 5 min por WhatsApp o web",
      "Reportes semanales de progreso",
      "Soporte por correo en 24 hrs",
    ],
    envKey: "NEXT_PUBLIC_STRIPE_LINK_STARTER",
    tone: "white" as const,
    ctaLabel: "Contratar plan Inicial",
    bestFor: "Hoteles boutique con un departamento prioritario",
  },
  {
    name: "Profesional",
    priceUSD: 300,
    cadence: "/ mes · por propiedad",
    cap: "Hasta 75 empleados",
    includes: [
      "Los tres módulos (recepción · botones · restaurante)",
      "Examen de colocación + evaluaciones mensuales",
      "Entrega por WhatsApp (integración Twilio completa)",
      "Reportes semanales + mensuales",
      "Dashboard de RH con exportes PDF y Excel",
      "Soporte prioritario",
    ],
    envKey: "NEXT_PUBLIC_STRIPE_LINK_PROFESSIONAL",
    tone: "accent" as const,
    ctaLabel: "Contratar plan Profesional",
    bestFor: "Hoteles de 4–5 estrellas con tres puestos guest-facing",
    recommended: true,
  },
  {
    name: "Empresarial",
    priceUSD: null as number | null,
    cadence: "Desde $500 USD / mes",
    cap: "Empleados ilimitados · multi-propiedad",
    includes: [
      "Todos los módulos + contenido personalizado",
      "Dashboard multi-propiedad para cadenas",
      "Gerente de cuenta dedicado",
      "Reportes personalizados + integración con su BI",
      "Acceso API para integrar con su sistema de RH",
      "Certificación 'Propiedad Bilingüe' al alcanzar meta",
    ],
    envKey: "NEXT_PUBLIC_STRIPE_LINK_ENTERPRISE",
    tone: "white" as const,
    ctaLabel: "Hablar con ventas",
    bestFor: "Cadenas de 3+ propiedades",
  },
];

const FAQS = [
  {
    q: "¿Cuánto cuesta el examen de colocación?",
    a: "USD 50 por empleado, una sola vez. Incluye el examen de 15 minutos, la calificación por IA, el reporte PDF ejecutivo, y una reunión de resultados. Es la forma más barata de diagnosticar el inglés de todo su equipo — y es la puerta de entrada al programa de capacitación.",
  },
  {
    q: "¿Qué pasa si tengo una cadena de hoteles?",
    a: "El plan Empresarial cubre múltiples propiedades con un dashboard central. Cotización personalizada según número de propiedades y empleados totales. Se factura a una sola entidad.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Todos los planes son mes a mes sin permanencia. Si cancela, conserva acceso hasta el final del período facturado y puede exportar todos sus datos.",
  },
  {
    q: "¿Cuánto tarda en implementarse?",
    a: "Un día. Le enviamos el enlace único de su hotel, su RH lo comparte con el equipo, y los empleados toman el examen cuando puedan. En una semana típica tiene datos completos.",
  },
  {
    q: "¿Factura en pesos?",
    a: "Sí. Los precios se muestran en USD por claridad internacional, pero facturamos en MXN al tipo de cambio del día de cobro, con IVA desglosado, CFDI 4.0, y uso 'G03'.",
  },
  {
    q: "¿El piloto gratis realmente es gratis?",
    a: "Sí. Un departamento, un mes, sin cobro y sin tarjeta. Al terminar le entregamos el reporte y una cotización específica. Si no convence, nadie firma nada.",
  },
];

export default function PreciosPage() {
  return (
    <main className="bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="font-sans text-t-label text-espresso hover:text-ink">
            Inicio
          </Link>
          <Link href="/precios" className="font-sans text-t-label text-ink">
            Precios
          </Link>
          <ButtonLink href={PILOT_MAILTO} variant="primary" size="md">
            Pedir piloto
          </ButtonLink>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-shell px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24">
        <p className="caps mb-6">{formatIndex(1)} · Planes y precios</p>
        <h1 className="max-w-[22ch] font-serif text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1] tracking-[-0.025em]">
          Sin letra chica. <em>Sin sorpresas.</em>
        </h1>
        <p className="mt-8 max-w-prose font-sans text-t-body-lg text-espresso-soft">
          Examen de colocación puntual para diagnosticar a su equipo. Suscripción
          mensual por propiedad para capacitarlos. Los precios son por propiedad,
          no por empleado — así es más fácil crecer sin que el costo se vuelva
          un tema.
        </p>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── Placement exam ─────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-section-gap">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <p className="caps mb-3">{formatIndex(2)} · Punto de entrada</p>
            <h2 className="font-serif text-t-h1 font-medium">
              Examen de colocación — <em>USD 50</em> por empleado.
            </h2>
            <p className="mt-6 font-sans text-t-body-lg text-espresso-soft">
              Una sola vez. Diagnostica a todo su equipo en una semana y le entrega
              un reporte que puede llevar a Dirección el lunes.
            </p>
          </div>
          <div className="rounded-md border border-hair bg-white p-8">
            <p className="caps mb-4">Incluye</p>
            <ul className="space-y-3 font-sans text-t-body text-espresso">
              {[
                "Examen de 15 min por empleado (diagnóstico, escucha, habla)",
                "Calificación por IA con nivel CEFR A1–B2",
                "Reporte PDF ejecutivo para Dirección y GM",
                "Reunión de 30 min para revisar resultados",
                "Recomendación de módulo para cada empleado",
              ].map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-ink" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <HairlineRule className="my-6" />
            <p className="caps">
              Recomendación: empiece con el piloto gratis antes de facturar.
            </p>
            <ButtonLink href={PILOT_MAILTO} variant="accent" size="lg" className="mt-4">
              Empezar con el piloto gratis
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── Subscription tiers ─────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-section-gap">
        <div className="mb-12 grid items-baseline gap-6 border-b border-hair pb-[2.25rem] md:grid-cols-[80px_1fr_380px]">
          <div className="font-serif text-[1.75rem] font-medium leading-none tracking-tight text-ink">
            03
          </div>
          <h2 className="font-serif text-t-h1 font-medium">
            Suscripción mensual. <em>Por propiedad</em>.
          </h2>
          <p className="font-sans text-t-caption text-espresso-muted md:text-right">
            Después de la evaluación, el programa de capacitación. Mes a mes,
            sin permanencia.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── FAQ ───────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-section-gap">
        <p className="caps mb-3">{formatIndex(4)} · Preguntas</p>
        <h2 className="mb-10 max-w-[24ch] font-serif text-t-h1 font-medium">
          Lo que RH ya está <em>pensando</em>.
        </h2>
        <dl className="divide-y divide-hair">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="grid gap-6 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12"
            >
              <dt className="font-serif text-t-h3 font-medium text-espresso">
                {f.q}
              </dt>
              <dd className="font-sans text-t-body-lg text-espresso-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── CTA band ──────────────────────────── */}
      <section className="bg-espresso text-ivory-light">
        <div className="mx-auto grid max-w-shell gap-10 px-6 py-16 md:grid-cols-[1fr_auto] md:items-end md:gap-20 md:px-12 md:py-section-gap">
          <div className="max-w-prose">
            <p className="caps mb-6 text-ivory-light/60">{formatIndex(5)} · Siguiente paso</p>
            <h2 className="font-serif text-t-h1 font-medium">
              Empiece con el piloto. <em style={{ color: "#C3CDD8" }}>Decida después.</em>
            </h2>
          </div>
          <ButtonLink href={PILOT_MAILTO} variant="accent" size="lg">
            Pedir piloto gratis
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>

      <footer className="mx-auto max-w-shell px-6 py-12 md:px-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo showSub={false} />
          <p className="caps">© 2026 · Inglés Hotelero · hecho en México</p>
        </div>
      </footer>
    </main>
  );
}

function PlanCard({
  plan,
}: {
  plan: (typeof PLANS)[number];
}) {
  const href = process.env[plan.envKey] ?? PILOT_MAILTO;
  const accent = plan.tone === "accent";
  return (
    <article
      className={
        accent
          ? "relative flex flex-col gap-6 rounded-md border border-ink bg-ink-tint p-8"
          : "flex flex-col gap-6 rounded-md border border-hair bg-white p-8"
      }
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-6 rounded-pill bg-ink px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white">
          Recomendado
        </span>
      )}
      <header>
        <p className="caps">{plan.bestFor}</p>
        <h3 className="mt-3 font-serif text-t-h2 font-medium">{plan.name}</h3>
        <div className="mt-4 flex items-baseline gap-2">
          {plan.priceUSD !== null ? (
            <>
              <span className="font-serif text-[3rem] font-medium leading-none tracking-tight">
                ${plan.priceUSD}
              </span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-espresso-muted">
                USD
              </span>
            </>
          ) : (
            <span className="font-serif text-[1.75rem] font-medium leading-none tracking-tight">
              {plan.cadence}
            </span>
          )}
        </div>
        {plan.priceUSD !== null && (
          <p className="caps mt-2">{plan.cadence}</p>
        )}
        <p className="mt-4 font-sans text-t-body text-espresso-soft">{plan.cap}</p>
      </header>
      <HairlineRule />
      <ul className="space-y-3 font-sans text-t-body text-espresso">
        {plan.includes.map((it) => (
          <li key={it} className="flex items-start gap-3">
            <Check
              className={
                accent
                  ? "mt-1 h-3.5 w-3.5 shrink-0 text-ink-deep"
                  : "mt-1 h-3.5 w-3.5 shrink-0 text-ink"
              }
              aria-hidden
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <ButtonLink
        href={href}
        variant={accent ? "accent" : "primary"}
        size="md"
        className="w-full"
      >
        {plan.ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </ButtonLink>
    </article>
  );
}
