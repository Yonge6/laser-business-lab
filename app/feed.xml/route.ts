import { getRadarArchiveSummaries } from "@/lib/operations/radar-archive";
import { getActiveRadarBriefing } from "@/lib/operations/radar";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function publicationDate(date: string) {
  return new Date(`${date}T00:30:00.000Z`).toUTCString();
}

function trackedFeedUrl(path: string, date: string) {
  const url = new URL(path, siteUrl);
  url.searchParams.set("utm_source", "rss");
  url.searchParams.set("utm_medium", "syndication");
  url.searchParams.set("utm_campaign", "maker_opportunity_radar");
  url.searchParams.set("utm_content", date);
  return url.toString();
}

export function buildRadarRss() {
  const active = getActiveRadarBriefing();
  const entries = [
    {
      date: active.state.lastRunDate,
      href: `/radar/${active.state.lastRunDate}`,
      title: active.daily.headline,
      label: active.daily.label,
      answer: active.daily.answer,
    },
    ...getRadarArchiveSummaries(active.state.lastRunDate),
  ].slice(0, 30);
  const latestDate = entries[0]?.date ?? active.state.lastRunDate;
  const items = entries.map((entry) => {
    const canonicalUrl = `${siteUrl}${entry.href}`;
    const trackedUrl = trackedFeedUrl(entry.href, entry.date);
    const description = `${entry.label}: ${entry.answer}`;
    return [
      "    <item>",
      `      <title>${escapeXml(entry.title)}</title>`,
      `      <link>${escapeXml(trackedUrl)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(canonicalUrl)}</guid>`,
      `      <pubDate>${publicationDate(entry.date)}</pubDate>`,
      `      <description>${escapeXml(description)}</description>`,
      "    </item>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Maker Opportunity Radar</title>",
    `    <link>${siteUrl}/radar/</link>`,
    `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />`,
    "    <description>Daily product, profit, validation, production, and equipment signals for maker businesses.</description>",
    "    <language>en-US</language>",
    `    <lastBuildDate>${publicationDate(latestDate)}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export function GET() {
  return new Response(buildRadarRss(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
