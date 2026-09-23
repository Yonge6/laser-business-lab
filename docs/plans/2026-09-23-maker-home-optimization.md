# Maker homepage optimization

Goal: help visitors choose a product and test its economics immediately, preserving the red-and-black visual identity and existing bilingual tools.

Architecture: keep the current static Next.js export and opportunity model. Move primary actions into the hero, follow with product selection, then show the daily Radar briefing. Use a small accessible SVG on a fixed 0–100 scale for the homepage radar. Keep originals and serve compressed copies of opportunity images.

Scope:
- `components/marketing/home-experience.tsx`: bilingual action-first hero, cost boundaries and dated market evidence, lower daily briefing.
- `components/marketing/opportunity-card.tsx`: distinguish assumed price and price less materials.
- `components/marketing/opportunity-radar.tsx`: remove homepage chart-library dependency and auto-scaling, expose actual scores to assistive technology.
- `components/marketing/site-header.tsx`: descriptive primary action.
- `app/globals.css`: responsive hero actions and compact mobile hierarchy.
- `lib/opportunities/data.ts`, `public/images/opportunities/`: optimized image derivatives; retain originals.
- `lib/analytics/events.ts`: measure hero CTA clicks separately from tool starts.

Validation: existing tests, typecheck, lint, production static build; browser checks for both languages at 320, 390, 768 and desktop widths; carousel selection and product-specific calculator entry; public readback after deployment. Preserve the latest daily operations state from main.

Isolation: work on `codex/maker-home-optimization-20260923` from current origin/main. Preserve the original checkout and its uncommitted iOS/assets work; carry forward only its previously prepared trust-copy patch.

Observed results:
- Existing suite: 23 files / 94 tests passed. Typecheck and lint passed; static build generated 120 pages.
- Seven opportunity image derivatives: 10,270,717 bytes -> 946,322 bytes (90.8% reduction); original files retained.
- Product selection updates the evidence and SVG scores; selecting leather patches routes to `?product=laser-leather-patches` and initializes the calculator at $9.10 per product.
- Resize testing exposed a transient overflow from the animated selection pointer. Clamp its CSS position to the result panel and remove the left-position transition so resizing cannot temporarily widen the mobile viewport.
