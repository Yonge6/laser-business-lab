import { describe, expect, it } from "vitest";
import { rankOpportunities } from "@/lib/opportunities/engine";

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
});
