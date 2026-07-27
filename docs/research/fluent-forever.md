# Fluent Forever (Gabriel Wyner, Revised Edition, 2024) — Mined for Inglés Hotelero

**Source file:** `scratchpad/corpus/fluent-forever.txt` (3,139 lines, ~670KB)
**Lens:** extract the complete implementable language-acquisition method — sequencing, SRS parameters, card types, session structure — and translate it into build decisions for a PWA + WhatsApp product teaching job-English to LATAM hotel staff.

---

## 0. The big idea in one paragraph

Language learning fails because of **forgetting**, and forgetting is beatable with engineering. Wyner's system: (1) make each memory maximally deep by binding sound → image → personal experience instead of a translation; (2) practice **recall**, not review, at expanding intervals timed to land right before you forget; (3) learn the **sound system before the vocabulary**, so words aren't stored broken; (4) learn words in **frequency order, never thematic order**, because similar items learned together interfere and cost 30%+ more; (5) let a pattern-crunching "language machine" acquire grammar from comprehensible input rather than drilling rules; (6) train **circumlocution** ("Taboo") so you can express any thought with the limited words you have — that, not vocabulary size, is what fluency actually is.

The book's own three keys (Ch.1, line 107): **1. Learn pronunciation first. 2. Don't translate. 3. Use a spaced repetition system.**

---

## 1. The five memory principles (Ch. 2) — the engine

### Principle 1: Make memories more memorable — Levels of Processing

Four levels, from shallow to deep (the 1970s Craik/Lockhart questionnaire study, line 268-271):

| Level | Test question | Relative recall |
|---|---|---|
| Structure | "How many capital letters in BEAR?" | baseline (≈1×) |
| Sound | "Does APPLE rhyme with Snapple?" | 2× BEAR |
| Concept | "Is TOOL another word for instrument?" | 2× APPLE (4× BEAR) |
| Personal connection | "Do you like PIZZA?" | 1.5× TOOL (**6× BEAR**) |

> "students remembered six PIZZAs for every BEAR" (line 270)
> "You will remember a concept with a personal connection 50 percent more easily than a concept without one" (line 296)

**Mechanism:** the brain works at the shallowest level that gets the job done — a filter against information overload. Foreign words default into the "forgettable" bin (same bin as *disodium phosphate* on a milk carton, line 276). You beat the filter by forcing deep processing.

**The prescription (line 308):**
1. Learn the sound system of your language.
2. Bind those sounds to images.
3. Bind those images to your past experiences.

**Image evidence (line 292-294):** Two-Alternative Forced-Choice test — students shown 612 magazine ads identified old images 98.5% of the time. Pushed to 10,000 images over five days, still 83% accurate. And: *word + picture beats picture alone*, **even when the image is unrelated** — "you will remember an abstract drawing with the sentence *Apples are delicious* better than that drawing alone" (line 295). Footnote caveat (line 2900): a *related* image works better than unrelated, and an *opposite* image (ice cube for "hot") is actively harmful.

### Principle 2: Maximize laziness

Ebbinghaus's forgetting curve: ~30% retention the next day. **Overlearning (extra repetition) does nothing for long-term memory.** "study a concept until you can repeat it once without looking and then stop" (line 322).

### Principle 3: Don't review. Recall.

Testing beats restudying, dramatically:
- Study-twice vs study-once-then-write-what-you-remember: **+35% at one week** for the recall group (line 328). Study-twice wins at 5 minutes and loses badly by 1 week.
- Study once + test **three times** beats study + test once (line 333-335).
- Footnote (line 477): **"Additional studies show a 5:1 benefit for testing over studying, meaning that five minutes of testing is worth twenty-five minutes of studying."**

**Mechanism:** the moment of being judged triggers amygdala → memory-enhancing hormones; successful recall triggers dopamine into the hippocampus. "Your blank sheet of paper has created a drug-fueled memory party in your brain" (line 345).

### Principle 4: Wait, wait! Don't tell me! — desirable difficulty

Words you recall *instantly* are the ones you're **most likely to forget** next week. Words that took effort: **+20% retention**. Words you had all but forgotten: **+75%**. Words that sat on the tip of your tongue: **2× more likely to be retained** (line 353).

> "Memory tests are most effective when they're challenging... If you can consistently test yourself right before you forget, you'll double the effectiveness of every test." (line 359)

Also: "we don't need to be stressed to remember; we just need to be **interested**" (line 357). Too-easy reviews are boring AND wasted.

### Principle 5: Rewrite the past + immediate feedback

Every act of recall rewrites the memory with traces of your present self, doubling the network. When you *fail* to recall, **immediate feedback** either resurrects the memory ("Oh yeah!") or creates a fresh original experience — either way you keep the value of the session (line 374-378). Without feedback, a forgotten card is a wasted rep.

---

## 2. Spaced repetition — concrete parameters

### Interval schedule

> "You'll begin with short intervals (two to four days)... Every time you successfully remember, you'll increase the interval (e.g., **nine days, three weeks, two months, six months**, etc.), quickly reaching intervals of years. If you forget a word, you'll start again with short intervals." (line 402)

**The optimal-delay rule (footnote, line 482):**
> "The magic number turns out to be **10 to 20 percent of the final test delay**, so if their test was a year later, we would see the best results at a delay of fifty-six days."

Supporting data (line 391-393): trivia learned, one practice session at varying delay, tested at 6 months. Immediate practice → 27% final score. 28-day delay → roughly double.

### Throughput numbers (use these for our honest math)

- "In a four-month period, practicing for **thirty minutes a day**, you can expect to learn and retain **3,600 flash cards with 90 to 95 percent accuracy**." (line 405)
- "you can learn **thirty new cards per day** and maintain your old cards in exchange for thirty minutes a day" (line 460)
- Start at **15–30 new cards/day** (line 458). Wyner's 60/day Russian summer took ~1hr/day and left months of backlog — an explicit cautionary tale.
- Every review session teaches ~20–30 new + quizzes ~100 due (line 407).
- Cards ≠ words: a single word may be 2–4 cards (line 461).

### The Leitner box schedule (paper SRS, Appendix 3) — a fully specified fallback algorithm

7 levels + "New". Each day: (1) move 15–30 new cards to Level 1; (2) review the levels the schedule names. Remember → level +1. Forget → **all the way back to Level 1**. Past Level 7 = retired (expect >1yr retention).

64-day repeating schedule (line 2589-2595). Effective intervals: L1 daily, L2 every ~2 days, L3 ~4, L4 ~8, L5 ~16, L6 ~32, L7 ~64. Worked example (line 2605-2616): a card seen Day 1 → Day 3 → Day 6 → Day 13 → Day 28 → Day 59 → Day 56 of the next cycle (~2 months).

**Missed days (line 2618):** do the missed reviews **highest level first**, and **skip learning new cards that day**.

### The lapse-recovery doctrine (Ch. 6) — the most product-relevant page in the book

Wyner lost a year of Japanese to a 6,000-card backlog he could never find 30–50 hours to clear (line 1429).

> "When you miss a few days of flash cards, your reviews will pile up... At some point, you'll probably want to take care of that backlog, but **the first day after a lapse is a terrible day to do that.** So don't! Just review **five flash cards** and perhaps learn **one new word** each day. That should be **two minutes** of study, tops."
> "'But…if I only do five reviews today, then I'll have an even bigger backlog tomorrow!' This is completely true and beside the point. **Your top priority right now is the health and safety of your habit, not working through your backlog.**" (line 1457-1461)

Ramp back up **25–50% every couple of days**. Also: while carrying a bloated pile, still learn **2–3 new words/day** — "It will spice things up a bit" (line 463).

