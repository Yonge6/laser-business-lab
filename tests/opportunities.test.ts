import { describe, expect, it } from "vitest";
import { rankOpportunities } from "@/lib/opportunities/engine";
import { opportunities } from "@/lib/opportunities/data";
import { marketCaseByOpportunity } from "@/lib/opportunities/market-cases";

describe("opportunity ranking engine", () => {
  it("keeps the featured catalog sorted by opportunity score with matching ranks", () => {
    expect(opportunities.map((item) => item.score)).toEqual([82, 79, 78, 77, 76, 74, 73]);
    expect(opportunities.map((item) => item.rank)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("prioritizes laser personalization for a side-income maker", () => {
    const ranked = rankOpportunities({
      interests: ["personalized", "gifts"],
      method: "laser",
      budget: "3-8k",
      hoursPerWeek: "5-15",
      goal: "side-income",
    });
    expect(ranked[0].id).toBe("personalized-tumblers");
    expect(ranked[0].matchReasons.length).toBeGreaterThan(0);
    expect(ranked[0].matchReasonsZh.join(" ")).not.toMatch(/\b(personalized|gifts)\b/);
  });

  it("keeps 3D printing viable for a low-budget functional-product start", () => {
    const ranked = rankOpportunities({
      interests: ["home", "functional"],
      method: "3d-printing",
      budget: "500-3k",
      hoursPerWeek: "15-30",
      goal: "first-sale",
    });
    expect(ranked[0].id).toBe("3d-desk-organizers");
  });

  it("keeps heat-pressed personalization viable for a low-budget first sale", () => {
    const ranked = rankOpportunities({
      interests: ["personalized", "gifts"],
      method: "heat-press",
      budget: "under-500",
      hoursPerWeek: "under-5",
      goal: "first-sale",
    });
    expect(ranked[0].id).toBe("heat-press-tote-bags");
  });

  it("provides a dated, public marketplace example for every featured opportunity", () => {
    for (const opportunity of opportunities) {
      const marketCase = marketCaseByOpportunity[opportunity.id];
      expect(marketCase.sourceUrl).toMatch(/^https:\/\/www\.etsy\.com\/listing\//);
      expect(marketCase.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(marketCase.signal).not.toBe("");
      expect(marketCase.signalZh).not.toBe("");
    }
  });
});
