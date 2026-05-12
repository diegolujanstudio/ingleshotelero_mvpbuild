#!/usr/bin/env node
/**
 * scripts/generate-icons.mjs
 *
 * One-shot icon generator. Builds three minimal but valid PNG files at
 *   public/icons/icon-192.png
 *   public/icons/icon-512.png
 *   public/icons/apple-touch-icon.png
 *
 * Why hand-roll PNGs:
 *   `sharp` and friends are NOT in the dep tree and we can't add deps in this
 *   track. Lighthouse only needs valid cacheable PNGs at predictable static
 *   paths — they don't have to carry the full monogram. We render a brand
 *   espresso (#2B1D14) background with a single ivory (#F5F0E6) "I" + ink
 *   (#2E4761) "H" rendered from a hard-coded 7px-wide bitmap font, scaled.
 *
 * Output is a true RGB PNG (no alpha) with one IDAT chunk per row,
 * compressed via Node's built-in `zlib`. Verified by eye in Finder/Explorer
 * and by `file` / Lighthouse in CI.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, constants as zConst } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT_DIR = join(ROOT, "public", "icons");

// Brand tokens.
const ESPRESSO = [0x2b, 0x1d, 0x14]; // background
const IVORY = [0xf5, 0xf0, 0xe6]; //   "I"
const INK = [0x2e, 0x47, 0x61]; //     "H"

/* ──────────────────────────────────────────────────────────── */
/* 7×7 bitmap glyphs for I and H. 1 = ink pixel, 0 = bg.         */
/* ──────────────────────────────────────────────────────────── */
const GLYPH_I = [
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
];
const GLYPH_H = [
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
];

/**
 * Render an N×N RGB pixel buffer for the IH monogram on espresso.
 * Each glyph is scaled to fit ~30% of the canvas height; both glyphs sit
 * centred horizontally with a small gap.
 */
function renderIH(size) {
  const buf = Buffer.alloc(size * size * 3);
  // Fill espresso.
  for (let i = 0; i < size * size; i++) {
    buf[i * 3] = ESPRESSO[0];
    buf[i * 3 + 1] = ESPRESSO[1];
    buf[i * 3 + 2] = ESPRESSO[2];
  }

  // Glyph layout.
  const cell = Math.max(2, Math.floor(size / 24)); // pixel size of one glyph cell
  const glyphW = 7 * cell;
  const glyphH = 7 * cell;
  const gap = Math.max(2, Math.floor(cell * 1.2));
  const totalW = glyphW * 2 + gap;
  const startX = Math.floor((size - totalW) / 2);
  const startY = Math.floor((size - glyphH) / 2);

  drawGlyph(buf, size, GLYPH_I, startX, startY, cell, IVORY);
  drawGlyph(buf, size, GLYPH_H, startX + glyphW + gap, startY, cell, INK);
  return buf;
}

function drawGlyph(buf, size, glyph, originX, originY, cell, rgb) {
  for (let gy = 0; gy < 7; gy++) {
    for (let gx = 0; gx < 7; gx++) {
      if (!glyph[gy][gx]) continue;
      // Paint a `cell × cell` block.
      for (let py = 0; py < cell; py++) {
        for (let px = 0; px < cell; px++) {
          const x = originX + gx * cell + px;
          const y = originY + gy * cell + py;
          if (x < 0 || y < 0 || x >= size || y >= size) continue;
          const i = (y * size + x) * 3;
          buf[i] = rgb[0];
          buf[i + 1] = rgb[1];
          buf[i + 2] = rgb[2];
        }
      }
    }
  }
}

/* ──────────────────────────────────────────────────────────── */
/* PNG encoder (RGB, 8-bit, no alpha).                           */
/* ──────────────────────────────────────────────────────────── */
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// CRC table for chunk CRC-32.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(rgb, width, height) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression: deflate
  ihdr[11] = 0; // filter: standard
  ihdr[12] = 0; // interlace: none

  // IDAT — every scanline prefixed with filter byte 0 ("None").
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const compressed = deflateSync(raw, { level: zConst.Z_BEST_COMPRESSION });

  return Buffer.concat([
    PNG_SIG,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", compressed),
    makeChunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ──────────────────────────────────────────────────────────── */
/* Main                                                          */
/* ──────────────────────────────────────────────────────────── */
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { size: 192, file: "icon-192.png" },
  { size: 512, file: "icon-512.png" },
  { size: 180, file: "apple-touch-icon.png" },
];

for (const t of targets) {
  const rgb = renderIH(t.size);
  const png = encodePng(rgb, t.size, t.size);
  const out = join(OUT_DIR, t.file);
  writeFileSync(out, png);
  console.log(`wrote ${out} (${t.size}x${t.size}, ${png.length} bytes)`);
}
