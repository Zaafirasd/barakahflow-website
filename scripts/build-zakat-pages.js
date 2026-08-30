#!/usr/bin/env node
/* Generates the /zakat-calculator/*.html landing pages and rewrites
 * sitemap.xml to include them.
 *
 *   node scripts/build-zakat-pages.js
 *
 * THIS IS NOT A DEPLOY-TIME BUILD STEP. The site remains plain static HTML
 * with no framework and no pipeline — Vercel just serves the files. This
 * script exists so that eleven near-identical pages cannot drift apart from
 * each other. Edit scripts/zakat-pages.data.js, re-run this, commit the
 * generated HTML.
 *
 * If you ever hand-edit a generated page directly, note that re-running this
 * script will overwrite that edit. Put the change in the data file instead.
 */

const fs = require('fs');
const path = require('path');

const {
  madhhabPages,
  regionalPages,
  nisabFallbacks,
  conventionLabels,
  NOT_FATWA,
} = require('./zakat-pages.data.js');

const ORIGIN = 'https://barakahflowapp.com';
const OUT_DIR = path.join(__dirname, '..', 'zakat-calculator');
const ROOT = path.join(__dirname, '..');
const LASTMOD = new Date().toISOString().slice(0, 10);

const allPages = [...madhhabPages, ...regionalPages];
const bySlug = Object.fromEntries(allPages.map((p) => [p.slug, p]));

// ---------------------------------------------------------------------------
// Escaping
// ---------------------------------------------------------------------------

/** Escape text destined for an HTML text node or a double-quoted attribute. */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Serialise a JSON-LD graph for embedding in a <script> element.
 *  JSON-LD is JSON, not HTML: entities are NOT decoded inside it, so the
 *  source strings must stay as real Unicode. The only escaping needed is to
 *  stop a literal "</script>" inside a string from closing the element. */
function jsonLd(obj) {
  return JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');
}

// ---------------------------------------------------------------------------
// Fragments
// ---------------------------------------------------------------------------

function nisabCards(page) {
  const conv = nisabFallbacks[page.conventionKey];
  const cur = page.currency;
  const vals = conv.values[cur] || conv.values.USD;
  const basis = page.nisabBasis;

  const card = (metal, grams, value) => {
    const operative =
      basis === metal || (basis === 'lower' && metal === 'silver');
    return `            <div class="surface nisab-card">
              <span class="nc-metal">${esc(metal === 'gold' ? 'Gold threshold' : 'Silver threshold')}${operative ? ' &middot; applies to you' : ''}</span>
              <strong class="nc-weight">${esc(grams)} g</strong>
              <span class="nc-value" data-nisab="${metal}" data-grams="${esc(grams)}">&asymp; ${esc(value)}</span>
              <span class="nc-asof" data-nisab-asof>Approximate, at time of writing</span>
            </div>`;
  };

  return `          <div class="nisab-cards">
${card('gold', conv.gold, vals.gold)}
${card('silver', conv.silver, vals.silver)}
          </div>`;
}

function workedExample(ex) {
  const rows = ex.rows
    .map(
      (r) =>
        `              <dt${r.total ? ' class="we-total"' : ''}>${esc(r.k)}</dt>\n` +
        `              <dd class="${r.total ? 'we-total' : ''}">${esc(r.v)}</dd>`
    )
    .join('\n');

  return `        <div class="surface worked-example">
          <h3>${esc(ex.title)}</h3>
          <dl>
${rows}
          </dl>
          <p class="we-note">${esc(ex.note)}</p>
        </div>`;
}

