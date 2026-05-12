import "server-only";

/**
 * Structured JSON logging via pino.
 *
 * Single shared logger. Level controlled by LOG_LEVEL env (default 'info').
 * Output is JSON, one line per record, suitable for ingestion by Netlify /
 * Vercel log drains.
 *
 * Usage:
 *   import { log } from "@/lib/server/log";
 *   log.info({ route: "POST /api/exams", session_id }, "exam.created");
 */
import pino from "pino";

const level = process.env.LOG_LEVEL ?? "info";

export const log = pino({
  level,
  base: { service: "ingles-hotelero" },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Avoid leaking PII / audio bodies into logs by default. Caller-supplied
  // objects should already be sanitized.
  redact: {
    paths: [
      "transcript",
      "audio",
      "audio_data_url",
      "*.transcript",
      "*.audio",
      "*.audio_data_url",
      "employee.email",
      "employee.phone",
      "employee.name",
    ],
    censor: "[REDACTED]",
  },
});

export type Log = typeof log;
