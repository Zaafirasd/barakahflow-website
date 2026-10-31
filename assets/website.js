(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const themeButton = document.querySelector('[data-theme-toggle]');
  const art = document.getElementById('edition-art');
  const writingButton = document.querySelector('[data-preview-writing]');
  const writingPreview = document.querySelector('[data-writing-preview]');
  let writingVersion = 0;
  let writingAnimations = [];
  let writingMarkup;
  let writingActive = false;
  const editions = [
    { name: 'Essential', material: 'YOUR STARTING POINT', message: 'A hopeful beginning.', description: 'A difficult season does not erase your progress. Begin with one small, intentional step.', requirement: 'Your starting card when you create your account. It follows your light or dark theme.', file: 'essential', word: 'Yusr, ease' },
    { name: 'Emerald', material: 'EMERALD SATIN', message: 'Keep going, gently.', description: 'Your picture is getting clearer. Keep showing up, one thoughtful habit at a time.', requirement: 'Complete one accepted first check-in: review an account balance and your recent records.', file: 'emerald', word: 'Sabr, patience' },
    { name: 'Midnight Gold', material: 'A QUIET FLOURISH', message: 'Room to be grateful.', description: 'There is more clarity in your routine. Pause to appreciate it, and keep caring for what you have.', requirement: 'Complete three accepted weekly check-ins after your first check-in. Weekly checks are at least seven days apart.', file: 'midnight-gold', word: 'Shukr, gratitude' },
    { name: 'Pearl Platinum', material: 'THE FULL ARABESQUE', message: 'Let goodness grow.', description: 'Thoughtful habits create room to care for yourself and others. Carry that intention forward.', requirement: 'Complete eight accepted weekly check-ins in total and two complete financial-period reviews. Both conditions are needed.', file: 'pearl-platinum', word: 'Ihsan, excellence' },
  ];
  let selected = 0;
  let imageRequest = 0;
  let cardAnimation;
  function editionPath(index) {
    return '/assets/cards/' + editions[index].file + (index === 0 ? '-' + root.dataset.theme : '') + '.webp';
  }
  async function showCard(index) {
    cancelWriting();
    syncWritingButton();
    const request = ++imageRequest;
    const path = editionPath(index);
    const next = new Image();
    next.src = path;
    const caption = document.querySelector('.art-caption');
    try { await next.decode(); } catch {
      if (request === imageRequest) {
        art.hidden = true;
        caption.textContent = 'Preview could not load. Select an edition to try again.';
        caption.setAttribute('role', 'status');
      }
      return;
    }
    if (request !== imageRequest) return;
    cardAnimation?.cancel();
    art.hidden = false;
    caption.textContent = 'The Barakah Card collection · artwork preview';
    caption.removeAttribute('role');
    art.src = path;
    art.alt = editions[index].name + ' Barakah Card, with the Arabic reminder ' + editions[index].word + '.';
    if (!reduced.matches && art.animate) {
      cardAnimation = art.animate([{ opacity: .4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
    }
  }
  function syncWritingButton() {
    writingButton.hidden = selected !== 0 || reduced.matches || typeof art.animate !== 'function';
  }
  function cancelWriting() {
    ++writingVersion;
    writingAnimations.forEach(animation => animation.cancel());
    writingAnimations = [];
    writingPreview.hidden = true;
    writingPreview.replaceChildren();
    writingButton.disabled = false;
    writingButton.textContent = 'Preview the writing';
    if (writingActive && selected === 0) art.src = editionPath(0);
    writingActive = false;
  }
  writingButton.addEventListener('click', async () => {
    if (selected !== 0 || reduced.matches || writingActive) return;
    ++imageRequest;
    const version = ++writingVersion;
    writingActive = true;
    writingButton.disabled = true;
    writingButton.textContent = 'Loading preview…';
    const caption = document.querySelector('.art-caption');
    caption.textContent = 'The Barakah Card collection · artwork preview';
    caption.removeAttribute('role');
    const blank = new Image();
    blank.src = '/assets/cards/essential-' + root.dataset.theme + '-blank.webp';
    try {
      const [markup] = await Promise.all([
        writingMarkup || fetch('/assets/cards/essential-writing.svg').then(response => { if (!response.ok) throw new Error('Writing artwork unavailable'); return response.text(); }),
        blank.decode(),
      ]);
      writingMarkup = markup;
      if (version !== writingVersion || reduced.matches || selected !== 0) return;
      const svg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
      if (svg.localName !== 'svg' || svg.querySelector('parsererror')) throw new Error('Invalid writing artwork');
      writingPreview.replaceChildren(document.importNode(svg, true));
      art.src = blank.src;
      writingPreview.hidden = false;
      writingButton.textContent = 'Writing…';
      // The app's exact Amiri outlines, pen routes and timings; no reward reveal.
      writingAnimations = Array.from(writingPreview.querySelectorAll('[data-pen-stroke],[data-pen-tip]'), path => path.animate([
        { strokeDashoffset: '1', opacity: 0, offset: 0 },
        { strokeDashoffset: '1', opacity: 1, offset: .001 },
        { strokeDashoffset: '0', opacity: 1, offset: 1 },
      ], { delay: Number(path.dataset.delay), duration: Number(path.dataset.duration), easing: 'cubic-bezier(.32,.08,.24,1)', fill: 'both' }));
      await Promise.all(writingAnimations.map(animation => animation.finished));
      if (version !== writingVersion) return;
      cancelWriting();
      writingButton.textContent = 'Replay the writing';
    } catch {
      if (version !== writingVersion) return;
      cancelWriting();
      const caption = document.querySelector('.art-caption');
      caption.textContent = 'Writing preview could not load. Try again.';
      caption.setAttribute('role', 'status');
    }
  });
  syncWritingButton();
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelWriting(); });
  function syncTheme() {
    const light = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-label', 'Switch to ' + (light ? 'dark' : 'light') + ' theme');
    document.querySelector('meta[name="theme-color"]').content = light ? '#f8fafc' : '#0b1120';
  }
  syncTheme();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('barakahflow-theme', root.dataset.theme); } catch { /* Preference remains available for this visit. */ }
    syncTheme();
    if (selected === 0) void showCard(0);
  });
  if (root.dataset.theme === 'light') void showCard(0);
  document.querySelectorAll('[data-edition]').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.edition);
      if (index === selected && !art.hidden) return;
      selected = index;
      document.querySelectorAll('[data-edition]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const edition = editions[index];
      for (const key of ['name', 'material', 'message', 'description', 'requirement']) document.getElementById('edition-' + key).textContent = edition[key];
      document.querySelector('.edition-index').innerHTML = '0' + (index + 1) + ' <span>/ 04</span>';
      void showCard(index);
    });
  });

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  let panelAnimation;
  function activateTab(tab, animate) {
    const name = tab.id.replace('tab-', '');
    tabs.forEach(item => { const current = item === tab; item.setAttribute('aria-selected', String(current)); item.tabIndex = current ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !current; });
    document.querySelectorAll('[data-preview]').forEach(preview => { preview.hidden = preview.dataset.preview !== name; });
    panelAnimation?.cancel();
    const preview = document.querySelector('[data-preview="' + name + '"]');
    if (animate && !reduced.matches && preview.animate) panelAnimation = preview.animate([{ opacity: .4, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); tabs[next].focus(); activateTab(tabs[next], false);
    });
  });
  // One-off reveals; content is always visible if scripts, observers or motion are unavailable.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    reduced.addEventListener('change', () => { if (reduced.matches) observer.disconnect(); });
  }
  reduced.addEventListener('change', () => { if (reduced.matches) { cardAnimation?.cancel(); panelAnimation?.cancel(); cancelWriting(); } syncWritingButton(); });

  // Same bounded tilt and orientation calibration as the app's useCardTilt.
  // Scroll entrance belongs to the outer stage, so it cannot override interaction.
  const tiltCard = document.querySelector('[data-card-tilt]');
  const tiltButton = document.querySelector('[data-phone-tilt]');
  const tiltStatus = document.querySelector('[data-tilt-status]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const sensorSupported = window.isSecureContext && typeof window.DeviceOrientationEvent === 'function';
  const clamp = value => Math.max(0, Math.min(1, value));
  const difference = (value, start) => ((value - start + 540) % 360) - 180;
  let cardInView = !('IntersectionObserver' in window);
  let sensorEnabled = false;
  let pointerActive = false;
  let baseline = null;
  let tiltFrame = 0;
  let latestTilt;
  const tiltActive = () => cardInView && !document.hidden && !reduced.matches;
  function resetTilt() {
    cancelAnimationFrame(tiltFrame);
    tiltFrame = 0; baseline = null; pointerActive = false;
    tiltCard.style.removeProperty('transform');
  }
  function writeTilt(x, y) {
    latestTilt = { x: clamp(x), y: clamp(y) };
    if (!tiltFrame) tiltFrame = requestAnimationFrame(() => {
      tiltFrame = 0;
      if (tiltActive()) tiltCard.style.transform = 'perspective(1000px) rotateX(' + ((.5 - latestTilt.y) * 9) + 'deg) rotateY(' + ((latestTilt.x - .5) * 11) + 'deg)';
    });
  }
  function readOrientation(event) {
    if (!tiltActive() || pointerActive || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    baseline ??= { beta: event.beta, gamma: event.gamma };
    const vertical = difference(event.beta, baseline.beta), horizontal = difference(event.gamma, baseline.gamma);
    const angle = (screen.orientation?.angle ?? 0) * Math.PI / 180;
    writeTilt(.5 + (horizontal * Math.cos(angle) - vertical * Math.sin(angle)) / 40, .5 + (vertical * Math.cos(angle) + horizontal * Math.sin(angle)) / 40);
  }
  function syncTilt() {
    window.removeEventListener('deviceorientation', readOrientation);
    resetTilt();
    if (reduced.matches) { sensorEnabled = false; tiltStatus.textContent = ''; }
    tiltButton.hidden = !sensorSupported || reduced.matches || (finePointer.matches && !sensorEnabled);
    tiltButton.setAttribute('aria-pressed', String(sensorEnabled));
    tiltButton.textContent = sensorEnabled ? 'Disable phone tilt' : 'Enable phone tilt';
    if (sensorEnabled && tiltActive()) window.addEventListener('deviceorientation', readOrientation, { passive: true });
  }
  tiltCard.addEventListener('pointermove', event => {
    if (!tiltActive() || !finePointer.matches || event.pointerType === 'touch') return;
    pointerActive = true;
    const rect = tiltCard.parentElement.getBoundingClientRect();
    writeTilt((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  });
  tiltCard.addEventListener('pointerleave', resetTilt);
  tiltCard.addEventListener('pointercancel', resetTilt);
  tiltButton.addEventListener('click', async () => {
    if (sensorEnabled) { sensorEnabled = false; syncTilt(); tiltStatus.textContent = 'Phone tilt is off.'; return; }
    tiltButton.disabled = true;
    try {
      const allowed = typeof DeviceOrientationEvent.requestPermission !== 'function' || await DeviceOrientationEvent.requestPermission() === 'granted';
      if (reduced.matches) return;
      sensorEnabled = allowed;
      syncTilt();
      tiltStatus.textContent = allowed ? 'Phone tilt is on. Move your phone gently.' : 'Phone tilt was not enabled. You can still explore the cards.';
    } catch {
      sensorEnabled = false; syncTilt();
      tiltStatus.textContent = 'Phone tilt is unavailable in this browser.';
    } finally { tiltButton.disabled = false; }
  });
  if ('IntersectionObserver' in window) {
    const tiltObserver = new IntersectionObserver(entries => { cardInView = entries.some(entry => entry.isIntersecting); syncTilt(); });
    tiltObserver.observe(tiltCard.parentElement);
  }
  document.addEventListener('visibilitychange', syncTilt);
  screen.orientation?.addEventListener('change', syncTilt);
  window.addEventListener('orientationchange', syncTilt);
  reduced.addEventListener('change', syncTilt);
  finePointer.addEventListener('change', syncTilt);
  syncTilt();

  // Preserve existing anonymous counters; preview never writes production analytics.
  if (!['barakahflowapp.com', 'barakahflow-website.vercel.app'].includes(location.hostname)) return;
  function track(metric) {
    fetch('https://app.barakahflowapp.com/api/analytics/website', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ metric }), keepalive: true }).catch(() => {});
  }
  try { if (!sessionStorage.getItem('bf_visited')) { sessionStorage.setItem('bf_visited', '1'); track('website_visit'); } } catch { /* Analytics never blocks the page. */ }
  document.querySelectorAll('[data-track]').forEach(link => link.addEventListener('click', () => {
    if (link.dataset.track === 'apk') track('website_apk_download');
    else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) track('website_ios_launch');
    else if (/Android/.test(navigator.userAgent)) track('website_android_launch');
  }, { once: true }));
})();