function estimator(page) {
  const currencies = ['USD', 'GBP', 'EUR', 'AED', 'SAR', 'PKR', 'INR', 'BDT', 'SGD', 'MYR', 'IDR', 'CAD', 'AUD'];
  const preferred = page.currency;
  const ordered = [preferred, ...currencies.filter((c) => c !== preferred)];

  const options = ordered
    .map((c) => `              <option value="${esc(c)}">${esc(c)}</option>`)
    .join('\n');

  return `        <form class="surface estimator" data-estimator>
          <h3>Quick Zakat estimate</h3>
          <p class="est-sub">A flat 2.5% of whatever figure you enter. Nothing more than that.</p>

          <div class="est-field">
            <label for="est-amount">Your zakatable wealth</label>
            <div class="est-input-row">
              <input id="est-amount" type="text" inputmode="decimal" placeholder="10000" data-est-amount autocomplete="off">
              <select aria-label="Currency" data-est-currency>
${options}
              </select>
            </div>
          </div>

          <div class="est-result">
            <span class="est-result-label">Estimated Zakat at 2.5%</span>
            <span class="est-result-value" data-est-result>&mdash;</span>
          </div>

          <p class="est-disclaimer">
            <strong>This is an estimate, not your Zakat figure.</strong>
            It multiplies what you type by 2.5% and stops there. It does not check
            whether you are above nisab, deduct any debt, apply the ${esc(page.kind === 'madhhab' ? page.label : 'regional')}
            rules described on this page, value gold by karat, or track your Hawl.
            For the real number, with your school and your circumstances applied,
            use the calculator in the app.
          </p>

          <a class="button button-primary" href="https://app.barakahflowapp.com" target="_blank" rel="noopener noreferrer" data-track-open>Open the full calculator</a>
        </form>`;
}

function faqSection(page) {
  const items = page.faqs
    .map(
      (f) => `            <details class="surface faq-item">
              <summary>${esc(f.q)}</summary>
              <div class="faq-content">
${f.a.map((p) => `                <p>${esc(p)}</p>`).join('\n')}
              </div>
            </details>`
    )
    .join('\n\n');

  return `      <section class="section" id="faq">
        <div class="container">
          <div class="reveal" style="display: flex; flex-direction: column; align-items: center;">
            <span class="section-label">Questions?</span>
            <h2 class="section-heading">${esc(page.label)} Zakat, commonly asked</h2>
          </div>

          <div class="faq-grid reveal" data-stagger>
${items}
          </div>
        </div>
      </section>`;
}

function relatedSection(page) {
  const cards = page.related
    .map((slug) => {
      const r = bySlug[slug];
      if (!r) throw new Error(`Unknown related slug "${slug}" on page "${page.slug}"`);
      const blurb =
        r.kind === 'madhhab'
          ? `The ${r.label} position on nisab, jewellery, debt and timing.`
          : `Nisab, currency and local practice for ${r.label}.`;
      return `            <a class="surface related-card" href="/zakat-calculator/${esc(r.slug)}.html">
              <strong>${esc(r.kind === 'madhhab' ? r.label + ' Zakat calculator' : 'Zakat calculator, ' + r.label)}</strong>
              <span>${esc(blurb)}</span>
            </a>`;
    })
    .join('\n');

  return `      <section class="section">
        <div class="container">
          <div class="reveal" style="display: flex; flex-direction: column; align-items: center;">
            <span class="section-label">Related</span>
            <h2 class="section-heading">Compare with another method</h2>
            <p class="section-copy">The same holdings produce different figures under different schools and conventions. Seeing the comparison is the point.</p>
          </div>
          <div class="related-grid reveal">
${cards}
          </div>
        </div>
      </section>`;
}

function bodySections(page) {
  return page.body
    .map(
      (s) => `          <h2>${esc(s.h)}</h2>
${s.p.map((p) => `          <p>${esc(p)}</p>`).join('\n')}`
    )
    .join('\n\n');
}

function rulesTable(page) {
  if (!page.rules) return '';
  const rows = page.rules
    .map(
      (r) => `                <tr>
                  <th scope="row">${esc(r.k)}</th>
                  <td data-label="${esc(r.k)}">${esc(r.v)}</td>
                </tr>`
    )
    .join('\n');

  return `        <div class="table-wrap reveal">
          <table class="ref-table">
            <caption>The ${esc(page.label)} position at a glance</caption>
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">${esc(page.label)} position</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>`;
}

