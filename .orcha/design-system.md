# Design System — Inglés Hotelero v0.1

The visible reference is Diego's artifact at `design-system-reference.html`. This file is the source of truth for engineers and for future Claude sessions.

## Three principles (in order of importance)

1. **Respeto, no condescendencia.** The employee is a professional learning a functional skill, not a student. Typography and space reflect that seriousness. Never infantilize with gratuitous emoji or cartoonish illustrations.
2. **Editorial, no aplicación.** Comfortable columns, generous whitespace, serif hierarchy. We behave like a specialized publication, not a SaaS dashboard. Less container chrome, more air.
3. **Una sola nota de color.** The ink blue (`#2E4761`) is the *only* accent. It appears at key moments — a number, a CTA, a data point. Terracotta, forest, ochre were considered and rejected. If everything is accent, nothing is.

## Typography

- **Display serif:** New Spirit (Sharp Type, licensed). Weights loaded: `300`, `400`, `500`, `700`. No italics, no condensed — the system is built on the one weight that carries hotel warmth: **500**.
- **UI sans:** Plus Jakarta Sans (Google Fonts, via `next/font/google`). Weights 400/500/600/700.
- **Mono (labels + captions):** JetBrains Mono (Google Fonts, via `next/font/google`).

### Scale (Tailwind names in parentheses)

| Name        | Size  | Line | Tracking  | Use                                  |
|-------------|-------|------|-----------|--------------------------------------|
| Display (`text-t-display`) | 72px | 1.00 | -0.025em  | Hero, rare                           |
| H1      (`text-t-h1`)      | 48px | 1.05 | -0.02em   | Page openers                         |
| H2      (`text-t-h2`)      | 32px | 1.10 | -0.018em  | Section titles                       |
| H3      (`text-t-h3`)      | 22px | 1.20 | -0.012em  | Card titles                          |
| Body lg (`text-t-body-lg`) | 17px | 1.50 | —         | Intro paragraphs                     |
| Body    (`text-t-body`)    | 14px | 1.55 | —         | Default body (document base)         |
| Label   (`text-t-label`)   | 13px | 1.30 | —         | Buttons, dense UI                    |
| Caption (`text-t-caption`) | 12px | 1.40 | —         | Secondary annotations                |
| Mono    (`text-t-mono` / `.caps`) | 10px | 1.00 | 0.20em    | Uppercase labels, tags, row headers  |

### The signature detail — `<em>` and `<i>` are not italic

Globally overridden in `src/app/globals.css`:

```css
em, i {
  font-style: normal;
  font-weight: 500;
  color: var(--ink);
}
```

Every emphasis is an accent. "Inglés *Hotelero*" renders with the second word in ink. This is what makes the brand feel like a publication.

## Color

### Neutrals — Ivory

| Token            | Hex       | Tailwind       | Role                  |
|------------------|-----------|----------------|-----------------------|
| Marfil           | `#F5F0E6` | `ivory`        | Fondo principal       |
| Marfil cálido    | `#EFE7D6` | `ivory-soft`   | Superficie            |
| Marfil profundo  | `#EBE4D4` | `ivory-deep`   | Contenedor            |
| Hairline         | `#D9CEB9` | `hair`         | Divisores             |
| Blanco puro      | `#FFFFFF` | `white`        | Tarjeta · input       |
| Oscuro (bg)      | `#1C140F` | `espresso-deep`| Modo oscuro · fondo   |

### Texto — Espresso

| Token          | Hex       | Tailwind          | Role              |
|----------------|-----------|-------------------|-------------------|
| Espresso       | `#2B1D14` | `espresso`        | Texto primario    |
| Espresso suave | `#4A3426` | `espresso-soft`   | Texto secundario  |
| Muted          | `#7A6352` | `espresso-muted`  | Texto terciario   |
| Ivory claro    | `#F0E8D8` | `ivory-light`     | Texto · dark mode |

### Acento — Azul tinta (la única nota de color)

