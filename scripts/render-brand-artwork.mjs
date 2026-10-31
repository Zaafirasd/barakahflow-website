// Development-only export. Reuse the app checkout's installed Chrome/Playwright
// and Sharp; the website itself remains buildless and dependency-free.
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { createPreviewServer, root } from './preview.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
  const runtime = process.env.PLAYWRIGHT_RUNTIME_PACKAGE || join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
  ({ chromium } = createRequire(runtime)('playwright'));
}
const server = createPreviewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await page.goto(origin);
  await page.setContent(`<!doctype html><html lang="en" data-theme="dark"><head><link rel="stylesheet" href="${origin}/assets/website.css"><style>
    body{width:1200px;height:630px;overflow:hidden;background:#0b1120}
    .social-art{display:grid;grid-template-columns:520px 1fr;align-items:center;gap:40px;width:100%;height:100%;padding:64px 72px}
    .social-copy .brand{font-size:24px;letter-spacing:-.04em;gap:10px}
    .social-copy h1{font-size:62px;line-height:1.06;letter-spacing:-.055em;margin-top:40px}
    .social-copy h1 span{color:#6ee7b7}.social-copy p{font-size:16px;margin-top:28px}
    .social-cards{position:relative;height:460px;isolation:isolate}
    .social-cards:before{content:'';position:absolute;inset:0 -24px;background:radial-gradient(ellipse closest-side,#0d69522b,transparent);z-index:-1}
    .social-cards img{position:absolute;border:1px solid #ffffff24;border-radius:14px}
    .social-back{width:426px;top:24px;left:28px;transform:rotate(10deg);box-shadow:0 20px 38px -18px #0009}
    .social-front{width:456px;top:165px;left:-8px;transform:rotate(-8deg);box-shadow:0 35px 60px -20px #000a}
    </style></head><body><main class="social-art"><div class="social-copy"><div class="brand"><img src="${origin}/Images/monogram.png" width="36" height="36" alt=""><span>Barakah<span class="brand-flow">Flow</span></span></div><h1>Mindful money.<br>Everyday<br><span>barakah.</span></h1><p>Spending. Plans. Your next small step.</p></div><div class="social-cards"><img class="social-back" src="${origin}/assets/cards/midnight-gold-hero.webp" alt="Midnight Gold Barakah Card"><img class="social-front" src="${origin}/assets/cards/emerald-hero.webp" alt="Emerald Barakah Card"></div></main></body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, image => image.decode())); });
  const rendered = await page.screenshot({ type: 'png' });
  await sharp(rendered).resize(1200, 630).jpeg({ quality: 92, mozjpeg: true }).toFile(join(root, 'assets/social-preview.jpg'));
  console.log('Exported refined 1200×630 brand artwork from 2× native rendering.');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
