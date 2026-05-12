/**
 * Practice loop UI copy — Spanish (es-MX), single source of truth.
 *
 * Keep all human-facing strings here. Components import labels from
 * this module so we never scatter Spanish through TSX.
 */

export const PRACTICE_COPY = {
  intro: {
    eyebrow: "Su práctica diaria",
    titleNew: "Su práctica de cinco minutos.",
    titleAgain: "Ya practicó hoy. Vuelva mañana.",
    description:
      "Cuatro pasos: escuchar, responder, reforzar la frase modelo y repasar tres palabras.",
    moduleLabel: "Módulo",
    levelLabel: "Nivel",
    cta: "Empezar",
    ctaAgain: "Practicar otra vez",
    streak: (n: number) => `Racha · ${n} ${n === 1 ? "día" : "días"}`,
    longest: (n: number) => `Más larga · ${n} ${n === 1 ? "día" : "días"}`,
    alreadyDone:
      "Hoy ya cuenta para su racha. Si quiere repasar otra vez, puede continuar — solo se cuenta una práctica por día.",
    backHome: "Salir",
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
      title: "Lea el escenario en español. Responda en inglés.",
      micRequest: "Solicitando acceso al micrófono…",
      micDenied:
        "No se pudo acceder al micrófono. Revise los permisos del navegador y vuelva a intentar.",
      record: "Grabar respuesta",
      stop: "Detener",
      reRecord: "Volver a grabar",
      submit: "Evaluar respuesta",
      evaluating: "Evaluando…",
      maxDuration: "Máximo 45 segundos",
      skip: "Saltar este paso",
      yourScore: "Su calificación",
      feedback: "Retroalimentación",
      modelResponse: "Respuesta modelo",
      continue: "Continuar",
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
      reveal: "Mostrar traducción",
      gradeQuestion: "¿Qué tan bien la recordó?",
      grades: [
        { value: 0, label: "No la sabía", tone: "error" },
        { value: 3, label: "Difícil", tone: "warn" },
        { value: 4, label: "Bien", tone: "neutral" },
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
