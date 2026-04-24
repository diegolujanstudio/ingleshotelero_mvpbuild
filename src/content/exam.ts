/**
 * Placement exam content — single source of truth.
 *
 * Diego can edit any string here and the exam flow updates immediately.
 * Each role module follows the distribution from the bible §4:
 *   - Listening: 10 items · A1 (2) · A2 (3) · B1 (3) · B2 (2)
 *   - Speaking:   6 prompts · A1-A2 (2) · A2-B1 (2) · B1-B2 (2)
 *
 * Audio is generated on-the-fly in the browser using SpeechSynthesis for the
 * demo (see `playAudio()` in /exam/[id]/listening/page.tsx). Phase 2.5 will
 * pre-generate OpenAI TTS audio files and store them in public/audio/exam/.
 */

import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

// ─── Diagnostic (13 questions, applies to all roles) ──────────────────

export type DiagnosticQuestionType = "single" | "multi" | "scale";

export interface DiagnosticQuestion {
  id: string;
  prompt_es: string;
  type: DiagnosticQuestionType;
  options?: { value: string; label_es: string }[];
  hint_es?: string;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "years_study",
    prompt_es: "¿Cuántos años ha estudiado inglés en su vida?",
    type: "single",
    options: [
      { value: "none", label_es: "Nunca he estudiado formalmente" },
      { value: "lt1", label_es: "Menos de un año" },
      { value: "1-3", label_es: "De 1 a 3 años" },
      { value: "3-5", label_es: "De 3 a 5 años" },
      { value: "gt5", label_es: "Más de 5 años" },
    ],
  },
  {
    id: "last_class",
    prompt_es: "¿Cuándo fue la última vez que tomó una clase de inglés?",
    type: "single",
    options: [
      { value: "never", label_es: "Nunca" },
      { value: "last_year", label_es: "En el último año" },
      { value: "1-3_years", label_es: "Hace 1 a 3 años" },
      { value: "gt3_years", label_es: "Hace más de 3 años" },
    ],
  },
  {
    id: "work_use",
    prompt_es: "¿Con qué frecuencia usa el inglés en su trabajo actual?",
    type: "single",
    options: [
      { value: "daily", label_es: "Todos los días" },
      { value: "weekly", label_es: "Varias veces por semana" },
      { value: "monthly", label_es: "Algunas veces al mes" },
      { value: "rarely", label_es: "Casi nunca" },
    ],
    hint_es: "Solo conversaciones reales con huéspedes o colegas.",
  },
  {
    id: "comfort_listening",
    prompt_es:
      "Cuando un huésped le habla en inglés, ¿qué tan cómodo se siente al entender lo que dice?",
    type: "scale",
    options: [
      { value: "1", label_es: "1 — No entiendo casi nada" },
      { value: "2", label_es: "2" },
      { value: "3", label_es: "3 — Entiendo algunas palabras" },
      { value: "4", label_es: "4" },
      { value: "5", label_es: "5 — Entiendo todo, incluso acentos difíciles" },
    ],
  },
  {
    id: "comfort_speaking",
    prompt_es:
      "Cuando tiene que responder al huésped en inglés, ¿qué tan cómodo se siente?",
    type: "scale",
    options: [
      { value: "1", label_es: "1 — Me bloqueo" },
      { value: "2", label_es: "2" },
      { value: "3", label_es: "3 — Respondo con frases cortas" },
      { value: "4", label_es: "4" },
      { value: "5", label_es: "5 — Mantengo una conversación completa" },
    ],
  },
  {
    id: "written_comfort",
    prompt_es: "¿Con qué frecuencia lee o escribe en inglés?",
    type: "single",
    options: [
      { value: "daily", label_es: "Todos los días (correos, menús, carteles)" },
      { value: "sometimes", label_es: "A veces" },
      { value: "rarely", label_es: "Casi nunca" },
      { value: "never", label_es: "Nunca" },
    ],
  },
  {
    id: "exposure_media",
    prompt_es:
      "¿Consume contenido en inglés fuera del trabajo? (series, música, redes, videos)",
    type: "multi",
    options: [
      { value: "series", label_es: "Series o películas con audio en inglés" },
      { value: "music", label_es: "Música en inglés" },
      { value: "social", label_es: "Redes sociales o videos cortos" },
      { value: "gaming", label_es: "Videojuegos" },
      { value: "none", label_es: "Nada" },
    ],
    hint_es: "Puede seleccionar varias.",
  },
  {
    id: "travel_abroad",
    prompt_es: "¿Ha viajado a algún país donde tuvo que usar el inglés?",
    type: "single",
    options: [
      { value: "yes_work", label_es: "Sí, por trabajo" },
      { value: "yes_personal", label_es: "Sí, por viaje personal" },
      { value: "no", label_es: "No" },
    ],
  },
  {
    id: "hardest_skill",
    prompt_es: "¿Qué se le dificulta más en inglés?",
    type: "single",
    options: [
      { value: "listening", label_es: "Entender cuando hablan rápido" },
      { value: "speaking", label_es: "Encontrar las palabras para responder" },
      { value: "pronunciation", label_es: "La pronunciación" },
      { value: "grammar", label_es: "La gramática" },
      { value: "nerves", label_es: "Los nervios" },
    ],
  },
  {
    id: "guest_nationality",
    prompt_es:
      "¿Cuál es la nacionalidad más frecuente de los huéspedes que atiende?",
    type: "single",
    options: [
      { value: "us_ca", label_es: "Estados Unidos o Canadá" },
      { value: "uk_au", label_es: "Reino Unido o Australia" },
      { value: "europe", label_es: "Europa (Alemania, Francia, etc.)" },
      { value: "latam", label_es: "Latinoamérica" },
      { value: "other", label_es: "Otra" },
      { value: "mixed", label_es: "Muy variado" },
    ],
  },
  {
    id: "situations_hard",
    prompt_es:
      "¿Cuál situación le resulta más difícil con un huésped anglosajón?",
    type: "single",
    options: [
      { value: "complaint", label_es: "Manejar una queja" },
      { value: "directions", label_es: "Dar indicaciones" },
      { value: "recommendations", label_es: "Recomendar un lugar o platillo" },
      { value: "check_in_out", label_es: "Explicar check-in o check-out" },
      { value: "small_talk", label_es: "Platicar brevemente" },
    ],
  },
  {
    id: "device_available",
    prompt_es:
      "¿Tiene acceso a un teléfono inteligente con internet para practicar?",
    type: "single",
    options: [
      { value: "own_always", label_es: "Sí, mi propio teléfono siempre disponible" },
      { value: "own_limited", label_es: "Sí, pero con internet limitado" },
      { value: "shared", label_es: "Comparto uno con mi familia" },
      { value: "none", label_es: "No tengo acceso regular" },
    ],
  },
  {
    id: "motivation",
    prompt_es: "¿Qué lo motiva más a mejorar su inglés?",
    type: "single",
    options: [
      { value: "guests", label_es: "Atender mejor a los huéspedes" },
      { value: "promotion", label_es: "Aspirar a un mejor puesto" },
      { value: "salary", label_es: "Posibles aumentos de sueldo" },
      { value: "personal", label_es: "Superación personal" },
      { value: "travel", label_es: "Poder viajar" },
    ],
  },
];

