# Radar schema language repair — 2026-10-28

## Verified problem and scope

The daily health check found the previously reported `radar-article-language` defect: Chinese Radar copy is visible while the server-only Article headline and description remain English and omit `inLanguage`. Dated Radar pages use the same pattern. The health phase was diagnostic only; this repair is authorized by Wednesday SEO/GEO maintenance.

Render a shared Article/Breadcrumb graph inside the existing language-aware `RadarBriefing`. Use the same daily headline and answer as the visible page, localize language/about/breadcrumb fields, and remove duplicate page-level scripts. Preserve archive identity, canonical URL, publication/modification dates, source content, cost assumptions, and operational cadence. Follow the installed Next.js JSON-LD guidance: native script tag with `<` escaped. English remains in the initial static HTML.

## Audit and verification

- DevSSD volume UUID verified. New isolated `codex/maker-radar-schema-20261028` worktree; original dirty root and App review worktree preserved.
- Fourteen required URLs returned200. All8guides have English initial HTML, self-canonicals, language-matched Article data, and home/Learn/sitemap/llms discovery.22mobile language checks at390px found no overflow or broken images.28unique internal destinations returned200; sampled external/OneLaser attribution remains intact.
- Twenty guide source URLs checked. Direct HTTP client restrictions on Etsy, Illinois TLS trust, and Siser handshake were cross-checked against first-party pages through web browsing, rather than labeled broken links. Current Etsy listing/transaction/U.S. payment/Offsite Ads facts, USPS DIM139/1728threshold, UPS139/166divisors, Siser PDF revision09-17-2025/application instructions, Prusa calculator inputs and JPPlus sheet specifications remain consistent. JPPlus dynamic specification HTML still lists `.046` thickness; nominal12×24title remains with undersized usable dimensions in supplier guidance. No unsupported claim of policy change or fresh article date.
- Independently recalculated all8USD examples, including13.70wall-art contribution,0.274printer hourly allocation,5500launch cash,9.48tumbler contribution,11.994successful-print cost,−2.69/28.91acrylic scenarios,75.82patch batch and104.39tote batch. No content changes needed. Editorial search intent differs across startup, product-specific pricing, machine-hour cost and shipping; no ranking/cannibalization metrics inferred.
- Six integration regressions failed on the original code and pass after repair: current + newest/oldest archives, EN/ZH, one Article, exact visible signal, language, preserved dates and archive identity. Full suite:134passed,17skipped. Lint, typecheck, production build and Pages export passed.
- Eighteen browser cases cover current/latest/oldest Radar at320/390/1440, EN/ZH. One matching Article each; localized breadcrumbs, canonical identity, no body overflow and all images decoded. Initial QA harness was corrected for CSS uppercase versus DOM text and emulated-viewport pointer coordinates; the site language control works using real CDP pointer input at the observed button position.

## Release

Merge through PR after CI passes; deploy the exact CI Pages artifact to the official Nginx host under the existing deployment lock with previous-release rollback. Preserve generatedFor2026-10-27 before the scheduled daily update. GitHub Pages deployment success alone is insufficient. Confirm current and dated Radar EN/ZH from the official domain before reporting completion. No App binary, server config or timer change is required.
