import type { MetadataRoute } from "next";

/**
 * PWA manifest. Next.js serves this at `/manifest.webmanifest` automatically
 * and injects the right <link rel="manifest"> tag in the root layout.
 *
 * Icons are generated dynamically by `src/app/icon.tsx` and
 * `src/app/apple-icon.tsx` — no PNG files to maintain.
 *
 * When a real logo is ready, the recommended path is:
 *   1. Drop the SVG source in `public/brand/logo.svg`
 *   2. Use https://realfavicongenerator.net to produce a full icon bundle
 *      (192, 512, maskable, apple-touch, Safari pinned tab)
 *   3. Replace the code-generated icons with the PNGs and update this file.
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
      // Next.js auto-injects /icon and /apple-icon based on the tsx generators.
      // Declaring them here makes them explicit to the manifest.
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
