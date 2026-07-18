import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { HairlineRule } from "@/components/ui/HairlineRule";
import { formatIndex } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Precios y planes",
  description:
    "Evaluación de nivel (USD 50/empleado) y suscripción mensual por propiedad: Inicial $150, Profesional $300, Empresarial desde $500 USD.",
  alternates: { canonical: "/precios" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Precios y planes · Inglés Hotelero",
    description:
      "Evaluación de nivel (USD 50/empleado) y suscripción mensual por propiedad: Inicial $150, Profesional $300, Empresarial desde $500 USD.",
    url: "/precios",
  },
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
      "Un módulo de puesto: recepción, botones o restaurante",
      "Evaluación de nivel CEFR para cada empleado",
      "Práctica diaria de 5 minutos por WhatsApp o web",
      "Reporte de avance cada semana",
      "Soporte por correo, respuesta en 24 horas",
    ],
    envKey: "NEXT_PUBLIC_STRIPE_LINK_STARTER",
    tone: "white" as const,
    ctaLabel: "Contratar plan Inicial",
    bestFor: "Para el hotel que arranca por un solo departamento",
  },
  {
    name: "Profesional",
    priceUSD: 300,
    cadence: "/ mes · por propiedad",
    cap: "Hasta 75 empleados",
    includes: [
      "Los tres módulos: recepción, botones y restaurante",
      "Evaluación inicial y reevaluación cada mes",
      "Práctica diaria por WhatsApp, sin apps que instalar",
      "Reportes cada semana y un resumen mensual",
      "Panel de RH con exportación a PDF y Excel",
      "Soporte prioritario",
    ],
    envKey: "NEXT_PUBLIC_STRIPE_LINK_PROFESSIONAL",
    tone: "accent" as const,
    ctaLabel: "Contratar plan Profesional",
    bestFor: "El 4 y 5 estrellas con tres puestos de cara al huésped",
    recommended: true,
  },
  {
    name: "Empresarial",
    priceUSD: null as number | null,
    cadence: "Desde $500 USD / mes",
    cap: "Empleados ilimitados · multi-propiedad",
    includes: [
      "Todos los módulos, con contenido a la medida de su marca",
      "Panel multi-propiedad para leer toda la cadena de un vistazo",
      "Un gerente de cuenta que conoce su operación",
      "Reportes a la medida, conectados a su BI",
      "Acceso API para enlazar con su sistema de RH",
      "Certificación 'Propiedad Bilingüe' al llegar a la meta",
    ],
    envKey: "NEXT_PUBLIC_STRIPE_LINK_ENTERPRISE",
    tone: "white" as const,
    ctaLabel: "Hablar con ventas",
    bestFor: "Para cadenas de tres o más propiedades",
  },
];

const FAQS = [
  {
    q: "¿Cuánto cuesta la evaluación de nivel?",
    a: "USD 50 por empleado, una sola vez. Incluye el examen de 15 minutos, la calificación por IA con nivel CEFR, el reporte PDF para Dirección y una reunión para revisar resultados. Es la forma más rápida de saber, con datos, en qué nivel de inglés está cada persona de su equipo — y la puerta de entrada al programa de capacitación.",
  },
  {
    q: "¿Qué pasa si tengo una cadena de hoteles?",
    a: "El plan Empresarial cubre varias propiedades bajo un solo panel. La cotización se arma según el número de propiedades y de empleados, y todo se factura a una sola entidad.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Todos los planes son mes a mes, sin permanencia. Si cancela, conserva el acceso hasta el final del período que ya pagó y puede exportar todos sus datos.",
  },
  {
    q: "¿Cuánto tarda en implementarse?",
    a: "Un día. Le enviamos el enlace único de su hotel, RH lo comparte con el equipo y cada empleado toma el examen cuando su turno lo permita. Para el final de la semana ya tiene los datos completos.",
  },
  {
    q: "¿Factura en pesos?",
    a: "Sí. Los precios se muestran en USD para que sean claros en cualquier país, pero facturamos en MXN al tipo de cambio del día de cobro, con IVA desglosado, CFDI 4.0 y uso 'G03'.",
  },
  {
    q: "¿El piloto gratis de verdad es gratis?",
    a: "Sí. Un departamento, un mes, sin cobro y sin tarjeta. Al terminar le entregamos el reporte y una cotización a su medida. Si no lo convence, nadie firma nada.",
  },
];

