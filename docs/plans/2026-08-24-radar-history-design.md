# Radar history archive

## Goal

Turn the daily Maker Opportunity Radar into durable, date-addressable content without creating thin or duplicate pages. The current Radar remains the live entry point, while every successful daily run preserves a snapshot at `/radar/YYYY-MM-DD/`.

## Chosen approach

Store compact daily operating states in `content/operations/archive.json`. The existing generator writes the current state and upserts the same state into the archive. This keeps generation deterministic, version controlled, and compatible with the site's static GitHub Pages export.

The active page and dated pages reuse the same briefing component. Dated routes receive a frozen state, show an archive label instead of a live-update label, and expose unique metadata, canonical URLs, Article and Breadcrumb structured data. A visible archive below the operating-path panel links the pages in reverse chronological order, and the sitemap contains every dated URL.

## Data flow

1. The daily workflow calculates the Shanghai date, weekly product, and daily decision lens.
2. It upserts the generated state into `state.json` and `archive.json`.
3. Tests, type checking, linting, and the full static build must pass.
4. Both operation files are committed together to `main`.
5. GitHub Pages exports the live Radar, dated archive pages, feed, and sitemap atomically.

## Failure handling

The workflow commits only after validation. A failed push opens an operations issue. Replaying the same date is idempotent: the archive entry is replaced rather than duplicated. Unknown dates are rejected by the static route and never enter the sitemap.

## SEO and GEO safeguards

- One stable canonical URL per date.
- Unique title, description, headline, action, product, and decision lens.
- Visible date and content that matches the structured data.
- Article and Breadcrumb JSON-LD.
- Internal links from the live Radar and between archive entries.
- No fabricated rankings, earnings claims, or hidden schema content.
