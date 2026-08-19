# Laser Business Lab MVP Design

## Product and conversion model

Laser Business Lab is an independent business-decision product for US makers, Etsy sellers, and small production shops. The product must earn trust before it introduces equipment: every major entry point starts with pricing, margin, capacity, or fit questions and ends with a transparent recommendation. The primary funnel is landing page → useful tool → credible result → optional report capture → tracked OneLaser visit. The interface therefore leads with a live “business receipt” rather than a machine hero, uses plain-English explanations around every estimate, and makes the commercial relationship visible in the footer and About page.

After product review, the MVP also includes a beginner-first Maker Opportunity Finder. It helps users choose what to make before calculating the business case, and its data model supports both laser and 3D-printing opportunities. The commercial loop is now Discover → Validate → Build → Sell; Laser remains the first deep equipment vertical.

The selected visual direction is a refined, gamified opportunity scoreboard: warm paper, ink-black typography, racing-inspired condensed display type, and OneLaser brand red `#E7310E`. Progress, ranking, XP, and unlock feedback make complex business decisions feel approachable without becoming cartoonish. Large numeric typography, slanted opportunity cards, clear levels, and lightweight motion provide a memorable but fast experience. Mobile layouts prioritize thumb-sized controls, sticky primary actions, and single-column reports. Every core experience is available in English and Chinese, with English as the default.

## Architecture and data flow

Use Next.js App Router, TypeScript, React, and hand-authored CSS tokens. Pure functions under `lib/calculators` and `lib/recommendation` own math and deterministic scoring; UI components only collect input and render typed results. Machine data and weights live in configurable TypeScript data objects so product facts can later move to Supabase without changing the interface.

Attribution is captured on first client load and refreshed on subsequent UTM visits. A 90-day local-storage record preserves first and last touch. Events are emitted through one analytics adapter that forwards to GA4/PostHog only when public keys exist and posts material funnel events to an internal API. Server persistence uses a small Supabase REST adapter with environment-driven credentials; missing credentials are an explicit development mode rather than a runtime failure.

Shareable reports use a compact URL-safe encoded payload in `/report/[id]`, avoiding a database dependency for the MVP while keeping the route replaceable by persistent IDs. `/go/[machine]` validates the machine, records the click, preserves source attribution, appends required UTM/ref parameters, and issues a temporary redirect to the current official OneLaser product URL.

## Reliability, privacy, and testing

Every numeric input is clamped to a documented safe range. Zero or negative margin produces guidance instead of `Infinity`, negative values, or a misleading payback claim. Results distinguish gross profit from net profit, exclude labor/fees/taxes unless entered as costs, and display the mandated estimate disclaimer. Recommendation output includes the score reasons and an alternative so users can audit the result.

Vitest covers the ROI math, tumbler math, recommendation determinism, report encoding, and URL/UTM preservation. Next.js build and lint/type checks protect route and metadata integration. Playwright-style browser QA will exercise the major flows at 390px and desktop widths, including result sharing, invalid input, recommendation limits, and external redirect response behavior. Accessibility targets include labeled controls, visible focus states, semantic headings, keyboard-operable cards, and reduced-motion support.

The MVP deliberately excludes accounts, AI recommendations, CMS, marketing automation, and a large article library. GA4, PostHog, and Supabase become active through environment variables; code and SQL schema ship now, while external dashboards and production secrets remain deployment configuration.
