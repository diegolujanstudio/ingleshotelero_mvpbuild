/**
 * Spanish (es-MX) copy for the public Netlify-Forms-driven flows.
 *
 * Two forms ship today:
 *   - `pilot`   → /contacto      (lead capture for the free pilot)
 *   - `soporte` → /soporte       (support / general questions)
 *
 * Voice: editorial, "tú", warm. Diego the founder writes back personally —
 * keep it human. `<em>` is rendered globally as non-italic, weight 500,
 * ink-blue and is the only accent.
 *
 * Keep ALL user-visible Spanish here. Components must not hardcode strings.
 */

// ─────────────────────────────────────────────────────────────
// /contacto · pilot intake
// ─────────────────────────────────────────────────────────────
export const PILOT = {
  meta: {
    title: "Pide tu piloto · Inglés Hotelero",
    description:
      "Cuatro semanas, un departamento, sin tarjeta. Cuéntanos de tu hotel y te respondemos personalmente en menos de 24 horas hábiles.",
  },
  eyebrow: "01 · Piloto gratis",
  headline: {
    before: "Pide tu piloto ",
    em: "gratis",
    after: ".",
  },
  sub: "Cuatro semanas. Un departamento. Sin tarjeta de crédito.",
  body:
    "Cuéntanos lo básico de tu hotel. Te respondemos personalmente en menos de veinticuatro horas hábiles con próximos pasos: enlace de evaluación para tus empleados, llamada breve, fecha del primer reporte.",
  details: [
    {
      num: "01",
      label: "Sin tarjeta de crédito",
      body: "No pedimos métodos de pago para el piloto. Si decides continuar al final, cotizamos a tu medida.",
    },
    {
      num: "02",
      label: "Sin formularios largos",
      body: "Solo lo necesario para responder con sentido. Lo demás se decide en una llamada de quince minutos.",
    },
    {
      num: "03",
      label: "Sin bots",
      body: "Diego, fundador, lee y responde cada solicitud personalmente. Si no es buen ajuste, te lo decimos.",
    },
  ],
  fields: {
    name: { label: "Nombre completo", placeholder: "María López" },
    email: { label: "Correo de trabajo", placeholder: "maria.lopez@hotel.com" },
    phone: { label: "WhatsApp", placeholder: "+52 55 1234 5678", optional: "opcional" },
    company: { label: "Hotel", placeholder: "Hotel Casa de la Marquesa" },
    hotelCount: {
      label: "Número de propiedades",
      placeholder: "1",
      optional: "opcional",
    },
    city: { label: "Ciudad", placeholder: "Querétaro, MX", optional: "opcional" },
    role: {
      label: "Tu cargo",
      placeholder: "Selecciona tu cargo",
      options: [
        { value: "Recursos Humanos", label: "Recursos Humanos" },
        { value: "Gerencia General", label: "Gerencia General" },
        { value: "Dueño", label: "Dueño / Socio" },
        { value: "Otro", label: "Otro" },
      ],
    },
    message: {
      label: "Cualquier contexto adicional",
      placeholder:
        "Quiero arrancar antes del verano, prioridad recepción internacional…",
      optional: "opcional",
    },
  },
  submit: {
    idle: "Pedir mi piloto gratis",
    submitting: "Enviando…",
  },
  reassurance: "Respuesta personal en menos de 24 horas hábiles",
  thanks: {
    meta: {
      title: "Solicitud recibida · Inglés Hotelero",
      description: "Recibimos tu solicitud. Te respondemos en menos de 24 horas hábiles.",
    },
    eyebrow: "Solicitud recibida",
    headline: {
      before: "Te respondemos ",
      em: "en menos de 24 horas",
      after: ".",
    },
    body: "Diego, el fundador, recibe tu mensaje y te escribe personalmente desde hola@ingleshotelero.com. Si pasa el día y no recibes respuesta, revisa la carpeta de no deseado o escríbenos directamente.",
    backHome: "Volver al inicio",
    backHomeHref: "/",
    secondary: [
      { href: "/pitch", label: "Mientras tanto, ve el pitch →" },
      { href: "/demo/conversacion", label: "Prueba el simulador de WhatsApp →" },
    ],
  },
} as const;

