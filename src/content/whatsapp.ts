/**
 * WhatsApp conversation copy — es-MX.
 *
 * All learner-facing WhatsApp strings live here (mirrors the src/content/
 * convention). Tone: professional, warm, never infantilizing — the same
 * register as the web practice loop (PRACTICE_COPY). Plain text only;
 * WhatsApp renders *bold* with single asterisks.
 *
 * The engine (src/lib/whatsapp/engine.ts) is pure and imports only these
 * strings, so copy edits never require touching state-machine logic.
 */

export const WHATSAPP_COPY = {
  /** Greeting prefix used when today's drill is delivered inbound. */
  greeting: (firstName: string) =>
    firstName
      ? `¡Hola, ${firstName}! Aquí está su práctica de inglés de hoy.`
      : "¡Hola! Aquí está su práctica de inglés de hoy.",

  /** Header above the numbered options in a listening drill. */
  listeningPrompt:
    "Un huésped le dice esto en inglés. ¿Cuál es la acción correcta? Responda con el número.",

  correct: "✅ ¡Correcto!",
  incorrect: (correctNumber: number) =>
    `❌ No exactamente. La respuesta correcta era la opción ${correctNumber}.`,

  /** Label before the model English phrase. */
  modelLabel: "Frase modelo en inglés:",

  /** Spoken-step invitation (only when speaking is enabled for the drill). */
  speakingPrompt:
    "Ahora practíquelo usted: envíe una nota de voz diciendo la frase en inglés, o escriba LISTO para terminar por hoy.",

  audioReceived:
    "🎧 Recibimos su nota de voz. La evaluamos y le compartimos su avance.",
  skipAudioOk: "Perfecto, lo dejamos por hoy.",

  /** Core completion line (no streak number — the route appends the streak). */
  doneCore:
    "¡Terminó su práctica de hoy! Mañana le enviamos el siguiente ejercicio. 👏",

  /** Streak line the route appends after a real tick. */
  streakLine: (days: number) =>
    days <= 1
      ? "Empezó su racha: 1 día seguido. Vuelva mañana para sumar el segundo."
      : `Lleva ${days} días seguidos. ¡Siga así!`,

  /** Already completed today (any further inbound while state = done). */
  alreadyDone:
    "Ya completó su práctica de hoy. Nos vemos mañana con el siguiente ejercicio.",

  /** Unparseable reply while awaiting an option choice. */
  notRecognized: (optionCount: number) =>
    `No reconocí su respuesta. Responda con un número del 1 al ${optionCount}.`,

  /** Opt-out (BAJA / STOP / CANCELAR) confirmation — compliance copy. */
  optOutConfirm:
    "Listo, no le enviaremos más mensajes de práctica. Si desea reactivarlos, escriba a su gerente de Recursos Humanos. ¡Gracias!",

  /** Fallback when the phone is not a known/opted-in employee. */
  unknownEmployee:
    "Hola. Este número no está registrado en Inglés Hotelero. Si su hotel usa nuestro programa, pida a Recursos Humanos que lo dé de alta con este WhatsApp.",

  /** Generic internal-error apology (keeps Twilio from retrying forever). */
  internalError:
    "Tuvimos un problema técnico por un momento. Por favor, responda de nuevo en un minuto.",
} as const;

/**
 * Meta / WhatsApp Business template BODIES (pending Meta approval).
 *
 * Business-initiated messages (the daily dispatcher) require pre-approved
 * templates; free-form replies are only allowed inside the 24h window opened
 * by an inbound message. These are ready to submit for approval; until then
 * the dispatcher runs only against the Twilio sandbox. Variables use the
 * {{n}} Meta placeholder convention.
 */
export const WHATSAPP_TEMPLATES = {
  daily_invite: {
    name: "daily_invite",
    body: "¡Hola, {{1}}! Su práctica de inglés de hoy está lista — solo 5 minutos. Responda a este mensaje para empezar.",
  },
  streak_reminder: {
    name: "streak_reminder",
    body: "{{1}}, lleva {{2}} días seguidos de práctica. No pierda su racha — responda para el ejercicio de hoy.",
  },
  weekly_summary: {
    name: "weekly_summary",
    body: "Resumen de la semana, {{1}}: {{2}} días practicados y {{3}} palabras nuevas. ¡Buen trabajo!",
  },
  exam_invite: {
    name: "exam_invite",
    body: "{{1}}, su hotel lo invita a una evaluación de inglés de 15 minutos. Abra este enlace cuando esté listo: {{2}}",
  },
  results_ready: {
    name: "results_ready",
    body: "{{1}}, sus resultados de inglés ya están listos. Su nivel estimado es {{2}}. Su gerente los recibió también.",
  },
} as const;