// ─── Listening items ──────────────────────────────────────────────────

export interface ListeningItem {
  index: number; // 1-based
  level: CEFRLevel;
  /** English text — spoken aloud by SpeechSynthesis (demo) or pre-generated TTS (prod). */
  audio_en: string;
  /** Three icon + Spanish label options; first is an emoji hint string. */
  options: { emoji: string; label_es: string; is_correct: boolean }[];
  topic: string;
}

// ─── Speaking prompts ─────────────────────────────────────────────────

export interface SpeakingPrompt {
  index: number;
  level: CEFRLevel;
  scenario_es: string;
  expected_keywords: string[];
  model_response_en: string;
}

// ─── Bellboy ──────────────────────────────────────────────────────────

export const BELLBOY_LISTENING: ListeningItem[] = [
  {
    index: 1,
    level: "A1",
    audio_en: "Can you help me with my bags?",
    topic: "luggage_help",
    options: [
      { emoji: "🧳", label_es: "Ayudar con el equipaje", is_correct: true },
      { emoji: "🛎️", label_es: "Llamar a recepción", is_correct: false },
      { emoji: "🍽️", label_es: "Llevar al restaurante", is_correct: false },
    ],
  },
  {
    index: 2,
    level: "A1",
    audio_en: "Where is the elevator?",
    topic: "directions",
    options: [
      { emoji: "📍", label_es: "Indicar el elevador", is_correct: true },
      { emoji: "🚪", label_es: "Abrir la puerta", is_correct: false },
      { emoji: "📞", label_es: "Hacer una llamada", is_correct: false },
    ],
  },
  {
    index: 3,
    level: "A2",
    audio_en: "Please take these bags to room three-oh-four.",
    topic: "room_delivery",
    options: [
      { emoji: "🛏️", label_es: "Llevar las maletas a la habitación 304", is_correct: true },
      { emoji: "🧳", label_es: "Guardar las maletas en el almacén", is_correct: false },
      { emoji: "🚕", label_es: "Pedir un taxi", is_correct: false },
    ],
  },
  {
    index: 4,
    level: "A2",
    audio_en: "Could you show me the way to the pool?",
    topic: "directions",
    options: [
      { emoji: "🏊", label_es: "Acompañar al huésped a la alberca", is_correct: true },
      { emoji: "🛁", label_es: "Llevar al baño", is_correct: false },
      { emoji: "🧖", label_es: "Llevar al spa", is_correct: false },
    ],
  },
  {
    index: 5,
    level: "A2",
    audio_en: "I'll be right back. Could you watch my suitcase for a moment?",
    topic: "proactive_help",
    options: [
      { emoji: "👀", label_es: "Cuidar la maleta mientras regresa", is_correct: true },
      { emoji: "🧳", label_es: "Llevar la maleta al cuarto", is_correct: false },
      { emoji: "🛒", label_es: "Llevar la maleta al guardaequipaje", is_correct: false },
    ],
  },
  {
    index: 6,
    level: "B1",
    audio_en:
      "My flight was delayed and I'm exhausted. Could you take these straight up to the room? I'll follow in a moment.",
    topic: "proactive_help",
    options: [
      {
        emoji: "🛏️",
        label_es: "Subir el equipaje al cuarto de inmediato mientras el huésped se registra",
        is_correct: true,
      },
      { emoji: "⏳", label_es: "Esperar a que el huésped vaya con usted", is_correct: false },
      { emoji: "📥", label_es: "Dejar el equipaje en recepción", is_correct: false },
    ],
  },
  {
    index: 7,
    level: "B1",
    audio_en: "Is there somewhere I can leave my bags until check-in time?",
    topic: "luggage_storage",
    options: [
      { emoji: "🗄️", label_es: "Ofrecer el guardaequipaje del hotel", is_correct: true },
      { emoji: "🚪", label_es: "Pedirle que regrese más tarde", is_correct: false },
      { emoji: "🧳", label_es: "Llevarle el equipaje al cuarto ahora", is_correct: false },
    ],
  },
  {
    index: 8,
    level: "B1",
    audio_en: "Could you bring up an extra pillow and a couple of bottles of water when you come?",
    topic: "proactive_help",
    options: [
      {
        emoji: "🛏️",
        label_es: "Llevar una almohada extra y botellas de agua al cuarto",
        is_correct: true,
      },
      { emoji: "🥤", label_es: "Llamar al servicio a la habitación", is_correct: false },
      { emoji: "🧺", label_es: "Ofrecer cambiar toallas", is_correct: false },
    ],
  },
  {
    index: 9,
    level: "B2",
    audio_en:
      "Sorry to trouble you — I think I left my phone charger in the car. Would it be possible for you to check with the valet while I head up?",
    topic: "procedure_explanation",
    options: [
      {
        emoji: "🔌",
        label_es: "Coordinar con el valet para recuperar el cargador",
        is_correct: true,
      },
      { emoji: "📞", label_es: "Pedirle al huésped que regrese al estacionamiento", is_correct: false },
      { emoji: "🛒", label_es: "Ofrecer comprarle uno nuevo", is_correct: false },
    ],
  },
  {
    index: 10,
    level: "B2",
    audio_en:
      "We're checking out tomorrow early, around five. Would it be possible to arrange a porter and a taxi that early?",
    topic: "procedure_explanation",
    options: [
      {
        emoji: "🚕",
        label_es: "Coordinar porter y taxi para salida temprana mañana",
        is_correct: true,
      },
      { emoji: "⏰", label_es: "Avisarle que no hay servicio tan temprano", is_correct: false },
      { emoji: "🛎️", label_es: "Pedirle que lo arregle en recepción", is_correct: false },
    ],
  },
];

