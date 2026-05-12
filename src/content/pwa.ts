/**
 * Spanish (es-MX) copy for the PWA layer.
 *
 * Surfaces:
 *   - /offline route
 *   - <SyncStatusChip /> mono caption states
 *   - <SWUpdateToast /> "nueva versión" toast
 *   - <OfflineBanner /> private-browsing banner
 *   - install prompt hints (shown above home + speaking section CTAs)
 *
 * Voice: dry, observed, respectful — match src/content/auth.ts. No
 * exclamation marks. Never apologise; the system saved their work, that
 * is the point.
 *
 * `<em>` is rendered globally as non-italic, weight 500, ink-blue. We use
 * it sparingly here — once on the offline page, once on the SW toast.
 */

export const OFFLINE = {
  meta: {
    title: "Sin conexión",
    description:
      "Sus respuestas están guardadas en este dispositivo. Cuando regrese la señal, se sincronizan automáticamente.",
  },
  eyebrow: "Modo sin conexión",
  headline: "Sin señal por el momento.",
  body:
    "Sus respuestas están guardadas en este dispositivo. Cuando regrese la señal, se sincronizan automáticamente — sin que usted tenga que hacer nada.",
  cta: "Reintentar",
  secondary: "Volver al inicio",
};

export const SYNC_CHIP = {
  /** queue empty: chip not rendered. */
  queued: (n: number) =>
    n === 1 ? "Guardando localmente · 1 pendiente" : `Guardando localmente · ${n} pendientes`,
  synced: (n: number) =>
    n === 1 ? "Sincronizado · 1 respuesta" : `Sincronizado · ${n} respuestas`,
  offline: (n: number) =>
    n === 1 ? "Sin conexión · 1 pendiente" : `Sin conexión · ${n} pendientes`,
};

export const SW_UPDATE = {
  /** Rendered as: "Nueva versión disponible · {Recargar}" — Recargar wrapped in <em>. */
  prefix: "Nueva versión disponible · ",
  cta: "Recargar",
  ariaLabel: "Recargar para aplicar la nueva versión",
};

export const OFFLINE_BANNER = {
  /** Shown when getDB() returned null (e.g. iOS Private Browsing). */
  body:
    "Modo privado detectado — sus respuestas no se guardarán si pierde conexión.",
};

export const INSTALL_HINT = {
  /** Inline copy for the speaking-section install nudge (Phase 8 timing). */
  beforeFirstPrompt: "Para no perder progreso, instale la app en su teléfono.",
  fallbackIOS:
    "En iPhone, toque Compartir y luego Añadir a Inicio para instalar.",
};
