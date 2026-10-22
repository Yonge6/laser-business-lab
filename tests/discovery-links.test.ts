import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";

import ArchivedRadarPage from "@/app/radar/[date]/page";
import { ProjectLibrary, shouldOpenProjectPreview } from "@/components/marketing/project-library";
import { getRadarArchiveDates, getRadarArchiveNavigation, getRadarArchiveSummaries } from "@/lib/operations/radar-archive";
import { makerProjects } from "@/lib/projects/project-library";

const language = vi.hoisted(() => ({ locale: "en" as "en" | "zh" }));
vi.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ locale: language.locale }),
}));
// Next injects this value from next.config.ts when producing the static export.
vi.stubEnv("__NEXT_TRAILING_SLASH", "true");
afterAll(() => vi.unstubAllEnvs());

describe("server-rendered content discovery", () => {
  it("exposes all 42 project guide links before any preview is opened", () => {
    language.locale = "en";
    const html = renderToString(createElement(ProjectLibrary));
    const cards = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag).filter((tag) => tag.includes('class="project-library-card"'));
    expect(cards).toHaveLength(makerProjects.length);
    for (const project of makerProjects) {
      expect(cards.some((tag) => tag.includes(`href="/projects/${project.slug}/"`))).toBe(true);
    }
    expect(html).not.toContain('role="dialog"');
  });

  it("opens previews only for an unmodified primary click, including keyboard Enter clicks", () => {
    const click = { button: 0, defaultPrevented: false, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    expect(shouldOpenProjectPreview(click)).toBe(true);
    for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey"] as const) {
      expect(shouldOpenProjectPreview({ ...click, [modifier]: true })).toBe(false);
    }
    for (const button of [1, 2]) expect(shouldOpenProjectPreview({ ...click, button })).toBe(false);
    expect(shouldOpenProjectPreview({ ...click, defaultPrevented: true })).toBe(false);
  });

  it("makes every archived daily radar reachable through links in server HTML", async () => {
    language.locale = "en";
    const dates = getRadarArchiveDates();
    const edges = new Map<string, string[]>();
    for (const date of dates) {
      const page = await ArchivedRadarPage({ params: Promise.resolve({ date }) });
      const html = renderToString(page);
      const navigation = html.match(/<nav class="operations-archive-adjacent shell"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
      const links = [...navigation.matchAll(/href="\/radar\/(\d{4}-\d{2}-\d{2})\/"/g)].map(([, target]) => target);
      const adjacent = getRadarArchiveNavigation(date);
      expect(links).toEqual([adjacent.previousDate, adjacent.nextDate].filter(Boolean));
      expect(links.every((target) => dates.includes(target))).toBe(true);
      expect(links).not.toContain(date);
      edges.set(date, links);
    }

    const queue = getRadarArchiveSummaries().slice(0, 10).map((entry) => entry.date);
    const reached = new Set<string>();
    while (queue.length) {
      const date = queue.shift()!;
      if (reached.has(date)) continue;
      reached.add(date);
      queue.push(...(edges.get(date) ?? []));
    }
    expect([...reached].sort()).toEqual([...dates].sort());
    expect(getRadarArchiveNavigation(dates[0]).nextDate).toBeUndefined();
    expect(getRadarArchiveNavigation(dates.at(-1)!).previousDate).toBeUndefined();
    expect(getRadarArchiveNavigation("1900-01-01")).toEqual({});
  });

  it("uses the selected Chinese locale for adjacent date links and retains archive pagination", async () => {
    language.locale = "zh";
    const date = getRadarArchiveDates()[1];
    const html = renderToString(await ArchivedRadarPage({ params: Promise.resolve({ date }) }));
    expect(html).toContain('aria-label="相邻日期雷达"');
    expect(html).toContain("上一期");
    expect(html).toContain("下一期");
    expect(html).toContain('aria-label="往期雷达分页"');
    expect(html).toContain('aria-controls="radar-archive-list"');
    language.locale = "en";
  });
});
