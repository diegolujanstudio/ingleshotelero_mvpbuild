import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * /aviso-de-privacidad — LFPDPPP-compliant privacy notice.
 *
 * v0.1 — drafted from the LFPDPPP requirements (Ley Federal de Protección
 * de Datos Personales en Posesión de los Particulares). This file is
 * intended as a working draft. Before signing the first paid contract,
 * a Mexican attorney should review and certify this notice.
 *
 * The version field below is tracked per-employee at consent time so
 * any future edits don't invalidate prior consents.
 */

export const PRIVACY_VERSION = "1.0";
export const PRIVACY_EFFECTIVE_DATE = "1 de mayo de 2026";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad de Inglés Hotelero, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
};

export default function AvisoPage() {
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
        <p className="caps mb-6">Documento legal · v{PRIVACY_VERSION}</p>
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          <em>Aviso de privacidad</em>
        </h1>
        <p className="mt-6 font-sans text-t-body-lg text-espresso-soft">
          Vigente a partir del {PRIVACY_EFFECTIVE_DATE}.
        </p>

        <div className="mt-12 space-y-10 font-sans text-t-body-lg leading-[1.65] text-espresso">
          <Section num="01" title="Identidad del responsable">
            <p>
              <em>Diego Luján Studio LLC</em>, en adelante <em>Inglés Hotelero</em>, es
              responsable del tratamiento de sus datos personales conforme a la Ley
              Federal de Protección de Datos Personales en Posesión de los
              Particulares (<em>LFPDPPP</em>) de México. Para cualquier asunto
              relacionado con este aviso, puede comunicarse al correo{" "}
              <a
                href="mailto:hola@ingleshotelero.com"
                className="text-ink underline-offset-4 hover:underline"
              >
                hola@ingleshotelero.com
              </a>
              .
            </p>
          </Section>

          <Section num="02" title="Datos personales que recabamos">
            <p>
              Para la prestación del servicio recabamos los siguientes datos
              personales del empleado evaluado: nombre completo, correo electrónico
              (opcional), número de WhatsApp (opcional), puesto dentro del hotel,
              turno (opcional), y grabaciones de voz producidas durante la
              evaluación de inglés.
            </p>
            <p>
              De los administradores de Recursos Humanos recabamos: nombre, correo
              electrónico de trabajo, hotel al que pertenecen, y rol dentro del
              sistema (administrador de propiedad o de organización).
            </p>
            <p>
              No recabamos datos sensibles de ninguna categoría (ideología,
              opiniones políticas, religión, salud, vida sexual, origen racial o
              étnico). Si un empleado introduce voluntariamente este tipo de
              información en una grabación, no será utilizada para ningún propósito
              fuera de la evaluación contratada.
            </p>
          </Section>

          <Section num="03" title="Finalidades del tratamiento">
            <p>
              Sus datos personales serán utilizados para las siguientes finalidades
              <em> primarias</em>, indispensables para la prestación del servicio:
            </p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>
                Evaluar el nivel de inglés funcional del empleado en el contexto de
                su puesto hotelero, conforme al Marco Común Europeo de Referencia
                (<em>CEFR</em>).
              </li>
              <li>
                Generar reportes ejecutivos para el área de Recursos Humanos del
                hotel contratante.
              </li>
              <li>
                Entregar capacitación diaria personalizada por web o WhatsApp,
                cuando el empleado lo haya consentido explícitamente.
              </li>
              <li>
                Calcular progreso individual y de cohortes para fines de medición
                interna del hotel contratante.
              </li>
              <li>
                Mantener la integridad técnica del servicio (seguridad, prevención
                de fraude, respaldos).
              </li>
            </ol>
            <p>
              No utilizaremos sus datos para finalidades secundarias —
              mercadotecnia, prospección comercial, transferencia a terceros con
              fines comerciales — sin obtener previamente su consentimiento expreso
              y por escrito.
            </p>
          </Section>

          <Section num="04" title="Conservación y eliminación de datos">
            <p>
              Las grabaciones de voz se conservan únicamente por el tiempo necesario
              para su evaluación, su transcripción y la entrega de retroalimentación
              — y en ningún caso por más de <em>seis meses</em> a partir de la
              evaluación. Posteriormente se eliminan de forma irreversible. La
              transcripción textual y los puntajes derivados sí pueden conservarse
              durante la vigencia del contrato del hotel contratante más un año
              adicional, para fines de medición histórica.
            </p>
            <p>
              Los datos básicos (nombre, correo, puesto) se conservan durante la
              vigencia del contrato más un año, después del cual se eliminan o
              anonimizan según la solicitud del titular o del hotel contratante.
            </p>
          </Section>

          <Section num="05" title="Derechos ARCO">
            <p>
              Usted tiene derecho a <em>acceder, rectificar, cancelar y oponerse</em>
              al tratamiento de sus datos personales (derechos ARCO), así como a
              limitar su uso y divulgación, y a revocar el consentimiento que haya
              otorgado. Puede ejercer estos derechos enviando una solicitud a{" "}
              <a
                href="mailto:hola@ingleshotelero.com"
                className="text-ink underline-offset-4 hover:underline"
              >
                hola@ingleshotelero.com
              </a>{" "}
              indicando: nombre completo, hotel al que pertenece, descripción del
              derecho que desea ejercer, y datos específicos sobre los que recae la
              solicitud. Responderemos en un plazo no mayor a veinte días hábiles
              conforme a la <em>LFPDPPP</em>.
            </p>
          </Section>

          <Section num="06" title="Transferencias">
            <p>
              No transferimos sus datos personales a terceros con fines comerciales.
              Compartimos información estrictamente operativa con los siguientes
              encargados, que actúan en nombre y por cuenta del responsable:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <em>Supabase</em> (Estados Unidos) — base de datos y almacenamiento
                de archivos.
              </li>
              <li>
                <em>OpenAI</em> (Estados Unidos) — transcripción de audio mediante
                Whisper. Las grabaciones se envían sin metadatos personales.
              </li>
              <li>
                <em>Anthropic</em> (Estados Unidos) — evaluación de transcripciones
                mediante Claude. Las transcripciones se envían sin metadatos
                personales.
              </li>
              <li>
                <em>Twilio</em> (Estados Unidos) — entrega de mensajes y notas de
                voz por WhatsApp, únicamente para empleados que hayan consentido
                expresamente.
              </li>
              <li>
                <em>Resend</em> (Estados Unidos) — entrega de correos
                transaccionales (invitaciones, notificaciones).
              </li>
              <li>
                <em>Stripe</em> (Estados Unidos) — procesamiento de pagos del hotel
                contratante. No se procesan datos de empleados a través de Stripe.
              </li>
            </ul>
            <p>
              Cada uno de estos encargados está obligado contractualmente a
              respetar las finalidades aquí descritas y a aplicar medidas de
              seguridad equivalentes a las nuestras.
            </p>
          </Section>

          <Section num="07" title="Medidas de seguridad">
            <p>
              Aplicamos medidas administrativas, técnicas y físicas razonables para
              proteger sus datos: cifrado en reposo y en tránsito (<em>TLS 1.3</em>),
              control de acceso por rol, segregación lógica entre hoteles
              (<em>row-level security</em>), respaldos cifrados, registro de auditoría
              de operaciones sensibles, y protocolos de notificación de incidentes.
            </p>
          </Section>

          <Section num="08" title="Cambios al aviso">
            <p>
              Cualquier modificación a este aviso será publicada en esta misma
              dirección con número de versión y fecha de vigencia. Las versiones
              previas quedan archivadas. Cuando un cambio afecte finalidades
              primarias o transferencias, le notificaremos directamente y
              solicitaremos su consentimiento para continuar.
            </p>
          </Section>

          <Section num="09" title="Autoridad competente">
            <p>
              Si considera que su derecho a la protección de datos personales ha
              sido vulnerado, puede presentar una denuncia ante el{" "}
              <em>Instituto Nacional de Transparencia, Acceso a la Información y
              Protección de Datos Personales (INAI)</em>{" "}
              en{" "}
              <a
                href="https://home.inai.org.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline-offset-4 hover:underline"
              >
                home.inai.org.mx
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-16 border-t border-hair pt-10">
          <p className="caps mb-3 text-espresso-muted">Última actualización</p>
          <p className="font-sans text-t-body text-espresso-soft">
            Versión {PRIVACY_VERSION} · {PRIVACY_EFFECTIVE_DATE}. ¿Preguntas? Escriba a{" "}
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
