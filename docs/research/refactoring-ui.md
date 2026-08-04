# Refactoring UI (Adam Wathan & Steve Schoger) — mined for Inglés Hotelero

**Lens:** concrete visual design craft for the *employee PWA* — hierarchy, spacing systems, type
scale, color usage, depth, empty states, and making a small simple UI feel designed rather than plain.

**Method:** read the complete extracted text (1,866 lines, all 8 parts + TOC), then audited the
live employee-facing code against it with line references. Every finding below is checked against
real files, not asserted from memory. Contrast ratios were computed by hand from the actual hex
tokens in `tailwind.config.ts` / `globals.css`.

Files audited:
- `src/app/globals.css`, `tailwind.config.ts`
- `src/app/practice/page.tsx`, `src/app/practice/[drillId]/PracticeRunner.tsx`,
  `src/app/practice/done/page.tsx`, `src/app/practice/progress/page.tsx`
- `src/components/ui/Button.tsx`, `Card.tsx`
- `src/components/practice/StepListening.tsx`, `AudioPlayer.tsx`, `ProgressDots.tsx`,
  `StreakChip.tsx`, `LevelChip.tsx`

---

## 0. The big idea

> "Visual hierarchy refers to how important the elements in an interface appear in relation to one
> another, and it's the most effective tool you have for making something feel 'designed'."
> (*Hierarchy is Everything*, p.36)

The book's thesis is that "looking designed" is not an art problem, it's a **systems + hierarchy**
problem, and both are learnable and mechanical. Two moves do 80% of the work:

1. **Constrain every dimension to a pre-decided scale** (type, space, color shades, radius,
   elevation) so you never make a low-level decision twice, and so no two adjacent values are
   perceptually indistinguishable.
2. **Deliberately de-emphasize** the 80% of the screen that isn't the point, instead of trying to
   emphasize the 20% that is.

For us this is unusually high-leverage because our design system (v0.1) already made all the *taste*
decisions (ivory/espresso/ink, New Spirit, no shadows, no emoji). What it did **not** do is define
a rigorous spacing scale, a shade ladder per color, an elevation model, or an empty-state pattern.
That's exactly the gap this book fills. We don't need a redesign. We need to finish the system.

---

## PART 1 — Starting from Scratch

### 1.1 Start with a feature, not a layout (p.8)
> "An 'app' is actually a collection of features. Before you've designed a few features, you don't
> even have the information you need to make a decision about how the navigation should work."

Applied: the learner PWA has **no navigation chrome** today (each `/practice/*` page hand-rolls
`<header><Logo/> + exit link`). That's actually correct per this principle — resist the urge to add
a bottom tab bar "because apps have those." The learner has exactly one job per session. Add the
shell only after we know what the 3rd and 4th learner features are.

### 1.2 Detail comes later / design in grayscale (p.12)
> "By designing in grayscale, you're forced to use spacing, contrast, and size to do all of the
> heavy lifting."

Applied as a **QA test, not a design process**: screenshot any practice screen, desaturate it. If
you can't tell which element is the primary action, hierarchy is broken and no amount of ink blue
will save it. Do this on `/practice/progress` — in grayscale it is six identical rectangles.

### 1.3 Don't design too much / Be a pessimist (p.16)
> "Don't imply functionality in your designs that you aren't ready to build."
> "A comment system with no attachments would still have been better than no comment system at all."

**Loud finding for us.** This is the visual-design restatement of our known strategy problem
(over-built, under-validated). Concrete instances where the *UI implies* capability we don't have:
- `/precios` implies enforced subscriptions (webhook + middleware are post-MVP).
- PWA manifest + `/offline` page imply offline practice (no service-worker answer queue yet).
- `/practice/progress` "Nivel hablado ▲ subiendo" implies a longitudinal speaking model.

Every one of these is a promise the learner or buyer can catch us failing. The book's rule is:
**ship the smaller honest version.** Either build the thing or remove the affordance.

### 1.4 Choose a personality (p.20)
Personality = font choice + color + **border radius** + language. The book is explicit that mixing
radii is worse than any single choice:
> "Mixing square corners with rounded corners in the same interface almost always looks worse than
> sticking with one or the other."

Audit: our radius scale is `xs 3 / sm 8 / md 10 / lg 12 / pill 999`. In the practice flow we
simultaneously render `rounded-pill` (buttons, audio player), `rounded-md` (option cards, panels),
and `rounded-full` (the A/B/C letter circle, progress dots). Pill + 10px in the same viewport is the
exact mix the book warns about — the `Continuar` pill sits 32px below a stack of 10px-radius option
cards. **Recommendation: pick one for the learner PWA.** I'd keep `rounded-pill` for buttons only
(it reads as "tap me" on Android) and push option cards to `lg` (12px) so the delta is intentional
rather than accidental, OR go full-pill on interactive surfaces. Either is defensible; the current
state is neither.

### 1.5 Limit your choices (p.28) — the load-bearing chapter
> "When you're designing without constraints, decision-making is torture because there's always
> going to be more than one right choice."
> "The more systems you have in place, the faster you'll be able to work and the less you'll second
> guess your own decisions."

Systems the book says to define: font size, font weight, line height, color, margin, padding, width,
height, box shadows, border radius, border width, opacity.

**Audit: we have systems for font size, color (partially), radius. We have NO system for spacing,
opacity, border width, or elevation.** Evidence of the resulting drift, in real code:

| Leak | File |
|---|---|
| `text-[0.6875rem] ... tracking-[0.14em]` (arbitrary, ×2) | `practice/progress/page.tsx:138,163` |
| `text-[0.625rem] ... tracking-[0.14em]` (10px — the size the DS explicitly abandoned) | `practice/progress/page.tsx:171` |
| `text-[1.9rem]` / `text-[1.6rem]` (off-scale display sizes) | `progress/page.tsx:30`, `done/page.tsx:90,98` |
| `text-[clamp(1.75rem,5vw,2.5rem)]` vs `text-[clamp(2rem,5vw,2.75rem)]` — two different clamps for the same role of heading | `practice/page.tsx:128` vs `done/page.tsx:52`, `progress/page.tsx:64` |
| `border-espresso/40`, `bg-success/5`, `bg-error/5`, `opacity-60` — ad-hoc opacity as a color system | `Button.tsx:35`, `StepListening.tsx:53-55` |
| `border-2` on option cards vs `border` everywhere else | `StepListening.tsx:63` |

`globals.css:150-159` even contains a comment admitting the mono label was bumped "from 10 to 11 for
legibility per founder QA" — and `progress/page.tsx:171` still hardcodes 10px. That's the system
failing at exactly the point the book predicts.

---

## PART 2 — Hierarchy is Everything

### 2.1 Not all elements are equal (p.36)
The before/after in the book changes **no color, font, or layout** — only emphasis — and the result
"is immediately more pleasing." This is the cheapest quality win available to us.

### 2.2 Size isn't everything (p.38)
> "Relying too much on font size to control your hierarchy is a mistake — it often leads to primary
> content that's too large, and secondary content that's too small."
> "Try and stick to two or three colors: a dark color for primary content, a grey for secondary, a
> lighter grey for tertiary."
> "Two font weights are usually enough... Stay away from font weights under 400 for UI work."

