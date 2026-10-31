# BarakahFlow Landing Page

Marketing site for **BarakahFlow**, a mindful personal finance app for Muslims. The app lives at [app.barakahflowapp.com](https://app.barakahflowapp.com). The website remains buildless HTML, CSS and JavaScript, with no runtime framework or added dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | App-led landing page: Summary preview, Barakah Card explorer, Track/Plan/Save, guided routine, download and FAQ |
| `assets/website.css`, `assets/website.js` | Shared website tokens, responsive layouts, accessible previews and restrained native motion |
| `assets/cards/` | Current artwork-only WebP cards, responsive 1400px hero artwork and a separate dashboard balance preview |
| `404.html` | Branded missing-page response, including retired public calculators |
| `privacy-policy.html` | Privacy policy |
| `terms.html` | Terms of Service |
| `llms.txt` | Structured product summary for LLM crawlers |
| `sitemap.xml`, `robots.txt` | Crawl directives |
| `manifest.json` | PWA manifest |
| `downloads/barakahflow.apk` | Signed Android release build |

## Content policy

Site copy tracks the product as it actually stands. Two rules:

- **Nothing unbuilt is advertised.** Planned or partially built features are kept off the site entirely.
- **Known limits are stated, not glossed.** Where the app can't do something (it doesn't screen tickers for Sharia compliance, it can't yet detect a mid-year nisab dip), the site either says so or stays silent — it never implies otherwise.

Public calculator pages and their promotion are hidden. Their eleven generated HTML files have been removed, sitemap entries removed, and `scripts/build-zakat-pages.js` retired as a no-op. Old URLs return 404; Vercel adds `X-Robots-Tag: noindex, nofollow`. Historical source data is retained for a deliberate future relaunch. The app's calculation functionality is unchanged.

## Features

- **App branding**: Montserrat, emerald accents, slate surfaces, quiet 14px panels and light/dark themes. Fonts are self-hosted copies of the app's existing files.
- **Barakah Cards**: Essential, Emerald, Midnight Gold and Pearl Platinum, with current earning rules and Arabic artwork. No payment-card, streak, private Wallet demo or prototype promises.
- **Brand artwork**: the responsive hero brings the social composition onto the page with live, accessible typography, overlapping Emerald/Midnight Gold cards and softer material shadows. Retina displays use native 1400px exports; smaller displays reuse the lighter 900px files. The dashboard appears in the first Summary feature tab. All standalone artwork omits cash figures.
- **Card switching**: decoded finishes dissolve over 400ms with the existing ease-in-out token, without translation or a brightness dip. Rapid choices retain the current blend until prior layers finish; reduced motion switches immediately. The writing preview and its assets have been removed; earned-card writing remains in the app.
- **Closing card**: Pearl Platinum follows desktop pointer movement with bounded 3D tilt. Phone motion is opt-in, requests sensor permission where required, calibrates to the starting position and suspends offscreen or when reduced motion is enabled. The scroll entrance and interactive tilt use separate layers. No sensor readings are stored or sent anywhere.
- **Current features**: manual records/Quick Spend, account balances, category budgets, recurring bills, savings goals, multiple currencies and guided check-ins.
- **Platform clarity**: browser and Android APK links; iPhone Safari Home Screen instructions, with no App Store claim or automatic install popup.
- **SEO**: preserved canonical and verification, new 1200×630 social artwork, `WebSite`, `Organization`, `SoftwareApplication` and visible-FAQ-matched `FAQPage` schema. The unsupported site-search schema was removed.
- **Analytics**: page visits, APK downloads and web-app launches posted to the app's own analytics endpoint.

## Tech stack

- **Frontend**: semantic HTML5, vanilla CSS3 (custom properties), no build step.
- **Icons**: local inline SVG symbols, following the app's outlined icon style; no icon CDN.
- **Motion**: 550ms first entry with 50ms stagger, 500ms one-off section entry, 400ms card-finish dissolves, 220ms feature previews, 160ms button feedback and a native scroll-timeline card entrance with static fallback. Reduced motion removes movement; keyboard tab changes are immediate. Native scrolling is preserved.

## Implementation audit — 31 October 2026

Compared the public homepage with the app's active `BarakahCard.tsx`, `card-data.ts`, `CardProgressSummary.tsx`, dashboard, `DashboardCard.module.css`, Quick Spend, budget and savings components and current onboarding. Product reference was the app itself, not a new visual direction. The separate clean-card concept remains a preview and is deliberately not advertised as shipped.

Card images were rendered from the active React component's `presentation="artwork"` mode in isolated Chrome and exported to small WebP files. The separate `emerald-balance.webp` dashboard image uses an illustrative AED 18,450. The hero and share image reuse these exact Arabic outlines and finishes. The refined 1200×630 share image is downsampled from a 2× native rendering. Dashboard and feature compositions are HTML previews, not authenticated screenshots. No production data, financial writes or auth changes were used. Regenerate assets deliberately when the active renderer changes; older Wallet PNGs retain historical edition labels.

The old calculator-led sections, repeated scholarly descriptions, dated screenshots, unsupported demo claims, automatic install popup, remote font requests and unpinned icon library were removed from the landing page. Legal content and the APK/checksum are preserved. The website remains buildless with no new framework or animation dependency.

## Local checks and preview

```sh
node scripts/preview.mjs
node scripts/check-site.mjs
node scripts/test-browser.mjs
node scripts/render-brand-artwork.mjs
```

Preview defaults to `http://127.0.0.1:3001`. Static checks use only Node. Browser checks reuse installed Chrome, Playwright and axe-core from the parent app/dev environment; set `PLAYWRIGHT_RUNTIME_PACKAGE` if the available Playwright runtime is elsewhere. These are development tools, not website dependencies. No app build is required.

Browser checks cover 320/390/768/1024/1440px in both themes, zero automated WCAG AA violations, overflow, keyboard tabs, FAQ, accurate edition requirements, rapid switching, failed-image retry, theme persistence, blocked storage, reduced motion, 200% text and core content without JavaScript. Static checks cover assets/anchors, schema/FAQ parity, legal links and 33 variants of retired calculator URLs. External app onboarding and APK installation are outside the landing-page checks.

Closing-card checks cover desktop pointer/reset, phone sensor opt-in, granted/denied/rejected permission, calibration, tilt limits, offscreen suspension, unsupported sensors and dynamic reduced motion. Phone sensor events are simulated in Chrome; physical-device feel still needs a real phone. Permission handling follows the [Device Orientation specification](https://www.w3.org/TR/orientation-event/).

Additional checks cover removal of the writing controls, a visible card-dissolve midpoint, cleanup after rapid switching and the Summary feature tab. The artwork export command rebuilds the social image from existing local assets, fonts and development tools; it is not a hosting build step.

Evidence is written to the parent checkout's ignored `output/website-refresh` directory, configurable with `WEBSITE_EVIDENCE_DIR`. The initial independent visual polish review and isolated local UX walkthrough led to larger narrow-screen edition labels and an earlier in-app-card explanation. A follow-up visual review on 1 November found no material defects in the new hero and social artwork. The implementing agent checked the card dissolves in real Chrome, including interruption and cleanup; no physical-device performance claim is made.

## Deployment

Current Android download: **1.1.0 (version code 3)**, published 27 October 2026. The signed release adds calm native haptics and a device-local preference. It uses the same application ID and signing certificate as 1.0.1, so existing installations can be updated without clearing device data. The checksum is published at `downloads/barakahflow.apk.sha256`.

Static site — 1-click deployment to **Vercel** or **GitHub Pages**. No build required; edit and push.

## License

Built with Barakah. All rights reserved.
