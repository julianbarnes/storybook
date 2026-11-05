'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { RateLimiter, withRateLimit } = require('./rateLimiter');

const STATIC_DIR = path.resolve(__dirname, '..', 'dist', 'storyboard');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let filePath = path.join(STATIC_DIR, urlPath);
  // Block path traversal outside the static directory.
  if (filePath !== STATIC_DIR && !filePath.startsWith(STATIC_DIR + path.sep)) {
    return sendJson(res, 403, { error: 'Forbidden' });
  }

  fs.stat(filePath, (err, stats) => {
    // SPA fallback: unknown routes serve index.html so Angular's router handles them.
    if (err || stats.isDirectory()) filePath = path.join(STATIC_DIR, 'index.html');

    const stream = fs.createReadStream(filePath);
    stream.on('open', () => {
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream',
      });
      stream.pipe(res);
    });
    stream.on('error', () => {
      sendJson(res, 404, { error: 'Not Found. Run `npm run build` to build the Angular app.' });
    });
  });
}

function handler(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
  }
  if (pathname.startsWith('/api/')) {
    return sendJson(res, 404, { error: 'Not Found' });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }
  return serveStatic(req, res);
}

function createServer({
  limit = Number(process.env.RATE_LIMIT) || 100,
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
} = {}) {
  const limiter = new RateLimiter({ limit, windowMs });
  const stopPruning = limiter.startPruning();
  const server = http.createServer(withRateLimit(limiter, handler));
  server.on('close', stopPruning);
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

module.exports = { createServer };