// ─────────────────────────────────────────────────────────────
// /soporte · support intake
// ─────────────────────────────────────────────────────────────
export const SOPORTE = {
  meta: {
    title: "Soporte · Inglés Hotelero",
    description:
      "¿Necesitas ayuda con tu cuenta, examen o suscripción? Escríbenos. Respuesta personal en menos de 24 horas hábiles.",
  },
  eyebrow: "Soporte",
  headline: {
    before: "¿Cómo te ",
    em: "ayudamos",
    after: "?",
  },
  sub: "Respuesta personal en menos de 24 horas hábiles.",
  body:
    "Cuéntanos qué pasa. Si es algo de tu cuenta o de tu suscripción, incluye el correo que registraste para encontrarte rápido.",
  details: [
    {
      num: "01",
      label: "Acceso al panel",
      body: "Olvidaste tu contraseña, no llega el correo de invitación, no puedes ver a un empleado.",
    },
    {
      num: "02",
      label: "Examen o práctica",
      body: "Una grabación no se subió, un empleado no aparece, una pregunta de calificación.",
    },
    {
      num: "03",
      label: "Facturación",
      body: "Cambios de plan, factura CFDI, cancelación, cualquier duda comercial.",
    },
  ],
  fields: {
    name: { label: "Nombre", placeholder: "María López" },
    email: {
      label: "Correo registrado",
      placeholder: "maria.lopez@hotel.com",
    },
    phone: { label: "WhatsApp", placeholder: "+52 55 1234 5678", optional: "opcional" },
    company: { label: "Hotel", placeholder: "Hotel Casa de la Marquesa", optional: "opcional" },
    topic: {
      label: "Tema",
      placeholder: "Selecciona un tema",
      options: [
        { value: "Acceso al panel", label: "Acceso al panel" },
        { value: "Examen", label: "Examen" },
        { value: "Práctica diaria", label: "Práctica diaria" },
        { value: "Facturación", label: "Facturación" },
        { value: "Otro", label: "Otro" },
      ],
    },
    message: {
      label: "Cuéntanos",
      placeholder:
        "Describe lo que pasa con el mayor detalle posible. Si tienes capturas, mándalas a soporte@ingleshotelero.com con tu mismo correo.",
    },
  },
  submit: {
    idle: "Enviar mensaje",
    submitting: "Enviando…",
  },
  reassurance: "Respuesta personal en menos de 24 horas hábiles",
  thanks: {
    meta: {
      title: "Mensaje recibido · Inglés Hotelero",
      description:
        "Recibimos tu mensaje de soporte. Te respondemos en menos de 24 horas hábiles.",
    },
    eyebrow: "Mensaje recibido",
    headline: {
      before: "Gracias. Te respondemos ",
      em: "en menos de 24 horas hábiles",
      after: ".",
    },
    body: "Si tu situación bloquea operación hoy, escríbenos también a hola@ingleshotelero.com con tu nombre y el de tu hotel — lo escalamos directo.",
    backHome: "Volver al inicio",
    backHomeHref: "/",
  },
} as const;

// Hidden honeypot field name shared by both forms. Real users never see this;
// bots fill every input they find. Submissions where this is non-empty are
// silently dropped (Netlify does this automatically when `netlify-honeypot`
// is set on the form, and we double-check on the webhook side).
export const HONEYPOT_FIELD = "bot-field";

// Form names — must match the value of the hidden `form-name` input AND the
// `form_name` column in the leads table.
export const FORM_NAME = {
  pilot: "pilot",
  soporte: "soporte",
} as const;

export type FormName = (typeof FORM_NAME)[keyof typeof FORM_NAME];
