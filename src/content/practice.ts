/**
 * Practice loop UI copy — Spanish (es-MX), single source of truth.
 *
 * Keep all human-facing strings here. Components import labels from
 * this module so we never scatter Spanish through TSX.
 */

export const PRACTICE_COPY = {
  intro: {
    // Learner-facing copy is `tú` per LATAM-UX-DOCTRINE §1.1. `usted` is the
    // register of the government trámite — the institution that already failed
    // this learner at school. We do not import that association.
    eyebrow: "Tu práctica diaria",
    titleNew: "Tu práctica de cinco minutos.",
    titleAgain: "Ya practicaste hoy. Nos vemos mañana.",
    description:
      "Cuatro pasos: escuchar, responder, reforzar la frase modelo y repasar unas palabras.",
    moduleLabel: "Módulo",
    levelLabel: "Nivel",
    cta: "Empezar",
    ctaAgain: "Practicar otra vez",
    streak: (n: number) => `Racha · ${n} ${n === 1 ? "día" : "días"}`,
    longest: (n: number) => `Más larga · ${n} ${n === 1 ? "día" : "días"}`,
    alreadyDone:
      "Hoy ya cuenta. Si quieres repasar otra vez, adelante — solo contamos una práctica por día.",
    backHome: "Salir",

    // ── El regreso suave (Law 5) ────────────────────────────────────
    // Shown when a learner returns after 3+ days away. No guilt, no mention
    // of the streak they lost, no backlog. Just a welcome and a short session.
    returnWelcomeTitle: "Qué bueno que volviste.",
    returnWelcomeBody:
      "Hoy la hacemos cortita. Un par de minutos y listo.",
  },
  steps: {
    listening: {
      number: "01",
      label: "Escuchar",
      title: "Un huésped le dice algo en inglés. Elija la acción correcta.",
      play: "Reproducir audio",
      replay: "Repetir audio",
      loadingAudio: "Cargando audio…",
      noAudio: "Sin audio disponible — use lectura en voz alta",
      continue: "Continuar",
    },
    speaking: {
      number: "02",
      label: "Responder",
      // Coach voice, not evaluator voice: we ask them to say it, not to be
      // graded on it. Learner-facing copy is `tú` per LATAM-UX-DOCTRINE §1.1.
      title: "Lee la situación. Contéstala en inglés.",
      micRequest: "Pidiendo acceso al micrófono…",
      micDenied:
        "No pudimos usar el micrófono. Revisa los permisos de tu navegador e inténtalo otra vez.",
      record: "Grabar mi respuesta",
      stop: "Listo",
      reRecord: "Grabar otra vez",
      submit: "Enviar",
      evaluating: "Escuchando…",
      maxDuration: "Máximo 45 segundos",
      skip: "Saltar este paso",
      /** What the Coach understood. Replaces the old score display. */
      understood: "Te entendí",
      /** Modeling, framed as an option — never as a correction. */
      anotherWay: "Otra forma de decirlo",
      continue: "Seguir",
    },
    reinforce: {
      number: "03",
      label: "Reforzar",
      title: "Frase modelo",
      listen: "Escuchar",
      practiceAgain: "Volver a practicarlo",
      stopRecording: "Detener",
      attemptSent: "Su intento se envió. Bien hecho.",
      continue: "Continuar",
    },
    review: {
      number: "04",
      label: "Repasar",
      title: "Repaso de vocabulario",
      titleEmpty: "No hay palabras pendientes hoy.",
      noteEmpty:
        "Vuelva mañana — la repetición espaciada irá colocando palabras nuevas en su repaso conforme avance.",
      reveal: "Ver la traducción",
      revealHint: "Primero intenta recordarla. Luego toca para comprobar.",
      gradeQuestion: "¿Te acordabas de esta palabra?",
      grades: [
        { value: 0, label: "No la sabía", tone: "error" },
        { value: 3, label: "Más o menos", tone: "warn" },
        { value: 4, label: "Sí, la sabía", tone: "neutral" },
        { value: 5, label: "Muy fácil", tone: "success" },
      ] as const,
      continue: "Terminar",
      nextOf: (current: number, total: number) => `${current} de ${total}`,
    },
  },
  done: {
    eyebrow: "Día completo",
    eyebrowExtra: "Listo",
    titleTicked: (n: number) =>
      `Racha de ${n} ${n === 1 ? "día" : "días"}.`,
    titleExtra: "Buena práctica adicional.",
    notePrimary:
      "Vuelva mañana para sumar el siguiente día. Si pasa más de un día sin practicar, la racha se reinicia.",
    noteExtra:
      "Esta práctica adicional no afecta su racha — solo cuenta una por día, pero el repaso siempre suma.",
    home: "Volver al inicio",
    again: "Practicar otra vez",
    summary: {
      current: "Racha actual",
      longest: "Racha más larga",
      reviewed: "Palabras repasadas",
    },
  },
  errors: {
    drillNotFound:
      "No se encontró la práctica de hoy. Vuelva al inicio e intente nuevamente.",
    networkOffline:
      "Sin conexión. Su progreso se guardará y se sincronizará cuando vuelva la red.",
    saveFailed:
      "No pudimos guardar su progreso. Su racha local sigue contando.",
  },
} as const;