export const BELLBOY_SPEAKING: SpeakingPrompt[] = [
  {
    index: 1,
    level: "A1",
    scenario_es:
      "Un huésped llega con dos maletas y le pide ayuda. Responda ofreciéndose a llevarlas a la habitación 207.",
    expected_keywords: ["help", "bags", "room", "luggage", "take"],
    model_response_en:
      "Of course, sir. Let me take your bags. Your room is two-oh-seven — please follow me.",
  },
  {
    index: 2,
    level: "A2",
    scenario_es:
      "Una huésped le pregunta dónde está el restaurante. Responda indicando que está en el segundo piso, a la derecha.",
    expected_keywords: ["restaurant", "second", "floor", "right", "elevator"],
    model_response_en:
      "The restaurant is on the second floor, to the right of the elevator.",
  },
  {
    index: 3,
    level: "A2",
    scenario_es:
      "Un huésped llega temprano y quiere dejar su equipaje antes del check-in. Ofrézcale el guardaequipaje.",
    expected_keywords: ["luggage", "store", "storage", "room", "check-in"],
    model_response_en:
      "Of course. We can store your luggage in our storage room until check-in. I'll give you a claim tag.",
  },
  {
    index: 4,
    level: "B1",
    scenario_es:
      "El huésped le comenta que acaba de llegar de un vuelo de 8 horas y está muy cansado. Ofrézcale ayuda adicional con el equipaje y con lo que necesite en la habitación.",
    expected_keywords: ["tired", "luggage", "room", "help", "anything"],
    model_response_en:
      "I'm sorry to hear you've had such a long flight. Let me take your bags up to the room right away. Would you like me to bring up some water or anything else?",
  },
  {
    index: 5,
    level: "B1",
    scenario_es:
      "Un huésped dejó su pasaporte en el taxi que se acaba de ir. Está nervioso. Tranquilícelo y explíquele los pasos para intentar recuperarlo.",
    expected_keywords: ["passport", "taxi", "company", "calm", "help"],
    model_response_en:
      "Please don't worry — this happens sometimes. Let me call the taxi company right away. Could you remember the color or number on the taxi? We'll do our best to help.",
  },
  {
    index: 6,
    level: "B2",
    scenario_es:
      "Un huésped VIP se queja de que su equipaje tardó mucho en llegar a la habitación. Discúlpese sinceramente, ofrezca una solución y comunique que avisará al gerente.",
    expected_keywords: ["apologize", "delay", "manager", "compensation", "standard"],
    model_response_en:
      "Sir, I sincerely apologize for the delay with your luggage. This is not the standard we aim for. I'll let the manager know personally, and we'd like to offer a complimentary drink at the bar while you settle in.",
  },
];

