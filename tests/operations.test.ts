import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { opportunities } from "@/lib/opportunities/data";
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
});