### DIY decks: the uncomfortable finding

> "This is not Rosetta Stone. You can't just download a deck of flash cards for your SRS and magically learn a language." (line 413)
> "I give them away for free on my website with the disclaimer that **no one has successfully used them to learn a language**. Of the few thousand people who have downloaded them, no one has tried to refute that claim." (line 424)

Why: the *card creation* is where the memory is formed; the card is only a "practical souvenir" / "dim reminder" of it (line 871, 879). Someone else's card carries no personal choice, so it stays behind the filter. Worse, an ambiguous inherited card records "WHAT does this MEAN? I don't have TIME for this $#*@!" as the memory, which becomes frustration → habit death → "throw your smartphone out the nearest window" (line 427-428).

**This is the single biggest structural threat to a B2B pre-made-content product.** See §11 for the resolution.

Card creation cost: **~15 seconds** for a simple noun (type word, find image); ~1 min/card for grammar cards (line 421, 2076); 1–3 min/word for the full discovery process (line 1952); 2–3 min/word at the advanced/dictionary stage (line 2228).

---

## 3. Pronunciation first (Ch. 3)

### Why first: "broken words"

A word you learned by reading but pronounce wrongly can't be shared between your written and spoken language. Wyner spent years with "sheem" and "skeam" as two separate words (both were *scheme*, line 498). A French class discussed "Dess-CART-eez" and "Dekart" as two philosophers (line 503).

> "when you're not sure about the way your language sounds, you're stuck learning two languages instead of just one" (line 492)

And timing is half of it: "If you wait until later to work on your accent, you will have butchered every word in your vocabulary hundreds (or thousands) of times... If, instead, you work on your accent early, then you will tend to pronounce all your new words correctly. With every new word you learn, you'll reinforce good pronunciation habits" (line 570).

### Minimal pairs + immediate feedback — the rewiring evidence

Japanese adults literally cannot *hear* rock/lock — no neural response in a brain scanner (line 531). Training with no feedback: no improvement, "even after practicing, it remained terrible."

> "another group of participants was placed in the same situation, only this time their computer screens provided **immediate feedback** after each button press. For every correct guess, they saw a green checkmark. For every incorrect guess, they saw a red X. **Suddenly, they began to learn. After three twenty-minute sessions, they had successfully rewired their brains.**" (line 537)

Notes (line 2912): actual results moved ~50% → 70–80% accuracy. Wyner used minimal-pair tests for Hungarian at **20 min/day for 10 days** (line 541).

Downstream payoff (line 543-552): new words no longer sound foreign → easier to memorize; ears sync with native speech → better listening comprehension; you can hear **sound rules** and **rule-breaking**; you can memorize pronunciation accurately from spelling.

### The social/economic argument for accent

> "People with strong foreign accents are frequently treated as less adept at the language (and less intelligent as a person) than they are." (line 564)
> "a good accent can make the difference between a conversation that starts in French and ends in English, and a full conversation in French" (line 599)
> "An accurate accent is powerful because it is the ultimate gesture of empathy." (line 560)

### Mouth training
Three variables only: **tongue position, lip rounding, vocal-cord voicing** (line 582). IPA symbols are literally instructions for those three.

**Back-chaining** (line 584-596): to say a hard word, start at the END and add one sound at a time backwards. `nu → gnu → ognu → rognu → drognu → zdrognu → vzdrognu`. Rationale: you practice the *ending* every rep, so the tail runs on autopilot and you only need attention at the very start. Works for phrases as well as words.

### "More is less" — the learning paradox
Learning MORE about a sound (spelling, mouth position, sibling words) makes it EASIER, not harder. `è` in *mère* = "eh" is one connection; adding `ai` in *lait* = "eh" gives you three (line 641). **Key is relevance** — go deep only on sounds that feel foreign and difficult; skip depth on what you already own (line 643).

### Timeline
- Spanish: ~80 cards, "listen to a few recordings, look at a few example words... and move on" (line 649, 1891)
- Japanese: ~240 cards
- 1–3 hours to build; **3–8 days to learn at 30 min/day** (line 1891)
- Mid-level Tool Kit: "**three to five weeks laser-focused on pronunciation**" before anything else (line 1308)

---

## 4. Vocabulary: frequency, not themes (Ch. 4)

### The frequency argument

- Top 100 words ≈ 50% of everything you read (line 730)
- Top 1,000 ≈ **85% of what you hear, 75% of what you read** (line 743)
- Top 2,000 ≈ **90% heard, 80% read** (line 744)
- 90% general reading comprehension ≈ 5,500 words; 95% ≈ 12,500 (line 748)
- Native adult ≈ 15,000–35,000 word families (line 749, 1565)
- "You're **seventy-nine times more likely** to talk about your mother than your niece. Why not learn mother first and niece later?" (line 732)

### THE domain-specialization finding (most important frequency fact for us)

At 2,000 words you're at 80% comprehension of an academic text. Add just **570 academic words** → **90% comprehension in that context**.

> "You'd need a 5,500-word vocabulary to reach this level of comprehension in every context, but here, in an academic context, you've accomplished the same result with **half the work**." (line 753)

Wyner showed up to a Russian program with the Top 1,000 and wrote a four-page rant on education policy but couldn't write a shopping list — and was placed in the advanced class (line 738-742).

### The 625-Word List
625 concrete, picturable, high-frequency English words (Appendix 5, line 2721+), thematically organized for browsing but **to be studied in ALPHABETICAL (≈ random) order**:

> "Order matters. In grammar books, we learn words in thematic order... This feels comfortable, but **it makes words much harder to remember. They get mixed up.** Is *sept* the word for 'six' or 'seven'? Was *jaune* the word for 'green' or 'yellow'? You can minimize this problem if you learn *green* and *seven* now and *yellow* and *six* later." (line 2733)

2nd-edition revision: learn only the **first 100** of the 625, then go do Island Building, then come back (line 769).

Two special-case markers in the list:
- **Category words** (`animal`, `fruit`, `verb`) → teach with 2–3 member images (animal = dog+cat+fish)
- **Easily confounded images** (`girl/daughter`, `sea/ocean`, `marriage/wedding`, `buy/pay/sell`, `hear/listen`) → disambiguate with a personal name or a second target-language word (daughter + *Mutter*)

### Island Building (the 2nd-edition upgrade)

Metaphor: throwing stones into a lake — pile them in ONE narrow spot so they breach the surface as an island (line 772).

Protocol (line 773-779, 1342):
1. Pick a topic you **absolutely love**, "so important to you that even dumb sentences about it are exciting."
2. Get 15–25 (or 100 via LLM) words on that topic.
3. Build **50–100 sentences of 2–5 words** with a tutor. Each sentence carries **1–3 pieces of new information only**.
4. **Chain reaction** generation: target word `sushi` → *My favorite food is sushi!* → new targets `my, favorite, food, is` → *My wife likes sushi. My favorite sushi is salmon.* → new targets `wife, eats, salmon, love` → and so on until the chain exhausts.
5. Ramp to **50–100 sentences of 3–8 words**, each reusing something already learned.
6. Second island goes much faster; islands interconnect.
7. Then the 625, then the Top 1,000 — each as a *personalized sentence*, not a bare word.

Why it works (line 780-783): (a) constant operation at the 4th level of processing; (b) dense mutual association — "A 200-word island is much easier to build and memorize than 200 disparate words from the 625-Word List."

### The two vocabulary games

**Game 1 — Spot the Differences (Google Images):** search the word *in the target language*, read the captions, look for the gap between what you expected and what you see. Russian *devushka* ("girl") returns bikini chest shots — "and this 'Hm!' is exactly what we're after" (line 810-815). **Limit: 10–20 seconds per word**, hard cap 30 (line 815, 894).

