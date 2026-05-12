/**
 * Zero-dep CSV serializer for /masteros exports.
 *
 * RFC 4180-ish escaping:
 *   - quote every field
 *   - double any embedded quote
 *   - CRLF line endings (Excel-friendly)
 *   - BOM prefix so Excel recognizes UTF-8
 *
 * `null`/`undefined` become "". Dates/objects are JSON-stringified before
 * escaping so a notes field with newlines round-trips intact.
 */

export interface CsvColumn<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => unknown;
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let s: string;
  if (value instanceof Date) {
    s = value.toISOString();
  } else if (typeof value === "object") {
    s = JSON.stringify(value);
  } else {
    s = String(value);
  }
  // Strip control characters except \t, \n, \r — they're rare in our data
  // but break Excel.
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const v = c.accessor
          ? c.accessor(row)
          : (row as Record<string, unknown>)[c.key as string];
        return escapeCell(v);
      })
      .join(","),
  );
  // BOM + CRLF — Excel-friendly UTF-8.
  return "﻿" + [header, ...lines].join("\r\n") + "\r\n";
}
