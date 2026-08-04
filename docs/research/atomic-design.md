# Atomic Design (Brad Frost, 2016) — mined for Inglés Hotelero

**Lens:** design-system architecture — atoms/molecules/organisms/templates/pages, and how to
structure a component system so the product scales across roles, languages, and future sectors
without redesign. What makes a system maintainable and consistent.

**Source:** `corpus/atomic-design.txt`, 1,436 lines, full text of all 5 chapters + resources.
Read in full. Line references below are to that file; page/chapter anchors are the book's own.

---

## 0. The one-sentence translation

Frost's book is about UI components. **The highest-leverage application to Inglés Hotelero is not
the UI at all — it is the learning content model.** IH currently hand-authors 60 monolithic
`Drill` objects. That is the exact mistake Frost opens the book attacking: treating the artifact
(the page / the drill) as the unit of work instead of the system of components that generates it.
Everything below follows from that reframe.

---

## 1. Chapter 1 — Designing Systems (the argument)

### 1.1 The page metaphor is a scoping error

Frost's opening move (lines 88–98). People say "we're launching a five-page website" or "how do we
redesign 30,000 pages?" Both assume a page is *a uniform, isolated, quantifiable thing*. It isn't.

> "those 30,000 pages may consist of three content types and two overarching layouts. Ultimately, a
> project's level of effort is much better determined by the functionality and components contained
> within those pages, rather than on the quantity of pages themselves." (l.96–97)

**Mechanism:** effort and scope scale with *component count*, not *instance count*. Estimating by
instance count both overstates work (30,000 pages sounds terrifying) and understates it (a
"homepage" can be a lunchtime job or a three-month job).

**IH translation.** "We have 60 drills, we need 200 more" is a page-count statement. The real
question is: how many *lexemes*, *exchanges*, and *scenario frames* does a front-desk agent's job
contain, and how many valid drill instances can be composed from them? Answering the second
question makes the first question free. See §5.

### 1.2 UI frameworks: the sci-fi jumpsuit problem

Frost on Bootstrap/Foundation (l.184–200). Four objections, all of which transfer:

1. **Look-alike.** "If Nike, Adidas, Puma, and Reebok were to redesign their respective sites using
   Bootstrap, they would look substantially similar." (l.191)
2. **Bloat.** Users download the framework's unused CSS/JS.
3. **Not far enough.** Past a threshold, the cost of fighting the framework exceeds the savings.
4. **Naming.** "Using a framework means subscribing to someone else's structure, naming, and style
   conventions." He'd "balk at the idea of using Bootstrap's default component for a featured
   content area they call a 'jumbotron'." (l.194)

The resolution is Dave Rupert's, quoted approvingly:

> "it's not necessarily about using Bootstrap for every client, but rather creating **'tiny
> Bootstraps for every client.'**" (l.197)
>
> "It's not just about using a design system, it's about creating **your** system." (l.200)

**IH translation.** Duolingo is the jumpsuit. Its component vocabulary — streaks, XP, hearts,
leaderboards, cartoon mascot, generic-language skill tree — is a general-purpose consumer framework.
Adopting it wholesale makes IH look and behave like every other language app, which is precisely the
opposite of the competitive frame ("dramatically better than Duolingo *for this use case*"). IH's
components must be job-shaped: `Exchange`, `Scenario`, `Function` (apologize / give directions /
upsell / handle a complaint), `Shift`. Not `Lesson`, `Unit`, `XP`.

### 1.3 The taxonomy of style guides (l.203–236)

Frost enumerates the flavors, and stresses they influence each other:

- **Brand identity** — logos, type, palette, messaging, collateral.
- **Design language** — philosophy and direction (his example: Google material design). Explicitly
  *less permanent* than brand: "one day Google will likely develop a new design language to replace
  material design, so while Google's overall brand will remain intact, the design vocabulary around
  its products will change." (l.213)
- **Voice and tone** — the MailChimp example: "when a user's credit card is declined, writers know
  to shift away from their generally cheeky and playful tone of voice and adopt a more serious tone
  instead." (l.223)
- **Writing** — grammar, punctuation, principles for contributors.
- **Code style guides** — conventions so teams "focus on producing great work together rather than
  refactoring a bunch of sloppy, inconsistent code." (l.230)
- **Pattern libraries** — "the main event." (l.234)

**IH gap, flagged now, expanded in §11:** `.orcha/design-system.md` principle #1 is *"Respeto, no
condescendencia."* That is a **voice-and-tone guideline filed as a design principle.** It governs
every `note_es`, `explanation_es`, and feedback string in the product — i.e. content authored by
people who will never open the design system doc. Frost's taxonomy says it belongs in a voice-and-
tone guide sitting *next to the content templates*, with worked before/after examples, because the
people who need it are content authors, not component authors.

### 1.4 Benefits (l.238–280) — the ones that actually matter here

- **Consistency → trust.** His health-insurance anecdote: four distinct interface designs in five
  clicks, and "By the time I got to the payment form, I felt like I couldn't trust the company to
  successfully and securely process my payment." (l.243) *For IH the trust target is the HR buyer
  evaluating whether this is a real product or a demo.*
- **Shared vocabulary.** "It's not uncommon for different disciplines to have different names for
  the same module, and for individuals to go rogue." (l.249)
- **Education / anti-snowflake.** "Style guides can help alleviate what I call **special snowflake
  syndrome**, where certain departments in an organization think that they have unique problems and
  therefore demand unique solutions." (l.259) *Read "departments" as "each pilot hotel."*
- **Testing.** "The ability to pull an interface apart into its component pieces makes testing a lot
  easier." (l.267)
- **Speed, compounding.** Federico Holgado (MailChimp): they built patterns from four primary
  screens, then "as we were implementing things in other pages we started to realize: man, this
  system will actually work here and this system will actually work here and here." (l.275)
- **Appreciates over time.** "even if you were to undertake a major redesign you'll find that many
  of the structural interface building blocks will remain the same." (l.280)

### 1.5 Challenges (l.283–313) — the failure modes to pre-empt

