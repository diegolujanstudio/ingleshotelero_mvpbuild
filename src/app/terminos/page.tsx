import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { TERMS_VERSION, TERMS_EFFECTIVE_DATE } from "@/content/legal";

/**
 * /terminos — Términos del servicio.
 *
 * v0.1 — drafted as a working baseline. A Mexican commercial attorney
 * should review before signing the first paid hotel contract.
 *
 * Version constants live in @/content/legal so they can be exported (Next
 * 14 forbids non-component named exports from page.tsx).
 */

export const metadata: Metadata = {
  title: "Términos del servicio",
  description:
    "Términos del servicio de Inglés Hotelero. Reglas de uso, responsabilidades y condiciones comerciales.",
};

export default function TerminosPage() {
  return (
    <main className="bg-ivory text-espresso">
      <header className="mx-auto flex max-w-shell items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
        <Logo />
        <Link
          href="/"
          className="caps text-espresso transition-colors hover:text-ink"
        >
          Volver al inicio
        </Link>
      </header>

      <article className="mx-auto max-w-prose px-6 py-20 md:px-12 md:py-section-gap">
        <p className="caps mb-6">Documento legal · v{TERMS_VERSION}</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          <em>Términos del servicio</em>
        </h1>
        <p className="mt-6 font-sans text-t-body-lg text-espresso-soft">
          Vigentes a partir del {TERMS_EFFECTIVE_DATE}. Al contratar el servicio o
          permitir que sus empleados sean evaluados, usted acepta estos términos.
        </p>

        <div className="mt-12 space-y-10 font-sans text-t-body-lg leading-[1.65] text-espresso">
          <Section num="01" title="Quiénes somos">
            <p>
              <em>Inglés Hotelero</em> es un servicio operado por Diego Luján
              Studio LLC. Ofrecemos evaluación de inglés funcional para personal
              hotelero, capacitación diaria por web y WhatsApp, y reportes
              ejecutivos para Recursos Humanos. El servicio se presta a hoteles —
              no a empleados como contratantes individuales.
            </p>
          </Section>

          <Section num="02" title="Modalidades del servicio">
            <p>
              <em>Examen de colocación.</em> Pago por evento de evaluación. El
              precio público es de cincuenta dólares estadounidenses (USD $50)
              por empleado evaluado. Incluye examen de quince minutos,
              calificación por inteligencia artificial, reporte ejecutivo en PDF
              y reunión de resultados de hasta treinta minutos.
            </p>
            <p>
              <em>Suscripción mensual.</em> Capacitación continua para los
              empleados de la propiedad. Se cobra por propiedad, no por empleado.
              Los planes vigentes y sus límites se publican en{" "}
              <Link
                href="/precios"
                className="text-ink underline-offset-4 hover:underline"
              >
                /precios
              </Link>
              . Los planes se renuevan automáticamente cada mes y pueden cancelarse
              en cualquier momento sin penalización; la cancelación surte efecto al
              final del periodo facturado.
            </p>
            <p>
              <em>Piloto sin costo.</em> Ofrecemos pilotos de un departamento por
              un mes, sin cobro y sin compromiso. Al concluir, el hotel decide si
              desea contratar el servicio. Durante el piloto aplican las mismas
              obligaciones de privacidad y seguridad que en el servicio pagado.
            </p>
          </Section>

          <Section num="03" title="Responsabilidades del hotel">
            <p>El hotel contratante se obliga a:</p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>
                Proporcionar a sus empleados el aviso de privacidad antes de
                solicitarles que tomen el examen.
              </li>
              <li>
                Asegurar que la participación del empleado sea voluntaria y que
                no se utilice como criterio único de despido o sanción.
              </li>
              <li>
                Notificar al servicio cuando un empleado deje de pertenecer al
                hotel, para detener el envío de comunicaciones.
              </li>
              <li>
                Mantener actualizada la información de contacto de los
                administradores de Recursos Humanos autorizados.
              </li>
              <li>
                No compartir credenciales de acceso al dashboard con personas
                ajenas al hotel.
              </li>
            </ol>
          </Section>

          <Section num="04" title="Lo que sí garantizamos">
            <p>
              Garantizamos que el servicio funcionará conforme a su descripción,
              que aplicaremos las medidas de seguridad descritas en el{" "}
              <Link
                href="/aviso-de-privacidad"
                className="text-ink underline-offset-4 hover:underline"
              >
                Aviso de privacidad
              </Link>
              , y que entregaremos los reportes y la capacitación en los plazos
              acordados durante el piloto o en el contrato. Si el servicio falla
              de manera atribuible a nosotros, le otorgaremos crédito proporcional
              al periodo afectado.
            </p>
          </Section>

          <Section num="05" title="Lo que no garantizamos">
            <p>
              No garantizamos resultados específicos de aprendizaje. La mejora del
              empleado depende de su participación, frecuencia y motivación
              personal. Lo que sí garantizamos es que usted podrá medir esa mejora
              de forma objetiva y constante.
            </p>
            <p>
              No somos un sustituto de la formación profesional certificada. Los
              niveles CEFR que asignamos son orientativos y derivados del
              contexto hotelero específico — no son equivalentes a certificaciones
              oficiales <em>Cambridge</em>, <em>TOEFL</em> u otras.
            </p>
          </Section>

          <Section num="06" title="Pagos y facturación">
            <p>
              Los pagos se realizan mediante <em>Stripe</em>. Para hoteles en
              México emitimos factura electrónica (CFDI) con los datos fiscales
              que el hotel proporcione. Las suscripciones se facturan al inicio
              del periodo. El examen de colocación se factura al confirmar la
              cantidad de empleados a evaluar.
            </p>
            <p>
              En caso de falta de pago, suspendemos el envío de drills diarios y
              el acceso al dashboard hasta regularizar la situación. La
              eliminación de datos no procede automáticamente por falta de pago —
              requiere solicitud expresa del hotel o del titular de los datos.
            </p>
          </Section>

          <Section num="07" title="Cancelación y eliminación de datos">
            <p>
              El hotel puede cancelar la suscripción en cualquier momento, sin
              penalización, escribiendo a{" "}
              <a
                href="mailto:hola@ingleshotelero.com"
                className="text-ink underline-offset-4 hover:underline"
              >
                hola@ingleshotelero.com
              </a>
              . Los datos de empleados se conservan durante un año después de la
              cancelación, para permitir reactivación. Después se eliminan o
              anonimizan según el aviso de privacidad.
            </p>
            <p>
              Cualquier titular individual de datos puede solicitar la eliminación
              de los suyos en cualquier momento, conforme a los derechos ARCO.
            </p>
          </Section>

          <Section num="08" title="Limitación de responsabilidad">
            <p>
              En la medida que la ley lo permita, nuestra responsabilidad total
              frente al hotel contratante por cualquier reclamación derivada del
              uso del servicio se limita al monto pagado por el hotel en los doce
              meses anteriores al evento que dio origen a la reclamación. No
              respondemos por daños indirectos, lucro cesante, ni pérdida de
              oportunidades comerciales.
            </p>
          </Section>

          <Section num="09" title="Propiedad intelectual">
            <p>
              El contenido del servicio — vocabulario, escenarios, audios,
              rúbricas de evaluación, código del producto — es propiedad de
              <em> Diego Luján Studio LLC</em>. El hotel obtiene una licencia
              limitada, no exclusiva y no transferible para usar el servicio
              durante la vigencia del contrato.
            </p>
            <p>
              Los datos generados por sus empleados (transcripciones, puntajes,
              progreso) son propiedad del hotel contratante. Los entregamos en
              formatos estándar (PDF, Excel, JSON) cuando el hotel lo solicite.
            </p>
          </Section>

          <Section num="10" title="Jurisdicción">
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos
              Mexicanos. Cualquier controversia se resolverá ante los tribunales
              competentes de la <em>Ciudad de México</em>, salvo acuerdo en
              contrario por escrito.
            </p>
          </Section>
        </div>

        <div className="mt-16 border-t border-hair pt-10">
          <p className="caps mb-3 text-espresso-muted">Última actualización</p>
          <p className="font-sans text-t-body text-espresso-soft">
            Versión {TERMS_VERSION} · {TERMS_EFFECTIVE_DATE}. ¿Preguntas? Escriba a{" "}
            <a
              href="mailto:hola@ingleshotelero.com"
              className="text-ink underline-offset-4 hover:underline"
            >
              hola@ingleshotelero.com
            </a>
            .
          </p>
        </div>
      </article>

      <footer className="mx-auto max-w-shell px-6 py-10 md:px-12">
        <p className="caps text-espresso-muted">
          © 2026 · Inglés Hotelero · LFPDPPP · México
        </p>
      </footer>
    </main>
  );
}

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="caps mb-3 text-ink">{num}</p>
      <h2 className="mb-5 font-serif text-t-h3 font-medium">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
