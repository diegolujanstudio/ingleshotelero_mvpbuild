# Pricing — the reasoning behind the numbers

Companion to `GTM-PLAYBOOK.md` §2 (Money model). This file exists so nobody —
including a future me — moves a band edge or a price point without knowing what
it was load-bearing for.

**Nothing here changes the USD price points.** $150 / $300 / $500 were derived in
the playbook and are wired to live Stripe Payment Links. What changed in July 2026
is the *bands*, the *currency shown*, and what the calculator computes.

---

## 1. The three decisions, and why

### 1.1 Per-property, never per-seat — this is a strategy, not a convenience

Measured annual turnover in Mexican hotels is **30–80%**, with an academic
measurement of **48.72%** across 67 Guanajuato properties (Caldera González et
al. 2019). Per-seat pricing in that market forces the buyer to re-purchase
roughly half their licences every year, and every new hire becomes a
budget conversation. Per-property makes turnover *free* to the buyer, which:

- removes the single biggest friction in expanding a pilot,
- turns our worst market condition into a selling point,
- and matches how the product actually costs us (WhatsApp ≈ $0.24/learner/month).

**This is the single strongest thing about our pricing and it was invisible on
the site until now.** The calculator now leads with it.

### 1.2 Prices are shown in pesos first

The buyer budgets in MXN. The learner earns MXN ($7,584.70/month average in the
Riviera Maya). Quoting USD-first on a Mexican B2B page introduces FX ambiguity at
the exact moment we want the number to feel concrete. USD stays as the secondary
figure because the Stripe links and contracts are USD-denominated.

Rate used on the site: **≈ 17.5 MXN/USD**, labeled as approximate. Actual mid-market
rate was ~17.48 in July 2026. If the peso moves more than ~5%, update `FX` in
`landing/src/components/RoiCalc.astro` and the static figures in
`PricingTickets.astro`, `llms.txt`, and `plataforma.astro`.

### 1.3 Annual = pay 10 months, get 12

A ~17% discount for annual commitment. Standard, legible, and gives the sales
conversation a close that doesn't require discounting the list price ad hoc.

---

## 2. The bands — and the constraint that generated them

| Plan | Headcount | MXN/mo | USD/mo |
|---|---|---|---|
| Inicial | 12–20 | $2,625 | $150 |
| Profesional | 21–50 | $5,250 | $300 |
| Empresarial | 51+ | from $8,750 | from $500 |

### The constraint

> **No point on the slider may cost more per employee-hour than a traditional
> group class.**

If a prospect can do that arithmetic and beat us, the calculator becomes a
weapon against us. The market rate, from public 2026 Mexican pricing, is
**$450–850 MXN per hour for a closed group of 4–8** — i.e. **$75–142 MXN per
student-hour**, midpoint **$108**.

Against ~2.5 h of practice per employee per month (5 min × 30 days):

| n | Plan | MXN/employee/mo | MXN/employee-hour | vs $108 |
|---|---|---|---|---|
| 12 | Inicial | 219 | 88 | ok |
| 20 | Inicial | 131 | 53 | ok |
| **21** | **Profesional** | **250** | **100** | **ok — worst cell** |
| 30 | Profesional | 175 | 70 | ok |
| 50 | Profesional | 105 | 42 | ok |
| 51 | Empresarial | 172 | 69 | ok |
| 150 | Empresarial | 58 | 23 | ok |

The binding case is always the **first employee of a band**, because that is
where the flat fee is spread thinnest.

### What the old bands got wrong

The previous bands were ≤12 / ≤45 / 46+, with the slider starting at 5. That
produced two defects:

- **n=16 cost $131/employee-hour — more than the market rate.** A prospect at 16
  employees was being shown, by our own calculator, that we were the expensive
  option.
- **n=5 cost $1.00/employee/day**, which broke the "less than the lobby coffee"
  line the page was making three inches above it.

Widening Inicial to 20 and starting the slider at 12 removes both. The slider
starts at 12 because the **free 14-day pilot already covers up to 10 employees** —
a property smaller than that is in pilot territory, not paid territory.

> ⚠️ **Moving any band edge requires re-running the table above.** The margin at
> n=21 is only 7%. Widening Profesional downward, or raising its price, will
> silently create a losing cell.

---

## 3. What the calculator computes, and why it changed

The old component was named `RoiCalc` but computed **no return** — it output
three cost figures. Shown three costs, a GM learns to read us as an expense
line. Worse, its headline metric (cost per employee **per day**) *improved with
headcount*, so it told every small property it was getting a bad deal, and it
displayed a **$1,250 one-time exam total** as the second-largest number on a page
whose main offer is a *free* pilot.

The rebuilt panel outputs, in this order:

1. **Plan + band** — no surprise at the boundary; the band is stated.
2. **Price per property, in pesos** — annual discount applied live.
3. **Who it covers this year** — `headcount + (headcount × turnover%)`, defaulting
   to the cited 49%. This is the per-property argument made visible, and it is
   the emphasized figure in the panel.
4. **Per employee per month** — a metric that stays sane from 12 to 150.
5. **The traditional-course anchor** — `ceil(n/6) groups × 24 h × $650 MXN`,
   which makes 3 and 4 land.

The placement exam is no longer a headline number. It is stated in the pricing
note and the FAQ as $875 MXN/employee, **included free in the pilot** — which is
what the offer architecture always said.

---

## 4. Sources

- Turnover 30–80%, CANIRAC via Expansión — https://expansion.mx/empresas/2026/05/18/hoteles-mexico-ajustes-jornada-laboral-40-horas
- Turnover 48.72% annual, 67 hotels — Caldera González et al. 2019, *Revista Ibero-Americana de Estratégia* 18(4) — https://www.redalyc.org/journal/3312/331267304006/html/
- Riviera Maya wage $7,584.70 MXN/month — Fernández Rodríguez et al. 2020, *Revista ABRA*
- Corporate English class rates, Mexico 2026 — https://www.cronoshare.com.mx/cuanto-cuesta/clases-ingles-empresas · https://s-peak.com/blog-ingles-corporativo-mexico-precio/ · https://ihmexico.mx/cursos-de-ingles-para-empresas/
- USD/MXN ≈ 17.48, July 2026 — https://www.valutafx.com/es/historial-de-cambios/usd-mxn-2026-07-20

---

## 5. Open questions for Diego

1. **Chain volume pricing.** Empresarial is currently *more* expensive per
   property than Profesional, which inverts normal volume logic for a chain
   buying 8 properties. The tickets now say "el precio por propiedad baja a
   partir de la quinta," but there is **no published grid** behind that. It needs
   a real one before a chain conversation, or the line should come out.
2. **Are we underpriced?** A single traditional 24-hour course for a 30-person
   property costs ~$78,000 MXN. We charge $63,000 MXN for a year. With zero
   paying customers, low friction beats margin extraction — but this is worth
   revisiting after the first three pilots convert.
3. **Exam pricing at scale.** $875 MXN × 120 employees = $105,000 MXN upfront for
   a large property. That may need to be bundled into the subscription for
   Empresarial rather than billed separately.
