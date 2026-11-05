'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { RateLimiter } = require('./rateLimiter');
const { createServer } = require('./server');

test('allows up to the limit, then blocks', () => {
  let t = 0;
  const limiter = new RateLimiter({ limit: 3, windowMs: 3000, now: () => t });
  assert.ok(limiter.consume('a').allowed);
  assert.ok(limiter.consume('a').allowed);
  assert.ok(limiter.consume('a').allowed);
  const blocked = limiter.consume('a');
  assert.strictEqual(blocked.allowed, false);
  assert.strictEqual(blocked.retryAfterMs, 1000);
});

test('tracks clients independently', () => {
  const limiter = new RateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
  assert.ok(limiter.consume('a').allowed);
  assert.ok(limiter.consume('b').allowed);
  assert.strictEqual(limiter.consume('a').allowed, false);
});

test('refills tokens over time', () => {
  let t = 0;
  const limiter = new RateLimiter({ limit: 2, windowMs: 2000, now: () => t });
  limiter.consume('a');
  limiter.consume('a');
  assert.strictEqual(limiter.consume('a').allowed, false);
  t = 1000; // one token refilled
  assert.ok(limiter.consume('a').allowed);
  assert.strictEqual(limiter.consume('a').allowed, false);
});

test('prune removes fully refilled buckets', () => {
  let t = 0;
  const limiter = new RateLimiter({ limit: 2, windowMs: 1000, now: () => t });
  limiter.consume('a');
  t = 1000;
  limiter.prune();
  assert.strictEqual(limiter.buckets.size, 0);
});

test('server returns 429 with headers once limit is exceeded', async () => {
  const server = createServer({ limit: 2, windowMs: 60_000 });
  await new Promise((resolve) => server.listen(0, resolve));
  const url = `http://localhost:${server.address().port}/api/health`;
  try {
    const statuses = [];
    for (let i = 0; i < 3; i++) {
      const res = await fetch(url);
      statuses.push(res.status);
      if (res.status === 429) {
        assert.strictEqual(res.headers.get('retry-after'), '30');
        assert.strictEqual(res.headers.get('ratelimit-remaining'), '0');
      }
      await res.text();
    }
    assert.deepStrictEqual(statuses, [200, 200, 429]);
  } finally {
    server.close();
  }
});
