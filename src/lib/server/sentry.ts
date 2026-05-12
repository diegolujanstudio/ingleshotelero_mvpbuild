import "server-only";

/**
 * Sentry init guard.
 *
 * Sentry is optional. When SENTRY_DSN is not set, every helper here is a
 * no-op so dev / demo deployments don't pay the import cost.
 *
 * NEVER attach raw audio bytes, full transcripts, employee names, emails, or
 * phone numbers to a breadcrumb. Sanitize the payload at the call site.
 */
import { log } from "./log";

type Breadcrumb = {
  route: string;
  data?: Record<string, unknown>;
  level?: "info" | "warning" | "error";
};

let sentry: typeof import("@sentry/nextjs") | null = null;
let initAttempted = false;

function ensure() {
  if (initAttempted) return sentry;
  initAttempted = true;
  if (!process.env.SENTRY_DSN) return null;
  try {
    // Dynamic import keeps Sentry out of the bundle when DSN is missing.
    const Sentry = require("@sentry/nextjs") as typeof import("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      // Strip incoming-request bodies — they may contain audio or PII.
      maxValueLength: 1000,
    });
    sentry = Sentry;
    return sentry;
  } catch (err) {
    log.warn({ err: String(err) }, "sentry.init.failed");
    return null;
  }
}

export function captureException(err: unknown, crumb: Breadcrumb): void {
  const Sentry = ensure();
  if (!Sentry) {
    log.error({ err: String(err), ...crumb }, `${crumb.route}.error`);
    return;
  }
  try {
    Sentry.addBreadcrumb({
      category: "api",
      level: crumb.level ?? "error",
      message: crumb.route,
      data: crumb.data,
    });
    Sentry.captureException(err);
  } catch (e) {
    log.warn({ err: String(e) }, "sentry.capture.failed");
  }
}

export function addBreadcrumb(crumb: Breadcrumb): void {
  const Sentry = ensure();
  if (!Sentry) return;
  try {
    Sentry.addBreadcrumb({
      category: "api",
      level: crumb.level ?? "info",
      message: crumb.route,
      data: crumb.data,
    });
  } catch {
    // swallow
  }
}
