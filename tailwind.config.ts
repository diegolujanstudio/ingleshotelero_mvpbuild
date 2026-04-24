import type { Config } from "tailwindcss";

/**
 * Inglés Hotelero — Design System v0.1
 *
 * Three principles (in order of importance):
 *   1. Respeto, no condescendencia
 *   2. Editorial, no aplicación
 *   3. Una sola nota de color — el azul tinta es el ÚNICO acento.
 *
 * Tokens mirror CSS variables declared in src/app/globals.css so utilities
 * and raw CSS stay aligned. Full reference: .orcha/design-system.md.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Neutrals — Ivory
        ivory: {
          DEFAULT: "#F5F0E6", // Fondo principal
          soft: "#EFE7D6", //    Superficie
          deep: "#EBE4D4", //    Contenedor
          light: "#F0E8D8", //   Texto · dark mode
        },
        // Divisores
        hair: "#D9CEB9",
        // Texto — Espresso
        espresso: {
          DEFAULT: "#2B1D14", // Texto primario
          soft: "#4A3426", //    Texto secundario
          muted: "#7A6352", //   Texto terciario
          deep: "#1C140F", //    Dark mode · fondo
        },
        // Accent — Azul tinta (la única nota de color)
        ink: {
          DEFAULT: "#2E4761", // Acento principal
          deep: "#1C2E42", //    Hover · texto sobre
          soft: "#C3CDD8", //    Badge · selección
          tint: "#E6ECF2", //    Fondo destacado
        },
        // Semánticos — estados del sistema
        success: "#3E6D4D",
        warn: "#B38540",
        error: "#A84738",
      },
      fontFamily: {
        // New Spirit loaded via @font-face in globals.css; reference the family directly.
        serif: ['"New Spirit"', "Georgia", "serif"],
        // Sans + mono loaded via next/font/google, exposed as CSS variables.
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Editorial type scale — serif (display) + sans (UI/body) + mono (labels).
        // Matches .t-* classes in the design system artifact.
        "t-display": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.025em" }], // 72
        "t-h1": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }], // 48
        "t-h2": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.018em" }], // 32
        "t-h3": ["1.375rem", { lineHeight: "1.2", letterSpacing: "-0.012em" }], // 22
        "t-body-lg": ["1.0625rem", { lineHeight: "1.5" }], // 17
        "t-body": ["0.875rem", { lineHeight: "1.55" }], // 14 (base)
        "t-label": ["0.8125rem", { lineHeight: "1.3" }], // 13
        "t-caption": ["0.75rem", { lineHeight: "1.4" }], // 12
        "t-mono": ["0.625rem", { lineHeight: "1", letterSpacing: "0.2em" }], // 10 · 0.2em tracking · uppercase
      },
      borderRadius: {
        // Editorial scale — nothing larger than 12px except pill.
        xs: "3px", // badges
        sm: "8px", // swatches, small cards
        md: "10px", // cards, inputs, buttons rectangles
        lg: "12px", // option cards
        pill: "999px", // button default
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        shell: "80rem", // 1280px — matches .ds-shell
        prose: "50rem", // ~800px — matches .ds-intro / .ds-intro-sub
      },
      spacing: {
        // Section rhythm matches the artifact: 36/64/96/120 (gutter, section-gap, page-gap, page-outer).
        "section-head": "2.25rem", // 36
        "section-gap": "6rem", // 96
      },
    },
  },
  plugins: [],
};

export default config;