// ─── Front Desk ────────────────────────────────────────────────────────

export const FRONTDESK_LISTENING: ListeningItem[] = [
  {
    index: 1,
    level: "A1",
    audio_en: "Hello, I have a reservation.",
    topic: "check_in",
    options: [
      { emoji: "📋", label_es: "Confirmar la reservación", is_correct: true },
      { emoji: "🧳", label_es: "Llamar al botones", is_correct: false },
      { emoji: "💳", label_es: "Cobrar la cuenta", is_correct: false },
    ],
  },
  {
    index: 2,
    level: "A1",
    audio_en: "What time is breakfast?",
    topic: "amenities",
    options: [
      { emoji: "🍳", label_es: "Informar el horario del desayuno", is_correct: true },
      { emoji: "🍽️", label_es: "Tomar una reservación para cenar", is_correct: false },
      { emoji: "🚪", label_es: "Abrir el restaurante", is_correct: false },
    ],
  },
  {
    index: 3,
    level: "A2",
    audio_en: "Is breakfast included in the rate?",
    topic: "rate_explanation",
    options: [
      { emoji: "✅", label_es: "Confirmar si el desayuno está incluido", is_correct: true },
      { emoji: "💵", label_es: "Cobrar un extra por desayuno", is_correct: false },
      { emoji: "📅", label_es: "Hacer una nueva reservación", is_correct: false },
    ],
  },
  {
    index: 4,
    level: "A2",
    audio_en: "What's the Wi-Fi password?",
    topic: "amenities",
    options: [
      { emoji: "📶", label_es: "Compartir la contraseña del Wi-Fi", is_correct: true },
      { emoji: "💻", label_es: "Ofrecer una computadora", is_correct: false },
      { emoji: "📞", label_es: "Llamar a soporte técnico", is_correct: false },
    ],
  },
  {
    index: 5,
    level: "A2",
    audio_en: "Can I have a late check-out?",
    topic: "check_out",
    options: [
      { emoji: "⏰", label_es: "Evaluar la disponibilidad de late check-out", is_correct: true },
      { emoji: "🚪", label_es: "Pedirle que salga de inmediato", is_correct: false },
      { emoji: "🗝️", label_es: "Cambiarle de habitación", is_correct: false },
    ],
  },
  {
    index: 6,
    level: "B1",
    audio_en:
      "I booked a king room, but when I got upstairs it's a double. Can you look into that?",
    topic: "complaint_room_type",
    options: [
      {
        emoji: "🔍",
        label_es: "Revisar la reservación y resolver el tipo de habitación",
        is_correct: true,
      },
      { emoji: "🚪", label_es: "Pedirle que espere en el lobby", is_correct: false },
      { emoji: "💳", label_es: "Cobrarle una diferencia", is_correct: false },
    ],
  },
  {
    index: 7,
    level: "B1",
    audio_en:
      "I booked through Expedia and the rate should include breakfast, but my confirmation doesn't show it.",
    topic: "third_party_booking",
    options: [
      {
        emoji: "📋",
        label_es: "Verificar la tarifa con el tercero y confirmar el desayuno",
        is_correct: true,
      },
      { emoji: "❌", label_es: "Decirle que no incluye desayuno sin verificar", is_correct: false },
      { emoji: "💵", label_es: "Cobrarle el desayuno adicional", is_correct: false },
    ],
  },
  {
    index: 8,
    level: "B1",
    audio_en: "The air conditioning in my room doesn't seem to work. Could someone check?",
    topic: "complaint_maintenance",
    options: [
      {
        emoji: "🔧",
        label_es: "Enviar a mantenimiento de inmediato y disculparse",
        is_correct: true,
      },
      { emoji: "🪟", label_es: "Sugerir que abra la ventana", is_correct: false },
      { emoji: "🧊", label_es: "Ofrecer hielo", is_correct: false },
    ],
  },
  {
    index: 9,
    level: "B2",
    audio_en:
      "I'm leaving before sunrise tomorrow for a flight. I'd like to settle the bill tonight and have a taxi ready at four-thirty.",
    topic: "check_out_procedures",
    options: [
      {
        emoji: "✅",
        label_es: "Realizar el express check-out y coordinar el taxi para las 4:30",
        is_correct: true,
      },
      { emoji: "⏰", label_es: "Pedirle que lo haga en la mañana", is_correct: false },
      { emoji: "🚕", label_es: "Sugerir que pida un Uber", is_correct: false },
    ],
  },
  {
    index: 10,
    level: "B2",
    audio_en:
      "This is unacceptable. I've been here three days and every morning the front desk has charged me a different rate. I need a manager now.",
    topic: "complaint_handling",
    options: [
      {
        emoji: "🙇",
        label_es: "Escuchar, disculparse, y llamar al gerente de inmediato",
        is_correct: true,
      },
      { emoji: "💵", label_es: "Reembolsar sin verificar", is_correct: false },
      { emoji: "📋", label_es: "Decirle que revise sus recibos", is_correct: false },
    ],
  },
];

