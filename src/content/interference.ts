/**
 * Interference groups — METODO-TURNO.md §6.1 (Law 2).
 *
 * THE FINDING
 * Teaching thematically-related words together is intuitive, traditional, and
 * measurably worse: sets of semantically similar items are learned **>30%
 * more slowly** than mixed sets, because the items compete at recall. Every
 * language course groups "the parts of the hotel" into one lesson. That is
 * exactly the wrong delivery order.
 *
 * THE RULE
 * Thematic grouping stays as a *browsing view* for the HR director. It must
 * never be the *delivery order* for the learner. Concretely:
 *   - never introduce two NEW items from the same group in one session
 *   - never put two low-maturity cards from the same group in one review batch
 *
 * This is the highest-leverage, lowest-cost change in the whole method: a 30%
 * gain in learning rate at zero additional learner time. It costs one tag per
 * word and one filter in the scheduler.
 *
 * WHY THIS LIVES IN CONTENT AND NOT THE DATABASE
 * The design calls for an `interference_group` column on `content_items`.
 * Deriving it here instead ships the *behaviour* now, is unit-testable without
 * a database, and needs no migration against a paused Supabase. When the
 * column lands, `groupOf()` becomes a DB read and the scheduler code is
 * unchanged. Words with no group are unconstrained — absence of a tag must
 * never block a card.
 */

export type InterferenceGroup =
  | "hotel_areas"
  | "directions"
  | "time_expressions"
  | "payment_terms"
  | "booking_terms"
  | "drinks"
  | "food_prep"
  | "room_items"
  | "medical"
  | "accessibility"
  | "service_verbs"
  | "polite_formulas"
  | "similar_sounds_i"
  | "similar_sounds_s_cluster";

/**
 * Members are matched case-insensitively against `word_en`.
 *
 * Only genuinely competing items belong in a group. Over-tagging is not free:
 * every tag is a constraint on the scheduler, and if too many words share a
 * group the picker runs out of legal cards and the constraint gets dropped.
 */
export const INTERFERENCE_GROUPS: Record<InterferenceGroup, string[]> = {
  hotel_areas: [
    "lobby", "elevator", "terrace", "pool", "entrance", "store room",
    "first floor", "second floor", "floor", "private entrance", "quiet side",
    "lost and found", "old town", "downtown",
  ],
  directions: [
    "at the back", "behind", "just past", "on your left", "to the right of",
    "right there", "this way", "follow me", "right this way",
    "two blocks away", "walking distance", "outside", "in the shade",
  ],
  time_expressions: [
    "in a moment", "in a few minutes", "right away", "within ten minutes",
    "at the latest", "noon", "overnight", "meanwhile", "while you wait",
    "the moment it's ready", "coming right up", "come out fast", "open from",
    "in a hurry",
  ],
  payment_terms: [
    "cash", "credit card", "invoice", "fee", "rate", "service charge",
    "tax ID", "billing email", "charged twice", "corrected total",
    "split the bill", "on file", "per night", "included", "at no charge",
    "on us", "it's on us", "we take", "fully separate", "equally",
    "what each ordered",
  ],
  booking_terms: [
    "book", "booking", "reservation", "confirmation number", "check-in",
    "check-out", "no-show", "extend", "late check-out", "available",
    "room number", "key card", "ID", "partner hotel",
  ],
  drinks: [
    "beer", "ice", "bottled", "sparkling water", "still water", "draft",
    "by the glass", "coffee with milk", "sugar", "pair with",
  ],
  food_prep: [
    "medium rare", "overcooked", "spicy", "mild", "crisp", "without meat",
    "vegetarian", "seafood", "pork", "dish", "menu", "house favorite",
    "the chef", "on the side", "being prepared", "pace the courses",
    "table for two", "host", "I ordered",
  ],
  room_items: [
    "towels", "blanket", "bathroom", "air conditioning", "thermostat",
    "charger", "safe", "umbrella", "map", "luggage", "bag",
  ],
  medical: [
    "allergic", "dizzy", "fever", "got sick", "pharmacy", "on-call doctor",
  ],
  accessibility: ["wheelchair", "ramp", "step-free"],
  service_verbs: [
    "fix", "sort out", "remove", "verify", "confirm", "arrange",
    "accommodate", "open a case", "take this seriously", "check back",
    "take down the details", "walk me through it", "send up", "bring",
    "borrow", "ship", "recommend",
  ],
  polite_formulas: [
    "of course", "here you are", "ma'am", "good evening",
    "I'm sorry about that", "let us know", "right away", "stay with you",
    "at the latest",
  ],

  /**
   * Phonetic groups (Law 3). These are minimal-pair traps for a Spanish L1
   * speaker, so they must never be introduced together even though they are
   * semantically unrelated — the competition here is at the sound layer.
   */
  // `still water` deliberately omitted here — it already carries the /st/
  // onset tag below, and a third group over-constrains one of the most
  // frequent words on a restaurant shift.
  similar_sounds_i: ["check", "ship", "dish", "crisp"],
  similar_sounds_s_cluster: [
    "still water", "sparkling water", "spicy", "store room", "step-free",
    "stay with you",
  ],
};

