import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Apple touch icon — 180×180. Rendered with extra padding because iOS does
 * NOT apply the usual rounded-corner mask (as of iOS 17); the icon appears
 * on the home screen exactly as-is. We give it an ivory card with an inset
 * border for polish.
 */
export const dynamic = "force-dynamic";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  let newSpirit: Buffer | null = null;
  try {
    newSpirit = await readFile(
      join(process.cwd(), "public/fonts/NewSpirit-Medium.otf"),
    );
  } catch {
    newSpirit = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F0E6",
          fontFamily: '"New Spirit", Georgia, serif',
          fontWeight: 500,
          fontSize: 112,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          // Subtle inset outline — reads like a bookplate, matches the
          // hairline motif of the design system.
          boxShadow: "inset 0 0 0 1px rgba(43, 29, 20, 0.14)",
        }}
      >
        <span style={{ color: "#2B1D14" }}>I</span>
        <span style={{ color: "#2E4761" }}>H</span>
      </div>
    ),
    {
      ...size,
      fonts: newSpirit
        ? [
            {
              name: "New Spirit",
              data: newSpirit,
              weight: 500,
              style: "normal",
            },
          ]
        : [],
    },
  );
}
