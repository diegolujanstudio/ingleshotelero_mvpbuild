/**
 * Minimal-pair perception training — METODO-TURNO.md §5 ("La Semana Sin Pena")
 * and Law 3 (pronunciation before vocabulary).
 *
 * WHY THIS EXISTS
 * The learner's blocker is not vocabulary, it is shame — and the shame has a
 * specific, documented, finite cause. Spanish L1 speakers have a closed set of
 * English phoneme problems, and a handful of them do not merely confuse, they
 * humiliate. One bad incident in front of a guest ends someone's willingness
 * to speak English for years. In a Cancún resort, `beach` and `sheet` are not
 * edge cases; they are daily vocabulary.
 *
 * Fixing perception first is fast, binary, objectively verifiable, and it
 * removes the thing that blocks everything else.
 *
 * A DELIBERATE DIGNITY DECISION
 * The dangerous words (the ones that get misheard as obscenities) are NOT
 * drilled. A learner is never asked to listen to, choose between, or repeat a
 * slur — that reproduces the humiliation we exist to remove. Instead:
 *
 *   - drills use safe pairs that train the *identical* contrast
 *     (seat/sit, cheap/chip, sheep/ship)
 *   - `stakes_es` names the risk in plain Spanish, once, without printing the
 *     offensive word
 *
 * The learner leaves able to hear and produce the distinction. They are never
 * made to rehearse their own embarrassment.
 *
 * Sources: "Problematic Phonemes for Spanish-speaking Learners of English"
 * (GIST 2019); Goswami & Chen (2010), which tested Mexican Spanish speakers
 * specifically and found explicit segmental instruction produces significant
 * measurable improvement.
 */

export type ContrastId =
  | "long_i_short_i"
  | "ch_sh"
  | "b_v"
  | "s_onset"
  | "long_u_short_u"
  | "d_th"
  | "y_j"
  | "n_ng";

export interface MinimalPair {
  /** The two words. Both are safe to show and to hear. */
  a: string;
  b: string;
  /** Spanish gloss so the learner knows what each word means. */
  a_es: string;
  b_es: string;
}

export interface PhonemeContrast {
  id: ContrastId;
  /** Day of "La Semana Sin Pena" this contrast is introduced (1-indexed). */
  day: number;
  label_es: string;
  /** Rendered as-is; keep IPA short and paired with a plain-Spanish hint. */
  symbol_a: string;
  symbol_b: string;
  /** Why a Spanish speaker gets this wrong. */
  why_es: string;
  /** Mouth mechanics — tongue, lips, voicing. */
  how_es: string;
  /**
   * What is actually at risk, in plain Spanish, WITHOUT printing the word.
   * This is what makes the learner care enough to do 90 seconds a day.
   */
  stakes_es: string;
  pairs: MinimalPair[];
}

