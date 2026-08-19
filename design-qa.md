# Laser Business Lab — Design QA

## Comparison target

- Source visual truth: `/Users/yongyuan/.codex/generated_images/01a01804-062d-7b20-9a41-d043be4efa1a/exec-b22f6067-be1c-421d-b6e4-f15501212e1f.png`
- Browser-rendered implementation: `/Users/yongyuan/Documents/ChatGPT/Laser Business Lab/qa/home-desktop-viewport-final.png`
- Combined comparison input: `/Users/yongyuan/Documents/ChatGPT/Laser Business Lab/qa/home-comparison-final.png`
- Local implementation: `http://localhost:4173/`
- Route and state: home page, English default, first opportunity active, light theme, unauthenticated

## Viewport and normalization

- Source pixels: 1435 × 1096.
- Implementation pixels: 1434 × 1101 at CSS viewport 1434 × 1101 and device pixel ratio 1.
- Normalization: both images were normalized to 1435 × 1096 and placed in a single 2886 × 1096 side-by-side comparison image with a 16 px neutral gutter.
- Responsive evidence: `/Users/yongyuan/Documents/ChatGPT/Laser Business Lab/qa/home-mobile-final.png`, CSS viewport 390 × 844, device pixel ratio 1, document scroll width 390 px.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Typography: the condensed italic display hierarchy, optical weights, uppercase labels, wrapping, score numerals, and supporting sans text are faithful to the source. The implementation deliberately retains a compact functional navigation above the visual target.
- Spacing and layout rhythm: the desktop hero/radar split, three-card race grid, slanted card masks, tool CTAs, and game-path strip preserve the source hierarchy. Mobile reflows to a single-column quest while keeping horizontal overflow at zero.
- Colors and visual tokens: the primary brand token is exactly `#E7310E`; warm paper, ink black, gray rules, active red, and muted states match the reference balance and maintain readable contrast.
- Image quality and asset fidelity: the three product images are dedicated high-resolution assets with subject-specific crops. The header lockup and racing stripe use source-derived raster assets rather than code-native logo approximations.
- Copy and content: the English reference message is preserved, with product intelligence expanded to Maker and 3D-printing use cases. Chinese is a complete user-selectable locale while English remains the default.
- P3 follow-up only: the source uses a larger purely editorial logo/hero and fewer navigation controls. The implementation uses slightly denser proportions so persistent navigation and real product interactions fit above the fold.

## Focused-region evidence

The 2886 px-wide original-density combined comparison keeps the header/hero, radar, all three product-card images and metrics, and game-path labels readable in one input. No additional crop was needed. The separate mobile capture verifies the breakpoint, header controls, hero wrapping, CTA stacking, and absence of horizontal page overflow.

## Comparison history

### Iteration 1

- Evidence: `/Users/yongyuan/Documents/ChatGPT/Laser Business Lab/qa/home-comparison-v1.png`
- Finding: P2 asset-fidelity drift in the header. The first implementation used a library asterisk as the logo mark and a CSS-only red accent instead of the selected racing lockup.
- Fix: replaced the code-native header mark and CSS-only top accent with source-derived `brand-lockup.png` and `racing-header-stripe.png`, then blended them into the paper surface. Kept Phosphor icons only for standard interface actions.

### Iteration 2

- Evidence: `/Users/yongyuan/Documents/ChatGPT/Laser Business Lab/qa/home-comparison-final.png`
- Post-fix result: the selected brand lockup, black/red racing stripe, opportunity radar, product imagery, slanted score cards, and game-path composition are visibly aligned. No actionable P0/P1/P2 differences remain.

## Primary interactions tested

- Opportunity cards update the active card and radar state.
- EN / 中文 toggle updates all visible content and the document language; English is the default.
- Five-step Opportunity Finder completes and returns a ranked laser + 3D-printing path.
- Four-step ROI calculator completes and renders margin, annual profit, capacity, and payback.
- Tumbler calculator renders current and 3×-speed scenarios.
- Five-step Machine Finder completes with best and alternative OneLaser matches.
- Tracked `/go/vertigo` route returns HTTP 302 and preserves UTM parameters.
- Lead and analytics endpoints accept valid requests without requiring Supabase configuration.
- Browser console errors/warnings checked after final render: none.

## Implementation checklist

- [x] Match the selected red/black/cream racing direction.
- [x] Use exact brand red `#E7310E`.
- [x] Preserve English default and full Chinese toggle.
- [x] Include real Maker opportunity decisions for laser and 3D printing.
- [x] Verify desktop, mobile, core conversion flows, APIs, redirect tracking, and console.

## Final result

passed