- The hard sell / short-term mentality (l.286).
- Time. Dennis Crowley: **"The hard part is building the machine that builds the product."** (l.288)
- **Auxiliary-project conundrum** (l.293): pattern libraries treated as separate from the core
  project fall into "nice to have" and are "first on the chopping block." He explicitly analogizes
  to accessibility: the idea that it's a costly extra line item is "a fallacy."
- Maintenance and governance — without it, style guides get thrown away (l.297).
- Audience confusion — becoming "a best-kept secret guarded by one discipline." (l.300)
- **Lack of context** (l.307–311): "most pattern libraries out in the wild don't provide any hints
  as to when, how, and where their components get used. Without providing context, designers and
  developers don't know how global a particular pattern is, and as a result wouldn't know which
  pages of their app would need to be revisited, QA'd, and tested if changes were made."
- **Lacking a methodology** (l.313): most libraries are "little more than loosely arranged sprays of
  modules."

---

## 2. Chapter 2 — The methodology itself

The five stages (l.340). Not a linear process — **"a mental model to help us think of our user
interfaces as both a cohesive whole and a collection of parts at the same time."** (l.342)

| Stage | Definition (verbatim-ish, l.402–406) | Test |
|---|---|---|
| **Atoms** | UI elements that can't be broken down further without ceasing to be functional | Decompose it → it loses meaning |
| **Molecules** | Collections of atoms forming relatively simple components | Does one thing; single responsibility |
| **Organisms** | Relatively complex components forming discrete sections of an interface | Stands alone as a section |
| **Templates** | Place components in a layout; demonstrate the *underlying content structure* | Contains no real content |
| **Pages** | Real content applied to templates; **articulate variations** | Tests the system's resilience |

### 2.1 Key mechanisms worth stealing

**Single responsibility at the molecule level.** "Creating simple components helps UI designers and
developers adhere to the single responsibility principle... Burdening a single pattern with too much
complexity makes software unwieldy. Therefore, creating simple UI molecules makes testing easier,
encourages reusability, and promotes consistency." (l.356)

**Organisms can be homogeneous or heterogeneous.** A header is heterogeneous (logo + nav + search); a
product grid is "the same molecule repeated over and over again" (l.365, 368).

**Templates = content structure, not content.** The load-bearing quote, Mark Boulton:

> "You can create good experiences without knowing the content. What you can't do is create good
> experiences **without knowing your content structure**. What is your content made from, not what
> your content is." (l.378)

And Frost's gloss: "Design systems must account for the dynamic nature of content, so it's very
helpful to **articulate important properties of components like image sizes and character lengths**
for headings and text passages." (l.377) The Time Inc. template shows exactly this.

**Pages articulate variations — and this is where the system gets stress-tested.** His examples
(l.396–399):

- one item in the cart vs. ten
- dashboard's recent-activity section suppressed for first-time users
- headline 40 characters vs. 340 characters
- admin sees extra buttons vs. non-admin

> "In all of these examples, the underlying templates are the same, but the user interfaces change to
> reflect the dynamic nature of the content. **These variations directly influence how the underlying
> molecules, organisms, and templates are constructed.**" (l.400)

And: "If a person's name were to wrap onto five lines within the pattern, we would need to address
that broken behavior **at a more atomic level.**" (l.428)

**Traversal between part and whole.** Frank Chimero's painter (l.415): step to the canvas to make the
stroke, step back to assess the whole, "a dance of switching contexts... a tight feedback loop
between mark-making and mark-assessing." Frost: "It would be foolish to design buttons and other
elements in isolation, then cross our fingers and hope everything comes together." (l.420)

**Naming is negotiable; hierarchy is not.** "The issue with terms like components and modules is that
a sense of hierarchy can't be deduced from the names alone." (l.434) But he immediately concedes GE
renamed everything to "Principles / Basics / Components / Templates / Features / Applications"
because their colleagues were confused — and Frost's verdict on whether those labels make sense:
**"It doesn't matter."** (l.438) "Atomic design is not rigid dogma." (l.441)

**It is not a web/CSS technique.** "atomic design has nothing to do with web-specific subjects like
CSS or JavaScript architecture... atomic design deals with crafting user interface design systems
irrespective of the technology used." (l.453) He proves it by atomizing native Instagram (l.443–452).

> **This is the permission slip for the central recommendation of these notes.** If atomic design is
> technology-agnostic and applies to "the user interface of any software," it applies equally to the
> structure of a *curriculum*. A drill is an organism. A lexeme is an atom. Nothing in the book
> restricts the model to rendered pixels.

---

## 3. Chapter 3 — Tools / qualities of an effective pattern library

Pattern Lab is the vehicle; the transferable content is the *qualities*.

### 3.1 Russian nesting dolls + DRY (l.493–535)

Smallest patterns are *included* in bigger ones (`{{> atoms-thumbnail }}`). "you can make a change to
a pattern, and anywhere that pattern is employed will magically update with those changes." (l.498)

Worked example, Time Inc. header:
```
<header role="banner">
  {{> atoms-logo }}
  {{> molecules-primary-nav }}
  {{> molecules-search }}
</header>
```
Then the whole homepage template is just includes with named sections. "At this stage in the game the
smaller patterns are already constructed, so all the template needs to do is pull them into the
context of a page layout and give them unique names." (l.527)

### 3.2 Separation of structure and data (l.536–598)

Structure lives in templates; content lives in `data.json`, overridden per page
(`00-homepage.json`). Frost lists four benefits (l.594–598), all of which map onto IH's content
pipeline:

1. **Clean separation of structure and content.** "resilient design systems strive to establish
   agnostic, flexible patterns that can contain a variety of content... make changes to content
   without affecting the pattern structure. Likewise, we're able to make changes to a pattern without
   having to update every instance."
2. **Ad hoc CMS.**
3. **Blueprint for back-end developers** — "understand which bits are static and dynamic."
4. **Non-developers can contribute.** "By separating structure and data, Pattern Lab enables
   non-developer team members to safely manage the content-related aspects of the design, freeing up
   developers to focus on building the design system's structure."

### 3.3 Pseudo-patterns: cheap variation modelling (l.558–592)

