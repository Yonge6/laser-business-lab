import { describe, expect, it } from "vitest";

import { buildRadarRss, GET as getFeed } from "@/app/feed.xml/route";
import { buildLlmsText, GET as getLlms } from "@/app/llms.txt/route";
import operationsState from "@/content/operations/state.json";
import { opportunities } from "@/lib/opportunities/data";

describe("organic content discovery", () => {
  it("publishes a current RSS feed with dated Radar links", async () => {
    const xml = buildRadarRss();
    expect(xml).toContain("<title>Maker Opportunity Radar</title>");
    expect(xml).toContain(`https://maker.wonderelian.com/radar/${operationsState.lastRunDate}`);
    expect(xml).toContain("<item>");
    expect(xml).toContain("utm_source=rss");
    expect(xml).toContain("utm_medium=syndication");

    const response = getFeed();
    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(await response.text()).toBe(xml);
  });

  it("publishes a GEO-oriented map of every decision path", async () => {
    const text = buildLlmsText();
    expect(text).toContain("# Maker Business Lab");
    expect(text).toContain("/operations/latest.json");
    expect(text).toContain("/feed.xml");
    for (const opportunity of opportunities) {
      expect(text).toContain(`/ideas/${opportunity.id}`);
      expect(text).toContain(`/profit-calculators/${opportunity.id}`);
      expect(text).toContain(`/equipment/${opportunity.id}`);
    }

    const response = getLlms();
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(await response.text()).toBe(text);
  });
});
