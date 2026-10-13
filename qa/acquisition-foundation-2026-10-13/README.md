# Acquisition foundation review — 2026-10-13

Base: `origin/main` at `b68eb8753a678599a986f6f39c3386ab04d76fcf`.
Branch: `codex/pc-acquisition-foundation-20261013`.
Environment: Windows, bundled Node 24.19.0, pnpm 11.19.0, Next 16.3.1.
Read `AGENTS.md` and the installed Next static-export, use-search-params,
Server/Client Component and not-found guides before implementation.

## Changes

- URL product selection has its own null Suspense boundary. The generic ROI
  heading, cost guidance and calculator shell are exported as initial HTML;
  hydration then selects the requested product and its existing defaults.
- The visible guidance explains that production minutes model capacity, not
  paid labor, and links to the complete U.S. Etsy cost example. Formulas remain
  unchanged. Known product changes reset the calculator to that preset; locale
  changes retain the user's current inputs.
- Tumbler usage starts on an actual value edit. Its live-result completion event
  fires once after the first editing burst settles for 750 ms, not on default
  page load. Unmount cancels an outstanding completion timer.
- Navigation events retain a prior campaign on internal links, capture new UTM
  touches, and include source, medium, campaign, content and term. ROI completion
  no longer passes inputs, results or budget. Attribution landing paths exclude
  query/hash data, including legacy stored touches containing report IDs.
- `build:pages` now uses a Node launcher that runs on Windows and Mac/Linux.
- Nginx rules and Mac integration/rollback instructions are provided separately.
  They are not automatically installed on a production server.

## Executed checks

| Check | Result |
| --- | --- |
| `pnpm test`, with local `NGINX_BINARY` | 29 files, 126 tests passed; no skips |
| `pnpm run typecheck` | Passed |
| `pnpm run lint` | Passed |
| `pnpm run build:pages` | Passed; 144 static pages generated |
| Nginx fixture HTTP cases | Known pages/assets 200; missing pages/assets, empty directories and direct 404 document 404 |
| Actual exported ROI HTML | HTTP 200; one H1, form and cost explanation present; own canonical |
| Actual exported missing route | HTTP 404; "Quest not found." and `noindex` present |

## Browser checks against the actual export

Served only on `127.0.0.1:3111` with the new Nginx include, using the local
`out` artifact. No production deployment or external analytics was enabled.

- Desktop: `?product=personalized-tumblers` hydrates to Laser / Personalized
  Tumblers; price `$32`, material `$8.20`, production `4 min` and equipment
  `$3,000` remain the existing preset.
- Entering `$14.32` in Packaging / other cost yields `$9.48` per item; all four
  steps generate the report. This is a synthetic test, not seller earnings.
- `?product=3d-desk-organizers` hydrates to the 3D path, price `$29.99`, material
  `$11.59` and `$18.40` modeled gross profit. English/Chinese switching works.
- At 390×844, ROI and tumbler documents have client/scroll width 375/375
  (the desktop browser reserves 15 px for its scrollbar). The new guide remains
  inside the content width, and the forms stack vertically.
- Tumbler price `$32 → $33` updates per-item output `$25 → $26` immediately.
- Browser error/warning log inspected for the ROI flow: no entries.

Screenshots: [Desktop ROI](roi-desktop.png), [Mobile ROI](roi-mobile.png),
[Mobile tumbler](tumbler-mobile.png), [Missing route](404-desktop.png).

## Mac handoff

Review this branch/PR and rerun the four requested commands on the Mac before
approving. Optional Nginx integration tests require `NGINX_BINARY`; without it,
the two configuration contract tests run and the twelve native HTTP cases are
explicitly skipped. See [static hosting integration](../../docs/deploy/static-hosting.md).

Do not call the live 404 problem fixed until the deployment owner separately
reviews/applies that include and checks real response codes. GA4/Search Console
reporting access, real U.S. traffic, custom-dimension registration and conversion
results were not inspected or claimed. This PC did not merge main, trigger a
deployment workflow, or modify the production host.