The most directly stealable technique in the book.

> "Historically, designers working with static tools have had a tendency to **only design best-case
> scenarios.** You know what I'm talking about: the user's name is Sara Smith and always fits neatly
> on one line; her profile picture looks like it was clipped out of a magazine; her profile is
> completely filled out; the two columns of her profile content are exactly the same height.
>
> Of course, these best-case scenarios rarely, if ever, occur in the real world." (l.559–560)

His list of what-ifs (l.562): no profile picture; 87 items in the cart; 14 product options; a
400-character blog title; returning user; first-time user; zero comments; seven layers of nested
comments; an urgent dashboard message.

Mechanism: `dashboard~admin.json` (tilde = pseudo-pattern) **inherits** `dashboard.json` and
overrides/appends. Set `"isAdmin": true`, and a conditional include (`{{# isAdmin }}`) flips the
entire UI. "You can extend this technique to dramatically alter the entire UI... just by changing a
single variable." (l.592)

Note the deliberate hostility of his sample data: `"Gingersnap Jujubees-Daniels"`, title `"President
of the Longest Company Name in the World Corporation, Global Division"`, alongside `"Sara Smith" /
"Short Title"` (l.570–574). **The fixture data is adversarial on purpose.**

### 3.4 Viewport tooling: `ish.` (l.600–619)

Rejects device-width presets (320/480/768) in favour of *randomized* small-ish / medium-ish /
large-ish viewports, "to help designers better consider the entire resolution spectrum rather than a
handful of popular device dimensions." (l.608–609) He notes it works even better as a *client
education* tool than as a bug-finder (l.611).

Also flags container queries as the real goal: "The dream is to build our components fluidly and
they'll adapt their styles and functionality to fit whatever containers we put them into." (l.605)

### 3.5 Pattern lineage (l.640–649) — the maintainability keystone

> "When looking at various patterns in a library, I've found myself wondering, 'Great, but **where is
> this component actually used?**'"

Pattern Lab auto-derives, for any component: (a) which patterns it *contains*, (b) every place it is
*employed*.

> "Let's say we wanted to make changes to a particular pattern, like doubling the size of an image or
> adding an additional element: we'd immediately know which patterns and templates would need to be
> retested and QA'd... The lineage feature also helps point out **redundant and underused patterns**
> so teams can weed them out." (l.646–649)

### 3.6 His checklist for any pattern-library tool (l.652–657)

- pattern descriptions and annotations
- relevant HTML / templating / CSS / JS code shown
- viewing patterns across the full resolution spectrum
- ability to showcase **pattern variations** (active/disabled tabs etc.)
- ability to inject **real representative content**
- **contextual information**: what makes up a pattern, and where it's used

Also, the Lonely Planet refinement (l.625–629): rather than exposing HTML/CSS to copy-paste, Rizzo
surfaces the **include code**, so there is exactly one source of truth for the pattern's markup.

---

## 4. Chapter 4 — The atomic workflow

### 4.1 Pitching in the buyer's currency (l.677–689)

"I can hype design systems until I'm blue in the face, but the suits don't always see things through
the same lens." Reframe: **"Do you like saving time and money? Yes or no?"** (l.683) Then all five
benefits get restated in time/money terms (l.684–688) — consistency → users master the UI faster →
more conversions; reuse → faster rollout; shared vocabulary → fewer meetings; baked-in accessibility
→ "reducing the risk of you getting sued"; living foundation → A/B and perf learnings compound.

### 4.2 The interface inventory (l.692–767) — highest-ROI exercise in the book

**What it is:** screenshot and categorize *one instance of each unique UI pattern* across the entire
experience (l.711). Not every instance — each *unique* one.

**Process:**
1. **Round up the troops** (l.699–701). Explicitly cross-disciplinary: UX, visual, front-end,
   back-end, copywriters, content strategists, PMs, business owners, QA. "it's absolutely essential
   to get all members of the team **to experience the pain** of an inconsistent UI for them to start
   thinking systematically."
2. **Standardize the tool** (l.702–709) — everyone uses the same one so slides can be merged.
3. **Screenshot, time-boxed** (l.710–743). 30–90 minutes, timer running. Categories he lists:
   global elements, navigation, image types, icons, forms, buttons, headings, blocks, lists,
   interactive components, media, third-party components, advertising, messaging, colors, animation.
   **Dig deep** — "Any piece of UI that is or could be managed by your organization should be
   documented," including the parts nobody loves: "customer support, FAQs, sizing charts, 404 pages,
   and legal terms." Because "users perceive your brand as a singular entity and don't care about
   your organizational structure." (l.740–743)
4. **Present findings** (l.744–748). This is where naming disputes surface: "'Oh, we call that the
   utility bar.' 'Oh, we call it the admin nav.' 'Oh, we call it the floating action area!'"
   Explicitly: don't force consensus in ten minutes; the point is to open the discussion.
5. **Regroup** (l.751–759). Combine into an "über-document," then decide: which patterns stay, go,
   or merge; what the names are; how to get to a living library.

**The emotional payload:** "Have you ever wanted to see a CEO cry? Laying bare all your UI's
inconsistencies is a great way to make that happen! ... You don't need to be a designer to recognize
that having 37 unique button styles probably isn't a good idea." (l.753)

**Benefits** (l.763–767): captures inconsistencies; gets organizational buy-in; **establishes scope
of work**; lays the groundwork + shared vocabulary.

### 4.3 "Ask forgiveness, not permission" (l.768–786)

> "When you give stakeholders the option to say no to something, they will. So simply don't give them
> that opportunity." (l.772)

The Lego analogy from Wolfram Nagel (l.772–782): you can dump the bricks on the table and rummage, or
sort them first. "No doubt organizing takes time, planning, and effort... The fact that this
configuring isn't visibly represented in the final product may tempt us to say it serves as a
distraction to the real work." But sorting means "you can now create the whole in a more realistic,
deliberate, and efficient manner."

### 4.4 Redefining design; death to the waterfall (l.791–849)

