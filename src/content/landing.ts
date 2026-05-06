/**
 * Landing exports — RESIDUAL ONLY.
 *
 * The editorial marketing surface moved to the separate Astro site at
 * ingleshotelero.com. The product app's `/` is now a sign-in door
 * (see src/app/page.tsx + src/content/auth.ts).
 *
 * What survives here is the small set of constants that the pitch deck
 * (src/content/pitch.ts) still imports. Anything else previously exported
 * from this file (HERO, SITUATION, FAILURES, MODEL, PILLARS, LOOP, MODULES,
 * FAQ, PILOT, FINAL_CTA, NAV) was removed when the marketing home was
 * stripped. If you need that copy back, pull it from the marketing repo
 * — do not reintroduce it here.
 */

// Primary CTA target for "Pedir piloto". Points to the lead-capture form
// at /contacto; the form posts to /api/contacto which stores leads in
// Supabase + emails the founder via Resend (with graceful fallback).
//
// The constant name preserves the original import contract — treat it as
// "primary pilot CTA href" rather than literally a mailto.
export const PILOT_MAILTO = "/contacto";

// Backup direct mailto for the pitch deck FAQ + footer, when a viewer
// prefers to reach the founder by email instead of the lead form.
export const PILOT_MAILTO_DIRECT =
  "mailto:hola@ingleshotelero.com?subject=Piloto%20gratis%20para%20mi%20hotel&body=Hola%20Diego%2C%0A%0AMe%20interesa%20un%20piloto%20gratis%20para%20un%20departamento.%0A%0ANombre%3A%20%0AHotel%3A%20%0ACiudad%3A%20%0ADepartamento%20que%20me%20interesa%20evaluar%20(recepci%C3%B3n%20%2F%20botones%20%2F%20restaurante)%3A%20%0AN%C3%BAmero%20aproximado%20de%20empleados%3A%20%0A%0AGracias.";
