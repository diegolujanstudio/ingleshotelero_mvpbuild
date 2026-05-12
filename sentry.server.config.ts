/**
 * Sentry Node-runtime init.
 *
 * Loaded automatically by `@sentry/nextjs` when SENTRY_DSN is set. We strip
 * known PII (transcripts, names, emails, phones) in `beforeSend` so even
 * misconfigured logs from elsewhere can't leak it.
 */
import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    maxValueLength: 1000,
    beforeSend(event) {
      const data = event.request?.data;
      if (data && typeof data === "object" && data !== null) {
        const obj = data as Record<string, unknown>;
        for (const k of ["transcript", "name", "email", "phone", "audio", "audio_data_url", "password"]) {
          if (k in obj) delete obj[k];
        }
      }
      return event;
    },
  });
}
