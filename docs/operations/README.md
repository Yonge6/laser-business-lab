# Maker Business Lab automated operations

The public site runs a zero-budget, unattended operating loop from GitHub Actions.

## Cadence

- **Daily at 08:30 Asia/Shanghai:** update the current decision lens, validate the full site, publish directly to `main`, and trigger the existing GitHub Pages deployment.
- **Every Monday:** rotate to the next of the seven product opportunities and begin a new weekly Radar cycle.
- **Every run:** emit a structured distribution package at `/operations/latest.json` for connected publishing channels.
- **On failure:** create a GitHub Issue. The workflow never pushes content that failed tests, type checks, lint, or the production static build.

The seven daily lenses are demand, price, validation, production, equipment, risk, and weekly review. Public content uses the existing explainable planning model. It does not claim live sales, bestseller status, or guaranteed earnings.

## Manual replay

Use the `Daily Maker Operations` workflow’s `operations_date` input, or run locally:

```bash
OPERATIONS_DATE=2026-08-24 pnpm ops:daily
pnpm test
NEXT_PUBLIC_SITE_URL=https://maker.wonderelian.com pnpm build
```

`OPERATIONS_DATE` must use `YYYY-MM-DD`. Replaying the same date is idempotent.

## Channel integrations

The website, JSON content feed, weekly rotation, CI, deployment, and failure alerts require no paid API. Optional external publishers can consume the JSON feed through the `OPERATIONS_DISTRIBUTION_WEBHOOK` GitHub Actions secret.

Credentials must be stored in 1Password or a platform secret store and copied only into GitHub Actions secrets or the distribution service’s encrypted environment. Never place passwords, API keys, refresh tokens, recovery codes, or session cookies in this repository, workflow output, issues, or content files.

Accounts that require email, phone, CAPTCHA, identity, or consent verification need one user-assisted verification step. After that, a supported API or approved scheduler can use the feed without exposing credentials to the site.

## Recovery

Every automated publication is a normal Git commit. Revert the bot commit to restore the previous day. If a run fails, inspect the linked Actions log from the automatically created issue; fix the cause and replay the date with `workflow_dispatch`.
