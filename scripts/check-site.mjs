import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPreviewServer, root } from './preview.mjs';

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const summary = await readFile(resolve(root, 'llms.txt'), 'utf8');
assert(!/zakat|nisab|hawl/i.test(html + sitemap + summary), 'Retired calculator promotion is still public');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Expected one page heading');
assert(html.includes('rel="canonical" href="https://barakahflowapp.com/"'));
assert(!html.includes('SearchAction'), 'There is no website search to advertise');
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const faq = schema['@graph'].find(item => item['@type'] === 'FAQPage');
for (const question of faq.mainEntity) {
  assert(html.includes(question.name), 'Schema question missing from visible FAQ');
  const plainAnswer = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  assert(plainAnswer.includes(question.acceptedAnswer.text), 'Schema answer differs from visible FAQ');
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (url.startsWith('#')) { assert(ids.includes(url.slice(1)), 'Broken anchor: ' + url); continue; }
  if (!url.startsWith('/') || url.startsWith('/_vercel/')) continue;
  let file = resolve(root, '.' + url.split('?')[0]);
  if (url === '/') file = resolve(root, 'index.html');
  if (url === '/delete-account') file = resolve(root, 'delete-account.html');
  assert((await stat(file)).isFile(), 'Missing public asset: ' + url);
}
for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\bwidth="\d+"/.test(image[0]) && /\bheight="\d+"/.test(image[0]), 'Image dimensions missing');
for (const route of ['privacy-policy.html', 'terms.html']) {
  const document = await readFile(resolve(root, route), 'utf8');
  assert.equal((document.match(/<h1\b/g) || []).length, 1, route + ': expected one heading');
  assert(document.includes('rel="canonical" href="https://barakahflowapp.com/' + route + '"'), route + ': canonical missing');
  const legalIds = [...document.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(legalIds.length, new Set(legalIds).size, route + ': duplicate IDs');
  for (const match of document.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (url.startsWith('#')) { assert(legalIds.includes(url.slice(1)), route + ': broken anchor'); continue; }
    if (!url.startsWith('/')) continue;
    const pathname = url.split('?')[0];
    const file = pathname === '/' ? 'index.html' : pathname === '/delete-account' ? 'delete-account.html' : pathname.slice(1);
    assert((await stat(resolve(root, file))).isFile(), route + ': missing asset/link ' + url);
  }
}
const calculators = await readdir(resolve(root, 'zakat-calculator')).catch(() => []);
assert(!calculators.some(file => file.endsWith('.html')), 'A retired calculator can still be served');
const server = createPreviewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  const origin = 'http://127.0.0.1:' + server.address().port;
  for (const route of ['/', '/privacy-policy.html', '/terms.html', '/delete-account', '/manifest.json']) assert.equal((await fetch(origin + route)).status, 200, route);
  for (const slug of ['aaoifi', 'gulf', 'hanafi', 'hanbali', 'malaysia-indonesia', 'maliki', 'north-america-australia', 'shafii', 'singapore', 'south-asia', 'uk-europe']) {
    for (const suffix of ['', '.html', '/']) {
      const response = await fetch(origin + '/zakat-calculator/' + slug + suffix);
      assert.equal(response.status, 404); assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    }
  }
  assert.equal((await fetch(origin + '/does-not-exist')).status, 404);
} finally { await new Promise(resolve => server.close(resolve)); }
console.log('PASS: local assets, anchors, SEO/schema/FAQ parity, legal routes, and all 33 retired calculator URLs.');
