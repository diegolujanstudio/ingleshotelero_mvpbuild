/**
 * Pitch deck — Inglés Hotelero, HR-facing, Spanish MX.
 *
 * 20 slides. Voice matches src/content/landing.ts: editorial, dry,
 * observed. Single ink accent via <em>. No bullet points where prose
 * carries the weight.
 *
 * Edit copy here without touching JSX. The renderer in
 * src/app/pitch/PitchDeck.tsx switches on `type`.
 */

import { PILOT_MAILTO } from "./landing";

type Eyebrow = string;

type Headline = {
  before?: string;
  em: string;
  after?: string;
};

export type Slide =
  | {
      kind: "cover";
      eyebrow: Eyebrow;
      headline: Headline;
      sub: string;
      footer?: string;
    }
  | {
      kind: "statement";
      eyebrow: Eyebrow;
      headline: Headline;
      body: string[];
      coda?: string;
    }
  | {
      kind: "triptych";
      eyebrow: Eyebrow;
      headline: Headline | string;
      note?: string;
      items: { label: string; caption?: string; body: string }[];
    }
  | {
      kind: "loop";
      eyebrow: Eyebrow;
      headline: Headline;
      steps: { label: string; time: string; body: string }[];
      coda?: string;
    }
  | {
      kind: "demo";
      eyebrow: Eyebrow;
      headline: Headline;
      sub: string;
      cta: { label: string; href: string };
      secondary?: { label: string; href: string };
      caption?: string;
    }
  | {
      kind: "embed";
      eyebrow: Eyebrow;
      headline: Headline;
      sub?: string;
      src: string;
      ctaLabel: string;
      ctaHref: string;
    }
  | {
      kind: "pricing";
      eyebrow: Eyebrow;
      headline: Headline;
      note?: string;
      tiers: {
        name: string;
        price: string;
        cadence: string;
        body: string;
        features: string[];
        featured?: boolean;
      }[];
    }
  | {
      kind: "checklist";
      eyebrow: Eyebrow;
      headline: Headline;
      sub?: string;
      items: string[];
      footer?: string;
    }
  | {
      kind: "qa";
      eyebrow: Eyebrow;
      headline: Headline;
      pairs: { q: string; a: string }[];
    }
  | {
      kind: "cta";
      eyebrow: Eyebrow;
      headline: Headline;
      sub: string;
      cta: { label: string; href: string };
      fineprint?: string;
    };

export const PITCH_TITLE = "Inglés Hotelero · Pitch";
export const PITCH_DESCRIPTION =
  "Diagnóstico de inglés hotelero por puesto. 15 minutos por empleado. Reporte ejecutivo. Capacitación diaria de 5 minutos por WhatsApp.";

