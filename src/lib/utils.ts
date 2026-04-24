import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with Tailwind conflict resolution.
 * Used by every component that accepts `className`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Lower-case, hyphenated slug. Used for property slugs (`gran-hotel-cancun`)
 * and for file-safe keys when storing generated content.
 * Normalizes Spanish diacritics so "Gran Hotel Cancún" → "gran-hotel-cancun".
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Two-digit numeric prefix used throughout the editorial UI:
 *   formatIndex(3) → "03"
 */
export function formatIndex(n: number): string {
  return String(n).padStart(2, "0");
}
