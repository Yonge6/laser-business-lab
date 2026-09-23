import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { makerGuides, guidePath, guideStructuredData } from "@/lib/learn/guides";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import sitemap from "@/app/sitemap";
import { buildLlmsText } from "@/app/llms.txt/route";

describe("U.S. guide discovery and source integrity", () => {
  it("publishes unique articles with resolvable sources, images, and section anchors", () => {
    expect(new Set(makerGuides.map(guide => guide.slug)).size).toBe(3);
    for (const guide of makerGuides) {
      expect(existsSync(`public${guide.image}`)).toBe(true);
      expect(new Set(guide.sections.map(section => section.id)).size).toBe(guide.sections.length);
      for (const section of guide.sections) {
        for (const id of section.sources ?? []) expect(guide.sources.some(source => source.id === id && source.url.startsWith("https://"))).toBe(true);
        if (section.table) expect(section.table.rows.every(row => row.length === section.table!.headers.length)).toBe(true);
      }
    }
  });
  it("makes every article discoverable with a matching schema canonical", () => {
    const urls = sitemap().map(item => item.url);
    for (const guide of makerGuides) {
      const url = `https://maker.wonderelian.com${guidePath(guide.slug)}`;
      expect(urls).toContain(url);
      expect(buildLlmsText()).toContain(url);
      const article = guideStructuredData(guide, "https://maker.wonderelian.com")["@graph"][0];
      expect(article).toMatchObject({ headline: guide.title, abstract: guide.answer, mainEntityOfPage: url, inLanguage: "en-US", citation: guide.sources.map(source => source.url) });
    }
  });
  it("attributes raw external component destinations without losing product selection or fragment", () => {
    const markup = renderToStaticMarkup(createElement(TrackedExternalLink, { href: "https://www.1laser.com/products/example?variant=red&utm_campaign=equipment#specs", analytics: {} }, "View machine"));
    expect(markup).toContain("variant=red&amp;utm_campaign=equipment&amp;utm_source=elian#specs");
    expect(renderToStaticMarkup(createElement(TrackedExternalLink, { href: "/learn/", analytics: {} }, "Learn"))).toContain('href="/learn/"');
  });
});