We have exactly the right 3-tier text ramp already (`espresso` / `espresso-soft` / `espresso-muted`)
and we mostly use it. **Where we violate it:** we reach for tiny sizes (10–12px mono) to
de-emphasize instead of reaching for color. `progress/page.tsx:138-148` and `:163-191` are the worst
offenders — entire data rows rendered at 10–11px uppercase mono because they're "secondary." The
book's fix is explicit: *"If you're considering using a lighter weight to de-emphasize some text,
use a lighter color or smaller font size instead"* — and inversely, don't crush the size when a
softer color would do. **Set that content at 13–14px in `espresso-muted` sentence case instead.**

### 2.3 Don't use grey text on colored backgrounds (p.42)
> "Choose the lighter color by hand instead of using a semi-transparent white for best results —
> simply overlaying white can suck the saturation out of the underlying color."

**Two verified hits:**

1. **Dark mode hairline.** `globals.css:77` sets `--hair: rgba(240, 232, 216, 0.12)` — a translucent
   warm-white over `--ivory: #1c140f`. This is precisely the anti-pattern. It will render as a
   desaturated grey-brown rather than a warm hairline, and it composites unpredictably over
   `--ivory-soft` and `--ivory-deep`. **Fix: hand-pick a solid hex** (something around `#3A2E26`)
   with the same hue family as espresso.
2. **`bg-success/5` / `bg-error/5`** (`StepListening.tsx:53-54`) — same class of mistake in the other
   direction. See §4.2.

### 2.4 Emphasize by de-emphasizing (p.46)
> "Instead of trying to further emphasize the element you want to draw attention to, figure out how
> you can de-emphasize the elements that are competing with it."

**Applied hit:** every practice screen renders the exit link at
`className="caps text-espresso"` (`practice/page.tsx:114`, `PracticeRunner.tsx:131`,
`done/page.tsx:41`, `progress/page.tsx:56`). `.caps` defaults to `espresso-muted` in
`globals.css:166` — and then the class list **overrides it back up to full `espresso`**. So the
single least important element on the screen (leave the lesson) is rendered at the same contrast
tier as the lesson content itself. Delete `text-espresso` from all four and let `.caps` do its job.

### 2.5 Labels are a last resort (p.48)
> "It makes it difficult to present the data with any sort of hierarchy; every piece of data is
> given equal emphasis."
> "Instead of 'In stock: 12', try '12 left in stock'." / "'Bedrooms: 3' could simply become '3 bedrooms'."
> When you do need a label: "add the label, but treat it as supporting content."

**This is the single biggest fix available on `/practice/progress`.** The `Stat` component
(`progress/page.tsx:18-38`) is the pure `label:value` trap: six identical cards, each
`caps` label above a serif number. Nothing is emphasized because everything is.