export const FRONTDESK_SPEAKING: SpeakingPrompt[] = [
  {
    index: 1,
    level: "A1",
    scenario_es:
      "Un huésped llega al mostrador y se presenta. Salúdelo y confirme su reservación a nombre de 'Johnson'.",
    expected_keywords: ["welcome", "reservation", "name", "Johnson", "check-in"],
    model_response_en:
      "Welcome to our hotel. May I have your name, please? Yes, I see your reservation, Mr. Johnson. Let me check you in.",
  },
  {
    index: 2,
    level: "A2",
    scenario_es:
      "Un huésped pregunta si el desayuno está incluido. Su tarifa SÍ incluye desayuno. Confírmeselo e indíquele los horarios.",
    expected_keywords: ["breakfast", "included", "rate", "hours", "morning"],
    model_response_en:
      "Yes, breakfast is included in your rate. It's served from seven to ten in the morning, on the second floor.",
  },
  {
    index: 3,
    level: "A2",
    scenario_es:
      "Un huésped pregunta cómo llegar al centro histórico. Explíquele que está a 10 minutos caminando y ofrezca un mapa.",
    expected_keywords: ["historic", "center", "walk", "map", "minutes"],
    model_response_en:
      "The historic center is about ten minutes on foot. I can give you a map and mark the best route.",
  },
  {
    index: 4,
    level: "B1",
    scenario_es:
      "Un huésped dice que no funciona el aire acondicionado en su cuarto. Discúlpese, ofrezca enviar mantenimiento, y proponga un cambio de habitación si no se resuelve rápido.",
    expected_keywords: ["apologize", "maintenance", "room", "move", "right away"],
    model_response_en:
      "I'm very sorry about that. I'll send maintenance up right away. If it can't be fixed quickly, we'd be happy to move you to another room.",
  },
  {
    index: 5,
    level: "B1",
    scenario_es:
      "Un huésped reservó por una OTA (tipo Booking.com) y reclama que la tarifa era más baja. Explíquele que necesita verificar con la plataforma y ofrézcale resolverlo en 10 minutos.",
    expected_keywords: ["verify", "booking", "platform", "rate", "minutes"],
    model_response_en:
      "I understand your concern. Let me verify this with the booking platform — it should take about ten minutes. I'll come find you as soon as I have an answer.",
  },
  {
    index: 6,
    level: "B2",
    scenario_es:
      "Un huésped está muy molesto porque le cobraron un cargo en el minibar que asegura no consumió. Escuche, disculpe, ofrezca eliminar el cargo mientras verifica, y comprométase personalmente a darle seguimiento.",
    expected_keywords: ["apologize", "charge", "minibar", "remove", "personally"],
    model_response_en:
      "I completely understand, and I apologize for the inconvenience. I'll remove the charge right now while we verify with housekeeping. I'll personally make sure this doesn't happen again, and I'll follow up with you before you check out.",
  },
];