Dan Mall: "As an industry, we sell websites like paintings. Instead, we should be selling beautiful
and easy access to content, agnostic of device, screen size, or context." (l.797)

Beyond aesthetics, a design system must handle (l.813–817): accessibility and resilience; flexible
layouts; **performance as an essential design principle**; progressive enhancement (core experience
first, enhancements layered); future-friendliness.

The waterfall parable (l.821–839) — `homepage_v9_final_for-review_FINAL_bradEdits_for-handoff.psd` —
ends with the front-end developer receiving "seven typefaces and nine unique button styles," a
desktop-centric impossible layout, and "perfect-yet-improbable user-generated content." The developer
then has to invent states (hover/active/disabled) that were never designed. (l.835–837)

### 4.5 Establishing direction with lo-fi artifacts (l.878–946)

- **Content and display patterns** via lo-fi HTML wireframes or, better, **a spreadsheet** (l.891–896):
  columns articulating which display patterns go on a template, what content patterns they hold,
  their relative hierarchy and purpose. "If you read the leftmost column vertically, you're
  effectively looking at the mobile-first view."
- **20-second gut test** (l.903–908): show 20–30 sites for 20s each, everyone scores 1–10, then
  discuss the five lowest, five highest, and *most contentious*. Surfaces aesthetic values without
  producing a single comp.
- **Style tiles** (Samantha Warren) and **element collages** (Dan Mall) — explore atmosphere and
  applied components without layout commitment. Crucially: style tiles "reinforce pattern-based
  thinking by educating stakeholders about design systems rather than pages." (l.917)
- **Front-end prep chef** (l.927–935): developers code from day one — environment, shell templates,
  crude markup for anticipated patterns. "If developers aren't coding from day one of the project,
  there's something wrong with the process."

Client feedback he never forgot: "These element collages look great, but it's like you're asking me
to comment on how beautiful a face is by showing me the nose." (l.970) — so comps still have a role,
*after* direction is agreed, to put explorations in context.

Dan Mall again: **"Let's change the phrase 'designing in the browser' to 'deciding in the
browser.'"** (l.981) Static comps "should be treated merely as hypotheses rather than set-in-stone
specifications." (l.980)

The compounding payoff: "as each pattern becomes more fully baked, any template that includes the
pattern will become more fully baked as well. That means **the level of effort to create new
templates decreases dramatically** over the course of the project, until eventually creating a new
template mostly involves stitching together existing patterns." (l.987)

---

## 5. Chapter 5 — Maintaining design systems (the most important chapter for IH)

### 5.1 Artifact vs. product

> "A style guide is an artifact of design process. A **design system is a living, funded product with
> a roadmap & backlog, serving an ecosystem.**" — Nathan Curtis (l.1004)

> "Focusing on style guide delivery as the climax is the wrong story to tell. A system isn't a project
> with an end, it's the origin story of a living and evolving product that'll serve other products."
> — Nathan Curtis (l.1027)

### 5.2 "Design system first" mentality + friendly friction (l.1016–1020)

Worked example: a custom dropdown underperforms on the product detail page. Naive fix: remove it from
that page. System fix: ask "if this custom dropdown isn't performing well here, perhaps it's not
performing well elsewhere" → change the pattern globally.

> "Broken behavior and opportunities to enhance the UI will often be realized at the **application**
> level, but those changes should often be acted on at the **system** level. Adding this bit of
> friendly friction into your workflow ensures improvements are shared across the entire ecosystem,
> and **prevents the system from being eroded by a series of one-off changes.**" (l.1020)

### 5.3 The ten commandments (l.1031, restated l.1286–1296)

official / adaptable / maintainable / cross-disciplinary / approachable / visible / bigger /
context-agnostic / contextual / last.

### 5.4 Make it official — the three-step con (l.1035–1052)

**1. Make a thing. 2. Show that it's useful. 3. Make it official.** Repeated verbatim at l.1190. If
leadership still says no: "You may have lost the battle, but you can certainly win the war... you'll
end up with a grassroots-supported system."

### 5.5 Makers and users (l.1057–1093)

Not everyone contributes, but **someone must own it.** Makers hold the bird's-eye view; users hold
the on-the-ground application view. Jina Bolton: "The Design System informs our Product Design. Our
Product Design informs the Design System." (l.1064)

At small orgs, makers are "senior-level staff who have the experience to make thoughtful decisions,
and the authority to enforce the design system." (l.1073)

The scaling payoff: "**the design system serves as a quality control vehicle that helps users apply
best practices regardless of each individual's skill level.**" (l.1087)

### 5.6 Make it adaptable — governance (l.1094–1130)

The anti-goal: "If users feel handcuffed and pigeonholed into using patterns that don't solve their
problems, they'll perceive the design system as an unhelpful tool and start searching elsewhere."
(l.1096)

**The governance questionnaire** (l.1098–1102), verbatim, because it's a ready-made checklist:
- What happens when an existing pattern doesn't quite work for a specific application? Modify?
  Recommend a different pattern? Create a new one?
- How are new pattern requests handled?
- How are old patterns retired?
- What happens when bugs are found?
- Who approves changes?
- Who keeps documentation up to date?
- Who actually makes changes to the UI patterns?
- How are changes deployed to live applications?
- How will people find out about changes?

Canonical's Vanilla team drew a **decision tree** for pattern acceptance (l.1108–1113).

Three change types: **modification, addition, removal** (l.1114).

On addition — the discipline that keeps a system from bloating:

> "If every whim results in a brand new pattern, the design system will become a bloated and unwieldy
> Wild West. It's worth asking **if this is a one-off situation or something that can be leveraged in
> other applications.** Perhaps you may want to assume a one-off until a different team encounters a
> similar use case. If the team working on Application 2 looks at Application 1 and says, 'I want
> that!' perhaps that's a good indicator that a one-off pattern should be added." (l.1123–1124)

On removal: Salesforce's **Sass Deprecate** flags patterns heading for the chopping block and
recommends alternatives (l.1130).

### 5.7 Make it maintainable — friction kills systems (l.1131–1173)

> **"The biggest existential threat to any system is neglect."** — Alex Schleifer, Airbnb (l.1133)

