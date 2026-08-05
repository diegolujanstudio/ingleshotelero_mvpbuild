/**
 * Practice-mode copy — Spanish (es-MX), single source of truth.
 *
 * The daily drill is the spine of the method (Law 5: habit over content) —
 * these modes are the free-play library around it. Copy rules: tú register
 * (LATAM-UX-DOCTRINE §1.1), one idea per sentence, a 10-year-old can parse
 * every line, no scoring language on production (Law 1).
 */

export const MODES_COPY = {
  hub: {
    eyebrow: "Más maneras de practicar",
    note: "Tu práctica diaria es la de arriba. Esto es extra — entra cuando quieras.",
    modes: [
      {
        id: "pronunciacion",
        href: "/practice/pronunciacion",
        title: "Pronunciación",
        blurb: "Los sonidos del inglés que el español no tiene.",
        meta: "8 sonidos",
      },
      {
        id: "numeros",
        href: "/practice/numeros",
        title: "Números y horas",
        blurb: "Cuartos, precios y horarios — al oído.",
        meta: "Nunca se repite",
      },
      {
        id: "vocabulario",
        href: "/practice/vocabulario",
        title: "Vocabulario",
        blurb: "Las palabras de tu puesto, de diez en diez.",
        meta: "Por turno",
      },
      {
        id: "dialogos",
        href: "/practice/dialogos",
        title: "Diálogos",
        blurb: "Una conversación real, línea por línea.",
        meta: "Por puesto",
      },
    ],
  },

  numeros: {
    eyebrow: "Números y horas",
    title: "Escucha el número. Elige el correcto.",
    description:
      "Cuartos, precios y horarios. Es lo que más se malentiende en un hotel — y lo más fácil de entrenar.",
    play: "Escuchar",
    replay: "Otra vez",
    next: "Seguir",
    doneTitle: "Buen oído.",
    doneNote: "Cada ronda trae números nuevos. Nunca se acaba.",
    again: "Otra ronda",
    back: "Volver a la práctica",
  },

  vocabulario: {
    eyebrow: "Vocabulario del turno",
    title: "Diez palabras de tu puesto.",
    description:
      "Primero intenta recordarla. Luego toca la tarjeta para comprobar.",
    reveal: "Ver la traducción",
    listen: "Escuchar",
    knewIt: "La sabía",
    almost: "Más o menos",
    missedIt: "No la sabía",
    next: "Seguir",
    doneTitle: "Diez palabras repasadas.",
    doneNote:
      "Las que marcaste «No la sabía» van a regresar más seguido. Así funciona.",
    again: "Otras diez",
    back: "Volver a la práctica",
    empty: "Aún no hay palabras para este puesto y nivel.",
  },

  dialogos: {
    eyebrow: "Diálogo del turno",
    title: "Una conversación real.",
    description:
      "Escucha al huésped. Cuando hable el personal, repite la línea en voz alta — esa es tu parte.",
    guestLabel: "Huésped",
    staffLabel: "Tú",
    listen: "Escuchar",
    saidIt: "La dije en voz alta",
    showAll: "Ver todo el diálogo",
    next: "Seguir",
    doneTitle: "Diálogo completo.",
    doneNote:
      "Repítelo mañana y va a salir más natural. Así se construye la soltura.",
    again: "Repetir el diálogo",
    back: "Volver a la práctica",
    empty: "Aún no hay diálogo para este puesto y nivel.",
  },
} as const;
