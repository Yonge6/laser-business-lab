import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/components/providers/language-provider";
import { RoiExperience } from "@/components/calculator/roi-experience";
import { roiOpportunity } from "@/lib/calculators/roi-opportunity";

vi.mock("next/navigation", () => ({
  useSearchParams: () => { throw new Promise(() => undefined); },
}));

describe("ROI static shell", () => {
  it("renders the heading, form and cost guidance while URL selection suspends", () => {
    const html = renderToString(createElement(LanguageProvider, null, createElement(RoiExperience)));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Can this maker product make you money?");
    expect(html).toContain("What do you want to make?");
    expect(html).toContain("Production time estimates capacity");
    expect(html).toContain("/learn/etsy-tumbler-pricing-us");
  });

  it("uses known product presets and rejects unknown or inherited object keys", () => {
    expect(roiOpportunity("personalized-tumblers")?.category).toBe("laser");
    expect(roiOpportunity("3d-desk-organizers")?.category).toBe("3d-printing");
    for (const id of [null, undefined, "", "missing-product", "constructor", "__proto__"]) {
      expect(roiOpportunity(id)).toBeUndefined();
    }
  });
});
