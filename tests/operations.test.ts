import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { opportunities } from "@/lib/opportunities/data";
import { getArchivedRadarBriefing, getRadarArchiveDates, getRadarArchiveSummaries } from "@/lib/operations/radar-archive";
import { getActiveRadarBriefing, getOperationsPayload } from "@/lib/operations/radar";

describe("automated Maker operations", () => {
  it("publishes a valid daily briefing from the opportunity catalog", () => {
    const briefing = getActiveRadarBriefing();
    expect(opportunities.some((item) => item.id === briefing.opportunity.id)).toBe(true);
    expect(briefing.daily.headline.length).toBeGreaterThan(30);
    expect(briefing.daily.headlineZh.length).toBeGreaterThan(8);
    expect(briefing.daily.action.length).toBeGreaterThan(40);
    expect(briefing.state.timezone).toBe("Asia/Shanghai");
  });

  it("emits a channel-ready content package with attributed links", () => {
    const payload = getOperationsPayload();
    expect(payload.distribution.youtubeShorts).toHaveLength(3);
    expect(payload.distribution.email.subject).toContain(payload.opportunity.title);
    for (const url of Object.values(payload.distribution.links)) {
      const parsed = new URL(url);
      expect(parsed.hostname).toBe("maker.wonderelian.com");
      expect(parsed.searchParams.get("utm_campaign")).toBe("maker_opportunity_radar");
    }
  });

  it("includes the Radar in the public sitemap", () => {
    expect(sitemap().map((entry) => entry.url)).toContain("https://maker.wonderelian.com/radar");
  });

  it("keeps unique dated Radar snapshots with stable public routes", () => {
    const dates = getRadarArchiveDates();
    expect(dates.length).toBeGreaterThan(0);
    expect(new Set(dates).size).toBe(dates.length);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));

    for (const date of dates) {
      const briefing = getArchivedRadarBriefing(date);
      expect(briefing?.state.lastRunDate).toBe(date);
      expect(briefing?.links.radar).toBe(`/radar/${date}`);
      expect(sitemap().map((entry) => entry.url)).toContain(`https://maker.wonderelian.com/radar/${date}`);
    }
  });

  it("builds a reverse-chronological archive index without duplicate dates", () => {
    const summaries = getRadarArchiveSummaries();
    expect(summaries.map((entry) => entry.date)).toEqual(getRadarArchiveDates());
    expect(summaries.every((entry) => entry.title.length > 20 && entry.answer.length > 30)).toBe(true);
  });
});