// ─── Restaurant / Bar ──────────────────────────────────────────────────

export const RESTAURANT_LISTENING: ListeningItem[] = [
  {
    index: 1,
    level: "A1",
    audio_en: "Can I see the menu?",
    topic: "menu_request",
    options: [
      { emoji: "📖", label_es: "Entregar el menú", is_correct: true },
      { emoji: "💵", label_es: "Traer la cuenta", is_correct: false },
      { emoji: "🍷", label_es: "Sugerir un vino", is_correct: false },
    ],
  },
  {
    index: 2,
    level: "A1",
    audio_en: "A table for two, please.",
    topic: "table_assignment",
    options: [
      { emoji: "🪑", label_es: "Asignar una mesa para dos personas", is_correct: true },
      { emoji: "🍷", label_es: "Traer dos copas de vino", is_correct: false },
      { emoji: "📋", label_es: "Pedir reservación", is_correct: false },
    ],
  },
  {
    index: 3,
    level: "A2",
    audio_en: "I'll have the salmon, please.",
    topic: "order_taking",
    options: [
      { emoji: "🐟", label_es: "Tomar la orden del salmón", is_correct: true },
      { emoji: "🥗", label_es: "Ofrecer una ensalada", is_correct: false },
      { emoji: "🍷", label_es: "Recomendar un vino", is_correct: false },
    ],
  },
  {
    index: 4,
    level: "A2",
    audio_en: "What do you recommend?",
    topic: "recommendations",
    options: [
      { emoji: "⭐", label_es: "Recomendar un platillo de la casa", is_correct: true },
      { emoji: "💵", label_es: "Traer la cuenta", is_correct: false },
      { emoji: "📖", label_es: "Repetir el menú completo", is_correct: false },
    ],
  },
  {
    index: 5,
    level: "A2",
    audio_en: "Could we have some more water?",
    topic: "order_taking",
    options: [
      { emoji: "💧", label_es: "Rellenar los vasos de agua", is_correct: true },
      { emoji: "🍷", label_es: "Traer una botella de vino", is_correct: false },
      { emoji: "🧊", label_es: "Traer solo hielo", is_correct: false },
    ],
  },
  {
    index: 6,
    level: "B1",
    audio_en: "I have a nut allergy. Is the pesto safe for me?",
    topic: "allergy_handling",
    options: [
      {
        emoji: "⚠️",
        label_es: "Verificar con cocina antes de servir y advertir al huésped",
        is_correct: true,
      },
      { emoji: "✅", label_es: "Asegurar que es seguro sin verificar", is_correct: false },
      { emoji: "🥗", label_es: "Cambiarle automáticamente a ensalada", is_correct: false },
    ],
  },
  {
    index: 7,
    level: "B1",
    audio_en: "Could we split the check three ways?",
    topic: "bill_splitting",
    options: [
      { emoji: "🧾", label_es: "Dividir la cuenta en tres partes", is_correct: true },
      { emoji: "💳", label_es: "Cobrarla toda a una tarjeta", is_correct: false },
      { emoji: "❌", label_es: "Decir que no se puede dividir", is_correct: false },
    ],
  },
  {
    index: 8,
    level: "B1",
    audio_en: "This steak is a bit undercooked for me. Could you have it cooked a little more?",
    topic: "complaint_management",
    options: [
      {
        emoji: "🔥",
        label_es: "Retirar el platillo y pedir a cocina que lo cocine más",
        is_correct: true,
      },
      { emoji: "💵", label_es: "Ofrecer un descuento", is_correct: false },
      { emoji: "🥗", label_es: "Cambiarlo por una ensalada", is_correct: false },
    ],
  },
  {
    index: 9,
    level: "B2",
    audio_en:
      "Could you tell the kitchen this needs to be dairy-free? And also, my friend is vegan — what can they have tonight?",
    topic: "allergy_handling",
    options: [
      {
        emoji: "🍽️",
        label_es: "Confirmar con cocina las restricciones y sugerir opciones veganas",
        is_correct: true,
      },
      { emoji: "📖", label_es: "Pedirle que revise el menú solo", is_correct: false },
      { emoji: "❌", label_es: "Decir que no hay opciones veganas", is_correct: false },
    ],
  },
  {
    index: 10,
    level: "B2",
    audio_en:
      "We've been waiting forty-five minutes for our mains. We have a show at nine. What's going on?",
    topic: "complaint_management",
    options: [
      {
        emoji: "🏃",
        label_es: "Disculparse, verificar con cocina urgente, ofrecer compensación",
        is_correct: true,
      },
      { emoji: "⏰", label_es: "Decir que la cocina está ocupada y esperar", is_correct: false },
      { emoji: "💵", label_es: "Cobrar solo las bebidas y despedirlos", is_correct: false },
    ],
  },
];

