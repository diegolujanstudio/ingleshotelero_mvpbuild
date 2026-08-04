/**
 * Daily practice drill content.
 *
 * Per role (bellboy / frontdesk / restaurant), a small pool of drills
 * the practice engine cycles through. Each drill is a 3-step micro-loop:
 *   1. listening   — English audio, three Spanish action options
 *   2. reinforce   — model response shown + spoken back
 *   3. vocabulary  — three flashcards from the role's inventory
 *
 * V1 deliberately omits the speaking step from the daily flow — the
 * exam already exercises that surface, and adding MediaRecorder here
 * doubles the implementation cost. Speaking returns in V2 once the
 * scoring pipeline is wired to the real APIs.
 *
 * Drills draw vocabulary only from the role's inventory (this is a
 * placeholder; the full inventory work belongs in §7 of the brief).
 */

import type { RoleModule } from "@/lib/supabase/types";
import { ROLES, ROLE_IDS } from "@/content/roles";

/**
 * Role is the database's RoleModule — one type, not two. They used to be
 * separate unions, so adding a department made every boundary between them a
 * type error. See src/content/roles.ts for the canonical list.
 */
export type Role = RoleModule;

export type Drill = {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  listening: {
    audio_text: string; // English text the browser SpeechSynthesis speaks
    options: { emoji: string; text_es: string; correct: boolean }[];
    explanation_es: string; // shown after answering
  };
  reinforce: {
    title_es: string; // e.g. "Frase modelo"
    model_en: string; // the gold-standard English response
    note_es: string; // why this phrasing matters
  };
  vocabulary: {
    word_en: string;
    word_es: string;
    example_en: string;
    example_es: string;
  }[];
};