// ── Structured data (JSON-LD) ───────────────────────────────
// Answer engines (Google SGE, Perplexity, ChatGPT) reward a single,
// internally-consistent knowledge graph. Every price below is derived from
// the PLANS / FAQS arrays above, so the rich result can never drift from the
// rendered page. The Organization @id matches the marketing site so the app
// and ingleshotelero.com resolve to one entity.
const ORG_ID = "https://ingleshotelero.com/#organization";
const PRECIOS_URL = "https://ingleshotelero.com/precios";

// Empresarial has no fixed priceUSD ("Desde $500 USD / mes") → floor of 500.
const planPrice = (p: (typeof PLANS)[number]) => p.priceUSD ?? 500;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Inglés Hotelero",
      url: "https://ingleshotelero.com",
      email: "hola@ingleshotelero.com",
      foundingDate: "2024",
      foundingLocation: {
        "@type": "Place",
        name: "San Miguel de Allende, Guanajuato, México",
      },
      areaServed: "Latinoamérica",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "hola@ingleshotelero.com",
        telephone: "+52 624 555 0142",
        availableLanguage: ["es", "en"],
      },
    },
    {
      "@type": "Product",
      "@id": `${PRECIOS_URL}#suscripcion`,
      name: "Capacitación de inglés hotelero — suscripción por propiedad",
      description:
        "Suscripción mensual por propiedad para capacitar al personal de hoteles en inglés funcional (recepción, botones, restaurante). Mes a mes, sin permanencia.",
      brand: { "@id": ORG_ID },
      category: "Capacitación empresarial de inglés",
      url: PRECIOS_URL,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: 150,
        highPrice: 500,
        offerCount: 3,
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: String(planPrice(plan)),
          priceCurrency: "USD",
          url: PRECIOS_URL,
          category: "Suscripción mensual por propiedad",
          description: plan.bestFor,
        })),
      },
    },
    {
      "@type": "Product",
      "@id": `${PRECIOS_URL}#evaluacion`,
      name: "Evaluación de nivel de inglés hotelero (CEFR A1–B2)",
      description:
        "Evaluación puntual por empleado: examen de 15 minutos, calificación por IA con nivel CEFR, reporte PDF ejecutivo y reunión de resultados. Es el punto de entrada al programa de capacitación.",
      brand: { "@id": ORG_ID },
      category: "Evaluación de nivel de inglés",
      url: PRECIOS_URL,
      offers: {
        "@type": "Offer",
        price: "50",
        priceCurrency: "USD",
        url: PRECIOS_URL,
        category: "Evaluación puntual por empleado",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://ingleshotelero.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Precios y planes",
          item: PRECIOS_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PRECIOS_URL}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ],
};

export default function PreciosPage() {
  return (
    <main className="bg-ivory text-espresso">
      {/* JSON-LD structured data for search + answer engines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          Una evaluación de nivel para saber dónde está parado su equipo. Una
          suscripción mensual para llevarlo a donde necesita. Cobramos por
          propiedad, no por empleado: su cuenta no crece cada vez que da de alta
          a alguien nuevo.
        </p>
      </section>

      <HairlineRule className="mx-auto max-w-shell px-6 md:px-12" />

      {/* ── Placement exam ─────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-section-gap">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <p className="caps mb-3">{formatIndex(2)} · Punto de entrada</p>
            <h2 className="font-serif text-t-h1 font-medium">
              Evaluación de nivel — <em>USD 50</em> por empleado.
            </h2>
            <p className="mt-6 font-sans text-t-body-lg text-espresso-soft">
              Se paga una vez. Mide a todo su equipo en una semana y le deja un
              reporte que puede poner sobre la mesa de Dirección el lunes.
            </p>
          </div>
          <div className="rounded-md border border-hair bg-white p-8">
            <p className="caps mb-4">Incluye</p>
            <ul className="space-y-3 font-sans text-t-body text-espresso">
              {[
                "Examen de 15 minutos por empleado: comprensión, escucha y habla",
                "Calificación por IA con nivel CEFR, de A1 a B2",
                "Reporte PDF listo para Dirección y Gerencia General",
                "Reunión de 30 minutos para leer los resultados juntos",
                "El módulo recomendado para cada empleado, por nombre",
              ].map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-ink" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <HairlineRule className="my-6" />
            <p className="caps">
              Antes de facturar, pruébelo con el piloto gratis.
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
