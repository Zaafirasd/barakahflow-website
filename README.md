# BarakahFlow Landing Page

Marketing site for **BarakahFlow** — a halal personal finance app for Muslims, built around a Zakat engine that follows the user's school of jurisprudence. The app itself lives at [app.barakahflowapp.com](https://app.barakahflowapp.com) and runs on web, Android and iPhone.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing page — hero, Zakat engine, nisab & Hawl, accuracy detail, features, reminders, currencies, download, FAQ |
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

Fiqh claims on the page — nisab weights, preset authorities, the 2.577% solar uplift, debt treatment — are drawn from the product overview document and verified against the app source before publishing.

## Features

- **Premium design**: centered typography with a glassmorphic aesthetic, light and dark themes.
- **PWA support**: smart install prompt for iOS users, plus a standardized `manifest.json`.
- **SEO**: canonical URLs, Open Graph and Twitter cards, and JSON-LD covering `WebSite`, `Organization`, `SoftwareApplication` and `FAQPage`.
- **Analytics**: page visits, APK downloads and web-app launches posted to the app's own analytics endpoint.

## Tech stack

- **Frontend**: semantic HTML5, vanilla CSS3 (custom properties), no build step.
- **Icons**: Lucide Icons (via CDN).
- **Fonts**: Montserrat (Google Fonts).

## Deployment

Static site — 1-click deployment to **Vercel** or **GitHub Pages**. No build required; edit and push.

## License

Built with Barakah. All rights reserved.
