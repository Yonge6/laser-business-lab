import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { makerProjects, projectMaterialFilters } from "@/lib/projects/project-library";

describe("maker project library", () => {
  it("publishes all 42 source projects with unique bilingual identities", () => {
    expect(makerProjects).toHaveLength(42);
    expect(new Set(makerProjects.map((project) => project.slug)).size).toBe(42);
    expect(new Set(makerProjects.map((project) => project.imagePath)).size).toBe(42);
    expect(makerProjects.every((project) => project.titleZh.length > 4 && project.useCaseZh.length > 6)).toBe(true);
  });

  it("ships every project image locally instead of hotlinking", () => {
    for (const project of makerProjects) {
      expect(project.imagePath.startsWith("/images/project-library/")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", project.imagePath))).toBe(true);
    }
  });

  it("keeps planning economics positive and explicitly before overhead", () => {
    for (const project of makerProjects) {
      expect(project.price).toBeGreaterThan(0);
      expect(project.margin).toBeGreaterThan(0);
      expect(project.margin).toBeLessThan(100);
      expect(project.grossProfit).toBeCloseTo(project.price * project.margin / 100, 5);
    }
  });

  it("attributes every equipment recommendation to Elian", () => {
    for (const project of makerProjects) {
      const url = new URL(project.machineUrl);
      expect(url.origin).toBe("https://www.1laser.com");
      expect(url.searchParams.get("utm_source")).toBe("elian");
      expect(url.searchParams.get("mbl_placement")).toBe("project_library");
    }
  });

  it("covers all supported material filters and sitemap routes", () => {
    for (const filter of projectMaterialFilters.filter((item) => item !== "All")) {
      expect(makerProjects.some((project) => project.material.toLowerCase().includes(filter.toLowerCase()))).toBe(true);
    }
    const urls = new Set(sitemap().map((entry) => entry.url));
    expect(urls.has("https://maker.wonderelian.com/projects")).toBe(true);
    for (const project of makerProjects) expect(urls.has(`https://maker.wonderelian.com/projects/${project.slug}`)).toBe(true);
  });
});
