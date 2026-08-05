/**
 * Shadowing dialogue content.
 *
 * One dialogue per role x CEFR level (8 roles x 4 levels = 32 scenes).
 * Guest lines are listened to; staff lines are the model the learner
 * shadows out loud. Every staff line is the exact phrasing we want the
 * learner to copy — warm-professional, never servile, never robotic.
 *
 * Level calibration:
 *   A1 — 4-8 word sentences, present tense, courtesy formulas
 *   A2 — simple past/future, two-clause sentences
 *   B1 — polite complaint handling, conditionals
 *   B2 — de-escalation of an upset guest, nuanced hedging
 *
 * Spanish glosses are natural es-MX renderings of meaning, not
 * word-by-word translations. Per Law 1 of the Metodo Turno, nothing
 * in this file scores or grades — these are models to imitate.
 */

import type { RoleModule } from "@/lib/supabase/types";

export interface DialogueLine {
  /** who speaks: guest lines are listened to; staff lines are shadowed */
  speaker: "guest" | "staff";
  en: string;
  /** natural Spanish gloss (es-MX), NOT literal word-by-word */
  es: string;
}

export interface Dialogue {
  id: string; // e.g. "dlg-frontdesk-a1"
  role: RoleModule;
  level: "A1" | "A2" | "B1" | "B2";
  /** scene title in Spanish, e.g. "Un huésped llega sin reservación" */
  title_es: string;
  /** one sentence of scene-setting in Spanish */
  scene_es: string;
  lines: DialogueLine[];
}