**Game 2 — The Memory Game (personal connection):** spend a few seconds hunting any personal memory. Prompts given (line 898):
- Concrete noun: *When was the last time I saw my mère?*
- Concrete noun: *When's the first time I encountered a moto?*
- Abstract noun: *How has the économie affected me?*
- Adjective: *Am I timide? If not, do I know someone who is?*
- Adjective: *What do I own that's rouge?*
- Verb: *Do I like to courir? Do I know someone who does?*

Write a **short, enigmatic** reminder on the back — "Sally" — so review triggers "Sally?…Oh yeah, Sally has a skirt like that" (line 906-910). Note: even a **failed** search helps — Wyner's *harminckettő* (32) is memorable precisely as "the worst number ever" (line 819).

**Game 3 — Mnemonic Imagery** for nonsensical grammatical groups (gender). Assign a vivid, violent/sexual/funny verb per group: masculine = explodes, feminine = burns, neuter = shatters (line 853-855). 2nd-edition revision — **"Pick a Thing," used REACTIVELY only**:

> "the first step of Pick a Thing is going to be '**DON'T pick a thing.**' Don't do anything fancy until you notice a problem... **Don't pick anything until you're reviewing your old flash cards and you discover that you're struggling to remember them.**" (line 1124-1125)

Then: pick a touchable thing, insert it into the card's story, mark the card wrong so it returns in minutes, test the mnemonic, escalate the story's vividness until it sticks.

### Translation: the actual rule of thumb

Wyner is not a translation absolutist. Google Images caption auto-translation is endorsed; looking up *papier de verre* in a dictionary is fine.

> "**if you put it on your flash cards, it's not in English.** As long as you follow that rule, you'll be okay." (line 893)

Names of people and places on cards are legal (line 912-918).

---

## 5. Grammar through pattern, not drills (Ch. 5)

### Comprehensible input + the language machine

Kids learn from input they can understand — the cookie waved in front of the face is the "universal translator" (line 986). TV alone doesn't work for kids because it lacks that (line 989).

### Developmental stages — the finding that invalidates most curricula

English learners, **regardless of L1 and regardless of teaching method**, acquire in a fixed order (line 996-1002):

1. bare two-word utterances (*Birdie go*, *Doggie jump*)
2. **-ing** (*Doggie jumping* / *He watching television*)
3. **is / copula & auxiliary** (*Daddy is big* / *He is watching*)
4. **irregular past** (*Birdies went* / *He fell*)
5. **regular past -ed** (*Doggie jumped* / *He jumped*)
6. **3rd-person present -s** (*Daddy eats* / *He eats the cheeseburger*)

> "**no amount of drilling a particular grammar rule — I eat, he eats, we sit, she sits — will enable a student to skip a developmental stage. Ever.**" (line 1002)
> "English students usually encounter sentences from the last developmental stages — like *He eats the cheeseburger* — within their first week of classes. They can successfully learn to use a late-stage rule in the slow-paced world of homework and tests, but they **invariably forget that same rule whenever they try to speak.**" (line 999-1001)

Adults **do** retain the language machine; kids only win on input volume (tens of thousands of hours vs a few hundred). "on average, **adults learn languages faster than kids do**" once you control for exposure (line 1004-1007).

### What grammar books ARE for
Not drills — a **source of comprehensible input with a curriculum and a point of view**. Read the explanation, take **one or two favorite examples**, skip 90% of the exercises (line 1024-1025, 1162, 1167). Grammar *rules* are worth learning consciously — "studies show that you'll learn a language faster when you learn the rules" — they just don't accelerate the developmental ladder; they help you decode input (line 1017).

### All of grammar = 3 operations
**Add words** (*You like it → Do you like it?*), **change word forms** (*I eat → I ate*), **change word order** (*This is nice → Is this nice?*). Every language. Even the passive voice decomposes into these (line 1037-1040).

So for each example sentence, ask three questions (line 1043):
1. Any new words?
2. Any new word forms?
3. Is the word order surprising?

### Abstract & function words: define by the blank
> "*by* is the word that fits into *My homework was eaten ___ my dog*. That's what it really means, after all." (line 1050)
> "*Of* is the word that fits into *I'd like a glass ___ water*, and *what* is the word that fits into *___'s your name?*" (line 1051)

Contrast with a dictionary: German *bei* = "for, at, by, on, with, during, upon, near, in, care of, next to" — "Not. Very. Helpful." (line 1054)

### Declension charts
Bad for *learning* a pattern; good for *recognizing* a pattern you already have. Learn the first instance of a pattern via example sentences; then for later members just attach them to the known pattern and put the whole chart on the card's back (line 1076-1078). Generate your own varied stories from the chart (*I am a student* → *She is a doctor*) rather than reciting the chart (line 1070).

### Output = your custom language class
> "The moment you try to write about your upcoming vacation without the word for 'vacation' or the future tense, you learn precisely what bits of language you're missing." (line 1141)
> "**your goal in writing is to make mistakes.** You don't need to craft a perfect essay, and in fact, you'll learn more if you write quickly and mess up a few times." (line 1144)
> "**Put every correction you receive into your flash cards.** ...you need to receive a correction only once, and within a few weeks, it will become a permanent part of your long-term memory." (line 1146)

---

## 6. Interference — the anti-thematic law (Ch. 7)

The single most actionable and most counter-conventional finding in the book.

Evidence:
- 1997 study: memorizing "translations" into a fake language. Related sets (jacket/shirt/sweater) needed **11.3 repetitions**; unrelated sets (frog/car/rain) needed **7.2** — **>35% slower** (line 1490-1492).
- 2008 school study, Turkish kids, 40 unrelated vs 40 related English words: related words remembered worse both immediately and at one week, and quizzes took longer (5.8 min vs 4.9) (line 1493-1495).

> "Ultimately, the effects of interference are dramatic. It can make your language learning **more than 30 percent harder** in terms of learning speed, recall rates, and recall speed." (line 1495)

Worse: the confusion itself wires the confusables together — "your brain will pull them together into a jumbled group of 'fairly confusing French fruits that start with the letter p'" (line 1489).

**Interference sources named (line 1496):** similarly themed words, similar-sounding words, synonyms, **flash cards that use similar pictures**, multiple declensions of the same word.

**Three tools (line 1497-1501):**
1. **Awareness** — develop a "Spidey Sense" that fires at a list of fruits, a group of p-words, a conjugation chart. Wyner interrupts tutors mid-synonym-list: "Stop! No! Just one!"
2. **Time (the big one)** — "do not build new flash cards for all those words in the same session. Focus on only **one word from that group**, and bookmark the others to learn later on, ideally with **at least twenty-four hours between each word**."
3. **Imagery** — make images and stories maximally different across a confusable set. Explicitly including conjugations: don't use eating-a-baguette imagery for all 50 forms of *manger*.

**Multiple languages:** learning two at once is the strongest interference source of all. "No — please, please, please don't do that to yourself." Learn **sequentially**; move to language 2 only once you can converse/watch TV comfortably in language 1 (line 1504-1507).

**Synonyms:** "For your first 625 words, don't learn synonyms. You don't need them... If you encounter a few different translations for a word you want to know, pick your favorite and move on." (line 2009-2010)

---

## 7. Motivation & habit (Ch. 6)

### Cue → Routine → Reward

**Cue** must be *specific*, *attached to a preexisting routine*, and *in your calendar* (line 1417).
- Bad: "I want to study Japanese every day."
- Good: "When I first sit down on the toilet in the morning, I will pull out my phone and review my flash cards." (line 1419)

