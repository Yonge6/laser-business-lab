# Maker Business Lab — Design QA

## Scope

- Wider opportunity-card product imagery.
- A clearer selection-to-result relationship below the carousel.
- Heat Press / 热压转印 as a complete opportunity, ROI, and equipment-matching path.

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

Desktop evidence uses a 1842 × 1225 CSS viewport at DPR 1. Mobile evidence uses a 390 × 844 CSS viewport at DPR 1. The card comparison normalizes source and implementation to the same route, locale, carousel position, and active-card state.

## Findings and decisions

- No actionable P0, P1, or P2 visual findings remain.
- Desktop opportunity cards now use a 640 × 400 frame with an exact 400 × 400 square product image and a separate 240 px information rail. This makes the product materially larger without clipping titles, scores, or price metrics. Tablet uses a 58% image share; mobile remains 44% to protect the narrow information column.
- The former nested red-outline treatment made the selected result feel like two separate tables. It is replaced by one black task header, a red active-rank rail, one continuous white-to-soft-paper surface, and a centered red connector from the selected-card area.
- The result header exposes the active rank and total catalog count. Changing a card updates the rank, business estimate, CTA, and marketplace evidence together through one live region.
- The new heat-press card uses a purpose-built portrait product asset that fills the existing crop cleanly. Heat press has distinct bilingual labels, products, ROI inputs, machine paths, and an external reference link rather than inheriting laser wording.
- Desktop and mobile carousel controls remain visible and usable. The mobile result stack has no page-level horizontal overflow and preserves the visual connection to the card above.
- Brand red `#e7310e`, ink, paper, condensed display typography, sharp corners, clipped ranks, and game-task language remain consistent with the established visual system.

## Functional evidence

- Home DOM exposes seven opportunities and the selection-result live region.
- Selecting the heat-press tote updates its ROI link to `product=heat-press-tote-bags` and its Etsy market case.
- Heat-press ROI opens with the correct method title, products, and seeded economics.
- Equipment matching accepts heat press as a manufacturing method and completes all six steps.
- The matched growth/multi-process result is “模块化自动热压方案” and includes the xTool WonderPress official reference URL.

## Final result

passed
