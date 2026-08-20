# Maker Business Lab

Live site: [https://maker.wonderelian.com/](https://maker.wonderelian.com/)

GitHub Pages fallback: [https://yonge6.github.io/laser-business-lab/](https://yonge6.github.io/laser-business-lab/)

A bilingual, business-first maker platform for answering three questions:

1. What product should I make and sell?
2. Can the numbers work for my business?
3. Which production setup fits the job?

The MVP is laser-first and already models 3D-printing opportunities. It includes an opportunity finder, laser ROI calculator, tumbler profit calculator, deterministic machine finder, shareable reports, first/last-touch attribution, attributed equipment links, email capture, and optional GA4/PostHog integrations.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`. English is the default language; use the header switch for Chinese.

To preview the GitHub Pages build locally:

```bash
pnpm run build:pages
pnpm exec serve out
```

## Validate

```bash
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run build:pages
```

## Environment

Copy `.env.example` to `.env.local`. The site remains fully usable without external services; analytics and optional remote form/event delivery become active only when their variables are present.

- `NEXT_PUBLIC_GA_ID`: GA4 measurement ID.
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`: optional product analytics.
- `NEXT_PUBLIC_LEAD_ENDPOINT`: report-email Worker endpoint, for example `https://maker-business-lab-report-email.<account>.workers.dev/reports`.
- `NEXT_PUBLIC_EVENT_ENDPOINT`: optional external endpoint for first-party event delivery.

Without a lead endpoint, email requests are saved only in that browser so the public static site never pretends a remote submission succeeded.

### Report email delivery

The deployable backend lives in `services/report-email`. It validates allowed origins and report URLs, rejects bot honeypots, rate-limits requests, and sends through Resend without exposing the API key to the static site.

1. Verify `send.wonderelian.com` in Resend and create a Resend API key.
2. In `services/report-email`, run `pnpm dlx wrangler secret put RESEND_API_KEY`, then `pnpm dlx wrangler deploy`.
3. Set the GitHub Actions repository variable `NEXT_PUBLIC_LEAD_ENDPOINT` to the deployed `/reports` URL.
4. Push to `main` and submit one real report as an end-to-end delivery check.

The Worker uses `reports@send.wonderelian.com` as the sender. Change `FROM_EMAIL` in `wrangler.jsonc` only if the verified Resend domain differs.

## Attribution and outbound flow

First and last UTM touch are stored for 90 days. Equipment links open the configured official product URL directly, preserve source UTMs, add `ref=laserbusinesslab`, and emit a client-side analytics event when analytics is configured.

## GitHub Pages deployment

Every push to `main` runs lint, type checks, tests, and both production builds. After those checks pass, GitHub Actions publishes the static `out/` artifact to GitHub Pages. The configured `/laser-business-lab` base path is applied only to the Pages build.

## Important limitations

Opportunity scores, profit, capacity, and payback figures are estimates. They do not guarantee demand or earnings and do not constitute financial or business advice. Current OneLaser URLs and starting prices were checked against the official store on August 19, 2026 and should be reviewed before future releases.