export const CONTRASTS: PhonemeContrast[] = [
  {
    id: "long_i_short_i",
    day: 1,
    label_es: "La i larga y la i corta",
    symbol_a: "iː",
    symbol_b: "ɪ",
    why_es:
      "En español sólo existe una i. En inglés hay dos, y cambian el significado de la palabra por completo.",
    how_es:
      "Para la i larga (seat), estira los labios como en una sonrisa y alarga el sonido. Para la i corta (sit), relaja la boca y déjalo muy breve, casi como una e apagada.",
    stakes_es:
      "Ésta es la diferencia más importante de todas. Con la i corta, palabras normales del trabajo —la playa, las sábanas— suenan como groserías fuertes frente al huésped. No es tu culpa: es que en español ese sonido no existe. En dos minutos al día se arregla.",
    pairs: [
      { a: "seat", b: "sit", a_es: "asiento", b_es: "sentarse" },
      { a: "sheep", b: "ship", a_es: "oveja", b_es: "barco" },
      { a: "cheap", b: "chip", a_es: "barato", b_es: "papa frita" },
      { a: "feel", b: "fill", a_es: "sentir", b_es: "llenar" },
      { a: "green", b: "grin", a_es: "verde", b_es: "sonrisa" },
      { a: "leave", b: "live", a_es: "salir", b_es: "vivir" },
      { a: "heat", b: "hit", a_es: "calor", b_es: "golpear" },
      { a: "each", b: "itch", a_es: "cada uno", b_es: "comezón" },
    ],
  },
  {
    id: "ch_sh",
    day: 3,
    label_es: "CH y SH",
    symbol_a: "tʃ",
    symbol_b: "ʃ",
    why_es:
      "El español tiene CH pero no tiene SH. Por eso salen iguales, y en inglés son dos sonidos distintos.",
    how_es:
      "CH empieza con la lengua tocando el paladar y se suelta de golpe, como en «chico». SH es aire continuo, sin golpe — el sonido de pedir silencio.",
    stakes_es:
      "«A chair» y «a share» son cosas distintas, y en recepción se usan todo el tiempo. Es de los cambios que más rápido se notan.",
    pairs: [
      { a: "chair", b: "share", a_es: "silla", b_es: "compartir" },
      { a: "chip", b: "ship", a_es: "papa frita", b_es: "barco" },
      { a: "watch", b: "wash", a_es: "ver / reloj", b_es: "lavar" },
      { a: "cheese", b: "she's", a_es: "queso", b_es: "ella está" },
      { a: "choose", b: "shoes", a_es: "elegir", b_es: "zapatos" },
    ],
  },
  {
    id: "b_v",
    day: 5,
    label_es: "B y V",
    symbol_a: "b",
    symbol_b: "v",
    why_es:
      "En español la b y la v suenan igual. En inglés no: la v se hace con los dientes.",
    how_es:
      "Para la v, muerde suavemente el labio de abajo con los dientes de arriba y deja salir el aire con voz. Para la b, los dos labios se juntan y se separan de golpe.",
    stakes_es:
      "«Very good» dicho con b suena a «berry good». Se entiende, pero marca de inmediato que no dominas el idioma — y eso baja la confianza del huésped.",
    pairs: [
      { a: "very", b: "berry", a_es: "muy", b_es: "baya" },
      { a: "vest", b: "best", a_es: "chaleco", b_es: "el mejor" },
      { a: "van", b: "ban", a_es: "camioneta", b_es: "prohibir" },
      { a: "vote", b: "boat", a_es: "votar", b_es: "barco" },
      { a: "curve", b: "curb", a_es: "curva", b_es: "banqueta" },
    ],
  },
  {
    id: "s_onset",
    day: 7,
    label_es: "Palabras que empiezan con S",
    symbol_a: "st-",
    symbol_b: "est-",
    why_es:
      "En español ninguna palabra empieza con s + consonante, así que la boca agrega una e sin que te des cuenta: «estay» en vez de «stay».",
    how_es:
      "Empieza el sonido con la s ya sonando, como una serpiente, y sólo después junta la siguiente letra. Practica alargando: ssss-tay.",
    stakes_es:
      "Es el detalle que más delata el acento y el más fácil de corregir. Aquí no eliges entre dos palabras: escucha y repite hasta que la e desaparezca.",
    // For /s/-onset there is no English minimal pair — "estay" is not a word.
    // The `b` column is the learner's own predictable error, shown so they can
    // hear the difference between what they say and what they mean to say.
    pairs: [
      { a: "stay", b: "estay", a_es: "quedarse", b_es: "(el error común)" },
      { a: "spa", b: "espa", a_es: "spa", b_es: "(el error común)" },
      { a: "student", b: "estudent", a_es: "estudiante", b_es: "(el error común)" },
      { a: "special", b: "especial", a_es: "especial", b_es: "(el error común)" },
      { a: "start", b: "estart", a_es: "empezar", b_es: "(el error común)" },
    ],
  },
  // ── Maintenance phase (day 8+) ─────────────────────────────────────
  // La Semana Sin Pena stays seven days and four sounds — that's the
  // onboarding contract. These four continue the work afterwards: same
  // trainer, same 90 seconds, introduced one at a time so the learner
  // always has a "next sound" instead of a finished list.
  {
    id: "long_u_short_u",
    day: 8,
    label_es: "La u larga y la u corta",
    symbol_a: "uː",
    symbol_b: "ʊ",
    why_es:
      "Igual que con la i, el español tiene una sola u. En inglés hay dos: una larga y tensa, otra corta y relajada.",
    how_es:
      "Para la u larga (pool), junta los labios como para silbar y alarga el sonido. Para la u corta (pull), relaja los labios y córtalo de inmediato.",
    stakes_es:
      "«Pool» es de las palabras que más se dicen en un hotel. Con la u corta se convierte en «pull» — jalar. El huésped entiende otra cosa y tú ni te enteras.",
    pairs: [
      { a: "pool", b: "pull", a_es: "alberca", b_es: "jalar" },
      { a: "fool", b: "full", a_es: "engañar", b_es: "lleno" },
      { a: "Luke", b: "look", a_es: "Lucas (nombre)", b_es: "mirar" },
      { a: "suit", b: "soot", a_es: "traje", b_es: "hollín" },
      { a: "stewed", b: "stood", a_es: "guisado", b_es: "parado" },
    ],
  },
  {
    id: "d_th",
    day: 10,
    label_es: "La D y la TH suave",
    symbol_a: "ð",
    symbol_b: "d",
    why_es:
      "El sonido de «they» no existe en español, así que la boca lo reemplaza con una d. «They» se vuelve «day» — y son palabras distintas.",
    how_es:
      "Para la TH suave, saca apenas la punta de la lengua entre los dientes y deja pasar el aire con voz, como una zumbido suave. Para la d, la lengua toca detrás de los dientes y se despega de golpe.",
    stakes_es:
      "«They», «this», «that», «there» — son de las palabras más usadas del inglés. Todas llevan este sonido. Corregirlo mejora cada frase que dices.",
    pairs: [
      { a: "they", b: "day", a_es: "ellos", b_es: "día" },
      { a: "there", b: "dare", a_es: "ahí", b_es: "atreverse" },
      { a: "then", b: "den", a_es: "entonces", b_es: "estudio (cuarto)" },
      { a: "though", b: "dough", a_es: "aunque", b_es: "masa" },
      { a: "breathe", b: "breed", a_es: "respirar", b_es: "criar" },
    ],
  },
  {
    id: "y_j",
    day: 12,
    label_es: "La Y y la J",
    symbol_a: "j",
    symbol_b: "dʒ",
    why_es:
      "En el español de México la y y la j inglesa se mezclan: «yes» sale como «jes». En inglés son dos sonidos separados.",
    how_es:
      "La y inglesa (yes) es suave, sin fricción — como la i de «bien» dicha rápido. La j inglesa (jet) empieza con la lengua pegada al paladar y se suelta con un golpe, como la ch pero con voz.",
    stakes_es:
      "«Use» y «juice» se confunden justo en el restaurante y el bar. Y un «yes» que suena a «jes» delata el acento en la primera palabra de la conversación.",
    pairs: [
      { a: "yet", b: "jet", a_es: "todavía", b_es: "avión" },
      { a: "use", b: "juice", a_es: "usar", b_es: "jugo" },
      { a: "yam", b: "jam", a_es: "camote", b_es: "mermelada" },
      { a: "year", b: "jeer", a_es: "año", b_es: "burla" },
      { a: "yellow", b: "Jell-O", a_es: "amarillo", b_es: "gelatina" },
    ],
  },
  {
    id: "n_ng",
    day: 14,
    label_es: "La N y la NG final",
    symbol_a: "n",
    symbol_b: "ŋ",
    why_es:
      "En español la n final siempre suena igual. En inglés hay dos: la n normal y la ng de «thing», que se hace con la parte de atrás de la lengua.",
    how_es:
      "Para la ng, la parte de atrás de la lengua sube y toca el paladar blando — como la n de «banco» en español, pero sin dejar salir la g. La punta de la lengua no toca nada.",
    stakes_es:
      "«Thin» y «thing», «win» y «wing» — la diferencia es solo este sonido final. En frases como «one more thing» se usa todos los días con el huésped.",
    pairs: [
      { a: "thing", b: "thin", a_es: "cosa", b_es: "delgado" },
      { a: "sing", b: "sin", a_es: "cantar", b_es: "pecado" },
      { a: "wing", b: "win", a_es: "ala", b_es: "ganar" },
      { a: "bang", b: "ban", a_es: "golpe", b_es: "prohibir" },
      { a: "rang", b: "ran", a_es: "sonó", b_es: "corrió" },
    ],
  },
];

