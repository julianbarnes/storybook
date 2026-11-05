'use strict';

/**
 * In-memory token-bucket rate limiter.
 *
 * Each client (keyed by IP by default) gets a bucket holding up to `limit`
 * tokens. A request consumes one token; tokens refill continuously so that a
 * full bucket is restored every `windowMs`. This allows short bursts up to
 * `limit` while enforcing an average rate of `limit / windowMs`.
 */
class RateLimiter {
  constructor({ limit = 100, windowMs = 60_000, now = Date.now } = {}) {
    if (!Number.isInteger(limit) || limit <= 0) throw new TypeError('limit must be a positive integer');
    if (!(windowMs > 0)) throw new TypeError('windowMs must be a positive number');
    this.limit = limit;
    this.windowMs = windowMs;
    this.refillPerMs = limit / windowMs;
    this.now = now;
    this.buckets = new Map();
  }

  /**
   * Try to consume a token for `key`.
   * @returns {{allowed: boolean, remaining: number, retryAfterMs: number, resetMs: number}}
   */
  consume(key) {
    const now = this.now();
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = { tokens: this.limit, updatedAt: now };
      this.buckets.set(key, bucket);
    } else {
      const elapsed = Math.max(0, now - bucket.updatedAt);
      bucket.tokens = Math.min(this.limit, bucket.tokens + elapsed * this.refillPerMs);
      bucket.updatedAt = now;
    }

    const allowed = bucket.tokens >= 1;
    if (allowed) bucket.tokens -= 1;

    return {
      allowed,
      remaining: Math.floor(bucket.tokens),
      retryAfterMs: allowed ? 0 : Math.ceil((1 - bucket.tokens) / this.refillPerMs),
      resetMs: Math.ceil((this.limit - bucket.tokens) / this.refillPerMs),
    };
  }

  /** Drop buckets that have fully refilled; they are equivalent to new ones. */
  prune() {
    const now = this.now();
    for (const [key, bucket] of this.buckets) {
      if (bucket.tokens + (now - bucket.updatedAt) * this.refillPerMs >= this.limit) {
        this.buckets.delete(key);
      }
    }
  }

  /** Periodically prune idle buckets so memory doesn't grow without bound. */
  startPruning(intervalMs = this.windowMs) {
    const timer = setInterval(() => this.prune(), intervalMs);
    timer.unref();
    return () => clearInterval(timer);
  }
}

/** Wrap a (req, res) handler so requests over the limit get a 429. */
function withRateLimit(limiter, handler, { keyFn = (req) => req.socket.remoteAddress || 'unknown' } = {}) {
  return (req, res) => {
    const result = limiter.consume(keyFn(req));
    res.setHeader('RateLimit-Limit', limiter.limit);
    res.setHeader('RateLimit-Remaining', result.remaining);
    res.setHeader('RateLimit-Reset', Math.ceil(result.resetMs / 1000));

    if (!result.allowed) {
      res.setHeader('Retry-After', Math.ceil(result.retryAfterMs / 1000));
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Too Many Requests' }));
      return;
    }
    return handler(req, res);
  };
}

module.exports = { RateLimiter, withRateLimit };