function regionMeta(page) {
  if (page.kind !== 'region') return '';
  const currencyList = page.currencies
    .map((c) => `${c.name} (${c.code})${c.note ? ', ' + c.note : ''}`)
    .join('; ');

  return `        <div class="table-wrap reveal">
          <table class="ref-table">
            <caption>How Zakat is calculated for ${esc(page.label)}</caption>
            <tbody>
              <tr>
                <th scope="row">Weight convention</th>
                <td data-label="Weight convention">${esc(conventionLabels[page.conventionKey])} &mdash; ${esc(nisabFallbacks[page.conventionKey].gold)} g gold, ${esc(nisabFallbacks[page.conventionKey].silver)} g silver</td>
              </tr>
              <tr>
                <th scope="row">Operative threshold</th>
                <td data-label="Operative threshold">${esc(page.nisabBasis === 'gold' ? 'Gold' : page.nisabBasis === 'silver' ? 'Silver' : 'The lower of the two, in practice silver')}</td>
              </tr>
              <tr>
                <th scope="row">Follows the positions of</th>
                <td data-label="Follows the positions of">${esc(page.authorities)}</td>
              </tr>
              <tr>
                <th scope="row">Currencies</th>
                <td data-label="Currencies">${esc(currencyList)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="table-note">${esc(page.conventionWhy)}</p>`;
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

function structuredData(page, url) {
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'Zakat Calculator', item: ORIGIN + '/#zakat' },
      { '@type': 'ListItem', position: 3, name: page.label, item: url },
    ],
  };

  const faq = {
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
    })),
  };

  // One shared @id so the eleven pages describe a single application entity
  // rather than eleven separate ones.
  const app = {
    '@type': 'WebApplication',
    '@id': ORIGIN + '/#webapp',
    name: 'BarakahFlow',
    url: 'https://app.barakahflowapp.com',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, Android, iOS',
    description:
      'Halal personal finance app with a Zakat engine covering the four Sunni schools, three nisab weight conventions, six regional presets, live gold and silver spot prices and a true lunar Hawl.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ORIGIN + '/#org' },
  };

  const org = {
    '@type': 'Organization',
    '@id': ORIGIN + '/#org',
    name: 'BarakahFlow',
    url: ORIGIN + '/',
    logo: ORIGIN + '/Images/logopng.png',
  };

  return jsonLd({ '@context': 'https://schema.org', '@graph': [breadcrumb, faq, app, org] });
}

// ---------------------------------------------------------------------------
// Page template
// ---------------------------------------------------------------------------

