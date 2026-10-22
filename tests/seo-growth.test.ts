import { afterEach, describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";
import { opportunities } from "@/lib/opportunities/data";
import { getSeoOpportunity, opportunitySeoProfiles, seoFaq, seoJsonLd, seoPageDescription, seoPagePath, seoPageTitle, type SeoPageKind } from "@/lib/seo/opportunity-content";

describe("SEO and GEO growth pages", () => {
  const kinds: SeoPageKind[] = ["idea", "profit", "equipment"];
  afterEach(() => vi.unstubAllEnvs());

  it("publishes a complete three-page decision path for every opportunity", () => {
    const paths = opportunities.flatMap((opportunity) => kinds.map((kind) => seoPagePath(kind, opportunity.id)));
    expect(paths).toHaveLength(21);
    expect(new Set(paths).size).toBe(21);
    expect(paths.every((path) => /^\/(ideas|profit-calculators|equipment)\/[a-z0-9-]+$/.test(path))).toBe(true);
  });

  it("keeps each product profile specific, bilingual, and actionable", () => {
    for (const opportunity of opportunities) {
      const content = getSeoOpportunity(opportunity.id);
      expect(content).not.toBeNull();
      const profile = opportunitySeoProfiles[opportunity.id];
      expect(profile.buyer.length).toBeGreaterThan(30);
      expect(profile.buyerZh.length).toBeGreaterThan(10);
      expect(profile.differentiators).toHaveLength(3);
      expect(profile.validationPlan).toHaveLength(3);
      expect(profile.equipmentCriteria).toHaveLength(3);
      expect(profile.risk.length).toBeGreaterThan(50);
    }
  });

  it("creates unique intent-matched metadata and visible FAQ data", () => {
    const titles = opportunities.flatMap((opportunity) => kinds.map((kind) => seoPageTitle(kind, opportunity)));
    expect(new Set(titles).size).toBe(21);
    for (const opportunity of opportunities) {
      for (const kind of kinds) {
        expect(seoPageDescription(kind, opportunity).length).toBeGreaterThan(100);
        expect(seoFaq(kind, opportunity.id)).toHaveLength(3);
      }
    }
  });

  it("emits WebPage, breadcrumbs, FAQ, and intent-specific JSON-LD", () => {
    const idea = seoJsonLd("idea", "personalized-tumblers");
    const profit = seoJsonLd("profit", "personalized-tumblers");
    expect(idea?.["@graph"].map((item) => item["@type"])).toEqual(["WebPage", "BreadcrumbList", "FAQPage", "HowTo"]);
    expect(profit?.["@graph"].map((item) => item["@type"])).toEqual(["WebPage", "BreadcrumbList", "FAQPage", "WebApplication"]);
  });

  it("includes the content hub and all 21 growth pages in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://maker.wonderelian.com/ideas/");
    for (const opportunity of opportunities) {
      for (const kind of kinds) {
        expect(urls).toContain(`https://maker.wonderelian.com${seoPagePath(kind, opportunity.id)}/`);
      }
    }
  });

  it.each(["https://maker.wonderelian.com", "https://maker.wonderelian.com/"])("matches exported page URLs without changing image filenames for base %s", (base) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", base);
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain("https://maker.wonderelian.com/");
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      const parsed = new URL(url);
      expect(parsed.origin).toBe("https://maker.wonderelian.com");
      expect(parsed.pathname.endsWith("/")).toBe(true);
      expect(parsed.pathname).not.toContain("//");
    }
    const images = entries.flatMap((entry) => entry.images ?? []);
    expect(images).toContain(`https://maker.wonderelian.com${opportunities[0].image}`);
    for (const image of images) {
      expect(new URL(image).pathname).toMatch(/\.(?:avif|jpe?g|png|svg|webp)$/);
      expect(new URL(image).pathname).not.toContain("//");
    }
  });
});
