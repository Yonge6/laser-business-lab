# Laser Business Lab MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-quality, measurable Laser Business Lab MVP that turns business inputs into credible profit calculations and transparent machine recommendations.

**Architecture:** A Next.js App Router application keeps calculators and recommendation rules as framework-independent TypeScript modules. Client pages provide immediate interaction while route handlers own persistence, report capture, and tracked redirects; optional Supabase, GA4, and PostHog integrations activate through environment variables.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules/global tokens, Supabase REST, GA4, PostHog, Vitest

---

### Task 1: Project foundation and design system

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`
- Create: `components/marketing/site-header.tsx`, `components/marketing/site-footer.tsx`

**Steps:**
1. Add Next.js/TypeScript/test dependencies and strict configuration.
2. Implement typography, color, spacing, control, focus, and responsive tokens.
3. Create the global navigation, attribution bootstrap, analytics providers, and footer disclosure.
4. Run `npm run typecheck`; expect zero TypeScript errors.

### Task 2: Pure business engines with tests

**Files:**
- Create: `lib/calculators/roi.ts`, `lib/calculators/tumbler.ts`
- Create: `lib/machines/data.ts`, `lib/recommendation/engine.ts`
- Test: `tests/calculators.test.ts`, `tests/recommendation.test.ts`

**Steps:**
1. Write tests for normal, zero-margin, clamped-input, capacity, and faster-workflow cases.
2. Implement typed calculations with safe finite outputs and honest labels.
3. Write deterministic scoring tests for drinkware, fine-detail, large-format, budget, and fallback scenarios.
4. Implement configurable machine data and reason-producing scoring rules.
5. Run `npm test`; expect all engine tests to pass.

### Task 3: Marketing pages and calculator experiences

**Files:**
- Create: `app/page.tsx`, `app/calculator/page.tsx`
- Create: `app/calculator/laser-roi/page.tsx`, `app/calculator/tumbler-profit/page.tsx`, `app/calculator/machine-finder/page.tsx`
- Create: `components/calculator/*`, `components/results/*`, `components/marketing/*`

**Steps:**
1. Build the money-first homepage with a live business report preview and three tool entry points.
2. Build the four-step ROI flow with live preview, validation, result report, email prompt, and share link.
3. Build the tumbler calculator with current versus 3× capacity scenarios and an explicit estimate disclaimer.
4. Build the five-question finder with multi-select limits, recommendation reasons, alternative, and tracked CTA.
5. Verify keyboard behavior and responsive layouts at 375px, 390px, 430px, and desktop.

### Task 4: Attribution, analytics, persistence, and outbound tracking

**Files:**
- Create: `lib/attribution/*`, `lib/analytics/*`, `lib/supabase/server.ts`, `supabase/schema.sql`
- Create: `app/api/events/route.ts`, `app/api/leads/route.ts`, `app/go/[machine]/route.ts`
- Test: `tests/attribution.test.ts`, `tests/report.test.ts`

**Steps:**
1. Implement 90-day first-touch/last-touch UTM capture and test source preservation.
2. Implement a single event adapter for internal events, GA4, and PostHog.
3. Add best-effort Supabase REST inserts for sessions, calculator results, finder results, clicks, and leads.
4. Validate machine slugs, record outbound context, preserve original UTMs, append `ref=laserbusinesslab`, and return a 302.
5. Confirm missing optional environment variables never break the user journey.

### Task 5: Share reports, SEO, and legal trust pages

**Files:**
- Create: `lib/reports/codec.ts`, `app/report/[id]/page.tsx`
- Create: `app/about/page.tsx`, `app/privacy/page.tsx`, `app/disclaimer/page.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`

**Steps:**
1. Encode only validated, non-sensitive report fields in URL-safe report IDs and add round-trip tests.
2. Render share reports with canonical/noindex behavior appropriate to generated pages.
3. Add site metadata, OpenGraph/Twitter defaults, software application JSON-LD, sitemap, robots, and manifest.
4. Add relationship disclosure, privacy behavior, and profit/business-advice disclaimer.

### Task 6: Verification and deployment

**Files:**
- Create: `.env.example`, `README.md`
- Modify: any files revealed by QA.

**Steps:**
1. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`; all must pass.
2. Start the production server and verify page/API/302 responses with real requests.
3. Capture and inspect desktop/mobile screenshots for homepage and all three tool result states.
4. Fix visual or functional issues and rerun the full gate.
5. If a deployment target and credentials are locally available, deploy and verify the live URL; otherwise leave exact environment and deployment instructions.
