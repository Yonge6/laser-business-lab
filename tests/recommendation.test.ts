import { describe, expect, it } from "vitest";
import { recommendEquipment } from "@/lib/equipment/engine";

describe("equipment recommendation engine", () => {
  it("keeps a laser drinkware workflow inside the laser path", () => {
    const result = recommendEquipment({
      method: "laser",
      products: ["tumblers"],
      priorities: ["speed", "fine detail"],
      volume: "30-100",
      budget: "growth",
      experience: "growing",
    });
    expect(result.best.id).toBe("fiber-laser");
    expect(result.best.method).toBe("laser");
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("always selects the VertiGo path when tumblers are involved", () => {
    const result = recommendEquipment({
      method: "laser",
      products: ["tumblers", "wood"],
      priorities: ["lower upfront investment"],
      volume: "occasional",
      budget: "entry",
      experience: "first",
    });

    expect(result.best.id).toBe("fiber-laser");
    expect(result.best.oneLaser?.productName).toBe("OneLaser VertiGo");
  });

  it("uses XRF as the entry laser recommendation", () => {
    const result = recommendEquipment({
      method: "laser",
      products: ["wood", "gifts"],
      priorities: ["easy setup", "lower upfront investment"],
      volume: "1-10",
      budget: "entry",
      experience: "first",
    });

    expect(result.best.id).toBe("xrf-desktop");
    expect(result.best.oneLaser?.productName).toBe("OneLaser XRF");
  });

  it("keeps a 3D functional-product workflow inside the 3D-printing path", () => {
    const result = recommendEquipment({
      method: "3d-printing",
      products: ["functional parts", "replacement parts"],
      priorities: ["versatility", "easy setup"],
      volume: "10-30",
      budget: "starter",
      experience: "beginner",
    });
    expect(result.best.id).toBe("enclosed-fdm");
    expect(result.best.method).toBe("3d-printing");
    expect(result.best.name).not.toMatch(/laser/i);
    expect(result.best.referenceName).toBe("Bambu Lab printers");
    expect(result.best.referenceUrl).toContain("bambulab.com");
  });

  it("keeps a tote and apparel workflow inside the heat-press path", () => {
    const result = recommendEquipment({
      method: "heat-press",
      products: ["tote bags", "apparel"],
      priorities: ["easy setup", "versatility"],
      volume: "10-30",
      budget: "growth",
      experience: "growing",
    });
    expect(result.best.id).toBe("modular-3d-heat-press");
    expect(result.best.method).toBe("heat-press");
    expect(result.best.referenceName).toBe("xTool WonderPress");
    expect(result.best.referenceUrl).toContain("xtool-wonderpress");
  });
});
