/**
 * Landing page copy — Inglés Hotelero, HR-facing, Spanish MX.
 *
 * Edited here so Diego can iterate on language without touching JSX.
 * Full copy reference and rationale in `.orcha/landing-copy.md`.
 *
 * Voice: editorial, dry, observed. Confident without being loud.
 * Emphasis (`<em>`) is used sparingly — in the UI, those words become
 * ink-colored and medium-weight via the global em override.
 */

export const NAV = [
  { href: "#por-que", label: "Por qué funciona" },
  { href: "#como", label: "Cómo funciona" },
  { href: "/precios", label: "Precios" },
  { href: "/demo/conversacion", label: "Ver simulador" },
  { href: "/contacto", label: "Contacto" },
];

// Primary CTA target for "Pedir piloto". Points to the lead capture form
// at /contacto; the form posts to /api/contacto which stores leads in
// Supabase + emails Diego via Resend (with graceful fallback).
//
// The constant name preserves the original import contract; treat it as
// "primary pilot CTA href" rather than literally a mailto.
export const PILOT_MAILTO = "/contacto";

// Backup direct mailto for the FAQ and footer, when a user prefers email.
export const PILOT_MAILTO_DIRECT =
  "mailto:hola@ingleshotelero.com?subject=Piloto%20gratis%20para%20mi%20hotel&body=Hola%20Diego%2C%0A%0AMe%20interesa%20un%20piloto%20gratis%20para%20un%20departamento.%0A%0ANombre%3A%20%0AHotel%3A%20%0ACiudad%3A%20%0ADepartamento%20que%20me%20interesa%20evaluar%20(recepci%C3%B3n%20%2F%20botones%20%2F%20restaurante)%3A%20%0AN%C3%BAmero%20aproximado%20de%20empleados%3A%20%0A%0AGracias.";

export const HERO = {
  eyebrow: "01 · Para Recursos Humanos y Dirección",
  headline: {
    before: "Usted mide cada kWh, cada galón, cada habitación. ",
    em: "Ahora puede medir el inglés.",
  },
  sub: "Inglés Hotelero diagnostica a su equipo en 15 minutos y los capacita 5 minutos al día — en el teléfono que ya usan. Con contenido construido desde el piso, no desde un libro de texto.",
  primaryCta: "Pedir piloto gratis",
  secondaryCta: "Cómo funciona",
  figureCaption: "empleado practica en su celular · recursos humanos lee el reporte",
};

export const SITUATION = {
  eyebrow: "02 · La situación",
  headline: {
    em: "La clase de los jueves",
    after: " no está funcionando.",
  },
  paragraphs: [
    "Usted lo sabe. Su director general también lo sabe. El instructor que contrataron hace nueve meses cubre un turno, se ha reportado enfermo tres veces este trimestre, y la última vez que alguien midió si el equipo mejoró fue en la reunión de presupuesto — y se midió con \u201Cyo creo que sí\u201D.",
    "Mientras tanto, el huésped de la 412 sigue pidiendo extra towels con las manos.",
  ],
};

export const FAILURES = {
  eyebrow: "03 · Lo que no ha funcionado",
  headline: "Tres fallas, una tras otra.",
  note: "Cada solución anterior falla de la misma forma: cubre parte del turno, deja cero datos, o enseña el idioma equivocado.",
  items: [
    {
      label: "Instructores presenciales",
      body:
        "Cobran lo de un salario. Cubren un turno. A veces no cubren ninguno. No dejan datos — solo una hoja de asistencia, firmada a mano, que nadie revisa.",
    },
    {
      label: "Apps genéricas",
      body:
        "Duolingo. Babbel. Enseñan inglés conversacional — el clima, los hobbies, el desayuno. El botones no necesita discutir el clima con el huésped. Necesita decir \u201CYour luggage is on its way to room 304, sir.\u201D",
    },
    {
      label: "Clases presenciales en sala",
      body:
        "Sacan al empleado del turno. Chocan con rotaciones. Cobran por hora por persona. Y el empleado más tímido del grupo — usualmente el que más lo necesita — no levanta la mano.",
    },
  ],
};

