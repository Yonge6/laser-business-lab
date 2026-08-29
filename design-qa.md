# Maker Business Lab — Design QA

## Scope

- Wider opportunity-card product imagery.
- A clearer selection-to-result relationship below the carousel.
- Heat Press / 热压转印 as a complete opportunity, ROI, and equipment-matching path.
- Opportunity cards ranked by opportunity score from highest to lowest.
- A selection pointer that tracks the active carousel card.

## Visual evidence

- Source before card-width change: `qa/card-image-width-source.png`
- Desktop card implementation: `qa/card-image-width-implementation.png`
- Normalized side-by-side comparison: `qa/card-image-width-comparison.png`
- Mobile card implementation: `qa/card-image-width-mobile.png`
- Selected heat-press opportunity: `qa/heat-press-opportunity-selected.png`
- Redesigned desktop result panel: `qa/selection-result-redesign.png`
- Focused desktop result state: `qa/selection-result-redesign-panel.png`
- Redesigned mobile result panel: `qa/selection-result-redesign-mobile.png`
- Mobile result details: `qa/selection-result-redesign-mobile-detail.png`
- Pointer source annotation: `qa/opportunity-pointer-source.png`
- Dynamic pointer implementation: `qa/opportunity-pointer-dynamic.png`
- Pointer source/implementation comparison: `qa/opportunity-pointer-comparison.png`

Desktop evidence uses a 1842 × 1225 CSS viewport at DPR 1. Mobile evidence uses a 390 × 844 CSS viewport at DPR 1. The card comparison normalizes source and implementation to the same route, locale, carousel position, and active-card state.

The latest pointer implementation was captured at a 1280 × 720 CSS viewport at DPR 1. Its 1280 × 720 implementation capture and the 2782 × 966 annotated source were normalized to a shared 711 px comparison height; the focused comparison is 3328 × 711.

## Findings and decisions

- No actionable P0, P1, or P2 visual findings remain.
- Desktop opportunity cards now use a 640 × 400 frame with an exact 400 × 400 square product image and a separate 240 px information rail. This makes the product materially larger without clipping titles, scores, or price metrics. Tablet uses a 58% image share; mobile remains 44% to protect the narrow information column.
- The former nested red-outline treatment made the selected result feel like two separate tables. It is replaced by one black task header, a red active-rank rail, and one continuous white-to-soft-paper surface.
- The annotated red line and the first fixed-center triangle did not identify the actual selected card. The final connector is a compact black circular down-arrow from the existing icon library. Its horizontal position is measured from the active card and updated on selection, carousel scroll, and resize.
- The result header exposes the active rank and total catalog count. Changing a card updates the rank, business estimate, CTA, and marketplace evidence together through one live region.
- The new heat-press card uses a purpose-built portrait product asset that fills the existing crop cleanly. Heat press has distinct bilingual labels, products, ROI inputs, machine paths, and an external reference link rather than inheriting laser wording.
- Desktop and mobile carousel controls remain visible and usable. The mobile result stack has no page-level horizontal overflow and preserves the visual connection to the card above.
- Brand red `#e7310e`, ink, paper, condensed display typography, sharp corners, clipped ranks, and game-task language remain consistent with the established visual system.

## Functional evidence

- Home DOM exposes seven opportunities and the selection-result live region.
- Featured opportunities render in descending score order `82, 79, 78, 77, 76, 74, 73`, with matching ranks `#01–#07`.
- Selecting the second card moves the pointer from the first card center to the second card center and updates the result to `#02`.
- Selecting the heat-press tote updates its ROI link to `product=heat-press-tote-bags` and its Etsy market case.
- Heat-press ROI opens with the correct method title, products, and seeded economics.
- Equipment matching accepts heat press as a manufacturing method and completes all six steps.
- The matched growth/multi-process result is “模块化自动热压方案” and includes the xTool WonderPress official reference URL.

## Final result

passed

---

# Product Library Design QA

## Source truth

- Live reference: `https://yonge6.github.io/onelaser-homepage/?v=24c6e1a`
- Reference gallery: `qa/product-design-audit-gallery/18-reference-gallery-same-viewport.png`
- Reference project detail: `qa/product-design-audit-gallery/20-reference-detail-same-viewport.png`
- Source asset set: 42 original finished-project images copied without recomposition.

## Implementation

- Home module: `components/marketing/project-library.tsx`
- Full catalog: `/projects/`
- Static project plans: `/projects/[slug]/`
- Same-view gallery capture: `qa/product-design-audit-gallery/19-implementation-gallery-same-viewport.png`
- Same-view detail capture: `qa/product-design-audit-gallery/21-implementation-detail-same-viewport.png`
- Mobile grid: `qa/product-design-audit-gallery/06-implementation-mobile-project-library.png`
- Mobile dialog: `qa/product-design-audit-gallery/16-project-modal-mobile.png`
- Mobile project page: `qa/product-design-audit-gallery/17-project-detail-mobile.png`

## Viewports and comparison inputs

- Desktop comparison viewport: 1280 x 720 CSS px at 1x density.
- Mobile verification viewport: 390 x 844 CSS px at 1x density.
- Full gallery comparison: `qa/product-design-audit-gallery/22-comparison-gallery-same-viewport.png`.
- Focused detail comparison: `qa/product-design-audit-gallery/23-comparison-detail-same-viewport.png`.
- Both comparison images place the live source on the left and the implementation on the right with no rescaling between sides.

## State and interaction coverage

- Default `All` filter, `Wood` filtering, 42-project count, and local images verified.
- Project cards open the correct dialog and update the selected project's economics and equipment.
- Escape closes the dialog; focus is trapped while open and returned to the trigger on cleanup.
- Dialog previous/next controls, backdrop close, calculator CTA, project guide CTA, and tracked equipment CTA are implemented.
- Mobile grid, mobile dialog scrolling, and mobile static project page were inspected.
- Browser console: no warnings or errors on the homepage, catalog, dialog, or detail route.

