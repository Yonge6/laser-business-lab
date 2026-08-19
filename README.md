# Laser Business Lab

A bilingual, business-first maker platform for answering three questions:

1. What product should I make and sell?
2. Can the numbers work for my business?
3. Which production setup fits the job?

The MVP is laser-first and already models 3D-printing opportunities. It includes an opportunity finder, laser ROI calculator, tumbler profit calculator, deterministic machine finder, shareable reports, first/last-touch attribution, tracked OneLaser redirects, email capture, and optional GA4/PostHog/Supabase integrations.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`. English is the default language; use the header switch for Chinese.

## Validate

```bash
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Environment

Copy `.env.example` to `.env.local`. The site remains fully usable without external services; analytics and persistence become active only when their variables are present.

- `NEXT_PUBLIC_GA_ID`: GA4 measurement ID.
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`: optional product analytics.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: server-only persistence.

Apply [supabase/schema.sql](supabase/schema.sql) before enabling Supabase. Never expose the service role key in a `NEXT_PUBLIC_*` variable.

## Attribution and outbound flow

First and last UTM touch are stored for 90 days. Equipment links pass through `/go/:machine`, record the click when Supabase is configured, preserve source UTMs, add `ref=laserbusinesslab`, and return a temporary redirect to the configured official product URL.

## Important limitations

Opportunity scores, profit, capacity, and payback figures are estimates. They do not guarantee demand or earnings and do not constitute financial or business advice. Current OneLaser URLs and starting prices were checked against the official store on August 19, 2026 and should be reviewed before future releases.
