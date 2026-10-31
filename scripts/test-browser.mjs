import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createPreviewServer, root } from './preview.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
  const runtime = process.env.PLAYWRIGHT_RUNTIME_PACKAGE || join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
  ({ chromium } = createRequire(runtime)('playwright'));
}
const axePath = require.resolve('axe-core/axe.min.js');
const output = process.env.WEBSITE_EVIDENCE_DIR || resolve(root, '../output/website-refresh');
await mkdir(output, { recursive: true });
const server = createPreviewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const errors = [];
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = 'eager';
  });
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
}
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['dark', 'light']) {
      await page.goto(origin);
      const current = await page.locator('html').getAttribute('data-theme');
      if (current !== theme) await page.locator('[data-theme-toggle]').click();
      await page.waitForFunction(() => document.querySelector('#edition-art').src.endsWith('essential-' + document.documentElement.dataset.theme + '.webp'));
      await settle(page);
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      if (dimensions.document > width) {
        const overflowing = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(element => { const rect = element.getBoundingClientRect(); return rect.width && (rect.right > innerWidth + 1 || rect.left < -1); }).map(element => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width, x: element.getBoundingClientRect().x })));
        assert.fail('Horizontal overflow: ' + width + '/' + theme + ' ' + JSON.stringify(overflowing));
      }
      for (const selector of ['h1', '.hero-actions', '.card-explorer', '.edition-picker', '.feature-tabs', '.download-actions']) {
        const rect = await page.locator(selector).boundingBox();
        assert(rect.x >= -1 && rect.x + rect.width <= width + 1, 'Clipped ' + selector + ' at ' + width);
      }
      await page.addScriptTag({ path: axePath });
      const accessibility = await page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
        return result.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
      });
      assert.deepEqual(accessibility, [], 'Accessibility ' + width + '/' + theme + ': ' + JSON.stringify(accessibility));
      await page.locator('.download-card').scrollIntoViewIfNeeded();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      await page.screenshot({ path: resolve(output, width + '-' + theme + '.png'), fullPage: true });
      results.push({ width, theme, overflow: false, axeViolations: accessibility.length });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page.getByRole('button', { name: 'Emerald', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#edition-art').src.endsWith('/emerald.webp'));
  await page.getByRole('button', { name: 'Pearl Platinum', exact: true }).click();
  await page.getByRole('button', { name: 'Midnight Gold', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#edition-art').src.endsWith('/midnight-gold.webp'));
  assert.equal(await page.locator('#edition-name').textContent(), 'Midnight Gold');
  assert.match(await page.locator('#edition-requirement').textContent(), /three accepted weekly/);
  assert.equal(await page.locator('[data-edition][aria-pressed="true"]').count(), 1);
  await page.getByRole('button', { name: 'Pearl Platinum', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#edition-art').src.endsWith('/pearl-platinum.webp'));
  assert.match(await page.locator('#edition-requirement').textContent(), /eight accepted weekly.*two complete/);
  await page.getByRole('button', { name: 'Essential', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('#edition-name').textContent === 'Essential');
  await page.locator('[data-theme-toggle]').click();
  await page.reload();
  await settle(page);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.match(await page.locator('#edition-art').getAttribute('src'), /essential-dark/);

  const track = page.getByRole('tab', { name: 'Track', exact: true });
  await track.focus(); await page.keyboard.press('ArrowRight');
  await page.getByRole('tabpanel', { name: 'Plan', exact: true }).waitFor();
  assert.equal(await page.locator('[data-preview="plan"]').isVisible(), true);
  await page.keyboard.press('End');
  await page.getByRole('tabpanel', { name: 'Save', exact: true }).waitFor();
  await page.keyboard.press('Home');
  await page.getByRole('tabpanel', { name: 'Track', exact: true }).waitFor();
  await page.locator('summary').filter({ hasText: 'Is a Barakah Card a payment card?' }).click();
  assert.equal(await page.locator('details[open]').count(), 1);
  assert.equal(await page.locator('a[data-track="apk"]').getAttribute('href'), '/downloads/barakahflow.apk');
  assert.equal(await page.locator('a[data-track="launch"]').evaluateAll(links => links.every(link => link.href === 'https://app.barakahflowapp.com/')), true);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0, 'Motion still running under reduced motion');

  await page.setViewportSize({ width: 720, height: 900 });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const zoomOverflow = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(element => { const rect = element.getBoundingClientRect(); return rect.width && (rect.right > innerWidth + 1 || rect.left < -1); }).map(element => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width, x: element.getBoundingClientRect().x })));
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Overflow at 200% text size ' + JSON.stringify(zoomOverflow));

  const blocked = await browser.newContext({ reducedMotion: 'reduce' });
  await blocked.addInitScript(() => { Object.defineProperty(Storage.prototype, 'getItem', { value() { throw new Error('Storage blocked'); } }); Object.defineProperty(Storage.prototype, 'setItem', { value() { throw new Error('Storage blocked'); } }); });
  const blockedPage = await blocked.newPage();
  blockedPage.on('pageerror', error => errors.push(error.message));
  await blockedPage.goto(origin);
  await blockedPage.locator('[data-theme-toggle]').click();
  assert.equal(await blockedPage.locator('html').getAttribute('data-theme'), 'light');
  await blocked.close();

  const failureContext = await browser.newContext({ reducedMotion: 'reduce' });
  const failurePage = await failureContext.newPage();
  await failurePage.route('**/assets/cards/pearl-platinum.webp', route => route.abort());
  await failurePage.goto(origin);
  await failurePage.getByRole('button', { name: 'Pearl Platinum', exact: true }).click();
  await failurePage.waitForFunction(() => document.querySelector('#edition-art').hidden);
  assert.match(await failurePage.locator('.art-caption').textContent(), /could not load/);
  await failurePage.unroute('**/assets/cards/pearl-platinum.webp');
  await failurePage.getByRole('button', { name: 'Pearl Platinum', exact: true }).click();
  await failurePage.waitForFunction(() => !document.querySelector('#edition-art').hidden && document.querySelector('#edition-art').src.endsWith('pearl-platinum.webp'));
  await failureContext.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const noJSPage = await noJS.newPage(); await noJSPage.goto(origin);
  assert.equal(await noJSPage.locator('h1').isVisible(), true);
  assert.equal(await noJSPage.locator('.hero-actions a[data-track="launch"]').isVisible(), true);
  await noJS.close();

  const motionContext = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 1000 } });
  const motionPage = await motionContext.newPage(); await motionPage.goto(origin); await settle(motionPage);
  await motionPage.waitForFunction(() => !document.getAnimations().some(animation => animation.playState === 'running' && animation.effect?.getTiming().duration !== 'auto'));
  await motionPage.locator('#cards').scrollIntoViewIfNeeded();
  await motionPage.getByRole('button', { name: 'Emerald', exact: true }).click();
  await motionPage.getByRole('button', { name: 'Midnight Gold', exact: true }).click();
  await motionPage.getByRole('button', { name: 'Pearl Platinum', exact: true }).click();
  await motionPage.waitForFunction(() => document.querySelector('#edition-art').src.endsWith('/pearl-platinum.webp'));
  await motionPage.screenshot({ path: resolve(output, 'cards-motion.png') });
  assert.match(await motionPage.locator('.download-card').getAttribute('src'), /pearl-platinum\.webp$/);
  const tilt = motionPage.locator('[data-card-tilt]');
  await tilt.scrollIntoViewIfNeeded();
  await motionPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await tilt.hover({ position: { x: 200, y: 100 } });
  await motionPage.waitForFunction(() => document.querySelector('[data-card-tilt]').style.transform.includes('rotateY'));
  await motionPage.locator('.download-panel').screenshot({ path: resolve(output, 'pearl-desktop-tilt.png') });
  await motionPage.mouse.move(1, 1);
  await motionPage.waitForFunction(() => !document.querySelector('[data-card-tilt]').style.transform);
  await tilt.dispatchEvent('pointermove', { pointerType: 'touch', clientX: 200, clientY: 100 });
  assert.equal(await tilt.evaluate(element => element.style.transform), '', 'Touch scroll must not drive pointer tilt');
  await motionPage.emulateMedia({ reducedMotion: 'reduce' });
  await motionPage.waitForFunction(() => !document.getAnimations().some(animation => animation.playState === 'running'));
  assert.equal(await motionPage.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0);
  await tilt.hover({ position: { x: 200, y: 100 } });
  assert.equal(await tilt.evaluate(element => element.style.transform), '', 'Reduced motion must prevent pointer tilt');
  assert.equal(await tilt.evaluate(element => getComputedStyle(element).transform), 'none');
  const resources = await motionPage.evaluate(() => performance.getEntriesByType('resource').map(({ name, transferSize, encodedBodySize }) => ({ name: new URL(name).pathname, transferSize, encodedBodySize })));
  await writeFile(resolve(output, 'resources.json'), JSON.stringify(resources, null, 2));
  await motionContext.close();

  const phoneContext = await browser.newContext({ reducedMotion: 'no-preference', isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  await phoneContext.addInitScript(() => {
    window.sensorPermissionRequests = 0;
    window.sensorPermissionResult = 'granted';
    Object.defineProperty(DeviceOrientationEvent, 'requestPermission', { configurable: true, writable: true, value: async () => { window.sensorPermissionRequests++; return window.sensorPermissionResult; } });
  });
  const phone = await phoneContext.newPage();
  phone.on('pageerror', error => errors.push(error.message));
  await phone.goto(origin); await settle(phone);
  const phoneToggle = phone.locator('[data-phone-tilt]');
  const phoneTilt = phone.locator('[data-card-tilt]');
  await phoneToggle.scrollIntoViewIfNeeded();
  assert.equal(await phoneToggle.isVisible(), true);
  assert.equal(await phone.evaluate(() => window.sensorPermissionRequests), 0, 'Sensor permission needs an explicit tap');
  await phoneToggle.click();
  assert.equal(await phoneToggle.getAttribute('aria-pressed'), 'true');
  assert.equal(await phone.evaluate(() => window.sensorPermissionRequests), 1);
  const orient = (beta, gamma) => phone.evaluate(({ beta, gamma }) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta, gamma })), { beta, gamma });
  await orient(30, 10); await orient(40, 20);
  await phone.waitForFunction(() => document.querySelector('[data-card-tilt]').style.transform.includes('rotateX(-2.25deg) rotateY(2.75deg)'));
  await orient(85, 85);
  await phone.waitForFunction(() => document.querySelector('[data-card-tilt]').style.transform.includes('rotateX(-4.5deg) rotateY(5.5deg)'));
  await phone.locator('.download-panel').screenshot({ path: resolve(output, 'pearl-phone-tilt.png') });
  await phone.evaluate(() => window.scrollTo(0, 0));
  await phone.waitForFunction(() => !document.querySelector('[data-card-tilt]').style.transform);
  await orient(-60, -60);
  assert.equal(await phoneTilt.evaluate(element => element.style.transform), '', 'Offscreen card must stop reading motion');
  await phoneToggle.scrollIntoViewIfNeeded();
  await phoneToggle.click();
  assert.equal(await phoneToggle.getAttribute('aria-pressed'), 'false');
  await phone.evaluate(() => { window.sensorPermissionResult = 'denied'; });
  await phoneToggle.click();
  assert.equal(await phoneToggle.getAttribute('aria-pressed'), 'false');
  assert.match(await phone.locator('[data-tilt-status]').textContent(), /not enabled/);
  await phone.evaluate(() => { DeviceOrientationEvent.requestPermission = async () => { throw new Error('Permission unavailable'); }; });
  await phoneToggle.click();
  assert.match(await phone.locator('[data-tilt-status]').textContent(), /unavailable/);
  await phone.evaluate(() => { DeviceOrientationEvent.requestPermission = async () => 'granted'; });
  await phoneToggle.click();
  await orient(0, 0); await orient(5, 10);
  await phone.waitForFunction(() => !!document.querySelector('[data-card-tilt]').style.transform);
  await phone.emulateMedia({ reducedMotion: 'reduce' });
  await phone.waitForFunction(() => !document.querySelector('[data-card-tilt]').style.transform);
  assert.equal(await phoneToggle.isHidden(), true);
  await orient(25, 25);
  assert.equal(await phoneTilt.evaluate(element => element.style.transform), '');
  await phoneContext.close();
  const unsupportedContext = await browser.newContext({ isMobile: true, hasTouch: true });
  await unsupportedContext.addInitScript(() => { Object.defineProperty(window, 'DeviceOrientationEvent', { value: undefined }); });
  const unsupported = await unsupportedContext.newPage();
  unsupported.on('pageerror', error => errors.push(error.message));
  await unsupported.goto(origin);
  assert.equal(await unsupported.locator('[data-phone-tilt]').isHidden(), true);
  await unsupportedContext.close();
  assert.deepEqual(errors, [], 'Runtime errors or failed resources');
  await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({ viewports: results, checks: ['edition content and rapid switching', 'theme persistence', 'keyboard tabs', 'native FAQ', 'CTA destinations', 'reduced motion', '200% text', 'blocked storage', 'image failure and retry', 'no JavaScript', 'Pearl Platinum closing card', 'pointer tilt and leave reset', 'phone sensor consent/calibration/clamping', 'denied and unavailable sensor permission', 'offscreen and reduced-motion sensor suspension', 'unsupported sensor fallback'], errors }, null, 2));
  console.log('PASS: 10 layouts/themes, axe WCAG AA, navigation/fallbacks, Pearl Platinum pointer tilt, sensor permission/calibration/clamping, offscreen suspension and reduced motion.');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