export const DIALOGUES: Dialogue[] = [
  // ── Bellboy ────────────────────────────────────────────────────────────
  {
    id: "dlg-bellboy-a1",
    role: "bellboy",
    level: "A1",
    title_es: "Un huésped llega con dos maletas",
    scene_es:
      "Una pareja llega al lobby después de un vuelo largo y necesita ayuda con su equipaje.",
    lines: [
      {
        speaker: "guest",
        en: "Hi! Can you help with our bags?",
        es: "El huésped saluda y pide ayuda con sus maletas.",
      },
      {
        speaker: "staff",
        en: "Of course. Welcome to the hotel.",
        es: "Se acepta con gusto y se le da la bienvenida.",
      },
      {
        speaker: "guest",
        en: "Thanks. We have two suitcases.",
        es: "Agradece y menciona que son dos maletas.",
      },
      {
        speaker: "staff",
        en: "No problem. Please follow me.",
        es: "Se confirma que no hay problema y se le pide que lo acompañe.",
      },
      {
        speaker: "guest",
        en: "Where is the elevator?",
        es: "Pregunta dónde está el elevador.",
      },
      {
        speaker: "staff",
        en: "The elevator is to your right.",
        es: "Se le indica que el elevador está a su derecha.",
      },
      {
        speaker: "guest",
        en: "Great. We're in room 512.",
        es: "Dice que su habitación es la 512.",
      },
      {
        speaker: "staff",
        en: "Room 512, fifth floor. This way, please.",
        es: "Se confirma la habitación y el piso, y se le muestra el camino.",
      },
    ],
  },
  {
    id: "dlg-bellboy-a2",
    role: "bellboy",
    level: "A2",
    title_es: "El huésped pregunta cómo llegar a la playa",
    scene_es:
      "Un huésped recién llegado quiere ir a la playa y pregunta por el camino y los horarios.",
    lines: [
      {
        speaker: "guest",
        en: "Excuse me, how do I get to the beach from here?",
        es: "Pregunta cómo llegar a la playa desde el hotel.",
      },
      {
        speaker: "staff",
        en: "It's very easy. Go through the garden and you'll see the beach gate.",
        es: "Se explica el camino: cruzar el jardín hasta la puerta de la playa.",
      },
      {
        speaker: "guest",
        en: "Is it far? We just arrived and we're pretty tired.",
        es: "Pregunta si queda lejos porque acaban de llegar cansados.",
      },
      {
        speaker: "staff",
        en: "Not at all. It's a five-minute walk, and there are chairs waiting for you.",
        es: "Se le tranquiliza: son cinco minutos a pie y hay camastros disponibles.",
      },
      {
        speaker: "guest",
        en: "Do we need to bring our own towels?",
        es: "Pregunta si deben llevar sus propias toallas.",
      },
      {
        speaker: "staff",
        en: "No, you'll find towels at the beach stand. Just show your room key.",
        es: "Se indica que hay toallas en el módulo de playa mostrando la llave de la habitación.",
      },
      {
        speaker: "guest",
        en: "Perfect. What time does the beach close?",
        es: "Pregunta a qué hora cierra la playa.",
      },
      {
        speaker: "staff",
        en: "The beach closes at seven, but the pool will stay open until ten.",
        es: "Se informa que la playa cierra a las siete y la alberca sigue abierta hasta las diez.",
      },
      {
        speaker: "guest",
        en: "Thanks so much for your help!",
        es: "Agradece la ayuda.",
      },
      {
        speaker: "staff",
        en: "My pleasure. Enjoy the beach!",
        es: "Se responde con gusto y se le desea que disfrute la playa.",
      },
    ],
  },
  {
    id: "dlg-bellboy-b1",
    role: "bellboy",
    level: "B1",
    title_es: "Una maleta no llegó a la habitación",
    scene_es:
      "Un huésped baja al lobby porque una de sus maletas no llegó a su habitación después del check-in.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, sorry to bother you, but one of our suitcases never made it to the room.",
        es: "Comenta que una de sus maletas no llegó a la habitación.",
      },
      {
        speaker: "staff",
        en: "I'm sorry about that. Could you tell me your room number and what the suitcase looks like?",
        es: "Se ofrece una disculpa y se piden el número de habitación y la descripción de la maleta.",
      },
      {
        speaker: "guest",
        en: "Room 728. It's a large blue one with a red ribbon on the handle.",
        es: "Da la habitación 728 y describe una maleta azul grande con un listón rojo.",
      },
      {
        speaker: "staff",
        en: "Thank you. If it arrived with this afternoon's group, it would still be in the luggage room. Let me check right now.",
        es: "Se agradece y se explica que si llegó con el grupo de la tarde debe seguir en el cuarto de equipaje; se revisa de inmediato.",
      },
      {
        speaker: "guest",
        en: "I'd appreciate that. My medication is in that bag.",
        es: "Lo agradece y menciona que su medicamento va en esa maleta.",
      },
      {
        speaker: "staff",
        en: "I understand — that's important. I'll make it my priority and bring it up myself.",
        es: "Se reconoce la importancia y se promete llevarla personalmente como prioridad.",
      },
      {
        speaker: "guest",
        en: "How long do you think it'll take?",
        es: "Pregunta cuánto tiempo tomará.",
      },
      {
        speaker: "staff",
        en: "No more than ten minutes. If I can't find it right away, I'll call your room to keep you updated.",
        es: "Se da un tiempo concreto de diez minutos y se ofrece llamar a la habitación si hay algún retraso.",
      },
      {
        speaker: "guest",
        en: "Thank you, that's a relief.",
        es: "Agradece, aliviado.",
      },
      {
        speaker: "staff",
        en: "Of course. I'll see you in a few minutes with your suitcase.",
        es: "Se confirma que en unos minutos estará en su puerta con la maleta.",
      },
    ],
  },
  {
    id: "dlg-bellboy-b2",
    role: "bellboy",
    level: "B2",
    title_es: "Un huésped molesto por la espera del equipaje",
    scene_es:
      "Un huésped lleva cuarenta minutos esperando su equipaje y baja al lobby visiblemente molesto.",
    lines: [
      {
        speaker: "guest",
        en: "This is ridiculous. We checked in forty minutes ago and our bags still aren't up. We have a dinner reservation!",
        es: "Reclama que llevan cuarenta minutos sin equipaje y tienen una reservación para cenar.",
      },
      {
        speaker: "staff",
        en: "You're absolutely right to be frustrated, and I apologize — forty minutes is too long. Let me fix this right now.",
        es: "Se valida su molestia, se ofrece una disculpa y se asume la solución de inmediato.",
      },
      {
        speaker: "guest",
        en: "The other bellboy said 'ten minutes' half an hour ago. I don't want another promise.",
        es: "Dice que ya le prometieron diez minutos hace media hora y no quiere otra promesa.",
      },
      {
        speaker: "staff",
        en: "I completely understand. What I can do is walk to the luggage room myself, right now, and bring your bags up personally. You're in which room?",
        es: "Se comprende y se ofrece una acción concreta: ir personalmente por las maletas en ese momento; se pregunta la habitación.",
      },
      {
        speaker: "guest",
        en: "Room 1104. We need to change for dinner and we're already late.",
        es: "Da la habitación 1104 y explica que van tarde a la cena.",
      },
      {
        speaker: "staff",
        en: "Then let's not lose another minute. While I get your bags, would it help if we asked the restaurant to hold your table?",
        es: "Se propone no perder tiempo y se ofrece pedir al restaurante que les guarde la mesa.",
      },
      {
        speaker: "guest",
        en: "Actually... yes. It's at Casa Mar, at eight.",
        es: "Acepta la ayuda: la reservación es en Casa Mar a las ocho.",
      },
      {
        speaker: "staff",
        en: "Consider it done. My colleague will call Casa Mar, and I'll be at your door with your luggage in under ten minutes — this time for real.",
        es: "Se confirma que un compañero llamará al restaurante y que las maletas llegarán en menos de diez minutos.",
      },
      {
        speaker: "guest",
        en: "Alright. Thank you for actually doing something about it.",
        es: "Se calma y agradece que por fin alguien resuelva.",
      },
      {
        speaker: "staff",
        en: "Thank you for your patience. This isn't the arrival we want for you, and I appreciate the chance to make it right.",
        es: "Se agradece la paciencia y se reconoce que esa no es la llegada que el hotel quiere ofrecer.",
      },
    ],
  },

  // ── Front desk ─────────────────────────────────────────────────────────
  {
    id: "dlg-frontdesk-a1",
    role: "frontdesk",
    level: "A1",
    title_es: "Un check-in sencillo",
    scene_es:
      "Un huésped llega a recepción con su reservación lista para hacer check-in.",
    lines: [
      {
        speaker: "guest",
        en: "Hello, I have a reservation.",
        es: "Saluda y dice que tiene una reservación.",
      },
      {
        speaker: "staff",
        en: "Welcome! Your name, please?",
        es: "Se le da la bienvenida y se le pide su nombre.",
      },
      {
        speaker: "guest",
        en: "It's Johnson. Mark Johnson.",
        es: "Da su nombre: Mark Johnson.",
      },
      {
        speaker: "staff",
        en: "Thank you. May I see your passport?",
        es: "Se agradece y se le pide su pasaporte.",
      },
      {
        speaker: "guest",
        en: "Sure, here you go.",
        es: "Entrega el pasaporte.",
      },
      {
        speaker: "staff",
        en: "Perfect. You are in room 305.",
        es: "Se confirma que su habitación es la 305.",
      },
      {
        speaker: "guest",
        en: "What time is breakfast?",
        es: "Pregunta el horario del desayuno.",
      },
      {
        speaker: "staff",
        en: "Breakfast is from seven to eleven. Enjoy your stay!",
        es: "Se informa que el desayuno es de siete a once y se le desea una feliz estancia.",
      },
    ],
  },
  {
    id: "dlg-frontdesk-a2",
    role: "frontdesk",
    level: "A2",
    title_es: "Un huésped llega sin reservación",
    scene_es:
      "Una viajera entra al lobby por la noche buscando habitación sin haber reservado.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, do you have any rooms available tonight? I didn't book anything.",
        es: "Pregunta si hay habitaciones disponibles esa noche; no reservó.",
      },
      {
        speaker: "staff",
        en: "Good evening! Let me check for you. How many nights will you stay?",
        es: "Se saluda, se ofrece revisar y se pregunta cuántas noches se quedará.",
      },
      {
        speaker: "guest",
        en: "Just two nights. It's only me.",
        es: "Serán dos noches, para una sola persona.",
      },
      {
        speaker: "staff",
        en: "You're in luck. We have a garden-view room for two thousand pesos per night.",
        es: "Se informa que hay una habitación con vista al jardín en dos mil pesos por noche.",
      },
      {
        speaker: "guest",
        en: "Does that include breakfast?",
        es: "Pregunta si el desayuno está incluido.",
      },
      {
        speaker: "staff",
        en: "Yes, it includes breakfast for one person every morning.",
        es: "Se confirma que incluye desayuno para una persona cada mañana.",
      },
      {
        speaker: "guest",
        en: "Sounds good. I'll take it.",
        es: "Acepta la habitación.",
      },
      {
        speaker: "staff",
        en: "Excellent. I'll just need your ID and a card for the deposit.",
        es: "Se piden una identificación y una tarjeta para el depósito.",
      },
      {
        speaker: "guest",
        en: "Here you go. What time is checkout?",
        es: "Entrega sus documentos y pregunta la hora del check-out.",
      },
      {
        speaker: "staff",
        en: "Checkout is at noon. Welcome, and rest well tonight.",
        es: "Se informa que el check-out es a mediodía y se le desea buen descanso.",
      },
    ],
  },
  {
    id: "dlg-frontdesk-b1",
    role: "frontdesk",
    level: "B1",
    title_es: "La habitación no es la que reservó",
    scene_es:
      "Un huésped regresa a recepción porque le dieron una habitación con dos camas cuando reservó una king.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, there's a problem with our room. We booked a king bed, but the room has two doubles.",
        es: "Explica que reservaron cama king pero la habitación tiene dos camas dobles.",
      },
      {
        speaker: "staff",
        en: "I'm sorry about the mix-up. Let me pull up your reservation and see what happened.",
        es: "Se ofrece una disculpa por la confusión y se revisa la reservación.",
      },
      {
        speaker: "guest",
        en: "It's our anniversary trip, so we'd really like the room we paid for.",
        es: "Menciona que es su viaje de aniversario y quieren la habitación que pagaron.",
      },
      {
        speaker: "staff",
        en: "Congratulations, and you're completely right. You did book a king room. If you can give me a moment, I'll find you one.",
        es: "Se felicita, se reconoce que tienen razón y se pide un momento para encontrar una habitación king.",
      },
      {
        speaker: "guest",
        en: "Sure. Would we have to move all our things again?",
        es: "Pregunta si tendrán que volver a mover todas sus cosas.",
      },
      {
        speaker: "staff",
        en: "Don't worry about that. If you'd like, the bellboy can move your luggage while you have a drink at the bar, on us.",
        es: "Se ofrece que el botones mueva el equipaje mientras toman algo en el bar por cortesía del hotel.",
      },
      {
        speaker: "guest",
        en: "That would be great, actually.",
        es: "Acepta la propuesta con gusto.",
      },
      {
        speaker: "staff",
        en: "Perfect. I have a king room on the ninth floor with an ocean view. Would that work for you?",
        es: "Se ofrece una habitación king en el piso nueve con vista al mar y se pregunta si les parece bien.",
      },
      {
        speaker: "guest",
        en: "An ocean view? Yes, absolutely!",
        es: "Acepta encantado la vista al mar.",
      },
      {
        speaker: "staff",
        en: "Wonderful. Here are your new keys, and happy anniversary from all of us.",
        es: "Se entregan las llaves nuevas y se les felicita por su aniversario de parte del equipo.",
      },
    ],
  },
  {
    id: "dlg-frontdesk-b2",
    role: "frontdesk",
    level: "B2",
    title_es: "Un cargo inesperado en el check-out",
    scene_es:
      "Durante el check-out, un huésped descubre cargos de minibar que asegura no haber consumido y sube el tono.",
    lines: [
      {
        speaker: "guest",
        en: "Hold on — what are these minibar charges? We didn't touch the minibar. This is eighty dollars for nothing!",
        es: "Reclama cargos de minibar por ochenta dólares que asegura no haber consumido.",
      },
      {
        speaker: "staff",
        en: "I hear you, and I'd be surprised by that too. Let me go through these charges with you line by line.",
        es: "Se valida su reacción y se ofrece revisar los cargos uno por uno.",
      },
      {
        speaker: "guest",
        en: "We were out on tours every single day. When exactly were we supposed to be drinking all this?",
        es: "Insiste: estuvieron en tours todos los días, no pudieron consumir eso.",
      },
      {
        speaker: "staff",
        en: "That's a fair point. These entries came from the automatic sensors, and honestly, they're sometimes triggered just by moving a bottle.",
        es: "Se reconoce el punto y se explica que los sensores automáticos a veces registran consumo con solo mover una botella.",
      },
      {
        speaker: "guest",
        en: "So we're being charged because your sensors don't work? That's not our problem.",
        es: "Responde molesto: no es su problema que los sensores fallen.",
      },
      {
        speaker: "staff",
        en: "You're right, it isn't. I completely understand, and what I can do is remove all the minibar charges right now while we verify with housekeeping.",
        es: "Se le da la razón y se ofrece retirar todos los cargos de minibar de inmediato mientras se verifica con ama de llaves.",
      },
      {
        speaker: "guest",
        en: "All of them? Just like that?",
        es: "Pregunta sorprendido si de verdad se retiran todos los cargos.",
      },
      {
        speaker: "staff",
        en: "Just like that. Your word matters more to us than a sensor. Here's your updated folio — would you mind confirming the total looks right now?",
        es: "Se confirma: su palabra vale más que un sensor; se entrega el estado de cuenta corregido para que confirme el total.",
      },
      {
        speaker: "guest",
        en: "Yes, this looks correct now. I appreciate you handling it without a fight.",
        es: "Confirma que el total es correcto y agradece que se resolviera sin discusión.",
      },
      {
        speaker: "staff",
        en: "Of course. Thank you for flagging it calmly — I hope the rest of your trip home is smooth, and we'd love to welcome you back.",
        es: "Se agradece la forma de plantearlo, se le desea buen viaje y se le invita a regresar.",
      },
    ],
  },

  // ── Restaurant / Bar ───────────────────────────────────────────────────
  {
    id: "dlg-restaurant-a1",
    role: "restaurant",
    level: "A1",
    title_es: "Tomar una orden sencilla",
    scene_es:
      "Una pareja se sienta a desayunar y el mesero toma su primera orden del día.",
    lines: [
      {
        speaker: "guest",
        en: "Good morning. A table for two, please.",
        es: "Pide una mesa para dos personas.",
      },
      {
        speaker: "staff",
        en: "Good morning! Right this way, please.",
        es: "Se saluda y se les guía a su mesa.",
      },
      {
        speaker: "guest",
        en: "Thank you. Can we see the menu?",
        es: "Agradece y pide ver el menú.",
      },
      {
        speaker: "staff",
        en: "Here you are. Would you like coffee?",
        es: "Se entrega el menú y se ofrece café.",
      },
      {
        speaker: "guest",
        en: "Yes, two coffees with milk.",
        es: "Pide dos cafés con leche.",
      },
      {
        speaker: "staff",
        en: "Two coffees with milk. Anything else?",
        es: "Se repite la orden y se pregunta si desean algo más.",
      },
      {
        speaker: "guest",
        en: "Two orders of eggs, please.",
        es: "Pide dos órdenes de huevos.",
      },
      {
        speaker: "staff",
        en: "Very good. Your food comes right away.",
        es: "Se confirma la orden y se avisa que la comida llega enseguida.",
      },
    ],
  },
  {
    id: "dlg-restaurant-a2",
    role: "restaurant",
    level: "A2",
    title_es: "Una alergia en la mesa",
    scene_es:
      "Un huésped pregunta por los ingredientes de un platillo porque es alérgico a los cacahuates.",
    lines: [
      {
        speaker: "guest",
        en: "Excuse me, does this chicken dish have peanuts? I'm allergic.",
        es: "Pregunta si el platillo de pollo lleva cacahuate porque es alérgico.",
      },
      {
        speaker: "staff",
        en: "Thank you for telling me. I'll check with the chef right now.",
        es: "Se agradece el aviso y se ofrece confirmar con el chef de inmediato.",
      },
      {
        speaker: "guest",
        en: "Thanks. Last time I had a reaction, it was pretty bad.",
        es: "Comenta que la última vez tuvo una reacción fuerte.",
      },
      {
        speaker: "staff",
        en: "I understand. We take allergies very seriously here. One moment, please.",
        es: "Se le asegura que las alergias se toman en serio y se pide un momento.",
      },
      {
        speaker: "guest",
        en: "Of course, take your time.",
        es: "Responde que no hay prisa.",
      },
      {
        speaker: "staff",
        en: "Good news — the chicken has no peanuts, but the sauce does. The chef will prepare it with a different sauce for you.",
        es: "Se informa que el pollo no lleva cacahuate pero la salsa sí, y que el chef lo preparará con otra salsa.",
      },
      {
        speaker: "guest",
        en: "That's perfect. Will it take much longer?",
        es: "Acepta y pregunta si tardará mucho más.",
      },
      {
        speaker: "staff",
        en: "Only five extra minutes. I'll also tell the kitchen to use clean utensils for your plate.",
        es: "Serán solo cinco minutos más y se avisará a la cocina que use utensilios limpios para su platillo.",
      },
      {
        speaker: "guest",
        en: "Wow, thank you for being so careful.",
        es: "Agradece el cuidado con que lo atienden.",
      },
      {
        speaker: "staff",
        en: "It's what we're here for. Your dish will be out soon.",
        es: "Se responde que para eso está el equipo y que su platillo saldrá pronto.",
      },
    ],
  },
  {
    id: "dlg-restaurant-b1",
    role: "restaurant",
    level: "B1",
    title_es: "Un platillo llegó frío",
    scene_es:
      "Un huésped llama al mesero porque su pasta llegó fría después de una espera larga.",
    lines: [
      {
        speaker: "guest",
        en: "Excuse me, I hate to complain, but this pasta is cold. We waited almost thirty minutes for it.",
        es: "Señala, apenado, que la pasta llegó fría tras casi treinta minutos de espera.",
      },
      {
        speaker: "staff",
        en: "Please, don't apologize — you're right to tell me. I'm sorry your dish arrived like this.",
        es: "Se le invita a no disculparse, se le da la razón y se ofrece una disculpa por el platillo.",
      },
      {
        speaker: "guest",
        en: "It's fine, these things happen. Could you just heat it up?",
        es: "Resta importancia y pide que solo lo calienten.",
      },
      {
        speaker: "staff",
        en: "If it were me, I'd want a fresh one. The kitchen will make you a new plate, and it won't take long — I'll make sure of it.",
        es: "Se propone algo mejor: un platillo nuevo recién hecho, con la promesa personal de que no tardará.",
      },
      {
        speaker: "guest",
        en: "Well, if it's not too much trouble, that would be great.",
        es: "Acepta el platillo nuevo si no es molestia.",
      },
      {
        speaker: "staff",
        en: "No trouble at all. While you wait, would you like something from the bar? It's on the house.",
        es: "Se confirma que no es molestia y se ofrece una bebida por cortesía de la casa mientras espera.",
      },
      {
        speaker: "guest",
        en: "A glass of white wine would be lovely, thank you.",
        es: "Acepta una copa de vino blanco.",
      },
      {
        speaker: "staff",
        en: "Coming right up. And your new pasta will be out in about ten minutes, hot this time.",
        es: "Se confirma el vino y que la pasta nueva saldrá en unos diez minutos, caliente.",
      },
      {
        speaker: "guest",
        en: "Thank you for handling it so nicely.",
        es: "Agradece la buena atención.",
      },
      {
        speaker: "staff",
        en: "Thank you for your patience. Enjoy your wine — I'll be right back with your dish.",
        es: "Se agradece su paciencia y se le invita a disfrutar el vino mientras llega su platillo.",
      },
    ],
  },
  {
    id: "dlg-restaurant-b2",
    role: "restaurant",
    level: "B2",
    title_es: "Una cuenta disputada al final de la cena",
    scene_es:
      "Al pedir la cuenta, un huésped molesto asegura que le cobraron botellas de vino que no ordenó.",
    lines: [
      {
        speaker: "guest",
        en: "Excuse me, this bill can't be right. You've charged us for three bottles of wine and we ordered one. One!",
        es: "Reclama que la cuenta incluye tres botellas de vino cuando solo ordenaron una.",
      },
      {
        speaker: "staff",
        en: "Let me look at that with you right away — if there's a mistake, we'll correct it before you pay a single peso.",
        es: "Se ofrece revisar la cuenta juntos y corregir cualquier error antes de que pague.",
      },
      {
        speaker: "guest",
        en: "We've been coming to this hotel for years and this has never happened. It's honestly disappointing.",
        es: "Dice que llevan años viniendo al hotel y que esto nunca había pasado; está decepcionado.",
      },
      {
        speaker: "staff",
        en: "I completely understand, and I'd feel the same way. Give me one moment — I'm checking the table orders against the kitchen system.",
        es: "Se comprende su molestia y se revisa la cuenta contra el sistema de cocina.",
      },
      {
        speaker: "guest",
        en: "We had the Malbec with dinner. That's it. Nothing else.",
        es: "Precisa que solo tomaron el Malbec con la cena, nada más.",
      },
      {
        speaker: "staff",
        en: "You're absolutely right — the other two bottles belong to table twelve. The error was ours, and I've already removed them from your bill.",
        es: "Se confirma que tiene razón: las otras botellas eran de la mesa doce; el error ya quedó corregido.",
      },
      {
        speaker: "guest",
        en: "Well... alright. I'm glad it was just a mistake, but it shouldn't have happened.",
        es: "Se calma, aunque insiste en que no debió pasar.",
      },
      {
        speaker: "staff",
        en: "You're right, it shouldn't have. What I can do is take care of your desserts tonight, as a small way of saying thank you for your patience — and your loyalty.",
        es: "Se le da la razón y se ofrecen los postres por cuenta de la casa en agradecimiento a su paciencia y lealtad.",
      },
      {
        speaker: "guest",
        en: "That's very kind. Thank you for fixing it so quickly.",
        es: "Agradece el gesto y la rapidez de la solución.",
      },
      {
        speaker: "staff",
        en: "It's the least we can do. Here's your corrected bill, and we hope to see you both again very soon.",
        es: "Se entrega la cuenta corregida y se les invita a volver pronto.",
      },
    ],
  },

  // ── Housekeeping ───────────────────────────────────────────────────────
  {
    id: "dlg-housekeeping-a1",
    role: "housekeeping",
    level: "A1",
    title_es: "El huésped pide toallas extra",
    scene_es:
      "Una huésped abre la puerta de su habitación y pide más toallas a la camarista en el pasillo.",
    lines: [
      {
        speaker: "guest",
        en: "Hi! Can we get more towels?",
        es: "Pide más toallas para su habitación.",
      },
      {
        speaker: "staff",
        en: "Of course. How many towels do you need?",
        es: "Se acepta con gusto y se pregunta cuántas toallas necesita.",
      },
      {
        speaker: "guest",
        en: "Two big ones, please.",
        es: "Pide dos toallas grandes.",
      },
      {
        speaker: "staff",
        en: "Two bath towels. I'll bring them now.",
        es: "Se confirma la cantidad y se avisa que se llevan en ese momento.",
      },
      {
        speaker: "guest",
        en: "Also, we need more water bottles.",
        es: "Pide también más botellas de agua.",
      },
      {
        speaker: "staff",
        en: "No problem. Two waters as well?",
        es: "Se confirma sin problema y se pregunta si son dos aguas.",
      },
      {
        speaker: "guest",
        en: "Yes, perfect. Thank you!",
        es: "Confirma y agradece.",
      },
      {
        speaker: "staff",
        en: "You're welcome. Five minutes, please.",
        es: "Se responde con gusto y se avisa que tardará cinco minutos.",
      },
    ],
  },
  {
    id: "dlg-housekeeping-a2",
    role: "housekeeping",
    level: "A2",
    title_es: "El letrero de no molestar",
    scene_es:
      "La camarista encuentra al huésped saliendo de una habitación que tuvo el letrero de no molestar todo el día.",
    lines: [
      {
        speaker: "guest",
        en: "Oh, hi. I guess you couldn't clean our room today?",
        es: "Supone que no pudieron limpiar su habitación ese día.",
      },
      {
        speaker: "staff",
        en: "Good afternoon! The 'do not disturb' sign was on the door, so we didn't want to bother you.",
        es: "Se explica que el letrero de no molestar estaba puesto y no quisieron interrumpir.",
      },
      {
        speaker: "guest",
        en: "Right, my husband was sleeping. He worked the night shift before our flight.",
        es: "Explica que su esposo dormía después de trabajar un turno de noche.",
      },
      {
        speaker: "staff",
        en: "I understand. Would you like me to clean the room now, or later today?",
        es: "Se comprende y se ofrece limpiar la habitación en ese momento o más tarde.",
      },
      {
        speaker: "guest",
        en: "We're going to dinner at seven. Could you come then?",
        es: "Saldrán a cenar a las siete y pide que vayan a esa hora.",
      },
      {
        speaker: "staff",
        en: "Of course. I'll come at seven and leave everything fresh for tonight.",
        es: "Se confirma que a las siete se dejará todo limpio para la noche.",
      },
      {
        speaker: "guest",
        en: "Could you also change the sheets, please?",
        es: "Pide que también cambien las sábanas.",
      },
      {
        speaker: "staff",
        en: "Yes, I'll change the sheets and bring fresh towels too. Enjoy your dinner!",
        es: "Se confirma el cambio de sábanas y toallas limpias, y se les desea buena cena.",
      },
    ],
  },
  {
    id: "dlg-housekeeping-b1",
    role: "housekeeping",
    level: "B1",
    title_es: "Un objeto olvidado en la habitación",
    scene_es:
      "Un huésped detiene a la camarista en el pasillo porque no encuentra el cargador de su teléfono y teme que se lo llevaran con la limpieza.",
    lines: [
      {
        speaker: "guest",
        en: "Excuse me, did anyone find a phone charger in room 416? It was on the nightstand this morning and now it's gone.",
        es: "Pregunta si encontraron un cargador en la 416; estaba en el buró y ya no aparece.",
      },
      {
        speaker: "staff",
        en: "Let me help you with that. I cleaned that room today, so if I had found it, it would be in our lost and found.",
        es: "Se ofrece ayuda: ella limpió esa habitación y cualquier objeto encontrado estaría en objetos perdidos.",
      },
      {
        speaker: "guest",
        en: "Hmm. I really hope it didn't get thrown away with something.",
        es: "Teme que se haya ido a la basura por accidente.",
      },
      {
        speaker: "staff",
        en: "I'm careful with cables because this happens often — sometimes they slide behind the nightstand. Would you like me to check the room with you?",
        es: "Se explica que los cables suelen caerse detrás del buró y se ofrece revisar la habitación juntos.",
      },
      {
        speaker: "guest",
        en: "Yes, please. I'd feel better if we looked together.",
        es: "Acepta buscar juntos.",
      },
      {
        speaker: "staff",
        en: "Of course. And if we don't find it there, I'll call lost and found while you wait, so you don't have to chase anyone.",
        es: "Se confirma y, si no aparece, ella misma llamará a objetos perdidos para que el huésped no tenga que hacer trámites.",
      },
      {
        speaker: "guest",
        en: "Oh wait — there it is, behind the curtain! I must have knocked it down.",
        es: "Encuentra el cargador detrás de la cortina; él mismo lo tiró.",
      },
      {
        speaker: "staff",
        en: "I'm glad it appeared! If you ever miss anything else, just call housekeeping and we'll look right away.",
        es: "Se celebra el hallazgo y se le recuerda que puede llamar a ama de llaves si algo más llegara a faltar.",
      },
    ],
  },
  {
    id: "dlg-housekeeping-b2",
    role: "housekeeping",
    level: "B2",
    title_es: "Una huésped molesta por entrar a limpiar",
    scene_es:
      "Una huésped regresa a su habitación mientras la están limpiando y reacciona molesta porque siente invadida su privacidad.",
    lines: [
      {
        speaker: "guest",
        en: "What are you doing in my room? I didn't ask for cleaning right now — my things are everywhere and this feels really invasive.",
        es: "Reclama que entraron a limpiar sin que lo pidiera y siente invadida su privacidad.",
      },
      {
        speaker: "staff",
        en: "I'm so sorry for startling you. The room was on our morning schedule, but you're completely right — this is your space, and your comfort comes first.",
        es: "Se ofrece una disculpa por el susto, se explica el horario programado y se reconoce que su comodidad es primero.",
      },
      {
        speaker: "guest",
        en: "I have work documents on the desk. I don't want anyone touching them, or my laptop.",
        es: "Explica que tiene documentos de trabajo y no quiere que nadie toque sus cosas ni su laptop.",
      },
      {
        speaker: "staff",
        en: "I understand completely, and I want to reassure you — we never move personal documents or electronics. But if you'd prefer, I can stop right now and come back another time.",
        es: "Se le asegura que nunca se mueven documentos ni electrónicos personales, y se ofrece detener la limpieza y volver después.",
      },
      {
        speaker: "guest",
        en: "I just don't like people in my room when I'm not here. It makes me uncomfortable.",
        es: "Insiste en que le incomoda que entren cuando ella no está.",
      },
      {
        speaker: "staff",
        en: "That's a completely fair request. What I can do is note in our system that we only clean your room when you request it. You set the schedule, not us.",
        es: "Se acepta como una petición razonable y se ofrece registrar que su habitación solo se limpie cuando ella lo pida.",
      },
      {
        speaker: "guest",
        en: "You can do that? That would honestly make my whole stay better.",
        es: "Pregunta sorprendida si eso es posible; le mejoraría toda la estancia.",
      },
      {
        speaker: "staff",
        en: "Consider it done. Just call housekeeping whenever you'd like service, and I'll leave extra towels and water by the door each morning so you're never without anything.",
        es: "Se confirma el arreglo y se ofrece dejar toallas y agua en la puerta cada mañana para que no le falte nada.",
      },
      {
        speaker: "guest",
        en: "Thank you. I'm sorry I snapped at you — it wasn't about you.",
        es: "Agradece y se disculpa por haber reaccionado mal.",
      },
      {
        speaker: "staff",
        en: "No apology needed — you were protecting your space, and I respect that. I'll finish up in two minutes and leave you to your work.",
        es: "Se le dice que no necesita disculparse, se respeta su espacio y se termina en dos minutos para dejarla trabajar.",
      },
    ],
  },

  // ── Concierge ──────────────────────────────────────────────────────────
  {
    id: "dlg-concierge-a1",
    role: "concierge",
    level: "A1",
    title_es: "Recomendar un restaurante cercano",
    scene_es:
      "Un huésped se acerca al concierge buscando dónde cenar cerca del hotel.",
    lines: [
      {
        speaker: "guest",
        en: "Hi! Where can we eat tonight?",
        es: "Pregunta dónde pueden cenar esa noche.",
      },
      {
        speaker: "staff",
        en: "Good evening! Do you like Mexican food?",
        es: "Se saluda y se pregunta si les gusta la comida mexicana.",
      },
      {
        speaker: "guest",
        en: "Yes, we love tacos!",
        es: "Responde que les encantan los tacos.",
      },
      {
        speaker: "staff",
        en: "Perfect. La Palapa is very good. It is close.",
        es: "Se recomienda La Palapa, un lugar muy bueno y cercano.",
      },
      {
        speaker: "guest",
        en: "How do we get there?",
        es: "Pregunta cómo llegar.",
      },
      {
        speaker: "staff",
        en: "It is two blocks from here. Turn left outside.",
        es: "Se indica que está a dos cuadras, girando a la izquierda al salir.",
      },
      {
        speaker: "guest",
        en: "Great! Do we need a reservation?",
        es: "Pregunta si necesitan reservación.",
      },
      {
        speaker: "staff",
        en: "No, but go before eight. Enjoy your tacos!",
        es: "Se recomienda llegar antes de las ocho y se les desea provecho.",
      },
    ],
  },
  {
    id: "dlg-concierge-a2",
    role: "concierge",
    level: "A2",
    title_es: "Reservar un tour a las ruinas",
    scene_es:
      "Una familia quiere visitar las ruinas mayas y pide ayuda al concierge para reservar un tour.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, we'd like to visit the Mayan ruins tomorrow. Can you help us book a tour?",
        es: "Quieren visitar las ruinas mayas mañana y piden ayuda para reservar un tour.",
      },
      {
        speaker: "staff",
        en: "With pleasure! We have two options: a morning tour at eight, or an afternoon tour at one.",
        es: "Se ofrecen dos opciones: tour matutino a las ocho o vespertino a la una.",
      },
      {
        speaker: "guest",
        en: "Which one do you recommend? We have two kids.",
        es: "Pregunta cuál recomienda; viajan con dos niños.",
      },
      {
        speaker: "staff",
        en: "The morning tour is better for kids. It will be cooler, and you'll return before three.",
        es: "Se recomienda el de la mañana: hace menos calor y regresarán antes de las tres.",
      },
      {
        speaker: "guest",
        en: "Sounds good. How much does it cost?",
        es: "Acepta la sugerencia y pregunta el precio.",
      },
      {
        speaker: "staff",
        en: "It's ninety dollars per adult and kids pay half. The bus will pick you up right here at the lobby.",
        es: "Cuesta noventa dólares por adulto, los niños pagan la mitad, y el camión los recoge en el lobby.",
      },
      {
        speaker: "guest",
        en: "Perfect, book it for the four of us, please.",
        es: "Pide reservar para los cuatro.",
      },
      {
        speaker: "staff",
        en: "Done! Tomorrow at eight, here in the lobby. Bring hats and water — it will be a beautiful day.",
        es: "Queda reservado para mañana a las ocho en el lobby; se recomienda llevar gorras y agua.",
      },
    ],
  },
  {
    id: "dlg-concierge-b1",
    role: "concierge",
    level: "B1",
    title_es: "Rescatar una cena de aniversario sin reservación",
    scene_es:
      "Un huésped quiere cenar en el restaurante más solicitado de la zona esta misma noche, sin reservación.",
    lines: [
      {
        speaker: "guest",
        en: "I know it's last minute, but is there any way to get a table at Mar Abierto tonight? It's our anniversary.",
        es: "Pregunta si es posible conseguir mesa en Mar Abierto esa noche; es su aniversario.",
      },
      {
        speaker: "staff",
        en: "Happy anniversary! Mar Abierto fills up fast, but let me call them — I know the manager, and they sometimes hold a table or two.",
        es: "Se felicita y se ofrece llamar al restaurante; el concierge conoce al gerente y a veces guardan mesas.",
      },
      {
        speaker: "guest",
        en: "That would be amazing. We tried booking online and everything was full.",
        es: "Agradece; en línea todo aparecía lleno.",
      },
      {
        speaker: "staff",
        en: "Give me two minutes. If they can't take you, I have a backup that I'd argue is even more romantic.",
        es: "Se piden dos minutos y se adelanta que hay un plan B incluso más romántico.",
      },
      {
        speaker: "guest",
        en: "Now I'm curious about the backup!",
        es: "Responde con curiosidad por la alternativa.",
      },
      {
        speaker: "staff",
        en: "Good news — they can seat you at nine, on the terrace. If that's too late, the backup would be a private beach dinner here at the hotel.",
        es: "Hay mesa a las nueve en la terraza; si es muy tarde, la alternativa es una cena privada en la playa del hotel.",
      },
      {
        speaker: "guest",
        en: "Nine on the terrace sounds perfect. Could you arrange a taxi too?",
        es: "Acepta la mesa de las nueve y pide también un taxi.",
      },
      {
        speaker: "staff",
        en: "Of course. Your taxi will be here at eight thirty, and I'll ask the restaurant to have something special ready for the toast.",
        es: "El taxi llegará a las ocho y media, y se pedirá al restaurante un detalle especial para el brindis.",
      },
      {
        speaker: "guest",
        en: "You've saved our anniversary. Thank you so much.",
        es: "Agradece; salvó su aniversario.",
      },
      {
        speaker: "staff",
        en: "It's my pleasure. Have a wonderful evening, and tell me all about it tomorrow.",
        es: "Se responde con gusto y se les desea una gran velada.",
      },
    ],
  },
  {
    id: "dlg-concierge-b2",
    role: "concierge",
    level: "B2",
    title_es: "Un tour cancelado arruina el último día",
    scene_es:
      "El operador canceló el tour de esnórquel del último día y el huésped llega al escritorio del concierge muy molesto.",
    lines: [
      {
        speaker: "guest",
        en: "The snorkeling tour just got cancelled — on our last day! We planned this whole trip around it. This is unacceptable.",
        es: "Reclama que cancelaron el tour de esnórquel de su último día, el plan central de su viaje.",
      },
      {
        speaker: "staff",
        en: "I completely understand your frustration — that was the highlight of your trip, and losing it on your last day is genuinely upsetting. Let me see what I can rescue.",
        es: "Se valida su frustración: era lo más importante del viaje; se ofrece rescatar el plan.",
      },
      {
        speaker: "guest",
        en: "The operator just sent a text. No explanation, no alternative, nothing.",
        es: "El operador solo mandó un mensaje, sin explicación ni alternativa.",
      },
      {
        speaker: "staff",
        en: "That's not how it should be handled, and I'll be raising it with them directly. In the meantime, what I can do is check two other operators we trust — one of them runs an afternoon reef trip.",
        es: "Se reconoce el mal manejo, se hablará con el operador, y se revisarán dos operadores de confianza, uno con salida vespertina al arrecife.",
      },
      {
        speaker: "guest",
        en: "Our flight is tomorrow at ten in the morning. Would an afternoon trip even work?",
        es: "Duda: su vuelo sale mañana a las diez de la mañana.",
      },
      {
        speaker: "staff",
        en: "It would — the boat returns by six, which leaves your evening free to pack. And given the circumstances, I'd suggest we ask the original operator to cover the price difference.",
        es: "Sí funciona: el barco vuelve a las seis; además se pedirá al operador original cubrir la diferencia de precio.",
      },
      {
        speaker: "guest",
        en: "If you can pull that off, you'll have completely turned this day around.",
        es: "Si lo logra, habrá salvado el día por completo.",
      },
      {
        speaker: "staff",
        en: "Then let's make it happen. Give me fifteen minutes to confirm everything, and I'll call your room with the details — including the refund.",
        es: "Se piden quince minutos para confirmar todo y se llamará a su habitación con los detalles, incluido el reembolso.",
      },
      {
        speaker: "guest",
        en: "Thank you. I'm sorry I came in so hot — it's just that we'd been looking forward to it for months.",
        es: "Agradece y se disculpa por llegar alterado; llevaban meses esperando ese tour.",
      },
      {
        speaker: "staff",
        en: "No need to apologize — you cared about your trip, and so do we. Go enjoy the pool, and leave the rest to me.",
        es: "Se le dice que no hay nada que disculpar y se le invita a disfrutar la alberca mientras el concierge resuelve.",
      },
    ],
  },

  // ── Spa ────────────────────────────────────────────────────────────────
  {
    id: "dlg-spa-a1",
    role: "spa",
    level: "A1",
    title_es: "Agendar un masaje",
    scene_es:
      "Una huésped entra al spa para agendar un masaje esa misma tarde.",
    lines: [
      {
        speaker: "guest",
        en: "Hello! I want a massage today.",
        es: "Quiere agendar un masaje ese mismo día.",
      },
      {
        speaker: "staff",
        en: "Welcome! We have space at four o'clock.",
        es: "Se le da la bienvenida y se ofrece un espacio a las cuatro.",
      },
      {
        speaker: "guest",
        en: "Four is good. How long is it?",
        es: "Acepta la hora y pregunta la duración.",
      },
      {
        speaker: "staff",
        en: "The massage is fifty minutes.",
        es: "Se informa que el masaje dura cincuenta minutos.",
      },
      {
        speaker: "guest",
        en: "Perfect. How much is it?",
        es: "Pregunta el precio.",
      },
      {
        speaker: "staff",
        en: "It is ninety dollars. You can charge it to your room.",
        es: "Cuesta noventa dólares y puede cargarse a la habitación.",
      },
      {
        speaker: "guest",
        en: "Great. My room is 210.",
        es: "Acepta y da su número de habitación, la 210.",
      },
      {
        speaker: "staff",
        en: "Thank you. Please come ten minutes early. See you at four!",
        es: "Se agradece y se le pide llegar diez minutos antes de su cita.",
      },
    ],
  },
  {
    id: "dlg-spa-a2",
    role: "spa",
    level: "A2",
    title_es: "Preguntas antes de un facial",
    scene_es:
      "Un huésped llega a su cita de facial y la recepcionista del spa hace las preguntas de rutina antes del tratamiento.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, I have a facial at three. I booked it yesterday.",
        es: "Llega a su cita de facial de las tres, reservada el día anterior.",
      },
      {
        speaker: "staff",
        en: "Welcome! Before we start, I'll ask you a few quick questions, okay?",
        es: "Se le da la bienvenida y se avisa que se harán unas preguntas rápidas antes de empezar.",
      },
      {
        speaker: "guest",
        en: "Sure, go ahead.",
        es: "Acepta responder.",
      },
      {
        speaker: "staff",
        en: "Do you have any allergies to creams, oils, or perfumes?",
        es: "Se pregunta si tiene alergias a cremas, aceites o perfumes.",
      },
      {
        speaker: "guest",
        en: "Yes, actually. Last year I had a reaction to a product with coconut.",
        es: "Responde que el año pasado tuvo una reacción a un producto con coco.",
      },
      {
        speaker: "staff",
        en: "Thank you for telling me. We'll use our coconut-free line, and your therapist will test it on your arm first.",
        es: "Se agradece el aviso: se usará la línea sin coco y la terapeuta hará primero una prueba en el brazo.",
      },
      {
        speaker: "guest",
        en: "That's very thorough. Anything else I should know?",
        es: "Agradece el cuidado y pregunta si debe saber algo más.",
      },
      {
        speaker: "staff",
        en: "Just relax and drink water after your treatment. Your therapist will come for you in five minutes.",
        es: "Solo relajarse y tomar agua después del tratamiento; la terapeuta vendrá en cinco minutos.",
      },
    ],
  },
  {
    id: "dlg-spa-b1",
    role: "spa",
    level: "B1",
    title_es: "Una cita perdida por confusión de horario",
    scene_es:
      "Una huésped llega al spa una hora tarde a su masaje porque confundió la hora, y ya no hay su espacio.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, I'm here for my couples massage... wait, was it at two? I thought it was at three!",
        es: "Llega creyendo que su masaje en pareja era a las tres; en realidad era a las dos.",
      },
      {
        speaker: "staff",
        en: "Let me check... yes, it was booked for two o'clock. I'm sorry — your therapists waited, but they're now with other guests.",
        es: "Se confirma que era a las dos; las terapeutas esperaron pero ya están con otros huéspedes.",
      },
      {
        speaker: "guest",
        en: "Oh no. It's our only free afternoon. Is there anything you can do?",
        es: "Se lamenta: es su única tarde libre, y pregunta si hay alguna solución.",
      },
      {
        speaker: "staff",
        en: "Let me look at the schedule. If you're flexible, I could offer you two individual massages at five, in side-by-side rooms.",
        es: "Se revisa la agenda: a las cinco habría dos masajes individuales en cabinas contiguas.",
      },
      {
        speaker: "guest",
        en: "Hmm, we really wanted the couples experience, though.",
        es: "Duda: querían la experiencia en pareja.",
      },
      {
        speaker: "staff",
        en: "I understand. In that case, would tomorrow at ten work? I'd reserve our best couples suite, and I'll add fifteen extra minutes for the confusion today.",
        es: "Se ofrece la suite de parejas mañana a las diez, con quince minutos extra por la confusión de hoy.",
      },
      {
        speaker: "guest",
        en: "You know what, tomorrow at ten works. Thank you for not just turning us away.",
        es: "Acepta la cita de mañana y agradece que no la despacharan sin opciones.",
      },
      {
        speaker: "staff",
        en: "Of course — mix-ups happen. You're confirmed for ten tomorrow, and I'll send a reminder to your room tonight so it's easy to remember.",
        es: "Se confirma la cita y se enviará un recordatorio a su habitación esa noche.",
      },
    ],
  },
  {
    id: "dlg-spa-b2",
    role: "spa",
    level: "B2",
    title_es: "Una reacción en la piel después del tratamiento",
    scene_es:
      "Un huésped regresa al spa alterado porque su esposa presenta la piel irritada horas después de un tratamiento.",
    lines: [
      {
        speaker: "guest",
        en: "I need to speak with someone right now. My wife's skin is red and itchy after your facial this morning. What did you put on her face?",
        es: "Exige hablar con alguien: la piel de su esposa está roja e irritada tras el facial de la mañana.",
      },
      {
        speaker: "staff",
        en: "I'm very sorry to hear that, and I'm glad you came to us right away. Her wellbeing is the first priority — how is she feeling right now?",
        es: "Se lamenta la situación, se agradece el aviso inmediato y se pregunta primero cómo se siente ella.",
      },
      {
        speaker: "guest",
        en: "Uncomfortable. It's not an emergency, but it's definitely not normal. She told your staff she has sensitive skin!",
        es: "Está incómoda; no es una emergencia, pero no es normal, y ella avisó que tiene piel sensible.",
      },
      {
        speaker: "staff",
        en: "I understand, and you're right to be concerned. Let me pull up her treatment record so we know exactly which products were used — that will help the doctor too.",
        es: "Se valida su preocupación y se consulta el expediente del tratamiento para saber qué productos se usaron, información útil para el médico.",
      },
      {
        speaker: "guest",
        en: "A doctor? Do you think she needs one?",
        es: "Pregunta si de verdad hace falta un médico.",
      },
      {
        speaker: "staff",
        en: "Most likely it's a mild reaction, but I wouldn't want to guess with skin. The hotel doctor can see her in your room within the hour, at no cost to you, of course.",
        es: "Probablemente sea una reacción leve, pero no conviene adivinar; el médico del hotel puede verla en su habitación dentro de una hora, sin costo.",
      },
      {
        speaker: "guest",
        en: "Okay. Yes, please send the doctor. And I'd expect the treatment to be refunded.",
        es: "Acepta la visita del médico y espera el reembolso del tratamiento.",
      },
      {
        speaker: "staff",
        en: "Absolutely — the refund is already being processed, and I'll personally follow up with you both this evening. What I'd also like to do is note her sensitivity in our records so this never happens again.",
        es: "Se confirma el reembolso en proceso, un seguimiento personal esa misma tarde y el registro de su sensibilidad para que no vuelva a ocurrir.",
      },
      {
        speaker: "guest",
        en: "Thank you. I came in angry, but you're clearly taking this seriously.",
        es: "Agradece; llegó enojado pero ve que lo están tomando en serio.",
      },
      {
        speaker: "staff",
        en: "We are, completely. The doctor will call your room shortly, and here's my direct extension if anything changes before then.",
        es: "Se confirma la llamada del médico y se le da la extensión directa por si algo cambia antes.",
      },
    ],
  },

  // ── Security ───────────────────────────────────────────────────────────
  {
    id: "dlg-security-a1",
    role: "security",
    level: "A1",
    title_es: "Un huésped perdió su llave",
    scene_es:
      "Un huésped se acerca al guardia en el pasillo porque perdió la tarjeta de su habitación.",
    lines: [
      {
        speaker: "guest",
        en: "Excuse me, I lost my key card.",
        es: "Avisa que perdió la tarjeta de su habitación.",
      },
      {
        speaker: "staff",
        en: "Don't worry. What is your room number?",
        es: "Se le tranquiliza y se le pregunta su número de habitación.",
      },
      {
        speaker: "guest",
        en: "Room 618. My wallet is inside.",
        es: "Es la 618; su cartera está adentro.",
      },
      {
        speaker: "staff",
        en: "I understand. Please come with me to the front desk.",
        es: "Se comprende y se le pide acompañarlo a recepción.",
      },
      {
        speaker: "guest",
        en: "Do I need my passport?",
        es: "Pregunta si necesita su pasaporte.",
      },
      {
        speaker: "staff",
        en: "Your name and a signature are okay.",
        es: "Basta con su nombre y una firma.",
      },
      {
        speaker: "guest",
        en: "Oh good. Thank you for your help.",
        es: "Se alivia y agradece la ayuda.",
      },
      {
        speaker: "staff",
        en: "You're welcome. They will make a new card fast.",
        es: "Se responde con gusto; en recepción harán una tarjeta nueva rápido.",
      },
    ],
  },
  {
    id: "dlg-security-a2",
    role: "security",
    level: "A2",
    title_es: "Ruido en la habitación de al lado",
    scene_es:
      "Un huésped llama al guardia porque la habitación vecina tiene música alta a medianoche.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, sorry, but the room next to ours is playing loud music. It's midnight and we can't sleep.",
        es: "Reporta música alta en la habitación de junto; es medianoche y no pueden dormir.",
      },
      {
        speaker: "staff",
        en: "I'm sorry about that. Which room are you in?",
        es: "Se ofrece una disculpa y se pregunta su habitación.",
      },
      {
        speaker: "guest",
        en: "We're in 715. The noise is coming from 717.",
        es: "Están en la 715; el ruido viene de la 717.",
      },
      {
        speaker: "staff",
        en: "Thank you. I'll go and talk to them right now, politely.",
        es: "Se agradece la información y se irá a hablar con los vecinos de inmediato, con cortesía.",
      },
      {
        speaker: "guest",
        en: "We don't want problems with them, you know. We just want to sleep.",
        es: "Aclara que no busca problemas, solo quiere dormir.",
      },
      {
        speaker: "staff",
        en: "Of course. I won't say which room called. It will be a general reminder about quiet hours.",
        es: "Se le asegura discreción: no se dirá quién llamó, solo se recordarán las horas de silencio.",
      },
      {
        speaker: "guest",
        en: "Perfect, thank you so much.",
        es: "Agradece la discreción.",
      },
      {
        speaker: "staff",
        en: "You're welcome. If the noise continues after fifteen minutes, please call us again.",
        es: "Se le pide volver a llamar si el ruido sigue después de quince minutos.",
      },
    ],
  },
  {
    id: "dlg-security-b1",
    role: "security",
    level: "B1",
    title_es: "Verificar a un visitante en la puerta",
    scene_es:
      "Un visitante sin pulsera del hotel intenta entrar a la zona de albercas y el guardia debe verificarlo sin ofenderlo.",
    lines: [
      {
        speaker: "guest",
        en: "Is there a problem? I'm just going to the pool to meet my friends.",
        es: "Pregunta si hay algún problema; va a la alberca a ver a sus amigos.",
      },
      {
        speaker: "staff",
        en: "No problem at all, sir. This area is for registered guests, so I just need to see your wristband or room key.",
        es: "Se aclara que no hay problema; el área es para huéspedes registrados y se pide su pulsera o llave.",
      },
      {
        speaker: "guest",
        en: "I left my wristband in my friends' room. They're staying here, I'm not.",
        es: "Dice que dejó la pulsera en la habitación de sus amigos; ellos se hospedan aquí, él no.",
      },
      {
        speaker: "staff",
        en: "I see. If your friends are registered, they can come to the gate and sign you in as their guest. Would you like me to call their room?",
        es: "Se explica la solución: sus amigos pueden registrarlo como visitante en la puerta; se ofrece llamar a su habitación.",
      },
      {
        speaker: "guest",
        en: "Really? All this just for a pool?",
        es: "Se queja de que sea tanto trámite para entrar a una alberca.",
      },
      {
        speaker: "staff",
        en: "I know it feels like a lot, but it's how we keep the area safe for everyone, including your friends. It will only take a minute.",
        es: "Se reconoce la molestia y se explica que es por la seguridad de todos; tomará solo un minuto.",
      },
      {
        speaker: "guest",
        en: "Fine. They're in room 402, the Martins.",
        es: "Acepta; sus amigos son los Martin, habitación 402.",
      },
      {
        speaker: "staff",
        en: "Thank you for your patience, sir. Let me call them now, and you'll be at the pool in no time.",
        es: "Se agradece su paciencia y se hace la llamada para que pueda pasar cuanto antes.",
      },
    ],
  },
  {
    id: "dlg-security-b2",
    role: "security",
    level: "B2",
    title_es: "Bajar la tensión con un huésped alterado",
    scene_es:
      "Un huésped que bebió de más discute a gritos con otro en el bar de la alberca y el guardia interviene.",
    lines: [
      {
        speaker: "guest",
        en: "Stay out of this! That guy took our chairs while we were at lunch and now he's acting like we're the problem!",
        es: "Grita que el otro huésped tomó sus camastros mientras comían y encima los culpa a ellos.",
      },
      {
        speaker: "staff",
        en: "Sir, I'm here to help you, not against you. Walk with me a moment so I can hear your side properly.",
        es: "Se aclara que está ahí para ayudarlo, no en su contra, y se le invita a apartarse para escuchar su versión.",
      },
      {
        speaker: "guest",
        en: "Why do I have to move? He's the one who should be leaving!",
        es: "Reclama que sea él quien tenga que moverse y no el otro.",
      },
      {
        speaker: "staff",
        en: "I understand it feels unfair. I'm not asking you to leave — I just want to solve this without the whole pool watching. Two minutes, that's all.",
        es: "Se reconoce que parece injusto; no se le pide irse, solo resolverlo sin público; serán dos minutos.",
      },
      {
        speaker: "guest",
        en: "Fine. Look, we reserved those chairs at nine this morning. Our towels were right there.",
        es: "Accede y explica: apartaron los camastros desde las nueve con sus toallas.",
      },
      {
        speaker: "staff",
        en: "Thank you for explaining calmly. Here's what I can do: I'll get you two chairs in the shaded front row right now, and I'll speak with the other guest separately.",
        es: "Se agradece la calma y se ofrece una solución: dos camastros en primera fila con sombra, y una conversación aparte con el otro huésped.",
      },
      {
        speaker: "guest",
        en: "The front row? Those are always taken.",
        es: "Se sorprende: la primera fila siempre está ocupada.",
      },
      {
        speaker: "staff",
        en: "We hold a couple for situations exactly like this one. Let me walk you over — and thank you for keeping this civil. It says a lot about you.",
        es: "Se explica que se reservan algunos para estos casos, se le acompaña y se le reconoce haber mantenido la calma.",
      },
      {
        speaker: "guest",
        en: "Alright... I appreciate it. Sorry for raising my voice at you.",
        es: "Acepta, agradece y se disculpa por haber gritado.",
      },
      {
        speaker: "staff",
        en: "It's forgotten. Enjoy the sun, and if anything else comes up, ask for me directly — my name is on this card.",
        es: "Se resta importancia, se le desea buena tarde y se le deja el nombre del guardia por si necesita algo más.",
      },
    ],
  },

  // ── Maintenance ────────────────────────────────────────────────────────
  {
    id: "dlg-maintenance-a1",
    role: "maintenance",
    level: "A1",
    title_es: "El aire acondicionado no funciona",
    scene_es:
      "Un huésped abre la puerta al técnico que llega a revisar el aire acondicionado.",
    lines: [
      {
        speaker: "guest",
        en: "Hi, the air conditioning doesn't work.",
        es: "Reporta que el aire acondicionado no funciona.",
      },
      {
        speaker: "staff",
        en: "Good afternoon. I am here to fix it.",
        es: "Se saluda y se informa que viene a repararlo.",
      },
      {
        speaker: "guest",
        en: "Great, come in. It's very hot in here.",
        es: "Lo hace pasar; hace mucho calor en la habitación.",
      },
      {
        speaker: "staff",
        en: "I understand. Let me check the unit.",
        es: "Se comprende y se revisa el equipo.",
      },
      {
        speaker: "guest",
        en: "Is it a big problem?",
        es: "Pregunta si el problema es grave.",
      },
      {
        speaker: "staff",
        en: "No, it is a small filter problem.",
        es: "No es grave: es un problema menor del filtro.",
      },
      {
        speaker: "guest",
        en: "Oh good. How long will it take?",
        es: "Pregunta cuánto tardará la reparación.",
      },
      {
        speaker: "staff",
        en: "Ten minutes. The room will be cool soon.",
        es: "Serán diez minutos y la habitación se enfriará pronto.",
      },
    ],
  },
  {
    id: "dlg-maintenance-a2",
    role: "maintenance",
    level: "A2",
    title_es: "Una fuga bajo el lavabo",
    scene_es:
      "Una huésped reporta agua en el piso del baño y el técnico llega a revisar la fuga.",
    lines: [
      {
        speaker: "guest",
        en: "Thanks for coming so fast. There's water all over the bathroom floor.",
        es: "Agradece la rapidez y señala agua en todo el piso del baño.",
      },
      {
        speaker: "staff",
        en: "No problem. I came as soon as I got the call. May I see the bathroom?",
        es: "Se responde que vino en cuanto recibió el aviso y se pide pasar al baño.",
      },
      {
        speaker: "guest",
        en: "Sure, it's this way. It started about an hour ago.",
        es: "Lo guía al baño; la fuga empezó hace como una hora.",
      },
      {
        speaker: "staff",
        en: "I see it. The pipe under the sink is leaking. I'll close the water valve first.",
        es: "Se identifica la fuga en la tubería bajo el lavabo; primero se cerrará la llave de paso.",
      },
      {
        speaker: "guest",
        en: "Will we be able to use the bathroom tonight?",
        es: "Pregunta si podrán usar el baño esa noche.",
      },
      {
        speaker: "staff",
        en: "Yes. I'll change the pipe now and it will take about twenty minutes.",
        es: "Sí: se cambiará el tubo en ese momento y tomará unos veinte minutos.",
      },
      {
        speaker: "guest",
        en: "Perfect. And what about the wet floor?",
        es: "Pregunta qué pasará con el piso mojado.",
      },
      {
        speaker: "staff",
        en: "Housekeeping will come to dry everything after I finish. Your bathroom will be ready before dinner.",
        es: "Ama de llaves vendrá a secar todo al terminar; el baño quedará listo antes de la cena.",
      },
    ],
  },
  {
    id: "dlg-maintenance-b1",
    role: "maintenance",
    level: "B1",
    title_es: "La caja fuerte no abre",
    scene_es:
      "Un huésped no puede abrir la caja fuerte donde guardó sus pasaportes y el técnico llega a la habitación.",
    lines: [
      {
        speaker: "guest",
        en: "Thank goodness you're here. The safe won't open and our passports are inside. We check out tomorrow morning.",
        es: "Se alivia al verlo: la caja fuerte no abre, sus pasaportes están adentro y salen mañana temprano.",
      },
      {
        speaker: "staff",
        en: "Don't worry — this is more common than you'd think, and I can open it. Could you first tell me the code you were using?",
        es: "Se le tranquiliza: es un problema común y tiene solución; se pregunta el código que usaba.",
      },
      {
        speaker: "guest",
        en: "We used 1985, same as always. It worked fine yesterday.",
        es: "Usaban el código 1985, el mismo de siempre; ayer funcionaba.",
      },
      {
        speaker: "staff",
        en: "Thank you. It sounds like the batteries died — if the keypad doesn't light up, that would explain it. Let me check.",
        es: "Se plantea la causa probable: baterías agotadas, lo que explicaría que el teclado no encienda.",
      },
      {
        speaker: "guest",
        en: "Batteries? So our passports aren't stuck in there forever?",
        es: "Pregunta aliviado si sus pasaportes no quedarán atrapados.",
      },
      {
        speaker: "staff",
        en: "Not at all. I'll open it with the master tool, change the batteries, and you'll set a new code yourself — I never see it, for your security.",
        es: "Se explica el proceso: apertura con herramienta maestra, cambio de baterías y un código nuevo que solo el huésped conoce.",
      },
      {
        speaker: "guest",
        en: "That's reassuring. And if it happens again tonight?",
        es: "Le tranquiliza, pero pregunta qué pasa si vuelve a fallar esa noche.",
      },
      {
        speaker: "staff",
        en: "With fresh batteries it shouldn't, but if anything feels wrong, call the front desk and I'll come up — even late. Now, let's rescue those passports.",
        es: "Con baterías nuevas no debería fallar; si algo pasa, puede llamar a recepción a cualquier hora, y ahora se procede a abrir la caja.",
      },
    ],
  },
  {
    id: "dlg-maintenance-b2",
    role: "maintenance",
    level: "B2",
    title_es: "Tercera visita por el mismo aire acondicionado",
    scene_es:
      "Es la tercera vez en la semana que el aire acondicionado falla en la misma habitación y el huésped recibe al técnico exasperado.",
    lines: [
      {
        speaker: "guest",
        en: "Third time this week. Third! Every night it dies at two in the morning and we wake up sweating. I'm done with quick fixes.",
        es: "Reclama que es la tercera falla de la semana: el aire se apaga de madrugada y despiertan sudando; no quiere más parches.",
      },
      {
        speaker: "staff",
        en: "You're completely right, and I owe you an apology — twice we treated the symptom instead of the cause. Today I'm not leaving until I find the real problem.",
        es: "Se le da la razón y se ofrece una disculpa: dos veces se atendió el síntoma y no la causa; hoy no se irá sin encontrar el problema real.",
      },
      {
        speaker: "guest",
        en: "That's what the last technician said. What's different this time?",
        es: "Responde escéptico: el técnico anterior dijo lo mismo, qué cambia ahora.",
      },
      {
        speaker: "staff",
        en: "A fair question. This time I'm testing the compressor under full load, which takes about an hour — that's the test that should have been done first, honestly.",
        es: "Se acepta la pregunta y se explica la diferencia: hoy se probará el compresor a carga completa, la prueba que debió hacerse desde el principio.",
      },
      {
        speaker: "guest",
        en: "An hour? We were about to go rest. This is exactly the disruption I'm talking about.",
        es: "Protesta: iban a descansar y una hora de trabajo es justo la molestia de la que se queja.",
      },
      {
        speaker: "staff",
        en: "I completely understand, and I wouldn't ask you to sit through it. What I can do is have the front desk open the room next door for you while I work — same category, and it's ready now.",
        es: "Se comprende y se ofrece una alternativa: recepción les abrirá la habitación contigua, de la misma categoría, mientras dura la reparación.",
      },
      {
        speaker: "guest",
        en: "And if the compressor is the problem? I don't want a fourth visit.",
        es: "Pregunta qué pasará si el compresor es la falla; no quiere una cuarta visita.",
      },
      {
        speaker: "staff",
        en: "If it's the compressor, I'll recommend moving you to that room for the rest of your stay tonight — I'd rather move you once than wake you up again. Either way, you'll have my report and a working room before you sleep.",
        es: "Si el compresor falla, se recomendará cambiarlos de habitación definitivamente esa misma noche; en cualquier caso tendrán un informe y una habitación funcionando antes de dormir.",
      },
      {
        speaker: "guest",
        en: "Okay. That's the first straight answer we've gotten all week. Go ahead.",
        es: "Acepta: es la primera respuesta clara que reciben en la semana.",
      },
      {
        speaker: "staff",
        en: "Thank you for your patience — you've had more than enough reasons to lose it. I'll text the front desk now so your key for next door is ready in five minutes.",
        es: "Se agradece una paciencia que ya nadie les podía exigir y se avisa a recepción para que la llave de la habitación contigua esté lista en cinco minutos.",
      },
    ],
  },
];

export function dialogueFor(
  role: RoleModule,
  level: "A1" | "A2" | "B1" | "B2"
): Dialogue | null {
  return DIALOGUES.find((d) => d.role === role && d.level === level) ?? null;
}