export const DRILLS: Partial<Record<Role, Drill[]>> = {
  bellboy: [
    {
      id: "b-001",
      level: "A1",
      listening: {
        audio_text: "Hello. I have two suitcases. Can you help me, please?",
        options: [
          { emoji: "🧳", text_es: "Ayudar con el equipaje", correct: true },
          { emoji: "🍽️", text_es: "Llevar al restaurante", correct: false },
          { emoji: "💳", text_es: "Cobrar la cuenta", correct: false },
        ],
        explanation_es:
          "El huésped pide ayuda con dos maletas. La acción correcta es tomar el equipaje y acompañarlo a su habitación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course, sir. Let me take your luggage to your room.",
        note_es:
          "“Of course, sir” es más cálido que “OK”. “Let me take” suena profesional sin sonar sumiso.",
      },
      vocabulary: [
        {
          word_en: "luggage",
          word_es: "equipaje",
          example_en: "I'll take your luggage to room 304.",
          example_es: "Llevaré su equipaje a la habitación 304.",
        },
        {
          word_en: "elevator",
          word_es: "elevador",
          example_en: "The elevator is to your right.",
          example_es: "El elevador está a su derecha.",
        },
        {
          word_en: "follow me",
          word_es: "sígame",
          example_en: "Please follow me, sir.",
          example_es: "Por favor, sígame.",
        },
      ],
    },
    {
      id: "b-002",
      level: "A2",
      listening: {
        audio_text: "Excuse me, where is the gym? Is it open now?",
        options: [
          { emoji: "🏋️", text_es: "Indicarle dónde está el gimnasio y si está abierto", correct: true },
          { emoji: "🛏️", text_es: "Ofrecerle limpieza extra", correct: false },
          { emoji: "🍳", text_es: "Llevarlo al desayuno", correct: false },
        ],
        explanation_es:
          "Pregunta por la ubicación del gimnasio y su horario. La respuesta da las dos cosas: dónde y a qué hora abre.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "The gym is on the second floor, sir. It's open from 6 a.m. to 10 p.m.",
        note_es:
          "Dar la ubicación primero, después el horario, en una sola frase. No deja al huésped esperando una segunda respuesta.",
      },
      vocabulary: [
        {
          word_en: "second floor",
          word_es: "segundo piso",
          example_en: "The pool is on the second floor.",
          example_es: "La alberca está en el segundo piso.",
        },
        {
          word_en: "open from",
          word_es: "abierto desde",
          example_en: "The bar is open from 4 p.m.",
          example_es: "El bar abre desde las 4 de la tarde.",
        },
        {
          word_en: "right away",
          word_es: "enseguida",
          example_en: "I'll bring you towels right away.",
          example_es: "Le traigo toallas enseguida.",
        },
      ],
    },
    {
      id: "b-003",
      level: "B1",
      listening: {
        audio_text:
          "Sorry to bother you. The Wi-Fi in my room isn't working. Could you check, please?",
        options: [
          { emoji: "📶", text_es: "Disculparse y ofrecer revisar / contactar a IT", correct: true },
          { emoji: "🔑", text_es: "Cambiarle la habitación", correct: false },
          { emoji: "📞", text_es: "Pasarle la llamada al gerente", correct: false },
        ],
        explanation_es:
          "Una queja simple sobre Wi-Fi. La respuesta correcta es disculparse, ofrecer revisar y dar un siguiente paso claro.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm sorry about that, sir. Let me call IT and we'll have it fixed in a few minutes.",
        note_es:
          "“I'm sorry about that” reconoce sin admitir culpa. “In a few minutes” da una expectativa de tiempo concreta.",
      },
      vocabulary: [
        {
          word_en: "I'm sorry about that",
          word_es: "lamento eso",
          example_en: "I'm sorry about that. Let me check.",
          example_es: "Lamento eso. Permítame revisar.",
        },
        {
          word_en: "fix",
          word_es: "arreglar",
          example_en: "We'll have it fixed soon.",
          example_es: "Lo arreglaremos pronto.",
        },
        {
          word_en: "in a few minutes",
          word_es: "en unos minutos",
          example_en: "I'll be there in a few minutes.",
          example_es: "Estaré allí en unos minutos.",
        },
      ],
    },
    {
      id: "b-004",
      level: "A1",
      listening: {
        audio_text: "Good morning. A taxi to the airport, please.",
        options: [
          { emoji: "🚕", text_es: "Pedir un taxi al aeropuerto", correct: true },
          { emoji: "🧳", text_es: "Subir su equipaje a la habitación", correct: false },
          { emoji: "🍳", text_es: "Llevarlo al desayuno", correct: false },
        ],
        explanation_es:
          "El huésped pide un taxi al aeropuerto. La acción correcta es confirmar y llamarlo de inmediato.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Right away, sir. A taxi to the airport — it will be here in five minutes.",
        note_es:
          "“Right away” transmite acción inmediata. Dar un tiempo concreto (“five minutes”) tranquiliza al huésped.",
      },
      vocabulary: [
        {
          word_en: "taxi",
          word_es: "taxi",
          example_en: "I'll call a taxi for you.",
          example_es: "Le llamaré un taxi.",
        },
        {
          word_en: "airport",
          word_es: "aeropuerto",
          example_en: "The airport is thirty minutes away.",
          example_es: "El aeropuerto está a treinta minutos.",
        },
        {
          word_en: "right away",
          word_es: "de inmediato",
          example_en: "I'll do it right away.",
          example_es: "Lo haré de inmediato.",
        },
      ],
    },
    {
      id: "b-005",
      level: "B2",
      listening: {
        audio_text:
          "We have an early flight tomorrow and three heavy suitcases. Can someone help us at 4 a.m. and store our bags until then?",
        options: [
          {
            emoji: "🛎️",
            text_es: "Confirmar ayuda a las 4 a.m. y ofrecer guardar el equipaje",
            correct: true,
          },
          { emoji: "🚪", text_es: "Decirle que el servicio empieza a las 7 a.m.", correct: false },
          { emoji: "📞", text_es: "Pedirle que llame a un taxi por su cuenta", correct: false },
        ],
        explanation_es:
          "Una petición compuesta: ayuda temprana + resguardo de equipaje. Una buena respuesta confirma ambas cosas y se anticipa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course. I'll arrange a bellman for 4 a.m. sharp, and we'll keep your luggage in the secure store room overnight — I'll have it ready by the door.",
        note_es:
          "Responder a cada parte de la petición y añadir un detalle proactivo (“ready by the door”) es nivel B2 de servicio.",
      },
      vocabulary: [
        {
          word_en: "arrange",
          word_es: "coordinar / organizar",
          example_en: "I'll arrange a wake-up call for you.",
          example_es: "Le coordinaré una llamada despertador.",
        },
        {
          word_en: "store room",
          word_es: "cuarto de resguardo",
          example_en: "Your bags are safe in the store room.",
          example_es: "Sus maletas están seguras en el cuarto de resguardo.",
        },
        {
          word_en: "overnight",
          word_es: "durante la noche",
          example_en: "We can hold it overnight.",
          example_es: "Podemos guardarlo durante la noche.",
        },
      ],
    },
    {
      id: "b-006",
      level: "A1",
      listening: {
        audio_text: "Excuse me, where is the pool?",
        options: [
          { emoji: "🏊", text_es: "Indicarle dónde está la alberca", correct: true },
          { emoji: "🧳", text_es: "Guardar su equipaje", correct: false },
          { emoji: "🧾", text_es: "Traerle la cuenta", correct: false },
        ],
        explanation_es:
          "El huésped solo quiere saber dónde está la alberca. La acción correcta es indicarle el camino con claridad.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The pool is on the first floor, sir. This way, please.",
        note_es:
          "Ubicación primero, invitación después. “This way, please” acompaña con el gesto y evita confusión.",
      },
      vocabulary: [
        {
          word_en: "pool",
          word_es: "alberca",
          example_en: "The pool closes at 9 p.m.",
          example_es: "La alberca cierra a las 9 de la noche.",
        },
        {
          word_en: "first floor",
          word_es: "primer piso",
          example_en: "The spa is on the first floor.",
          example_es: "El spa está en el primer piso.",
        },
        {
          word_en: "this way",
          word_es: "por aquí",
          example_en: "This way, please.",
          example_es: "Por aquí, por favor.",
        },
      ],
    },
    {
      id: "b-007",
      level: "A1",
      listening: {
        audio_text: "Can I leave my bag here for one hour?",
        options: [
          { emoji: "🛄", text_es: "Guardar su maleta y darle un comprobante", correct: true },
          { emoji: "🚕", text_es: "Pedirle un taxi", correct: false },
          { emoji: "🛏️", text_es: "Subirla a una habitación", correct: false },
        ],
        explanation_es:
          "El huésped quiere dejar su maleta un rato. Se acepta, se guarda y se le da un comprobante para recogerla.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, of course. Here is your ticket — show it when you come back.",
        note_es:
          "El comprobante (“ticket”) da seguridad al huésped y orden al equipo. Siempre se entrega al guardar equipaje.",
      },
      vocabulary: [
        {
          word_en: "bag",
          word_es: "maleta / bolsa",
          example_en: "Your bag is safe with us.",
          example_es: "Su maleta está segura con nosotros.",
        },
        {
          word_en: "ticket",
          word_es: "comprobante",
          example_en: "Please keep this ticket.",
          example_es: "Por favor conserve este comprobante.",
        },
        {
          word_en: "come back",
          word_es: "regresar",
          example_en: "Show it when you come back.",
          example_es: "Muéstrelo cuando regrese.",
        },
      ],
    },
    {
      id: "b-008",
      level: "A1",
      listening: {
        audio_text: "Hi. More towels for room 210, please.",
        options: [
          { emoji: "🧺", text_es: "Llevar toallas a la habitación 210", correct: true },
          { emoji: "🍽️", text_es: "Llevar el menú a la 210", correct: false },
          { emoji: "🔑", text_es: "Cambiar la llave de la 210", correct: false },
        ],
        explanation_es:
          "Pide toallas y da el número de habitación. Se confirma el número y se llevan de inmediato.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course — extra towels for room 210. I'll bring them in five minutes.",
        note_es:
          "Repetir el número de habitación confirma que se escuchó bien. Un tiempo concreto evita una segunda llamada.",
      },
      vocabulary: [
        {
          word_en: "towels",
          word_es: "toallas",
          example_en: "I'll bring fresh towels.",
          example_es: "Le traigo toallas limpias.",
        },
        {
          word_en: "extra",
          word_es: "adicional",
          example_en: "Do you need an extra pillow?",
          example_es: "¿Necesita una almohada adicional?",
        },
        {
          word_en: "room number",
          word_es: "número de habitación",
          example_en: "What is your room number?",
          example_es: "¿Cuál es su número de habitación?",
        },
      ],
    },
    {
      id: "b-009",
      level: "A2",
      listening: {
        audio_text: "Excuse me, is there an ice machine on this floor?",
        options: [
          { emoji: "🧊", text_es: "Decirle dónde está la máquina de hielo u ofrecer traerle hielo", correct: true },
          { emoji: "🍷", text_es: "Ofrecerle la carta de vinos", correct: false },
          { emoji: "❄️", text_es: "Bajarle al aire acondicionado", correct: false },
        ],
        explanation_es:
          "Busca hielo. Si no hay máquina en su piso, la mejor respuesta ofrece traerlo — resolver, no solo informar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "There's no machine on this floor, sir, but I can bring you ice right away.",
        note_es:
          "Cuando la respuesta directa es “no”, se acompaña siempre con una alternativa. El huésped recuerda la solución, no el no.",
      },
      vocabulary: [
        {
          word_en: "ice",
          word_es: "hielo",
          example_en: "I'll bring you a bucket of ice.",
          example_es: "Le traigo una hielera con hielo.",
        },
        {
          word_en: "machine",
          word_es: "máquina",
          example_en: "The ice machine is by the elevator.",
          example_es: "La máquina de hielo está junto al elevador.",
        },
        {
          word_en: "floor",
          word_es: "piso",
          example_en: "Is there one on this floor?",
          example_es: "¿Hay una en este piso?",
        },
      ],
    },
    {
      id: "b-010",
      level: "A2",
      listening: {
        audio_text: "Good morning. Which way is the breakfast room?",
        options: [
          { emoji: "🍳", text_es: "Indicarle el camino o acompañarlo al desayunador", correct: true },
          { emoji: "🛏️", text_es: "Ofrecerle servicio a la habitación", correct: false },
          { emoji: "🚕", text_es: "Llamarle un taxi", correct: false },
        ],
        explanation_es:
          "Busca el desayunador. Indicar el camino es correcto; acompañarlo unos pasos es aún mejor si está cerca.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Good morning! The breakfast room is just past the lobby, on your left. Let me walk you there.",
        note_es:
          "“Let me walk you there” convierte una indicación en hospitalidad. Tres pasos de cortesía valen más que un mapa.",
      },
      vocabulary: [
        {
          word_en: "lobby",
          word_es: "lobby / recepción",
          example_en: "Cross the lobby and turn left.",
          example_es: "Cruce el lobby y gire a la izquierda.",
        },
        {
          word_en: "on your left",
          word_es: "a su izquierda",
          example_en: "The restaurant is on your left.",
          example_es: "El restaurante está a su izquierda.",
        },
        {
          word_en: "just past",
          word_es: "justo después de",
          example_en: "It's just past the gift shop.",
          example_es: "Está justo después de la tienda de regalos.",
        },
      ],
    },
    {
      id: "b-011",
      level: "A2",
      listening: {
        audio_text: "Can you book me a taxi for seven tonight? I have a dinner downtown.",
        options: [
          { emoji: "🕖", text_es: "Confirmar el taxi para las 7 y el destino", correct: true },
          { emoji: "🚕", text_es: "Pedir el taxi para ahora mismo", correct: false },
          { emoji: "🍽️", text_es: "Reservarle mesa en el restaurante del hotel", correct: false },
        ],
        explanation_es:
          "No quiere el taxi ahora — lo quiere a las 7. Confirmar hora y destino evita el error más común: pedirlo de inmediato.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Certainly, sir. A taxi for 7 p.m. to downtown — it will be waiting at the entrance.",
        note_es:
          "Repetir hora y destino confirma los datos. “Waiting at the entrance” pinta la escena y da certeza.",
      },
      vocabulary: [
        {
          word_en: "book",
          word_es: "reservar / agendar",
          example_en: "I'll book it for 7 p.m.",
          example_es: "Lo agendo para las 7 de la noche.",
        },
        {
          word_en: "downtown",
          word_es: "el centro",
          example_en: "The taxi will take you downtown.",
          example_es: "El taxi lo llevará al centro.",
        },
        {
          word_en: "entrance",
          word_es: "entrada",
          example_en: "It will be waiting at the entrance.",
          example_es: "Estará esperando en la entrada.",
        },
      ],
    },
    {
      id: "b-012",
      level: "A2",
      listening: {
        audio_text: "It's raining. Do you have an umbrella I can borrow?",
        options: [
          { emoji: "☂️", text_es: "Prestarle un paraguas del hotel", correct: true },
          { emoji: "🚕", text_es: "Decirle que mejor tome un taxi", correct: false },
          { emoji: "🛏️", text_es: "Sugerirle quedarse en su habitación", correct: false },
        ],
        explanation_es:
          "Pide un paraguas prestado. La acción correcta es traerlo y explicar cómo devolverlo — sin complicar el momento.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course! Here you are. Just leave it with us at the desk when you return.",
        note_es:
          "“Here you are” al entregar algo es la fórmula natural. La instrucción de devolución es breve y amable, no burocrática.",
      },
      vocabulary: [
        {
          word_en: "umbrella",
          word_es: "paraguas",
          example_en: "Take this umbrella, please.",
          example_es: "Tome este paraguas, por favor.",
        },
        {
          word_en: "borrow",
          word_es: "pedir prestado",
          example_en: "You can borrow one here.",
          example_es: "Puede pedir uno prestado aquí.",
        },
        {
          word_en: "here you are",
          word_es: "aquí tiene",
          example_en: "Here you are, sir.",
          example_es: "Aquí tiene, señor.",
        },
      ],
    },
    {
      id: "b-013",
      level: "B1",
      listening: {
        audio_text:
          "The air conditioning in 415 isn't cooling at all. It's really hot in here. Can someone take a look?",
        options: [
          { emoji: "🌡️", text_es: "Disculparse y enviar a mantenimiento con un tiempo estimado", correct: true },
          { emoji: "🪟", text_es: "Sugerirle abrir la ventana", correct: false },
          { emoji: "📞", text_es: "Decirle que llame mañana en horario de oficina", correct: false },
        ],
        explanation_es:
          "Falla de clima con incomodidad real. La respuesta correcta: disculpa breve, acción concreta (mantenimiento) y tiempo estimado.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm sorry about that, sir. I'll send maintenance to room 415 right now — they'll be there within ten minutes.",
        note_es:
          "Queja de confort = respuesta con reloj. “Within ten minutes” es un compromiso que se puede cumplir y medir.",
      },
      vocabulary: [
        {
          word_en: "air conditioning",
          word_es: "aire acondicionado",
          example_en: "The air conditioning isn't working.",
          example_es: "El aire acondicionado no funciona.",
        },
        {
          word_en: "maintenance",
          word_es: "mantenimiento",
          example_en: "Maintenance is on the way.",
          example_es: "Mantenimiento va en camino.",
        },
        {
          word_en: "within ten minutes",
          word_es: "en menos de diez minutos",
          example_en: "They'll arrive within ten minutes.",
          example_es: "Llegarán en menos de diez minutos.",
        },
      ],
    },
    {
      id: "b-014",
      level: "B1",
      listening: {
        audio_text:
          "We're locked out of our room. The key card stopped working and our phones are inside.",
        options: [
          { emoji: "🔑", text_es: "Acompañarlos a recepción para reactivar la llave y verificar identidad", correct: true },
          { emoji: "🚪", text_es: "Abrir la puerta sin verificar nada", correct: false },
          { emoji: "🕐", text_es: "Pedirles que esperen al turno de la mañana", correct: false },
        ],
        explanation_es:
          "Huéspedes sin acceso y sin teléfonos. Se resuelve rápido pero con protocolo: verificar identidad antes de abrir.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Don't worry — this happens sometimes. Let me take you to the front desk so we can verify your room and make you a new key right away.",
        note_es:
          "“Don't worry — this happens sometimes” baja la tensión. Mencionar la verificación protege al huésped y al hotel.",
      },
      vocabulary: [
        {
          word_en: "locked out",
          word_es: "quedarse fuera (sin llave)",
          example_en: "We're locked out of our room.",
          example_es: "Nos quedamos fuera de la habitación.",
        },
        {
          word_en: "key card",
          word_es: "tarjeta llave",
          example_en: "Your key card needs to be reactivated.",
          example_es: "Su tarjeta llave necesita reactivarse.",
        },
        {
          word_en: "verify",
          word_es: "verificar",
          example_en: "We just need to verify your identity.",
          example_es: "Solo necesitamos verificar su identidad.",
        },
      ],
    },
    {
      id: "b-015",
      level: "B1",
      listening: {
        audio_text:
          "Is there a pharmacy nearby? My daughter has a fever and we need something tonight.",
        options: [
          { emoji: "💊", text_es: "Indicar la farmacia más cercana y ofrecer ayuda concreta", correct: true },
          { emoji: "🍵", text_es: "Ofrecerle un té y que descanse", correct: false },
          { emoji: "📞", text_es: "Decirle que pregunte en recepción mañana", correct: false },
        ],
        explanation_es:
          "Urgencia familiar de noche. Además de indicar la farmacia, una buena respuesta ofrece ayuda activa: llamar, pedir el envío o acompañar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "There's a 24-hour pharmacy two blocks away. I can call them now, or get a taxi for you — whatever is faster for your daughter.",
        note_es:
          "Cuando hay un niño enfermo, el huésped necesita opciones inmediatas, no solo direcciones. Ofrecer dos caminos da control.",
      },
      vocabulary: [
        {
          word_en: "pharmacy",
          word_es: "farmacia",
          example_en: "The pharmacy is open 24 hours.",
          example_es: "La farmacia abre las 24 horas.",
        },
        {
          word_en: "two blocks away",
          word_es: "a dos cuadras",
          example_en: "It's two blocks away from here.",
          example_es: "Está a dos cuadras de aquí.",
        },
        {
          word_en: "fever",
          word_es: "fiebre",
          example_en: "Her fever started tonight.",
          example_es: "Su fiebre empezó esta noche.",
        },
      ],
    },
    {
      id: "b-016",
      level: "B1",
      listening: {
        audio_text:
          "The people next door have been playing loud music for an hour. We can't sleep. Can you do something?",
        options: [
          { emoji: "🤫", text_es: "Disculparse y avisar a seguridad o recepción para atenderlo ya", correct: true },
          { emoji: "🎵", text_es: "Pedirle que toque la puerta del vecino", correct: false },
          { emoji: "🌙", text_es: "Decirle que es fin de semana y es normal", correct: false },
        ],
        explanation_es:
          "Queja de ruido a medianoche. El botones no confronta al vecino: canaliza a seguridad y da seguimiento al huésped.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm very sorry — you should be able to rest. I'll inform security right now, and I'll check back with you in fifteen minutes to make sure it's quiet.",
        note_es:
          "“You should be able to rest” valida el derecho del huésped. El seguimiento (“check back”) convierte la queja en confianza.",
      },
      vocabulary: [
        {
          word_en: "loud",
          word_es: "fuerte / ruidoso",
          example_en: "The music is too loud.",
          example_es: "La música está demasiado fuerte.",
        },
        {
          word_en: "security",
          word_es: "seguridad",
          example_en: "I'll call security now.",
          example_es: "Llamo a seguridad ahora.",
        },
        {
          word_en: "check back",
          word_es: "volver a verificar",
          example_en: "I'll check back with you soon.",
          example_es: "Vuelvo a verificar con usted en un momento.",
        },
      ],
    },
    {
      id: "b-017",
      level: "B2",
      listening: {
        audio_text:
          "We're expecting a well-known guest this afternoon. Please, no names at the door and no announcements — discretion is essential.",
        options: [
          { emoji: "🤐", text_es: "Confirmar discreción total y coordinar una llegada privada", correct: true },
          { emoji: "📸", text_es: "Avisar al equipo para recibirlo con honores", correct: false },
          { emoji: "📋", text_es: "Pedir el nombre del invitado para el registro público", correct: false },
        ],
        explanation_es:
          "Petición de privacidad para un huésped notable. La respuesta B2 confirma el protocolo discreto sin pedir detalles innecesarios.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Understood completely. We'll use the private entrance, no names will be mentioned, and only the team members involved will be informed.",
        note_es:
          "“Understood completely” cierra el tema sin repetir lo delicado en voz alta. Enumerar el protocolo demuestra que sí habrá ejecución.",
      },
      vocabulary: [
        {
          word_en: "discretion",
          word_es: "discreción",
          example_en: "You can count on our discretion.",
          example_es: "Puede contar con nuestra discreción.",
        },
        {
          word_en: "private entrance",
          word_es: "entrada privada",
          example_en: "We'll use the private entrance.",
          example_es: "Usaremos la entrada privada.",
        },
        {
          word_en: "involved",
          word_es: "involucrado",
          example_en: "Only the staff involved will know.",
          example_es: "Solo el personal involucrado lo sabrá.",
        },
      ],
    },
    {
      id: "b-018",
      level: "B2",
      listening: {
        audio_text:
          "I checked out this morning and I think I left my laptop charger in room 512. I'm already at the airport — is there any way to get it back?",
        options: [
          { emoji: "🔌", text_es: "Revisar objetos perdidos y ofrecer envío o resguardo", correct: true },
          { emoji: "🤷", text_es: "Decirle que la habitación ya se limpió y no hay nada", correct: false },
          { emoji: "🛒", text_es: "Sugerirle comprar otro en el aeropuerto", correct: false },
        ],
        explanation_es:
          "Huésped a distancia con un objeto olvidado. La respuesta B2 ofrece el proceso completo: buscar, confirmar y enviar o resguardar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Let me check with housekeeping and our lost-and-found right away. If we find it, we can ship it to you or hold it here — I'll call you back within the hour either way.",
        note_es:
          "“Either way” promete una llamada aunque no aparezca — eso es lo que distingue un hotel serio: cerrar el ciclo siempre.",
      },
      vocabulary: [
        {
          word_en: "charger",
          word_es: "cargador",
          example_en: "We found your laptop charger.",
          example_es: "Encontramos su cargador de laptop.",
        },
        {
          word_en: "lost and found",
          word_es: "objetos perdidos",
          example_en: "It's in our lost and found.",
          example_es: "Está en objetos perdidos.",
        },
        {
          word_en: "ship",
          word_es: "enviar (por paquetería)",
          example_en: "We can ship it to your address.",
          example_es: "Podemos enviarlo a su dirección.",
        },
      ],
    },
    {
      id: "b-019",
      level: "B2",
      listening: {
        audio_text:
          "My mother uses a wheelchair. Could you tell me the best step-free route to the restaurant, and is someone available to assist us at seven?",
        options: [
          { emoji: "♿", text_es: "Describir la ruta accesible y confirmar asistencia a las 7", correct: true },
          { emoji: "🛗", text_es: "Decirle que use las escaleras del lobby", correct: false },
          { emoji: "🍽️", text_es: "Sugerirle pedir servicio a la habitación mejor", correct: false },
        ],
        explanation_es:
          "Dos necesidades: ruta accesible y asistencia a una hora. La respuesta B2 confirma ambas con detalle y sin hacer sentir al huésped una carga.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course. The step-free route is through the garden ramp, past the elevator. And yes — I'll personally meet you at your room at seven to accompany you both.",
        note_es:
          "“I'll personally meet you” transforma asistencia en hospitalidad. La accesibilidad se atiende con naturalidad, nunca con lástima.",
      },
      vocabulary: [
        {
          word_en: "wheelchair",
          word_es: "silla de ruedas",
          example_en: "The route is wheelchair accessible.",
          example_es: "La ruta es accesible para silla de ruedas.",
        },
        {
          word_en: "step-free",
          word_es: "sin escalones",
          example_en: "This is the step-free route.",
          example_es: "Esta es la ruta sin escalones.",
        },
        {
          word_en: "ramp",
          word_es: "rampa",
          example_en: "Take the garden ramp.",
          example_es: "Tome la rampa del jardín.",
        },
      ],
    },
    {
      id: "b-020",
      level: "B2",
      listening: {
        audio_text:
          "We need theater tickets for tonight's show, a dinner reservation before it — somewhere quiet — and a car between the two. Can you arrange all that?",
        options: [
          { emoji: "🎭", text_es: "Confirmar cada punto y resumir el plan completo", correct: true },
          { emoji: "🎫", text_es: "Resolver solo los boletos y olvidar lo demás", correct: false },
          { emoji: "📞", text_es: "Darle los teléfonos para que él haga las llamadas", correct: false },
        ],
        explanation_es:
          "Petición triple estilo concierge. La clave B2: confirmar cada elemento, resumir el plan y quedar como punto único de contacto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Absolutely. So: two tickets for tonight's show, a quiet dinner at 6:30 nearby, and a car waiting after dinner. I'll confirm everything within twenty minutes and bring the details to your room.",
        note_es:
          "Resumir la petición en voz alta (“So: …”) demuestra control y evita malentendidos. Un solo responsable, un solo cierre.",
      },
      vocabulary: [
        {
          word_en: "tickets",
          word_es: "boletos",
          example_en: "Two tickets for tonight's show.",
          example_es: "Dos boletos para la función de esta noche.",
        },
        {
          word_en: "somewhere quiet",
          word_es: "un lugar tranquilo",
          example_en: "A table somewhere quiet, please.",
          example_es: "Una mesa en un lugar tranquilo, por favor.",
        },
        {
          word_en: "confirm",
          word_es: "confirmar",
          example_en: "I'll confirm everything shortly.",
          example_es: "Confirmo todo en breve.",
        },
      ],
    },
  ],

  frontdesk: [
    {
      id: "f-001",
      level: "A2",
      listening: {
        audio_text: "Hi, I have a reservation under the name Smith. Two nights.",
        options: [
          { emoji: "📋", text_es: "Buscar la reservación y comenzar el check-in", correct: true },
          { emoji: "🛎️", text_es: "Llamar al botones", correct: false },
          { emoji: "🍳", text_es: "Reservar mesa en el restaurante", correct: false },
        ],
        explanation_es:
          "El huésped llega con una reservación. Lo primero es buscarlo en el sistema y confirmar. Pedir identificación viene después.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Welcome, Mr. Smith. I have your reservation right here — two nights, queen room. May I see your ID, please?",
        note_es:
          "Confirmar la reservación con detalles que el huésped pueda verificar (noches, tipo de habitación) genera confianza inmediata.",
      },
      vocabulary: [
        {
          word_en: "reservation",
          word_es: "reservación",
          example_en: "Your reservation is for two nights.",
          example_es: "Su reservación es por dos noches.",
        },
        {
          word_en: "ID",
          word_es: "identificación",
          example_en: "May I see your ID, please?",
          example_es: "¿Me permite su identificación, por favor?",
        },
        {
          word_en: "check-in",
          word_es: "registro de entrada",
          example_en: "Check-in starts at 3 p.m.",
          example_es: "El check-in comienza a las 3 p.m.",
        },
      ],
    },
    {
      id: "f-002",
      level: "B1",
      listening: {
        audio_text:
          "I booked a king suite, but you've given me a regular room. This isn't what I paid for.",
        options: [
          { emoji: "🛏️", text_es: "Disculparse, revisar la reservación, ofrecer solución", correct: true },
          { emoji: "📞", text_es: "Llamar a la limpieza", correct: false },
          { emoji: "🚪", text_es: "Pedirle que regrese mañana", correct: false },
        ],
        explanation_es:
          "Una queja real con dinero de por medio. La respuesta es: reconocer, verificar, ofrecer alternativa concreta.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm very sorry for the confusion, sir. Let me check your booking and see what we can do — I'll have the right room ready for you in a few minutes.",
        note_es:
          "“I'm very sorry for the confusion” es la fórmula correcta — no admite culpa pero reconoce el problema del huésped.",
      },
      vocabulary: [
        {
          word_en: "confusion",
          word_es: "confusión",
          example_en: "I'm sorry for the confusion.",
          example_es: "Lamento la confusión.",
        },
        {
          word_en: "booking",
          word_es: "reservación",
          example_en: "Let me check your booking.",
          example_es: "Permítame revisar su reservación.",
        },
        {
          word_en: "what we can do",
          word_es: "qué podemos hacer",
          example_en: "Let me see what we can do.",
          example_es: "Déjeme ver qué podemos hacer.",
        },
      ],
    },
    {
      id: "f-003",
      level: "A2",
      listening: {
        audio_text: "What time is breakfast, and is it included in my rate?",
        options: [
          { emoji: "🍳", text_es: "Decirle el horario y si está incluido en su tarifa", correct: true },
          { emoji: "🛎️", text_es: "Llamar al chef", correct: false },
          { emoji: "🛏️", text_es: "Cambiarle la habitación", correct: false },
        ],
        explanation_es:
          "Dos preguntas en una. La respuesta debe contestar ambas: horario y si está incluido.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Breakfast is from 7 to 10 a.m., sir, and yes — it's included in your rate.",
        note_es:
          "Responder en el mismo orden de las preguntas. “And yes” es más cálido que solo “yes”.",
      },
      vocabulary: [
        {
          word_en: "breakfast",
          word_es: "desayuno",
          example_en: "Breakfast is from 7 to 10.",
          example_es: "El desayuno es de 7 a 10.",
        },
        {
          word_en: "included",
          word_es: "incluido",
          example_en: "It's included in your rate.",
          example_es: "Está incluido en su tarifa.",
        },
        {
          word_en: "rate",
          word_es: "tarifa",
          example_en: "Your rate is $180 per night.",
          example_es: "Su tarifa es de $180 por noche.",
        },
      ],
    },
    {
      id: "f-004",
      level: "A1",
      listening: {
        audio_text: "Hello. What is the Wi-Fi password?",
        options: [
          { emoji: "📶", text_es: "Darle la contraseña del Wi-Fi", correct: true },
          { emoji: "🛏️", text_es: "Ofrecerle cambiar de habitación", correct: false },
          { emoji: "🧳", text_es: "Llamar al botones", correct: false },
        ],
        explanation_es:
          "Pregunta directa por la contraseña del Wi-Fi. Se da la información de forma clara y amable.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course. The network is Hotel-Guest and the password is welcome2026, all lowercase.",
        note_es:
          "Decir la red y la contraseña juntas, y aclarar “all lowercase”, evita una segunda pregunta.",
      },
      vocabulary: [
        {
          word_en: "password",
          word_es: "contraseña",
          example_en: "The Wi-Fi password is on your key card.",
          example_es: "La contraseña del Wi-Fi está en su tarjeta llave.",
        },
        {
          word_en: "network",
          word_es: "red",
          example_en: "Connect to the Hotel-Guest network.",
          example_es: "Conéctese a la red Hotel-Guest.",
        },
        {
          word_en: "lowercase",
          word_es: "minúsculas",
          example_en: "It's all lowercase.",
          example_es: "Es todo en minúsculas.",
        },
      ],
    },
    {
      id: "f-005",
      level: "B2",
      listening: {
        audio_text:
          "I was charged twice for the minibar and I never opened it. I'd like this corrected before I check out, and frankly I'm not happy.",
        options: [
          {
            emoji: "🧾",
            text_es: "Disculparse, revisar el cargo y corregirlo antes del check-out",
            correct: true,
          },
          { emoji: "🤷", text_es: "Decir que el minibar siempre se cobra", correct: false },
          { emoji: "📞", text_es: "Pedirle que llame más tarde a facturación", correct: false },
        ],
        explanation_es:
          "Queja con dinero y emoción. La respuesta B2 reconoce el sentimiento, asume la acción y da un plazo claro.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I completely understand, and I'm sorry for the inconvenience. I'll review the minibar charges right now and remove anything you didn't use — you'll see the corrected total before you check out.",
        note_es:
          "“I completely understand” valida la molestia sin discutir. Comprometer un resultado y un plazo concreto desactiva la queja.",
      },
      vocabulary: [
        {
          word_en: "charged twice",
          word_es: "cobrado dos veces",
          example_en: "You were charged twice — I'll fix that.",
          example_es: "Le cobraron dos veces — lo voy a corregir.",
        },
        {
          word_en: "inconvenience",
          word_es: "inconveniente / molestia",
          example_en: "I'm sorry for the inconvenience.",
          example_es: "Lamento el inconveniente.",
        },
        {
          word_en: "corrected total",
          word_es: "total corregido",
          example_en: "Here is your corrected total.",
          example_es: "Aquí está su total corregido.",
        },
      ],
    },
    {
      id: "f-006",
      level: "A1",
      listening: {
        audio_text: "What time is check-out?",
        options: [
          { emoji: "🕛", text_es: "Decirle la hora de salida", correct: true },
          { emoji: "🔑", text_es: "Pedirle su llave ahora", correct: false },
          { emoji: "🧳", text_es: "Llamar al botones", correct: false },
        ],
        explanation_es:
          "Pregunta simple por la hora de salida. Se responde la hora y se ofrece ayuda si necesita más tiempo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Check-out is at 12 noon, sir. If you need more time, just let us know.",
        note_es:
          "Dar la hora y abrir la puerta al late check-out en la misma frase — servicio que se anticipa.",
      },
      vocabulary: [
        {
          word_en: "check-out",
          word_es: "salida / check-out",
          example_en: "Check-out is at noon.",
          example_es: "La salida es a las 12 del día.",
        },
        {
          word_en: "noon",
          word_es: "mediodía",
          example_en: "It's at 12 noon.",
          example_es: "Es a las 12 del mediodía.",
        },
        {
          word_en: "let us know",
          word_es: "avísenos",
          example_en: "Just let us know, please.",
          example_es: "Solo avísenos, por favor.",
        },
      ],
    },
    {
      id: "f-007",
      level: "A1",
      listening: {
        audio_text: "Hi. Can I have another key card, please? Room 308.",
        options: [
          { emoji: "🪪", text_es: "Pedir identificación y hacer otra tarjeta", correct: true },
          { emoji: "🔑", text_es: "Darle la tarjeta sin verificar", correct: false },
          { emoji: "🛏️", text_es: "Cambiarlo de habitación", correct: false },
        ],
        explanation_es:
          "Pide otra tarjeta llave. Siempre se verifica identidad antes de entregarla — es seguridad, no desconfianza.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. May I see your ID, please? I'll have your new key ready in a moment.",
        note_es:
          "La verificación se pide con amabilidad y se compensa con rapidez (“in a moment”). Seguridad sin fricción.",
      },
      vocabulary: [
        {
          word_en: "another",
          word_es: "otro / otra",
          example_en: "Can I have another key?",
          example_es: "¿Me da otra llave?",
        },
        {
          word_en: "in a moment",
          word_es: "en un momento",
          example_en: "It will be ready in a moment.",
          example_es: "Estará lista en un momento.",
        },
        {
          word_en: "ready",
          word_es: "listo / lista",
          example_en: "Your key is ready.",
          example_es: "Su llave está lista.",
        },
      ],
    },
    {
      id: "f-008",
      level: "A1",
      listening: {
        audio_text: "Excuse me, where is the elevator?",
        options: [
          { emoji: "🛗", text_es: "Indicarle dónde está el elevador", correct: true },
          { emoji: "🪜", text_es: "Mandarlo por las escaleras", correct: false },
          { emoji: "🧳", text_es: "Cargar sus maletas", correct: false },
        ],
        explanation_es:
          "Pregunta básica de ubicación. Respuesta corta, clara y con un gesto de la mano que acompañe.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The elevator is right there, behind the columns. After you, ma'am.",
        note_es:
          "“Right there” + un punto de referencia visible (“behind the columns”) orienta de inmediato. “Ma'am” es el trato formal correcto.",
      },
      vocabulary: [
        {
          word_en: "behind",
          word_es: "detrás de",
          example_en: "It's behind the columns.",
          example_es: "Está detrás de las columnas.",
        },
        {
          word_en: "ma'am",
          word_es: "señora",
          example_en: "Good morning, ma'am.",
          example_es: "Buenos días, señora.",
        },
        {
          word_en: "right there",
          word_es: "justo ahí",
          example_en: "The elevator is right there.",
          example_es: "El elevador está justo ahí.",
        },
      ],
    },
    {
      id: "f-009",
      level: "A1",
      listening: {
        audio_text: "Do you take credit cards?",
        options: [
          { emoji: "💳", text_es: "Confirmar qué tarjetas se aceptan", correct: true },
          { emoji: "💵", text_es: "Decirle que solo efectivo", correct: false },
          { emoji: "🧾", text_es: "Imprimirle la cuenta", correct: false },
        ],
        explanation_es:
          "Pregunta por formas de pago. Se confirma con claridad qué tarjetas se aceptan.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, of course. We take Visa, Mastercard and American Express.",
        note_es:
          "Nombrar las tarjetas evita la siguiente pregunta. Respuesta completa en una sola frase.",
      },
      vocabulary: [
        {
          word_en: "credit card",
          word_es: "tarjeta de crédito",
          example_en: "Do you take credit cards?",
          example_es: "¿Aceptan tarjetas de crédito?",
        },
        {
          word_en: "we take",
          word_es: "aceptamos",
          example_en: "We take all major cards.",
          example_es: "Aceptamos todas las tarjetas principales.",
        },
        {
          word_en: "cash",
          word_es: "efectivo",
          example_en: "Card or cash?",
          example_es: "¿Tarjeta o efectivo?",
        },
      ],
    },
    {
      id: "f-010",
      level: "A2",
      listening: {
        audio_text: "Our flight leaves at night. Could we have a late check-out, maybe 3 p.m.?",
        options: [
          { emoji: "🕒", text_es: "Revisar disponibilidad y confirmar hora y costo si aplica", correct: true },
          { emoji: "🚫", text_es: "Decirle que las reglas son las reglas", correct: false },
          { emoji: "🧳", text_es: "Ofrecerle solo guardar el equipaje", correct: false },
        ],
        explanation_es:
          "Petición de salida tardía. Se revisa disponibilidad y se responde con hora y condiciones claras — incluido el costo si existe.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Let me check for you… Yes, we can offer 3 p.m. for a small fee of 300 pesos, or 1 p.m. at no charge. Which would you prefer?",
        note_es:
          "Dar dos opciones con condiciones claras pone la decisión en el huésped. Transparencia en el costo evita molestias al pagar.",
      },
      vocabulary: [
        {
          word_en: "late check-out",
          word_es: "salida tardía",
          example_en: "We can offer a late check-out.",
          example_es: "Podemos ofrecerle salida tardía.",
        },
        {
          word_en: "fee",
          word_es: "cargo / costo",
          example_en: "There's a small fee.",
          example_es: "Hay un cargo pequeño.",
        },
        {
          word_en: "at no charge",
          word_es: "sin costo",
          example_en: "Until 1 p.m. at no charge.",
          example_es: "Hasta la 1 p.m. sin costo.",
        },
      ],
    },
    {
      id: "f-011",
      level: "A2",
      listening: {
        audio_text: "The room is a bit cold at night. Could we get an extra blanket?",
        options: [
          { emoji: "🛌", text_es: "Enviar una cobija extra y ofrecer revisar la calefacción", correct: true },
          { emoji: "🧥", text_es: "Sugerirle dormir con abrigo", correct: false },
          { emoji: "🛏️", text_es: "Cambiarlo de hotel", correct: false },
        ],
        explanation_es:
          "Petición sencilla de confort. Se cumple lo pedido (cobija) y se ofrece atender la causa (temperatura).",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course — I'll send an extra blanket up right away. Would you also like us to check the thermostat?",
        note_es:
          "Cumplir la petición y ofrecer resolver la causa raíz. El huésped pidió una cobija; el hotel ofrece confort completo.",
      },
      vocabulary: [
        {
          word_en: "blanket",
          word_es: "cobija",
          example_en: "I'll send an extra blanket.",
          example_es: "Le envío una cobija extra.",
        },
        {
          word_en: "thermostat",
          word_es: "termostato",
          example_en: "We can check the thermostat.",
          example_es: "Podemos revisar el termostato.",
        },
        {
          word_en: "send up",
          word_es: "subir / enviar a la habitación",
          example_en: "I'll send it up now.",
          example_es: "Se lo subo ahora.",
        },
      ],
    },
    {
      id: "f-012",
      level: "A2",
      listening: {
        audio_text: "It's our first time in the city. Do you have a map? What should we visit?",
        options: [
          { emoji: "🗺️", text_es: "Darle un mapa y recomendar dos o tres lugares", correct: true },
          { emoji: "📱", text_es: "Decirle que busque en internet", correct: false },
          { emoji: "🚕", text_es: "Subirlo a un taxi sin destino", correct: false },
        ],
        explanation_es:
          "Turistas primerizos. Mapa + dos o tres recomendaciones concretas según su tiempo — no una lista infinita.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Welcome! Here's a map. If you have one day, I'd start with the old town, the cathedral, and the market — all walking distance from here.",
        note_es:
          "Recomendar poco y bien (“if you have one day”) es más útil que listar todo. “Walking distance” responde la pregunta que no hicieron.",
      },
      vocabulary: [
        {
          word_en: "map",
          word_es: "mapa",
          example_en: "Here's a map of the city.",
          example_es: "Aquí tiene un mapa de la ciudad.",
        },
        {
          word_en: "old town",
          word_es: "centro histórico",
          example_en: "Start with the old town.",
          example_es: "Empiece por el centro histórico.",
        },
        {
          word_en: "walking distance",
          word_es: "a distancia caminable",
          example_en: "It's all walking distance.",
          example_es: "Todo está a distancia caminable.",
        },
      ],
    },
    {
      id: "f-013",
      level: "B1",
      listening: {
        audio_text:
          "We just landed and came straight here. I know it's only 10 a.m. — is there any chance our room is ready?",
        options: [
          { emoji: "🕙", text_es: "Revisar el estado de la habitación y ofrecer alternativas mientras tanto", correct: true },
          { emoji: "🚫", text_es: "Decirle que regrese a las 3 p.m. en punto", correct: false },
          { emoji: "🛏️", text_es: "Darle cualquier habitación aunque no esté lista", correct: false },
        ],
        explanation_es:
          "Llegada temprana tras un vuelo. Aunque la habitación no esté lista, se ofrece un plan: guardar equipaje, avisar por mensaje, sugerir el desayuno.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Let me check… it's being prepared right now. We'll keep your luggage safe, and I'll text you the moment it's ready — feel free to enjoy breakfast meanwhile.",
        note_es:
          "El “no todavía” se convierte en plan con tres piezas: equipaje seguro, aviso proactivo y una sugerencia para la espera.",
      },
      vocabulary: [
        {
          word_en: "being prepared",
          word_es: "en preparación",
          example_en: "Your room is being prepared.",
          example_es: "Su habitación está en preparación.",
        },
        {
          word_en: "the moment it's ready",
          word_es: "en cuanto esté lista",
          example_en: "I'll call you the moment it's ready.",
          example_es: "Le llamo en cuanto esté lista.",
        },
        {
          word_en: "meanwhile",
          word_es: "mientras tanto",
          example_en: "Enjoy a coffee meanwhile.",
          example_es: "Disfrute un café mientras tanto.",
        },
      ],
    },
    {
      id: "f-014",
      level: "B1",
      listening: {
        audio_text:
          "That's strange — I booked through your website last week, but you say there's no reservation under my name?",
        options: [
          { emoji: "🔎", text_es: "Mantener la calma, pedir número de confirmación y buscar alternativas", correct: true },
          { emoji: "🤷", text_es: "Decirle que sin reservación no hay nada que hacer", correct: false },
          { emoji: "💻", text_es: "Culpar al sitio web y pedirle que llame él", correct: false },
        ],
        explanation_es:
          "Reservación que no aparece. Se investiga con método (confirmación, otro apellido, otra fecha) y se asegura que el huésped no quede sin opciones.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm sure we can sort this out. Do you have the confirmation number or the email? Let me search by that — and if anything went wrong on our side, we'll find you a room.",
        note_es:
          "“We can sort this out” calma desde la primera frase. Comprometerse al resultado (“we'll find you a room”) elimina el miedo real del huésped.",
      },
      vocabulary: [
        {
          word_en: "confirmation number",
          word_es: "número de confirmación",
          example_en: "Do you have your confirmation number?",
          example_es: "¿Tiene su número de confirmación?",
        },
        {
          word_en: "sort out",
          word_es: "resolver / aclarar",
          example_en: "We'll sort this out quickly.",
          example_es: "Lo resolveremos rápido.",
        },
        {
          word_en: "on our side",
          word_es: "de nuestra parte",
          example_en: "If the error is on our side, we'll fix it.",
          example_es: "Si el error es de nuestra parte, lo corregimos.",
        },
      ],
    },
    {
      id: "f-015",
      level: "B1",
      listening: {
        audio_text:
          "We're enjoying our stay. Could we extend two more nights in the same room?",
        options: [
          { emoji: "📅", text_es: "Revisar disponibilidad y confirmar tarifa para las noches extra", correct: true },
          { emoji: "✅", text_es: "Decir que sí sin revisar el sistema", correct: false },
          { emoji: "🛏️", text_es: "Ofrecerle otro hotel de una vez", correct: false },
        ],
        explanation_es:
          "Extensión de estancia: buena noticia, pero hay que verificar disponibilidad y dejar clara la tarifa antes de confirmar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Wonderful to hear! Let me check… yes, the same room is available. The rate for the extra nights is 2,200 pesos per night — shall I confirm them?",
        note_es:
          "Celebrar la noticia (“wonderful to hear”), verificar antes de prometer, y cerrar con una pregunta de confirmación clara.",
      },
      vocabulary: [
        {
          word_en: "extend",
          word_es: "extender",
          example_en: "We'd like to extend our stay.",
          example_es: "Queremos extender nuestra estancia.",
        },
        {
          word_en: "available",
          word_es: "disponible",
          example_en: "The room is available.",
          example_es: "La habitación está disponible.",
        },
        {
          word_en: "per night",
          word_es: "por noche",
          example_en: "It's 2,200 pesos per night.",
          example_es: "Son 2,200 pesos por noche.",
        },
      ],
    },
    {
      id: "f-016",
      level: "B1",
      listening: {
        audio_text:
          "I'll need an invoice for my company — a factura with our tax ID. How does that work here?",
        options: [
          { emoji: "🧾", text_es: "Explicar el proceso de facturación y pedir los datos fiscales", correct: true },
          { emoji: "🤔", text_es: "Decirle que el ticket es suficiente", correct: false },
          { emoji: "📧", text_es: "Pedirle que lo resuelva con su contador", correct: false },
        ],
        explanation_es:
          "Huésped de negocios pide factura con RFC. Se explica el proceso simple: datos fiscales, correo, y cuándo la recibe.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course. I'll just need your company's tax ID and the billing email — we'll send the invoice today before your check-out.",
        note_es:
          "Para viajeros de negocios la factura es crítica. Pedir exactamente dos datos y comprometer un plazo resuelve el tema en un minuto.",
      },
      vocabulary: [
        {
          word_en: "invoice",
          word_es: "factura",
          example_en: "We'll send the invoice today.",
          example_es: "Le enviamos la factura hoy.",
        },
        {
          word_en: "tax ID",
          word_es: "RFC / identificación fiscal",
          example_en: "I'll need your company's tax ID.",
          example_es: "Necesito el RFC de su empresa.",
        },
        {
          word_en: "billing email",
          word_es: "correo de facturación",
          example_en: "What's your billing email?",
          example_es: "¿Cuál es su correo de facturación?",
        },
      ],
    },
    {
      id: "f-017",
      level: "B2",
      listening: {
        audio_text:
          "What do you mean there's no room? I have a confirmed booking, I've been traveling for twelve hours, and now you're telling me the hotel is full?",
        options: [
          {
            emoji: "🏨",
            text_es: "Disculparse, asumir el problema y resolver el traslado a un hotel igual o mejor, con costos cubiertos",
            correct: true,
          },
          { emoji: "📜", text_es: "Explicarle la política de sobreventa en detalle", correct: false },
          { emoji: "⏳", text_es: "Pedirle que espere a ver si alguien cancela", correct: false },
        ],
        explanation_es:
          "Sobreventa con huésped agotado y furioso: el peor escenario de recepción. La respuesta B2 no explica políticas — asume, resuelve y compensa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "You're absolutely right to be upset, and I'm truly sorry. Here's what I'll do right now: we've reserved you a superior room at our partner hotel two minutes away, the taxi and tonight's rate are on us, and I'll call to confirm everything before you leave this desk.",
        note_es:
          "Validar el enojo, asumir sin excusas y presentar la solución completa con compensación. “Before you leave this desk” transmite que nadie lo dejará a la deriva.",
      },
      vocabulary: [
        {
          word_en: "upset",
          word_es: "molesto",
          example_en: "You're right to be upset.",
          example_es: "Tiene razón en estar molesto.",
        },
        {
          word_en: "partner hotel",
          word_es: "hotel aliado",
          example_en: "Our partner hotel is nearby.",
          example_es: "Nuestro hotel aliado está cerca.",
        },
        {
          word_en: "on us",
          word_es: "por nuestra cuenta",
          example_en: "The taxi is on us.",
          example_es: "El taxi va por nuestra cuenta.",
        },
      ],
    },
    {
      id: "f-018",
      level: "B2",
      listening: {
        audio_text:
          "This is the second time I've called. It's 1 a.m. and the party in the room above is still going. If this isn't solved now, I want another room or a refund.",
        options: [
          {
            emoji: "🌙",
            text_es: "Disculparse por la recurrencia, actuar ya (seguridad o cambio de habitación) y dar seguimiento personal",
            correct: true,
          },
          { emoji: "🙏", text_es: "Pedirle paciencia, es temporada alta", correct: false },
          { emoji: "📋", text_es: "Registrar la queja para el turno de mañana", correct: false },
        ],
        explanation_es:
          "Segunda llamada = la primera falló. A esta altura la respuesta debe ofrecer acción inmediata Y una alternativa concreta, no otra promesa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "You're right — this should have been solved the first time, and I apologize. Security is going up right now, and I've also prepared room 612, quiet side, if you prefer to move. Either way, I'll personally call you back in ten minutes.",
        note_es:
          "Reconocer la falla previa es lo que recupera la confianza. Ofrecer la habitación ya preparada demuestra acción, no intención.",
      },
      vocabulary: [
        {
          word_en: "should have been solved",
          word_es: "debió resolverse",
          example_en: "This should have been solved earlier.",
          example_es: "Esto debió resolverse antes.",
        },
        {
          word_en: "quiet side",
          word_es: "lado tranquilo",
          example_en: "Room 612 is on the quiet side.",
          example_es: "La 612 está en el lado tranquilo.",
        },
        {
          word_en: "call you back",
          word_es: "devolverle la llamada",
          example_en: "I'll call you back in ten minutes.",
          example_es: "Le devuelvo la llamada en diez minutos.",
        },
      ],
    },
    {
      id: "f-019",
      level: "B2",
      listening: {
        audio_text:
          "My card was charged as a no-show, but I cancelled through the booking site three days before. I have the cancellation email right here.",
        options: [
          {
            emoji: "🔍",
            text_es: "Revisar la evidencia, explicar el proceso con la agencia y comprometer una resolución con fecha",
            correct: true,
          },
          { emoji: "🏦", text_es: "Decirle que reclame a su banco", correct: false },
          { emoji: "📧", text_es: "Negar el cargo sin revisar nada", correct: false },
        ],
        explanation_es:
          "Disputa de cargo con intermediario (OTA). La respuesta B2 revisa la evidencia, explica quién hace qué, y se queda como responsable del seguimiento.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Thank you for showing me — that cancellation looks valid. I'll open a case with the booking site today and follow up with our billing team. You'll have an answer from me by Friday at the latest, by email.",
        note_es:
          "En disputas con agencias, el hotel no promete el reembolso ajeno — promete el proceso, el responsable y la fecha. Eso es lo que el huésped necesita oír.",
      },
      vocabulary: [
        {
          word_en: "no-show",
          word_es: "no presentarse (cargo por no-show)",
          example_en: "You were charged as a no-show.",
          example_es: "Le cobraron como no-show.",
        },
        {
          word_en: "open a case",
          word_es: "abrir un caso / reporte",
          example_en: "I'll open a case with the agency.",
          example_es: "Abriré un caso con la agencia.",
        },
        {
          word_en: "at the latest",
          word_es: "a más tardar",
          example_en: "By Friday at the latest.",
          example_es: "El viernes a más tardar.",
        },
      ],
    },
    {
      id: "f-020",
      level: "B2",
      listening: {
        audio_text:
          "My husband feels dizzy and his chest hurts a little. I don't know if it's serious, but is there a doctor who can come?",
        options: [
          {
            emoji: "🩺",
            text_es: "Mantener la calma, llamar al médico de guardia ya y ofrecer acompañamiento inmediato",
            correct: true,
          },
          { emoji: "💊", text_es: "Recomendarle una pastilla y reposo", correct: false },
          { emoji: "📞", text_es: "Darle el teléfono de una clínica para que llame", correct: false },
        ],
        explanation_es:
          "Posible emergencia médica. La recepción no diagnostica ni minimiza: activa al médico de guardia, acompaña, y mantiene la calma del huésped.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm calling our on-call doctor right now — they can be in your room within fifteen minutes. I'm also sending a colleague up to stay with you. If anything changes, call me directly at this desk.",
        note_es:
          "En salud: acción inmediata, presencia humana y una línea directa. Hablar con calma y en pasos concretos es lo que más tranquiliza.",
      },
      vocabulary: [
        {
          word_en: "dizzy",
          word_es: "mareado",
          example_en: "He feels dizzy.",
          example_es: "Se siente mareado.",
        },
        {
          word_en: "on-call doctor",
          word_es: "médico de guardia",
          example_en: "Our on-call doctor is coming.",
          example_es: "Nuestro médico de guardia viene en camino.",
        },
        {
          word_en: "stay with you",
          word_es: "quedarse con usted",
          example_en: "A colleague will stay with you.",
          example_es: "Un colega se quedará con usted.",
        },
      ],
    },
  ],

  restaurant: [
    {
      id: "r-001",
      level: "A2",
      listening: {
        audio_text: "Could we have the menu, please? And some water for the table.",
        options: [
          { emoji: "📋", text_es: "Traer menús y agua para la mesa", correct: true },
          { emoji: "🍷", text_es: "Traer la carta de vinos", correct: false },
          { emoji: "💳", text_es: "Traer la cuenta", correct: false },
        ],
        explanation_es:
          "Dos cosas en la misma pregunta: menús y agua. Confirmar ambas evita un viaje extra.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course. I'll bring the menus and water right away. Still or sparkling?",
        note_es:
          "Anticipar la siguiente pregunta (still o sparkling) demuestra atención. Salva un viaje extra.",
      },
      vocabulary: [
        {
          word_en: "menu",
          word_es: "menú",
          example_en: "Here's the menu, sir.",
          example_es: "Aquí está el menú, señor.",
        },
        {
          word_en: "still water",
          word_es: "agua sin gas",
          example_en: "Would you like still or sparkling?",
          example_es: "¿Le gustaría con o sin gas?",
        },
        {
          word_en: "sparkling water",
          word_es: "agua con gas",
          example_en: "Sparkling water for the table.",
          example_es: "Agua con gas para la mesa.",
        },
      ],
    },
    {
      id: "r-002",
      level: "B1",
      listening: {
        audio_text:
          "I'm allergic to nuts. Are there any dishes I should avoid?",
        options: [
          { emoji: "🥜", text_es: "Avisar al chef y revisar el menú con el huésped", correct: true },
          { emoji: "🍷", text_es: "Recomendar el vino del día", correct: false },
          { emoji: "🍰", text_es: "Sugerir el postre de chocolate", correct: false },
        ],
        explanation_es:
          "Alergias son un asunto de seguridad. La respuesta correcta avisa al chef y revisa el menú con el huésped — nunca improvisar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Thank you for letting me know. Let me check with the chef — we'll go through the menu together to make sure everything is safe for you.",
        note_es:
          "“Thank you for letting me know” es crítico — convierte la advertencia en colaboración, no en queja.",
      },
      vocabulary: [
        {
          word_en: "allergic",
          word_es: "alérgico",
          example_en: "I'm allergic to nuts.",
          example_es: "Soy alérgico a las nueces.",
        },
        {
          word_en: "the chef",
          word_es: "el chef",
          example_en: "Let me check with the chef.",
          example_es: "Permítame consultar con el chef.",
        },
        {
          word_en: "safe",
          word_es: "seguro",
          example_en: "I'll make sure everything is safe.",
          example_es: "Me aseguraré de que todo sea seguro.",
        },
      ],
    },
    {
      id: "r-003",
      level: "B1",
      listening: {
        audio_text: "Could we split the bill, please? Three ways.",
        options: [
          { emoji: "💳", text_es: "Confirmar y dividir la cuenta entre tres", correct: true },
          { emoji: "🍷", text_es: "Traer otra ronda", correct: false },
          { emoji: "🔄", text_es: "Recoger los platos", correct: false },
        ],
        explanation_es:
          "Pide dividir la cuenta en tres. Confirmar la división evita errores con la propina y los métodos de pago.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course. Three ways equally — or would you like to split by what each of you ordered?",
        note_es:
          "Confirmar la modalidad de división (parejo o por consumo) antes de procesar evita corregir después.",
      },
      vocabulary: [
        {
          word_en: "split the bill",
          word_es: "dividir la cuenta",
          example_en: "Could we split the bill?",
          example_es: "¿Podríamos dividir la cuenta?",
        },
        {
          word_en: "equally",
          word_es: "en partes iguales",
          example_en: "Three ways equally?",
          example_es: "¿En tres partes iguales?",
        },
        {
          word_en: "what each ordered",
          word_es: "lo que cada uno pidió",
          example_en: "Or split by what each of you ordered?",
          example_es: "¿O dividir por lo que cada uno pidió?",
        },
      ],
    },
    {
      id: "r-004",
      level: "A1",
      listening: {
        audio_text: "The check, please.",
        options: [
          { emoji: "🧾", text_es: "Traer la cuenta", correct: true },
          { emoji: "🍰", text_es: "Ofrecer el postre", correct: false },
          { emoji: "🍷", text_es: "Traer más vino", correct: false },
        ],
        explanation_es:
          "El huésped pide la cuenta. La acción correcta es traerla de inmediato, sin ofrecer más cosas.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll bring the check right away.",
        note_es:
          "Cuando piden la cuenta, no es momento de vender más — “right away” respeta su tiempo.",
      },
      vocabulary: [
        {
          word_en: "check",
          word_es: "cuenta",
          example_en: "Here is your check, sir.",
          example_es: "Aquí está su cuenta, señor.",
        },
        {
          word_en: "of course",
          word_es: "por supuesto",
          example_en: "Of course, right away.",
          example_es: "Por supuesto, enseguida.",
        },
        {
          word_en: "bring",
          word_es: "traer",
          example_en: "I'll bring it now.",
          example_es: "Se lo traigo ahora.",
        },
      ],
    },
    {
      id: "r-005",
      level: "B2",
      listening: {
        audio_text:
          "This steak is overcooked — I asked for medium rare. We're celebrating an anniversary and this is disappointing.",
        options: [
          {
            emoji: "👨‍🍳",
            text_es: "Disculparse sinceramente, retirar el plato y ofrecer rehacerlo de inmediato",
            correct: true,
          },
          { emoji: "🤷", text_es: "Explicar que así lo prepara el chef", correct: false },
          { emoji: "🧾", text_es: "Ofrecer un descuento y dejar el plato", correct: false },
        ],
        explanation_es:
          "Plato mal preparado en una ocasión especial. La respuesta B2 reconoce la ocasión, asume el error y lo corrige rápido.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm so sorry — that's not the standard we want for your anniversary. Let me take this back and have the chef prepare a fresh one, medium rare, right away. It's on us.",
        note_es:
          "Nombrar la ocasión (“your anniversary”), asumir el error y ofrecer una solución concreta + cortesía (“on us”) recupera la experiencia.",
      },
      vocabulary: [
        {
          word_en: "overcooked",
          word_es: "demasiado cocido",
          example_en: "I'm sorry it's overcooked.",
          example_es: "Lamento que esté demasiado cocido.",
        },
        {
          word_en: "medium rare",
          word_es: "término medio rojo",
          example_en: "One steak, medium rare.",
          example_es: "Un filete, término medio rojo.",
        },
        {
          word_en: "it's on us",
          word_es: "va por cuenta de la casa",
          example_en: "Dessert is on us tonight.",
          example_es: "El postre va por cuenta de la casa esta noche.",
        },
      ],
    },
    {
      id: "r-006",
      level: "A1",
      listening: {
        audio_text: "Good evening. A table for two, please.",
        options: [
          { emoji: "🪑", text_es: "Llevarlos a una mesa para dos", correct: true },
          { emoji: "🧾", text_es: "Traerles la cuenta", correct: false },
          { emoji: "🍷", text_es: "Servirles vino", correct: false },
        ],
        explanation_es:
          "Llegan dos personas sin reservación. Se les da la bienvenida y se les acompaña a una mesa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Good evening! Of course — right this way, please.",
        note_es:
          "Devolver el saludo antes de actuar. “Right this way” acompaña con el gesto; nunca se señala desde lejos.",
      },
      vocabulary: [
        {
          word_en: "table for two",
          word_es: "mesa para dos",
          example_en: "A table for two, please.",
          example_es: "Una mesa para dos, por favor.",
        },
        {
          word_en: "good evening",
          word_es: "buenas noches (saludo)",
          example_en: "Good evening, welcome!",
          example_es: "¡Buenas noches, bienvenidos!",
        },
        {
          word_en: "right this way",
          word_es: "por aquí, por favor",
          example_en: "Right this way, please.",
          example_es: "Por aquí, por favor.",
        },
      ],
    },
    {
      id: "r-007",
      level: "A1",
      listening: {
        audio_text: "A coffee with milk, please.",
        options: [
          { emoji: "☕", text_es: "Confirmar y traer el café con leche", correct: true },
          { emoji: "🍺", text_es: "Traer una cerveza", correct: false },
          { emoji: "🍰", text_es: "Ofrecer pastel", correct: false },
        ],
        explanation_es:
          "Pedido simple de bebida. Se confirma y se trae pronto — sin cambiar la orden ni ofrecer otra cosa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "One coffee with milk — coming right up.",
        note_es:
          "Repetir la orden en voz alta confirma que se tomó bien. “Coming right up” es la fórmula natural del servicio rápido.",
      },
      vocabulary: [
        {
          word_en: "coffee with milk",
          word_es: "café con leche",
          example_en: "One coffee with milk, please.",
          example_es: "Un café con leche, por favor.",
        },
        {
          word_en: "coming right up",
          word_es: "enseguida sale",
          example_en: "Coming right up, sir.",
          example_es: "Enseguida sale, señor.",
        },
        {
          word_en: "sugar",
          word_es: "azúcar",
          example_en: "Sugar is on the table.",
          example_es: "El azúcar está en la mesa.",
        },
      ],
    },
    {
      id: "r-008",
      level: "A1",
      listening: {
        audio_text: "Excuse me, where is the bathroom?",
        options: [
          { emoji: "🚻", text_es: "Indicarle dónde está el baño", correct: true },
          { emoji: "🍽️", text_es: "Traerle el menú", correct: false },
          { emoji: "🚪", text_es: "Acompañarlo a la salida", correct: false },
        ],
        explanation_es:
          "Pregunta directa por el baño. Indicación corta y clara, con referencia visible.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The bathroom is at the back, to the right of the bar.",
        note_es:
          "Una referencia que se ve desde la mesa (“the bar”) orienta mejor que “al fondo a la derecha” sin contexto.",
      },
      vocabulary: [
        {
          word_en: "bathroom",
          word_es: "baño",
          example_en: "The bathroom is at the back.",
          example_es: "El baño está al fondo.",
        },
        {
          word_en: "at the back",
          word_es: "al fondo",
          example_en: "It's at the back of the restaurant.",
          example_es: "Está al fondo del restaurante.",
        },
        {
          word_en: "to the right of",
          word_es: "a la derecha de",
          example_en: "To the right of the bar.",
          example_es: "A la derecha del bar.",
        },
      ],
    },
    {
      id: "r-009",
      level: "A1",
      listening: {
        audio_text: "Two beers, please. Cold ones.",
        options: [
          { emoji: "🍺", text_es: "Confirmar las dos cervezas y preguntar cuál marca", correct: true },
          { emoji: "🥤", text_es: "Traer dos refrescos", correct: false },
          { emoji: "🍷", text_es: "Sugerir vino tinto", correct: false },
        ],
        explanation_es:
          "Piden dos cervezas frías. Se confirma la cantidad y se pregunta la marca o tipo — la única pregunta necesaria.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Two cold beers, of course. Draft or bottled?",
        note_es:
          "Confirmar y hacer solo la pregunta que falta (“draft or bottled?”). Preguntas de más alargan; preguntas de menos traen errores.",
      },
      vocabulary: [
        {
          word_en: "beer",
          word_es: "cerveza",
          example_en: "Two beers, please.",
          example_es: "Dos cervezas, por favor.",
        },
        {
          word_en: "draft",
          word_es: "de barril",
          example_en: "Draft or bottled?",
          example_es: "¿De barril o de botella?",
        },
        {
          word_en: "bottled",
          word_es: "de botella",
          example_en: "Two bottled beers, very cold.",
          example_es: "Dos cervezas de botella, bien frías.",
        },
      ],
    },
    {
      id: "r-010",
      level: "A2",
      listening: {
        audio_text: "Everything looks good. What do you recommend?",
        options: [
          { emoji: "⭐", text_es: "Recomendar el platillo de la casa y preguntar sus gustos", correct: true },
          { emoji: "🤷", text_es: "Decir que todo es bueno", correct: false },
          { emoji: "💰", text_es: "Recomendar lo más caro", correct: false },
        ],
        explanation_es:
          "Pide una recomendación. “Todo es rico” no ayuda; se recomienda algo concreto y se pregunta una preferencia para afinar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Our fish tacos are the house favorite. Do you prefer seafood or meat? I'll point you to the best of each.",
        note_es:
          "Una recomendación concreta + una pregunta de gusto. Así la sugerencia se siente personal, no de libreto.",
      },
      vocabulary: [
        {
          word_en: "recommend",
          word_es: "recomendar",
          example_en: "What do you recommend?",
          example_es: "¿Qué me recomienda?",
        },
        {
          word_en: "house favorite",
          word_es: "el favorito de la casa",
          example_en: "It's the house favorite.",
          example_es: "Es el favorito de la casa.",
        },
        {
          word_en: "seafood",
          word_es: "mariscos",
          example_en: "Do you prefer seafood or meat?",
          example_es: "¿Prefiere mariscos o carne?",
        },
      ],
    },
    {
      id: "r-011",
      level: "A2",
      listening: {
        audio_text: "Is this salsa very spicy? I can't handle too much heat.",
        options: [
          { emoji: "🌶️", text_es: "Decirle el nivel de picante y ofrecer opciones suaves", correct: true },
          { emoji: "🔥", text_es: "Decirle que aguante, así es México", correct: false },
          { emoji: "🥛", text_es: "Traerle un vaso de leche", correct: false },
        ],
        explanation_es:
          "Pregunta por el picante con preocupación real. Se responde honesto y se ofrece la alternativa suave — sin burlas.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "That one is quite spicy, yes. But our green salsa is mild — I'd start with that one, and I can bring it on the side.",
        note_es:
          "“On the side” (aparte) da control al huésped. Honestidad sobre el picante evita una mala experiencia y una mala propina.",
      },
      vocabulary: [
        {
          word_en: "spicy",
          word_es: "picante / picoso",
          example_en: "Is it very spicy?",
          example_es: "¿Pica mucho?",
        },
        {
          word_en: "mild",
          word_es: "suave (no picante)",
          example_en: "The green salsa is mild.",
          example_es: "La salsa verde es suave.",
        },
        {
          word_en: "on the side",
          word_es: "aparte / al lado",
          example_en: "I'll bring it on the side.",
          example_es: "Se la traigo aparte.",
        },
      ],
    },
    {
      id: "r-012",
      level: "A2",
      listening: {
        audio_text: "It's a beautiful day. Could we sit outside instead?",
        options: [
          { emoji: "🌤️", text_es: "Confirmar si hay mesa en la terraza y reubicarlos", correct: true },
          { emoji: "🚪", text_es: "Decirles que ya están sentados", correct: false },
          { emoji: "🍽️", text_es: "Tomarles la orden donde están", correct: false },
        ],
        explanation_es:
          "Quieren cambiarse a la terraza. Se revisa disponibilidad y se hace el cambio con gusto — la comodidad del huésped manda.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course! Let me check the terrace… we have a lovely table in the shade. Follow me — I'll bring your drinks over.",
        note_es:
          "“I'll bring your drinks over” elimina la fricción del cambio: el huésped no carga nada, el servicio se encarga.",
      },
      vocabulary: [
        {
          word_en: "outside",
          word_es: "afuera",
          example_en: "Could we sit outside?",
          example_es: "¿Podemos sentarnos afuera?",
        },
        {
          word_en: "terrace",
          word_es: "terraza",
          example_en: "The terrace has a free table.",
          example_es: "La terraza tiene una mesa libre.",
        },
        {
          word_en: "in the shade",
          word_es: "en la sombra",
          example_en: "A table in the shade.",
          example_es: "Una mesa en la sombra.",
        },
      ],
    },
    {
      id: "r-013",
      level: "A2",
      listening: {
        audio_text: "Do you have vegetarian options? My wife doesn't eat meat.",
        options: [
          { emoji: "🥗", text_es: "Señalar los platillos vegetarianos del menú", correct: true },
          { emoji: "🥩", text_es: "Recomendar el corte de la casa", correct: false },
          { emoji: "🍟", text_es: "Ofrecer solo papas fritas", correct: false },
        ],
        explanation_es:
          "Preguntan por opciones vegetarianas. Se señalan los platillos del menú y se menciona que el chef puede adaptar otros.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Yes, of course. These three dishes are vegetarian — and the chef can also prepare the pasta without meat if she prefers.",
        note_es:
          "Mostrar lo que existe Y lo que se puede adaptar. “If she prefers” dirige la cortesía a quien come, no a quien pregunta.",
      },
      vocabulary: [
        {
          word_en: "vegetarian",
          word_es: "vegetariano",
          example_en: "These dishes are vegetarian.",
          example_es: "Estos platillos son vegetarianos.",
        },
        {
          word_en: "without meat",
          word_es: "sin carne",
          example_en: "The pasta can be made without meat.",
          example_es: "La pasta se puede preparar sin carne.",
        },
        {
          word_en: "dish",
          word_es: "platillo",
          example_en: "This dish is very popular.",
          example_es: "Este platillo es muy popular.",
        },
      ],
    },
    {
      id: "r-014",
      level: "B1",
      listening: {
        audio_text:
          "Sorry, but I ordered the chicken, not the fish. This isn't what I asked for.",
        options: [
          { emoji: "🔄", text_es: "Disculparse, retirar el plato y corregir la orden con prioridad", correct: true },
          { emoji: "🐟", text_es: "Sugerirle que pruebe el pescado, está bueno", correct: false },
          { emoji: "🧾", text_es: "Revisar la comanda para ver quién se equivocó", correct: false },
        ],
        explanation_es:
          "Orden equivocada. No se discute de quién fue el error frente al huésped: se corrige rápido y se le da prioridad en cocina.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "You're right, I'm sorry. I'll take this back and get your chicken out first — it won't be long. Can I bring you anything while you wait?",
        note_es:
          "“You're right” sin pelear + prioridad en cocina (“out first”) + un gesto durante la espera. Tres movimientos que salvan la mesa.",
      },
      vocabulary: [
        {
          word_en: "I ordered",
          word_es: "yo pedí",
          example_en: "I ordered the chicken.",
          example_es: "Yo pedí el pollo.",
        },
        {
          word_en: "take this back",
          word_es: "llevarse el plato",
          example_en: "I'll take this back to the kitchen.",
          example_es: "Me llevo el plato a la cocina.",
        },
        {
          word_en: "while you wait",
          word_es: "mientras espera",
          example_en: "Some bread while you wait?",
          example_es: "¿Un pan mientras espera?",
        },
      ],
    },
    {
      id: "r-015",
      level: "B1",
      listening: {
        audio_text:
          "We have tickets for a show at eight, so we're in a bit of a hurry. What can come out fast?",
        options: [
          { emoji: "⏱️", text_es: "Recomendar platillos rápidos y avisar a cocina de la prisa", correct: true },
          { emoji: "🍖", text_es: "Recomendar el platillo más elaborado", correct: false },
          { emoji: "🚪", text_es: "Sugerirles ir a otro lugar", correct: false },
        ],
        explanation_es:
          "Huéspedes con tiempo limitado. Se recomienda lo que sale rápido, se avisa a cocina y se ofrece adelantar la cuenta.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "No problem — the grilled fish and any salad come out in under fifteen minutes. I'll tell the kitchen you're catching a show, and I can bring the check with the food to save you time.",
        note_es:
          "Tiempo concreto (“under fifteen minutes”) + dos gestos proactivos: avisar a cocina y adelantar la cuenta. Eso es leer la mesa.",
      },
      vocabulary: [
        {
          word_en: "in a hurry",
          word_es: "con prisa",
          example_en: "We're in a bit of a hurry.",
          example_es: "Tenemos algo de prisa.",
        },
        {
          word_en: "come out fast",
          word_es: "salir rápido (de cocina)",
          example_en: "What can come out fast?",
          example_es: "¿Qué puede salir rápido?",
        },
        {
          word_en: "save you time",
          word_es: "ahorrarle tiempo",
          example_en: "I'll bring the check early to save you time.",
          example_es: "Le traigo la cuenta antes para ahorrarle tiempo.",
        },
      ],
    },
    {
      id: "r-016",
      level: "B1",
      listening: {
        audio_text:
          "We're having the grilled snapper. Which wine would you pair with that?",
        options: [
          { emoji: "🍷", text_es: "Recomendar un vino que combine y ofrecer por copa", correct: true },
          { emoji: "🍺", text_es: "Sugerir mejor una cerveza", correct: false },
          { emoji: "💰", text_es: "Recomendar la botella más cara", correct: false },
        ],
        explanation_es:
          "Pregunta de maridaje. Se recomienda con una razón breve y se ofrece la opción por copa — vender bien no es vender caro.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "With the snapper, I'd suggest our Sauvignon Blanc — crisp and citrusy, it works beautifully with grilled fish. We also serve it by the glass if you prefer.",
        note_es:
          "Una razón sensorial corta (“crisp and citrusy”) hace creíble la recomendación. “By the glass” baja la barrera de decir sí.",
      },
      vocabulary: [
        {
          word_en: "pair with",
          word_es: "maridar / combinar con",
          example_en: "Which wine pairs with fish?",
          example_es: "¿Qué vino marida con pescado?",
        },
        {
          word_en: "crisp",
          word_es: "fresco / seco (vino)",
          example_en: "A crisp white wine.",
          example_es: "Un vino blanco fresco.",
        },
        {
          word_en: "by the glass",
          word_es: "por copa",
          example_en: "We serve it by the glass.",
          example_es: "Lo servimos por copa.",
        },
      ],
    },
    {
      id: "r-017",
      level: "B2",
      listening: {
        audio_text:
          "There are two drinks on this bill we never ordered, and what's this service charge? I'd like you to walk me through it.",
        options: [
          {
            emoji: "🧾",
            text_es: "Revisar la cuenta línea por línea con calma y corregir lo que no corresponda",
            correct: true,
          },
          { emoji: "🤷", text_es: "Decirle que el sistema no se equivoca", correct: false },
          { emoji: "🏃", text_es: "Llamar al gerente y desaparecer", correct: false },
        ],
        explanation_es:
          "Cuenta disputada con tono firme. La respuesta B2 revisa junto al huésped, línea por línea, y corrige sin defensividad.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Of course — let's go through it together. You're right, these two drinks aren't yours; I'll remove them now. The service charge is optional, and I can take it off as well if you prefer.",
        note_es:
          "“Let's go through it together” convierte la confrontación en colaboración. Sobre cargos opcionales: transparencia total, cero presión.",
      },
      vocabulary: [
        {
          word_en: "walk me through it",
          word_es: "explíquemelo paso a paso",
          example_en: "Could you walk me through the bill?",
          example_es: "¿Me explica la cuenta paso a paso?",
        },
        {
          word_en: "service charge",
          word_es: "cargo por servicio",
          example_en: "The service charge is optional.",
          example_es: "El cargo por servicio es opcional.",
        },
        {
          word_en: "remove",
          word_es: "quitar / eliminar",
          example_en: "I'll remove these two drinks.",
          example_es: "Quito estas dos bebidas.",
        },
      ],
    },
    {
      id: "r-018",
      level: "B2",
      listening: {
        audio_text:
          "I need to tell you something serious. My wife got sick last night after dinner here, and we think it was the seafood platter.",
        options: [
          {
            emoji: "🩺",
            text_es: "Escuchar con seriedad, preguntar por su estado, avisar al gerente y registrar el caso",
            correct: true,
          },
          { emoji: "🙅", text_es: "Negarlo de inmediato: nuestra cocina es impecable", correct: false },
          { emoji: "🎁", text_es: "Ofrecer una cena gratis para cerrar el tema rápido", correct: false },
        ],
        explanation_es:
          "Posible intoxicación: tema de salud y legal. La respuesta correcta escucha, se preocupa por la persona, escala al gerente y documenta — sin admitir ni negar culpa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "I'm very sorry to hear that — how is she feeling now? Thank you for telling us. I'm going to bring our manager right away and take down the details, because we take this very seriously.",
        note_es:
          "Primero la persona (“how is she feeling?”), luego el proceso. Ni “es imposible” ni “fue nuestra culpa”: seriedad, escalación y registro.",
      },
      vocabulary: [
        {
          word_en: "got sick",
          word_es: "se enfermó",
          example_en: "She got sick last night.",
          example_es: "Se enfermó anoche.",
        },
        {
          word_en: "take down the details",
          word_es: "tomar los datos / registrar",
          example_en: "Let me take down the details.",
          example_es: "Permítame tomar los datos.",
        },
        {
          word_en: "take this seriously",
          word_es: "tomarlo en serio",
          example_en: "We take this very seriously.",
          example_es: "Lo tomamos muy en serio.",
        },
      ],
    },
    {
      id: "r-019",
      level: "B2",
      listening: {
        audio_text:
          "We don't eat pork, and our meals need to be prepared separately from it — it's a religious requirement. Can your kitchen accommodate that?",
        options: [
          {
            emoji: "🤝",
            text_es: "Tomarlo con respeto, verificar con el chef y confirmar qué platillos cumplen",
            correct: true,
          },
          { emoji: "🤞", text_es: "Decir que sí a todo sin consultar a cocina", correct: false },
          { emoji: "😅", text_es: "Decirle que casi no usamos cerdo, no se preocupe", correct: false },
        ],
        explanation_es:
          "Restricción religiosa con requisito de preparación separada. Nunca se improvisa: se consulta al chef y se confirma con precisión qué se puede garantizar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Absolutely — thank you for explaining the requirement. Let me speak with the chef to confirm exactly which dishes we can prepare fully separate, and I'll come back to you in two minutes with the options.",
        note_es:
          "En requisitos religiosos o de salud, la palabra clave es “confirm”: solo se promete lo verificado con cocina. Respeto + precisión.",
      },
      vocabulary: [
        {
          word_en: "pork",
          word_es: "cerdo",
          example_en: "We don't eat pork.",
          example_es: "No comemos cerdo.",
        },
        {
          word_en: "accommodate",
          word_es: "adaptarse a / atender",
          example_en: "We can accommodate that.",
          example_es: "Podemos atender esa necesidad.",
        },
        {
          word_en: "fully separate",
          word_es: "completamente por separado",
          example_en: "Prepared fully separate from pork.",
          example_es: "Preparado completamente por separado del cerdo.",
        },
      ],
    },
    {
      id: "r-020",
      level: "B2",
      listening: {
        audio_text:
          "I'm hosting an important business dinner tonight for six. I'd like the wine pre-selected, the courses timed — nothing rushed — and the bill settled discreetly with my card, never at the table.",
        options: [
          {
            emoji: "🤵",
            text_es: "Confirmar cada detalle del servicio y acordar el pago discreto por adelantado",
            correct: true,
          },
          { emoji: "🧾", text_es: "Decirle que la cuenta siempre se lleva a la mesa", correct: false },
          { emoji: "🍷", text_es: "Sugerirle que cada quien pida lo suyo", correct: false },
        ],
        explanation_es:
          "Cena de negocios con protocolo: vino, ritmo y pago invisible. La respuesta B2 confirma cada punto y acuerda la logística del pago antes de que lleguen los invitados.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en:
          "Understood perfectly. We'll have the wine ready to pour at arrival, I'll pace each course with your signal, and we'll keep your card on file — you'll just sign on your way out, away from the table.",
        note_es:
          "“With your signal” le da el control del ritmo al anfitrión. El pago “away from the table” es el detalle que un anfitrión de negocios más valora.",
      },
      vocabulary: [
        {
          word_en: "host",
          word_es: "ser anfitrión / recibir invitados",
          example_en: "I'm hosting a dinner tonight.",
          example_es: "Soy anfitrión de una cena hoy.",
        },
        {
          word_en: "pace the courses",
          word_es: "llevar el ritmo de los tiempos",
          example_en: "We'll pace the courses with your signal.",
          example_es: "Llevamos el ritmo de los tiempos con su señal.",
        },
        {
          word_en: "on file",
          word_es: "registrado / en archivo",
          example_en: "We'll keep your card on file.",
          example_es: "Dejamos su tarjeta registrada.",
        },
      ],
    },
  ],
  housekeeping: [
    {
      id: "h-001",
      level: "A1",
      listening: {
        audio_text: "Hi. Could we get two more towels, please?",
        options: [
          { emoji: "🧺", text_es: "Llevar dos toallas limpias a la habitación", correct: true },
          { emoji: "🛏️", text_es: "Cambiar las sábanas de la cama", correct: false },
          { emoji: "🧼", text_es: "Reponer el jabón del baño", correct: false },
        ],
        explanation_es:
          "El huésped pide dos toallas más. Lo único que necesita es que le lleves toallas limpias al cuarto; no hay que cambiar nada más.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll bring you two clean towels right away.",
        note_es:
          "“Right away” promete rapidez sin comprometerte a una hora exacta. “Of course” suena servicial y seguro, nunca sumiso.",
      },
      vocabulary: [
        {
          word_en: "towel",
          word_es: "toalla",
          example_en: "How many towels do you need?",
          example_es: "¿Cuántas toallas necesita?",
        },
        {
          word_en: "clean",
          word_es: "limpio, limpia",
          example_en: "Here are your clean towels.",
          example_es: "Aquí están sus toallas limpias.",
        },
        {
          word_en: "right away",
          word_es: "enseguida",
          example_en: "I'll bring them right away.",
          example_es: "Se las traigo enseguida.",
        },
      ],
    },
    {
      id: "h-002",
      level: "A1",
      listening: {
        audio_text: "Oh — not right now, please. Can you come back later?",
        options: [
          { emoji: "🚪", text_es: "Retirarte y regresar más tarde", correct: true },
          { emoji: "🧹", text_es: "Entrar y limpiar rápido de todos modos", correct: false },
          { emoji: "🗑️", text_es: "Entrar solo por la basura", correct: false },
        ],
        explanation_es:
          "El huésped no quiere servicio en este momento. Lo correcto es retirarte, anotar el número de cuarto y volver más tarde.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "No problem. I'll come back later. Have a good day.",
        note_es:
          "“No problem” quita presión y evita que el huésped sienta que lo estás juzgando. Cerrar con “Have a good day” deja buena impresión aunque no hayas entrado.",
      },
      vocabulary: [
        {
          word_en: "come back later",
          word_es: "regresar más tarde",
          example_en: "I'll come back later, sir.",
          example_es: "Regreso más tarde, señor.",
        },
        {
          word_en: "no problem",
          word_es: "no hay problema",
          example_en: "No problem at all.",
          example_es: "No hay ningún problema.",
        },
        {
          word_en: "have a good day",
          word_es: "que tenga buen día",
          example_en: "Have a good day, ma'am.",
          example_es: "Que tenga buen día, señora.",
        },
      ],
    },
    {
      id: "h-003",
      level: "A1",
      listening: {
        audio_text: "Yes? Who is it?",
        options: [
          { emoji: "🗣️", text_es: "Decir quién eres y pedir permiso para entrar", correct: true },
          { emoji: "🔑", text_es: "Abrir con la llave maestra y entrar", correct: false },
          { emoji: "🚪", text_es: "Contestar “cleaning” y abrir la puerta enseguida", correct: false },
        ],
        explanation_es:
          "El huésped no sabe quién tocó la puerta. Hay que identificarse primero y esperar su permiso antes de entrar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Good morning, housekeeping. May I come in?",
        note_es:
          "Decir “housekeeping” de inmediato tranquiliza al huésped. “May I come in?” pide permiso; “Can I clean?” suena a que ya vas entrando.",
      },
      vocabulary: [
        {
          word_en: "housekeeping",
          word_es: "servicio de limpieza",
          example_en: "Good morning, housekeeping!",
          example_es: "Buenos días, servicio de limpieza.",
        },
        {
          word_en: "come in",
          word_es: "entrar, pasar",
          example_en: "Is it okay if I come in now?",
          example_es: "¿Está bien si paso ahora?",
        },
        {
          word_en: "may I",
          word_es: "¿puedo?",
          example_en: "May I come in, sir?",
          example_es: "¿Puedo pasar, señor?",
        },
      ],
    },
    {
      id: "h-004",
      level: "A1",
      listening: {
        audio_text: "Excuse me. There's no soap in the bathroom.",
        options: [
          { emoji: "🧼", text_es: "Llevar jabón al baño de la habitación", correct: true },
          { emoji: "🚿", text_es: "Revisar la regadera", correct: false },
          { emoji: "🧻", text_es: "Llevar papel de baño", correct: false },
        ],
        explanation_es:
          "El huésped solo reporta que falta el jabón. La acción es reponerlo en el baño de esa habitación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry about that. I'll bring you soap right now.",
        note_es:
          "“I'm sorry about that” reconoce la falla sin culpar a nadie ni al turno anterior. Después de disculparte, di qué vas a hacer: eso es lo que tranquiliza al huésped.",
      },
      vocabulary: [
        {
          word_en: "soap",
          word_es: "jabón",
          example_en: "I'm leaving new soap for you.",
          example_es: "Le dejo jabón nuevo.",
        },
        {
          word_en: "bathroom",
          word_es: "baño",
          example_en: "I'll check the bathroom.",
          example_es: "Voy a revisar el baño.",
        },
        {
          word_en: "bring",
          word_es: "traer",
          example_en: "I'll bring it in two minutes.",
          example_es: "Se lo traigo en dos minutos.",
        },
      ],
    },
    {
      id: "h-005",
      level: "A1",
      listening: {
        audio_text: "Hey, the light in the bathroom doesn't work.",
        options: [
          { emoji: "🛠️", text_es: "Reportar la falla a mantenimiento", correct: true },
          { emoji: "🧹", text_es: "Limpiar el foco", correct: false },
          { emoji: "🪟", text_es: "Abrir las cortinas para que entre luz", correct: false },
        ],
        explanation_es:
          "Es una falla eléctrica, no de limpieza. Lo correcto es avisar a mantenimiento y confirmarle al huésped que ya quedó reportado.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry. I'll tell maintenance right now.",
        note_es:
          "“I'll tell maintenance” muestra que sabes a quién le toca resolverlo. No prometas repararlo tú ni dar una hora exacta.",
      },
      vocabulary: [
        {
          word_en: "light",
          word_es: "luz, foco",
          example_en: "I'll ask them to change the light.",
          example_es: "Voy a pedir que cambien el foco.",
        },
        {
          word_en: "doesn't work",
          word_es: "no funciona",
          example_en: "The TV doesn't work.",
          example_es: "La tele no funciona.",
        },
        {
          word_en: "maintenance",
          word_es: "mantenimiento",
          example_en: "Maintenance is coming this afternoon.",
          example_es: "Mantenimiento viene esta tarde.",
        },
      ],
    },
    {
      id: "h-006",
      level: "A2",
      listening: {
        audio_text: "Excuse me — do you know if there's an ice machine on this floor?",
        options: [
          { emoji: "🧊", text_es: "Decirle dónde está la máquina de hielo", correct: true },
          { emoji: "🍾", text_es: "Ofrecerle una bebida del minibar de la habitación", correct: false },
          { emoji: "🛎️", text_es: "Mandarlo a recepción porque no es tu área", correct: false },
        ],
        explanation_es:
          "El huésped solo quiere saber dónde conseguir hielo. Tú sabes dónde está la máquina, así que dale la ubicación en lugar de mandarlo a otra área.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, it's down the hall, next to the elevator. I can bring you some ice if you like.",
        note_es:
          "Dar la ubicación exacta —el pasillo, el elevador— vale mucho más que un “yes, we have ice”. Ofrecer llevárselo tú convierte una indicación en servicio.",
      },
      vocabulary: [
        {
          word_en: "ice",
          word_es: "hielo",
          example_en: "I can bring you some ice.",
          example_es: "Le puedo llevar hielo.",
        },
        {
          word_en: "down the hall",
          word_es: "por el pasillo",
          example_en: "It's down the hall, on the left.",
          example_es: "Está por el pasillo, a la izquierda.",
        },
        {
          word_en: "elevator",
          word_es: "elevador",
          example_en: "The ice machine is next to the elevator.",
          example_es: "La máquina de hielo está junto al elevador.",
        },
      ],
    },
    {
      id: "h-007",
      level: "A2",
      listening: {
        audio_text: "Oh, hi. Sorry, we didn't call for anything. What do you need?",
        options: [
          { emoji: "🌙", text_es: "Explicar qué es el servicio de cobertura", correct: true },
          { emoji: "🧹", text_es: "Decirle que vienes a limpiar el cuarto otra vez", correct: false },
          { emoji: "🚪", text_es: "Pedir disculpas y retirarte sin explicar nada", correct: false },
        ],
        explanation_es:
          "El huésped no sabe qué es el servicio de cobertura. Se explica en una frase corta y se le deja decidir si lo quiere esta noche.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Good evening. It's turndown service — I get the bed ready for the night. Would you like that?",
        note_es:
          "Explicar el servicio en una sola frase evita que el huésped piense que vas a limpiar otra vez. La pregunta final le deja a él la decisión.",
      },
      vocabulary: [
        {
          word_en: "turndown service",
          word_es: "servicio de cobertura",
          example_en: "Would you like turndown service tonight?",
          example_es: "¿Quiere el servicio de cobertura esta noche?",
        },
        {
          word_en: "evening",
          word_es: "tarde-noche",
          example_en: "Good evening, sir.",
          example_es: "Buenas noches, señor.",
        },
        {
          word_en: "bed",
          word_es: "cama",
          example_en: "I'll get the bed ready for you.",
          example_es: "Le preparo la cama.",
        },
      ],
    },
    {
      id: "h-008",
      level: "A2",
      listening: {
        audio_text: "Hi — I've got a few things that need washing. How does the laundry work here?",
        options: [
          { emoji: "👕", text_es: "Explicar dónde está la bolsa de lavandería", correct: true },
          { emoji: "🧺", text_es: "Llevarte tú la ropa y lavarla por tu cuenta", correct: false },
          { emoji: "🏨", text_es: "Decirle que aquí no hay servicio de lavandería", correct: false },
        ],
        explanation_es:
          "El huésped pregunta por el proceso, no te está pidiendo un favor personal. Se le explica dónde está la bolsa y quién pasa por ella.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "There's a laundry bag in the closet. Just leave your clothes inside and I'll take it down for you.",
        note_es:
          "Dar el paso concreto —la bolsa en el clóset— sirve mucho más que un “yes, we have laundry”. Si no sabes precios ni horarios, no los inventes: eso lo maneja recepción.",
      },
      vocabulary: [
        {
          word_en: "laundry bag",
          word_es: "bolsa de lavandería",
          example_en: "The laundry bag is in the closet.",
          example_es: "La bolsa de lavandería está en el clóset.",
        },
        {
          word_en: "closet",
          word_es: "clóset",
          example_en: "I'll leave it in the closet for you.",
          example_es: "Se la dejo en el clóset.",
        },
        {
          word_en: "wash",
          word_es: "lavar",
          example_en: "We can wash these for you.",
          example_es: "Se los podemos lavar.",
        },
      ],
    },
    {
      id: "h-009",
      level: "A2",
      listening: {
        audio_text: "We're changing rooms today. Where should we leave our bags in the meantime?",
        options: [
          { emoji: "🧳", text_es: "Explicar que recepción guarda el equipaje", correct: true },
          { emoji: "🚪", text_es: "Decirles que dejen las maletas afuera en el pasillo", correct: false },
          { emoji: "🛏️", text_es: "Meter tú las maletas al cuarto nuevo sin avisar", correct: false },
        ],
        explanation_es:
          "El equipaje no se queda en un pasillo ni se mueve sin autorización. Recepción lo guarda mientras se libera la habitación nueva.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The front desk can store your bags until the new room is ready. I can call them for you.",
        note_es:
          "Ofrecer llamar tú resuelve el problema sin prometer algo que no te toca. “Store your bags” es la frase de hotel para guardar equipaje.",
      },
      vocabulary: [
        {
          word_en: "luggage",
          word_es: "equipaje",
          example_en: "Your luggage is safe at the front desk.",
          example_es: "Su equipaje está seguro en recepción.",
        },
        {
          word_en: "front desk",
          word_es: "recepción",
          example_en: "The front desk is downstairs.",
          example_es: "La recepción está abajo.",
        },
        {
          word_en: "store",
          word_es: "guardar",
          example_en: "We can store your bags for a few hours.",
          example_es: "Podemos guardar sus maletas unas horas.",
        },
      ],
    },
    {
      id: "h-010",
      level: "A2",
      listening: {
        audio_text: "I think I left my charger in the room yesterday. Did anyone find it?",
        options: [
          { emoji: "📝", text_es: "Tomar sus datos y revisar en objetos perdidos", correct: true },
          { emoji: "🤷", text_es: "Decirle que seguramente ya se perdió para siempre", correct: false },
          { emoji: "🔌", text_es: "Sacar un cargador de otro cuarto y prestárselo", correct: false },
        ],
        explanation_es:
          "Todo lo que se encuentra en un cuarto se entrega en objetos perdidos. Se toman los datos del huésped y se revisa; nunca se toma algo de otra habitación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let me check with lost and found. Can I get your name and room number?",
        note_es:
          "“Let me check” promete acción sin prometer un resultado que no controlas. Pedir nombre y número de cuarto hace posible el seguimiento.",
      },
      vocabulary: [
        {
          word_en: "charger",
          word_es: "cargador",
          example_en: "Is this your charger?",
          example_es: "¿Este es su cargador?",
        },
        {
          word_en: "lost and found",
          word_es: "objetos perdidos",
          example_en: "I'll take it to lost and found.",
          example_es: "Lo llevo a objetos perdidos.",
        },
        {
          word_en: "room number",
          word_es: "número de habitación",
          example_en: "Can I get your name and room number?",
          example_es: "¿Me da su nombre y número de habitación?",
        },
      ],
    },
    {
      id: "h-011",
      level: "B1",
      listening: {
        audio_text: "Sorry to bother you — any chance you could do our room next? We're heading out in twenty minutes.",
        options: [
          { emoji: "🕐", text_es: "Explicar tu orden y ofrecer llegar en veinte minutos", correct: true },
          { emoji: "⏭️", text_es: "Dejar a medias el cuarto que estás limpiando y pasar al suyo", correct: false },
          { emoji: "🙅", text_es: "Decirle que el orden de los cuartos no se puede cambiar", correct: false },
        ],
        explanation_es:
          "Sí se le puede ayudar, pero sin abandonar el cuarto que ya empezaste. Se explica el orden y se ofrece una hora concreta.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm finishing this room first, but I can be there in about twenty minutes. Would that work?",
        note_es:
          "Dar un tiempo concreto convierte un “no” en un “sí, en un momento”. “Would that work?” deja que el huésped confirme y se sienta atendido.",
      },
      vocabulary: [
        {
          word_en: "next",
          word_es: "el siguiente",
          example_en: "Your room is next.",
          example_es: "Su habitación es la siguiente.",
        },
        {
          word_en: "finish",
          word_es: "terminar",
          example_en: "Let me finish this room first.",
          example_es: "Déjeme terminar este cuarto primero.",
        },
        {
          word_en: "would that work?",
          word_es: "¿le parece bien?",
          example_en: "I can come at four. Would that work?",
          example_es: "Puedo venir a las cuatro. ¿Le parece bien?",
        },
      ],
    },
    {
      id: "h-012",
      level: "B1",
      listening: {
        audio_text: "Look at this — there's a stain on the sheets. Was this room even cleaned?",
        options: [
          { emoji: "🛏️", text_es: "Disculparte y cambiar la ropa de cama de inmediato", correct: true },
          { emoji: "🗣️", text_es: "Explicar que el turno anterior sí limpió el cuarto", correct: false },
          { emoji: "🧽", text_es: "Tallar la mancha con un trapo húmedo", correct: false },
        ],
        explanation_es:
          "El huésped no busca explicaciones, busca una cama limpia. La respuesta es disculparse y cambiar toda la ropa de cama en ese momento.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm so sorry about that. Let me change the sheets right now — it'll only take a few minutes.",
        note_es:
          "No defiendas al turno anterior: el huésped solo escucha excusas. “Let me change the sheets right now” convierte la queja en solución.",
      },
      vocabulary: [
        {
          word_en: "stain",
          word_es: "mancha",
          example_en: "I see the stain. I'll take care of it.",
          example_es: "Ya vi la mancha. Yo me encargo.",
        },
        {
          word_en: "sheets",
          word_es: "sábanas",
          example_en: "I'm changing the sheets now.",
          example_es: "Estoy cambiando las sábanas.",
        },
        {
          word_en: "change",
          word_es: "cambiar",
          example_en: "I'll change everything on the bed.",
          example_es: "Cambio toda la cama.",
        },
      ],
    },
    {
      id: "h-013",
      level: "B1",
      listening: {
        audio_text: "I'm pretty sensitive to strong chemicals. The smell in the bathroom yesterday gave me a headache.",
        options: [
          { emoji: "🌬️", text_es: "Limpiar con producto suave y ventilar el cuarto", correct: true },
          { emoji: "🚪", text_es: "Usar el mismo producto pero dejar cerrada la puerta del baño", correct: false },
          { emoji: "🤷", text_es: "Decirle que todos los cuartos se limpian con lo mismo", correct: false },
        ],
        explanation_es:
          "El huésped está reportando una reacción física, no una preferencia. Se limpia con lo más suave posible, se ventila y se le avisa a la supervisora para que quede registrado en ese cuarto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Thank you for telling me. I'll use something mild and air out the room before you come back.",
        note_es:
          "“Thank you for telling me” recibe la queja sin ponerte a la defensiva. Avisa también a tu supervisora: eso protege al huésped y te protege a ti.",
      },
      vocabulary: [
        {
          word_en: "smell",
          word_es: "olor",
          example_en: "The smell will be gone in an hour.",
          example_es: "El olor se quita en una hora.",
        },
        {
          word_en: "mild",
          word_es: "suave",
          example_en: "I'll use something mild in your room.",
          example_es: "Voy a usar algo suave en su habitación.",
        },
        {
          word_en: "air out",
          word_es: "ventilar",
          example_en: "I'll air out the room before you come back.",
          example_es: "Ventilo el cuarto antes de que regrese.",
        },
      ],
    },
    {
      id: "h-014",
      level: "B1",
      listening: {
        audio_text: "Sorry, the vacuum is really loud and my baby just fell asleep. Is there any way you could stop?",
        options: [
          { emoji: "🔇", text_es: "Parar la aspiradora y seguir con otros cuartos", correct: true },
          { emoji: "🚪", text_es: "Cerrar la puerta del cuarto y seguir aspirando igual", correct: false },
          { emoji: "⚡", text_es: "Aspirar más rápido para terminar cuanto antes", correct: false },
        ],
        explanation_es:
          "El problema es el ruido, no la limpieza. Se detiene la aspiradora, se avanza en otros cuartos y se regresa cuando el bebé despierte.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course — I'll stop right now. I'll do the other rooms first and come back this afternoon.",
        note_es:
          "Actuar antes de explicar es lo que calma al huésped. Ofrecer un momento aproximado evita que piense que su cuarto se va a quedar sin limpiar.",
      },
      vocabulary: [
        {
          word_en: "vacuum",
          word_es: "aspiradora",
          example_en: "I'll leave the vacuum for later.",
          example_es: "Dejo la aspiradora para más tarde.",
        },
        {
          word_en: "loud",
          word_es: "ruidoso, fuerte",
          example_en: "I know it's loud. I'm sorry.",
          example_es: "Sé que hace mucho ruido. Lo siento.",
        },
        {
          word_en: "wake up",
          word_es: "despertar",
          example_en: "I don't want to wake up the baby.",
          example_es: "No quiero despertar al bebé.",
        },
      ],
    },
    {
      id: "h-015",
      level: "B1",
      listening: {
        audio_text: "Sorry, what time is it? I thought checkout wasn't until one.",
        options: [
          { emoji: "🕛", text_es: "Decirle la hora de salida y ofrecer llamar a recepción", correct: true },
          { emoji: "🧹", text_es: "Empezar a limpiar mientras el huésped se levanta", correct: false },
          { emoji: "🚪", text_es: "Decirle que tiene que desocupar el cuarto de inmediato", correct: false },
        ],
        explanation_es:
          "El huésped está confundido con la hora de salida. Se le informa con calma y se ofrece preguntar en recepción por una salida tardía: esa decisión no le toca a limpieza.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry to wake you. Checkout is at twelve, but let me call the front desk about a late checkout.",
        note_es:
          "Nunca autorices tú una salida tardía; eso lo aprueba recepción. “I'm sorry to wake you” suaviza un momento incómodo sin sonar a regaño.",
      },
      vocabulary: [
        {
          word_en: "checkout time",
          word_es: "hora de salida",
          example_en: "Checkout time is at twelve.",
          example_es: "La hora de salida es a las doce.",
        },
        {
          word_en: "late checkout",
          word_es: "salida tardía",
          example_en: "They can approve a late checkout downstairs.",
          example_es: "Abajo pueden autorizar una salida tardía.",
        },
        {
          word_en: "sorry to wake you",
          word_es: "perdón por despertarlo",
          example_en: "I'm sorry to wake you, ma'am.",
          example_es: "Perdón por despertarla, señora.",
        },
      ],
    },
    {
      id: "h-016",
      level: "B2",
      listening: {
        audio_text: "I left about five hundred dollars on the desk this morning and now it's gone. You were in here, right?",
        options: [
          { emoji: "📞", text_es: "Mantener la calma y llamar a tu supervisora", correct: true },
          { emoji: "💸", text_es: "Ofrecer pagarle de tu bolsa para que no pase a mayores", correct: false },
          { emoji: "😠", text_es: "Molestarte y negarte a seguir hablando del tema", correct: false },
        ],
        explanation_es:
          "Una acusación así se maneja con calma y con testigos. Se responde sin discutir, no se toca nada del cuarto y se pide de inmediato que la supervisora o seguridad atiendan el caso.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I understand, sir. I didn't move anything from the desk. Let me call my supervisor right now.",
        note_es:
          "“I understand” reconoce el problema sin admitir culpa. Pedir a tu supervisora te protege: nunca manejes solo una acusación de robo.",
      },
      vocabulary: [
        {
          word_en: "supervisor",
          word_es: "supervisora, jefa",
          example_en: "Let me call my supervisor.",
          example_es: "Déjeme llamar a mi supervisora.",
        },
        {
          word_en: "desk",
          word_es: "escritorio",
          example_en: "I didn't touch anything on the desk.",
          example_es: "No toqué nada del escritorio.",
        },
        {
          word_en: "move",
          word_es: "mover",
          example_en: "I didn't move your things.",
          example_es: "No moví sus cosas.",
        },
      ],
    },
    {
      id: "h-017",
      level: "B2",
      listening: {
        audio_text: "So we're out on Thursday, but we need the room done early on Wednesday — and could you leave the bathroom until after ten?",
        options: [
          { emoji: "🔁", text_es: "Repetir lo que entendiste y pedirle que confirme", correct: true },
          { emoji: "👍", text_es: "Decir que sí a todo y anotar solo lo que alcanzaste a oír", correct: false },
          { emoji: "🚶", text_es: "Pedirle que espere y buscar a alguien que hable español", correct: false },
        ],
        explanation_es:
          "El huésped dijo tres cosas seguidas y es normal perder una. Repetir lo que entendiste deja que él te corrija en el momento, antes de que el error llegue al cuarto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Sorry, I want to get this right — the bathroom after ten, and the room early on Wednesday?",
        note_es:
          "“I want to get this right” explica por qué preguntas y suena profesional, no inseguro. Decir que sí sin entender sale mucho más caro que pedir que te repitan.",
      },
      vocabulary: [
        {
          word_en: "one more time",
          word_es: "una vez más",
          example_en: "Could you say that one more time, please?",
          example_es: "¿Me lo puede repetir una vez más, por favor?",
        },
        {
          word_en: "early",
          word_es: "temprano",
          example_en: "I can do your room early on Wednesday.",
          example_es: "Puedo hacer su habitación temprano el miércoles.",
        },
        {
          word_en: "Wednesday",
          word_es: "miércoles",
          example_en: "I'll come on Wednesday morning.",
          example_es: "Vengo el miércoles en la mañana.",
        },
      ],
    },
    {
      id: "h-018",
      level: "B2",
      listening: {
        audio_text: "Hey, quick favor — could you leave my door open? A friend of mine is coming up later.",
        options: [
          { emoji: "🔑", text_es: "Explicar con amabilidad que el acceso lo autoriza recepción", correct: true },
          { emoji: "🚪", text_es: "Dejar la puerta abierta porque el huésped lo pidió", correct: false },
          { emoji: "🤐", text_es: "Decirle que sí y cerrar la puerta de todos modos", correct: false },
        ],
        explanation_es:
          "Dejar un cuarto abierto pone en riesgo las cosas del huésped y también tu trabajo. El acceso solo lo autoriza recepción, con identificación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry, I'm not allowed to leave rooms open. The front desk can help your friend when they arrive.",
        note_es:
          "“I'm not allowed to” deja claro que es una regla, no un capricho tuyo, y evita que el huésped insista. Cierra siempre con una alternativa.",
      },
      vocabulary: [
        {
          word_en: "key",
          word_es: "llave",
          example_en: "I have a master key for cleaning only.",
          example_es: "Tengo una llave maestra solo para limpieza.",
        },
        {
          word_en: "let in",
          word_es: "dejar entrar",
          example_en: "I can't let anyone into your room.",
          example_es: "No puedo dejar entrar a nadie a su habitación.",
        },
        {
          word_en: "I'm not allowed",
          word_es: "no tengo permitido",
          example_en: "I'm sorry, I'm not allowed to do that.",
          example_es: "Lo siento, no tengo permitido hacer eso.",
        },
      ],
    },
    {
      id: "h-019",
      level: "B2",
      listening: {
        audio_text: "We've had the do not disturb sign up for three days. We're fine, honestly — we don't need anything.",
        options: [
          { emoji: "🧺", text_es: "Dejar toallas en la puerta y acordar una hora", correct: true },
          { emoji: "📋", text_es: "Anotar que no quieren servicio y no volver en toda la estancia", correct: false },
          { emoji: "🚪", text_es: "Esperar a que salgan del cuarto y entrar sin avisarles", correct: false },
        ],
        explanation_es:
          "Se respeta el letrero, pero después de varios días el cuarto tiene que revisarse por seguridad. Se negocia una hora conveniente y mientras tanto se le entrega en la puerta lo que necesite.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll leave fresh towels at your door. We just need to check the room once today — would four o'clock be okay?",
        note_es:
          "Primero das algo y después pides algo: así el huésped no siente que lo estás presionando. Decir “we need to” lo vuelve una regla de la casa y no un capricho tuyo.",
      },
      vocabulary: [
        {
          word_en: "do not disturb sign",
          word_es: "letrero de no molestar",
          example_en: "I saw the do not disturb sign, so I didn't knock.",
          example_es: "Vi el letrero de no molestar, por eso no toqué.",
        },
        {
          word_en: "check the room",
          word_es: "revisar la habitación",
          example_en: "We need to check the room once a day.",
          example_es: "Tenemos que revisar la habitación una vez al día.",
        },
        {
          word_en: "stop by",
          word_es: "pasar un momento",
          example_en: "Can I stop by at four?",
          example_es: "¿Puedo pasar a las cuatro?",
        },
      ],
    },
    {
      id: "h-020",
      level: "B2",
      listening: {
        audio_text: "This is the third day we've asked for the coffee to be refilled and it's still empty. Honestly, I'd like to speak to a manager.",
        options: [
          { emoji: "🙋", text_es: "Reponer el café ahora y avisar al gerente", correct: true },
          { emoji: "☕", text_es: "Reponer el café y convencerlo de que ya no hable con nadie", correct: false },
          { emoji: "🗣️", text_es: "Explicar que a ti no te tocaba ese cuarto esta semana", correct: false },
        ],
        explanation_es:
          "El huésped ya perdió la paciencia por una falla repetida. Se arregla al instante y se le consigue al gerente que pidió: negarle esa conversación empeora la queja.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "You're right, and I'm sorry — I'll refill it right now. I'll also ask the manager to come and speak with you.",
        note_es:
          "“You're right, and I'm sorry” desarma el enojo en dos segundos porque le das la razón antes de defenderte. Nunca bloquees la petición de hablar con un gerente; ofrécela tú.",
      },
      vocabulary: [
        {
          word_en: "refill",
          word_es: "reponer, rellenar",
          example_en: "I'll refill the coffee right now.",
          example_es: "Repongo el café ahora mismo.",
        },
        {
          word_en: "manager",
          word_es: "gerente",
          example_en: "I'll ask the manager to come up.",
          example_es: "Le pido al gerente que suba.",
        },
        {
          word_en: "you're right",
          word_es: "tiene razón",
          example_en: "You're right, and I'm sorry.",
          example_es: "Tiene razón, y lo siento.",
        },
      ],
    },
  ],

  concierge: [
    {
      id: "c-001",
      level: "A1",
      listening: {
        audio_text: "Excuse me. Where is the nearest pharmacy?",
        options: [
          { emoji: "💊", text_es: "Indicarle cómo llegar a la farmacia más cercana", correct: true },
          { emoji: "🩹", text_es: "Traerle el botiquín de primeros auxilios del hotel", correct: false },
          { emoji: "🩺", text_es: "Llamar al médico del hotel", correct: false },
        ],
        explanation_es:
          "El huésped solo quiere saber dónde queda la farmacia más cercana. La acción correcta es darle la dirección, no asumir que se trata de un problema médico.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "There's a pharmacy two blocks from here, on the left.",
        note_es:
          "Empezar con 'There's' suena mucho más natural que 'The pharmacy is located...'. Agregar el lado de la calle evita que el huésped se pase de largo.",
      },
      vocabulary: [
        {
          word_en: "pharmacy",
          word_es: "farmacia",
          example_en: "There's a pharmacy two blocks from here.",
          example_es: "Hay una farmacia a dos cuadras de aquí.",
        },
        {
          word_en: "block",
          word_es: "cuadra",
          example_en: "It's three blocks from the hotel.",
          example_es: "Está a tres cuadras del hotel.",
        },
        {
          word_en: "on the left",
          word_es: "a la izquierda",
          example_en: "It's on the left, next to the bank.",
          example_es: "Está a la izquierda, junto al banco.",
        },
      ],
    },
    {
      id: "c-002",
      level: "A1",
      listening: {
        audio_text: "Hi — could you get me a taxi, please? I'm going downtown.",
        options: [
          { emoji: "🚕", text_es: "Pedir un taxi y decirle cuánto va a tardar", correct: true },
          { emoji: "🚐", text_es: "Reservar el transporte al aeropuerto", correct: false },
          { emoji: "🗺️", text_es: "Darle indicaciones para caminar al centro", correct: false },
        ],
        explanation_es:
          "El huésped pide un taxi para ir al centro, no indicaciones ni transporte al aeropuerto. La acción correcta es pedir el taxi y avisarle el tiempo de espera.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll call a taxi right away. The driver will be here in about five minutes.",
        note_es:
          "'I'll call a taxi right away' se oye servicial y deja claro que tú te encargas del asunto. Decir cuánto va a tardar evita que el huésped regrese a preguntar.",
      },
      vocabulary: [
        {
          word_en: "downtown",
          word_es: "el centro",
          example_en: "Downtown is about ten minutes by taxi.",
          example_es: "El centro está a unos diez minutos en taxi.",
        },
        {
          word_en: "right away",
          word_es: "enseguida",
          example_en: "I'll call a taxi right away.",
          example_es: "Pido un taxi enseguida.",
        },
        {
          word_en: "driver",
          word_es: "chofer",
          example_en: "The driver is waiting outside.",
          example_es: "El chofer está esperando afuera.",
        },
      ],
    },
    {
      id: "c-003",
      level: "A1",
      listening: {
        audio_text: "Is it hot outside today? I'm not sure what to wear.",
        options: [
          { emoji: "☀️", text_es: "Decirle cómo está el clima y sugerirle qué llevar", correct: true },
          { emoji: "🌂", text_es: "Ofrecerle un paraguas del hotel", correct: false },
          { emoji: "🧺", text_es: "Mandar su ropa a la lavandería", correct: false },
        ],
        explanation_es:
          "El huésped pregunta por el clima para decidir cómo vestirse. La acción correcta es decirle cómo está el día y sugerirle qué le conviene llevar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, it's very hot today. Sunscreen and a hat are a good idea.",
        note_es:
          "En inglés el calor se dice con 'it's hot', nunca con 'I have hot': es uno de los errores más comunes al pasar del español. La sugerencia corta al final convierte la respuesta en un servicio.",
      },
      vocabulary: [
        {
          word_en: "it's hot",
          word_es: "hace calor",
          example_en: "It's very hot today.",
          example_es: "Hoy hace mucho calor.",
        },
        {
          word_en: "sunscreen",
          word_es: "bloqueador solar",
          example_en: "Sunscreen is a good idea today.",
          example_es: "Hoy conviene el bloqueador solar.",
        },
        {
          word_en: "hat",
          word_es: "sombrero, gorra",
          example_en: "A hat helps a lot at midday.",
          example_es: "Un sombrero ayuda mucho al mediodía.",
        },
      ],
    },
    {
      id: "c-004",
      level: "A1",
      listening: {
        audio_text: "What time does the museum open tomorrow?",
        options: [
          { emoji: "🕘", text_es: "Decirle la hora en que abre el museo", correct: true },
          { emoji: "🎫", text_es: "Comprarle los boletos de una vez", correct: false },
          { emoji: "🚌", text_es: "Reservarle un tour guiado al museo", correct: false },
        ],
        explanation_es:
          "La pregunta es solo sobre el horario. La acción correcta es dar la hora de apertura; los boletos o el tour solo si el huésped los pide después.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "It opens at nine in the morning, and it's closed on Mondays.",
        note_es:
          "Decir 'nine in the morning' evita la confusión con 'nine at night'. Avisar del día de cierre le ahorra al huésped un viaje perdido.",
      },
      vocabulary: [
        {
          word_en: "opens at",
          word_es: "abre a las",
          example_en: "The museum opens at nine.",
          example_es: "El museo abre a las nueve.",
        },
        {
          word_en: "closed",
          word_es: "cerrado",
          example_en: "It's closed on Mondays.",
          example_es: "Está cerrado los lunes.",
        },
        {
          word_en: "ticket",
          word_es: "boleto",
          example_en: "Tickets are on sale at the entrance.",
          example_es: "Los boletos se venden en la entrada.",
        },
      ],
    },
    {
      id: "c-005",
      level: "A1",
      listening: {
        audio_text: "How much is the boat tour for two people?",
        options: [
          { emoji: "💵", text_es: "Decirle el precio por persona, el total y qué incluye", correct: true },
          { emoji: "🛥️", text_es: "Reservar el tour de inmediato para dos", correct: false },
          { emoji: "🏦", text_es: "Indicarle dónde cambiar dólares", correct: false },
        ],
        explanation_es:
          "El huésped quiere saber el costo antes de decidir, y preguntó por dos personas. La acción correcta es dar el precio por persona, el total y mencionar qué incluye.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "It's fifty dollars per person, so one hundred for both. Lunch is included.",
        note_es:
          "Dar el precio por persona y también el total contesta la pregunta completa y evita el malentendido más común. Mencionar qué incluye adelanta la siguiente pregunta.",
      },
      vocabulary: [
        {
          word_en: "per person",
          word_es: "por persona",
          example_en: "The tour is fifty dollars per person.",
          example_es: "El tour cuesta cincuenta dólares por persona.",
        },
        {
          word_en: "included",
          word_es: "incluido",
          example_en: "Lunch is included in the price.",
          example_es: "La comida está incluida en el precio.",
        },
        {
          word_en: "cash",
          word_es: "efectivo",
          example_en: "They take cash or card at the dock.",
          example_es: "En el muelle aceptan efectivo o tarjeta.",
        },
      ],
    },
    {
      id: "c-006",
      level: "A2",
      listening: {
        audio_text: "We'd like to try somewhere nice for dinner tonight. Can you book a table for four around eight?",
        options: [
          { emoji: "🍽️", text_es: "Llamar al restaurante y apartar una mesa para cuatro a las ocho", correct: true },
          { emoji: "🛎️", text_es: "Apartar una mesa para dos en el restaurante del hotel", correct: false },
          { emoji: "🚕", text_es: "Pedir un taxi para las ocho de la noche", correct: false },
        ],
        explanation_es:
          "El huésped quiere cenar fuera del hotel: cuatro personas, ocho de la noche. La acción correcta es llamar al restaurante, apartar la mesa y regresar con la confirmación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll book a table for four at eight and confirm it with you in a few minutes.",
        note_es:
          "'I'll book' comunica que tú te haces cargo del asunto. Cerrar con 'I'll confirm it with you' deja claro que habrá una respuesta, y el huésped se va tranquilo.",
      },
      vocabulary: [
        {
          word_en: "book a table",
          word_es: "reservar una mesa",
          example_en: "I'll book a table for four tonight.",
          example_es: "Reservo una mesa para cuatro esta noche.",
        },
        {
          word_en: "party of four",
          word_es: "grupo de cuatro personas",
          example_en: "I have a party of four at eight.",
          example_es: "Tengo un grupo de cuatro a las ocho.",
        },
        {
          word_en: "confirm",
          word_es: "confirmar",
          example_en: "I'll confirm the time in a few minutes.",
          example_es: "Confirmo la hora en unos minutos.",
        },
      ],
    },
    {
      id: "c-007",
      level: "A2",
      listening: {
        audio_text: "Our flight leaves at six tomorrow morning. Can you arrange a car to the airport?",
        options: [
          { emoji: "🚐", text_es: "Agendar el auto al aeropuerto y decirle a qué hora sale", correct: true },
          { emoji: "🧳", text_es: "Guardar su equipaje hasta mañana en la bodega", correct: false },
          { emoji: "✈️", text_es: "Llamar a la aerolínea para confirmar el vuelo", correct: false },
        ],
        explanation_es:
          "El huésped necesita transporte para un vuelo de las seis de la mañana. La acción correcta es agendar el auto con tiempo suficiente y decirle la hora exacta de salida del hotel.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, I'll arrange a car. I'd suggest leaving around three thirty, so you get there on time.",
        note_es:
          "'I'd suggest' propone sin ordenar: el huésped decide, pero ya tiene el dato que necesita. Es la fórmula más segura para recomendar una hora.",
      },
      vocabulary: [
        {
          word_en: "arrange",
          word_es: "agendar, organizar",
          example_en: "I'll arrange a car for tomorrow morning.",
          example_es: "Agendo un auto para mañana temprano.",
        },
        {
          word_en: "pick up",
          word_es: "pasar por",
          example_en: "The car will pick you up at three thirty.",
          example_es: "El auto pasa por el lobby a las tres y media.",
        },
        {
          word_en: "on time",
          word_es: "a tiempo",
          example_en: "You'll get to the airport on time.",
          example_es: "Van a llegar al aeropuerto a tiempo.",
        },
      ],
    },
    {
      id: "c-008",
      level: "A2",
      listening: {
        audio_text: "We were thinking about the ruins tomorrow. Is there a tour we can join?",
        options: [
          { emoji: "🏛️", text_es: "Apartarles lugar en el tour y decirles hora y punto de salida", correct: true },
          { emoji: "🚗", text_es: "Rentarles un auto para que vayan por su cuenta", correct: false },
          { emoji: "🎟️", text_es: "Venderles boletos para el museo de la ciudad", correct: false },
        ],
        explanation_es:
          "El huésped quiere unirse a un tour organizado, no ir por su cuenta. La acción correcta es apartarles lugar y decirles a qué hora y dónde se reúnen.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "There's a tour that leaves at eight in the morning. I can sign you up, and they'll meet you here in the lobby.",
        note_es:
          "'I can sign you up' es corto, concreto y no compromete a pagar en ese momento. Decir dónde se encuentran elimina la duda más común del huésped.",
      },
      vocabulary: [
        {
          word_en: "sign up",
          word_es: "apuntar, inscribir",
          example_en: "I can sign you up right now.",
          example_es: "Los puedo apuntar ahora mismo.",
        },
        {
          word_en: "leaves at",
          word_es: "sale a las",
          example_en: "The tour leaves at eight.",
          example_es: "El tour sale a las ocho.",
        },
        {
          word_en: "lobby",
          word_es: "lobby, recepción",
          example_en: "They'll meet you here in the lobby.",
          example_es: "El grupo se reúne aquí en el lobby.",
        },
      ],
    },
    {
      id: "c-009",
      level: "A2",
      listening: {
        audio_text: "We have two kids, seven and nine. Is there anything around here they'd enjoy?",
        options: [
          { emoji: "🐢", text_es: "Recomendar una actividad para niños y explicar cómo llegar", correct: true },
          { emoji: "🍸", text_es: "Recomendar el bar de la azotea", correct: false },
          { emoji: "👶", text_es: "Ofrecer servicio de niñera para esta noche", correct: false },
        ],
        explanation_es:
          "El huésped busca un plan para sus hijos, no dejarlos con alguien. La acción correcta es recomendar una actividad adecuada para esa edad y decir cómo llegar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The aquarium is great for that age, and it's only ten minutes away by taxi.",
        note_es:
          "Mencionar la edad demuestra que escuchaste el detalle, no que repites la recomendación de siempre. Decir cuánto se hace de camino convierte la idea en un plan.",
      },
      vocabulary: [
        {
          word_en: "kids",
          word_es: "niños",
          example_en: "The kids will love the aquarium.",
          example_es: "A los niños les va a encantar el acuario.",
        },
        {
          word_en: "aquarium",
          word_es: "acuario",
          example_en: "The aquarium is great for that age.",
          example_es: "El acuario es ideal para esa edad.",
        },
        {
          word_en: "ten minutes away",
          word_es: "a diez minutos",
          example_en: "It's only ten minutes away by taxi.",
          example_es: "Está a solo diez minutos en taxi.",
        },
      ],
    },
    {
      id: "c-010",
      level: "A2",
      listening: {
        audio_text: "I need to change some dollars into pesos. Is there a good place near the hotel?",
        options: [
          { emoji: "🏦", text_es: "Mandarlo a una casa de cambio cercana y decirle el horario", correct: true },
          { emoji: "🏧", text_es: "Llevarlo al cajero automático del lobby", correct: false },
          { emoji: "💳", text_es: "Sugerirle que mejor pague todo con tarjeta", correct: false },
        ],
        explanation_es:
          "El huésped quiere cambiar dólares, no sacar dinero de su cuenta ni pagar con tarjeta. La acción correcta es mandarlo a una casa de cambio y decirle hasta qué hora abre.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "There's an exchange office around the corner. Take your passport — they always ask for an ID.",
        note_es:
          "Avisar de la identificación antes de que salga le evita hacer el viaje dos veces. Ese tipo de detalle es lo que distingue a un buen concierge.",
      },
      vocabulary: [
        {
          word_en: "exchange office",
          word_es: "casa de cambio",
          example_en: "There's an exchange office around the corner.",
          example_es: "Hay una casa de cambio a la vuelta.",
        },
        {
          word_en: "around the corner",
          word_es: "a la vuelta",
          example_en: "The bank is around the corner.",
          example_es: "El banco está a la vuelta.",
        },
        {
          word_en: "ID",
          word_es: "identificación",
          example_en: "They always ask for an ID at the counter.",
          example_es: "En la ventanilla siempre piden identificación.",
        },
      ],
    },
    {
      id: "c-011",
      level: "B1",
      listening: {
        audio_text: "We'd love to do the sunset cruise tonight. I know it's last minute — is there any chance you still have two seats?",
        options: [
          { emoji: "🌅", text_es: "Decirle que hoy ya no hay lugar y ofrecer una alternativa concreta", correct: true },
          { emoji: "🎟️", text_es: "Apartarle dos lugares sin confirmar si hay disponibilidad", correct: false },
          { emoji: "🚤", text_es: "Mandarlo temprano al muelle a ver si alcanza lugar", correct: false },
        ],
        explanation_es:
          "Al ser de último momento, el paseo de hoy ya está lleno. La acción correcta es decirlo de frente, disculparse y ofrecer una alternativa concreta: el mismo paseo mañana u otro plan para esta noche.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry — tonight's cruise is sold out. I can hold two seats for tomorrow, or there's a rooftop with the same view.",
        note_es:
          "Un 'I'm sorry' seguido de una alternativa concreta cambia por completo el tono de la mala noticia. Nunca dejes al huésped solo con el 'no'.",
      },
      vocabulary: [
        {
          word_en: "sold out",
          word_es: "agotado, lleno",
          example_en: "Tonight's cruise is sold out.",
          example_es: "El paseo de hoy está agotado.",
        },
        {
          word_en: "seat",
          word_es: "lugar, asiento",
          example_en: "I can hold two seats for tomorrow.",
          example_es: "Puedo apartar dos lugares para mañana.",
        },
        {
          word_en: "instead",
          word_es: "en vez de",
          example_en: "Would you like tomorrow instead?",
          example_es: "¿Y si mejor mañana?",
        },
      ],
    },
    {
      id: "c-012",
      level: "B1",
      listening: {
        audio_text: "We've been waiting twenty minutes. The van was supposed to be here at eight.",
        options: [
          { emoji: "📞", text_es: "Disculparse, llamar al operador y volver con una hora concreta", correct: true },
          { emoji: "☕", text_es: "Ofrecerles un café y no decir nada más", correct: false },
          { emoji: "🚕", text_es: "Mandarlos en taxi por su cuenta al punto de salida", correct: false },
        ],
        explanation_es:
          "El huésped no busca un café, busca información. La acción correcta es disculparse, llamar al operador para saber cuánto falta y regresar con un dato concreto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm so sorry about the delay. Let me call the operator right now, and I'll come back with an exact time.",
        note_es:
          "'Let me call the operator right now' muestra acción inmediata. Prometer 'an exact time' funciona mejor que 'soon', porque 'soon' no tranquiliza a nadie.",
      },
      vocabulary: [
        {
          word_en: "delay",
          word_es: "retraso",
          example_en: "I'm so sorry about the delay.",
          example_es: "Una disculpa por el retraso.",
        },
        {
          word_en: "operator",
          word_es: "operador",
          example_en: "Let me call the operator right now.",
          example_es: "Llamo al operador ahora mismo.",
        },
        {
          word_en: "exact time",
          word_es: "hora exacta",
          example_en: "I'll come back with an exact time.",
          example_es: "Regreso con una hora exacta.",
        },
      ],
    },
    {
      id: "c-013",
      level: "B1",
      listening: {
        audio_text: "We went all the way to the restaurant you recommended and it was closed. We just came back.",
        options: [
          { emoji: "🍽️", text_es: "Disculparse y conseguirle ahora mismo mesa en un lugar parecido", correct: true },
          { emoji: "📋", text_es: "Anotar la queja y decirle que lo revisas mañana", correct: false },
          { emoji: "🚕", text_es: "Ofrecerle de inmediato el reembolso del taxi", correct: false },
        ],
        explanation_es:
          "El huésped se quedó sin cenar. La acción correcta es disculparse y resolverlo en ese momento: buscar un lugar parecido, apartar mesa y confirmar que ya está listo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm so sorry, that was my mistake. Give me two minutes and I'll find you a table somewhere just as good.",
        note_es:
          "'That was my mistake' asume la responsabilidad sin dar explicaciones largas ni echar culpas. Ojo con 'that's on me': suena parecido, pero muchos huéspedes lo entienden como 'yo lo pago'.",
      },
      vocabulary: [
        {
          word_en: "my mistake",
          word_es: "mi error",
          example_en: "I'm so sorry, that was my mistake.",
          example_es: "Una disculpa, fue mi error.",
        },
        {
          word_en: "just as good",
          word_es: "igual de bueno",
          example_en: "I know another place just as good.",
          example_es: "Conozco otro lugar igual de bueno.",
        },
        {
          word_en: "give me two minutes",
          word_es: "dos minutos y lo resuelvo",
          example_en: "Give me two minutes and I'll find you a table.",
          example_es: "En dos minutos les consigo mesa.",
        },
      ],
    },
    {
      id: "c-014",
      level: "B1",
      listening: {
        audio_text: "The tour was fine, but the guide only spoke Spanish. We didn't understand a word.",
        options: [
          { emoji: "🗣️", text_es: "Disculparse, reportarlo con el operador y ofrecer una opción en inglés", correct: true },
          { emoji: "🙂", text_es: "Explicarle que aquí los tours normalmente son en español", correct: false },
          { emoji: "💸", text_es: "Ofrecerle la devolución del dinero del tour", correct: false },
        ],
        explanation_es:
          "El huésped pagó por algo que no pudo aprovechar. La acción correcta es disculparse, reportar el caso con el operador y ofrecer una alternativa con guía en inglés.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry, that shouldn't have happened. I'll report it to the operator, and I can book you a tour with an English-speaking guide.",
        note_es:
          "'That shouldn't have happened' valida la molestia sin culpar a nadie. Ofrecer la solución en la misma frase evita que la queja siga creciendo. Nunca prometas devoluciones que no te toca autorizar.",
      },
      vocabulary: [
        {
          word_en: "guide",
          word_es: "guía",
          example_en: "The guide will meet you at the entrance.",
          example_es: "El guía espera en la entrada.",
        },
        {
          word_en: "English-speaking",
          word_es: "que habla inglés",
          example_en: "I'll ask for an English-speaking guide.",
          example_es: "Voy a pedir un guía que hable inglés.",
        },
        {
          word_en: "report",
          word_es: "reportar",
          example_en: "I'll report this to the tour operator today.",
          example_es: "Reporto esto hoy mismo con el operador.",
        },
      ],
    },
    {
      id: "c-015",
      level: "B1",
      listening: {
        audio_text: "I think I lost my passport. We fly home on Saturday and I don't know what to do.",
        options: [
          { emoji: "🛂", text_es: "Explicar los pasos con calma, empezando por el consulado, y ofrecerse a llamar", correct: true },
          { emoji: "✈️", text_es: "Llamar a la aerolínea para cambiar el vuelo del sábado", correct: false },
          { emoji: "🕔", text_es: "Decirle que sin pasaporte no se puede hacer nada hasta el lunes", correct: false },
        ],
        explanation_es:
          "Con un pasaporte perdido, el primer paso es el consulado, que puede expedir un documento de emergencia. La acción correcta es explicarlo con calma, anotar la dirección y ofrecerse a llamar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let's take it step by step. The consulate is the first call — I'll write down the address and call them for you.",
        note_es:
          "'Let's take it step by step' baja la ansiedad antes de dar información. Ofrecerte a hacer la llamada convierte una lista de trámites en ayuda de verdad.",
      },
      vocabulary: [
        {
          word_en: "passport",
          word_es: "pasaporte",
          example_en: "The consulate can issue an emergency passport.",
          example_es: "El consulado puede expedir un pasaporte de emergencia.",
        },
        {
          word_en: "consulate",
          word_es: "consulado",
          example_en: "The consulate opens at nine in the morning.",
          example_es: "El consulado abre a las nueve de la mañana.",
        },
        {
          word_en: "step by step",
          word_es: "paso a paso",
          example_en: "Let's take it step by step.",
          example_es: "Vamos paso a paso.",
        },
      ],
    },
    {
      id: "c-016",
      level: "B2",
      listening: {
        audio_text: "We were thinking of walking down to the old market after dinner. It looked lively earlier.",
        options: [
          { emoji: "🚕", text_es: "Sugerir con naturalidad ir en taxi y proponer mejor horario", correct: true },
          { emoji: "🙂", text_es: "Decirles que sí caminen, para no preocuparlos", correct: false },
          { emoji: "⚠️", text_es: "Advertirles que esa zona es peligrosa de noche", correct: false },
        ],
        explanation_es:
          "La zona no conviene a esa hora, pero asustar al huésped tampoco es la solución. La acción correcta es recomendar el taxi como algo normal y sugerir el momento del día en que sí vale la pena ir.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "It's lovely during the day. At night I'd take a taxi — it's five minutes, and the driver can wait for you.",
        note_es:
          "Cambiar el marco a 'during the day' cuida al huésped sin usar la palabra 'dangerous'. Dar una razón práctica hace que el consejo se acepte sin generar miedo.",
      },
      vocabulary: [
        {
          word_en: "I'd take a taxi",
          word_es: "yo tomaría un taxi",
          example_en: "At night I'd take a taxi.",
          example_es: "De noche yo tomaría un taxi.",
        },
        {
          word_en: "during the day",
          word_es: "de día",
          example_en: "The market is best during the day.",
          example_es: "El mercado se disfruta más de día.",
        },
        {
          word_en: "wait for you",
          word_es: "esperar",
          example_en: "The driver can wait for you outside.",
          example_es: "El chofer puede esperar afuera.",
        },
      ],
    },
    {
      id: "c-017",
      level: "B2",
      listening: {
        audio_text: "My wife has her heart set on seeing whales. We're here until Friday — can you make it happen?",
        options: [
          { emoji: "🐋", text_es: "Decir con honestidad que no es temporada y ofrecer la mejor alternativa real", correct: true },
          { emoji: "📅", text_es: "Apartar un tour de ballenas aunque no sea temporada", correct: false },
          { emoji: "🤷", text_es: "Decirle que no hay nada que se pueda hacer", correct: false },
        ],
        explanation_es:
          "Las ballenas no llegan en esta temporada y prometerlas saldría peor. La acción correcta es decir la verdad rápido y llenar el hueco con un plan que sí exista y valga la pena.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I wish I could — the whales don't come through until December. What I can do is book the dolphin sanctuary. It's the closest thing right now.",
        note_es:
          "'I wish I could' reconoce el deseo antes de dar el no, y 'What I can do is' devuelve el control de la conversación. Prometer algo que no existe siempre cuesta más caro después.",
      },
      vocabulary: [
        {
          word_en: "I wish I could",
          word_es: "ojalá pudiera",
          example_en: "I wish I could, but that tour only runs in winter.",
          example_es: "Ojalá pudiera, pero ese tour solo opera en invierno.",
        },
        {
          word_en: "season",
          word_es: "temporada",
          example_en: "Whale season starts in December.",
          example_es: "La temporada de ballenas empieza en diciembre.",
        },
        {
          word_en: "the closest thing",
          word_es: "lo más parecido",
          example_en: "It's the closest thing this time of year.",
          example_es: "Es lo más parecido en esta época del año.",
        },
      ],
    },
    {
      id: "c-018",
      level: "B2",
      listening: {
        audio_text: "Look, I know that restaurant's booked solid tonight, but I'm sure you have your ways. I'd make it worth your while.",
        options: [
          { emoji: "🤝", text_es: "Agradecer, no aceptar el dinero y ofrecer lista de espera con respuesta", correct: true },
          { emoji: "💵", text_es: "Aceptar la propina y prometerle la mesa", correct: false },
          { emoji: "🚫", text_es: "Decirle secamente que no se puede y terminar ahí", correct: false },
        ],
        explanation_es:
          "El huésped ofrece dinero para conseguir una mesa que ya está llena. La acción correcta es no aceptarlo, sin hacerlo sentir mal, y comprometerte solo con lo que sí está en tus manos: llamar, dejarlo en lista de espera y avisarle.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "That's very kind, but it's not necessary. Let me call them and put you on the waiting list — I'll let you know either way.",
        note_es:
          "'That's very kind, but it's not necessary' rechaza la propina sin humillar al huésped. 'I'll let you know either way' promete una respuesta, no un resultado, y eso sí lo puedes cumplir.",
      },
      vocabulary: [
        {
          word_en: "waiting list",
          word_es: "lista de espera",
          example_en: "I'll put you on the waiting list.",
          example_es: "Los anoto en la lista de espera.",
        },
        {
          word_en: "either way",
          word_es: "pase lo que pase",
          example_en: "I'll let you know either way.",
          example_es: "Yo aviso pase lo que pase.",
        },
        {
          word_en: "that's not necessary",
          word_es: "no es necesario",
          example_en: "Thank you, but that's really not necessary.",
          example_es: "Gracias, pero no es necesario.",
        },
      ],
    },
    {
      id: "c-019",
      level: "B2",
      listening: {
        audio_text: "My husband's been having chest pain for about an hour. Should we go to a hospital?",
        options: [
          { emoji: "🚑", text_es: "Llamar de inmediato a emergencias y avisar al gerente en turno", correct: true },
          { emoji: "🚕", text_es: "Pedirles un taxi al hospital y seguir con lo tuyo", correct: false },
          { emoji: "💊", text_es: "Mandarlos a la farmacia por un medicamento", correct: false },
        ],
        explanation_es:
          "Un dolor de pecho de una hora es una urgencia médica. La acción correcta es llamar a la ambulancia enseguida, quedarte con ellos y avisar al gerente en turno.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm calling an ambulance right now. Please stay here with me — help will be here in a few minutes.",
        note_es:
          "'I'm calling' en presente continuo comunica que ya está pasando, no que lo vas a pensar. En una urgencia, las frases cortas y claras tranquilizan más que las muy amables.",
      },
      vocabulary: [
        {
          word_en: "chest pain",
          word_es: "dolor de pecho",
          example_en: "He has chest pain.",
          example_es: "Tiene dolor de pecho.",
        },
        {
          word_en: "ambulance",
          word_es: "ambulancia",
          example_en: "I'm calling an ambulance right now.",
          example_es: "Estoy llamando una ambulancia ahora mismo.",
        },
        {
          word_en: "stay with you",
          word_es: "acompañar",
          example_en: "I'll stay with you until they arrive.",
          example_es: "Los acompaño hasta que lleguen.",
        },
      ],
    },
    {
      id: "c-020",
      level: "B2",
      listening: {
        audio_text: "It's our thirtieth anniversary tonight. I'd love to do something she'll remember — money isn't really the issue.",
        options: [
          { emoji: "🌹", text_es: "Proponer un plan concreto y confirmar solo lo que sí se puede lograr hoy", correct: true },
          { emoji: "🎉", text_es: "Prometerle una sorpresa espectacular sin haber confirmado nada", correct: false },
          { emoji: "🍽️", text_es: "Apartarle la mesa de siempre en el restaurante del hotel", correct: false },
        ],
        explanation_es:
          "El huésped quiere una noche memorable y está confiando en tu criterio. La acción correcta es proponer un plan concreto, confirmar cada parte y no prometer nada que todavía no esté cerrado.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Congratulations. Let me suggest a table by the water at eight, with flowers waiting for her — I'll confirm both within the hour.",
        note_es:
          "Felicitar primero reconoce el momento, no solo la petición. 'Let me suggest' pone tu criterio de experto sobre la mesa, y dar un plazo real vale más que una promesa vaga.",
      },
      vocabulary: [
        {
          word_en: "anniversary",
          word_es: "aniversario",
          example_en: "Congratulations on your anniversary.",
          example_es: "Felicidades por el aniversario.",
        },
        {
          word_en: "flowers",
          word_es: "flores",
          example_en: "We can have flowers waiting at the table.",
          example_es: "Podemos dejar flores en la mesa.",
        },
        {
          word_en: "within the hour",
          word_es: "en menos de una hora",
          example_en: "I'll confirm everything within the hour.",
          example_es: "Confirmo todo en menos de una hora.",
        },
      ],
    },
  ],

  spa: [
    {
      id: "s-001",
      level: "A1",
      listening: {
        audio_text: "Hi, I have a massage at four. Am I in the right place?",
        options: [
          { emoji: "🧾", text_es: "Le das la bienvenida y le entregas el formulario de salud para llenar.", correct: true },
          { emoji: "🍵", text_es: "Le ofreces un té y le dices que espere afuera del spa.", correct: false },
          { emoji: "🗓️", text_es: "Le dices que no aparece en la agenda y que tiene que hacer una reservación nueva.", correct: false },
        ],
        explanation_es:
          "El huésped solo quiere confirmar que llegó al lugar correcto para su cita. Lo primero es darle la bienvenida y pedirle que llene el formulario de salud antes del tratamiento.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, you're in the right place. Welcome! Please fill out this short form.",
        note_es:
          "«You're in the right place» tranquiliza de inmediato a alguien que llega perdido. Decir «short form» avisa que es rápido y baja la resistencia a llenarlo.",
      },
      vocabulary: [
        {
          word_en: "welcome",
          word_es: "bienvenido",
          example_en: "Welcome to the spa. What is your name?",
          example_es: "Bienvenido al spa. ¿Cuál es tu nombre?",
        },
        {
          word_en: "form",
          word_es: "formulario",
          example_en: "Please fill out this form before we start.",
          example_es: "Por favor llena este formulario antes de empezar.",
        },
        {
          word_en: "appointment",
          word_es: "cita",
          example_en: "Your appointment is at four o'clock.",
          example_es: "Tu cita es a las cuatro.",
        },
      ],
    },
    {
      id: "s-002",
      level: "A1",
      listening: {
        audio_text: "Sorry, where do I change?",
        options: [
          { emoji: "🚪", text_es: "Lo llevas al vestidor, le das una bata y le asignas un casillero.", correct: true },
          { emoji: "💧", text_es: "Le dices que se cambie en el baño de la alberca.", correct: false },
          { emoji: "🛏️", text_es: "Lo pasas directo a la sala de masaje sin darle bata.", correct: false },
        ],
        explanation_es:
          "El huésped pregunta dónde cambiarse de ropa. Hay que acompañarlo al vestidor y darle bata y casillero antes del tratamiento.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Right this way. Here's your robe and your locker key.",
        note_es:
          "«Right this way» sirve para acompañar a alguien sin dar una dirección larga que no vas a poder explicar. Entregar bata y llave en la misma frase evita que el huésped tenga que preguntar dos veces.",
      },
      vocabulary: [
        {
          word_en: "changing room",
          word_es: "vestidor",
          example_en: "The changing room is on your left.",
          example_es: "El vestidor está a tu izquierda.",
        },
        {
          word_en: "robe",
          word_es: "bata",
          example_en: "Here is a robe and a towel.",
          example_es: "Aquí tienes una bata y una toalla.",
        },
        {
          word_en: "locker",
          word_es: "casillero",
          example_en: "Your locker number is twelve.",
          example_es: "Tu casillero es el número doce.",
        },
      ],
    },
    {
      id: "s-003",
      level: "A1",
      listening: {
        audio_text: "Ooh, it's a little cold in here.",
        options: [
          { emoji: "🔥", text_es: "Le pones una manta encima y subes la temperatura del cuarto.", correct: true },
          { emoji: "❄️", text_es: "Bajas más la temperatura del cuarto porque entendiste que tenía calor.", correct: false },
          { emoji: "🧊", text_es: "Le ofreces un vaso de agua fría.", correct: false },
        ],
        explanation_es:
          "El huésped tiene frío y está acostado, cubierto solo con una toalla. La respuesta correcta es ponerle una manta encima y subir la temperatura del cuarto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'll get you a blanket and turn up the heat.",
        note_es:
          "«Turn up the heat» es lo que de verdad dice la gente; «put more temperature» no existe en inglés. Ofrecer las dos cosas a la vez muestra atención sin tener que preguntar.",
      },
      vocabulary: [
        {
          word_en: "blanket",
          word_es: "manta, cobija",
          example_en: "Would you like another blanket?",
          example_es: "¿Quieres otra manta?",
        },
        {
          word_en: "cold",
          word_es: "frío",
          example_en: "Tell me if you get cold.",
          example_es: "Dime si te da frío.",
        },
        {
          word_en: "warm",
          word_es: "tibio, cálido",
          example_en: "The room will be warm in a minute.",
          example_es: "El cuarto va a estar cálido en un minuto.",
        },
      ],
    },
    {
      id: "s-004",
      level: "A1",
      listening: {
        audio_text: "Could you turn the music down a bit?",
        options: [
          { emoji: "🔉", text_es: "Bajas el volumen de la música.", correct: true },
          { emoji: "🎶", text_es: "Cambias la música por otra canción.", correct: false },
          { emoji: "🔊", text_es: "Subes el volumen porque crees que no la escucha bien.", correct: false },
        ],
        explanation_es:
          "El huésped quiere el mismo ambiente pero con menos volumen. «Turn down» significa bajar, no cambiar ni quitar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. Let me know if it's still too loud.",
        note_es:
          "«Turn down» es bajar y «turn up» es subir: es la trampa más común de este par. Cerrar con «let me know» le deja al huésped el control del segundo ajuste.",
      },
      vocabulary: [
        {
          word_en: "turn down",
          word_es: "bajar el volumen",
          example_en: "I'll turn down the music for you.",
          example_es: "Te bajo la música.",
        },
        {
          word_en: "loud",
          word_es: "fuerte, alto",
          example_en: "Is the music too loud?",
          example_es: "¿La música está muy fuerte?",
        },
        {
          word_en: "let me know",
          word_es: "avísame",
          example_en: "Let me know if you need anything.",
          example_es: "Avísame si necesitas algo.",
        },
      ],
    },
    {
      id: "s-005",
      level: "A1",
      listening: {
        audio_text: "Do I need to take my ring off?",
        options: [
          { emoji: "💍", text_es: "Le pides que se lo quite y lo guarde él mismo en su casillero.", correct: true },
          { emoji: "🧴", text_es: "Le dices que no importa y empiezas a poner aceite.", correct: false },
          { emoji: "🤲", text_es: "Le pides el anillo y lo guardas tú para cuidarlo.", correct: false },
        ],
        explanation_es:
          "El aceite y el calor pueden dañar las joyas y estorban durante el masaje. El huésped guarda sus cosas de valor él mismo, nunca tú.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Please take it off and leave it in your locker. The oil can damage it.",
        note_es:
          "Dar la razón convierte una orden en un consejo, y el huésped obedece sin sentirse mandado. Nunca recibas joyas en tu mano: eso te deja a ti como responsable si algo se pierde.",
      },
      vocabulary: [
        {
          word_en: "ring",
          word_es: "anillo",
          example_en: "You can leave your ring in the locker.",
          example_es: "Puedes dejar tu anillo en el casillero.",
        },
        {
          word_en: "take off",
          word_es: "quitarse",
          example_en: "Please take off your watch.",
          example_es: "Por favor quítate el reloj.",
        },
        {
          word_en: "oil",
          word_es: "aceite",
          example_en: "I use warm oil for the massage.",
          example_es: "Uso aceite tibio para el masaje.",
        },
      ],
    },
    {
      id: "s-006",
      level: "A2",
      listening: {
        audio_text: "I've never had a deep tissue massage. What actually happens?",
        options: [
          { emoji: "🗣️", text_es: "Le explicas el tratamiento paso a paso antes de empezar: duración, aceite y postura.", correct: true },
          { emoji: "⏱️", text_es: "Le dices que ya no hay tiempo para explicar y empiezas de una vez.", correct: false },
          { emoji: "💆", text_es: "Le recomiendas cambiarse a un facial porque es más sencillo.", correct: false },
        ],
        explanation_es:
          "El huésped nunca ha tomado ese masaje y quiere saber qué esperar. Explicar los pasos antes de empezar baja la ansiedad y evita sorpresas a mitad del tratamiento.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "It's sixty minutes with warm oil. You'll start face down, and I'll ask you to turn over halfway through.",
        note_es:
          "Dar duración, producto y postura en ese orden responde las tres dudas más comunes de una sola vez. «I'll ask you to turn over» deja claro que el huésped se mueve solo, no que tú lo mueves.",
      },
      vocabulary: [
        {
          word_en: "deep tissue",
          word_es: "masaje profundo",
          example_en: "Deep tissue is stronger than a relaxing massage.",
          example_es: "El masaje profundo es más fuerte que uno relajante.",
        },
        {
          word_en: "face down",
          word_es: "boca abajo",
          example_en: "Please lie face down on the table.",
          example_es: "Por favor acuéstate boca abajo en la camilla.",
        },
        {
          word_en: "turn over",
          word_es: "voltearse",
          example_en: "I'll ask you to turn over in thirty minutes.",
          example_es: "Te voy a pedir que te voltees en treinta minutos.",
        },
      ],
    },
    {
      id: "s-007",
      level: "A2",
      listening: {
        audio_text: "I filled out the form, but I forgot to mention I'm allergic to almonds.",
        options: [
          { emoji: "🧴", text_es: "Cambias el aceite por uno sin almendra y lo anotas en su ficha.", correct: true },
          { emoji: "📄", text_es: "Le dices que el formulario ya está entregado y no se puede cambiar.", correct: false },
          { emoji: "🥜", text_es: "Le dices que como el aceite no se come, la alergia no importa.", correct: false },
        ],
        explanation_es:
          "Muchos aceites de masaje son de almendra dulce, así que el producto sí tiene que cambiar. Además se anota en su ficha para que no tenga que repetirlo en la próxima visita.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm glad you mentioned it. I'll use a different oil and add it to your file.",
        note_es:
          "«I'm glad you mentioned it» premia que el huésped hable de su salud, en lugar de hacerlo sentir un problema. «Add it to your file» le promete que no va a tener que explicarlo otra vez.",
      },
      vocabulary: [
        {
          word_en: "allergic",
          word_es: "alérgico",
          example_en: "Are you allergic to any products?",
          example_es: "¿Eres alérgico a algún producto?",
        },
        {
          word_en: "almond",
          word_es: "almendra",
          example_en: "This oil is made from almonds.",
          example_es: "Este aceite está hecho de almendra.",
        },
        {
          word_en: "file",
          word_es: "ficha, expediente",
          example_en: "I'll add it to your file.",
          example_es: "Lo anoto en tu ficha.",
        },
      ],
    },
    {
      id: "s-008",
      level: "A2",
      listening: {
        audio_text: "That's a bit much on my shoulders.",
        options: [
          { emoji: "🤲", text_es: "Bajas la presión de inmediato y le preguntas si así está mejor.", correct: true },
          { emoji: "💪", text_es: "Sigues igual porque así se deshacen los nudos.", correct: false },
          { emoji: "❄️", text_es: "Le pones una compresa fría en el hombro y sigues.", correct: false },
        ],
        explanation_es:
          "El huésped te está diciendo con mucha cortesía que le duele. Se baja la presión en ese mismo momento y se confirma con él el nuevo nivel.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Thanks for telling me — I'll go lighter. Is this better?",
        note_es:
          "Los huéspedes casi nunca dicen «it hurts»: dicen «a bit much» o «that's intense». Trata cualquiera de esas frases como un alto inmediato y confirma con una pregunta corta.",
      },
      vocabulary: [
        {
          word_en: "pressure",
          word_es: "presión",
          example_en: "Is the pressure okay for you?",
          example_es: "¿La presión está bien para ti?",
        },
        {
          word_en: "lighter",
          word_es: "más suave",
          example_en: "I can go lighter on your back.",
          example_es: "Puedo ir más suave en tu espalda.",
        },
        {
          word_en: "shoulders",
          word_es: "hombros",
          example_en: "Which shoulder is bothering you more?",
          example_es: "¿Cuál hombro te molesta más?",
        },
      ],
    },
    {
      id: "s-009",
      level: "A2",
      listening: {
        audio_text: "Quick question, do I take everything off for this?",
        options: [
          { emoji: "🚪", text_es: "Le explicas que se desviste hasta donde se sienta cómodo y que vas a tocar antes de entrar.", correct: true },
          { emoji: "🙅", text_es: "Le dices que tiene que quitarse toda la ropa porque es obligatorio.", correct: false },
          { emoji: "👕", text_es: "Le dices que puede quedarse con toda su ropa puesta.", correct: false },
        ],
        explanation_es:
          "Nadie está obligado a desvestirse por completo. El huésped decide hasta dónde, se cubre con la toalla, y tú tocas la puerta antes de volver a entrar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Undress to your comfort level and lie face down under the towel. I'll knock before I come back in.",
        note_es:
          "«To your comfort level» es la frase estándar en spas del mundo entero: le da el control al huésped sin entrar en detalles incómodos. Anunciar que vas a tocar la puerta cierra el tema de la privacidad de una vez.",
      },
      vocabulary: [
        {
          word_en: "undress",
          word_es: "desvestirse",
          example_en: "You can undress here in the room.",
          example_es: "Te puedes desvestir aquí en el cuarto.",
        },
        {
          word_en: "comfort",
          word_es: "comodidad",
          example_en: "Undress to your comfort level.",
          example_es: "Desvístete hasta donde te sientas cómodo.",
        },
        {
          word_en: "knock",
          word_es: "tocar la puerta",
          example_en: "I'll knock before I come in.",
          example_es: "Voy a tocar antes de entrar.",
        },
      ],
    },
    {
      id: "s-010",
      level: "A2",
      listening: {
        audio_text: "That was amazing. Anything I should do now?",
        options: [
          { emoji: "💧", text_es: "Le dices que tome mucha agua y que se levante despacio, sin prisa.", correct: true },
          { emoji: "🏋️", text_es: "Le recomiendas ir al gimnasio para aprovechar los músculos sueltos.", correct: false },
          { emoji: "🚿", text_es: "Le dices que se bañe con agua muy caliente de inmediato.", correct: false },
        ],
        explanation_es:
          "Después de un masaje el cuerpo necesita agua y unos minutos de reposo. Es el consejo estándar y evita que el huésped se maree al levantarse.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Drink plenty of water today, and take your time getting up. You might feel a little sore tomorrow.",
        note_es:
          "«Take your time» previene el mareo y suena amable, no como una orden médica. Avisar del dolor de mañana hace que el huésped no piense después que algo salió mal.",
      },
      vocabulary: [
        {
          word_en: "water",
          word_es: "agua",
          example_en: "Please drink plenty of water today.",
          example_es: "Por favor toma mucha agua hoy.",
        },
        {
          word_en: "sore",
          word_es: "adolorido",
          example_en: "Your legs may feel sore tomorrow.",
          example_es: "Tus piernas pueden sentirse adoloridas mañana.",
        },
        {
          word_en: "rest",
          word_es: "descansar",
          example_en: "You can rest here for a few minutes.",
          example_es: "Puedes descansar aquí unos minutos.",
        },
      ],
    },
    {
      id: "s-011",
      level: "B1",
      listening: {
        audio_text: "I've looked everywhere. I think I left my watch in the changing room.",
        options: [
          { emoji: "🔎", text_es: "Vas de inmediato a revisar el casillero y el área, y si no aparece levantas el reporte de objetos perdidos con sus datos.", correct: true },
          { emoji: "🤷", text_es: "Le dices que el spa no se hace responsable por objetos olvidados.", correct: false },
          { emoji: "🏨", text_es: "Lo mandas a preguntar a la recepción del hotel, sin acompañarlo ni avisar a nadie.", correct: false },
        ],
        explanation_es:
          "El huésped perdió algo dentro del spa, así que la búsqueda empieza contigo. Se revisa el casillero y el área en ese momento, y si no aparece se levanta el reporte de objetos perdidos con sus datos.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let me check the changing room right now. If it's not there, I'll report it to lost and found and call your room.",
        note_es:
          "«Right now» le baja la angustia: le confirma que la búsqueda empieza en este segundo y no cuando haya tiempo. Prometer que tú le hablas al cuarto evita que se quede esperando sin saber nada.",
      },
      vocabulary: [
        {
          word_en: "watch",
          word_es: "reloj",
          example_en: "I'll look for your watch right now.",
          example_es: "Voy a buscar tu reloj ahora mismo.",
        },
        {
          word_en: "lost and found",
          word_es: "objetos perdidos",
          example_en: "Let me check with lost and found.",
          example_es: "Déjame preguntar en objetos perdidos.",
        },
        {
          word_en: "check",
          word_es: "revisar",
          example_en: "I'll check the changing room for you.",
          example_es: "Voy a revisar el vestidor por ti.",
        },
      ],
    },
    {
      id: "s-012",
      level: "B1",
      listening: {
        audio_text: "I know I'm late, sorry — traffic was awful. We can still do the full ninety, right?",
        options: [
          { emoji: "🕰️", text_es: "Le explicas que solo quedan sesenta minutos y le ofreces reagendar si prefiere el tratamiento completo.", correct: true },
          { emoji: "✅", text_es: "Le dices que sí, aunque eso retrase al huésped que sigue.", correct: false },
          { emoji: "🚫", text_es: "Le dices que perdió su cita y que ya no hay nada que hacer.", correct: false },
        ],
        explanation_es:
          "La siguiente cita ya está agendada, así que el horario no se puede recorrer. Se le ofrece el tiempo que sí alcanza hoy y la opción de reagendar el tratamiento completo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "No problem at all. I have you until three, so we can do sixty minutes today — or I can check tomorrow and reschedule the full ninety.",
        note_es:
          "Empezar con «no problem at all» le quita la culpa antes de darle la mala noticia, y así no se pone a la defensiva. Decir «I can check» en lugar de prometer el horario te deja verificar la agenda sin quedar mal.",
      },
      vocabulary: [
        {
          word_en: "late",
          word_es: "tarde",
          example_en: "Don't worry about being late.",
          example_es: "No te preocupes por llegar tarde.",
        },
        {
          word_en: "reschedule",
          word_es: "reagendar",
          example_en: "I can reschedule you for tomorrow morning.",
          example_es: "Te puedo reagendar para mañana en la mañana.",
        },
        {
          word_en: "full",
          word_es: "completo",
          example_en: "The full treatment takes ninety minutes.",
          example_es: "El tratamiento completo dura noventa minutos.",
        },
      ],
    },
    {
      id: "s-013",
      level: "B1",
      listening: {
        audio_text: "Sorry to interrupt, but my face is really starting to sting.",
        options: [
          { emoji: "🧽", text_es: "Retiras el producto de inmediato con agua fresca y avisas a tu supervisor.", correct: true },
          { emoji: "⏳", text_es: "Le dices que es normal y que aguante dos minutos más.", correct: false },
          { emoji: "🤐", text_es: "Le quitas el producto pero sigues con el resto del facial sin avisarle a nadie.", correct: false },
        ],
        explanation_es:
          "El ardor en la piel puede ser una reacción al producto y no se espera a ver si pasa. Se retira de inmediato, se enjuaga con agua fresca y se reporta.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let's take that off right now. I'm going to rinse your face with cool water and get my supervisor.",
        note_es:
          "«Right now» le confirma al huésped que lo tomaste en serio desde el primer segundo. Decir que vas por tu supervisor es más seguro que decidir tú solo qué producto aplicar después.",
      },
      vocabulary: [
        {
          word_en: "sting",
          word_es: "arder",
          example_en: "Tell me right away if it starts to sting.",
          example_es: "Dime de inmediato si te empieza a arder.",
        },
        {
          word_en: "rinse",
          word_es: "enjuagar",
          example_en: "I'm going to rinse it off with water.",
          example_es: "Lo voy a enjuagar con agua.",
        },
        {
          word_en: "supervisor",
          word_es: "supervisor",
          example_en: "Let me get my supervisor for you.",
          example_es: "Déjame traer a mi supervisor.",
        },
      ],
    },
    {
      id: "s-014",
      level: "B1",
      listening: {
        audio_text: "We were really looking forward to the steam room. Is it open today?",
        options: [
          { emoji: "🛠️", text_es: "Le dices que está en mantenimiento, te disculpas y le ofreces el sauna seco o el jacuzzi.", correct: true },
          { emoji: "🙂", text_es: "Le dices que sí y dejas que lo descubran solos.", correct: false },
          { emoji: "⏰", text_es: "Le dices que abre más tarde, aunque no sabes a qué hora.", correct: false },
        ],
        explanation_es:
          "El vapor está cerrado por mantenimiento y el huésped lo va a notar de todos modos. Hay que decirlo claro, disculparse y ofrecer lo que sí está disponible hoy.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm really sorry — the steam room is closed for maintenance today. The dry sauna and the jacuzzi are both open, if you'd like.",
        note_es:
          "Decir la razón evita que suene a capricho del hotel y baja el enojo casi siempre. Cerrar con «if you'd like» ofrece la alternativa sin empujarla.",
      },
      vocabulary: [
        {
          word_en: "steam room",
          word_es: "cuarto de vapor",
          example_en: "The steam room opens at seven.",
          example_es: "El cuarto de vapor abre a las siete.",
        },
        {
          word_en: "closed",
          word_es: "cerrado",
          example_en: "The pool is closed today.",
          example_es: "La alberca está cerrada hoy.",
        },
        {
          word_en: "maintenance",
          word_es: "mantenimiento",
          example_en: "It's closed for maintenance until Friday.",
          example_es: "Está cerrado por mantenimiento hasta el viernes.",
        },
      ],
    },
    {
      id: "s-015",
      level: "B1",
      listening: {
        audio_text: "Ah, careful there — I had surgery on that knee last year.",
        options: [
          { emoji: "🦵", text_es: "Dejas esa zona, le preguntas qué otra área debes evitar y sigues con el resto del cuerpo.", correct: true },
          { emoji: "💪", text_es: "Trabajas más fuerte esa zona para soltar la cicatriz.", correct: false },
          { emoji: "🖐️", text_es: "Le preguntas si le duele y sigues masajeando la rodilla, pero más suave.", correct: false },
        ],
        explanation_es:
          "Una zona operada no se trabaja sin indicación médica, aunque la cirugía ya tenga tiempo. Se evita esa área, se pregunta si hay otras, y el tratamiento sigue normal en el resto del cuerpo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Good to know — I'll stay away from that knee. Is there anything else I should avoid?",
        note_es:
          "«Stay away from» suena a cuidado, no a rechazo del huésped ni de su cuerpo. La pregunta final abre la puerta a todo lo que se le olvidó poner en el formulario.",
      },
      vocabulary: [
        {
          word_en: "surgery",
          word_es: "cirugía",
          example_en: "Have you had any surgery this year?",
          example_es: "¿Has tenido alguna cirugía este año?",
        },
        {
          word_en: "knee",
          word_es: "rodilla",
          example_en: "I won't touch your knee today.",
          example_es: "Hoy no voy a tocar tu rodilla.",
        },
        {
          word_en: "avoid",
          word_es: "evitar",
          example_en: "Is there any area I should avoid?",
          example_es: "¿Hay alguna zona que deba evitar?",
        },
      ],
    },
    {
      id: "s-016",
      level: "B2",
      listening: {
        audio_text: "I'm six months pregnant, but I'd still love the hot stone massage. My doctor says I'm fine.",
        options: [
          { emoji: "🤰", text_es: "Le explicas con calma que el spa no da piedras calientes durante el embarazo y le ofreces el masaje prenatal.", correct: true },
          { emoji: "🔥", text_es: "Le das el masaje de piedras calientes porque su doctor ya la autorizó.", correct: false },
          { emoji: "📵", text_es: "Le dices que estando embarazada no puede recibir ningún tratamiento.", correct: false },
        ],
        explanation_es:
          "El calor profundo de las piedras no se aplica durante el embarazo, aunque la huésped diga que su doctor la autorizó. Se explica que es una regla del spa y se le ofrece el masaje prenatal, que sí está hecho para esta etapa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Congratulations! We don't do hot stone during pregnancy, but our prenatal massage is designed exactly for this stage. Can I switch you over to that?",
        note_es:
          "«We don't do hot stone» habla del spa y no de la huésped, así que no suena a que la estás juzgando ni contradiciendo a su médico. Ofrecer el cambio en la misma frase impide que sienta que se queda sin nada.",
      },
      vocabulary: [
        {
          word_en: "pregnant",
          word_es: "embarazada",
          example_en: "Please tell us if you are pregnant.",
          example_es: "Por favor dinos si estás embarazada.",
        },
        {
          word_en: "hot stone",
          word_es: "piedras calientes",
          example_en: "We can't do hot stone today.",
          example_es: "Hoy no podemos hacer piedras calientes.",
        },
        {
          word_en: "switch",
          word_es: "cambiar",
          example_en: "Can I switch you to a different treatment?",
          example_es: "¿Te puedo cambiar a otro tratamiento?",
        },
      ],
    },
    {
      id: "s-017",
      level: "B2",
      listening: {
        audio_text: "Look, I've had a couple of drinks, that's all. I'm not going to pass out in a sauna.",
        options: [
          { emoji: "🚱", text_es: "Sostienes la regla en voz baja, le ofreces agua y la sala de descanso, y avisas a tu supervisor.", correct: true },
          { emoji: "🍷", text_es: "Lo dejas entrar porque él dice que está bien y no quieres discutir.", correct: false },
          { emoji: "📢", text_es: "Le dices delante de los demás huéspedes que viene tomado.", correct: false },
        ],
        explanation_es:
          "El alcohol junto con el calor del sauna sube el riesgo de desmayo, y el spa no puede darle el acceso. Se sostiene la regla en voz baja, se ofrece una alternativa y se le informa al supervisor.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I hear you, and I'm not questioning how you feel. It's a safety rule after alcohol — let me set you up in the lounge with some water instead.",
        note_es:
          "«I'm not questioning how you feel» desarma el pleito: no discutes si está tomado o no, hablas solo de la regla. Decir «it's a safety rule» pone el límite en el spa y no en ti, así que no queda como algo personal.",
      },
      vocabulary: [
        {
          word_en: "safety",
          word_es: "seguridad",
          example_en: "This is a safety rule for every guest.",
          example_es: "Es una regla de seguridad para todos los huéspedes.",
        },
        {
          word_en: "rule",
          word_es: "regla",
          example_en: "I'm sorry, it's a rule I can't change.",
          example_es: "Lo siento, es una regla que no puedo cambiar.",
        },
        {
          word_en: "lounge",
          word_es: "sala de descanso",
          example_en: "You're welcome to wait in the lounge.",
          example_es: "Puedes esperar en la sala de descanso.",
        },
      ],
    },
    {
      id: "s-018",
      level: "B2",
      listening: {
        audio_text: "Yeah, tell him the contract isn't signed yet. Hold on, hold on, I can hear you fine.",
        options: [
          { emoji: "🤫", text_es: "Te acercas, le hablas en voz baja y le ofreces tomar la llamada justo afuera.", correct: true },
          { emoji: "📣", text_es: "Le pides desde lejos y en voz alta que cuelgue.", correct: false },
          { emoji: "🙈", text_es: "No haces nada porque no quieres incomodar al huésped.", correct: false },
        ],
        explanation_es:
          "El huésped no se dio cuenta de que está en área de silencio y hay otras personas en tratamiento. Se le avisa de cerca, en voz baja y sin exhibirlo frente a nadie.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Excuse me, sorry to interrupt — this is a quiet area. You're welcome to take the call just outside, and I'll keep your spot.",
        note_es:
          "«I'll keep your spot» convierte la petición en un favor: no lo estás corriendo, le estás guardando el lugar. Acercarte y hablar bajo hace que el resto de los huéspedes ni se entere.",
      },
      vocabulary: [
        {
          word_en: "quiet area",
          word_es: "área de silencio",
          example_en: "This is a quiet area for all guests.",
          example_es: "Esta es un área de silencio para todos los huéspedes.",
        },
        {
          word_en: "interrupt",
          word_es: "interrumpir",
          example_en: "Sorry to interrupt you.",
          example_es: "Perdón por interrumpirte.",
        },
        {
          word_en: "outside",
          word_es: "afuera",
          example_en: "You can take the call just outside.",
          example_es: "Puedes tomar la llamada justo afuera.",
        },
      ],
    },
    {
      id: "s-019",
      level: "B2",
      listening: {
        audio_text: "My shoulders are still tight. I've got two more days here — what would you suggest?",
        options: [
          { emoji: "🗓️", text_es: "Le sugieres una segunda sesión más corta, le explicas para qué serviría y dejas la decisión abierta.", correct: true },
          { emoji: "💳", text_es: "Le vendes el paquete de tres días, el más caro que hay.", correct: false },
          { emoji: "🤷", text_es: "Le dices que descanse y no le ofreces nada más.", correct: false },
        ],
        explanation_es:
          "El huésped está pidiendo una recomendación, no una venta. Se le ofrece una opción concreta con una razón física, y se deja claro que puede decir que no.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Tension like that usually needs a second session. A shorter thirty-minute neck and shoulders tomorrow would help a lot — no pressure either way.",
        note_es:
          "Recomendar por una razón del cuerpo, y no por el precio, es lo que separa un consejo de una venta. «No pressure either way» le deja salida y, por eso mismo, hace que confíe más en ti.",
      },
      vocabulary: [
        {
          word_en: "tight",
          word_es: "tenso",
          example_en: "Your neck is very tight today.",
          example_es: "Tu cuello está muy tenso hoy.",
        },
        {
          word_en: "session",
          word_es: "sesión",
          example_en: "One more session would help a lot.",
          example_es: "Una sesión más ayudaría bastante.",
        },
        {
          word_en: "suggest",
          word_es: "sugerir",
          example_en: "May I suggest something for tomorrow?",
          example_es: "¿Te puedo sugerir algo para mañana?",
        },
      ],
    },
    {
      id: "s-020",
      level: "B2",
      listening: {
        audio_text: "You've got great hands. Any chance you do something a little more private after your shift?",
        options: [
          { emoji: "🛑", text_es: "Detienes el tratamiento con calma, marcas el límite y sales a reportarlo con tu supervisor.", correct: true },
          { emoji: "😅", text_es: "Te ríes y sigues el masaje para no hacer más incómodo el momento.", correct: false },
          { emoji: "🗣️", text_es: "Le contestas de mala manera y sales azotando la puerta.", correct: false },
        ],
        explanation_es:
          "Es una propuesta fuera de lugar y tú no tienes ninguna obligación de seguir en ese cuarto. Se corta con una frase firme y corta, y se reporta de inmediato al supervisor.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "That's not something I do. This is a professional treatment, and I'm going to stop here and step out.",
        note_es:
          "Nombrar el tratamiento como profesional cierra el tema sin volverlo un pleito. No tienes que explicar más ni quedarte a discutir: dices la frase, sales del cuarto y lo reportas con tu supervisor.",
      },
      vocabulary: [
        {
          word_en: "professional",
          word_es: "profesional",
          example_en: "This is a professional treatment.",
          example_es: "Este es un tratamiento profesional.",
        },
        {
          word_en: "step out",
          word_es: "salir un momento",
          example_en: "I'm going to step out for a moment.",
          example_es: "Voy a salir un momento.",
        },
        {
          word_en: "shift",
          word_es: "turno",
          example_en: "My shift ends at eight.",
          example_es: "Mi turno termina a las ocho.",
        },
      ],
    },
  ],

  security: [
    {
      id: "g-001",
      level: "A1",
      listening: {
        audio_text: "Hi. I forgot my key card in the room. Can you open the door for me?",
        options: [
          { emoji: "🪪", text_es: "Pedirle una identificación y verificar el nombre antes de abrir", correct: true },
          { emoji: "🔑", text_es: "Abrir la puerta de inmediato", correct: false },
          { emoji: "🧹", text_es: "Llamar a limpieza para que abra", correct: false },
        ],
        explanation_es:
          "El huésped quiere entrar a su habitación, pero nadie abre una puerta sin confirmar quién es. Primero pides identificación y verificas que el nombre coincida con el registro.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. Can I see your ID, please?",
        note_es:
          "Empezar con “Of course” evita que la petición suene a sospecha. Pides la identificación como parte del servicio, no como una acusación.",
      },
      vocabulary: [
        {
          word_en: "ID",
          word_es: "identificación",
          example_en: "Can I see your ID, please?",
          example_es: "¿Me permite su identificación, por favor?",
        },
        {
          word_en: "key card",
          word_es: "tarjeta de acceso",
          example_en: "Do you have your key card with you?",
          example_es: "¿Trae consigo su tarjeta de acceso?",
        },
        {
          word_en: "room number",
          word_es: "número de habitación",
          example_en: "What's your room number, sir?",
          example_es: "¿Cuál es su número de habitación, señor?",
        },
      ],
    },
    {
      id: "g-002",
      level: "A1",
      listening: {
        audio_text: "Excuse me, can I smoke here? I don't see an ashtray anywhere.",
        options: [
          { emoji: "🚭", text_es: "Explicarle que adentro no se puede y decirle dónde sí", correct: true },
          { emoji: "🚬", text_es: "Traerle un cenicero", correct: false },
          { emoji: "👍", text_es: "Dejarlo fumar porque no hay nadie cerca", correct: false },
        ],
        explanation_es:
          "Pregunta si puede fumar adentro. La respuesta útil no es solo “no”: incluye el lugar donde sí puede hacerlo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Sorry, sir. You can smoke on the terrace.",
        note_es:
          "Un “no” solo deja al huésped sin salida. “Sorry” al inicio y el lugar correcto al final convierten una regla en un servicio.",
      },
      vocabulary: [
        {
          word_en: "smoke",
          word_es: "fumar",
          example_en: "You can smoke on the terrace, sir.",
          example_es: "Puede fumar en la terraza, señor.",
        },
        {
          word_en: "terrace",
          word_es: "terraza",
          example_en: "The terrace is next to the lobby bar.",
          example_es: "La terraza está junto al bar del lobby.",
        },
        {
          word_en: "ashtray",
          word_es: "cenicero",
          example_en: "There's an ashtray by the door outside.",
          example_es: "Hay un cenicero junto a la puerta, afuera.",
        },
      ],
    },
    {
      id: "g-003",
      level: "A1",
      listening: {
        audio_text: "What's that alarm? Where do I go?",
        options: [
          { emoji: "🪜", text_es: "Indicarle las escaleras y decirle que no use el elevador", correct: true },
          { emoji: "🛗", text_es: "Llevarlo al elevador para bajar más rápido", correct: false },
          { emoji: "🚪", text_es: "Pedirle que espere en su habitación", correct: false },
        ],
        explanation_es:
          "Con la alarma sonando, el huésped necesita una instrucción corta y clara. Las escaleras son la salida segura; el elevador nunca se usa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Please take the stairs. Don't use the elevator.",
        note_es:
          "Dos frases imperativas cortas. En una emergencia, mientras más corta es la instrucción, más rápido la obedece la gente.",
      },
      vocabulary: [
        {
          word_en: "stairs",
          word_es: "escaleras",
          example_en: "Please take the stairs on your left.",
          example_es: "Por favor tome las escaleras a su izquierda.",
        },
        {
          word_en: "exit",
          word_es: "salida",
          example_en: "The exit is at the end of the hallway.",
          example_es: "La salida está al final del pasillo.",
        },
        {
          word_en: "alarm",
          word_es: "alarma",
          example_en: "When the alarm rings, everyone goes outside.",
          example_es: "Cuando suena la alarma, todos salen.",
        },
      ],
    },
    {
      id: "g-004",
      level: "A1",
      listening: {
        audio_text: "Hey. I left my phone by the pool this morning. Did anyone find it?",
        options: [
          { emoji: "📱", text_es: "Revisar objetos perdidos y avisarle", correct: true },
          { emoji: "🏊", text_es: "Decirle que vuelva a buscar en la alberca", correct: false },
          { emoji: "🙅", text_es: "Decirle que el hotel no se hace responsable", correct: false },
        ],
        explanation_es:
          "Reporta un objeto olvidado. Lo que corresponde es revisar el registro de objetos perdidos, no mandarlo a buscar por su cuenta ni cerrarle la puerta.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let me check the lost and found. What color is it?",
        note_es:
          "“Let me check” promete acción sin prometer resultado. La pregunta al final te da algo con qué buscar.",
      },
      vocabulary: [
        {
          word_en: "lost and found",
          word_es: "objetos perdidos",
          example_en: "Let me check the lost and found for you.",
          example_es: "Déjeme revisar objetos perdidos.",
        },
        {
          word_en: "phone",
          word_es: "teléfono",
          example_en: "Is your phone black or white?",
          example_es: "¿Su teléfono es negro o blanco?",
        },
        {
          word_en: "pool",
          word_es: "alberca",
          example_en: "The pool closes at ten at night.",
          example_es: "La alberca cierra a las diez de la noche.",
        },
      ],
    },
    {
      id: "g-005",
      level: "A1",
      listening: {
        audio_text: "It's really dark out there. Could you walk me to my car?",
        options: [
          { emoji: "🔦", text_es: "Acompañar al huésped hasta su coche", correct: true },
          { emoji: "🅿️", text_es: "Explicarle dónde está el estacionamiento", correct: false },
          { emoji: "🚕", text_es: "Pedirle un taxi", correct: false },
        ],
        explanation_es:
          "No pide indicaciones: pide compañía. La acción correcta es caminar con el huésped hasta el coche.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll walk you to your car.",
        note_es:
          "“I'll walk you” significa acompañar, no caminar solo. Es la diferencia entre dar una indicación y dar seguridad.",
      },
      vocabulary: [
        {
          word_en: "walk you to",
          word_es: "acompañar a",
          example_en: "I can walk you to your car.",
          example_es: "Puedo acompañarlo a su coche.",
        },
        {
          word_en: "parking lot",
          word_es: "estacionamiento",
          example_en: "The parking lot is behind the hotel.",
          example_es: "El estacionamiento está detrás del hotel.",
        },
        {
          word_en: "flashlight",
          word_es: "lámpara",
          example_en: "I have a flashlight. Please stay next to me.",
          example_es: "Traigo una lámpara. Por favor manténgase a mi lado.",
        },
      ],
    },
    {
      id: "g-006",
      level: "A2",
      listening: {
        audio_text: "Hey, I'm meeting a friend in room 412. Can I just head up?",
        options: [
          { emoji: "☎️", text_es: "Llamar a la habitación y registrarlo antes de que suba", correct: true },
          { emoji: "🛗", text_es: "Dejarlo subir porque sabe el número de habitación", correct: false },
          { emoji: "🪪", text_es: "Pedirle una identificación y dejarlo subir", correct: false },
        ],
        explanation_es:
          "Saber un número de habitación no confirma que lo estén esperando, y una identificación tampoco. Se llama al cuarto y el visitante se registra antes de subir.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let me call the room first. If they're expecting you, I'll take you up.",
        note_es:
          "La condición (“if they're expecting you”) deja clara la regla sin acusar al visitante de nada.",
      },
      vocabulary: [
        {
          word_en: "visitor",
          word_es: "visitante",
          example_en: "Every visitor signs in at the front desk.",
          example_es: "Todo visitante se registra en recepción.",
        },
        {
          word_en: "front desk",
          word_es: "recepción",
          example_en: "Please wait for your friend at the front desk.",
          example_es: "Por favor espere a su amigo en recepción.",
        },
        {
          word_en: "expecting",
          word_es: "estar esperando a alguien",
          example_en: "Is she expecting you?",
          example_es: "¿Ella lo está esperando?",
        },
      ],
    },
    {
      id: "g-007",
      level: "A2",
      listening: {
        audio_text: "The room next to mine has had music going since midnight. I've got a flight at six.",
        options: [
          { emoji: "🔇", text_es: "Subir a pedir que bajen el volumen y regresar a confirmarle", correct: true },
          { emoji: "🛏️", text_es: "Ofrecerle cambiarlo de habitación esta noche", correct: false },
          { emoji: "⏰", text_es: "Decirle que el ruido termina a las dos", correct: false },
        ],
        explanation_es:
          "Tiene un vuelo temprano y necesita dormir ya. Subes, pides que le bajen y regresas a confirmarle que se resolvió. Cambiar habitaciones no te toca a ti.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry about that. I'll go up now and ask them to turn it down.",
        note_es:
          "“I'm sorry about that” reconoce la molestia sin culpar a nadie. Después va la acción concreta y el tiempo: ahora.",
      },
      vocabulary: [
        {
          word_en: "turn it down",
          word_es: "bajarle al volumen",
          example_en: "Could you please turn it down?",
          example_es: "¿Podrían bajarle, por favor?",
        },
        {
          word_en: "next door",
          word_es: "de al lado",
          example_en: "The guest next door is trying to sleep.",
          example_es: "El huésped de al lado está tratando de dormir.",
        },
        {
          word_en: "noise",
          word_es: "ruido",
          example_en: "We had a noise complaint from the fourth floor.",
          example_es: "Recibimos una queja por ruido del cuarto piso.",
        },
      ],
    },
    {
      id: "g-008",
      level: "A2",
      listening: {
        audio_text: "Is my car okay where it is? I left it by the big blue doors for a minute.",
        options: [
          { emoji: "🚗", text_es: "Decirle que ahí es salida de emergencia y pedirle que la mueva", correct: true },
          { emoji: "⏱️", text_es: "Decirle que unos minutos no hay problema", correct: false },
          { emoji: "🔑", text_es: "Pedirle las llaves para moverla tú", correct: false },
        ],
        explanation_es:
          "Las puertas azules son la salida de emergencia y no pueden quedar bloqueadas. Le explicas por qué y le dices dónde sí puede dejarla. Las llaves de un huésped no se toman.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Those doors are a fire exit, sir. Could you move it to the parking lot?",
        note_es:
          "Primero la razón, después la petición. Cuando el huésped entiende por qué, mueve el coche sin discutir.",
      },
      vocabulary: [
        {
          word_en: "fire exit",
          word_es: "salida de emergencia",
          example_en: "Those doors are a fire exit.",
          example_es: "Esas puertas son salida de emergencia.",
        },
        {
          word_en: "move your car",
          word_es: "mover su coche",
          example_en: "Could you move your car, please?",
          example_es: "¿Podría mover su coche, por favor?",
        },
        {
          word_en: "blocking",
          word_es: "bloqueando",
          example_en: "Your car is blocking the door.",
          example_es: "Su coche está bloqueando la puerta.",
        },
      ],
    },
    {
      id: "g-009",
      level: "A2",
      listening: {
        audio_text: "We're not staying at the hotel, we just came in with a friend to use the pool. Is that a problem?",
        options: [
          { emoji: "🏊", text_es: "Explicar que la alberca es solo para huéspedes y mandarlos a preguntar en recepción", correct: true },
          { emoji: "🧾", text_es: "Cobrarles la entrada ahí mismo", correct: false },
          { emoji: "👥", text_es: "Dejarlos quedarse porque vienen con un huésped", correct: false },
        ],
        explanation_es:
          "No están mintiendo: están preguntando. La respuesta correcta explica la regla y los manda a recepción, que es quien decide si pueden quedarse. Tú no cobras ni autorizas.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The pool is for hotel guests. Your friend can check with the front desk for you.",
        note_es:
          "Separar la regla del siguiente paso deja claro que no es una decisión tuya en contra de ellos. La gente acepta mejor un “no” cuando trae una salida.",
      },
      vocabulary: [
        {
          word_en: "guests only",
          word_es: "solo para huéspedes",
          example_en: "The pool is for hotel guests only.",
          example_es: "La alberca es solo para huéspedes del hotel.",
        },
        {
          word_en: "staying here",
          word_es: "hospedarse aquí",
          example_en: "Are you staying here at the hotel?",
          example_es: "¿Se está hospedando aquí en el hotel?",
        },
        {
          word_en: "check with",
          word_es: "preguntar con",
          example_en: "You can check with the front desk.",
          example_es: "Puede preguntar en recepción.",
        },
      ],
    },
    {
      id: "g-010",
      level: "A2",
      listening: {
        audio_text: "I can't find my daughter. She was at the kids' club twenty minutes ago and now she's gone.",
        options: [
          { emoji: "🧒", text_es: "Preguntar cómo va vestida, avisar por radio a todo el equipo y no dejar sola a la persona", correct: true },
          { emoji: "🚪", text_es: "Salir a buscarla tú solo y dejar sola a la persona", correct: false },
          { emoji: "📞", text_es: "Pedirle que espere en su habitación", correct: false },
        ],
        explanation_es:
          "Una niña perdida se busca con todo el equipo al mismo tiempo. Preguntas cómo va vestida, avisas por radio y no dejas sola a la persona que la está buscando.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "What is she wearing? I'll radio my team right now.",
        note_es:
          "La pregunta primero te da información útil de inmediato; “right now” avisa que la búsqueda ya empezó.",
      },
      vocabulary: [
        {
          word_en: "missing",
          word_es: "perdida, desaparecida",
          example_en: "I'm looking for a missing child.",
          example_es: "Estoy buscando a una niña perdida.",
        },
        {
          word_en: "kids' club",
          word_es: "club infantil",
          example_en: "The kids' club closes at eight.",
          example_es: "El club infantil cierra a las ocho.",
        },
        {
          word_en: "radio",
          word_es: "avisar por radio",
          example_en: "I'll radio my team right now.",
          example_es: "Voy a avisar a mi equipo por radio ahora mismo.",
        },
      ],
    },
    {
      id: "g-011",
      level: "B1",
      listening: {
        audio_text: "My watch is gone. It was right here on the desk, and only your housekeeping has been in this room.",
        options: [
          { emoji: "📝", text_es: "Disculparte, levantar el reporte y llamar a tu gerente", correct: true },
          { emoji: "🙅", text_es: "Explicarle que el personal del hotel no roba", correct: false },
          { emoji: "🔍", text_es: "Revisar tú mismo el cuarto y cerrar el tema", correct: false },
        ],
        explanation_es:
          "El huésped está señalando al personal. No defiendes ni acusas: levantas el reporte y subes el caso a tu gerente, que es quien puede investigarlo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry to hear that, sir. Let's fill out a report right now, and I'll ask my manager to come up.",
        note_es:
          "“I'm sorry to hear that” muestra preocupación sin admitir culpa del hotel. Y “let's fill out a report” convierte una acusación en un procedimiento, que es lo que baja la tensión.",
      },
      vocabulary: [
        {
          word_en: "report",
          word_es: "reporte",
          example_en: "Let's fill out a report right now.",
          example_es: "Levantemos un reporte ahora mismo.",
        },
        {
          word_en: "manager",
          word_es: "gerente",
          example_en: "My manager will come up in five minutes.",
          example_es: "Mi gerente subirá en cinco minutos.",
        },
        {
          word_en: "safe",
          word_es: "caja fuerte",
          example_en: "There's a safe in the closet for valuables.",
          example_es: "Hay una caja fuerte en el clóset para objetos de valor.",
        },
      ],
    },
    {
      id: "g-012",
      level: "B1",
      listening: {
        audio_text: "My husband is really dizzy and he can't stand up. Should we just drive to a hospital?",
        options: [
          { emoji: "🚑", text_es: "Pedir que no lo muevan, llamar una ambulancia y quedarte con ellos", correct: true },
          { emoji: "🚕", text_es: "Conseguirles un taxi al hospital", correct: false },
          { emoji: "💊", text_es: "Ofrecerle una pastilla del botiquín", correct: false },
        ],
        explanation_es:
          "Mover a alguien que no puede sostenerse puede empeorar la situación, y dar medicamento no te corresponde. Llamas a la ambulancia y te quedas con ellos.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Please don't move him. I'm calling an ambulance now, and I'll stay with you.",
        note_es:
          "Tres cosas en orden: la instrucción, la acción y el acompañamiento. “I'll stay with you” es lo que calma a la familia.",
      },
      vocabulary: [
        {
          word_en: "ambulance",
          word_es: "ambulancia",
          example_en: "I'm calling an ambulance now.",
          example_es: "Estoy llamando una ambulancia ahora.",
        },
        {
          word_en: "dizzy",
          word_es: "mareado",
          example_en: "Is he dizzy or is he in pain?",
          example_es: "¿Está mareado o tiene dolor?",
        },
        {
          word_en: "stay with you",
          word_es: "quedarse con alguien",
          example_en: "I'll stay with you until they get here.",
          example_es: "Me quedo con usted hasta que lleguen.",
        },
      ],
    },
    {
      id: "g-013",
      level: "B1",
      listening: {
        audio_text: "Come on, man, just one more drink. The bar's closed but you can get me something, right?",
        options: [
          { emoji: "💧", text_es: "Ofrecerle agua y acompañarlo a su habitación", correct: true },
          { emoji: "🍺", text_es: "Conseguirle una bebida para evitar el problema", correct: false },
          { emoji: "🚶", text_es: "Dejarlo ahí y seguir con tu ronda", correct: false },
        ],
        explanation_es:
          "No es una emergencia, es un huésped tomado. Le ofreces agua, no discutes el tema del bar y lo acompañas a su cuarto. Dejarlo solo es como empiezan los accidentes.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "The bar's closed, my friend. Let me get you some water and walk you upstairs.",
        note_es:
          "“My friend” mantiene el tono de compañero, no de autoridad. Ofrecer algo concreto funciona mejor que repetir la negativa.",
      },
      vocabulary: [
        {
          word_en: "let me get you",
          word_es: "permítame traerle",
          example_en: "Let me get you a glass of water.",
          example_es: "Permítame traerle un vaso de agua.",
        },
        {
          word_en: "closed",
          word_es: "cerrado",
          example_en: "The bar is closed now, sir.",
          example_es: "El bar ya está cerrado, señor.",
        },
        {
          word_en: "upstairs",
          word_es: "arriba",
          example_en: "I can walk you upstairs.",
          example_es: "Puedo acompañarlo arriba.",
        },
      ],
    },
    {
      id: "g-014",
      level: "B1",
      listening: {
        audio_text: "Is this a drill? I'm not walking down twenty floors in a bathrobe.",
        options: [
          { emoji: "🧥", text_es: "Explicarle que todos tienen que bajar, conseguirle una cobija y llevarlo a la escalera", correct: true },
          { emoji: "⏳", text_es: "Decirle que espere en su cuarto mientras confirmas", correct: false },
          { emoji: "👕", text_es: "Esperar a que se cambie de ropa antes de bajar", correct: false },
        ],
        explanation_es:
          "Con la alarma activa nadie se queda en el piso y nadie espera a cambiarse. Reconoces la incomodidad, le consigues una cobija y lo llevas a la escalera y de ahí al punto de reunión.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry, sir, but everyone has to go down. I'll get you a blanket outside and walk down with you.",
        note_es:
          "Reconoces la molestia sin negociar la salida. La cobija le da algo concreto y hace que el “no” sea aceptable.",
      },
      vocabulary: [
        {
          word_en: "drill",
          word_es: "simulacro",
          example_en: "This is not a drill, sir.",
          example_es: "Esto no es un simulacro, señor.",
        },
        {
          word_en: "meeting point",
          word_es: "punto de reunión",
          example_en: "The meeting point is in the front parking lot.",
          example_es: "El punto de reunión es el estacionamiento de enfrente.",
        },
        {
          word_en: "blanket",
          word_es: "cobija",
          example_en: "I'll get you a blanket outside.",
          example_es: "Le consigo una cobija afuera.",
        },
      ],
    },
    {
      id: "g-015",
      level: "B1",
      listening: {
        audio_text: "There's a guy knocking on doors on my floor. He said he's maintenance but he's not wearing a uniform.",
        options: [
          { emoji: "🚶", text_es: "Subir de inmediato a verificar y acompañar al huésped a su habitación", correct: true },
          { emoji: "📋", text_es: "Anotar el reporte y revisarlo al terminar tu turno", correct: false },
          { emoji: "🤷", text_es: "Explicarle que seguramente es personal del hotel", correct: false },
        ],
        explanation_es:
          "El huésped detectó algo que no cuadra: alguien sin uniforme tocando puertas. Se verifica en el momento, no después, y el huésped no regresa solo al pasillo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Thank you for telling me. I'm going up right away. Let me walk you to your room.",
        note_es:
          "Agradecer primero valida lo que el huésped vio. Todo el personal trae uniforme, así que su duda era razonable y hay que tratarla así.",
      },
      vocabulary: [
        {
          word_en: "uniform",
          word_es: "uniforme",
          example_en: "All our staff wear a uniform.",
          example_es: "Todo nuestro personal usa uniforme.",
        },
        {
          word_en: "thank you for telling me",
          word_es: "gracias por avisarme",
          example_en: "Thank you for telling me, sir.",
          example_es: "Gracias por avisarme, señor.",
        },
        {
          word_en: "right away",
          word_es: "de inmediato",
          example_en: "I'm going up right away.",
          example_es: "Voy a subir de inmediato.",
        },
      ],
    },
    {
      id: "g-016",
      level: "B2",
      listening: {
        audio_text: "That's my dad. What happened? How long was he out, and was anyone with him?",
        options: [
          { emoji: "🚑", text_es: "Dar los tres datos en orden y llevar a la familia directo con él", correct: true },
          { emoji: "📄", text_es: "Ir a recepción por el registro del huésped", correct: false },
          { emoji: "🙋", text_es: "Buscar a alguien que hable mejor inglés que tú", correct: false },
        ],
        explanation_es:
          "La familia pregunta tres cosas: qué pasó, cuánto tiempo estuvo inconsciente y si alguien lo acompañó. Contestas en ese mismo orden y llevas a la familia con él, sin escalas.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "He collapsed by the pool ten minutes ago. He was unconscious for about a minute, and I've been with him ever since. This way, please.",
        note_es:
          "Contestas en el mismo orden en que te preguntaron y cierras con una sola frase para guiar. Bajo presión, la claridad vale más que la gramática perfecta.",
      },
      vocabulary: [
        {
          word_en: "unconscious",
          word_es: "inconsciente",
          example_en: "He was unconscious for about a minute.",
          example_es: "Estuvo inconsciente como un minuto.",
        },
        {
          word_en: "collapsed",
          word_es: "se desmayó",
          example_en: "The guest collapsed near the pool.",
          example_es: "El huésped se desmayó cerca de la alberca.",
        },
        {
          word_en: "this way",
          word_es: "por aquí",
          example_en: "This way, please. It's faster.",
          example_es: "Por aquí, por favor. Es más rápido.",
        },
      ],
    },
    {
      id: "g-017",
      level: "B2",
      listening: {
        audio_text: "Look, I'm his wife. I just need to know if he's in room 508. I've been flying for six hours.",
        options: [
          { emoji: "🔒", text_es: "Explicar que no puedes confirmar datos de huéspedes y ofrecer llamar a la habitación", correct: true },
          { emoji: "🪪", text_es: "Pedirle una identificación y confirmarle si el apellido coincide", correct: false },
          { emoji: "🗝️", text_es: "Confirmarle el número y acompañarla", correct: false },
        ],
        explanation_es:
          "No puedes confirmar si alguien se hospeda ni en qué cuarto, aunque la historia suene creíble y aunque el apellido coincida. Sí puedes ofrecer llamar a la habitación y dejar que esa persona decida.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry, ma'am. I'm not able to confirm that, but I can call the room and let them know you're here.",
        note_es:
          "“I'm not able to” señala una regla del hotel, no una decisión tuya en contra de ella. La alternativa deja la puerta abierta sin romper la privacidad.",
      },
      vocabulary: [
        {
          word_en: "confirm",
          word_es: "confirmar",
          example_en: "I'm not able to confirm that.",
          example_es: "No puedo confirmar eso.",
        },
        {
          word_en: "not able to",
          word_es: "no poder hacer algo",
          example_en: "I'm not able to do that, ma'am.",
          example_es: "No puedo hacer eso, señora.",
        },
        {
          word_en: "let them know",
          word_es: "avisarles",
          example_en: "I can call the room and let them know you're here.",
          example_es: "Puedo llamar a la habitación y avisarles que está aquí.",
        },
      ],
    },
    {
      id: "g-018",
      level: "B2",
      listening: {
        audio_text: "Who called a tow truck for my car? I want your name and your badge number. I'm going to sue this hotel.",
        options: [
          { emoji: "🤝", text_es: "Darle tu nombre, moverse a un lado y traer al gerente", correct: true },
          { emoji: "🧾", text_es: "Explicarle que él se estacionó mal y no es tu problema", correct: false },
          { emoji: "🤐", text_es: "No darle tu nombre hasta que se tranquilice", correct: false },
        ],
        explanation_es:
          "Está gritando frente a otros huéspedes. Le das tu nombre sin discutir, lo llevas a un lado y traes al gerente, que es quien resuelve el tema de la grúa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "My name is Luis, sir. Could we step over here? I'll get my manager and we'll look into it.",
        note_es:
          "Cambia “Luis” por tu nombre: darlo de inmediato le quita fuerza a la pelea. Y “could we step over here” saca la discusión del público sin pedirle que se calme.",
      },
      vocabulary: [
        {
          word_en: "tow truck",
          word_es: "grúa",
          example_en: "A tow truck moved the car this morning.",
          example_es: "Una grúa movió el coche esta mañana.",
        },
        {
          word_en: "step over here",
          word_es: "pasar hacia acá",
          example_en: "Could we step over here for a moment?",
          example_es: "¿Podemos pasar hacia acá un momento?",
        },
        {
          word_en: "look into",
          word_es: "revisar a fondo",
          example_en: "I'll look into it right now.",
          example_es: "Lo voy a revisar ahora mismo.",
        },
      ],
    },
    {
      id: "g-019",
      level: "B2",
      listening: {
        audio_text: "It's nothing, we're just talking. You can go now, everything's fine.",
        options: [
          { emoji: "🚪", text_es: "Pedir hablar un momento a solas con la otra persona y avisar a tu supervisor", correct: true },
          { emoji: "👋", text_es: "Retirarte porque el huésped dijo que todo está bien", correct: false },
          { emoji: "📣", text_es: "Entrar a la habitación a revisar", correct: false },
        ],
        explanation_es:
          "Alguien puede decir que todo está bien delante de la otra persona sin que sea cierto. Sin entrar ni acusar, pides hablar un momento a solas con la otra persona y le avisas a tu supervisor.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I understand, sir. I'd just like to make sure everyone's okay. Could I speak with her for a moment?",
        note_es:
          "“Make sure everyone's okay” explica tu presencia sin acusar a nadie. Nunca entras a la habitación: pides permiso, no exiges.",
      },
      vocabulary: [
        {
          word_en: "make sure",
          word_es: "asegurarse",
          example_en: "I just want to make sure everyone is okay.",
          example_es: "Solo quiero asegurarme de que todos estén bien.",
        },
        {
          word_en: "for a moment",
          word_es: "un momento",
          example_en: "Could I speak with you for a moment?",
          example_es: "¿Podría hablar con usted un momento?",
        },
        {
          word_en: "let my manager know",
          word_es: "avisarle a mi gerente",
          example_en: "I'll let my manager know right away.",
          example_es: "Le voy a avisar a mi gerente de inmediato.",
        },
      ],
    },
    {
      id: "g-020",
      level: "B2",
      listening: {
        audio_text: "Hi, I'm with the local press. Can you tell me what happened here last night? Just off the record.",
        options: [
          { emoji: "🗞️", text_es: "No comentar nada y remitirlo a la gerencia", correct: true },
          { emoji: "🎙️", text_es: "Contarle lo que viste si no da tu nombre", correct: false },
          { emoji: "📱", text_es: "Confirmarle solo lo que ya se dijo en redes", correct: false },
        ],
        explanation_es:
          "Nada es “off the record” para un empleado, y confirmar algo que ya circula sigue siendo confirmarlo. No comentas nada y lo mandas con la gerencia, que es quien habla por el hotel.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I can't comment on that, sir. Our management can speak with you. Let me take your name.",
        note_es:
          "“I can't comment on that” es una frase completa y educada que cierra el tema sin sonar grosero. Tomar su nombre te deja bien parado y le da algo con qué irse.",
      },
      vocabulary: [
        {
          word_en: "press",
          word_es: "prensa",
          example_en: "A reporter from the press is in the lobby.",
          example_es: "Un reportero de la prensa está en el lobby.",
        },
        {
          word_en: "comment",
          word_es: "comentar",
          example_en: "I can't comment on that.",
          example_es: "No puedo comentar sobre eso.",
        },
        {
          word_en: "management",
          word_es: "la gerencia",
          example_en: "Management will answer your questions.",
          example_es: "La gerencia responderá sus preguntas.",
        },
      ],
    },
  ],

  maintenance: [
    {
      id: "m-001",
      level: "A1",
      listening: {
        audio_text: "Oh, hi. Yes, come in. The light in the bathroom doesn't work.",
        options: [
          { emoji: "💡", text_es: "Cambiar el foco del baño", correct: true },
          { emoji: "🛏️", text_es: "Cambiar el foco de la lámpara del buró", correct: false },
          { emoji: "🚿", text_es: "Revisar la regadera del baño", correct: false },
        ],
        explanation_es:
          "El huésped te deja pasar y dice que la luz del baño no funciona. Lo correcto es entrar y cambiar el foco del baño, no el de otra lámpara.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Thank you. I'll change the light bulb right now.",
        note_es:
          "Decir “thank you” al entrar reconoce que te dieron permiso. “I'll change” avisa qué vas a hacer, así el huésped no se queda con la duda.",
      },
      vocabulary: [
        {
          word_en: "come in",
          word_es: "pasar, entrar",
          example_en: "May I come in? I'm from maintenance.",
          example_es: "¿Puedo pasar? Soy de mantenimiento.",
        },
        {
          word_en: "light bulb",
          word_es: "foco",
          example_en: "I'll change the light bulb in the bathroom.",
          example_es: "Voy a cambiar el foco del baño.",
        },
        {
          word_en: "doesn't work",
          word_es: "no funciona",
          example_en: "The light in the bathroom doesn't work.",
          example_es: "La luz del baño no funciona.",
        },
      ],
    },
    {
      id: "m-002",
      level: "A1",
      listening: {
        audio_text: "Hey. The TV won't turn on. Can you take a look?",
        options: [
          { emoji: "📺", text_es: "Revisar la televisión y el control", correct: true },
          { emoji: "📶", text_es: "Reiniciar el módem del wifi", correct: false },
          { emoji: "📞", text_es: "Reportar la televisión a recepción para que la cambien", correct: false },
        ],
        explanation_es:
          "El huésped dice que la tele no enciende y te pide que la veas. Primero revisa el control y la conexión del televisor tú mismo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "No problem. Let me check the TV and the remote control.",
        note_es:
          "“Let me check” suena tranquilo y profesional: dices que vas a revisar antes de prometer que ya quedó.",
      },
      vocabulary: [
        {
          word_en: "turn on",
          word_es: "encender",
          example_en: "I'll turn on the TV to check it.",
          example_es: "Voy a encender la televisión para revisarla.",
        },
        {
          word_en: "remote control",
          word_es: "control remoto",
          example_en: "The remote control needs new batteries.",
          example_es: "El control remoto necesita pilas nuevas.",
        },
        {
          word_en: "check",
          word_es: "revisar",
          example_en: "Let me check the cable behind the TV.",
          example_es: "Voy a revisar el cable de atrás de la televisión.",
        },
      ],
    },
    {
      id: "m-003",
      level: "A1",
      listening: {
        audio_text: "Good morning. There's no hot water in the shower.",
        options: [
          { emoji: "🔥", text_es: "Revisar el calentador de agua", correct: true },
          { emoji: "🚰", text_es: "Revisar el lavabo por una fuga", correct: false },
          { emoji: "🚿", text_es: "Cambiar la regadera por una nueva", correct: false },
        ],
        explanation_es:
          "No sale agua caliente en la regadera, así que el problema está en el calentador. Revísalo primero y avisa cuánto tiempo va a tardar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry. Let me check the water heater for you.",
        note_es:
          "Empezar con “I'm sorry” no es aceptar la culpa: en inglés es la forma normal de mostrar que el problema te importa.",
      },
      vocabulary: [
        {
          word_en: "hot water",
          word_es: "agua caliente",
          example_en: "There is no hot water in room 210.",
          example_es: "No hay agua caliente en la habitación 210.",
        },
        {
          word_en: "shower",
          word_es: "regadera",
          example_en: "The shower is working now.",
          example_es: "La regadera ya funciona.",
        },
        {
          word_en: "water heater",
          word_es: "calentador",
          example_en: "The water heater is on the roof.",
          example_es: "El calentador está en la azotea.",
        },
      ],
    },
    {
      id: "m-004",
      level: "A1",
      listening: {
        audio_text: "Excuse me. The air conditioning isn't cold. Can you fix it?",
        options: [
          { emoji: "❄️", text_es: "Revisar el aire acondicionado", correct: true },
          { emoji: "🌀", text_es: "Traer un ventilador a la habitación", correct: false },
          { emoji: "🪟", text_es: "Abrir la ventana para que entre aire", correct: false },
        ],
        explanation_es:
          "El huésped dice que el aire no enfría y te pide que lo arregles. La acción correcta es revisar el equipo antes de ofrecer cualquier otra cosa.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, of course. I'll check the air conditioning now.",
        note_es:
          "“Yes, of course” es más cálido que “OK”. Agregar “now” le da al huésped una idea clara de cuándo pasa algo.",
      },
      vocabulary: [
        {
          word_en: "air conditioning",
          word_es: "aire acondicionado",
          example_en: "The air conditioning is working now.",
          example_es: "El aire acondicionado ya está funcionando.",
        },
        {
          word_en: "cold",
          word_es: "frío",
          example_en: "The room will be cold in twenty minutes.",
          example_es: "La habitación va a estar fría en veinte minutos.",
        },
        {
          word_en: "fix",
          word_es: "arreglar",
          example_en: "I can fix it today.",
          example_es: "Lo puedo arreglar hoy.",
        },
      ],
    },
    {
      id: "m-005",
      level: "A1",
      listening: {
        audio_text: "Excuse me, are you finished in the bathroom? I need to get ready.",
        options: [
          { emoji: "⚠️", text_es: "Decirle que ya terminaste y avisarle que el piso está mojado", correct: true },
          { emoji: "🧽", text_es: "Pedirle veinte minutos más para terminar el trabajo", correct: false },
          { emoji: "🚻", text_es: "Mandarlo al baño del lobby mientras terminas", correct: false },
        ],
        explanation_es:
          "El huésped quiere entrar al baño donde acabas de trabajar y tú ya terminaste. Dile que sí y avisa del piso mojado para que nadie se resbale.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Yes, I'm finished. Please be careful — the floor is wet.",
        note_es:
          "“Please be careful” avisa sin sonar a orden. En inglés, “please” antes del verbo suaviza cualquier instrucción.",
      },
      vocabulary: [
        {
          word_en: "wet",
          word_es: "mojado",
          example_en: "The floor is still wet.",
          example_es: "El piso todavía está mojado.",
        },
        {
          word_en: "floor",
          word_es: "piso",
          example_en: "I will dry the floor in five minutes.",
          example_es: "Voy a secar el piso en cinco minutos.",
        },
        {
          word_en: "careful",
          word_es: "cuidado",
          example_en: "Please be careful, the floor is wet.",
          example_es: "Por favor, cuidado, el piso está mojado.",
        },
      ],
    },
    {
      id: "m-006",
      level: "A2",
      listening: {
        audio_text: "Sorry to bother you, but the toilet is blocked. It won't flush at all.",
        options: [
          { emoji: "🚽", text_es: "Destapar el inodoro y probar que descargue", correct: true },
          { emoji: "🧼", text_es: "Limpiar el baño y reponer el papel", correct: false },
          { emoji: "🚿", text_es: "Revisar el drenaje de la regadera", correct: false },
        ],
        explanation_es:
          "El inodoro está tapado y no descarga. Destápalo y prueba que funcione antes de salir del cuarto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry about that. I'll unblock it now — it'll take about ten minutes.",
        note_es:
          "Dar un tiempo aproximado (“about ten minutes”) tranquiliza más que decir solo “now”, porque el huésped puede planear su día.",
      },
      vocabulary: [
        {
          word_en: "toilet",
          word_es: "inodoro, escusado",
          example_en: "I need to check the toilet in room 512.",
          example_es: "Necesito revisar el inodoro de la habitación 512.",
        },
        {
          word_en: "blocked",
          word_es: "tapado",
          example_en: "The drain is blocked.",
          example_es: "El drenaje está tapado.",
        },
        {
          word_en: "flush",
          word_es: "descargar, jalarle",
          example_en: "It flushes normally now.",
          example_es: "Ya descarga normal.",
        },
      ],
    },
    {
      id: "m-007",
      level: "A2",
      listening: {
        audio_text: "The wifi keeps dropping. I typed the password twice and it still won't connect.",
        options: [
          { emoji: "📶", text_es: "Reiniciar el módem y probar la señal en el cuarto", correct: true },
          { emoji: "🔑", text_es: "Anotarle la contraseña otra vez en una tarjeta", correct: false },
          { emoji: "📺", text_es: "Revisar el cable de la televisión", correct: false },
        ],
        explanation_es:
          "La contraseña no es el problema: la conexión se cae sola. Reinicia el módem y comprueba la señal dentro de la habitación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Let me restart the router. It should work again in about five minutes.",
        note_es:
          "“It should work” promete menos que “it will work”, y eso te protege si la falla viene de la señal de todo el hotel.",
      },
      vocabulary: [
        {
          word_en: "router",
          word_es: "módem, router",
          example_en: "The router is behind the TV.",
          example_es: "El módem está detrás de la televisión.",
        },
        {
          word_en: "restart",
          word_es: "reiniciar",
          example_en: "I'm going to restart the router.",
          example_es: "Voy a reiniciar el módem.",
        },
        {
          word_en: "signal",
          word_es: "señal",
          example_en: "The signal is weak in this room.",
          example_es: "La señal está débil en esta habitación.",
        },
      ],
    },
    {
      id: "m-008",
      level: "A2",
      listening: {
        audio_text: "Sorry, I'm on a call with my family right now. Could you come back later?",
        options: [
          { emoji: "🕓", text_es: "Acordar una hora concreta para regresar", correct: true },
          { emoji: "🔧", text_es: "Entrar de todos modos porque es un trabajo rápido", correct: false },
          { emoji: "🚪", text_es: "Decirle que regresas más tarde sin fijar una hora", correct: false },
        ],
        explanation_es:
          "El huésped no está cancelando el servicio, solo pide un momento. Acuerda una hora concreta para volver y avísale a recepción.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Of course. I'll come back at four o'clock — does that work for you?",
        note_es:
          "Proponer una hora exacta evita el “más tarde” que nunca llega. La pregunta al final deja la decisión con el huésped.",
      },
      vocabulary: [
        {
          word_en: "come back",
          word_es: "regresar",
          example_en: "I'll come back after lunch.",
          example_es: "Regreso después de la comida.",
        },
        {
          word_en: "later",
          word_es: "más tarde",
          example_en: "I can come back later if you prefer.",
          example_es: "Puedo regresar más tarde si prefieres.",
        },
        {
          word_en: "work for you",
          word_es: "quedar bien, convenir",
          example_en: "Does four o'clock work for you?",
          example_es: "¿Te queda bien a las cuatro?",
        },
      ],
    },
    {
      id: "m-009",
      level: "A2",
      listening: {
        audio_text: "There's a loud noise coming from the bathroom fan at night. It woke me up twice.",
        options: [
          { emoji: "🌀", text_es: "Revisar y darle servicio al extractor del baño", correct: true },
          { emoji: "🔇", text_es: "Apagar el extractor y dejarlo apagado", correct: false },
          { emoji: "❄️", text_es: "Revisar el aire acondicionado del cuarto", correct: false },
        ],
        explanation_es:
          "El ruido viene del extractor del baño, no del aire. Dale servicio al motor y confirma con el huésped que ya quedó.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry you couldn't sleep. I'll fix the fan today, so it should be quiet tonight.",
        note_es:
          "Nombrar la molestia real (“you couldn't sleep”) vale más que una disculpa general. “It should be” promete el resultado sin exagerar.",
      },
      vocabulary: [
        {
          word_en: "noise",
          word_es: "ruido",
          example_en: "The noise comes from the fan, not the air conditioning.",
          example_es: "El ruido viene del extractor, no del aire acondicionado.",
        },
        {
          word_en: "fan",
          word_es: "ventilador, extractor",
          example_en: "I'll clean the fan in the bathroom.",
          example_es: "Voy a limpiar el extractor del baño.",
        },
        {
          word_en: "at night",
          word_es: "por la noche",
          example_en: "Does it only happen at night?",
          example_es: "¿Sólo pasa por la noche?",
        },
      ],
    },
    {
      id: "m-010",
      level: "A2",
      listening: {
        audio_text: "The curtain doesn't close all the way, so the sun comes in really early.",
        options: [
          { emoji: "🪟", text_es: "Reparar el riel de la cortina", correct: true },
          { emoji: "😴", text_es: "Ofrecerle un antifaz para dormir de recepción", correct: false },
          { emoji: "🧺", text_es: "Pedir que se lleven la cortina a lavar", correct: false },
        ],
        explanation_es:
          "La cortina se atora en el riel y por eso deja pasar la luz. Repara el riel para que cierre por completo.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I see. The rail is stuck — I'll repair it now so it closes completely.",
        note_es:
          "“I see” muestra que entendiste antes de actuar. Explicar la causa le da al huésped confianza en tu trabajo.",
      },
      vocabulary: [
        {
          word_en: "curtain",
          word_es: "cortina",
          example_en: "The curtain closes completely now.",
          example_es: "La cortina ya cierra por completo.",
        },
        {
          word_en: "curtain rail",
          word_es: "riel de la cortina",
          example_en: "I need to change the curtain rail.",
          example_es: "Necesito cambiar el riel de la cortina.",
        },
        {
          word_en: "stuck",
          word_es: "atorado",
          example_en: "The curtain is stuck on this side.",
          example_es: "La cortina está atorada de este lado.",
        },
      ],
    },
    {
      id: "m-011",
      level: "B1",
      listening: {
        audio_text: "There's water dripping from the ceiling onto the bed. I moved my bag, but it hasn't stopped.",
        options: [
          { emoji: "💧", text_es: "Cerrar el agua del cuarto de arriba y avisar a recepción", correct: true },
          { emoji: "🪣", text_es: "Poner una cubeta y seguir con los otros reportes", correct: false },
          { emoji: "🛏️", text_es: "Mover la cama al otro lado del cuarto", correct: false },
        ],
        explanation_es:
          "La fuga viene del piso de arriba, así que hay que cortar el agua ahí. Avisa a recepción para que ofrezcan otra habitación mientras reparas.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm very sorry. I'll stop the water upstairs, and I'll ask reception about another room for you.",
        note_es:
          "Dos acciones concretas en una sola frase: lo que haces tú y lo que pides a recepción. Nunca prometas el cambio de cuarto, solo di que lo vas a pedir.",
      },
      vocabulary: [
        {
          word_en: "leak",
          word_es: "fuga, gotera",
          example_en: "The leak is coming from the room above.",
          example_es: "La fuga viene de la habitación de arriba.",
        },
        {
          word_en: "ceiling",
          word_es: "techo",
          example_en: "There is water on the ceiling.",
          example_es: "Hay agua en el techo.",
        },
        {
          word_en: "drip",
          word_es: "gotear",
          example_en: "The water is still dripping.",
          example_es: "El agua sigue goteando.",
        },
      ],
    },
    {
      id: "m-012",
      level: "B1",
      listening: {
        audio_text: "So how long is this going to take? I've got calls all afternoon and I need that outlet for my laptop.",
        options: [
          { emoji: "🔌", text_es: "Explicar que la refacción llega mañana y traerle una extensión hoy", correct: true },
          { emoji: "⏱️", text_es: "Prometerle que quedará listo en una hora", correct: false },
          { emoji: "📞", text_es: "Mandarlo a recepción para que pidan cambio de habitación", correct: false },
        ],
        explanation_es:
          "El huésped necesita la verdad para planear su tarde. Dile cuándo llega la refacción y qué le puedes dar mientras tanto.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry — the part arrives tomorrow morning. Meanwhile, I can bring you an extension cord.",
        note_es:
          "Decir la fecha real evita un enojo mucho mayor mañana. “Meanwhile” demuestra que no lo dejas sin nada mientras llega la refacción.",
      },
      vocabulary: [
        {
          word_en: "part",
          word_es: "refacción, pieza",
          example_en: "We don't have that part in the hotel.",
          example_es: "No tenemos esa refacción en el hotel.",
        },
        {
          word_en: "outlet",
          word_es: "contacto, enchufe",
          example_en: "The outlet next to the desk isn't working.",
          example_es: "El contacto de junto al escritorio no funciona.",
        },
        {
          word_en: "meanwhile",
          word_es: "mientras tanto",
          example_en: "Meanwhile, I can bring you an extension cord.",
          example_es: "Mientras tanto, puedo traer una extensión.",
        },
      ],
    },
    {
      id: "m-013",
      level: "B1",
      listening: {
        audio_text: "The safe won't open and my passport's inside. I've tried the code three times.",
        options: [
          { emoji: "🔐", text_es: "Llamar al supervisor para abrirla con la llave maestra", correct: true },
          { emoji: "🔑", text_es: "Pedirle el código y seguir intentando tú", correct: false },
          { emoji: "🧾", text_es: "Mandarlo a recepción a levantar el reporte", correct: false },
        ],
        explanation_es:
          "Solo el supervisor puede abrir la caja fuerte con la llave maestra. Explica quién lo va a hacer y da un tiempo aproximado, porque el pasaporte adentro es urgente.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I understand. My supervisor has the master key and can open it in about ten minutes.",
        note_es:
          "“I understand” reconoce la urgencia sin prometer algo que no te toca. Nombrar quién resuelve y en cuánto tiempo baja la ansiedad.",
      },
      vocabulary: [
        {
          word_en: "safe",
          word_es: "caja fuerte",
          example_en: "The safe in the closet is not opening.",
          example_es: "La caja fuerte del clóset no está abriendo.",
        },
        {
          word_en: "master key",
          word_es: "llave maestra",
          example_en: "Only my supervisor has the master key.",
          example_es: "Sólo mi supervisor tiene la llave maestra.",
        },
        {
          word_en: "unlock",
          word_es: "abrir, desbloquear",
          example_en: "My supervisor can unlock it in ten minutes.",
          example_es: "Mi supervisor la puede abrir en diez minutos.",
        },
      ],
    },
    {
      id: "m-014",
      level: "B1",
      listening: {
        audio_text: "This room smells like paint. It's really strong and it's giving me a headache.",
        options: [
          { emoji: "🪟", text_es: "Ventilar el cuarto y avisar a recepción por si quiere cambiarse", correct: true },
          { emoji: "🌸", text_es: "Poner aromatizante para tapar el olor", correct: false },
          { emoji: "🎨", text_es: "Explicarle que el olor es normal y se quita solo", correct: false },
        ],
        explanation_es:
          "El olor a pintura fresca puede causar dolor de cabeza, así que ventilar es lo primero. Avisa a recepción por si el huésped prefiere otra habitación.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry about the smell. Let me air out the room, and I'll tell reception in case you'd prefer another one.",
        note_es:
          "Tapar el olor con aromatizante empeora el problema; ventilar lo resuelve. “In case you'd prefer” ofrece la opción sin prometer el cambio.",
      },
      vocabulary: [
        {
          word_en: "smell",
          word_es: "olor",
          example_en: "The smell will go away in a few hours.",
          example_es: "El olor se va a quitar en unas horas.",
        },
        {
          word_en: "paint",
          word_es: "pintura",
          example_en: "We painted this room yesterday.",
          example_es: "Pintamos esta habitación ayer.",
        },
        {
          word_en: "air out",
          word_es: "ventilar",
          example_en: "I'll open the windows to air out the room.",
          example_es: "Voy a abrir las ventanas para ventilar la habitación.",
        },
      ],
    },
    {
      id: "m-015",
      level: "B1",
      listening: {
        audio_text: "The door doesn't lock properly. I don't feel comfortable leaving my laptop in here.",
        options: [
          { emoji: "🔒", text_es: "Reparar la cerradura de inmediato y probarla frente al huésped", correct: true },
          { emoji: "🧳", text_es: "Ofrecerle guardar la laptop en la caja de recepción", correct: false },
          { emoji: "📝", text_es: "Anotar el reporte para el siguiente turno", correct: false },
        ],
        explanation_es:
          "Una puerta que no cierra bien es un tema de seguridad y no puede esperar al siguiente turno. Repárala y prueba la cerradura frente al huésped.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "You're right to tell us. I'll repair the lock right away, and I'll check it with you before I leave.",
        note_es:
          "“You're right to tell us” valida la preocupación sin admitir una negligencia del hotel. Probar la cerradura delante del huésped es lo que devuelve la confianza.",
      },
      vocabulary: [
        {
          word_en: "lock",
          word_es: "cerradura, cerrar con llave",
          example_en: "The lock is not closing well.",
          example_es: "La cerradura no cierra bien.",
        },
        {
          word_en: "repair",
          word_es: "reparar",
          example_en: "I can repair it right now.",
          example_es: "Lo puedo reparar ahora mismo.",
        },
        {
          word_en: "right away",
          word_es: "de inmediato",
          example_en: "I'll do it right away.",
          example_es: "Lo hago de inmediato.",
        },
      ],
    },
    {
      id: "m-016",
      level: "B2",
      listening: {
        audio_text: "Look, while you're in here — could you just disconnect the smoke detector? I only smoke by the window.",
        options: [
          { emoji: "🚭", text_es: "Explicar con calma que no puedes desconectarlo y ofrecer una alternativa", correct: true },
          { emoji: "🔧", text_es: "Desconectarlo porque el huésped lo pidió amablemente", correct: false },
          { emoji: "📞", text_es: "Reportarlo con seguridad sin comentárselo al huésped", correct: false },
        ],
        explanation_es:
          "Desconectar un detector de humo pone en riesgo a todo el piso y no es una decisión tuya. Dilo con respeto y ofrece el lugar donde sí se puede fumar.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I'm sorry, I can't disconnect it — it protects the whole floor. There's a smoking area outside, and I can show you where it is.",
        note_es:
          "“I can't” es más claro que “I don't think so” y no deja la puerta abierta a insistir. Ofrecer el área de fumar convierte el no en una salida para el huésped.",
      },
      vocabulary: [
        {
          word_en: "smoke detector",
          word_es: "detector de humo",
          example_en: "I can't turn off the smoke detector.",
          example_es: "No puedo apagar el detector de humo.",
        },
        {
          word_en: "not allowed",
          word_es: "no está permitido",
          example_en: "Smoking is not allowed in the rooms.",
          example_es: "No está permitido fumar en las habitaciones.",
        },
        {
          word_en: "smoking area",
          word_es: "área de fumar",
          example_en: "There's a smoking area outside.",
          example_es: "Hay un área de fumar afuera.",
        },
      ],
    },
    {
      id: "m-017",
      level: "B2",
      listening: {
        audio_text: "This is the third time someone's come up here and it's still not cold. I want to talk to a manager.",
        options: [
          { emoji: "🧊", text_es: "Reconocer la molestia, probar el equipo frente al huésped y llamar al gerente", correct: true },
          { emoji: "🙅", text_es: "Explicar que tus compañeros ya lo habían dejado bien", correct: false },
          { emoji: "📞", text_es: "Llamar al gerente y esperar afuera a que llegue", correct: false },
        ],
        explanation_es:
          "Después de tres visitas, el huésped necesita ver una prueba, no otra promesa. Reconoce la molestia, revisa el equipo delante de él y llama al gerente como lo pidió.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "You're right to be upset, and I'm sorry. Let me test it in front of you, and I'll have the manager come up either way.",
        note_es:
          "“You're right to be upset” desarma el enojo sin culpar a tus compañeros. “Either way” cumple lo que el huésped pidió aunque tú resuelvas la falla.",
      },
      vocabulary: [
        {
          word_en: "test",
          word_es: "probar",
          example_en: "I'm going to test it in front of you.",
          example_es: "Lo voy a probar aquí enfrente.",
        },
        {
          word_en: "manager",
          word_es: "gerente",
          example_en: "I'll ask the manager to come up.",
          example_es: "Voy a pedirle al gerente que suba.",
        },
        {
          word_en: "make sure",
          word_es: "asegurarse",
          example_en: "I want to make sure it's really working.",
          example_es: "Quiero asegurarme de que sí esté funcionando.",
        },
      ],
    },
    {
      id: "m-018",
      level: "B2",
      listening: {
        audio_text: "This might be nothing, but I keep smelling gas in the hallway. It comes and goes.",
        options: [
          { emoji: "🚨", text_es: "Tomarlo en serio, revisar el pasillo y avisar al supervisor en ese momento", correct: true },
          { emoji: "🤷", text_es: "Decirle que seguramente es olor de la cocina", correct: false },
          { emoji: "🪟", text_es: "Abrir una ventana del pasillo y seguir con tu trabajo", correct: false },
        ],
        explanation_es:
          "Un olor a gas nunca se descarta, aunque aparezca y desaparezca. Agradece el aviso, revisa el pasillo y reporta al supervisor de inmediato.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Thank you for telling me. I'm taking this seriously — I'll check the hallway and call my supervisor now.",
        note_es:
          "“Thank you for telling me” premia que el huésped avise en lugar de quedarse callado. Decir que lo tomas en serio evita que insista o que se asuste más.",
      },
      vocabulary: [
        {
          word_en: "hallway",
          word_es: "pasillo",
          example_en: "I'm going to check the hallway.",
          example_es: "Voy a revisar el pasillo.",
        },
        {
          word_en: "come and go",
          word_es: "aparecer y desaparecer",
          example_en: "The smell comes and goes.",
          example_es: "El olor aparece y desaparece.",
        },
        {
          word_en: "serious",
          word_es: "serio, grave",
          example_en: "This is serious, so I'm calling now.",
          example_es: "Esto es serio, por eso estoy llamando ahora.",
        },
      ],
    },
    {
      id: "m-019",
      level: "B2",
      listening: {
        audio_text: "I think I cracked the shower door when I leaned on it. Can we just not mention it to the front desk?",
        options: [
          { emoji: "🤝", text_es: "Explicar con calma que sí tienes que reportarlo y tranquilizarlo", correct: true },
          { emoji: "🤐", text_es: "Aceptar no decir nada y repararlo por tu cuenta", correct: false },
          { emoji: "💸", text_es: "Decirle que tendrá que pagar el daño completo", correct: false },
        ],
        explanation_es:
          "Reportar la falla es parte de tu trabajo y no significa acusar a nadie. Explica el proceso sin regañar y sin hablar de cobros, porque eso lo define recepción.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "Don't worry, these things happen. I do have to report it so it gets repaired, but reception will take care of it with you.",
        note_es:
          "“These things happen” quita la culpa sin mentir. Nunca hables de cargos: decidir si se cobra no es tu papel, y prometer que no se cobra te deja mal parado.",
      },
      vocabulary: [
        {
          word_en: "report",
          word_es: "reportar",
          example_en: "I have to report it so we can repair it.",
          example_es: "Tengo que reportarlo para que lo puedan reparar.",
        },
        {
          word_en: "cracked",
          word_es: "estrellado, cuarteado",
          example_en: "The shower door is cracked.",
          example_es: "La puerta de la regadera está estrellada.",
        },
        {
          word_en: "take care of it",
          word_es: "encargarse de ello",
          example_en: "Reception will take care of it.",
          example_es: "Recepción se va a encargar.",
        },
      ],
    },
    {
      id: "m-020",
      level: "B2",
      listening: {
        audio_text: "I'd rather you didn't come in today — I've got work papers everywhere. Can it wait until Friday?",
        options: [
          { emoji: "💧", text_es: "Explicar que el agua ya afecta el cuarto de abajo y pedir diez minutos con él presente", correct: true },
          { emoji: "📅", text_es: "Aceptar esperar hasta el viernes como lo pidió", correct: false },
          { emoji: "🔑", text_es: "Entrar con la llave maestra cuando el huésped salga", correct: false },
        ],
        explanation_es:
          "Respetar la privacidad es correcto, pero la fuga ya está dañando el cuarto de abajo. Explica por qué no puede esperar y ofrece entrar poco tiempo mientras él está presente.",
      },
      reinforce: {
        title_es: "Frase modelo",
        model_en: "I completely understand. The problem is the water is reaching the room downstairs — could I come in for ten minutes while you're here?",
        note_es:
          "Primero validas, después explicas la razón real y al final vuelves a pedir permiso. Pedir permiso aunque traigas llave maestra es lo que mantiene la confianza.",
      },
      vocabulary: [
        {
          word_en: "downstairs",
          word_es: "abajo, el piso de abajo",
          example_en: "The water is reaching the room downstairs.",
          example_es: "El agua está llegando a la habitación de abajo.",
        },
        {
          word_en: "damage",
          word_es: "dañar, daño",
          example_en: "It could damage the ceiling.",
          example_es: "Podría dañar el techo.",
        },
        {
          word_en: "get worse",
          word_es: "empeorar",
          example_en: "If we wait, it will get worse.",
          example_es: "Si esperamos, va a empeorar.",
        },
      ],
    },
  ],

};

/**
 * Pick today's drill for a given role and level. Strategy:
 *   - prefer drills that match the employee's current level
 *   - fall back to lower levels if no match
 *   - rotate by day-of-year so the same employee doesn't get the same
 *     drill twice in a row
 */
export function pickDrill(role: Role, level: "A1" | "A2" | "B1" | "B2"): Drill {
  // A role with no authored content yet falls back to frontdesk rather than
  // crashing — demo mode must always render something.
  const pool = DRILLS[role] ?? DRILLS.frontdesk ?? [];

  // Prefer same-level drills
  const sameLevel = pool.filter((d) => d.level === level);
  const fromPool = sameLevel.length > 0 ? sameLevel : pool;

  // Day-of-year rotation
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  return fromPool[dayOfYear % fromPool.length];
}

/** Display labels. Derived from the canonical role registry. */
export const ROLE_LABELS: Record<Role, string> = Object.fromEntries(
  ROLE_IDS.map((id) => [id, ROLES[id].label_es]),
) as Record<Role, string>;
