import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { makerGuides, guidePath, guideStructuredData } from "@/lib/learn/guides";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { MakerGuideReader } from "@/components/marketing/maker-guide-reader";
import { LanguageProvider } from "@/components/providers/language-provider";
import sitemap from "@/app/sitemap";
import { buildLlmsText } from "@/app/llms.txt/route";

describe("U.S. guide discovery and source integrity", () => {
  it("publishes unique articles with resolvable sources, images, and section anchors", () => {
    expect(new Set(makerGuides.map(guide => guide.slug)).size).toBe(7);
    expect(new Set(makerGuides.map(guide => guide.image)).size).toBe(makerGuides.length);
    for (const guide of makerGuides) {
      expect(existsSync(`public${guide.image}`)).toBe(true);
      expect(guide.publishedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.reviewedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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
      expect(article).toMatchObject({ headline: guide.title, abstract: guide.answer, mainEntityOfPage: url, inLanguage: "en-US", datePublished: guide.publishedDate, dateModified: guide.reviewedDate, citation: guide.sources.map(source => source.url) });
    }
  });
  it("attributes raw external component destinations without losing product selection or fragment", () => {
    const markup = renderToStaticMarkup(createElement(TrackedExternalLink, { href: "https://www.1laser.com/products/example?variant=red&utm_campaign=equipment#specs", analytics: {} }, "View machine"));
    expect(markup).toContain("variant=red&amp;utm_campaign=equipment&amp;utm_source=elian#specs");
    expect(renderToStaticMarkup(createElement(TrackedExternalLink, { href: "/learn/", analytics: {} }, "Learn"))).toContain('href="/learn/"');
  });
  it("prerenders the machine-cost links inside their relevant article sections", () => {
    const renderGuide = (slug: string) => {
      const english = makerGuides.find(guide => guide.slug === slug)!;
      const chinese = makerGuidesZh.find(guide => guide.slug === slug)!;
      return renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MakerGuideReader, { english, chinese, base: "https://maker.wonderelian.com", related: [] })));
    };
    const production = renderGuide("how-to-price-3d-prints").match(/<section id="production">([\s\S]*?)<\/section>/)?.[1];
    expect(production).toMatch(/href="\/learn\/3d-printer-hourly-cost\/?"/);
    const nextSteps = renderGuide("3d-printer-hourly-cost").match(/<section id="quote">([\s\S]*?)<\/section>/)?.[1];
    const destinations = [...nextSteps!.matchAll(/<a [^>]*href="([^"]+)"/g)].map(match => `${match[1].replace(/\/$/, "")}/`);
    for (const href of ["/learn/how-to-price-3d-prints/", "/profit-calculators/3d-desk-organizers/", "/profit-calculators/3d-geometric-planters/"]) {
      expect(destinations).toContain(href);
    }
  });
});

import { makerGuidesZh } from "@/lib/learn/guides-zh";

describe("Chinese guide parity", () => {
  it("translates every article section and preserves destinations, source URLs and financial table inputs", () => {
    expect(makerGuidesZh).toHaveLength(makerGuides.length);
    for (const english of makerGuides) {
      const chinese = makerGuidesZh.find(item => item.slug === english.slug)!;
      expect(chinese.title).toMatch(/[\u4e00-\u9fff]/);
      expect(chinese.image).toBe(english.image);
      expect(chinese.publishedDate).toBe(english.publishedDate);
      expect(chinese.reviewedDate).toBe(english.reviewedDate);
      expect(chinese.tool.href).toBe(english.tool.href);
      expect(chinese.sources.map(item => item.url)).toEqual(english.sources.map(item => item.url));
      expect(chinese.sources.every(item => Boolean(item.title))).toBe(true);
      expect(chinese.sections.map(item => item.id)).toEqual(english.sections.map(item => item.id));
      expect(chinese.faq).toHaveLength(english.faq.length);
      english.sections.forEach((section, index) => {
        const translated = chinese.sections[index];
        expect(translated.title).toMatch(/[\u4e00-\u9fff]/);
        expect(translated.paragraphs).toHaveLength(section.paragraphs.length);
        expect(translated.sources).toEqual(section.sources);
        expect(translated.links?.map(link => link.href)).toEqual(section.links?.map(link => link.href));
        for (const link of translated.links ?? []) expect(link.label).toMatch(/[\u4e00-\u9fff]/);
        expect(translated.bullets?.length).toBe(section.bullets?.length);
        if (section.table) {
          expect(translated.table?.rows).toHaveLength(section.table.rows.length);
          const numbers = (rows: string[][]) => rows.flat().join(" ").match(/\d+(?:[.,]\d+)*/g);
          expect(numbers(translated.table!.rows)).toEqual(numbers(section.table.rows));
        }
      });
      expect(guideStructuredData(chinese, "https://maker.wonderelian.com", "zh-CN")["@graph"][0]).toMatchObject({ headline: chinese.title, abstract: chinese.answer, inLanguage: "zh-CN" });
    }
  });
  it("keeps the new machine-hour guide’s numeric assumptions identical in both languages", () => {
    const english = makerGuides.find(guide => guide.slug === "3d-printer-hourly-cost")!;
    const chinese = makerGuidesZh.find(guide => guide.slug === english.slug)!;
    const numbers = (text: string) => text.match(/\d+(?:[.,]\d+)*/g)?.sort();
    english.sections.forEach((section, index) => {
      expect(numbers(chinese.sections[index].paragraphs.join(" "))).toEqual(numbers(section.paragraphs.join(" ")));
    });
    expect(english.tool.href).toBe(guidePath("how-to-price-3d-prints"));
  });
});
