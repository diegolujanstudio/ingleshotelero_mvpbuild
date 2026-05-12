/**
 * src/content/legal.ts
 *
 * Versioned legal-document constants. Lives outside `src/app/` so the values
 * can be exported and imported freely — Next 14 forbids non-component named
 * exports from `page.tsx` files, which is why these moved out of the legal
 * pages. The version field is also tracked per-employee at consent time so
 * future edits to /aviso-de-privacidad or /terminos do not invalidate
 * previously-captured consents.
 */

export const PRIVACY_VERSION = "1.0";
export const PRIVACY_EFFECTIVE_DATE = "1 de mayo de 2026";

export const TERMS_VERSION = "1.0";
export const TERMS_EFFECTIVE_DATE = "1 de mayo de 2026";
