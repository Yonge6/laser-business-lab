import { describe, expect, it } from "vitest";

import { buildXToolUrl } from "@/lib/commerce/xtool";

describe("xTool conversion path", () => {
  it("builds a tracked official WonderPress product link", () => {
    const result = new URL(buildXToolUrl("home_heat-press-tote-bags"));

    expect(result.origin).toBe("https://www.xtool.com");
    expect(result.pathname).toContain("xtool-wonderpress-modular-auto-heat-press");
    expect(result.searchParams.get("utm_source")).toBe("elian");
    expect(result.searchParams.get("utm_content")).toBe("home_heat-press-tote-bags");
    expect(result.searchParams.get("mbl_placement")).toBe("home_opportunity");
  });

  it("supports tracked machine-finder placement", () => {
    const result = new URL(buildXToolUrl("machine_finder_portable", "machine_finder_result"));
    expect(result.searchParams.get("mbl_placement")).toBe("machine_finder_result");
  });
});