export const MODEL = {
  eyebrow: "04 · Qué es esto en su lugar",
  headline: {
    before: "Diagnóstico, después capacitación. ",
    em: "En ese orden.",
  },
  paragraphs: [
    "Primero evaluamos. Cada empleado toma un examen de 15 minutos diseñado específicamente para su puesto — la recepcionista responde a un check-in difícil, el botones acompaña a un huésped con equipaje, el mesero maneja una alergia. Reciben un nivel CEFR de A1 a B2. Usted recibe un reporte en PDF listo para llevar a Dirección.",
    "Después entrenamos. Cinco minutos al día, por WhatsApp o web, con el vocabulario real de su puesto. Repetición espaciada, voz corregida por IA, progreso medible semana tras semana. Cohortes de tres meses por módulo.",
  ],
  coda: "Cosas que no hacemos: aulas, tareas, sacar a nadie del turno, vendérselo dos veces.",
};

export const PILLARS = {
  eyebrow: "05 · Por qué funciona",
  headline: "Cinco fallas, resueltas a la vez.",
  note:
    "Los instructores cuestan demasiado y cubren un turno. Las apps enseñan conversación, no recepción. Las clases chocan con rotaciones. Aquí cambia el modelo.",
  items: [
    {
      title: "Relevancia",
      caption: "real hotel scenarios, not textbook English",
      body:
        "El contenido se construye desde situaciones reales del hotel: el huésped cuya reservación no coincide con la habitación, la queja por el Wi-Fi, la alergia en el desayuno, la cuenta que se divide entre seis. Nada de clima ni hobbies.",
    },
    {
      title: "Acceso",
      caption: "24/7 on the employee's own phone",
      body:
        "Disponible en WhatsApp y web. El turno de noche practica a las 3 a.m. El botones, en una tarde lenta. Sin aula, sin horarios, sin trayecto.",
    },
    {
      title: "Medición",
      caption: "the PDF that lands on the GM's desk",
      body:
        "Recursos Humanos ve quién practica, quién mejora y quién necesita ayuda. La capacitación en inglés deja de ser un gasto invisible — y se convierte en una inversión auditable, con reporte PDF y exportables a Excel.",
    },
    {
      title: "Velocidad",
      caption: "one hotel, fully assessed, in a week",
      body:
        "Un empleado se evalúa en 15 minutos. Un hotel tiene a todo su equipo diagnosticado en una semana. Resultados y recomendaciones, inmediatos.",
    },
  ],
};

export const LOOP = {
  eyebrow: "06 · Cómo aprenden",
  headline: {
    before: "Cinco minutos al día. ",
    em: "Todos los días.",
  },
  note:
    "El ciclo se construyó alrededor de la ciencia de la repetición espaciada: sesiones cortas y frecuentes superan a clases largas y ocasionales. Cada día es un hábito, no una tarea.",
  steps: [
    {
      label: "Escuchar",
      time: "1 min",
      body: "Oye a un huésped hablar en inglés y elige la acción correcta entre tres opciones.",
    },
    {
      label: "Hablar",
      time: "2 min",
      body: "Lee un escenario en español y graba su respuesta en inglés. La IA evalúa pronunciación, vocabulario, intención y tono — y devuelve una frase mejor.",
    },
    {
      label: "Reforzar",
      time: "1 min",
      body: "Ve y escucha la respuesta modelo con audio nativo. Toca para volver a practicarla.",
    },
    {
      label: "Repasar",
      time: "1 min",
      body: "Tres tarjetas de vocabulario con repetición espaciada. Lo que falló vuelve antes.",
    },
  ],
  coda: "Total: cinco minutos. Entregado por WhatsApp o web. Sin aula, sin trayecto, sin excusa.",
};