/** word (lowercased) → the groups it belongs to. A word may be in several. */
const WORD_TO_GROUPS: Map<string, InterferenceGroup[]> = (() => {
  const m = new Map<string, InterferenceGroup[]>();
  for (const [group, words] of Object.entries(INTERFERENCE_GROUPS) as [
    InterferenceGroup,
    string[],
  ][]) {
    for (const w of words) {
      const key = w.toLowerCase();
      const cur = m.get(key) ?? [];
      cur.push(group);
      m.set(key, cur);
    }
  }
  return m;
})();

/** Every group a word belongs to. Empty means unconstrained. */
export function groupsOf(word: string): InterferenceGroup[] {
  return WORD_TO_GROUPS.get(word.trim().toLowerCase()) ?? [];
}

/** True when two words compete at recall and must not be taught together. */
export function conflicts(a: string, b: string): boolean {
  const ga = groupsOf(a);
  if (ga.length === 0) return false;
  const gb = new Set(groupsOf(b));
  return ga.some((g) => gb.has(g));
}

/**
 * A card is "low maturity" while it is still being learned. Mature cards are
 * safe to sit next to their group-mates — the interference effect is about
 * *acquisition*, not maintenance, so constraining mature reviews would shrink
 * the pool for no benefit.
 */
export const LOW_MATURITY_REPETITIONS = 2;

export function isLowMaturity(repetitions: number | null | undefined): boolean {
  return (repetitions ?? 0) < LOW_MATURITY_REPETITIONS;
}

/**
 * Enforce Law 2 over a candidate batch, preserving the incoming priority
 * order (the scheduler has already sorted by due-ness).
 *
 * Rejected cards are *deferred*, not dropped — they are returned separately so
 * the caller can top the batch back up to size. A learner must never get a
 * shorter session because of a tagging decision.
 */
export function applyInterferenceConstraint<
  T extends { word_en: string; state?: { repetitions: number } | null },
>(candidates: T[], limit: number): { selected: T[]; deferred: T[] } {
  const selected: T[] = [];
  const deferred: T[] = [];

  for (const c of candidates) {
    if (selected.length >= limit) {
      deferred.push(c);
      continue;
    }
    const cLow = isLowMaturity(c.state?.repetitions);
    const clashes =
      cLow &&
      selected.some(
        (s) => isLowMaturity(s.state?.repetitions) && conflicts(s.word_en, c.word_en),
      );
    if (clashes) deferred.push(c);
    else selected.push(c);
  }

  // Backfill: if the constraint left the session short, take deferred cards
  // back rather than serving a stunted batch. Habit beats purity (Law 5).
  if (selected.length < limit && deferred.length > 0) {
    while (selected.length < limit && deferred.length > 0) {
      selected.push(deferred.shift() as T);
    }
  }

  return { selected, deferred };
}
