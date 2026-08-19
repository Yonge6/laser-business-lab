import { describe, expect, it } from "vitest";
import { rankOpportunities } from "@/lib/opportunities/engine";
import { opportunities } from "@/lib/opportunities/data";
import { marketCaseByOpportunity } from "@/lib/opportunities/market-cases";

describe("opportunity ranking engine", () => {
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