export const MODULES = {
  eyebrow: "07 · Para quién",
  headline: {
    before: "Tres módulos. ",
    em: "Uno por puesto.",
  },
  note:
    "Cada módulo es un inventario finito de unas 300 frases funcionales, completable en 3 meses con progresión A1 → A2 → B1 → B2. Nada de \u201Cinglés en general\u201D — solo el inglés que el puesto necesita.",
  items: [
    {
      label: "Recepción",
      caption: "resolving a check-in complaint",
      body:
        "Gestiona reservaciones, check-in y check-out, quejas y explicación de tarifas y políticas. Donde ocurre la primera y la última conversación de la estadía.",
    },
    {
      label: "Botones",
      caption: "guest arriving with luggage",
      body:
        "Recibe y acompaña al huésped. Maneja equipaje, indicaciones y servicios a la habitación. Cada interacción es breve — y cada una deja una impresión.",
    },
    {
      label: "Restaurante y Bar",
      caption: "taking an order at the table",
      body:
        "Toma órdenes, recomienda platillos, maneja alergias y resuelve quejas en sala. El puesto que convierte un buen hotel en una buena estadía.",
    },
  ],
  footer: "A1 → A2 → B1 → B2 · 3 meses por módulo",
};

export const FAQ = {
  eyebrow: "08 · Lo que probablemente está pensando",
  headline: {
    em: "Preguntas directas",
    after: ", respuestas directas.",
  },
  items: [
    {
      q: "Mi equipo no va a descargar otra app.",
      a: "Por eso vivimos en WhatsApp. Ya está instalado. Ya lo revisan cincuenta veces al día. Nosotros solo aparecemos una vez.",
    },
    {
      q: "Mi turno nocturno casi no usa inglés.",
      a: "La mayoría del tiempo, no. Pero el 8% de las veces que llega un huésped a las 2 a.m. pidiendo un médico, ese turno resuelve una escena completa en inglés. Queremos que la ganen.",
    },
    {
      q: "¿Qué garantiza que mejoren?",
      a: "Nada lo garantiza — ni nosotros, ni un instructor, ni una escuela. Lo que sí garantizamos es que usted lo sabrá. Cada semana. En un PDF que puede imprimir.",
    },
    {
      q: "Dirección no aprobará un vendor nuevo así de fácil.",
      a: "Por eso empezamos con un piloto gratis: un departamento, un mes. Si no convence, nadie firma nada. Si convence — y suele convencer — es usted quien se lo presenta a Dirección.",
    },
    {
      q: "¿Y si mis empleados no saben nada de inglés?",
      a: "Mejor. Nuestra evaluación está calibrada para ser generosa con niveles A1 y A2 — los empleados que intentan comunicarse, aunque sea con frases cortas, suben rápido. La capacitación se adapta al punto de partida, no al revés.",
    },
    {
      q: "¿Qué datos se llevan de mis empleados?",
      a: "Solo lo necesario: nombre, puesto, correo opcional, WhatsApp opcional, y grabaciones de voz usadas únicamente para evaluación. Todo bajo la LFPDPPP de México. Las grabaciones se eliminan automáticamente después de la evaluación. Puede solicitar borrado total en cualquier momento.",
    },
  ],
};

export const PILOT = {
  eyebrow: "09 · La propuesta",
  headline: {
    before: "Un piloto gratis. ",
    em: "Un departamento. Un mes.",
  },
  body:
    "Elija un departamento — recepción, botones, o restaurante. Evaluamos a los empleados, entregamos el reporte, y los capacitamos durante cuatro semanas. Sin cobro. Sin compromiso. Al final usted tiene tres cosas que antes no tenía: datos, una decisión informada, y empleados que ya están mejorando.",
  includes: [
    "Evaluación CEFR por puesto (examen de 15 min por empleado)",
    "Reporte PDF ejecutivo para Dirección y Gerencia General",
    "Capacitación diaria de 5 min por WhatsApp durante 4 semanas",
    "Una reunión de resultados al finalizar",
    "Cotización a la medida si desea continuar",
  ],
  cta: "Pedir mi piloto gratis",
  fineprint:
    "Respuesta en menos de 24 horas hábiles · Sin tarjeta de crédito · Sin letra chica",
};

export const FINAL_CTA = {
  eyebrow: "10 · Siguiente paso",
  headline: {
    before: "Las clases de los jueves no van a mejorar. ",
    em: "Escríbanos.",
  },
  sub:
    "Dos semanas desde hoy su equipo puede tener un diagnóstico en PDF, un plan de tres meses, y el primer día de capacitación en su WhatsApp.",
  cta: "Pedir piloto gratis",
  fineprint: "Respuesta personal de Diego, fundador. No bots. No formularios largos.",
};
