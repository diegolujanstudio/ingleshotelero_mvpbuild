#!/usr/bin/env node
/**
 * scripts/generate-icons.mjs — the real brand icon, generated once.
 *
 * HISTORY: the first version of this script hand-rolled a 7x7 bitmap "IH"
 * because no image tooling was in the dep tree. Diego's verdict on the
 * result was accurate ("quite awful"), and the constraint no longer holds:
 * `next/og` ships satori + resvg-wasm, which render REAL letterforms from
 * the actual New Spirit OTF the wordmark uses. So the icon is now literally
 * the logo's own I and H — not an approximation of them.
 *
 * DESIGN (mirrors the wordmark exactly):
 *   - "IH" set in New Spirit Medium — I in espresso #2B1D14, H in ink
 *     #2E4761, the same espresso->ink relationship as "Ingles Hotelero".
 *   - White background: Diego's call, and the right one — launcher grids
 *     sit icons on wallpaper, and a white tile with a serif monogram reads
 *     "editorial brand", not "template app".
 *   - Maskable variant keeps the monogram inside the safe zone so Android's
 *     circle/squircle masks never clip a letter.
 *
 * Outputs (all static — installability never depends on a runtime route):
 *   public/icons/icon-192.png
 *   public/icons/icon-512.png
 *   public/icons/maskable-512.png
 *   public/icons/apple-touch-icon.png
 *   src/app/icon.png          (32 — favicon file convention)
 *   src/app/apple-icon.png    (180 — iOS home screen)
 *
 * Run: node scripts/generate-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

const font = readFileSync(join(ROOT, "public", "fonts", "NewSpirit-Medium.otf"));

const ESPRESSO = "#2B1D14";
const INK = "#2E4761";
const WHITE = "#FFFFFF";

/** The monogram tile. `maskable` shrinks content into the safe zone. */
function monogram(size, { maskable = false } = {}) {
  const fs = Math.round(size * (maskable ? 0.42 : 0.55));
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: WHITE,
        fontFamily: "NewSpirit",
        fontSize: fs,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      },
      children: [
        { type: "span", props: { style: { color: ESPRESSO }, children: "I" } },
        { type: "span", props: { style: { color: INK }, children: "H" } },
      ],
    },
  };
}

async function render(size, opts) {
  const { ImageResponse } = await import("next/og.js");
  const res = new ImageResponse(monogram(size, opts), {
    width: size,
    height: size,
    fonts: [{ name: "NewSpirit", data: font, weight: 500, style: "normal" }],
  });
  return Buffer.from(await res.arrayBuffer());
}

const OUT = join(ROOT, "public", "icons");
mkdirSync(OUT, { recursive: true });

const jobs = [
  [join(OUT, "icon-192.png"), 192, {}],
  [join(OUT, "icon-512.png"), 512, {}],
  [join(OUT, "maskable-512.png"), 512, { maskable: true }],
  [join(OUT, "apple-touch-icon.png"), 180, {}],
  [join(ROOT, "src", "app", "icon.png"), 32, {}],
  [join(ROOT, "src", "app", "apple-icon.png"), 180, {}],
];

for (const [path, size, opts] of jobs) {
  const png = await render(size, opts);
  writeFileSync(path, png);
  console.log(`wrote ${path} (${size}x${size}, ${png.length} bytes)`);
}
console.log("done — real New Spirit letterforms, white tile.");
