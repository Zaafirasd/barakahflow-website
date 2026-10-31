(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  // Keep native anchors accurate when the navigation wraps or text is enlarged.
  const measureHeader = () => root.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
  measureHeader();
  if ('ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
  const themeButton = document.querySelector('[data-theme-toggle]');
  const art = document.getElementById('edition-art');
  const editions = [
    { name: 'Essential', material: 'YOUR STARTING POINT', message: 'A hopeful beginning.', description: 'A difficult season does not erase your progress. Begin with one small, intentional step.', requirement: 'Your starting card when you create your account. It follows your light or dark theme.', file: 'essential', word: 'Yusr, ease' },
    { name: 'Emerald', material: 'EMERALD SATIN', message: 'Keep going, gently.', description: 'Your picture is getting clearer. Keep showing up, one thoughtful habit at a time.', requirement: 'Complete one accepted first check-in: review an account balance and your recent records.', file: 'emerald', word: 'Sabr, patience' },
    { name: 'Midnight Gold', material: 'A QUIET FLOURISH', message: 'Room to be grateful.', description: 'There is more clarity in your routine. Pause to appreciate it, and keep caring for what you have.', requirement: 'Complete three accepted weekly check-ins after your first check-in. Weekly checks are at least seven days apart.', file: 'midnight-gold', word: 'Shukr, gratitude' },
    { name: 'Pearl Platinum', material: 'THE FULL ARABESQUE', message: 'Let goodness grow.', description: 'Thoughtful habits create room to care for yourself and others. Carry that intention forward.', requirement: 'Complete eight accepted weekly check-ins in total and two complete financial-period reviews. Both conditions are needed.', file: 'pearl-platinum', word: 'Ihsan, excellence' },
  ];
  let selected = 0;
  let imageRequest = 0;
  const cardFades = new Set();
  const cardEase = getComputedStyle(root).getPropertyValue('--ease-in-out').trim() || 'ease-in-out';
  function editionPath(index) {
    return '/assets/cards/' + editions[index].file + (index === 0 ? '-' + root.dataset.theme : '') + '.webp';
  }
  function clearCardFades() {
    cardFades.forEach(({ animation, image }) => { animation.cancel(); image.remove(); });
    cardFades.clear();
  }
  async function showCard(index) {
    const request = ++imageRequest;
    const path = editionPath(index);
    const next = new Image();
    next.src = path;
    const caption = document.querySelector('.art-caption');
    try { await next.decode(); } catch {
      if (request === imageRequest) {
        clearCardFades();
        art.hidden = true;
        caption.textContent = 'Preview could not load. Select an edition to try again.';
        caption.setAttribute('role', 'status');
      }
      return;
    }
    if (request !== imageRequest) return;
    // Keep each visible finish intact as the next one arrives underneath it.
    // Interrupted dissolves retain their current opacity instead of flashing.
    let outgoing;
    if (!reduced.matches && art.animate && !art.hidden && art.src !== next.src) {
      outgoing = art.cloneNode();
      outgoing.removeAttribute('id');
      outgoing.className = 'edition-outgoing';
      outgoing.alt = '';
      outgoing.loading = 'eager';
      outgoing.setAttribute('aria-hidden', 'true');
      art.after(outgoing);
    }
    art.hidden = false;
    art.src = path;
    art.alt = editions[index].name + ' Barakah Card, with the Arabic reminder ' + editions[index].word + '.';
    caption.textContent = 'The Barakah Card collection · artwork preview';
    caption.removeAttribute('role');
    if (outgoing) {
      const fade = { image: outgoing, animation: outgoing.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: cardEase, fill: 'forwards' }) };
      cardFades.add(fade);
      void fade.animation.finished.catch(() => {}).finally(() => { outgoing.remove(); cardFades.delete(fade); });
    }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearCardFades(); });
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
  // Only prepare offscreen content; initial and restored views never flash away.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.removeAttribute('data-reveal-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top >= innerHeight) element.setAttribute('data-reveal-pending', '');
      observer.observe(element);
    });
    reduced.addEventListener('change', () => {
      if (!reduced.matches) return;
      observer.disconnect();
      document.querySelectorAll('[data-reveal-pending]').forEach(element => element.removeAttribute('data-reveal-pending'));
    });
  }
  reduced.addEventListener('change', () => { if (reduced.matches) { clearCardFades(); panelAnimation?.cancel(); } });

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
