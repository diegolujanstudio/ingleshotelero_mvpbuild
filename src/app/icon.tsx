import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * PWA manifest icon — 512×512. Next.js serves this at `/icon`.
 * Also used as the high-res favicon source.
 *
 * Ivory background with a serif "IH" monogram: I in espresso, H in ink.
 * Generous margin so it reads cleanly inside a maskable safe zone.
 */
export const dynamic = "force-dynamic";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  // Load New Spirit Medium for the monogram. Falls back to system serif if
  // the file read fails (e.g., on a host where public/fonts isn't shipped).
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
          fontSize: 320,
          letterSpacing: "-0.04em",
          lineHeight: 1,
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