Method (from Atomic Habits, line 1420-1424): write two lists —
- **List A:** things you do routinely every day (wake up, walk dog, eat dinner)
- **List B:** things that happen to you / that you do randomly many times a day (feel hungry, see my wife, open a door, hear birds)

Then set **two cues**: Cue 1 (from List A) for the main ~20-min session; Cue 2 (from List B) for a spontaneous *just-review-a-couple-of-cards-right-now* micro-session.

**Routine** must be tiny enough to survive a bad day.
> "if your routine is learning just **one to three words per day**, you're not going to need much motivation at all... by starting ridiculously small, you're gaining something much more valuable than a handful of new vocabulary words. **You're gaining automaticity.**" (line 1430-1433)
> "Start so small that it'd be **silly not to** pull out your phone and study whenever you encounter your cue." (line 1434)

**Reward** — verbal celebration, immediately, with the body.
> "there is a reward that is fairly guaranteed to work well regardless of age group or activity: **a verbal celebration that you give yourself the moment you finish your routine**." (line 1442)
> "When I finish my flash cards, I read the screen... then I literally say out loud 'Yes!!' and put both hands in the air." (line 1443)

BJ Fogg's calibration exercise: imagine the dream-job acceptance email arriving. What you'd naturally do in that instant *is* your celebration (line 1445).

Wyner is agnostic-to-negative on extrinsic rewards ("conflicting research about whether certain kinds of rewards can hurt your motivation in the long term," line 1440). But the SRS is **intrinsically** rewarding: overcoming a difficult card feels good, new cards are micro-rewards, the pending-count hitting zero is relief (line 1439). And the headline emotional payoff:

> "your daily reviews become enjoyable, because most of your time is spent saying to yourself, '**Holy sh*t! I can't believe I still remember that! I am a rock star!**' It's a daily self-esteem booster that happens to teach you a language at the same time" (line 432)

**Bomb-proofing (see §2 lapse doctrine).** Frame it as arithmetic, not morality: "your habit is currently in danger, and that's due to a **math problem rather than a moral one**" (line 1453). Decide the backup plan *today*, while motivation is high, so no decision is needed on the bad day.

**Never stop learning new cards.** "I did my daily reviews, but I stopped learning new flash cards. **It got boring fast.** ...flash card reviews are fun only when you're learning new things at the same time." (line 1690)

---

## 8. Yerkes–Dodson: tuning stress (Ch. 7)

Some stress is required for learning; too much destroys it. Self-assessment ladder (line 1541):
- relaxed / laid back → **too easy**
- challenged and engaged → **just right**
- fatigued → **verging on too hard**
- exhausted, anxious, or angry → **reduce difficulty now, burnout risk**

Three levers (line 1544-1557):
1. **Vocabulary level** of the material
2. **Duration** — "if you want to listen to that same podcast for **sixty seconds**, you're not going to be nearly as stressed"
3. **Goal** — the underused one. A ladder of legitimate goals:
   - identify **1–7 words or phrases per minute** that you recognize
   - get the gist of the paragraph/section
   - get the gist of each sentence
   - deeply understand each sentence (~90%)
   - fully understand every word

> "By modifying your goal and simply **giving yourself permission to not understand**, you can drop the stress and difficulty of a reading or listening session dramatically." (line 1557)

Reading target: **85–95% known words on a page** — the band where context alone teaches you the rest (line 1573-1574). A single novel teaches 300–500 words from context; you acquire an unknown word ~10% of the times you meet it (line 1568-1569).