Rewrite using "combine labels and values":
- `Vocabulario / 142 / palabras repasadas` → **`142 palabras` + `que ya dominas`**
- `Días activos / 12` → **`12 días practicando`**
- `Racha actual / 7 / Mejor: 9` → **`7 días seguidos` + `tu mejor: 9`**
- `Comprensión / 78%` — keep the label (it's a metric a user scans for), but demote it hard.

Also note: `StreakChip.tsx` already does this correctly (`Racha · 7 días`). It's the model.

### 2.6 Separate visual hierarchy from document hierarchy (p.54)
> "A lot of the time, section titles act more like labels than headings... a lot of the time, titles
> should actually be pretty small."

Applied: our step titles use `<h2 className="font-serif text-t-h3">` (22px) in `StepListening.tsx:35`
sitting above the actual content (the audio button and the answer options). The h2 is the right
element and roughly the right size — good. But `/practice/progress`'s `<h1>` at
`clamp(2rem, 5vw, 2.75rem)` (32–44px) is a *label* ("Lo que has aprendido") consuming the top third
of a phone screen above the data the user actually came for. **Shrink it.**

### 2.7 Balance weight and contrast (p.56)
> "Icons (especially solid ones) are generally pretty 'heavy'... A simple and effective way to do
> this is to lower the contrast of the icon by giving it a softer color."
> "Increasing weight is a great way to add a bit of emphasis to low contrast elements... making the
> border a bit heavier by increasing the width."

Two applications:
- `StreakChip.tsx` renders a solid `Flame` icon at `text-ink` (our most saturated color) next to
  `espresso` text. The icon will out-shout the number. **Give the flame `text-ink-soft` or
  `espresso-muted`.**
- `StepListening.tsx:63` uses `border-2` on option cards precisely because a 1px hairline felt too
  weak — that's the book's "use weight to compensate for contrast" arrived at by intuition. Keep it,
  but **codify it**: `border-width: 2px` becomes the token for "this is a tappable choice," 1px stays
  for "this is a boundary." Right now it's incidental.

### 2.8 Semantics are secondary (p.60)
> "Most pages only have one true primary action, a couple of less important secondary actions, and a
> few seldom used tertiary actions."
> Primary = solid high-contrast bg. Secondary = outline / low-contrast bg. Tertiary = styled as links.
> "Being destructive or high severity doesn't automatically mean a button should be big, red, and bold."

**Verified inconsistency:** the most important button in the entire product — "start today's
practice" (`practice/page.tsx:175`) — is `variant="primary"` (espresso). The mid-drill "Continuar"
(`StepListening.tsx:86`) is `variant="accent"` (ink, the brand's one note of color). We are giving
our loudest treatment to the least consequential action.

**Recommendation:** in the learner PWA, `accent` (ink) is reserved for *the one action that advances
the learner's goal on this screen*. That means:
- `/practice` "Empezar" → `accent`
- in-drill "Continuar" → `accent` (correct already)
- `/practice/done` "Ver mi progreso" → `primary` or `ghost`; the true primary on `done` is arguably
  nothing at all (they're finished) — which is fine.
- "Volver al inicio", "Practicar otra vez" → `text` (correct already).

---

## PART 3 — Layout and Spacing

### 3.1 Start with too much white space (p.66)
> "White space should be removed, not added... A better approach is to start by giving something way
> too much space, then remove it until you're happy with the result."
> "Dense UIs have their place... The important thing is to make this a deliberate decision instead of
> just being the default."

Direct product consequence: the **learner PWA should be generous; the HR dashboard is allowed to be
dense.** Those are two different spacing postures and we should say so explicitly in the design
system rather than applying one rhythm to both. Today `/practice` and `/hr` use the same `p-6` cards.

### 3.2 Establish a spacing and sizing system (p.70) — **highest-leverage chapter for us**
> "A linear scale won't work... If you want your system to make sizing decisions easy, make sure no
> two values in your scale are ever closer than about 25%."
> "16px is a great number to start with because it divides nicely, and also happens to be the default
> font size in every major web browser."
> "The values at the small end of the scale should start pretty packed together, and get progressively
> more spaced apart as you get further up the scale."

**Audit.** We have no spacing scale — we use Tailwind's default linear ramp. Measured against the
25% rule, the values our code actually uses:

| Step | px | Δ from previous | Verdict |
|---|---|---|---|
| `1.5` | 6 | — | |
| `2` | 8 | +33% | ok |
| `2.5` | 10 | +25% | ok |
| `3` | 12 | +20% | **too close** |
| `4` | 16 | +33% | ok |
| `5` | 20 | +25% | ok |
| `6` | 24 | +20% | **too close** |
| `8` | 32 | +33% | ok |
| `10` | 40 | +25% | ok |
| `12` | 48 | +20% | **too close** |

Our code uses `mt-10` (40) and `mt-12` (48) as if they were meaningfully different —
`done/page.tsx` uses `mt-10` at :66 and :72, then `mt-12` at :84. That 8px delta is invisible; the
developer spent a decision on nothing. **This is the exact decision fatigue the book targets.**

**Proposed token set (put in `tailwind.config.ts` and forbid the rest in `src/app/practice/**`):**

```
space-1:   4px    (icon gap)
space-2:   8px    (inside a chip)
space-3:  12px    (between siblings in a tight list)
space-4:  16px    (inside a card, small)
space-6:  24px    (inside a card, default padding)
space-8:  32px    (between elements in a group)
space-12: 48px    (between groups)
space-16: 64px    (between sections)
space-24: 96px    (page rhythm)
```
Ratios: 100 / 50 / 33 / 33 / 33 / 50 / 50 / 33 / 50 % — every jump ≥ 33%. Drops the useless
`10 / 20 / 40 / 80` rungs. Note this is deliberately close to Tailwind's own scale (Wathan wrote
both), so the migration is mechanical: `mt-10 → mt-8` or `mt-12`, `p-5 → p-4` or `p-6`.

### 3.3 You don't have to fill the whole screen / Shrink the canvas (p.76)
> "If you only need 600px, use 600px."
> "If you're building a responsive web application, try starting with a ~400px canvas and designing
> the mobile layout first."
> "Give each element just the space it needs — don't make something worse just to make it match
> something else."

**Verified structural mismatch:** every practice page wraps the header in `max-w-shell` (**1280px**)
and the content in `max-w-prose` (**800px**) — `practice/page.tsx:109` vs `:120`,
`PracticeRunner.tsx:126` vs `:137`, same in `done` and `progress`. On a laptop the logo and exit link
sit ~240px outboard of the content column on both sides. This is the book's "don't make something
full-width just because something else is full-width" — inverted. **Fix: put the header on the same
max-width as the content.** One-line change, four files, immediately looks intentional.

More importantly: **our learner is 100% mobile.** Per "shrink the canvas," the practice flow should be
designed at 390px and only *relaxed* upward — never designed at desktop and squeezed. Today the type
ramp (`clamp(1.75rem, 5vw, 2.5rem)`) is a desktop headline scaled down, which is exactly what §3.5
warns against.

### 3.4 Grids are overrated (p.84)
> "Don't use percentages to size something unless you actually want it to scale."
> "Give them a max-width so they don't get too large, and only force them to shrink when the screen
> gets smaller than that max-width."

Applied: `progress/page.tsx:89` uses `grid-cols-2 ... md:grid-cols-3`. At 390px, two Stat cards
side by side gives each ~170px, into which we put a `caps` label, a 30px serif number and a caption.
That's the grid dictating the content instead of the reverse. **A single column of full-width rows
with the number right-aligned would be more scannable and would let the numbers align on a common
edge** (see §4.4, right-align numbers).

### 3.5 Relative sizing doesn't scale (p.92)
> "2.5em might be the perfect headline size on desktop but there's no guarantee that it'll be the
> right size on smaller screens."
> "Elements that are large on large screens need to shrink faster than elements that are already
> fairly small."
> On components: "giving yourself the freedom to fine-tune things independently makes it a hell of a
> lot easier to design for multiple contexts."

Our `clamp(2rem, 5vw, 2.75rem)` headlines and *fixed* 14px body encode exactly the wrong
relationship: the headline shrinks 27% from desktop to mobile while the body — already too small —
shrinks 0%. Per the book, the **small text should get relatively larger on mobile, not stay put.**
Recommendation: `text-t-body-lg` should be `17px` on desktop and `18px` on mobile for the learner
flow; headlines can clamp harder (down to 26px) than they do.

The component-level version of this principle also justifies our `sizes` map in `Button.tsx`
(`h-10 px-5 / h-12 px-6`) being hand-tuned rather than em-derived. That's correct — keep it, and
**add an `xl` size for the primary drill CTA on mobile** (`h-14`, full-width) rather than scaling.

### 3.6 Avoid ambiguous spacing (p.96)
> "Whenever you're relying on spacing to connect a group of elements, always make sure there's more
> space around the group than there is within it — interfaces that are hard to understand always
> look worse."
> "It's not just vertical spacing that you have to worry about either; it's easy to make this mistake
> with components that are laid out horizontally, too."

**Verified bug, mobile-only:** `practice/page.tsx:144` —
```
<dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
```
Horizontal gap **32px**, vertical gap **12px**. On a 390px phone this `<dl>` wraps. Once it wraps,
the space *between rows* (12px) is smaller than the space *within a row* (32px) — so
`Módulo | Recepción` and `Nivel | A2` visually regroup into the wrong pairs. The book's rule is
violated by a factor of ~2.7×. **Fix: `gap-x-6 gap-y-6` or, better, stack it on mobile.**

Second instance, subtler: `StepListening.tsx` rhythm is
`caps` →(12px)→ `h2` →(32px)→ audio →(32px)→ options(12px internal) →(24px)→ explanation →(32px)→ CTA.
The explanation panel sits **24px** from the option list, but the CTA sits **32px** away. Those are
too close to read as different tiers, so the explanation reads as belonging to the button group
rather than to the answer. Should be: options →(24px)→ explanation (they're one unit) →(48px)→ CTA.

---

## PART 4 — Designing Text

### 4.1 Establish a type scale (p.102)
> "Most interfaces use way too many font sizes... it's not uncommon to find that every pixel value
> from 10px to 24px has been used in the UI somewhere."
> Modular scales give fractional values and are "often a bit too limiting" for interfaces —
> **"a more practical approach is to simply pick values by hand."**
> "Stick to px or rem units — it's the only way to guarantee you're actually sticking to the system."

**Audit of our scale** (`tailwind.config.ts`):

| token | px | Δ | verdict |
|---|---|---|---|
| `t-mono` | 11 | — | |
| `t-caption` | 12 | +9% | **too close** |
| `t-label` | 13 | +8% | **too close** |
| `t-body` | **14** | +8% | **too close** — *and this is the base* |
| `t-body-lg` | 17 | +21% | **too close** |
| `t-h3` | 22 | +29% | ok |
| `t-h2` | 32 | +45% | ok |
| `t-h1` | 48 | +50% | ok |
| `t-display` | 72 | +50% | ok |

We have **five sizes crammed between 11 and 17px** and then a chasm. This is the book's opening
complaint verbatim. Plus the code adds off-scale one-offs (`1.6rem`, `1.9rem`, `0.625rem`).

**Proposed learner-PWA scale** — hand-picked, ≥25% apart at the bottom where it matters, and
**16px base** per the book's browser-default argument:

```
xs   12px / 1.5    — timestamps, legal, the absolute floor
sm   14px / 1.55   — secondary text, captions
base 16px / 1.6    — BODY. the default. (currently 14)
lg   19px / 1.5    — lead paragraph, answer-option text
xl   24px / 1.3    — step title
2xl  32px / 1.15   — screen title
4xl  44px / 1.05   — the one number on the "done" screen
```
Ratios: 17 / 14 / 19 / 26 / 33 / 38 %. The 12→14→16 rungs are tighter than 25% but the book
explicitly permits smaller jumps at the bottom of a *type* scale ("smaller jumps between font sizes
are useful at the bottom of the scale") — that allowance is for type, not for spacing.

**The base-size finding is the important one.** `globals.css:92` sets `body { font-size: 0.875rem }`
= **14px**. That is an editorial-print decision applied to an app whose user is a tired hotel worker
on a mid-range Android, often in dim back-of-house lighting, frequently over 35. 14px base is a
readability tax we're charging the exact person least able to pay it. The book's 16px default
recommendation is not aesthetic, it's the browser default for a reason.

### 4.2 Use good fonts (p.108)
> "Ignore typefaces with less than five weights."
> "Avoid using condensed typefaces with short x-heights for your main UI text."

We're fine (Plus Jakarta Sans, New Spirit licensed at 4 weights). One note: the book warns
**"headline fonts rarely work well at small sizes even if you increase the letter spacing."** New
Spirit is a display serif. We use it at `t-body` 14px in `practice/page.tsx:149` and
`progress/page.tsx:135`. **Set a floor: New Spirit never below 19px.** Below that, use Plus Jakarta.

### 4.3 Keep your line length in check (p.114)
> "Make your paragraphs wide enough to fit between 45 and 75 characters per line... A width of
> 20-35em will get you in the right ballpark."

**Verified violation.** `tailwind.config.ts` defines `maxWidth.prose = "50rem"` (**800px**), and
`practice/page.tsx:140` applies `max-w-prose` to a `text-t-body-lg` (17px) paragraph. At 17px,
800px ≈ **47em ≈ 90–95 characters per line** — roughly 25% over the book's outer limit and double
its lower bound. The token is misnamed: 50rem is a *layout* width, not a prose width.

**Fix:** `maxWidth.prose = "34rem"` (~544px, ≈ 68 chars at 16px). Keep the 50rem value but rename it
`maxWidth.column`. This is a one-line config change that improves every long-form paragraph in the
product.

### 4.4 Baseline, not center (p.118)
> "When you align mixed font sizes by their baseline, you're taking advantage of an alignment
> reference that your eyes already perceive."

We do this correctly in `practice/page.tsx:121` (`items-baseline`) and `Card.tsx:41`
(`items-baseline` in CardHeader). Good. `PracticeRunner.tsx:138` uses `items-center` — acceptable,
since ProgressDots aren't text. **Rule to write down: any flex row mixing two font sizes uses
`items-baseline`.**

### 4.5 Line-height is proportional (p.122)
> "Line-height and font size are inversely proportional — use a taller line-height for small text
> and a shorter line-height for large text."
> "Your line-height and paragraph width should be proportional — narrow content can use a shorter
> line-height like 1.5, but wide content might need a line-height as tall as 2."

**Verified inversion in our scale:** `t-caption` is **12px / 1.4** while `t-body` is **14px / 1.55**.
The *smaller* text has the *tighter* leading — backwards. `t-mono` at 11px/1.2 is worse.

And per the second half of the rule: because our `max-w-prose` is 800px (§4.3), our 17px/1.5 body
copy is *wide* content on a *narrow* line-height. Fixing the width to 34rem makes 1.5 correct;
leaving the width at 50rem would require ~1.75.

**Proposed:** 12px→1.6, 14px→1.55, 16px→1.6, 19px→1.5, 24px→1.3, 32px→1.15, 44px→1.05.

### 4.6 Not every link needs a color (p.126)
> "When you're designing an interface where almost everything is a link, using a treatment designed
> to make links 'pop' in paragraph text can be really overbearing."
> "Consider adding an underline or changing the color only on hover."

Our `text` button variant (`Button.tsx:37`) is already `text-ink` + underline-on-hover. That's the
right treatment for *tertiary* actions. Combined with §2.4, the four screens' exit links should also
drop to muted-with-hover rather than full espresso.

### 4.7 Align with readability in mind (p.128)
> "If something is longer than two or three lines, it will almost always look better left-aligned."
> "If you're designing a table that includes numbers, right-align them. When the decimal in a list of
> numbers is always in the same place, they're a lot easier to compare at a glance."

**Applied:** we center nothing (good). But we never right-align numbers either. On
`/practice/progress`, if the six Stats become a single-column list (§3.4), **right-align the values**
so `78%`, `142`, `7`, `12` share a common edge and become scannable in one vertical sweep. Same for
the `recent` activity list.

### 4.8 Use letter-spacing effectively (p.132)
> "All-caps text... using the default letter-spacing often leads to text that is harder to read...
> it often makes sense to increase the letter-spacing of all-caps text."
> "If you want to use a family with wider letter-spacing for headlines... decrease the letter-spacing."

We do both correctly in principle (`.caps` at `0.06em`; headlines at `-0.015em` to `-0.025em`).
The failure is consistency: `.caps` = 0.06em, `.caps-mono` = 0.12em, and `progress/page.tsx` hardcodes
0.14em twice. **Three tracking values for one concept.** Collapse to one.

---

## PART 5 — Working with Color

### 5.1 Ditch hex for HSL (p.138)
> "Using hex or RGB, colors that have a lot in common visually look nothing alike in code."
> "Browsers only understand HSL, so if you're designing for the web, HSL should be your weapon of choice."

Our tokens are all hex (`globals.css:39-62`). Converting to HSL would make the shade ladders in §5.2
legible in code — you'd *see* that ink-deep is the same hue at lower lightness. Low urgency, high
clarity payoff. Recommend converting when we build the shade ladders, not before.

### 5.2 You need more colors than you think / Define your shades up front (p.142, p.148)
> "You can't build anything with five hex codes."
> "8-10 [grey] shades to choose from... Not so many that you waste time deciding between shade #77
> and shade #78."
> "Just like with greys, you need a variety (5-10) of lighter and darker shades... Ultra-light shades
> can be useful as a tinted background for things like alerts, while darker shades work great for text."
> "Don't get clever using CSS preprocessor functions like 'lighten' or 'darken' to create shades on
> the fly. That's how you end up with 35 slightly different blues that all look the same."
> Method: pick base (a good button background) → pick darkest (text) and lightest (tinted bg) →
> fill 700 and 300 → fill 800/600/400/200. **Nine shades.**
> "You'll want multiple shades for these colors too, even though they should be used pretty sparingly."

**Audit.** We have:
- ivory: 4 shades + `hair` → effectively 5 "greys." Book wants 8–10.
- espresso: 4 shades.
- ink: 4 shades.
- **success / warn / error: ONE shade each.**

And because the semantics have no shades, the code invents them at runtime with opacity —
`bg-success/5`, `bg-error/5` (`StepListening.tsx:53-54`). That is `lighten()` by another name, and
it's the book's named anti-pattern. Worse, opacity tints composite differently over `bg-white`
(option card) than over `bg-ivory` (page) than over `bg-ivory-soft` (explanation panel), so
"the success tint" is literally three different colors in three places today.

**Recommendation — the highest-craft-value change in this document.** Build 9-step ladders for
`ink`, `success`, `warn`, `error`, and extend the ivory/espresso greys to ~9 rungs, using the book's
exact method. Then **ban opacity modifiers on color** in the learner PWA (`/\/(5|10|20|40|60)\b/`
on a color class = lint error). Concretely for success, following "pick the darkest for text and the
lightest for a tinted background using an alert component as the test case":

```
success-50   tinted answer-correct background   (replaces bg-success/5)
success-100  correct-state border, subtle
success-500  #3E6D4D  ← existing token, the base
success-700  text on success-50
success-900  darkest, for "Racha" milestone type
```

Note this **requires Diego's sign-off** — CLAUDE.md rule 3 says ask before introducing new colors.
Frame it accurately: this is not new *hues*, it's filling in the ladder under hues we already
approved. "Una sola nota de color" is preserved — ink stays the only accent; success/warn/error stay
states-only.

### 5.3 Don't let lightness kill your saturation (p.152)
> "If you don't want the lighter and darker shades of a given color to look washed out, you need to
> increase the saturation as the lightness gets further away from 50%."
> "To make a color lighter, rotate the hue towards the nearest bright hue — 60°, 180°, or 300°. To
> make a color darker, rotate the hue towards the nearest dark hue — 0°, 120°, or 240°."
> "Don't rotate the hue more than 20-30° or it will look like a totally different color."

Directly relevant when we build §5.2's ladders. `ink #2E4761` is hue ≈ 208°. Its light tint
`ink-tint #E6ECF2` will look washed out unless saturation goes *up* as lightness climbs — and
rotating slightly toward 180° (cyan) on the light end keeps it from going grey. Our existing
`ink-tint` should be re-picked with this in mind.

### 5.4 Greys don't have to be grey (p.158)
> "If you want your greys to feel cool, saturate them with a bit of blue... To give your greys a
> warmer feel, saturate them with a bit of yellow or orange."
> "To maintain a consistent temperature, don't forget to increase the saturation for the lighter and
> darker shades."

**We already do this exceptionally well** and it's the single strongest thing about the current
system — ivory/espresso are heavily warm-saturated greys. This is why the app doesn't look like
bootstrap. Credit where due; protect it. The one place we break temperature is the translucent
dark-mode hairline (§2.3), which will read cool/dead against warm espresso.

### 5.5 Accessible doesn't have to mean ugly (p.162)
> WCAG: 4.5:1 for normal text (under ~18px), 3:1 for large text.
> "You can solve this problem by flipping the contrast. Instead of using light text on a dark colored
> background, use dark colored text on a light colored background."
> "One way to increase the contrast without getting closer to white is to rotate the hue towards a
> brighter color."

**Computed audit of our actual tokens** (WCAG 2.x relative luminance, computed by hand):

| Pair | Ratio | Verdict |
|---|---|---|
| `espresso-muted #7A6352` on `ivory #F5F0E6` | **4.95:1** | passes, thin margin |
| `espresso-muted` on `white` | **5.62:1** | passes |
| `espresso-muted` on `ivory-soft #EFE7D6` | **4.57:1** | barely passes |
| `espresso-muted` on `ivory-deep #EBE4D4` | **4.44:1** | **FAILS 4.5:1** |
| **`accent` button in `disabled:opacity-60`** | **≈3.3:1** | **FAILS** |

The last one is the serious one. `Button.tsx:18` applies `disabled:opacity-60` to the whole element,
so the composite over ivory is white-ish text `rgb(251,249,245)` on `rgb(126,139,150)` ≈ **3.3:1** at
17px. **And this is the state the learner stares at the longest** — the "Continuar" button
(`StepListening.tsx:86-95`) is disabled the entire time they're reading the four answer options.

This is a beautiful convergence of two book principles on one real bug: §2.3 says *don't use opacity
to de-emphasize, hand-pick a color*, and §5.5 says *check the ratio*. **Fix: replace
`disabled:opacity-60` with an explicit disabled palette** — `disabled:bg-ink-soft
disabled:text-espresso-muted` (hand-picked, opaque, verifiable). Same for
`StepListening.tsx:55`'s `opacity-60` on unpicked options.

### 5.6 Don't rely on color alone (p.166)
> "Someone who is red-green colorblind can't easily tell if a metric has gotten better or worse...
> An easy fix for this is to also communicate that information in some other way, like by adding icons."
> "Always use color to support something that your design is already saying; never use it as the only
> means of communication."

**Verified violation, and it's textbook.** `StepListening.tsx:51-56`:
```
if (isCorrect)      stateClass = "border-success bg-success/5";
else if (isPicked)  stateClass = "border-error   bg-error/5";
else                stateClass = "border-hair bg-white opacity-60";
```
Right vs wrong is communicated by **green border vs red border and nothing else.** ~8% of men are
red-green colorblind, and our learner population (bellboys, waiters, front desk in MX/LatAm) skews
male. At `bg-*/5` the fills are near-identical in luminance, so a deuteranope sees two identical
cards and cannot tell whether they got it right.

Compounding: the A/B/C letter circle (`:65-70`) keeps `border-hair` / `text-espresso-muted` in every
state, so it carries no signal either.

**Fix (do this one first, it's ~10 lines):** swap the letter circle for a `Check` / `X` lucide icon
on the resolved state, and put a text micro-label (`Correcto` / `Su respuesta` / `Correcta`) in the
card. Note `progress/page.tsx:181-186` already gets this right with `✓ comprensión` / `✗ comprensión`
— the pattern exists in the codebase, it just wasn't applied on the screen that matters most.

---

## PART 6 — Creating Depth

### 6.1 Emulate a light source (p.172)
> "Light comes from above." Raised = lighter top edge + small dark shadow below.
> Inset = dark shadow at top + lighter bottom edge.
> "Choose the lighter color by hand instead of using a semi-transparent white for best results."
> "Don't get carried away with the blur radius, a couple of pixels is plenty."

### 6.2 Use shadows to convey elevation (p.180)
> "Small shadows with a tight blur radius make an element feel only slightly raised... larger shadows
> with a higher blur radius make an element feel much closer to the user. **The closer something feels
> to the user, the more it will attract their focus.**"
> "Five options is usually plenty."
> "Don't think about the shadow itself, think about where you want the element to sit on the z-axis
> and assign it a shadow accordingly."

### 6.3 Shadows can have two parts (p.186)
Large+soft (direct light) + tight+dark (ambient occlusion); the tight one fades as elevation rises.

### 6.4 **Even flat designs can have depth (p.190) — the chapter that unblocks us**
> "The most effective flat designs still convey depth, they just do it in a different way."
> "In general (especially with shades of the same color), **lighter objects feel closer to us and
> darker objects feel further away.** Make an element lighter than the background color to make it
> feel like it's raised off of the page, or darker than the background color if you want it to feel
> inset like a well."
> "Another way to communicate depth in a flat design is to use **short, vertically offset shadows with
> no blur radius at all.** It's a great way to make a card or button stand off the page a little bit
> without sacrificing that flat aesthetic."

**This is the resolution of our design-system tension.** CLAUDE.md says *"No drop shadows ever"* and
Card.tsx says *"layering is always via color only (principle 02)."* The book fully endorses that —
**but only if you actually build the color-elevation system**, and we haven't. Today the entire
learner PWA is **one elevation**: `bg-white + border-hair` for everything. There is no z-axis at all,
so nothing can be signalled as "this is above everything, look here."

**Proposed elevation system (flat, on-brand, no blur, no violation of the shadow ban):**

| Level | Meaning | Treatment |
|---|---|---|
| `elev-0` | page | `bg-ivory` |
| `elev-1` | inset / well (audio transcript, disabled area) | `bg-ivory-deep`, no border |
| `elev-2` | resting card | `bg-white`, `border-hair` |
| `elev-3` | **active / focused** (the option you're about to tap, the current step) | `bg-white`, `border-espresso`, `box-shadow: 0 2px 0 var(--hair)` ← the book's *solid* shadow |
| `elev-4` | transient overlay (mic recording, offline toast, confirm) | `bg-white`, `border-espresso`, `box-shadow: 0 3px 0 var(--espresso)` |

The `0 2px 0` solid shadow is explicitly sanctioned by the book as flat-compatible. **Requires
Diego's sign-off** since CLAUDE.md's wording is absolute — pitch it as "the book's flat-depth
technique, not a drop shadow."

Where this pays off immediately: **the speaking step.** Recording is the highest-anxiety moment for
an embarrassed A2 learner and it currently has no visual elevation to say "this is happening now,
everything else is paused." `elev-4` fixes that with one class.

### 6.5 Overlap elements to create layers (p.194)
> "Instead of containing a card entirely within another element, offset it so it crosses the
> transition between two different backgrounds."
> Overlapping images: "give the images an 'invisible border' — one that matches the background color."

Cheap, high-impact application: on `/practice/done`, let the streak number card **overlap** the
boundary between the ivory header band and the content. One `-mt-8` and a `z-10`. It's the single
easiest way to make a plain screen read as "designed" without adding any new element.

---

## PART 7 — Working with Images

Lower relevance to the learner PWA (which is text+audio), but three rules apply:

### 7.1 Text needs consistent contrast (p.202)
> Options: semi-transparent overlay (black for light text, white for dark text) / lower the image
> contrast (and adjust brightness to compensate) / colorize (lower contrast → desaturate → solid fill
> in multiply) / text-shadow with large blur and **no offset** so it reads as a glow.

**If** we add role photography to the drill screens (and I think we should — see §9), the colorize
technique is the on-brand one: desaturate → multiply-fill with `espresso`. It makes any stock photo
look like it belongs to our palette and guarantees consistent text contrast.

### 7.2 Everything has an intended size (p.208)
> "Icons that were drawn at 16–24px are never going to look very professional when you blow them up
> to 3x or 4x their intended size."
> "If small icons are all you've got, try enclosing them inside another shape and giving the shape a
> background color."
> Also: don't scale down screenshots; redraw favicons at target size.

`AudioPlayer.tsx:139-147` **already does this correctly** — a 56px (`h-14`) ink pill containing a
20px (`h-5 w-5`) lucide icon, rather than a 56px icon. That's the book's exact prescription, arrived
at independently. Keep it; use it as the pattern for any future large affordance (e.g. the mic
button).

### 7.3 Beware user-uploaded content (p.214)
> "Center their images inside fixed containers, cropping out anything that doesn't fit"
> (`background-size: cover`). "Prevent background bleed... try using a subtle inner box shadow" —
> borders clash with image colors, shadows don't.

Relevant when HR uploads hotel logos / employee avatars in the dashboard. Note the recommendation is
**inner shadow, not border** — worth remembering given our border-heavy house style.

---

## PART 8 — Finishing Touches (the "make it feel designed" toolkit)

### 8.1 Supercharge the defaults (p.220)
> Replace bullets with icons (checkmarks, arrows, or content-specific like a padlock). "Promote" quotes
> into visual elements. Style links with custom underlines. Custom checkboxes/radios in a brand color.
> "Just using one of your brand colors for the selected states instead of the browser defaults is
> often enough to take something from feeling boring to feeling polished."

We already supercharge the answer options (lettered circles instead of radios). Remaining candidates
in the learner PWA:
- `StepReview` vocab cards — the "conozco / no conozco" control should be two big ink-outlined cards, not buttons.
- `progress/page.tsx:105` uses raw `▲` / `▼` characters. Replace with lucide `TrendingUp`/`TrendingDown` at reduced contrast per §2.7.
- The 4 `ProgressDots` are 6px circles. Per §2.2, size isn't the only lever — make the *current* dot a short ink bar (12×6 pill) rather than a 6px dot. More legible on a phone, more "designed."

### 8.2 Add color with accent borders (p.224)
> "One simple trick that can make a big difference is to add colorful accent borders to parts of your
> interface that would otherwise feel a bit bland." — top of a card, active nav item, side of an alert,
> short accent under a headline, across the top of the whole layout.
> "It doesn't take any graphic design talent to add a colored rectangle to your UI, and it can go a
> long way towards making something feel more 'designed.'"

**Highest ratio of impact to effort in this entire document, and it costs one CSS declaration.** Our
palette has exactly one accent and we currently use it almost nowhere structurally. Candidates:
1. **A 3px ink bar across the very top of the learner PWA viewport** — instant product identity, costs nothing, works on every screen.
2. **A 2px ink left-border on the explanation panel** (`StepListening.tsx:79`) — turns a grey box into "the teacher is telling you something."
3. **A short ink rule under the screen `<h1>`** on `/practice` and `/done`.
4. **A 3px ink top-border on the "today's drill" card.**

### 8.3 Decorate your backgrounds (p.228)
> Change the background color to distinguish sections; a slight gradient using "two hues that are no
> more than about 30° apart"; a subtle repeating pattern; or a simple geometric shape / illustration.
> "Keep the contrast between the background and the pattern pretty low."

We already have `placeholder-pattern` in `globals.css:186` (a 135° repeating stripe) used only for
"not yet photographed." **Reuse it as decoration** — a low-contrast band of it behind the `/done`
screen's streak number would break the monotony without introducing a single new token. Fully within
the design system.

### 8.4 **Don't overlook empty states (p.234)**
> "If you're designing something that depends on user-generated content, the empty state should be a
> **priority, not an afterthought.**"
> "Try incorporating an image or illustration to grab the user's attention, and emphasizing the
> call-to-action."
> "If you're working on something that has a bunch of supporting UI like tabs or filters, **consider
> hiding that stuff entirely.** There's no point in presenting a bunch of actions that don't do
> anything until the user has created some content."
> "Empty states are a user's first interaction with a new product or feature. Use them as an
> opportunity to be interesting and exciting — don't settle for plain and boring."

**For us the empty state is not an edge case — it is literally 100% of learners on day one,** and our
learner is a person with low prior success at English who may feel embarrassed. This is the highest-
stakes screen in the product and it's currently a grey box with a paragraph.

Audit of `progress/page.tsx:68-80`:
- ✅ Correctly hides the stats grid, module breakdown and activity list. (Book compliance.)
- ❌ The `<h1>` still says **"Lo que has *aprendido*"** — a promise the screen visibly fails to keep.
  For a self-conscious learner, landing on "what you've learned: nothing" is actively demotivating.
- ❌ No illustration, no graphic, no warmth. `border-hair bg-white p-6` + a paragraph.
- ❌ The CTA is `variant="primary"` (espresso), not the accent — the one screen where the CTA *is*
  the entire point (§2.8).

**Rewrite spec:**
- Conditional `<h1>`: `Tu progreso empieza hoy.` when empty; `Lo que has aprendido.` when populated.
- One simple geometric/pattern graphic (§8.3 — reuse `placeholder-pattern`, zero new assets).
- CTA → `variant="accent"`, `size="lg"`, full-width on mobile.
- One line of concrete expectation-setting: *"Después de tu primera práctica verás aquí tu
  comprensión, tu nivel hablado y las palabras que ya dominas."* (Copy already close; keep the
  specificity, lose the apologetic "Aún no hay datos suficientes.")

**Also missing entirely:** an empty/failure state for `StepSpeaking` when the mic is denied, and for
the offline case. The book's point generalizes — every state that isn't the happy path is a first
impression too.

### 8.5 Use fewer borders (p.238)
> "While borders are a great way to distinguish two elements from one another, they aren't the only
> way, and using too many of them can make your design feel busy and cluttered."
> Alternatives: box shadow / **two different background colors** / **add extra spacing**.
> "If you're already using different background colors in addition to a border, try removing the
> border; you might not need it."

**`/practice/progress` is a case study in this failure.** Count the hairline rectangles on one screen:
- 6 × `Stat` cards, each `rounded-md border border-hair bg-white` (`:28`)
- N × `by_module` rows, each `rounded-md border border-hair bg-white` (`:133`)
- 1 × `recent` list, `divide-y divide-hair rounded-md border border-hair bg-white` (`:157`)
- 1 × empty-state box (`:69`)

That is 10–15 outlined boxes stacked vertically on ivory. In grayscale (§1.2) it is a wireframe.

**Fix, using the book's three alternatives in order:**
1. Collapse the 6 Stat cards into **one** white panel with internal `divide-y divide-hair` rows →
   6 borders become 1 border + 5 hairlines.
2. Collapse the `by_module` rows the same way (they're already a homogeneous list).
3. Between the three groups, use **spacing** (`space-12` = 48px) rather than more boxes.

Net: ~13 borders → 3. Same information, and it will look like a different product.

### 8.6 Think outside the box (p.242)
> "Just because we've been conditioned to believe that there's only one way to design a particular
> component, doesn't mean it's true."
> "If a set of radio buttons are an important part of the UI you're designing, try something like
> **selectable cards** instead."
> Tables: "if a column doesn't need to be sortable, there's no reason you can't combine it with a
> related column and introduce some interesting hierarchy."

We already ship selectable cards for listening answers — good instinct, keep going:
- **`StepReview` (vocab):** make it a real card the learner taps rather than a list.
- **`/practice` entry:** today's drill is presented as a headline + a `<dl>` + a button. It could be
  a single tappable card containing the module, level, duration and a chevron — one target instead of
  a paragraph and a distant button. Fewer decisions for a tired user.
- **HR tables:** combine "employee name + role + hotel" into one cell with hierarchy instead of three
  equal columns (book's exact table example).

---

## PART 9 — Leveling Up (p.250)
> "Look for decisions you wouldn't have made."
> "The absolute best way to notice the little details that make a design look really polished is to
> **recreate that design from scratch, without peeking at the developer tools.**"

Practice suggestion for Diego: rebuild one screen of Duolingo's lesson flow from memory, then diff.
The specific things you'll discover are the ones this book names — tighter heading line-height,
all-caps tracking, combined shadows, elevation-as-focus.

---

## THE AUDIT — verified findings, ranked

Every item below was confirmed against real code with a file:line reference.

| # | Finding | Where | Book ref |
|---|---|---|---|
| 1 | Right/wrong signalled by **red vs green border only** — colorblind-inaccessible on the core learning screen | `StepListening.tsx:51-56` | Don't rely on color alone, p.166 |
| 2 | `disabled:opacity-60` on accent button → **≈3.3:1** contrast on the state the learner reads longest | `Button.tsx:18` + `StepListening.tsx:89` | Accessible doesn't have to mean ugly, p.162 |
| 3 | **14px body base** for a tired worker on a mid-range Android in dim light | `globals.css:92`, `tailwind.config.ts` `t-body` | Establish a type scale, p.102 |
| 4 | `max-w-prose = 50rem` (800px) → **~90–95 chars/line**, book's limit is 75 | `tailwind.config.ts`, `practice/page.tsx:140` | Keep line length in check, p.114 |
| 5 | **Ambiguous horizontal spacing**: `gap-x-8` / `gap-y-3` regroups wrongly when it wraps on a phone | `practice/page.tsx:144` | Avoid ambiguous spacing, p.96 |
| 6 | Type scale has **five sizes between 11 and 17px**, then a chasm; violates the 25% rule 4× | `tailwind.config.ts` `fontSize` | Establish a type scale, p.102 |
| 7 | **Line-height inverted**: 12px/1.4 has tighter leading than 14px/1.55 | `tailwind.config.ts` `t-caption` vs `t-body` | Line-height is proportional, p.122 |
| 8 | **No shade ladders** for semantics → `/5` opacity tints composite to 3 different colors over 3 different surfaces | `StepListening.tsx:53-54` | Define your shades up front, p.148 |
| 9 | **~13 hairline boxes** on one screen; borders used where spacing or a shared panel would do | `progress/page.tsx:28,69,133,157` | Use fewer borders, p.238 |
| 10 | Empty state promises "Lo que has aprendido", has no graphic, CTA isn't the accent | `progress/page.tsx:64-80` | Don't overlook empty states, p.234 |
| 11 | **Primary/accent inverted**: "Empezar" (the product's #1 action) is `primary`, mid-drill "Continuar" is `accent` | `practice/page.tsx:175` vs `StepListening.tsx:87` | Semantics are secondary, p.60 |
| 12 | Exit link forced back up to full `espresso`, overriding `.caps`'s muted default | `practice/page.tsx:114`, `PracticeRunner.tsx:131`, `done/page.tsx:41`, `progress/page.tsx:56` | Emphasize by de-emphasizing, p.46 |
| 13 | Header at `max-w-shell` (1280) over content at `max-w-prose` (800) — misaligned on desktop | all four practice pages | You don't have to fill the whole screen, p.76 |
| 14 | **No spacing system**; `mt-10` vs `mt-12` is an invisible 8px decision | throughout | Establish a spacing and sizing system, p.70 |
| 15 | Off-scale one-offs: `1.6rem`, `1.9rem`, `0.625rem`, two different `clamp()`s for the same heading role, three tracking values | `progress/page.tsx:30,138,163,171`; `done/page.tsx:90,98` | Limit your choices, p.28 |
| 16 | Dark-mode `--hair` is `rgba(...)` translucent white — will desaturate over warm espresso | `globals.css:77` | Don't use grey text on colored backgrounds, p.42 |
| 17 | `espresso-muted` on `ivory-deep` = **4.44:1**, fails 4.5:1 | `globals.css:50` + `:43` | Accessible doesn't have to mean ugly, p.162 |
| 18 | **One elevation** across the whole PWA — no way to signal "this is happening now" (esp. the mic/recording moment) | `Card.tsx`, all step components | Even flat designs can have depth, p.190 |
| 19 | Solid `Flame` icon at full `text-ink` next to `espresso` text — icon out-weights the number | `StreakChip.tsx:34` | Balance weight and contrast, p.56 |
| 20 | New Spirit (a display serif) used at 14px | `practice/page.tsx:149`, `progress/page.tsx:135` | Use good fonts, p.108 |
| 21 | Zero accent borders anywhere in the learner PWA despite having exactly one accent color | throughout | Add color with accent borders, p.224 |
| 22 | `rounded-pill` + `rounded-md` + `rounded-full` all in one viewport | `Button.tsx:31`, `StepListening.tsx:63,66` | Choose a personality, p.20 |
| 23 | `progress` Stats forced into a 2-col grid at 390px; numbers never right-aligned | `progress/page.tsx:89` | Grids are overrated p.84 / Align with readability p.128 |

---

## LOUD CONFLICTS — where the book contradicts what a naive product team would do

These are the most valuable findings because they're the decisions we'd otherwise get wrong by default.

1. **"Make the streak huge with a flame — gamify like Duolingo."**
   Book (*Size isn't everything*, p.38; *Not all elements are equal*, p.36): size is the *weakest*
   hierarchy lever, and hierarchy means deciding what is genuinely primary. On `/practice` the
   primary thing is **today's drill**, not the streak. Our current `/practice` gets this right (streak
   is a chip). **Do not "fix" it by making the streak bigger.** Duolingo optimizes streak retention
   because streaks are their product; ours is on-shift job performance for a B2B buyer.

2. **"Add drop shadows and gradients so it looks modern."**
   Book (*Use shadows to convey elevation*, p.180): a shadow must **mean** a z-position, never
   decorate. And (*Even flat designs can have depth*, p.190) flat is fully legitimate **if you build
   the color-elevation ladder.** Our "no shadows" rule is defensible — but only once §6.4's ladder
   exists. Right now we have the ban without the substitute, which is the worst of both.

3. **"Design it on the laptop, make it responsive after."**
   Book (*You don't have to fill the whole screen*, p.76): **shrink the canvas, start at ~400px.**
   And (*Relative sizing doesn't scale*, p.92): large elements must shrink *faster* than small ones —
   you cannot derive the mobile design from the desktop one. Our learner is 100% mobile and our type
   ramp is currently a shrunk desktop ramp with a *fixed* 14px floor. Exactly backwards.

4. **"Cram the HR dashboard full so the buyer sees a lot of value."**
   Book (*Start with too much white space*, p.66): density must be a **deliberate** choice, and it's
   far easier to remove white space than to notice you needed more. Also (*Labels are a last resort*,
   p.48): the label:value dashboard grid gives every number equal weight, which means the buyer sees
   *no* signal. A dashboard with three emphasized numbers beats one with twenty equal ones.

5. **"Our users have low literacy, so label everything explicitly."**
   Book (*Labels are a last resort*, p.48) says the opposite — and the book wins even in our case:
   **"142 palabras que ya dominas"** is simultaneously more readable *and* better hierarchy than
   **"Vocabulario: 142."** The naive accessibility instinct (more labels) produces worse
   comprehension. Combine label and value into one phrase.

6. **"Ship the feature; the empty state is an edge case."**
   Book (*Don't overlook empty states*, p.234): "a priority, not an afterthought." For us the empty
   state is **day one for every single learner**, and our learner is specifically someone with a
   history of failing at English. This is the highest-emotional-stakes screen in the product and it's
   currently the plainest.

7. **"Red = wrong, green = right. Universal."**
   Book (*Don't rely on color alone*, p.166): ~8% of men can't distinguish them, and our learner base
   skews male. Our #1 learning screen currently fails this. Non-negotiable fix.

8. **"Use `em` so the whole thing scales together."**
   Book (*Establish a type scale*, p.102 + *Relative sizing doesn't scale*, p.92): em compounds in
   nested elements and silently produces sizes that aren't in your scale. **Use px/rem.** (We do —
   keep doing it, and resist the "make it all relative" refactor.)

9. **"Add a bottom tab bar, that's what apps have."**
   Book (*Start with a feature, not a layout*, p.8): you don't have the information to design the
   shell until you've designed several features. We have one learner feature. No tab bar.

10. **"Design all the screens in Figma first."**
    Book (*Don't design too much*, p.16): work in short cycles, build the real thing early, and
    **"don't imply functionality in your designs that you aren't ready to build."** Given our
    validation gap, this is the one to actually internalize.

---

## SEQUENCED PLAN

**Tier 0 — accessibility + correctness (do today, ~1 hour, no design-system approval needed)**
1. Add ✓/✗ icons + text labels to `StepListening` resolved states. *(finding 1)*
2. Replace `disabled:opacity-60` on `accent` with an opaque hand-picked disabled pair. *(2)*
3. Remove `text-espresso` override on the four exit links. *(12)*
4. `gap-x-8 gap-y-3` → `gap-x-6 gap-y-6` on the `/practice` `<dl>`. *(5)*
5. Swap `text-[0.625rem]`/`tracking-[0.14em]` for `.caps` / `.caps-mono`. *(15)*

**Tier 1 — system repair (config-level, mostly one file)**
6. `maxWidth.prose` 50rem → 34rem; add `maxWidth.column = 50rem`. *(4)*
7. Rebuild the type scale at a **16px base**; fix inverted line-heights. *(3, 6, 7)*
8. Add the 9-rung spacing scale; migrate `mt-10`/`p-5` out of the practice flow. *(14)*
9. Align the practice-page headers to the content column. *(13)*
10. Hand-pick a solid dark-mode `--hair`; re-pick `espresso-muted` for `ivory-deep`. *(16, 17)*

**Tier 2 — needs Diego's sign-off (CLAUDE.md rule 3)**
11. **Shade ladders** for ink / success / warn / error (9 rungs each, book's method), then ban
    opacity color modifiers in `src/app/practice/**`. *No new hues.* *(8)*
12. **Flat elevation ladder** `elev-0…4` including the book-sanctioned solid `0 2px 0` shadow.
    Pitch as "flat depth," not "drop shadows." *(18)*
13. One radius policy for the learner PWA. *(22)*

**Tier 3 — craft / "feels designed" (cheap, high perceived quality)**
14. Rewrite the `/practice/progress` **empty state** — conditional headline, pattern graphic, accent
    CTA. *(10)*
15. **Accent borders**: 3px ink bar at the top of the PWA viewport; 2px ink left-border on the
    explanation panel; short ink rule under screen headings. *(21)*
16. **Fewer borders** on `/practice/progress`: 13 boxes → 3, right-align the numbers. *(9, 23)*
17. Fix `primary`/`accent` assignment across the learner flow. *(11)*
18. `ProgressDots` current-step becomes a short ink bar; `Flame` drops to `ink-soft`. *(19)*
19. New Spirit floor at 19px. *(20)*
20. Overlap the streak card across the header/content boundary on `/done`.

---

## Things we already do right (protect these)

Worth recording so a future refactor doesn't undo them:
- **Warm-saturated greys** (ivory/espresso) — book's *Greys don't have to be grey*, executed better
  than most commercial products.
- **`AudioPlayer`**: 20px icon inside a 56px pill — book's *Everything has an intended size* fix,
  exactly right.
- **Selectable cards instead of radios** for listening answers — *Think outside the box*.
- **`StreakChip`'s "Racha · 7 días"** — *Labels are a last resort*, combined label+value done well.
- **`items-baseline`** in the practice header and CardHeader — *Baseline, not center*.
- **`px`/`rem` type scale, no `em`** — *Establish a type scale*.
- **Three-tier text color ramp** (espresso / soft / muted) — *Size isn't everything*.
- **Empty state hides the stats grid** — *Don't overlook empty states*, half-right already.
- **`prefers-reduced-motion` honored**, focus-visible ring defined globally.