| Token          | Hex       | Tailwind    | Role                 |
|----------------|-----------|-------------|----------------------|
| Azul tinta     | `#2E4761` | `ink`       | Acento principal     |
| Tinta profunda | `#1C2E42` | `ink-deep`  | Hover · texto sobre  |
| Tinta suave    | `#C3CDD8` | `ink-soft`  | Badge · selección    |
| Tinta tinte    | `#E6ECF2` | `ink-tint`  | Fondo destacado      |

### Semánticos

| Token     | Hex       | Tailwind   | Use                  |
|-----------|-----------|------------|----------------------|
| Éxito     | `#3E6D4D` | `success`  | Correcto · activo    |
| Atención  | `#B38540` | `warn`     | Advertencia          |
| Error     | `#A84738` | `error`    | Incorrecto · inactivo|

## Components (Phase 1 primitives)

| Component            | Location                                 | Notes                                             |
|----------------------|------------------------------------------|---------------------------------------------------|
| `Button` / `ButtonLink` | `src/components/ui/Button.tsx`         | Variants: `primary` (espresso), `accent` (ink), `ghost`, `text`. Pill radius. |
| `Card` + `CardHeader` + `CardEyebrow` + `CardTitle` | `src/components/ui/Card.tsx` | White bg, 10px radius, hair border. No shadow ever. |
| `Input`              | `src/components/ui/Input.tsx`            | White bg, 10px radius, hair border, ink on focus. |
| `Badge` / `LevelBadge`| `src/components/ui/Badge.tsx`           | A1 neutral · A2 soft · B1 ink-soft · B2 filled ink. |
| `HairlineRule`       | `src/components/ui/HairlineRule.tsx`     | 1px `hair`-colored divider.                       |
| `Logo`               | `src/components/brand/Logo.tsx`          | Wordmark. Italics via `<em>` → ink.              |
| `NumberedPlaceholder`| `src/components/brand/NumberedPlaceholder.tsx` | Diagonal-stripe "photo TBD" figure with mono caption chip. |

## Radii

| Token      | Value | Use                         |
|------------|-------|-----------------------------|
| `rounded-xs` | 3px   | Badges                      |
| `rounded-sm` | 8px   | Swatches, small cards       |
| `rounded-md` | 10px  | Cards, inputs, button rects |
| `rounded-lg` | 12px  | Option cards                |
| `rounded-pill` | 999px | Button default            |

## Spacing rhythm (matches the DS artifact)

- Inner gutter: `px-6` mobile, `px-12` desktop
- Shell max-width: `max-w-shell` (1280px)
- Prose max-width: `max-w-prose` (800px ≈ 50rem)
- Section heads use the 80px number column + flexible title + 380px right note pattern: `grid-cols-[80px_1fr_380px]`
- Section vertical rhythm: 64 → 96 → 120px (top/between/outer). Tailwind: `py-24` mobile, `md:py-section-gap` (96px) desktop

## Motion

- Transitions 180–240ms, `cubic-bezier(0.22, 1, 0.36, 1)` (Tailwind: `ease-editorial`).
- No bounce, no parallax. Restrained.
- Honor `prefers-reduced-motion`.

## Accessibility

- Espresso on ivory = 11.8:1 ✓
- Ink on ivory = 7.5:1 ✓
- Ink text on white = 8.4:1 ✓
- Focus rings: `ink`, 2px, 2px offset — on every interactive element.
- Tap targets ≥44×44px (`h-11`/`h-12` meets this).

## Iconography

- Lucide icons, 1.5px stroke, sized to the surrounding cap-height.
- Never emoji in production UI. Monospace captions replace them.

## Do / Don't

**Do**
- Set italics with `<em>` — they become ink automatically.
- Use `text-ink` for the single accent moment per view.
- Prefer `<NumberedPlaceholder>` over a gray box or broken-image icon.
- Use `CardHeader` inside `Card` when you want the ivory-soft strip.

**Don't**
- Introduce terracotta, forest, or ochre. They were intentionally removed.
- Use drop shadows. Layering is always by color.
- Use more than one accent per view.
- Use bright/saturated semantic colors as brand tokens — success/warn/error are states, not decoration.