## Visual findings

- P0: none.
- P1: none.
- P2: none.
- The finished-project imagery, material filters, browsing density, and project-detail hierarchy match the source experience while using Maker Business Lab's established red, black, square-corner, condensed-display system.
- The implementation adds explicit planning boundaries and avoids presenting gross-profit estimates as guaranteed earnings.

## Comparison history

1. First implementation preserved all 42 source images and added a 12-card home preview plus a complete library route.
2. Desktop and mobile review confirmed the grid, modal, and detail pages remain usable at the tested viewports.
3. Same-viewport gallery and detail comparisons confirmed no visible regressions requiring another iteration.

final result: passed

---

# Mobile App Home Design QA

## Source and target

- Selected mobile concept: `qa/mobile-app-home/reference.png`.
- Implementation capture: `qa/mobile-app-home/implementation-390x844.png`.
- Same-viewport combined comparison: `qa/mobile-app-home/reference-vs-implementation.png`.
- Verification viewport: 390 x 844 CSS px at DPR 2.

## Findings

- P0: none.
- P1: none.
- P2: none.
- The mobile home now uses the selected three-line mission hierarchy, compact money-first signal card, persistent five-item app navigation, and the established ivory, ink, and `#e7310e` visual system.
- The implementation uses the live Radar opportunity and economics instead of duplicating fixed mock values. It keeps the reference's visual density while exposing a real opportunity score, selling price, gross profit, margin boundary, and a functioning opportunity CTA.
- The signal card was compressed after the first comparison so the primary CTA and Discover-to-Sell path remain visible in the first phone viewport.
- The header language toggle, opportunity save state, Saved route, bottom navigation, and full-opportunity link were exercised at the target viewport.
- Desktop verification at the default 1280 px browser width confirmed the original homepage remains active and the mobile app shell stays hidden.
- Browser console: no errors.

## Build and installability

- The PWA manifest now declares standalone portrait presentation and 192 px, 512 px, and maskable icons.
- A dedicated Apple touch icon is available through the App Router metadata convention.
- Safe-area padding is applied to the sticky header and fixed bottom navigation for iPhone display cutouts and home indicators.
- The Saved page is device-local and intentionally marked `noindex`.

## Functional and build evidence

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: 19 files and 82 tests passed.
- `pnpm build:pages`: passed; 95 static pages generated, including `/saved`, `/manifest.webmanifest`, and `/apple-icon.png`.

final result: passed

---

# Project Library Image Scrim Design QA

## Source truth

- User annotation: replace the solid black lower-half treatment on project cards and the opened project image with a gradual darkening treatment.
- Production card baseline: `qa/product-design-audit-gallery/gradient-update/source-card-1280x720.png`.
- Production dialog baseline: `qa/product-design-audit-gallery/gradient-update/source-dialog-1280x720.png`.

## Implementation evidence

- Desktop cards: `qa/product-design-audit-gallery/gradient-update/implementation-card-desktop.png` at 1373 x 1179 CSS px, DPR 1.
- Same-viewport cards: `qa/product-design-audit-gallery/gradient-update/implementation-card-1280x720.png` at 1280 x 720 CSS px, DPR 1.
- Desktop dialog: `qa/product-design-audit-gallery/gradient-update/implementation-dialog-desktop.png` at 1373 x 1179 CSS px, DPR 1.
- Same-viewport dialog: `qa/product-design-audit-gallery/gradient-update/implementation-dialog-1280x720.png` at 1280 x 720 CSS px, DPR 1.
- Mobile cards: `qa/product-design-audit-gallery/gradient-update/implementation-card-mobile.png` at 390 x 844 CSS px, DPR 1.
- Mobile dialog: `qa/product-design-audit-gallery/gradient-update/implementation-dialog-mobile.png` at 390 x 844 CSS px, DPR 1.

## Combined comparison inputs

- Card before/after: `qa/product-design-audit-gallery/gradient-update/comparison-card-solid-vs-gradient.png`.
- Dialog before/after: `qa/product-design-audit-gallery/gradient-update/comparison-dialog-solid-vs-gradient.png`.
- Both comparisons use 1280 x 720 source and implementation captures at DPR 1, aligned without density scaling.

## Findings

- P0: none.
- P1: none.
- P2: none.
- Cards now preserve the product image through the middle of the frame and darken continuously toward the title baseline; the former hard horizontal black edge is gone.
- The opened image uses the same transparent-to-dark direction with a longer falloff, so the product remains visible while the material label retains sufficient contrast.
- Display font, title sizing, spacing, brand red, image crops, card geometry, copy, controls, and hover behavior are unchanged.
- Desktop and mobile titles remain legible across the light serving-board image, pale acrylic imagery, dark metal and glass imagery, and detailed leather/wood scenes.

## Functional evidence

- The 12-card home preview still renders and opens the selected project dialog.
- Dialog close, previous/next navigation, focus behavior, and mobile scrolling remain functional.
- Browser console produced no warnings or errors.
- `pnpm typecheck`, `pnpm lint`, and all 80 tests passed.

## Comparison history

1. Baseline used a solid `rgba(0, 0, 0, .76)` card block beginning at 52% and a solid `.68` dialog block beginning at 72%.
2. The card scrim was changed to a four-stop gradient beginning transparent at 30% and reaching `.9` only at the bottom edge.
3. The dialog scrim was changed to a four-stop gradient beginning transparent at 44% and reaching `.82` only at the bottom edge.
4. Same-viewport comparisons and mobile captures found no remaining P0/P1/P2 visual issues.

final result: passed