Listening rules (line 1596-1609): **TV series > film** (you only have to figure out who's who once). **No subtitles** — L1 subtitles make it "an English storybook with some foreign-language background noise"; L2 subtitles are useful input but train reading, not listening. **Avoid comedy** (puns and dialect). Dial difficulty down by pre-reading the episode summary in the target language, or 0.75×/0.5× playback speed.

---

## 9. Taboo — the definition of fluency, and a teachable skill (Ch. 7 + Appendix 6)

> "**Fluency, after all, isn't the ability to know every word and grammatical pattern in a language; it's the ability to communicate your thoughts without stopping every time you run into a problem.**" (line 1621)
> "**This is the most important activity in this book.** Everything we've done until now has been designed to help you reach this point." (line 1623)

One rule: **no L1 allowed.** The moment a thought arrives without the words to express it is "the moment that matters most. Seize it!" (line 1622)

External barrier: people who switch to English on you — including native speakers who want to practice their English. "Don't do it. Find other people to hang out with." (line 1625, 1658)

### The Taboo strategy toolkit (Appendix 6, line 2813-2838)
Wyner recommends **~20 minutes of a tutoring session per strategy**, learned one at a time, then combined.

| Strategy | Examples | Key phrase to learn |
|---|---|---|
| **Opposites** | white → opposite of black; teacher → opposite of student | *What's the opposite of ___?* |
| **Not That** | sun → not cold, not at night, not the moon | *It's not ___, so what is it?* |
| **Purpose** | hammer → nail hitting tool; oven → hot cookie machine; umbrella → fights rain | *What is it used mainly for ___?* |
| **Attributes** | snow → cold, white, soft; rose → red, good smell, pain in fingers | *This is something that's ___. What is it?* |
| **Typical Actions** | knife → cuts and slices; clock → tells time | *This can do ___. What is it?* |
| **Common Pairs** | bread → with butter; bed → with pillow | *What often goes with ___?* |
| **Similarities** | joyful → word like happy | *Can you tell me another word for ___?* |
| **Show, Don't Tell** | eating → mimic chewing | *What's this called? [gesture]* |
| **Visual Clues** | cup → hold up the actual cup | *What's this called? [show image]* |
| **Sound-Alikes** | mouse → rhymes with house | *It rhymes with ___ / starts with ___* |
| **Sound Effects** | train → choo-choo | *What makes a sound like this?* |
| **Find the Category** | sedans, coupes, convertibles → car | *What group includes ___?* |
| **Find the Subcategory** | music → rock, jazz | *What are some types of ___?* |

The illustrative exchange (line 2816) — asking for *water* by calling it "the opposite of cup" and still getting there — is the whole point: "**Our minds are so creative, and so capable of making leaps, that these tools become far more powerful than they have any right to be.**"

### Utility phrase sets (Appendix 6, line 2796-2811)
Learn these **within the first few sessions**, then use them forever.
- *Translation:* How do you say this in ___? / What is ___ in ___? / Can you explain that in ___?
- *Comprehension:* I didn't understand. / Can you say that again? / Can you say that more slowly? / Can you write that down? / What does that mean? / Could you explain that a different way?
- *Correction:* What's the correct pronunciation? / Can you spell ___ for me? / Does this sound natural? / Can you correct my mistakes? / Can you give me an example? / What's the difference between ___ and ___? / I'm looking for a new word. I'll describe it: ___

### Self-compassion (the Comfort Exercise)
Early-intermediate learners speaking 30 seconds to 80 people report "I feel embarrassed / that was really hard / I feel dumb." The intervention is Kristin Neff's **Common Humanity** (line 1636-1644):
1. **Name** the feeling ("When I make mistakes, I feel inept").
2. **Normalize** it — do NOT argue it away ("It's common and normal to feel inept when we make mistakes"). Dismissing the emotion doesn't help.
3. **Imagine a friend** in your situation; give them compassion first, then your honest admiration for what they're attempting.
4. Turn that on yourself.

> "you know that your speaking partner isn't going to shame you for your mistakes... **Nothing is going to break, and so you can experiment with yourself.**" (line 1646)

The beginner who won the exercise said, in Spanish, "No saber mucho palabras! … Y eso…todo palabras que saber!" and grinned. That is the target emotional state: **play, not exercise** (line 1647-1650).

---

## 10. The Gallery — card specifications

### Two design principles (line 1794)
1. **Many simple cards are better than a few complex cards.**
2. **Always ask for one correct answer at a time** — and **any correct answer counts as correct**.

### Review mechanics (line 1856-1864)
- **5–10 seconds** to recall before flipping.
- Each card type declares **Essential Facts** (must recall → pass) and **Bonus Points** (nice-to-have connections; failing them still counts as a win).
- On failure: immediate feedback, card returns to Level 1 / "I forgot".
- On success but with bonus misses: still congratulate; spend a few seconds forming a connection for next time.

### Three tracks (line 1808, 1954-1965)
| Track | Who | Cards per item |
|---|---|---|
| Intensive | first-timer on a distant language (Ch/Ja/Ko/Ar) | 3 |
| Normal | first-timer on a near language | 2 |
| Refresher | intermediate / heritage speaker | 1 |

Caveat: **absolute beginners in any language should start with all three**, because early cards do double duty teaching the phonetic system. Wyner dropped Hungarian spelling cards after 240 words (line 1965).

### Gallery 1 — Pronunciation (Ch.3 cards)
- **Type 1:** [spelling in an example word + picture] → what sound? (recording of the *whole word*, not the isolated phoneme — isolated phonemes are hard to record and hard to say)
- **Type 2:** [recording / IPA of the example word] → how do you spell it? (no bonus points; spelling is complex enough)
- Pick example words that are **easy to visualize** (p is for pizza, gn is for gnocchi).

### Gallery 2 — First words (Ch.4 cards)
- **Type 1 — Comprehension:** target word (+ audio) → picture meaning + can you say it? [all tracks]
- **Type 2 — Production:** picture → what's the word? say it out loud [Normal + Intensive]
- **Type 3 — Spelling:** picture + pronunciation → spell it [Intensive]
- Essential facts include gender (if applicable); bonus points are personal connection + related/similar-sounding words.
- Special cases: multiple definitions (any definition correct); synonyms (avoid; if forced, pick a favorite for the picture→word direction); **category cards** (animal = pig + fish + goat images); **easily confounded images** (add a personal name, or a second L2 word: *Tochter* + *Mutter*, *Nichte* + *Tante*).
- Optional but useful: **letter-name cards** (How do you pronounce the letter D? → "Dee") so you can spell your name aloud and understand spellings said to you (line 1982).

### Gallery 3 — Sentences (Ch.5 cards)
Per sentence, three families of cards:

**New Word cards**
1. Which word fits in the blank? `He lives ___ New York City` → *in*
2. What's a sentence/phrase that includes this word? `in` → *He lives in New York City* (a fragment counts)
3. Which word fits into this *other* blank? `The Cat ___ the Hat` → *in* (this is how you learn multiple senses)
4. How do you spell it? (rarely needed outside logographic languages)

**Word Form cards** — identical, but with the base form as a hint: `He ___ in New York City (to live)`

**Word Order cards** — remove a word; where does it go? `Lives in New York City` + [He] → *He lives in New York City.* Start with **2 per sentence**, taper as intuition develops. No bonus points.

Cards/item: Intensive 2–4 + 1 word-order; Normal 2–3 + 1; Refresher 1.

Special scenarios:
- **Eliminating clues:** `She was holding an ___ rifle` gives away the vowel — strip the *an* to make it honest (line 2204).
- **When stumped:** fall back to a plain fill-in-the-blank + picture; slightly harder to recall but always works (line 2211).
- **Short formulaic phrases** ("You're welcome"): either atomize into words or learn the whole chunk — both are legal; Wyner prefers atomizing when possible (line 2194-2201).

### Gallery 4 — Advanced vocabulary (Ch.7)
Adds a **short monolingual definition (<10 words)** to the sentence + picture. Yields ~3–5 extra passive-vocabulary words per card studied (line 2223-2228).

---

## 11. APPLIED — what Inglés Hotelero should concretely build, change, or stop

### A. Content model changes (highest leverage, lowest cost)

**A1. Tag every lexical/phrase item with an `interference_group` and enforce a scheduler constraint.**
Groups for hospitality: `room_types`, `amenities`, `bathroom_items`, `cutlery_tableware`, `numbers_1_20`, `numbers_ordinal`, `days_week`, `months`, `colors`, `directions_prepositions`, `payment_terms`, `complaint_verbs`, `beverage_types`, `breakfast_items`, `hotel_areas`, `time_expressions`, `polite_formulas`, `similar_sounds_*`.
Hard rules: (a) never introduce two NEW items from the same group in one session; (b) enforce **≥24h** between new items from the same group; (c) never present two cards from the same group in the same review batch if both are still at low SRS levels; (d) never reuse the same image across a group.
Expected effect: 30%+ improvement in learning speed and retention, at zero learner-time cost. **This alone justifies a content-model migration.**

**A2. Stop shipping thematic units. Reorder the whole catalog.**
"Unit: Los tipos de habitación," "Unit: El desayuno," "Unit: Los números" are exactly the anti-pattern. Replace with an **interference-aware shuffled frequency ordering** per role. Keep thematic grouping only as a *browsing/marketing* view (the HR director wants to see coverage), never as the *delivery* order.

**A3. Build "Las Primeras 400" per role — a hospitality frequency list.**
Analogous to the 625, but derived from actual on-shift utterances. ~150 shared core + ~250 role-specific for recepción / botones / restaurante. Selection criteria copied from Wyner: **concrete, picturable, high-frequency, one sense each, no synonyms.** Justification for the buyer is the 570-academic-words math: a small domain list on top of a small general base buys 90% in-context comprehension for half the work of general fluency.

**A4. Kill synonym clusters at A1–A2.**
No "restroom / bathroom / toilet / WC" lesson. One word per concept per role. Reintroduce synonym discrimination only at B1+, with monolingual-style definitions.

**A5. Kill conjugation tables as content.**
No "to be: I am / you are / he is" screen. Instead: one *varied story* per form, spaced across days, with **deliberately different imagery per form**.

**A6. Auto-flag content by retention anomaly.**
Wyner: "our brains appear to be really bad at remembering bad information" — a card he could never retain usually turned out to have an error (line 1282). Instrument per-item retention across the cohort; any item whose retention sits >1.5σ below its level-peers gets auto-queued for content review (bad audio, wrong image, ambiguous cloze, unnatural phrasing). Cheap, continuous, and nobody in this market does it.

### B. Pronunciation-first module (new build, high leverage)

**B1. Ship a Spanish→English minimal-pair trainer with binary green-check/red-X feedback.**
Evidence: 3 × 20-minute sessions rewired Japanese adults' r/l perception; Wyner did Hungarian in 20 min/day × 10 days. Our budget: **60–90 seconds/day for the first 10–14 days**, then a persistent ~20% slice of the daily session.

The Spanish-L1 pair inventory is finite and well known:
- `/b/ – /v/`: berry/very, boat/vote, bat/vat
- `/s/ – /z/`: rice/rise, price/prize, bus/buzz *(Spanish has no /z/)*
- `/ʃ/ – /tʃ/`: sheep/cheap, shoe/chew, wash/watch
- **`/iː/ – /ɪ/`: sheet/sh*t, beach/b*tch, piece/p*ss, leave/live, seat/sit, feel/fill** ← highest business stakes
- `/æ/ – /e/ – `/ʌ/`: bad/bed, man/men, cat/cut
- `/d/ – /ð/`: day/they, dough/though
- `/j/ – /dʒ/`: yellow/Jell-O, year/jeer
- `/h/` vs Spanish `/x/`: hello vs "jello"
- **`/s/+consonant onset epenthesis`**: *stay* vs "estay", *Spanish* vs "eSpanish", *school*, *street* ← pure production issue, extremely common, extremely audible
- final consonant clusters: *asked*, *worked*, *sixth*, *guests*

**B2. Use the /iː/–/ɪ/ pair as a sales asset, not just a lesson.**
"Bring you a clean sheet" vs the slur; "the beach" vs the slur. Frame for the HR director as **guest-complaint prevention**. This is a concrete, demonstrable, non-abstract reason a GM buys pronunciation training — and it's a 30-second demo.

**B3. Attach a 15–20 second "cómo se hace este sonido" clip** (tongue / lips / voicing) to each hard phoneme. Per "more is less," this *reduces* total time rather than adding to it. Priority: /θ/ (think), /v/, /z/, /ɪ/, /æ/, initial /s/-clusters.

**B4. Ship back-chaining as a production drill.**
Long service utterances are exactly where a Spanish speaker's tongue jams. Build the drill backwards:
`…to your room` → `…your luggage to your room` → `…bring your luggage to your room` → `Would you like me to bring your luggage to your room?`
This is a differentiated, visibly-effective mechanic nobody in edtech ships.

**B5. Binary feedback for perception, generous graded feedback for production.**
The green-check/red-X result is specifically about *perception* (objective, binary). Never put a red X on a learner's recorded voice. Production feedback opens with what worked.

### C. SRS engine parameters

**C1. Intervals.** Graduating steps ≈ **2–4 days → 9 days → 3 weeks → 2 months → 6 months → years.** Lapse → back to the short end. (If using FSRS/SM-2, target these as the effective early intervals rather than the default 1d/10m steps.)

**C2. Grading buttons: three, not four.** `No me acordé` / `Me costó` / `Fácil`. **Design the copy and micro-animation to celebrate `Me costó`**, because that's the state with the highest retention payoff. `Fácil` should visibly push the card far into the future ("no te molestamos con esta en 3 meses").

**C3. Enforce think-time.** Minimum ~4–5s before the reveal control becomes prominent; encourage the 5–10s recall window. Do not auto-reveal. The tip-of-the-tongue moment is worth 2× retention and our UI must not steal it.

**C4. Any-correct-answer-is-correct.** Our AI production scorer must accept functional equivalents ("Right away, sir" for "Certainly, sir"; "I'll bring it" for "I will bring it up"). Failing a valid alternative is the fastest way to poison the habit.

**C5. Daily volume, honestly computed.** At **5 minutes/day**, sustainable throughput ≈ **3–5 new cards + 15–25 reviews**. At 2–3 cards per item that is ~1.5–2 new *items*/day → **~150–200 items retained at 90%+ in 90 days**. That is enough for a role-specific working repertoire and we should publish that math. Offer an optional "sesión larga" (15 min) for the motivated minority — Wyner's binges are where his outliers come from.

**C6. Never surface the total backlog number.** Cap the visible queue (e.g., 20). Wyner's own 6,000-card pile killed a year of Japanese.

**C7. Ship a formal Re-entry Mode.** After any lapse ≥2 days: **5 reviews + 1 new item ≈ 2 minutes**, no backlog shown, ramp **+25–50% every 2 days** until normal. On resumption, order reviews **highest-level-first** and **suspend new-card intake for that day** (Leitner rule, line 2618). Copy must frame it as arithmetic, not failure: *"Bajamos la barra. Hoy son 2 minutos."*

**C8. Precompute and prefetch tomorrow's queue (audio included) on wifi.**
The SRS is "just a fancy to-do list" — it is computable ahead of time. For a prepaid-data mid-range Android, this converts our offline service worker from post-MVP nicety to **habit-critical infrastructure**: a day missed for lack of data becomes a lapse, and lapses compound into habit death.

**C9. Never stop introducing new items,** even during maintenance/backlog. 2–3 new/day minimum. Pure review is boring and boredom kills the habit.

### D. Card design for our catalog

**D1. No Spanish on the recall side. Ever.** Adapt Wyner's rule verbatim: *si va en la tarjeta, no va en español.* Spanish is legal in: the initial teaching reveal, grammar explanations, instructions, coach/tutor messages, and the HR-facing layer. Illegal on the front or back of a recall card. Names of people/places are legal.

**D2. Card taxonomy for hospitality (map of the Gallery):**
| # | Type | Front | Back | Level |
|---|---|---|---|---|
| 1 | Comprehension | audio of guest utterance | situation image + meaning | all |
| 2 | Production | situation image (+ 3-word Spanish-free cue) | target utterance + audio; learner says it aloud | A1/A2 |
| 3 | Minimal pair | audio | which word? (binary) | A1 early |
| 4 | Cloze in a real utterance | *"Would you like me to ___ your bags?"* + image | *take* | all |
| 5 | Word order | scrambled utterance + missing word | full utterance | A1/A2 |
| 6 | Letter names / spelling aloud | "spell this guest's name" | audio + letters | **recepción only** — real job task |
| 7 | Taboo / Rodeo | "you don't know the word for X — get it across" | model circumlocution | A2+ |

Track depth by CEFR: **A1 = 3 cards/item, A2 = 2, B1+ = 1.**

**D3. Engineer the personalization moment — the answer to "pre-made decks don't work."**
This is our biggest structural risk and it is solvable. Add a mandatory **~10-second choice** at first exposure of every item. Any ONE of:
- **Pick 1 of 4 images** from our curated hospitality bank. (The *choosing* is the load-bearing part, not the image quality.)
- **Tap a name** from the learner's own list (their supervisor, their hotel, their city, a coworker) to be inserted into the example.
- **Record their own voice** saying it (also gives us the production rep).
- **Answer a Memory-Game prompt** — the hospitality translations of Wyner's prompts:
  - *¿Cuándo fue la última vez que un huésped te pidió esto?*
  - *¿En qué parte del hotel pasa esto?*
  - *¿Quién de tu equipo hace esto mejor?*
  - *¿Te ha pasado algo raro con esto?*
  Store a 3-word enigmatic reminder on the card back. Documented **+50% retention** for ~10 seconds of work.

**D4. Property-specific image packs — a genuine advantage over Wyner's method.**
Ask the buying property for 30 photos during onboarding (lobby, front desk, restaurant, pool, room types, uniform, staff areas). Now every card is about *their* hotel. This beats Google Images on personal connection and simultaneously creates a switching cost and a "hecho para su hotel" sales story. Falls out of the same 10-second choose-an-image UI.

### E. Sequencing / curriculum

**E1. Session structure (5 minutes, WhatsApp or PWA):**
```
0:00–0:20  Cue arrives; one-tap open
0:20–1:20  Ear training (2–4 minimal pairs, binary feedback)   ← weeks 1–2 heavy, then ~20%
1:20–3:20  SRS reviews (12–20 due cards, mixed types)
3:20–4:30  1–3 NEW items, each with the 10s personalization choice
4:30–4:50  One production/Taboo rep (record 1 utterance OR 1 rodeo)
4:50–5:00  Self-celebration prompt + "recordaste X que casi olvidas"
```

**E2. Learning-path order, per Wyner's sequence, adapted:**
1. **Weeks 1–2 — Sonido.** Minimal pairs + the ~40 phoneme/spelling patterns + **the Utility Phrases** (which double as survival phrases). *This is the change our exam/onboarding flow doesn't currently make.*
2. **Weeks 2–6 — Isla 1: "tu primera hora de turno."** 50–100 utterances of **2–5 words** that they will literally say in the first hour of a shift. Image + audio + personalization. No grammar taught explicitly.
3. **Weeks 6–10 — Isla 2: personal.** Learner picks a topic they love (fútbol, su familia, su pueblo, música). Wyner is emphatic this doubles learning speed. The buyer still wins — the grammar and function words transfer.
4. **Weeks 10–16 — Isla 3: "las quejas."** Complaints/problems — highest stakes, highest anxiety, highest guest-satisfaction impact. Also where Taboo matters most.
5. **Ongoing — Las Primeras 400** in interference-shuffled order, delivered as short personalized sentences (3–8 words), never as bare word lists.

**E3. Sequence production targets by acquisition order, not textbook order.**
Our scoring rubric and our level definitions should use the developmental ladder:

| Stage | Target | Expected at |
|---|---|---|
| 1 | formulaic chunks, bare stems: *Good morning. Follow me, please. Room 305.* | A1 |
| 2 | -ing: *I helping you / I am helping you* | A1–A2 |
| 3 | copula/aux is/are: *Your room is ready* | A2 |
| 4 | irregular past: *I brought your bags* | A2–B1 |
| 5 | regular past -ed: *I called housekeeping* | B1 |
| 6 | 3rd-person -s, articles: *He wants extra towels* | B1–B2 |

**Never penalize a learner for a not-yet-acquired stage.** Our current rubric's "for A1-A2 be GENEROUS, never 0 if they attempted English" is directionally right — this makes it *principled* and gives us an honest answer to the HR director asking "why is he still saying *he want*?" Answer: because no human acquires that before the earlier stages, and drilling it cannot change the order.

**E4. Formulaic chunks count as full credit.** Island Building explicitly endorses memorized 2–5 word phrases. "Right away, sir" is a legitimate A1 success, not a crutch.

### F. Habit / motivation / retention

**F1. Replace calendar-time cues with a shift-invariant personal anchor.**
Our learner works rotating shifts; "9am daily" is structurally wrong. Onboarding question: *"¿Qué haces siempre, todos los días, sin falta?"*
Options: me pongo el uniforme · marco entrada · mi primer café · termino mi turno · espero el transporte · me quito los zapatos al llegar a casa · antes de dormir.
Schedule the WhatsApp nudge relative to that; let them re-anchor in one tap when their shift changes.

**F2. Ship the second, spontaneous cue.**
Wyner's "Cue 2" (from the random-events list) → a **single-card, one-tap WhatsApp micro-review** they can do while waiting for the elevator. 20 seconds. This is a native fit for WhatsApp and a real differentiator: a review that costs less than opening an app.

**F3. Rebuild the reward around recall pride, not streak points.**
- Surface **"Recordaste 4 cosas que casi habías olvidado"** at the end of each session — that's the actual dopamine mechanism, and it's more honest than a point total.
- Add a **self-celebration prompt** at session end (BJ Fogg): a one-tap "¡Sí!" with a satisfying micro-animation, or better, a 2-second voice reaction. Emotional intensity of the reward drives habit speed.
- **Deprioritize / de-emphasize the streak counter.** And absolutely **kill streak-loss shaming**. Wyner's food-poisoning section is the direct refutation: a lapse should *lower the bar*, not punish. Our copy on day-3 of an absence should be *"Bajamos la barra: hoy son 2 minutos"* — not *"Perdiste tu racha de 15 días."*

**F4. Tiny non-negotiable floor.** The "completed today" threshold should be **1 new item + 5 reviews**, not a time or point target. Everything above the floor is bonus. Report the *floor* streak to HR, not the aspirational one.

**F5. Never make the bilingual supervisor the teacher.**
Wyner's "don't let your partner be your teacher" (line 1329-1335) transfers: correcting requires distance and attention to *form* over *content*, which is exhausting and relationship-damaging. If we add a peer/supervisor feature, make it **encouragement and Taboo practice partner**, never the corrector. Correction is the AI's job.

**F6. Ship the Common Humanity script.**
After a learner's first few speaking attempts, and after any low-score run, deliver a short normalization: *"Es normal sentirse tonto cuando uno se traba. Casi todos lo sienten. Llevas 3 semanas y ya estás hablando con un huésped — eso es valiente."* Do not argue the feeling away; name it, normalize it, then admire the attempt. This directly targets our documented learner state ("may feel embarrassed," "low prior success with school-style English").

### G. Taboo module — our sharpest differentiator vs Duolingo

**G1. Build "Rodeo" (dar rodeos / explicar con otras palabras).**
Duolingo will never teach you to get around a missing word. But *not knowing a word in front of a guest* is our learner's #1 real-world failure mode, and it currently resolves as: freeze → switch to Spanish → fetch a coworker. Taboo fixes exactly that, and it's achievable at A2.

Train one strategy per week from the Appendix-6 table, with hospitality drills:
- Purpose: *"It's for opening the door"* → key card
- Attributes: *"Small, white, for the bathroom"* → towel / soap
- Typical actions: *"It cleans your clothes"* → laundry service
- Common pairs: *"It goes with coffee"* → milk, sugar
- Opposites: *"The opposite of hot"* → cold water
- Show/Visual: **point, gesture, show it on your phone** — fully legal and highly effective face-to-face; teach it explicitly
- Category/subcategory: *"It's a kind of room"* → suite

**G2. Change the primary success metric.**
Score **"¿resolviste la interacción sin cambiar a español?"** — not "¿usaste la palabra correcta?". That is Wyner's definition of fluency, it's the buyer's actual KPI (guest satisfaction, fewer escalations), and it's reachable months earlier than lexical accuracy. This should appear on the HR dashboard as a headline number.

**G3. Ship the Utility Phrases as the very first content.**
*One moment, please. / Let me check. / I'm sorry, could you repeat that? / Could you speak a little slower, please? / Let me write that down. / How do you say ___ ? / Let me get someone who can help.*
These are simultaneously survival phrases, face-saving devices, and the tools that keep the interaction in English. Week 1, before any vocabulary.

### H. Input / listening / reading

**H1. Constrain listening content to 85–95% known words** against the learner's actual known-item set. This is computable — we generate/select drill audio, so we can enforce it. Adapt as their inventory grows.

**H2. Tiered, self-selected listening goals** instead of binary pass/fail:
`Reconocí 2 palabras` · `Entendí de qué se trata` · `Entendí casi todo` · `Entendí cada palabra`. All are legitimate wins. This is the underused third Yerkes-Dodson lever.

**H3. No Spanish subtitles on listening drills.** L2 captions may be shown for the *first* pass only, then removed. Reading is easier than listening and will silently substitute for it.

**H4. Duration as the difficulty dial.** 20-second clips before 60-second ones. Never open with a long one.

**H5. Instrument a self-reported difficulty signal** ("¿Cómo se sintió?" → relajado / bien / cansado / agobiado) and adapt vocabulary level + duration accordingly. Wyner explicitly notes emotional monitoring is a learned skill worth practicing.

### I. Roadmap implications

**I1. Do NOT let a learner run two languages at once.** Our stated ambition to expand to other languages must be sequenced per-learner: English to conversational competence first, then the next language. Cross-language interference is "maddeningly unavoidable" and is the strongest interference source in the book.

**I2. The HR/classroom relationship.** Appendix 7's stance transfers cleanly to our B2B setting: an existing corporate English class or a bilingual trainer is a **resource, not a competitor**. Position Inglés Hotelero as the retention layer that makes their existing training stick — "turn every correction your trainer gives into a card you'll never forget again." That's a much easier sale than "replace your training."

**I3. Honest scoping of claims.** FSI: Spanish↔English are mutually Category 1, ~600–750 hours to professional working proficiency (Appendix 2). We are not promising fluency at 5 min/day. We promise **job-task competence in a defined role repertoire**, with the 90-day math from C5. Say the real number; it's still remarkable and it's defensible.

---

## 12. Anti-patterns — things this book says NOT to do that we (and every competitor) do by default

1. **Thematic units** — colors together, numbers together, room types together, amenities together. 30%+ penalty. The single most common curriculum mistake.
2. **Translation pairs on the recall card** (`cama = bed`). Strips the "symphony," trains decoding instead of thinking.
3. **Teaching synonyms early** ("hay varias formas de decirlo").
4. **Conjugation/declension charts as lessons**, and grammar drills generally — they cannot make anyone skip a developmental stage.
5. **Rote repetition / "repítelo 5 veces"** — overlearning does nothing for long-term memory.
6. **Fully pre-made decks with zero learner choice** — the creation moment is where the memory forms.
7. **Showing the backlog after a lapse**, and **streak-loss shaming** — the documented habit-killer.
8. **Big daily goals** ("20 minutos al día") instead of a ridiculously small non-negotiable floor.
9. **L1 subtitles on listening practice** (and L2 subtitles for pure listening training).
10. **Comedy as listening content** — puns and dialect wreck comprehension and morale.
11. **Teaching and grading late-acquisition grammar early** (3rd-person -s, articles) — and penalizing its absence at A1/A2.
12. **Fast auto-reveal** of the answer — steals the tip-of-the-tongue window worth 2× retention.
13. **Marking a reasonable alternative answer wrong.**
14. **Reusing the same imagery across a word family, a conjugation set, or an interference group.**
15. **Optimizing for "easy" reviews / high accuracy** — a too-easy card is wasted time; difficulty is the mechanism.
16. **Music as listening practice** — we don't listen to songs for the story.
17. **Making a bilingual colleague/supervisor the corrector.**
18. **Learning two target languages simultaneously.**
19. **Pausing new-card intake during maintenance** — pure review gets boring fast and the habit dies.
20. **"Englishy" phonetic respelling** (the *bawn-JURE* problem) — for us, writing English pronunciation in Spanish orthography ("uód llu láik") teaches broken words. Use audio + a consistent notation instead.
21. **Front-loading grammar explanation before sound.** Wyner explicitly opens Chapter 3 with "I'm about to tell you not to open your grammar book."

---

## 13. Quick-reference parameter table

| Parameter | Value from the book | Our adaptation (5 min/day) |
|---|---|---|
| New cards/day | 15–30 (start), 30 sustainable at 30 min | 3–5 cards ≈ 1.5–2 items |
| Review session | ~30 min for 30 new + ~100 due | 2 min, 12–20 due, capped |
| Interval ladder | 2–4d → 9d → 3w → 2mo → 6mo → yr+ | same |
| Optimal delay | 10–20% of target retention horizon | same |
| Recall window before flip | 5–10 s | enforce ≥4 s |
| Time per new word (discovery) | 15 s (simple noun) – 3 min (advanced) | 10 s personalization choice |
| Google Images per word | 10–20 s, hard cap 30 | 4 images, one tap |
| Cards per item | Intensive 3 / Normal 2 / Refresher 1 | A1 3 / A2 2 / B1+ 1 |
| Ear-training dose | 20 min/day × 10 days (Hungarian); 3×20 min (r/l study) | 60–90 s/day × 14 days |
| Pronunciation phase | 3–8 days (Spanish, ~80 cards) to 3–5 weeks | 2 weeks, interleaved |
| Interference spacing | ≥24 h between confusable new items | hard scheduler constraint |
| Island size | 50–100 sentences of 2–5 words, then 50–100 of 3–8 | same |
| Sentence novelty budget | 1–3 new pieces of info per sentence | same |
| Reading comprehension band | 85–95% known words | same, computed per learner |
| Lapse re-entry | 5 reviews + 1 new ≈ 2 min; +25–50% every 2 days | same, automated |
| Post-lapse review order | highest level first; skip new cards that day | same |
| Retention target | 90–95% accuracy | same |
| Words → comprehension | 1,000 ≈ 85% heard / 75% read; 2,000 ≈ 90/80 | domain list beats general |
| Domain shortcut | +570 domain words on 2,000 → 90% in-context | ~400 role words is our thesis |

---

## 14. Verification anchors

| Claim | Location in `fluent-forever.txt` |
|---|---|
| Three keys (pronunciation first, no translation, SRS) | Ch. 1, line 107 |
| Levels of processing / 6× PIZZA / 50% personal connection | Ch. 2, lines 268–271, 296 |
| Image recall 98.5% / 83% of 10,000 | Ch. 2, lines 292–294 |
| Testing 5:1 over studying | Ch. 2, footnote, line 477 |
| Tip-of-tongue = 2× retention | Ch. 2, line 353 |
| Interval ladder | Ch. 2, line 402 |
| 10–20% of test delay rule | Ch. 2, footnote, line 482 |
| 3,600 cards / 4 months / 30 min / 90–95% | Ch. 2, line 405 |
| Pre-made decks don't work | Ch. 2, lines 413, 424 |
| Minimal pairs + green check/red X rewiring | Ch. 3, lines 531–541; notes at line 2912 |
| Broken words (scheme/Descartes) | Ch. 3, lines 498–503 |
| Back-chaining | Ch. 3, lines 584–596 |
| "More is less" learning paradox | Ch. 3, lines 620–643 |
| Frequency: 1,000/2,000/5,500/12,500 words | Ch. 4, lines 743–748 |
| +570 academic words → 90% in-context | Ch. 4, lines 750–753 |
| Study the 625 alphabetically, not thematically | App. 5, line 2733 |
| Island Building protocol + chain reaction | Ch. 4, lines 772–783; Ch. 6, line 1342 |
| Spot the Differences / Memory Game prompts | Ch. 4, lines 805–826, 898 |
| "if it's on your flash cards, it's not in English" | Ch. 4, line 893 |
| Pick a Thing (reactive mnemonics) | Ch. 5, lines 1124–1131 |
| Developmental stages / drills can't skip them | Ch. 5, lines 996–1003 |
| Three grammar operations | Ch. 5, line 1037 |
| Define function words by the blank | Ch. 5, lines 1050–1051 |
| Turn every correction into a card | Ch. 5, line 1146 |
| Cue/routine/reward; two-list cue selection | Ch. 6, lines 1408–1445 |
| 1–3 words/day; automaticity | Ch. 6, lines 1430–1435 |
| Lapse recovery: 5 cards, 2 minutes | Ch. 6, lines 1457–1462 |
| Interference: 11.3 vs 7.2 reps; >30% harder | Ch. 7, lines 1490–1495 |
| Interference tools: awareness, ≥24h, imagery | Ch. 7, lines 1497–1501 |
| Don't learn two languages at once | Ch. 7, lines 1504–1507 |
| Yerkes–Dodson ladder + 3 levers + goal ladder | Ch. 7, lines 1532–1557 |
| 85–95% reading comprehension band | Ch. 7, lines 1573–1575 |
| No subtitles; TV series > film; avoid comedy | Ch. 7, lines 1596–1609 |
| Taboo = the most important activity | Ch. 7, lines 1613–1625 |
| Common Humanity / self-compassion | Ch. 7, lines 1628–1650 |
| Two card design principles | Gallery, line 1794 |
| Three tracks | Gallery, lines 1808, 1954–1965 |
| Word/word-form/word-order card types | Gallery 3, lines 2086–2174 |
| Eliminating clues / when stumped | Gallery 3, lines 2202–2215 |
| Leitner 64-day schedule + missed-day rule | App. 3, lines 2582–2618 |
| Taboo strategy table + utility phrases | App. 6, lines 2787–2838 |
| Classroom course = a resource, not a rival | App. 7, lines 2864–2878 |
