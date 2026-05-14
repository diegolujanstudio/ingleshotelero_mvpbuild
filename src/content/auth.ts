/**
 * Sign-in / app-entry copy — Inglés Hotelero, Spanish MX.
 *
 * The product app at `/` is the front door. Marketing lives separately
 * on Astro at ingleshotelero.com. This page is functional, single-
 * purpose, and EMPLOYEE-FIRST: the dominant action is for an employee
 * to start their exam. HR sign-in is a small secondary link.
 *
 * Voice: warm, direct, "you" (tú) — employees are the users.
 * `<em>` is rendered globally as non-italic, weight 500, ink-blue.
 */

export const META = {
  title: "Inglés Hotelero · Entrar",
  description:
    "Plataforma de evaluación y capacitación de inglés hotelero. Toma tu examen, practica cinco minutos al día.",
};

// ── Top utility bar ───────────────────────────────────────────
export const TOPBAR = {
  installCta: "Instalar app",
};

// ── Primary surface — Employee ───────────────────────────────
//
// Two ways an employee gets in:
//
//   1. Personal link (the easy path). HR sends them a URL like
//      `/i/{token}` via WhatsApp, email, or SMS. They tap it once and
//      they're in — no password, no code to type. The link sets a
//      session cookie that lasts a year. They can bookmark and re-tap
//      any time.
//
//   2. Hotel code (the fallback). If they don't have a personal link
//      yet, they enter their hotel's short code (slug) and start the
//      anonymous flow at `/e/{slug}`. The system creates an employee
//      record with the name + email they type.
//
// The home leads with #1 — it's how 95% of users will actually arrive.
export const EMPLOYEE = {
  eyebrow: "Empleado",
  headline: {
    before: "Tu equipo te dio un ",
    em: "enlace",
    after: ".",
  },
  sub: "Ábrelo desde tu WhatsApp o correo. Te lleva directo a tu práctica.",
  fallbackHint:
    "¿No tienes enlace? Escribe el código de tu hotel y comienza así:",
  inputLabel: "Código de tu hotel",
  inputPlaceholder: "ej. gran-hotel-cancun",
  submit: "Empezar",
  hint: "Si no sabes el código, pídelo en Recursos Humanos o recepción.",
  invalid: "El código solo lleva letras minúsculas, números y guiones.",
};

// ── Secondary surface — HR ───────────────────────────────────
export const HR = {
  eyebrow: "Recursos Humanos",
  headline: {
    before: "¿Eres ",
    em: "de RH",
    after: "?",
  },
  body: "Entra al panel para ver el inglés de tu equipo. Toma decisiones con datos, no con corazonadas.",
  cta: "Entrar al panel",
  footnote: "¿No tienes acceso? Pide una invitación a tu organización.",
};

// ── Support link (small, below HR card) ──────────────────────
export const SUPPORT_LINK = {
  caption: "¿Necesitas ayuda?",
  cta: "Soporte · escríbenos",
  href: "/soporte",
};

// ── Install prompt block ─────────────────────────────────────
export const INSTALL = {
  eyebrow: "Instalar",
  headline: {
    before: "Tenla siempre a la mano. ",
    em: "Sin tienda.",
    after: "",
  },
  sub: "Funciona como app — sin internet, sin anuncios, sin descargar de la tienda.",
  cta: "Instalar en mi teléfono",
  ctaInstalled: "Ya está instalada",
};

// ── Instruction sheets per platform ──────────────────────────
export const SHEET = {
  close: "Cerrar",
  shareIconAria: "Ícono Compartir",
  ios: {
    title: "Instalar en iPhone o iPad",
    intro: "Tres pasos en Safari:",
    steps: [
      "Toca el botón de Compartir en la barra inferior.",
      "Elige Añadir a Inicio.",
      "Confirma el nombre y toca Añadir.",
    ],
    note: "Si no usas Safari, abre este enlace en Safari primero — Chrome en iPhone no permite instalar apps.",
  },
  android: {
    title: "Instalar en Android",
    intro: "Tres pasos en Chrome:",
    steps: [
      "Toca el menú de tres puntos arriba a la derecha.",
      "Elige Instalar app o Añadir a pantalla de inicio.",
      "Confirma el nombre y toca Instalar.",
    ],
    note: "Si tu navegador es otro, busca la opción Añadir a pantalla de inicio en su menú.",
  },
  desktop: {
    title: "Instalar en computadora",
    intro: "Dos pasos en Chrome o Edge:",
    steps: [
      "Toca el ícono de instalar a la derecha de la barra de direcciones.",
      "Confirma con Instalar.",
    ],
    note: "Si no aparece el ícono, abre el menú de tres puntos y busca Instalar Inglés Hotelero.",
  },
};

// ── HR sign-in (the dedicated page at /hr/login) ─────────────
export const HR_SIGNIN = {
  eyebrow: "Acceso · Recursos Humanos",
  headline: {
    before: "Bienvenido ",
    em: "de vuelta",
    after: ".",
  },
  sub: "Inicia sesión para ver los resultados de tu equipo.",
  emailLabel: "Correo",
  emailPlaceholder: "rh@suhotel.com",
  passwordLabel: "Contraseña",
  passwordPlaceholder: "",
  submit: "Iniciar sesión",
  submitting: "Iniciando sesión…",
  magicLink: "Enviar enlace mágico",
  magicLinkComing:
    "El acceso por enlace mágico estará disponible próximamente. Usa tu contraseña por ahora.",
  forgot: "¿Olvidaste tu contraseña?",
  footer: "Solo para usuarios autorizados.",
  errorGeneric:
    "No se pudo iniciar sesión. Verifica tu correo y contraseña.",
  notConfigured:
    "Autenticación real disponible cuando Supabase esté configurado.",
};

// Legacy export kept for /hr/login imports — narrowed to what it needs.
export const EMPLOYEE_ENTRY = EMPLOYEE;

// Legacy export kept for any IOS-only callers — points at the unified sheet.
export const IOS_SHEET = {
  title: SHEET.ios.title,
  step1: { label: "1", body: SHEET.ios.steps[0] },
  step2: { label: "2", body: SHEET.ios.steps[1] },
  step3: { label: "3", body: SHEET.ios.steps[2] },
  close: SHEET.close,
  shareIconAria: SHEET.shareIconAria,
};

// ── Footer ───────────────────────────────────────────────────
export const FOOTER = {
  line: "Funciona sin internet · Datos bajo LFPDPPP",
  copyright: "© 2026 · Inglés Hotelero",
  marketingHref: "https://ingleshotelero.com",
  marketingLabel: "ingleshotelero.com →",
  links: [
    { href: "/aviso-de-privacidad", label: "Privacidad" },
    { href: "/terminos", label: "Términos" },
  ],
};
