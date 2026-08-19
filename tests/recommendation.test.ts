import { describe, expect, it } from "vitest";
import { recommendMachines } from "@/lib/recommendation/engine";

describe("machine recommendation engine", () => {
  it("recommends VertiGo for a drinkware production workflow", () => {
    const result = recommendMachines({
      products: ["tumblers"],
      priorities: ["speed", "drinkware"],
      volume: "30-100",
      budget: "5-8",
      experience: "growing",
    });
    expect(result.best.id).toBe("vertigo");
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("recommends XRF when fine detail and versatility lead", () => {
    const result = recommendMachines({
      products: ["gifts", "awards"],
      priorities: ["fine detail", "versatility"],
      volume: "10-30",
      budget: "5-8",
      experience: "beginner",
    });
    expect(result.best.id).toBe("xrf");
  });
});
