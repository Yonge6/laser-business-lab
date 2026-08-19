import { describe, expect, it } from "vitest";
import { buildOneLaserUrl, oneLaserDestinations } from "@/lib/commerce/onelaser";
import { recommendEquipment } from "@/lib/equipment/engine";

describe("OneLaser conversion path", () => {
  it("builds official outbound URLs with placement-level tracking", () => {
    const result = new URL(buildOneLaserUrl(oneLaserDestinations.vertigo, {
      campaign: "equipment_match",
      content: "fiber-laser",
      placement: "machine_finder_result",
    }));

    expect(result.origin).toBe("https://www.1laser.com");
    expect(result.searchParams.get("utm_source")).toBe("maker_business_lab");
    expect(result.searchParams.get("utm_medium")).toBe("referral");
    expect(result.searchParams.get("utm_campaign")).toBe("equipment_match");
    expect(result.searchParams.get("utm_content")).toBe("fiber-laser");
    expect(result.searchParams.get("mbl_placement")).toBe("machine_finder_result");
  });

  it("rejects outbound destinations outside the official OneLaser host", () => {
    expect(() => buildOneLaserUrl("https://example.com/fake", {
      campaign: "roi_result",
      content: "test",
      placement: "roi_report",
    })).toThrow(/1laser\.com/);
  });

  it("maps a tumbler growth path to the OneLaser VertiGo checkpoint", () => {
    const result = recommendEquipment({
      method: "laser",
      products: ["tumblers"],
      priorities: ["speed", "fine detail"],
      volume: "30-100",
      budget: "growth",
      experience: "growing",
    });

    expect(result.best.id).toBe("fiber-laser");
    expect(result.best.oneLaser?.productName).toBe("OneLaser VertiGo");
    expect(result.best.oneLaser?.destination).toBe(oneLaserDestinations.vertigo);
  });

  it("keeps non-laser recommendations free of OneLaser sales links", () => {
    const result = recommendEquipment({
      method: "3d-printing",
      products: ["functional parts"],
      priorities: ["versatility"],
      volume: "10-30",
      budget: "starter",
      experience: "growing",
    });

    expect(result.best.oneLaser).toBeUndefined();
    expect(result.alternative.oneLaser).toBeUndefined();
  });
});
