/**
 * Sign-in / app-entry copy — Inglés Hotelero, Spanish MX.
 *
 * The product app at `/` is the front door. Marketing lives separately
 * on Astro at ingleshotelero.com — that site is editorial. This page is
 * functional: HR sign-in is the primary action, employee entry the
 * secondary, and PWA install is the new dominant onboarding lever.
 *
 * Voice: editorial, dry, observed. Match the tone of src/content/landing.ts
 * but cut the marketing rhetoric — this is a door, not a hero.
 *
 * `<em>` is rendered globally as non-italic, weight 500, ink-blue.
 */

export const META = {
  title: "Inglés Hotelero · Acceso",
  description:
    "Plataforma de evaluación y capacitación de inglés hotelero. Acceso para Recursos Humanos y empleados con un enlace de su hotel.",
};

export const HR_SIGNIN = {
  eyebrow: "Acceso · Recursos Humanos",
  headline: {
    before: "Inglés ",
    em: "Hotelero",
    after: ".",
  },
  sub: "El panel donde ve el inglés de su equipo. Acceso por invitación de su organización.",
  emailLabel: "Correo",
  emailPlaceholder: "rh@suhotel.com",
  passwordLabel: "Contraseña",
  passwordPlaceholder: "",
  submit: "Iniciar sesión",
  submitting: "Iniciando sesión…",
  magicLink: "Enviar enlace mágico",
  magicLinkComing: "El acceso por enlace mágico estará disponible próximamente. Use su contraseña por ahora.",
  forgot: "¿Olvidó su contraseña?",
  footer: "Solo para usuarios autorizados. Pida una invitación a su organización.",
  errorGeneric: "No se pudo iniciar sesión. Verifique su correo y contraseña.",
  notConfigured:
    "Autenticación real disponible cuando Supabase esté configurado. Ver SETUP.md.",
};

export const EMPLOYEE_ENTRY = {
  eyebrow: "Empleado · Tomar el examen",
  body: "Si tiene un enlace de su hotel, ábralo desde su WhatsApp o navegador. Si conoce el código de su hotel, escríbalo aquí:",
  inputLabel: "Código del hotel",
  inputPlaceholder: "gran-hotel-cancun",
  submit: "Ir",
  invalid: "El código solo lleva letras minúsculas, números y guiones.",
};

export const INSTALL = {
  eyebrow: "Instalar",
  headline: {
    before: "Funciona como una app. ",
    em: "Sin tienda.",
    after: "",
  },
  body: "Para no depender del navegador, instálela en su teléfono o computadora. Ocupa menos de 2 MB. Funciona sin internet.",
  cta: "Instalar como app",
  ctaPending: "Preparando instalación…",
  alreadyInstalled: "Ya está instalada en este dispositivo.",
};

export const IOS_SHEET = {
  title: "Cómo instalar en iPhone o iPad",
  step1: {
    label: "1",
    body: "Toque el botón de Compartir en la barra inferior de Safari.",
  },
  step2: {
    label: "2",
    body: "Elija la opción Añadir a Inicio.",
  },
  step3: {
    label: "3",
    body: "Confirme el nombre y toque Añadir. Aparecerá en su pantalla de inicio como una app más.",
  },
  close: "Cerrar",
  shareIconAria: "Ícono Compartir de iOS",
};

export const FOOTER = {
  line: "Funciona sin internet · Cero anuncios · Datos bajo LFPDPPP",
  copyright: "© 2026 · Inglés Hotelero · México",
  marketingHref: "https://ingleshotelero.com",
  marketingLabel: "ingleshotelero.com →",
  links: [
    { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
    { href: "/terminos", label: "Términos" },
    { href: "mailto:hola@ingleshotelero.com", label: "Soporte" },
  ],
};
