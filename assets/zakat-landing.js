/* BarakahFlow — Zakat landing pages
 *
 * Shared behaviour for /zakat-calculator/*.html. Three jobs:
 *   1. Carry the homepage's theme toggle, navbar and reveal animations over
 *      to these pages so they feel like the same site.
 *   2. Drive the quick-estimate widget. See estimateZakat() below: it is a
 *      flat 2.5% and nothing else. No debt, no jewellery, no madhhab or
 *      regional branching. The real engine lives in the app and stays there.
 *   3. Replace the statically rendered nisab currency figures with live ones
 *      when the price feed answers. The static figures are already in the
 *      HTML, so this only ever upgrades the page — it never blanks it.
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------
  // 1. Theme, navbar, reveal — carried over from the homepage
  // ---------------------------------------------------------------
  var root = document.documentElement;
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;

  function syncThemeUI() {
    if (!themeToggle || !themeIcon) return;
    var isLight = root.dataset.theme === "light";
    themeIcon.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
  }

  syncThemeUI();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem("barakahflow-theme", root.dataset.theme); } catch (e) {}
      syncThemeUI();
    });
  }

  var navbar = document.getElementById("navbar");
  var lastScrollY = window.scrollY;

  window.addEventListener("scroll", function () {
    var currentScrollY = window.scrollY;
    if (!navbar) return;
    if (currentScrollY > lastScrollY + 8 && currentScrollY > 90) {
      navbar.classList.add("nav-hidden");
    } else if (currentScrollY < lastScrollY - 6 || currentScrollY <= 20) {
      navbar.classList.remove("nav-hidden");
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (child, index) {
      child.classList.add("reveal");
      child.style.transitionDelay = (index * 90) + "ms";
    });
  });

  var revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealElements.forEach(function (el) { observer.observe(el); });
  }

  // ---------------------------------------------------------------
  // 2. Quick-estimate widget
  // ---------------------------------------------------------------

  /* The entire calculation. Deliberately one line.
   *
   * This is a rough headline figure for someone who has landed from a
   * search result and wants a number in five seconds. It assumes the
   * visitor is already above nisab and has already netted off whatever
   * their school lets them deduct. It does NOT apply debt rules,
   * jewellery rules, nisab checks, hawl timing, gold purity, or any
   * madhhab or regional position — those live in one place, the app,
   * and are not duplicated here. Every page says so on screen. */
  function estimateZakat(wealth) {
    return wealth * 0.025;
  }

  /* Always two decimals, never rounded to whole units. The app rounds the
   * final Zakat figure up; this widget deliberately shows the bare product
   * instead, so it cannot be mistaken for the app's answer. */
  function formatMoney(value, currency, decimals) {
    var dp = typeof decimals === "number" ? decimals : 2;
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      }).format(value);
    } catch (e) {
      return currency + " " + value.toFixed(dp).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  var estForm = document.querySelector("[data-estimator]");

  if (estForm) {
    var amountInput = estForm.querySelector("[data-est-amount]");
    var currencySelect = estForm.querySelector("[data-est-currency]");
    var resultEl = estForm.querySelector("[data-est-result]");

    var renderEstimate = function () {
      var typed = amountInput.value || "";
      var currency = currencySelect ? currencySelect.value : "USD";

      // Strip grouping separators and currency symbols, but treat a minus
      // sign as invalid rather than silently discarding it — otherwise
      // "-500" would be read as 500 and quietly produce a positive figure.
      var raw = typed.indexOf("-") === -1 ? typed.replace(/[^0-9.]/g, "") : "";
      var wealth = parseFloat(raw);

      if (!isFinite(wealth) || wealth <= 0) {
        resultEl.textContent = formatMoney(0, currency);
        return;
      }

      resultEl.textContent = formatMoney(estimateZakat(wealth), currency);
    };

    amountInput.addEventListener("input", renderEstimate);
    if (currencySelect) currencySelect.addEventListener("change", renderEstimate);
    estForm.addEventListener("submit", function (e) { e.preventDefault(); renderEstimate(); });
    renderEstimate();
  }

  // ---------------------------------------------------------------
  // 3. Live nisab currency figures (progressive upgrade only)
  // ---------------------------------------------------------------

  /* Each [data-nisab] element already contains a server-delivered figure
   * and carries the metal, the gram weight and the currency it was
   * rendered in. If the feed answers we swap in a live number; if it does
   * not, or JavaScript never runs, the static figure simply stays put.
   * This is a unit conversion (price per gram x grams), not Zakat logic. */
  var PRICE_ENDPOINT = "https://app.barakahflowapp.com/api/gold-price";
  var nisabEls = document.querySelectorAll("[data-nisab]");

  if (nisabEls.length) {
    var currency = document.body.getAttribute("data-page-currency") || "USD";

    fetch(PRICE_ENDPOINT + "?currency=" + encodeURIComponent(currency), {
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        if (!res.ok) throw new Error("price feed " + res.status);
        return res.json();
      })
      .then(function (data) {
        var goldPerGram = Number(data.price_per_gram_gold);
        var silverPerGram = Number(data.price_per_gram_silver);
        if (!isFinite(goldPerGram) || !isFinite(silverPerGram)) return;
        if (goldPerGram <= 0 || silverPerGram <= 0) return;

        nisabEls.forEach(function (el) {
          var metal = el.getAttribute("data-nisab");
          var grams = parseFloat(el.getAttribute("data-grams"));
          if (!isFinite(grams) || grams <= 0) return;

          var perGram = metal === "gold" ? goldPerGram : metal === "silver" ? silverPerGram : NaN;
          if (!isFinite(perGram)) return;

          el.textContent = "≈ " + formatMoney(perGram * grams, currency, 0);
        });

        var asOfEls = document.querySelectorAll("[data-nisab-asof]");
        if (asOfEls.length && data.asOf) {
          var stamp = new Date(data.asOf);
          if (!isNaN(stamp.getTime())) {
            var label = data.isFallback
              ? "Live feed unavailable, showing last known prices"
              : "Live spot price, " + stamp.toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                });
            asOfEls.forEach(function (el) { el.textContent = label; });
          }
        }
      })
      .catch(function () {
        /* Static figures already on the page stand. Nothing to do. */
      });
  }

  // ---------------------------------------------------------------
  // 4. Icons + analytics, matching the homepage
  // ---------------------------------------------------------------
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  var ANALYTICS_URL = "https://app.barakahflowapp.com/api/analytics/website";

  function trackWebsite(metric) {
    fetch(ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metric: metric }),
      keepalive: true,
    }).catch(function () {});
  }

  try {
    if (!sessionStorage.getItem("bf_visited")) {
      sessionStorage.setItem("bf_visited", "1");
      trackWebsite("website_visit");
    }
  } catch (e) {}

  var isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var isAndroidDevice = /Android/.test(navigator.userAgent);

  document.querySelectorAll("[data-track-open]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (isIOSDevice) trackWebsite("website_ios_launch");
      else if (isAndroidDevice) trackWebsite("website_android_launch");
    }, { once: true });
  });
})();
