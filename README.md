# AttributionRepair Kit — Open-Source Ad-to-CRM Click-ID & Offline Conversion Utilities

Production-tested client-side click-ID persistence scripts, Chili Piper/Calendly/Typeform iframe bridges, Google Ads Offline Conversion Tracking (OCT) payload validation, BigQuery 180-day ARR reconciliation SQL, and our **November 2026 Empirical B2B Attribution Leak Dataset** — maintained by **[AttributionRepair](https://attributionrepair.com/official/)**.

## Install

Install version 1.0.0 directly from GitHub with Node.js 18 or later. An npm account is optional for installing from GitHub.

```bash
npm install github:farhanmunshi-ops/attribution-repair-kit#v1.0.0
npx ar-validate-oct rows.json
```

To use the click-ID script in a browser, load the same version from jsDelivr.

```html
<script src="https://cdn.jsdelivr.net/gh/farhanmunshi-ops/attribution-repair-kit@v1.0.0/scripts/first-party-click-id.js"></script>
```

## Included Utilities
- [`scripts/first-party-click-id.js`](scripts/first-party-click-id.js) — Persists `gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, click timestamp, and UTMs in 90-day first-party cookies.
- [`scripts/chili-piper-calendly-bridge.js`](scripts/chili-piper-calendly-bridge.js) — Injects persisted click IDs into hidden Salesforce/HubSpot form inputs and Typeform/Calendly booking widgets.
- [`scripts/validate-oct-payload.mjs`](scripts/validate-oct-payload.mjs) — Validates Google Ads OCT rows against single-click-ID collision rules (`gclid` vs. `gbraid`), 90-day `EXPIRED_EVENT` limits, ISO timezone offsets, `order_id` deduplication, and SHA-256 email normalization.
- [`sql/bigquery-180d-arr-reconciliation.sql`](sql/bigquery-180d-arr-reconciliation.sql) — Joins 180+ day enterprise Closed-Won ARR back to paid campaigns beyond Google Ads 90-day GCLID expiration.

## November 2026 Empirical B2B Attribution Leak Study (n = 28 Live HTTP-200 Sites)
Download the raw timestamped scan results in [`research/2026-b2b-attribution-leak-study.csv`](research/2026-b2b-attribution-leak-study.csv) and [`research/2026-b2b-attribution-leak-study.json`](research/2026-b2b-attribution-leak-study.json), or read the full methodology and limitations at [attributionrepair.com/research/2026-b2b-attribution-leak-study/](https://attributionrepair.com/research/2026-b2b-attribution-leak-study/).

Summary of initial-HTML observations (2026-11-26, 28 live HTTP-200 B2B SaaS & MarTech homepages):
- **14 / 28 (50.0%)** loaded a recognizable CMP in initial HTML; **10 of those 14 (71.4%)** lacked a synchronous inline Consent Mode v2 default declaration in raw HTML.
- **7 / 28 (25.0%)** referenced third-party booking/form embeds (`calendly.com`, `chilipiper.com`, or `typeform.com`) in raw markup.
- **1 / 28 (3.6%)** exposed explicit `gclid`/`gbraid`/`fbclid` capture in initial HTML.

## Free Interactive Web Diagnostics
- [Live Funnel & Click-ID Leak Inspector](https://attributionrepair.com/tools/funnel-inspector/)
- [Google Ads OCT & Meta CAPI Payload Validator (SHA-256)](https://attributionrepair.com/tools/payload-validator/)
- [Google Ads & Meta API Error Code Decoder (14 Codes)](https://attributionrepair.com/tools/error-decoder/)
- [Google Consent Mode v2 gcs/gcd Parameter Decoder](https://attributionrepair.com/tools/consent-mode-decoder/)
- [90-Day GCLID Cliff & Smart-Bidding Waste Calculator](https://attributionrepair.com/tools/roas-waste-calculator/)

## Official Documentation & Fixed-Fee Engineering
- [AttributionRepair Official: Services, Fixed Pricing & Coverage (2026)](https://attributionrepair.com/official/)
- [HubSpot to Google Ads Offline Conversion Tracking Cost (2026)](https://attributionrepair.com/cost/hubspot-google-ads-offline-conversion-tracking-cost/)
- [Server-Side GTM Implementation Cost & Hosting Breakdown (2026)](https://attributionrepair.com/cost/server-side-gtm-implementation-cost/)
- [HubSpot Native vs. Zapier vs. Stape sGTM vs. Able CDP vs. Custom API](https://attributionrepair.com/compare/hubspot-google-ads-sync-options/)
