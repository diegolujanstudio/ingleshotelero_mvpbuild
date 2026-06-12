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

export type Role = "bellboy" | "frontdesk" | "restaurant";

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

export const DRILLS: Record<Role, Drill[]> = {
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
};

/**
 * Pick today's drill for a given role and level. Strategy:
 *   - prefer drills that match the employee's current level
 *   - fall back to lower levels if no match
 *   - rotate by day-of-year so the same employee doesn't get the same
 *     drill twice in a row
 */
export function pickDrill(role: Role, level: "A1" | "A2" | "B1" | "B2"): Drill {
  const pool = DRILLS[role];

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

export const ROLE_LABELS: Record<Role, string> = {
  bellboy: "Botones",
  frontdesk: "Recepción",
  restaurant: "Restaurante / Bar",
};