export const SLIDES: Slide[] = [
  // 01 — Cover
  {
    kind: "cover",
    eyebrow: "Pitch · Recursos Humanos · Mayo 2026",
    headline: {
      before: "Usted mide cada kWh, cada galón, cada habitación. ",
      em: "Ahora puede medir el inglés.",
    },
    sub: "Inglés hotelero por puesto. Diagnóstico, después capacitación. En ese orden.",
    footer: "Avanzar con → · Volver con ←",
  },

  // 02 — La situación
  {
    kind: "statement",
    eyebrow: "01 · La situación",
    headline: {
      em: "La clase de los jueves",
      after: " no está funcionando.",
    },
    body: [
      "Usted lo sabe. Su director general también lo sabe. El instructor que contrataron hace nueve meses cubre un turno, se ha reportado enfermo tres veces este trimestre, y la última vez que alguien midió si el equipo mejoró fue en la reunión de presupuesto — y se midió con “yo creo que sí”.",
      "Mientras tanto, el huésped de la 412 sigue pidiendo extra towels con las manos.",
    ],
  },

  // 03 — Tres fallas
  {
    kind: "triptych",
    eyebrow: "02 · Lo que no ha funcionado",
    headline: "Tres fallas, una tras otra.",
    note:
      "Cada solución anterior falla de la misma forma: cubre parte del turno, deja cero datos, o enseña el idioma equivocado.",
    items: [
      {
        label: "Instructores presenciales",
        caption: "$750–1,250 USD / mes",
        body:
          "Cobran lo de un salario. Cubren un turno. A veces no cubren ninguno. No dejan datos — solo una hoja de asistencia firmada a mano que nadie revisa.",
      },
      {
        label: "Apps genéricas",
        caption: "duolingo · babbel",
        body:
          "Enseñan inglés conversacional. El botones no necesita discutir el clima. Necesita decir “Your luggage is on its way to room 304, sir.”",
      },
      {
        label: "Clases en aula",
        caption: "saca personal del turno",
        body:
          "Chocan con rotaciones. Cobran por hora por persona. El empleado más tímido — el que más lo necesita — no levanta la mano.",
      },
    ],
  },

  // 04 — El modelo
  {
    kind: "statement",
    eyebrow: "03 · El modelo",
    headline: {
      before: "Diagnóstico, después capacitación. ",
      em: "En ese orden.",
    },
    body: [
      "Primero evaluamos. Cada empleado toma un examen de 15 minutos diseñado específicamente para su puesto — la recepcionista responde a un check-in difícil, el botones acompaña a un huésped con equipaje, el mesero maneja una alergia. Reciben un nivel CEFR de A1 a B2. Usted recibe un reporte en PDF listo para llevar a Dirección.",
      "Después entrenamos. Cinco minutos al día, por WhatsApp o web, con el vocabulario real de su puesto. Cohortes de tres meses por módulo.",
    ],
    coda: "Cosas que no hacemos: aulas, tareas, sacar a nadie del turno, vendérselo dos veces.",
  },

  // 05 — El examen
  {
    kind: "triptych",
    eyebrow: "04 · El examen",
    headline: { em: "Quince minutos.", after: " Tres partes. Su nivel real." },
    note:
      "Diseñado por puesto. Funciona en el celular del empleado. Se pausa y retoma sin perder el avance.",
    items: [
      {
        label: "Cuestionario",
        caption: "13 preguntas · 5 min",
        body:
          "Historial con el inglés. Sin respuestas correctas o incorrectas. Sirve para contextualizar el resultado.",
      },
      {
        label: "Comprensión auditiva",
        caption: "10 audios · 5 min",
        body:
          "Situaciones reales en inglés. El empleado elige la acción correcta entre tres opciones. Máximo dos repeticiones por audio.",
      },
      {
        label: "Expresión oral",
        caption: "6 grabaciones · 5 min",
        body:
          "Escenario en español. Respuesta en inglés grabada con el micrófono del teléfono. Se permite una segunda toma por pregunta.",
      },
    ],
  },

  // 06 — Calificación con IA
  {
    kind: "triptych",
    eyebrow: "05 · La calificación",
    headline: { em: "Whisper transcribe.", after: " Claude evalúa." },
    note:
      "Cuatro dimensiones, cero puntos por examinador subjetivo. La rúbrica es la misma para todos los empleados de su hotel.",
    items: [
      {
        label: "Intención",
        caption: "0–25 puntos",
        body: "¿Entendió el escenario y respondió a lo que el huésped necesitaba?",
      },
      {
        label: "Vocabulario",
        caption: "0–25 puntos",
        body: "¿Usó las palabras del oficio? ¿Las propias del puesto, no del libro de texto?",
      },
      {
        label: "Fluidez y tono",
        caption: "0–50 puntos",
        body:
          "¿Sonó como una respuesta natural? ¿Profesional, cortés, apropiada para un huésped pagando una habitación?",
      },
    ],
  },

  // 07 — CEFR para hospitalidad
  {
    kind: "triptych",
    eyebrow: "06 · Niveles",
    headline: { em: "A1 a B2.", after: " Hospitalidad funcional." },
    note:
      "Niveles CEFR estándar, calibrados para el trabajo del piso. No mide gramática académica — mide capacidad de servicio.",
    items: [
      {
        label: "A1 — Supervivencia",
        caption: "responde frases memorizadas",
        body:
          "Saluda, da números de habitación, indica direcciones simples. No improvisa.",
      },
      {
        label: "A2–B1 — Funcional",
        caption: "maneja la mayoría de interacciones",
        body:
          "Explica políticas, resuelve problemas simples, comprende a huéspedes con acentos comunes. La meta de tres meses para empleados que entran en A1.",
      },
      {
        label: "B2 — Avanzado",
        caption: "maneja cualquier escena",
        body:
          "Negocia, personaliza, mentoría a colegas, atiende VIP. El nivel del concierge y del jefe de recepción.",
      },
    ],
  },

  // 08 — Demo del examen
  {
    kind: "demo",
    eyebrow: "07 · Pruebe el examen",
    headline: { em: "Tome el examen ahora.", after: "" },
    sub:
      "Diseñado para tomarse en quince minutos en el teléfono. Pruebe la versión completa con un hotel de demostración — funciona sin cuenta y sin tarjeta.",
    cta: { label: "Abrir el examen →", href: "/e/demo-hotel" },
    secondary: { label: "Ver pantalla de bienvenida", href: "/e/demo-hotel" },
    caption: "se abre en una pestaña nueva",
  },

  // 09 — El reporte
  {
    kind: "checklist",
    eyebrow: "08 · El entregable",
    headline: {
      em: "El PDF que llega",
      after: " al escritorio del director general.",
    },
    sub:
      "Reporte ejecutivo de cinco páginas, diseñado para imprimirse. Llega por correo cuando termina la última grabación.",
    items: [
      "Resumen ejecutivo con el hallazgo principal en una frase.",
      "Distribución de niveles A1/A2/B1/B2 por departamento.",
      "Tabla de empleados con nivel, fortalezas y áreas de mejora.",
      "Recomendación de plan de capacitación a tres meses.",
      "Metodología y referencia CEFR para la lectura del director general.",
    ],
  },

  // 10 — Dashboard
  {
    kind: "statement",
    eyebrow: "09 · Para Recursos Humanos",
    headline: {
      em: "Sepa quién mejora.",
      after: " Sepa quién no.",
    },
    body: [
      "El dashboard ordena lo que antes vivía en hojas de asistencia. Una vista por departamento, una vista por empleado, una vista por cohorte.",
      "Filtros por turno, puesto y nivel. Exportable a Excel para la junta de gerencia. Imprimible para Dirección.",
    ],
    coda: "Acceso por invitación. Cada hotel ve solamente sus propios datos.",
  },

  // 11 — Demo del dashboard
  {
    kind: "demo",
    eyebrow: "10 · Pruebe el dashboard",
    headline: { em: "Entre como gerente de RH.", after: "" },
    sub:
      "Versión de demostración con doce empleados de prueba. Todas las acciones funcionan: filtrar la tabla, abrir un perfil, ver transcripciones, exportar el PDF.",
    cta: { label: "Abrir el dashboard →", href: "/hr/login" },
    secondary: { label: "Ver el reporte ejecutivo", href: "/hr/reports" },
    caption: "modo demo · ningún dato persiste",
  },

  // 12 — Capacitación diaria
  {
    kind: "loop",
    eyebrow: "11 · La capacitación",
    headline: { before: "Cinco minutos. ", em: "Todos los días.", after: "" },
    steps: [
      {
        label: "Escuchar",
        time: "1 min",
        body: "Audio de un huésped en inglés · elegir la acción correcta entre tres.",
      },
      {
        label: "Hablar",
        time: "2 min",
        body: "Escenario en español · grabar la respuesta en inglés · IA evalúa y devuelve una frase mejor.",
      },
      {
        label: "Reforzar",
        time: "1 min",
        body: "Respuesta modelo con audio nativo · tocar para volver a practicarla.",
      },
      {
        label: "Repasar",
        time: "1 min",
        body: "Tres tarjetas de vocabulario con repetición espaciada · lo que falló vuelve antes.",
      },
    ],
    coda: "Total: cinco minutos. Por WhatsApp o web. Sin aula, sin trayecto, sin excusa.",
  },

  // 13 — Demo del simulador WhatsApp
  {
    kind: "embed",
    eyebrow: "12 · El simulador",
    headline: {
      before: "Así se ve un día ",
      em: "en su WhatsApp.",
    },
    sub:
      "Simulación interactiva del ciclo diario de cinco minutos. Toque el botón verde para avanzar. Es exactamente lo que recibe un empleado en su teléfono.",
    src: "/demo/conversacion",
    ctaLabel: "Abrir simulador en pantalla completa →",
    ctaHref: "/demo/conversacion",
  },

  // 14 — Tres módulos
  {
    kind: "triptych",
    eyebrow: "13 · Para quién",
    headline: { before: "Tres módulos. ", em: "Uno por puesto.", after: "" },
    note:
      "Cada módulo es un inventario finito de unas 300 frases funcionales, completable en tres meses con progresión A1 → A2 → B1 → B2.",
    items: [
      {
        label: "Recepción",
        caption: "resolving a check-in complaint",
        body:
          "Reservaciones, check-in, check-out, quejas, explicación de tarifas y políticas. Donde ocurre la primera y la última conversación de la estadía.",
      },
      {
        label: "Botones",
        caption: "guest arriving with luggage",
        body:
          "Recibe y acompaña al huésped. Equipaje, indicaciones, servicios a la habitación. Cada interacción es breve — y cada una deja una impresión.",
      },
      {
        label: "Restaurante / Bar",
        caption: "taking an order at the table",
        body:
          "Toma órdenes, recomienda, maneja alergias y quejas en sala. El puesto que convierte un buen hotel en una buena estadía.",
      },
    ],
  },

  // 15 — Cronograma
  {
    kind: "checklist",
    eyebrow: "14 · El cronograma",
    headline: {
      em: "De la firma al primer reporte,",
      after: " dos semanas.",
    },
    sub:
      "Calendario realista para un piloto de un departamento. Mismo proceso para hoteles de 30 o de 300 empleados.",
    items: [
      "Día 1 — llamada de inicio · creación del hotel en el sistema · enlace de evaluación.",
      "Día 2 a 7 — ventana de evaluación · empleados toman el examen en su tiempo libre.",
      "Día 8 — calificación de todas las grabaciones por IA · generación del reporte PDF.",
      "Día 9 a 10 — reunión de resultados con Recursos Humanos.",
      "Día 11 en adelante — comienza la capacitación diaria por WhatsApp.",
    ],
    footer: "El cronograma se mueve al ritmo de su departamento, no al revés.",
  },

  // 16 — Precios
  {
    kind: "pricing",
    eyebrow: "15 · Precios",
    headline: {
      em: "Por propiedad.",
      after: " No por empleado.",
    },
    note:
      "El examen de colocación se cobra una vez ($50 USD por empleado) — el wedge para entrar al hotel. La capacitación es la suscripción mensual que viene después.",
    tiers: [
      {
        name: "Inicial",
        price: "$150",
        cadence: "USD / mes",
        body: "Para una propiedad pequeña con un departamento.",
        features: [
          "Hasta 30 empleados",
          "Un módulo de puesto",
          "Reporte semanal por correo",
          "Soporte por correo",
        ],
      },
      {
        name: "Profesional",
        price: "$300",
        cadence: "USD / mes",
        body: "Para una propiedad mediana cubriendo varios departamentos.",
        features: [
          "Hasta 75 empleados",
          "Los tres módulos de puesto",
          "Reporte semanal y mensual",
          "Capacitación por WhatsApp",
          "Soporte prioritario",
        ],
        featured: true,
      },
      {
        name: "Empresarial",
        price: "Desde $500",
        cadence: "USD / mes",
        body: "Para cadenas y propiedades grandes.",
        features: [
          "Empleados ilimitados",
          "Multi-propiedad para cadenas",
          "Contenido a la medida",
          "Account manager dedicado",
        ],
      },
    ],
  },

  // 17 — El piloto
  {
    kind: "statement",
    eyebrow: "16 · La propuesta",
    headline: {
      em: "Un piloto gratis.",
      after: " Un departamento. Un mes.",
    },
    body: [
      "Elija un departamento — recepción, botones, o restaurante. Evaluamos a los empleados, entregamos el reporte, y los capacitamos durante cuatro semanas. Sin cobro. Sin compromiso.",
      "Al final usted tiene tres cosas que antes no tenía: datos, una decisión informada, y empleados que ya están mejorando.",
    ],
    coda: "Respuesta en menos de 24 horas hábiles. Sin tarjeta de crédito. Sin letra chica.",
  },

  // 18 — Qué incluye
  {
    kind: "checklist",
    eyebrow: "17 · Qué incluye",
    headline: {
      em: "Lo que recibe en el piloto.",
    },
    sub:
      "Cuatro semanas. Cero costo. Cero compromiso al finalizar. La cotización viene al final, si usted decide continuar.",
    items: [
      "Evaluación CEFR por puesto · examen de 15 minutos por empleado.",
      "Reporte PDF ejecutivo para Dirección y Gerencia General.",
      "Capacitación diaria de 5 minutos por WhatsApp durante 4 semanas.",
      "Acceso al dashboard de Recursos Humanos durante todo el piloto.",
      "Reunión de resultados al cierre · cotización a la medida si desea continuar.",
    ],
  },

  // 19 — Preguntas comunes
  {
    kind: "qa",
    eyebrow: "18 · Lo que está pensando",
    headline: {
      em: "Preguntas directas",
      after: ", respuestas directas.",
    },
    pairs: [
      {
        q: "Mi equipo no va a descargar otra app.",
        a: "Por eso vivimos en WhatsApp. Ya está instalado.",
      },
      {
        q: "¿Qué garantiza que mejoren?",
        a: "Nada lo garantiza. Lo que sí garantizamos es que usted lo sabrá.",
      },
      {
        q: "Dirección no aprobará un vendor nuevo así de fácil.",
        a: "Por eso el piloto es gratis. Si no convence, nadie firma nada.",
      },
      {
        q: "¿Qué datos se llevan?",
        a: "Lo mínimo. Bajo LFPDPPP de México. Borrado total disponible siempre.",
      },
    ],
  },

  // 20 — Cierre
  {
    kind: "cta",
    eyebrow: "19 · Siguiente paso",
    headline: {
      before: "Las clases de los jueves no van a mejorar. ",
      em: "Escríbanos.",
    },
    sub:
      "Dos semanas desde hoy, su equipo puede tener un diagnóstico en PDF, un plan de tres meses, y el primer día de capacitación en su WhatsApp.",
    cta: { label: "Pedir mi piloto gratis", href: PILOT_MAILTO },
    fineprint:
      "Respuesta personal de Diego, fundador. Sin formularios largos. Sin bots.",
  },
];
