import { describe, expect, it } from "vitest";
import { getOpportunityEquipmentRecommendation, getRoiEquipmentRecommendation } from "@/lib/commerce/opportunity-equipment";

describe("opportunity equipment recommendations", () => {
  it.each([
    ["personalized-tumblers", "laser", "OneLaser VertiGo", "/products/vertigo-vertical-laser-engraver"],
    ["laser-leather-patches", "laser", "OneLaser XRF", "/products/onelaser-xrf-desktop-laser-machine"],
    ["layered-wood-wall-art", "laser", "OneLaser Hydra 9 Gen 2", "/products/hydra-9-gen-2-70w-rf-co2-dual-laser-machine"],
    ["acrylic-wedding-signs", "laser", "OneLaser Cobra 10", "/products/cobra-10-100w-co2-laser-engraver-cutter"],
    ["3d-desk-organizers", "3d-printing", "Bambu Lab printers", "/en-us/compare"],
    ["3d-geometric-planters", "3d-printing", "Bambu Lab printers", "/en-us/compare"],
    ["heat-press-tote-bags", "heat-press", "xTool WonderPress", "/products/xtool-wonderpress-modular-auto-heat-press-for-2d-transfers-and-3d-creations"],
  ] as const)("maps %s to a direct recommendation", (id, category, name, pathname) => {
    const result = getOpportunityEquipmentRecommendation(id, category);
    const url = new URL(result.url);

    expect(result.name).toBe(name);
    expect(url.pathname).toBe(pathname);
    expect(url.searchParams.get("mbl_placement")).toBe("opportunity_finder_result");
    expect(url.searchParams.get("utm_content")).toBe(`opportunity_finder_${id}`);
  });

  it("recommends VertiGo inside a default tumbler ROI report", () => {
    const result = getRoiEquipmentRecommendation("maker", "Tumblers");
    const url = new URL(result.url);

    expect(result.name).toBe("OneLaser VertiGo");
    expect(url.pathname).toBe("/products/vertigo-vertical-laser-engraver");
    expect(url.searchParams.get("mbl_placement")).toBe("roi_report");
  });

  it("keeps a selected acrylic opportunity on Cobra 10 in its ROI report", () => {
    const result = getRoiEquipmentRecommendation("laser", "Acrylic Wedding Signs", "acrylic-wedding-signs");
    const url = new URL(result.url);

    expect(result.name).toBe("OneLaser Cobra 10");
    expect(url.pathname).toBe("/products/cobra-10-100w-co2-laser-engraver-cutter");
    expect(url.searchParams.get("mbl_placement")).toBe("roi_report");
  });
});