> "Many systems fall into a state of disrepair because **the effort required to make updates is far
> too high.** If it's difficult and time-consuming to update patterns, documentation, and
> applications, people will eventually get so frustrated that they stop making the effort." (l.1135)

**The holy grail** (l.1136–1144): pattern library and production perfectly in sync — one change
updates both. Lonely Planet's Rizzo does it via an API for UI patterns consumed by both.

The spectrum of approaches (Marcelo Somers, l.1151): "crude, manual front-end code copying-and-pasting
on one end, to baking the pattern library directly into the production environment on the other."
CSS/JS are easy to share (versioned CDN URL: `http://mycdn.com/1.3.5/styles.css`); **markup is hard**
because it's entangled with back-end logic. Bridge = a shared templating language (l.1156–1163;
Phase2 shares Twig between Pattern Lab and Drupal "without any template duplication at all").

And the honest caveat (l.1166–1173): decentralized orgs (his example: the US federal government)
can't reach the grail. "Even getting *some* design system in place — a handful of go-to UI patterns,
some helpful documentation, and guiding principles — can show your organization the light."

### 5.8 Cross-disciplinary — the carousel argument (l.1174–1181)

One component, seven disciplines: business owners choose the products; copywriters fit the constraint;
art directors ensure legibility at every screen size; UX confirms controls; front-end handles
responsive/accessible/performant; back-end wires it up. "A style guide can help gather those different
perspectives under one roof."

> "treating a style guide **solely as a developer resource limits its potential**... it should be a
> watering hole for the entire organization." (l.1175–1176)

### 5.9 Approachable, visible, public (l.1182–1253)

- Attractive containers get used. Yelp's guide "explains what the resource is, who it's for, and how
  to use it." (l.1188) "Making a good-looking style guide isn't just design for design's sake; it
  reflects an organization's commitment." (l.1190)
- **Evangelism starts before the system exists** (l.1196–1198): internal blog, chat channel.
- **Communicating change** (l.1199–1213): change logs, roadmap, success stories, tips and tricks.
  Automate it — Shyp pipes pull requests into a `#Design` Slack channel (l.1210).
