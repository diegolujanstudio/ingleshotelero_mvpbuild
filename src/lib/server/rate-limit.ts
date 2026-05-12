import "server-only";

/**
 * Best-effort rate limiting via Upstash Redis.
 *
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are missing, every
 * call returns `{ ok: true }` and we log a warning ONCE per process.
 *
 * Limits:
 *   - exams           = 10/min/IP
 *   - recordings      = 20/min/IP
 *   - score-speaking  = 60/min/IP
 *
 * Add new buckets as needed.
 */
import { log } from "./log";

type Bucket = "exams" | "recordings" | "score-speaking";

interface LimitConfig {
  requests: number;
  windowSeconds: number;
}

const LIMITS: Record<Bucket, LimitConfig> = {
  exams: { requests: 10, windowSeconds: 60 },
  recordings: { requests: 20, windowSeconds: 60 },
  "score-speaking": { requests: 60, windowSeconds: 60 },
};

let warned = false;
let limiterCache: Map<Bucket, unknown> | null = null;

function getLimiter(bucket: Bucket): unknown | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      log.warn(
        { bucket },
        "rate-limit.disabled — UPSTASH_REDIS_REST_URL / TOKEN missing",
      );
      warned = true;
    }
    return null;
  }
  if (!limiterCache) limiterCache = new Map();
  const cached = limiterCache.get(bucket);
  if (cached) return cached;

  try {
    const { Ratelimit } = require("@upstash/ratelimit") as typeof import("@upstash/ratelimit");
    const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");
    const cfg = LIMITS[bucket];
    const redis = new Redis({ url, token });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(cfg.requests, `${cfg.windowSeconds} s`),
      analytics: false,
      prefix: `ih.rl.${bucket}`,
    });
    limiterCache.set(bucket, limiter);
    return limiter;
  } catch (err) {
    log.warn({ err: String(err), bucket }, "rate-limit.init.failed");
    return null;
  }
}

export function getClientIp(req: Request): string {
  const fwd =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

export async function checkRateLimit(
  bucket: Bucket,
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter(bucket) as
    | { limit: (id: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }> }
    | null;
  if (!limiter) return { ok: true };
  try {
    const r = await limiter.limit(identifier);
    return {
      ok: r.success,
      limit: r.limit,
      remaining: r.remaining,
      reset: r.reset,
    };
  } catch (err) {
    // Fail open — never block users because Redis is degraded.
    log.warn({ err: String(err), bucket }, "rate-limit.check.failed");
    return { ok: true };
  }
}
