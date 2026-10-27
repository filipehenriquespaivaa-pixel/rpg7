import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.md': 'text/markdown; charset=UTF-8',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const ASSET_EXTENSIONS = new Set(Object.keys(MIME_TYPES).filter((ext) => ext !== '.html'));

let cachedBundleBuf = null;
let cachedBundleTime = 0;

function buildCombinedBundle(indexHtml) {
  const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/gi;
  const parts = ['"use strict";'];
  let match;
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    const rawSrc = match[1].split('?')[0].replace(/^\.\//, '').replace(/^\//, '');
    const fullPath = path.normalize(path.join(__dirname, rawSrc));
    if (fullPath.startsWith(__dirname) && fs.existsSync(fullPath)) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      parts.push(`/* === ${rawSrc} === */\n${code}`);
    }
  }
  return parts.join('\n;\n');
}

function getAppBundle() {
  const indexPath = path.join(__dirname, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  let maxMtime = fs.statSync(indexPath).mtimeMs;
  const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    const rawSrc = match[1].split('?')[0].replace(/^\.\//, '').replace(/^\//, '');
    const fullPath = path.normalize(path.join(__dirname, rawSrc));
    if (fullPath.startsWith(__dirname) && fs.existsSync(fullPath)) {
      try {
        const s = fs.statSync(fullPath);
        if (s.mtimeMs > maxMtime) maxMtime = s.mtimeMs;
      } catch (_) {}
    }
  }
  if (cachedBundleBuf && maxMtime <= cachedBundleTime) {
    return cachedBundleBuf;
  }
  const bundle = buildCombinedBundle(indexHtml);
  cachedBundleBuf = Buffer.from(bundle, 'utf-8');
  cachedBundleTime = maxMtime;
  return cachedBundleBuf;
}

function renderServerIndexHtml(indexHtml) {
  let html = indexHtml;
  // Inline local stylesheet to avoid extra sub-request
  html = html.replace(
    /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi,
    (fullMatch, href) => {
      const cleanHref = href.split('?')[0].replace(/^\.\//, '').replace(/^\//, '');
      const cssPath = path.normalize(path.join(__dirname, cleanHref));
      if (cssPath.startsWith(__dirname) && fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        return `<style>\n${cssContent}\n</style>`;
      }
      return fullMatch;
    }
  );

  // Replace all deferred local scripts with a single deferred bundle request
  let replacedFirst = false;
  const version = Date.now();
  html = html.replace(
    /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/gi,
    () => {
      if (!replacedFirst) {
        replacedFirst = true;
        return `<script defer src="./__app_bundle.js?v=${version}"></script>`;
      }
      return '';
    }
  );
  return html;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/__app_bundle.js') {
    try {
      const buf = getAppBundle();
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=UTF-8',
        'Content-Length': buf.length,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      });
      res.end(buf);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Bundle Error');
    }
    return;
  }

  // Security: prevent directory traversal
  const safePath = path.normalize(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    let filePathToServe = safePath;

    if (!err && stats.isDirectory()) {
      filePathToServe = path.join(safePath, 'index.html');
    }

    fs.stat(filePathToServe, (statErr, finalStats) => {
      const reqExt = path.extname(filePathToServe).toLowerCase();

      // If file doesn't exist, only fallback to index.html for navigation routes (never for .js/.css/assets)
      if (statErr || !finalStats.isFile()) {
        if (ASSET_EXTENSIONS.has(reqExt)) {
          res.writeHead(404, {
            'Content-Type': 'text/plain; charset=UTF-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          });
          res.end('Not Found');
          return;
        }
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, 'utf-8', (readErr, content) => {
          if (readErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
          }
          const rendered = renderServerIndexHtml(content);
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          });
          res.end(rendered);
        });
        return;
      }

      if (path.basename(filePathToServe) === 'index.html') {
        fs.readFile(filePathToServe, 'utf-8', (readErr, content) => {
          if (readErr) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
            return;
          }
          const rendered = renderServerIndexHtml(content);
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          });
          res.end(rendered);
        });
        return;
      }

      const ext = path.extname(filePathToServe).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': finalStats.size,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      });

      const stream = fs.createReadStream(filePathToServe);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
        }
        res.end('Server Error');
      });
      stream.pipe(res);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
