import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.ttf': 'font/ttf', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.apk': 'application/vnd.android.package-archive' };
export function createPreviewServer() {
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/_vercel/insights/script.js') { response.writeHead(200, { 'Content-Type': 'text/javascript' }); response.end('/* Analytics disabled on local preview. */'); return; }
      const retired = pathname === '/zakat-calculator' || pathname.startsWith('/zakat-calculator/');
      let file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root.endsWith(sep) ? root : root + sep) || /(^|\/)\./.test(pathname)) throw new Error('Invalid path');
      let found = false;
      if (!retired) {
        for (const candidate of [file, file + '.html', resolve(file, 'index.html')]) {
          try { if ((await stat(candidate)).isFile()) { file = candidate; found = true; break; } } catch { /* Try clean URL. */ }
        }
      }
      if (!found) file = resolve(root, '404.html');
      response.writeHead(found ? 200 : 404, { 'Content-Type': types[extname(file)] || 'application/octet-stream', ...(!found ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}) });
      response.end(await readFile(file));
    } catch { response.writeHead(404); response.end('Not found'); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createPreviewServer();
  server.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => console.log('BarakahFlow website: http://127.0.0.1:' + server.address().port));
}
