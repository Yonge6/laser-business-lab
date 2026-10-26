# Portfolio indexing repairs implementation plan

**Goal:** Repair verified canonical-route and missing-archive defects without changing withdrawn content, current publications or correct canonical tags.

**Architecture:** Patch each product in its own DevSSD worktree. Maker changes only its static Nginx route contract. Xiazi changes only the confirmed historical archive/routing defect after tracing production source. WonderElian's deliberately withdrawn Graphic Brutalism article remains 404. Style Atlas retains its correct canonical structure; Google indexing is not a deployment result.

**Tech Stack:** Nginx, Node test runner/Vitest, TypeScript/Next.js where needed, existing restricted production access.

## Task 1: Verify release and withdrawal boundaries
- Compare active production paths and source state before any deployment.
- Preserve existing dirty checkouts; use isolated worktrees from verified revisions.
- Record audit evidence and do not restore deliberately removed articles.

## Task 2: Maker canonical route redirects
- Files: `deploy/nginx/maker-static-export.conf`, `tests/static-hosting.test.ts`, `docs/deploy/static-hosting.md`.
- Add failing tests: exported directory routes without trailing slash return 308 to the slash canonical, retaining query parameters; unknown directories remain 404; assets do not redirect.
- Implement the smallest Nginx rule; run fixture Nginx HTTP tests plus existing tests.
- Back up active Maker config, compare the deployed config against known source, apply only Maker rule, run `nginx -t`, reload, and independently read public status/location/canonical and missing-route responses. Preserve original config for rollback.

## Task 3: Xiazi missing archive and historical identifier check
- Inspect production source, immutable archive record and June 23 local original; compare exact metadata/content/assets before restoration.
- A slug alone is not evidence that content was replaced: preserve stable identifiers if source history confirms them.
- Add regression tests for the actual defect; repair only the verified missing artifact or route. Never republish today's issue or recreate posters.
- Use existing reversible release mechanism and verify both locales, exact archive date, images, canonical, current release identity and status codes.

## Task 4: Acceptance
- Run focused and applicable full tests/builds; record skip/blockers honestly.
- Public readback must confirm each fix. Preserve null/unknown indexing metrics; do not claim indexed based on HTTP 200.
- Append actor/source/action/result/status to durable audit records. No duplicate automations or new analytics cycle.

Execution is authorized by the user's “修复 你搞定”; proceed in this session, reporting meaningful checkpoints without requiring per-step approval.

## Maker acceptance audit — 2026-10-26
- actor: Codex
- source: existing Nginx include, 128 passing repository tests, 16 isolated loopback Nginx HTTP cases and independent public fetches
- action: back up the single Maker include, install pinned canonical redirect rule, validate Nginx and gracefully reload
- result: `/radar/2026-09-27?ct=seo-check` returns 308 to `/radar/2026-09-27/?ct=seo-check`; calculator attribution preserved; canonical page returns 200; unknown page and missing JS still return 404
- status: deployed_public_verified
- source hash: `48364f78c0671a0f2f0878cf5a97e6e6fa40457cc6f2c2bfa8977542229eaaaf`
- rollback: `/etc/nginx/snippets/maker-static-export.conf.before-20261026-seo`
- first attempt automatically rolled back because immediate verification reached an old Nginx worker; a bounded reload-settle retry then passed. No static release, UI, data, certificate, DNS or other site's configuration changed.
- local native Nginx tests are skipped because no local binary is installed; the isolated fixture suite ran successfully with production-host Nginx on loopback before activation.