export const RESTAURANT_SPEAKING: SpeakingPrompt[] = [
  {
    index: 1,
    level: "A1",
    scenario_es:
      "Una huésped llega al restaurante con su pareja. Salúdelos y ofrézcales una mesa para dos.",
    expected_keywords: ["welcome", "table", "two", "follow", "seat"],
    model_response_en:
      "Good evening. A table for two? Please follow me, I'll seat you right away.",
  },
  {
    index: 2,
    level: "A2",
    scenario_es:
      "Un huésped le pregunta qué le recomienda del menú. Recomiende el 'Pescado del día' y explique brevemente qué incluye.",
    expected_keywords: ["recommend", "fish", "day", "served", "fresh"],
    model_response_en:
      "I recommend our fish of the day — it's fresh local snapper, grilled, served with seasonal vegetables.",
  },
  {
    index: 3,
    level: "A2",
    scenario_es:
      "Una huésped pide la cuenta. Pregúntele si desea algo más antes y cómo desea pagar (efectivo o tarjeta).",
    expected_keywords: ["check", "anything", "else", "cash", "card"],
    model_response_en:
      "Of course. Would you like anything else before I bring the check — coffee or dessert? And will you be paying with cash or card?",
  },
  {
    index: 4,
    level: "B1",
    scenario_es:
      "Un huésped le dice que tiene alergia a los mariscos. Confírmele que verificará con cocina, explíquele que algunos platillos sí son seguros, y ofrézcase a guiarlo en el menú.",
    expected_keywords: ["allergy", "shellfish", "kitchen", "safe", "menu"],
    model_response_en:
      "Thank you for telling me. I'll confirm with the kitchen to make sure. Several dishes on the menu are shellfish-free — may I walk you through the options?",
  },
  {
    index: 5,
    level: "B1",
    scenario_es:
      "Un huésped se queja de que el filete está poco cocido. Discúlpese, ofrezca regresarlo a la cocina, y comunique que no habrá cargo adicional.",
    expected_keywords: ["apologize", "kitchen", "cook", "more", "no charge"],
    model_response_en:
      "I'm very sorry about that. I'll take it back to the kitchen right away and have it cooked a bit more. There will be no additional charge.",
  },
  {
    index: 6,
    level: "B2",
    scenario_es:
      "Una huésped VIP tiene restricciones estrictas (vegana, sin gluten, sin soya). Explique qué puede ofrecer la cocina, haga una recomendación personalizada, y pregunte sobre bebidas.",
    expected_keywords: ["vegan", "gluten-free", "kitchen", "recommend", "drinks"],
    model_response_en:
      "Of course — our kitchen handles these beautifully. For a main I'd recommend the roasted cauliflower steak with tahini, which is naturally vegan, gluten-free, and soy-free. Would you like to start with a drink? We have a nice selection of natural wines and kombuchas.",
  },
];

// ─── Role → content lookup ─────────────────────────────────────────────

export const EXAM_CONTENT: Record<
  RoleModule,
  { listening: ListeningItem[]; speaking: SpeakingPrompt[] }
> = {
  bellboy: { listening: BELLBOY_LISTENING, speaking: BELLBOY_SPEAKING },
  frontdesk: { listening: FRONTDESK_LISTENING, speaking: FRONTDESK_SPEAKING },
  restaurant: { listening: RESTAURANT_LISTENING, speaking: RESTAURANT_SPEAKING },
};

export function getListening(role: RoleModule): ListeningItem[] {
  return EXAM_CONTENT[role].listening;
}

export function getSpeaking(role: RoleModule): SpeakingPrompt[] {
  return EXAM_CONTENT[role].speaking;
}
