# Weekly guide decision, 2026-10-27 Asia/Shanghai

Active Radar: layered-wood-wall-art, generatedFor 2026-10-26, week started 2026-10-26. Seven current main/live guides reviewed by title, sections, product and core decision; newest 3d-printer-hourly-cost (2026-10-23). No guide published in current Shanghai week. No existing article targets packed-size shipping decisions for layered wall art.

Considered: generic wood-art pricing (overlaps pricing series); plywood nesting/yield (overlaps leather sheet allocation, insufficient current material source); shipping wall art (selected: distinct fulfillment intent, current Radar match, three verified carrier primary sources, original USD sensitivity).

Title: Ship Laser-Cut Wall Art: U.S. Packaging & Cost Guide.
Search intent: how to ship laser cut wall art; dimensional weight; shipping cost in product contribution. No search-volume/ranking/earnings claims or live postage quote.
Core decision: build and measure a safely packed prototype before offering a larger SKU. Do not reduce protection to cross a billing threshold. USPS Priority Mail threshold is service-specific; UPS Daily uses a different comparison. Use actual origin/destination/account/date quotes, separate actual vs DIM vs billed USD.

Implementation: additive EN/ZH guide data, unique existing layered-wood image, existing typed reader/metadata/sitemap/llms/home shelf auto-discovery, generic count test 7 -> 8 only. Read installed Next 16.3.1 generateMetadata/generateStaticParams docs before editing. Original dirty root protected. Use isolated codex branch.

Primary sources checked 2026-10-27: USPS Priority Mail (1,728 cubic inches, divisor139); UPS dimensions (Daily139/Retail166); USPS domestic packaging (cushioning, accurate packed measurements). FAQ generic page has differing rounding wording: avoid relying on it; examples exact whole-inch exterior dimensions and service-specific quote confirmation. Dollar costs and package examples entirely assumed; no scraped seller demand or supplier quote.

Verification: existing tests, lint, typecheck, build, build:pages; EN/ZH at320/390/1440, Article language, self-canonical/OG, no body overflow/broken images, source attribution. PR/CI merge, deploy, official domain readback, final URL. Health diagnosis kept separate; existing radar-article-language fingerprint unchanged, no automatic repair.

## Acceptance before PR

- HTTP health: 13 official URLs returned200; generatedFor2026-10-26 is one day behind at01:10, normal before daily Radar deployment. Seven existing guides self-canonical, English initial HTML. Twenty390px language checks: no body overflow. All28 homepage images decode after explicitly loading lazy images; initial off-screen decode attempts were not counted as broken images. Twenty unique source/brand links preserve Elian; OneLaser all five attribution fields present.
- Known radar-article-language mismatch remains unchanged; diagnosed only, no health code repair.
- New bilingual article and home/Learn discovery checked at320,390,1440:18 browser cases passed, no broken images or body overflow. Article headlines/abstract/language match visible English/Chinese; existing canonical/OG machinery includes the new article. Card image unique across all8guides.
- Original arithmetic verified independently:13.6966667 contribution (13.70display),15.4% of89;30postage→1.70,additional3packaging→−1.30. Every amount, machine rate, payment rate, package dimension and actual weight in examples is explicitly assumed. Carrier postage rates not claimed.
-31test files:128passed,17skipped; lint, typecheck,productionbuildandPagesbuildpassed. Sourceschecked2026-10-27. DMM123.1.3.2 independently confirms current139divisor and whole-pound ceiling; genericFAQroundingwording excluded.
- No native binary changes. New guide is available through the App’s live H5 Learn/Home surfaces after content deployment.