- **Training and support** (l.1214–1240): pair sessions, workshops, webinars, tutorials, and — key —
  **onboarding**: "bake design system training right into the onboarding process for new employees."
  Support: issue trackers, office hours, chat, forums, and *proactive outreach* ("Not everyone has
  the time or the personality to ask questions").
- **User contributions** (l.1233–1240): pull requests, interviews, requests for feedback ("We're
  considering deprecating our carousel pattern and would like to hear what you think"), surveys,
  "state of the union" meetings.
- **Make it public** (l.1241–1253): increases visibility, **creates accountability** ("a helpful bit
  of pressure to keep it an up-to-date and useful resource"), and is a recruiting magnet. "These are
  UI patterns, not nuclear codes." (l.1245)

### 5.10 Make it bigger (l.1254–1261)

Extend the hub: voice and tone, brand, code, design principles, writing guidelines all in one place
(Intuit's Harmony). Also: document **platform divergence** — Harmony has web/iOS/Android toggles per
pattern, "maintain a mostly consistent design system across platforms but also document pattern
divergences when they occur." (l.1261)

### 5.11 Make it context-agnostic (l.1262–1268) — THE scaling rule

> "The way your UI patterns are named will undoubtedly shape how they are used. **The more agnostic
> pattern names are, the more versatile and reusable they become.** Because we tend to establish UI
> patterns in the context of a broader page, it can be tempting to name components based on where
> they live. But rather than naming your component 'homepage carousel,' you can simply call it
> 'carousel'...
>
> Another challenge for naming display patterns is that we tend to get distracted by the **content**
> patterns that live inside them. For instance... you may be tempted to call a block containing a
> product image and title a 'product card.' But naming things in this manner **immediately limits
> what type of content can live inside it.** By naming the pattern simply 'card,' you can put all
> sorts of content patterns inside it: products, promotions, store locations, and so on."

The technique: **blur out the content** when naming, "so your names reflect the patterns' structures
rather than the content living inside them." (l.1266–1267)

### 5.12 Make it contextual (l.1269–1277)

Show usage, not just a demo. Material Design does it with photos/videos/usage rules. Pattern Lab does
it with lineage — "a sort of pattern paper trail that helps immensely with QA efforts, as it
highlights exactly which patterns and templates would need to be tested if changes were made."

### 5.13 Make it last (l.1278–1283)

Fine wine, not a used car. "Even if you were to burn everything down and rebuild a new system from
the ground up, you'll find your UIs will still need buttons, form fields, tabs, and other existing
components."

---

# PART II — APPLIED TO INGLÉS HOTELERO

## 6. Audit: where IH actually stands (evidence from the codebase)

Read: `src/content/practice-drills.ts`, `src/content/practice.ts`, `src/lib/content/drills-store.ts`,
`src/lib/practice/{picker,vocab,seed-vocab,sm2}.ts`, `src/components/practice/*`,
`src/lib/supabase/types.ts`, `src/app/masteros/(authed)/modules/DrillTemplateForm.tsx`.

### 6.1 What's genuinely good (do not break these)

- **`src/content/practice.ts` is a textbook separation of structure and content.** All Spanish UI
  copy in one `PRACTICE_COPY` object; components import labels. This is exactly Frost §3.2. It
  already means a second UI language is a file, not a refactor. Keep this pattern; extend it.
- **`src/components/ui/` is a real atom layer.** `Button` (variant × size), `Card` + subcomponents,
  `Input`, `Badge`/`LevelBadge`, `HairlineRule`. Tokens live in `tailwind.config.ts`. The `em`/`i`
  global redefinition is a genuine signature atom.
- **`drills-store.ts` is a partial holy grail.** Its own header comment names the exact failure Frost
  warns about: `/masteros/modules` "wrote to the `content_items` table, which NOTHING in the product
  read. Editing a module changed nothing for employees — a CRUD screen over an orphan table." That
  is a pattern library that had "snapped off and slid into the abyss" (Frost l.1012). Fixing it was
  right. DB-first with static fallback is a sound architecture.
- **`sm2.ts` + `vocabulary_progress`** — the SM-2 state is correctly separated from the card body.
  The *state* layer is atomized even though the *content* layer isn't.

### 6.2 The core structural problem: `Drill` is a page, not a system

```ts
// src/content/practice-drills.ts
export type Role = "bellboy" | "frontdesk" | "restaurant";

export type Drill = {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  listening:  { audio_text: string; options: {emoji; text_es; correct}[]; explanation_es: string };
  reinforce:  { title_es: string; model_en: string; note_es: string };
  vocabulary: { word_en; word_es; example_en; example_es }[];
};
export const DRILLS: Record<Role, Drill[]> = { bellboy: [...], ... };
```

Measured facts:

| Metric | Value |
|---|---|
| Total drills | **60** |
| Roles × levels | 3 × 4 = 12 cells |
| **Drills per role×level cell** | **~5** |
| Total `word_en` entries | 180 |
| **Unique** `word_en` values | **179** |
| `emoji:` fields in content | 181 |

**Every vocabulary word appears in exactly one drill.** Reuse ratio ≈ 1.006. The lexicon has no
recombination whatsoever. A learner meets "luggage" in exactly one context, ever, and then only as an
isolated flashcard. Frost's product-grid organism repeats one molecule endlessly; IH's lexeme atoms
each appear once and never again.

**Consequences, in Frost's terms:**

1. **No addressable atom layer.** You cannot ask the system "what are the 60 core lexemes for
   recepción at A2?" The proof is in the code: `lookupVocabContent()` in `src/lib/practice/vocab.ts`
   scans *every drill's* vocabulary array looking for a matching `word_en`. That nested loop is the
   shape of a missing table. `seedVocabularyIfEmpty()` then *materializes* a lexicon by walking the
   drills — reconstructing at runtime an entity that should have been first-class.
2. **The day-21 content cliff.** ~5 drills per role×level cell, and `picker.ts` rotates by
   `day_of_year % candidates.length`. A learner exhausts their entire cell in **five days**, then
   loops the same five drills forever. At the stated 5-min/day target this is a retention cliff no
   streak mechanic can paper over. *This is the single most serious product risk visible in the
   code, and it is a direct consequence of authoring at the page level.*
3. **No content contract.** `audio_text` is `string`. `model_en` is `string`. Nothing enforces
   length, clause count, level-appropriateness, or that the three flashcards have anything to do with
   the audio the learner just heard. Frost l.377: templates must "articulate important properties of
   components like image sizes and character lengths." IH has no template layer for content at all.
4. **Blob storage undermines the holy grail.** `drills-store.ts` stores the whole nested `Drill`
   verbatim in `content_items.options` (jsonb) and *mirrors* flat columns (`audio_text`,
   `model_response`, `scenario_es`, `topic`) "so the existing modules list UI shows something
   readable." Two representations of one truth = Somers' copy-paste end of the spectrum, wearing a
   database costume.

### 6.3 The naming problem — IH violates "make it context-agnostic" at the schema level

Frost's rule (l.1263): don't name it `homepage carousel`; don't name it `product card`; blur the
content and name the structure.

IH's field names bake **both** the target language and the learner's L1 into the schema:

| Field | Baked-in assumption |
|---|---|
| `word_en`, `example_en`, `model_en`, `audio_text` (implicitly English) | target language is English, forever |
| `word_es`, `example_es`, `text_es`, `note_es`, `explanation_es`, `title_es` | L1 is Spanish, forever |
| `Role = "bellboy" \| "frontdesk" \| "restaurant"` | hospitality sector, three roles, as a **union type** |
| `RoleModule` in `src/lib/supabase/types.ts` — same union, duplicated | ditto, now in the DB layer, RLS, HR dashboards |

The stated goal is: *"The system must later scale to other languages and other service sectors."*
With this schema, that goal costs a migration touching the content file (180 entries), the DB enum,
`picker.ts`, `vocab.ts`, `seed-vocab.ts`, `drills-store.ts`, the HR reporting layer, and the Master
OS authoring form. **Adding Brazilian Portuguese learners — Rio/São Paulo/Fortaleza hospitality is
the obvious second market — currently means forking the entire corpus.**

This is Frost's `product card` mistake, except it's in a database schema instead of a CSS class, so
it costs 100× more to undo. And it gets more expensive every day the corpus grows.

### 6.4 UI-layer drift (real, lower leverage)

- **Two components named `LevelChip`**: `src/components/practice/LevelChip.tsx` and
  `src/components/hr/LevelChip.tsx`. Plus `LevelBadge` in the ui layer. This is literally Frost's
  "utility bar / admin nav / floating action area" anecdote (l.747) reproduced in a one-person
  codebase. It happens *faster* solo, because there's no second person to say "we already have that."
- **Emoji renders in production**, violating the documented design system's explicit "Never: emoji in
  production UI." `src/app/exam/[id]/listening/page.tsx:238` renders `{opt.emoji}`. The *practice*
  step already migrated to A/B/C letters (`StepListening.tsx` uses
  `String.fromCharCode(65 + i)`) — but the exam didn't follow. Worse:
  `src/app/masteros/(authed)/modules/DrillTemplateForm.tsx:73,163` still *authors* an emoji field
  (defaulting to `"•"`). **The CMS is manufacturing design-system violations.** Exactly the drift an
  interface inventory exists to catch.
- **Three shells** (`hr/Shell.tsx`, `masteros/Shell.tsx`, site chrome). Probably justified — but
  undocumented, so nobody knows whether they're three organisms of one template or three forks.
- **No living pattern library.** `.orcha/design-system-reference.html` is a static file. Frost's
  distinction is exact: that is an *artifact*, not a *system*. It cannot drift-detect, because it
  renders nothing real.

---

## 7. The recommendation: an atomic taxonomy for the *learning* system

Frost's own precedent (l.436–441): rename the tiers to whatever your organization understands. IH
should keep the hierarchy and use pedagogically honest labels.

| Frost tier | IH content tier | Definition | Examples |
|---|---|---|---|
| Atom | **Lexeme** | A word or fixed chunk in the target language. Cannot decompose without losing job meaning. | `luggage`, `right away`, `I'll take care of it` |
| Atom | **Audio asset** | One recording of one utterance by one voice. | `lex_0142.voice_male_us.mp3` |
| Atom | **Gloss** | One rendering of a lexeme in one L1. | `luggage` → es-MX `equipaje`; pt-BR `bagagem` |
| Atom | **Function** | The communicative job being done. | `apologize`, `give-directions`, `upsell`, `confirm`, `de-escalate` |
| Molecule | **Exchange** | An adjacency pair: guest turn → staff turn. Single responsibility: one function. | "Can you help with my bags?" → "Of course, sir. Let me take your luggage." |
| Molecule | **Comprehension item** | Audio prompt + N action options + explanation. | current `Drill.listening` |
| Molecule | **Production item** | L1 scenario + target function + model answer + rubric ref | current `Drill.reinforce` + speaking |
| Molecule | **Flashcard** | Lexeme ref + example ref + SM-2 state | current `Drill.vocabulary[i]` + `vocabulary_progress` |
| Organism | **Scenario** | A job situation containing several exchanges. | "Guest arrives 11pm, room not ready, has 3 bags" |
| Organism | **Drill** | The assembled daily unit. *Composed, not authored.* | today's `Drill` |
| Template | **Loop template** | Slot structure + content contracts. No content. | Daily Loop, Placement Exam, WhatsApp Micro, Weekly Review |
| Page | **Session instance** | A real learner, a real day, real content, real state. | "Tuesday, B1 bellboy, Cancún, 47 overdue cards" |

**The critical inversion:** today a Drill is *authored* and its vocabulary is *owned* by it. In the
target model, lexemes and exchanges are authored, and drills are *composed* from them under template
constraints. That is precisely Frost's Russian nesting doll (§3.1) applied to curriculum, and it is
where all the leverage is.

**What composition unlocks:**
- The day-21 cliff disappears. 140 lexemes × 40 exchanges × 12 scenario frames per role generates
  orders of magnitude more valid drill instances than 5.
- **Deliberate re-encounter.** A lexeme can be scheduled to reappear across *different* scenarios —
  contextual spaced repetition, not just flashcard repetition. This is the thing that actually
  produces job fluency, and it is structurally impossible today.
- **Coverage becomes measurable, which is what the BUYER pays for.** Not "5-day streak" (a Duolingo
  metric) but *"María can produce 84 of the 140 phrases her job requires; here are the 12 she still
  fails."* That is the HR report that renews a $300/month subscription. It requires an addressable
  atom layer. There is no other way to get it.

---

## 8. Anti-patterns — where the book contradicts what a naive team would do

Loudest first.

1. **NAIVE: "We need more drills — let's write 200 more."**
   **FROST:** that's counting pages (l.96). Level of effort is determined by components. Writing 200
   more monoliths quadruples the maintenance surface, doesn't fix the day-21 cliff (it moves it to
   day 60), and makes the eventual atomization 4× more expensive. **Build the lexicon and the
   template contracts first; then drills are nearly free.**

2. **NAIVE: "New sector? Copy `practice-drills.ts` → `practice-drills-hospital.ts` and add
   `'orderly'` to the union."**
   **FROST:** this is `homepage carousel` (l.1263) plus the framework-fork problem (l.193). Roles,
   sectors and languages must be **rows, not types.** Every day this is deferred, the migration gets
   more expensive.

3. **NAIVE: "Let the AI generate the content — we have `/api/masteros/modules/ai-draft`."**
   **FROST:** without a template that articulates content structure (l.377–378), AI produces
   *plausible-looking* drills that silently violate level, length, and lexicon rules. The failure is
   invisible: a B2-length model answer handed to an A1 bellboy just quietly doesn't work. **Define
   the contract first, let AI fill slots, and fail closed on violation** — same posture CLAUDE.md
   already mandates for scoring ("return JSON only — validate strictly, fail closed").

4. **NAIVE: "Design the happy path; edge cases later."**
   **FROST is blunt** (l.559–563, l.400, l.428): variations *determine how the underlying patterns are
   constructed*. For IH's actual learner — tired, embarrassed, prepaid data, mid-range Android — the
   edge case **is** the experience. A learner returning after three weeks to 47 overdue cards is not
   an edge case; it's the modal returning user.

5. **NAIVE: "Hotel #1 wants a custom spa module. Sure, we'll build it for them."**
   **FROST:** special snowflake syndrome (l.259) + the addition rule (l.1123–1124). **Assume one-off
   until a second customer asks.** When hotel #2 asks, it becomes a system pattern. Otherwise you
   fork content per hotel and die at 15 customers.

6. **NAIVE: "The design system is done — it's in `.orcha/design-system.md`."**
   **FROST/Curtis** (l.1004): "A style guide is an artifact of design process. A design system is a
   living, funded product." A markdown file last meaningfully touched in April is an artifact. The
   emoji still rendering in the exam is the proof.

7. **NAIVE: "Naming is bikeshedding, we'll rename later."**
   **FROST** (l.194, l.1263–1268): naming determines usage. `word_es` is already in 180 content
   entries, the DB, the API surface, and the Master OS form. You will not rename it later.

8. **NAIVE: "Copy Duolingo's proven engagement mechanics."**
   **FROST** (l.185–200): the jumpsuit. Duolingo's components encode *consumer streak retention on
   general language*; IH sells *on-shift job performance to a B2B buyer*. Borrowing their component
   vocabulary imports their objective function. Build the tiny Bootstrap.

9. **NAIVE: "The content library is an internal tool — keep it private."**
   **FROST** (l.1241–1253): public increases visibility, creates accountability, and recruits. For IH
   there's a stronger version: **give the HR buyer read access to the content library for their
   roles.** "Here is exactly what your staff learns this month" is a sales asset, a renewal asset,
   and it creates the pressure that keeps the corpus maintained.

10. **NAIVE: "Pattern library work is nice-to-have; ship features first."**
    **FROST** (l.293–294): the auxiliary-project conundrum. He explicitly analogizes to
    accessibility — the idea that it's a costly extra line item is "a fallacy." Bake it in whether
    or not the plan calls for it. Also: **"ask forgiveness, not permission"** (l.772).

---

## 9. Concrete build list (ordered)

**P0 — structural, do before authoring any more content**

1. **Atomize the lexicon.** New tables: `lexemes` (id, target_lang, text, ipa, function_tags[],
   cefr_level, audio_asset_id), `glosses` (lexeme_id, l1_lang, text, example_target, example_gloss).
   Migrate the 179 unique words out of `practice-drills.ts`. Rewrite `lookupVocabContent()` as a
   lookup, delete the nested scan. Rewrite `seedVocabularyIfEmpty()` to seed from the lexicon
   filtered by role+level, not by walking drills.
2. **Roles and sectors become data.** Replace `Role` / `RoleModule` unions with a `roles` table
   (slug, sector, display_name, l1_default). Keep a generated TS type for ergonomics, but the DB is
   authoritative. Frost l.1263.
3. **Language out of the field names.** `word_en`/`word_es` → `lexeme.text` + `gloss.text` keyed by
   `lang`. `model_en` → `production_item.model_target`. Do it now, at 179 lexemes, not at 5,000.
4. **Write the Loop Template with content contracts**, in one file, enforced by one validator that
   runs in (a) Master OS on save, (b) CI over the seed corpus, (c) the AI-draft endpoint. Starting
   contract:
   - `audio_text`: 4–14 words, ≤2 clauses, ≤8s spoken, must realize the declared `function`
   - `options`: exactly 3, exactly 1 correct, each ≤6 L1 words, distractors must be *plausible job
     actions* (not absurd) — this is a rubric line, and it should be a lint rule
   - `model_target`: 4–12 words, sayable in one breath, every lexeme at or below the drill's CEFR
     level (validated against the level's lexeme allow-list)
   - `flashcards`: exactly 3 lexeme refs, **≥1 of which appears in this drill's audio or model
     answer** — today nothing connects the flashcards to what the learner just heard
5. **Compose drills instead of authoring them.** A generator that takes (role, level, function
   coverage targets, learner's lexeme history) → a valid drill instance. Hand-authored drills remain
   supported as pinned instances for the highest-value scenarios.

**P1 — maintainability**

6. **Ship `/sistema`** — a real, running pattern library rendering actual components and actual
   content patterns from source. Includes **lineage**: for any lexeme/exchange, what contains it and
   where it's used (Frost l.640–649). "What breaks if I change this?" must be answerable before
   content maintenance is possible at all.
7. **Normalize `content_items`.** Kill the blob-plus-mirrored-columns duplication. One source of
   truth; the Master OS list renders from the same joins the product reads.
8. **Pseudo-patterns for learner state.** A fixture set, deliberately adversarial in Frost's style
   (l.570–574): 0 due cards / 47 overdue cards / 3 consecutive listening failures / mic denied / 2G
   with no audio / level-pool-exhausted / assigned above level / 22-word model answer / 30-char guest
   name. Every one renders in `/sistema`. Every one is a screenshot test.
9. **Governance decision tree**, written down, even at n=1 (Canonical's Vanilla diagram, l.1112).
   When does a hotel request become a pattern, a one-off, or a no? Future Diego is a different person
   from Present Diego.

**P2 — consistency cleanup**

10. **Run a real interface inventory** (Frost's ch4 process, 60–90 min, timer on) across product +
    landing + HR + Master OS. Predicted findings: two `LevelChip`s, three shells, emoji in exam
    listening + Master OS authoring form, button/heading/spacing drift between the four surfaces.
    Merge, delete, name.
11. **Remove the `emoji` field** from the content model and the authoring form; make the exam use the
    same A/B/C atom the practice step uses.
12. **Promote "Respeto, no condescendencia" to a content voice-and-tone guide** with worked
    before/after examples for `note_es` / `explanation_es` / feedback strings, filed next to the
    content templates. Add it to the validator where mechanizable (banned condescension patterns,
    banned diminutives, usted-form consistency).

**P3 — the customer-development version of the interface inventory**

13. **Run a job-language inventory in a real hotel.** Shadow a bellboy, a front-desk agent, and a
    waiter for one shift each in Cancún. Capture *every distinct English exchange that actually
    occurs*. Categorize by function. This is Frost's ch4 exercise pointed at reality instead of at a
    UI, and it produces three things at once:
    - the atoms (real lexemes, real exchanges, ranked by frequency)
    - a validation of the existing 60 drills against observed reality — expect to find several
      greeting variants and zero coverage of "guest is angry about a charge"
    - **the sales wrecking ball.** Put the inventory in front of an HR director: "your staff needs
      these 140 exchanges; here's how many of them each of your 40 employees can currently produce."
      That is Frost's "show, don't tell" (l.692–693, l.753) aimed at the buyer — and it directly
      addresses the recorded strategic gap (over-built, under-validated, 0 paying, 7 uncontacted
      leads).

---

## 10. Loose ends worth remembering

- Frost's `ish.` insight (l.611) — the randomized-viewport tool was more valuable for *educating
  stakeholders* than for finding bugs. IH analogue: a "see it as your staff sees it" mode in the HR
  dashboard (throttled network, mid-range Android viewport, one hand) would sell the product better
  than any feature list.
- "Progressively enhance our interfaces by establishing core experiences then layering on
  enhancements" (l.816). For a prepaid-data learner on 2G, the *core* experience is text; audio is the
  enhancement. Currently audio is load-bearing. Worth an explicit degradation contract per pattern.
- Intuit Harmony's per-pattern web/iOS/Android toggle (l.1261) maps directly onto IH's PWA vs.
  WhatsApp split. The same content pattern renders differently in each channel; the divergence should
  be *documented in the library*, not discovered in code.
- Frost on onboarding (l.1223): bake system training into new-employee onboarding. IH analogue —
  when a hotel signs, the training manager should be onboarded into the content library, not just the
  dashboard. Makers/users (l.1057) applies even when the maker is one person.
