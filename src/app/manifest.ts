import type { MetadataRoute } from "next";

/**
 * PWA manifest. Next.js serves this at `/manifest.webmanifest` and injects
 * the right `<link rel="manifest">` tag in the root layout.
 *
 * Two icon surfaces, two sources:
 *
 *   1. Static PNGs under `public/icons/` — Lighthouse PWA installability
 *      + Chrome's add-to-home-screen dialog read these. Generated once by
 *      `scripts/generate-icons.mjs` (espresso bg, IH mark).
 *
 *   2. Dynamic Next 14 routes `src/app/icon.tsx` (browser tab favicon)
 *      and `src/app/apple-icon.tsx` (iOS pinned tab) — auto-served at
 *      /icon and /apple-icon. Use Satori's bundled font (no external
 *      load) so they render reliably on every Netlify runtime tier.
 *
 * The manifest below references only the static install icons; the
 * dynamic Next routes provide the browser favicon outside the manifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Inglés Hotelero",
    short_name: "Inglés Hotelero",
    description:
      "Evaluación y capacitación de inglés para equipos hoteleros en Latinoamérica.",
    lang: "es-MX",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F5F0E6",
    theme_color: "#2B1D14",
    categories: ["education", "business", "productivity"],
    icons: [
      // Real PNG icons — Lighthouse + Chromium installability.
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