function renderPage(page) {
  const url = `${ORIGIN}/zakat-calculator/${page.slug}.html`;
  const crumbLabel = page.label;

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${esc(url)}">
  <meta name="keywords" content="${esc(page.keywords)}">
  <meta name="theme-color" content="#10B981">
  <meta name="robots" content="index, follow">
  <meta name="author" content="BarakahFlow Team">
  <meta name="publisher" content="BarakahFlow">
  <meta name="application-name" content="BarakahFlow">

  <link rel="icon" type="image/png" sizes="32x32" href="/Images/favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64" href="/Images/favicon-64.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/Images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">

  <meta property="og:type" content="article">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:image" content="${ORIGIN}/Images/logopng.png">
  <meta property="og:site_name" content="BarakahFlow">

  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${esc(url)}">
  <meta property="twitter:title" content="${esc(page.title)}">
  <meta property="twitter:description" content="${esc(page.description)}">
  <meta property="twitter:image" content="${ORIGIN}/Images/logopng.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/zakat-landing.css">
  <script defer src="/_vercel/insights/script.js"></script>

  <!-- Apply the stored theme before first paint so the page does not flash. -->
  <script>
    (function () {
      try {
        var t = localStorage.getItem("barakahflow-theme");
        document.documentElement.dataset.theme = t === "light" ? "light" : "dark";
      } catch (e) {}
    })();
  </script>

  <script type="application/ld+json">
${structuredData(page, url)}
  </script>
</head>
<body data-page-currency="${esc(page.currency)}">
  <div class="page">
    <nav class="navbar" id="navbar" aria-label="Primary">
      <div class="container">
        <div class="navbar-inner">
          <a class="brand" href="/" aria-label="BarakahFlow home">
            <img src="/Images/monogram.png" alt="BarakahFlow - Halal Personal Finance &amp; Zakat App">
            <span>
              <span class="brand-name">BarakahFlow</span>
              <span class="brand-tag">Halal finance. Built for the Ummah.</span>
            </span>
          </a>

          <div class="nav-actions">
            <button class="theme-toggle" type="button" aria-label="Switch theme" data-theme-toggle>
              <span class="theme-icon" aria-hidden="true">&#x2600;</span>
            </button>
            <a class="button button-primary" href="https://app.barakahflowapp.com" target="_blank" rel="noopener noreferrer" data-track-open><span class="button-text">Open App</span></a>
          </div>
        </div>
      </div>
    </nav>

    <main id="top">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/#zakat">Zakat Calculator</a></li>
            <li><span aria-current="page">${esc(crumbLabel)}</span></li>
          </ol>
        </nav>
      </div>

      <header class="section page-hero">
        <div class="container">
          <div class="reveal">
            <span class="eyebrow">${esc(page.kind === 'madhhab' ? 'School of jurisprudence' : 'Regional guide')}</span>
            <h1>${esc(page.h1)}</h1>
            <p class="lede">${esc(page.lede)}</p>
          </div>
        </div>
      </header>

      <section class="section">
        <div class="container">
${page.kind === 'madhhab' ? rulesTable(page) : regionMeta(page)}

          <div class="reveal" style="margin-top: 2.5rem;">
            <h2 class="section-heading" style="text-align: left;">The threshold, in ${esc(page.currency)}</h2>
            <p class="section-copy" style="text-align: left; margin-left: 0;">${esc(page.nisabNote || 'Nisab is a weight of metal, so its value in your currency moves with the market. The figures below are refreshed from live international spot prices when the page loads.')}</p>
          </div>

${nisabCards(page)}

          <p class="table-note" style="text-align: left;">Gram weights are fixed and are stated above. The currency values are indicative: they are rendered into the page as static figures and upgraded to live spot prices when the price feed responds.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="prose reveal">
${bodySections(page)}
          </div>

${workedExample(page.example)}
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="reveal" style="display: flex; flex-direction: column; align-items: center;">
            <span class="section-label">Rough figure</span>
            <h2 class="section-heading">A 2.5% estimate, and where the real one lives</h2>
            <p class="section-copy">This does one multiplication. Every rule described on this page lives in the app, not in this box.</p>
          </div>

${estimator(page)}
        </div>
      </section>

${faqSection(page)}

${relatedSection(page)}

      <section class="section">
        <div class="container">
          <div class="spotlight surface">
            <div class="spotlight-copy reveal">
              <div class="status-chip">Free</div>
              <h2 style="margin-top: 0.5rem;">Get the number that actually applies to you.</h2>
              <p>BarakahFlow applies your school, your region, your currency and your Hawl, values gold at each karat separately, handles debt properly, and keeps a record you can defend three years from now.</p>
              <p class="fiqh-note">${esc(NOT_FATWA)}</p>
              <a class="button button-primary" href="https://app.barakahflowapp.com" target="_blank" rel="noopener noreferrer" data-track-open>Open BarakahFlow &mdash; free, no install</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="surface footer-inner">
          <div class="footer-brand">
            <img src="/Images/monogram.png" alt="BarakahFlow branding">
            <span>
              <strong>BarakahFlow</strong>
              <span>Halal finance. Built for the Ummah.</span>
            </span>
          </div>

          <div class="footer-meta">
            <a href="/privacy-policy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
            <a href="mailto:barakahflowapp@gmail.com" title="For bugs, suggestions, etc.">Contact Us</a>
            <span>&copy; 2026 BarakahFlow. Built for Muslims by the BarakahFlow Team.</span>
          </div>
        </div>
      </div>
    </footer>
  </div>

  <script src="/assets/zakat-landing.js" defer></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

function renderSitemap() {
  const entry = (loc, priority, changefreq) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const urls = [
    entry(`${ORIGIN}/`, '1.0', 'weekly'),
    ...allPages.map((p) =>
      entry(`${ORIGIN}/zakat-calculator/${p.slug}.html`, '0.8', 'weekly')
    ),
    entry(`${ORIGIN}/privacy-policy.html`, '0.5', 'monthly'),
    entry(`${ORIGIN}/terms.html`, '0.5', 'monthly'),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

function main() {
  const slugs = allPages.map((p) => p.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length) throw new Error('Duplicate slugs: ' + dupes.join(', '));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  allPages.forEach((page) => {
    const file = path.join(OUT_DIR, `${page.slug}.html`);
    fs.writeFileSync(file, renderPage(page), 'utf8');
    console.log(`  wrote zakat-calculator/${page.slug}.html`);
  });

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), renderSitemap(), 'utf8');
  console.log(`  wrote sitemap.xml (${allPages.length + 3} urls)`);

  console.log(`\nDone. ${allPages.length} pages.`);
}

main();
