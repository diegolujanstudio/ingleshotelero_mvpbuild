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
