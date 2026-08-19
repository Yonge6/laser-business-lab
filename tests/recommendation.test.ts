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
  });
});