export const CONTRAST_BY_ID = new Map(CONTRASTS.map((c) => [c.id, c]));

/** `s_onset` is repeat-after-me, not choose-between-two. */
export function isPerceptionContrast(c: PhonemeContrast): boolean {
  return c.id !== "s_onset";
}

/** Days in the onboarding week. */
export const SEMANA_SIN_PENA_DAYS = 7;

/**
 * Which contrast a learner works on for a given day of their first week.
 * Days between introductions repeat the most recent contrast — spacing beats
 * cramming, and 90 seconds twice is worth more than 3 minutes once.
 */
export function contrastForDay(day: number): PhonemeContrast {
  const eligible = CONTRASTS.filter((c) => c.day <= day);
  return eligible.length > 0 ? eligible[eligible.length - 1] : CONTRASTS[0];
}

/**
 * Is this learner still inside the onboarding week?
 * `daysSinceStart` is 0-indexed (day of enrolment === 0).
 */
export function isInSemanaSinPena(daysSinceStart: number | null): boolean {
  return daysSinceStart !== null && daysSinceStart < SEMANA_SIN_PENA_DAYS;
}

/**
 * Build one perception question: play a word, ask which of the two it was.
 * Deterministic given `seed` so a refresh does not silently re-roll the answer.
 */
export function buildPerceptionQuestion(
  contrast: PhonemeContrast,
  seed: number,
): { pair: MinimalPair; target: "a" | "b"; options: [string, string] } {
  const pair = contrast.pairs[seed % contrast.pairs.length];
  const target: "a" | "b" = Math.floor(seed / contrast.pairs.length) % 2 === 0 ? "a" : "b";
  // Option order also rotates, so the answer is never positionally guessable.
  const flip = Math.floor(seed / (contrast.pairs.length * 2)) % 2 === 1;
  const options: [string, string] = flip ? [pair.b, pair.a] : [pair.a, pair.b];
  return { pair, target, options };
}
