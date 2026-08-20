import { describe, expect, it } from "vitest";

import { buildBambuUrl } from "@/lib/commerce/bambu";

describe("Bambu Lab conversion path", () => {
  it("builds a tracked official printer comparison link", () => {
    const result = new URL(buildBambuUrl("home_3d-desk-organizers"));

    expect(result.origin).toBe("https://bambulab.com");
    expect(result.pathname).toBe("/en-us/compare");
    expect(result.searchParams.get("utm_source")).toBe("maker_business_lab");
    expect(result.searchParams.get("utm_content")).toBe("home_3d-desk-organizers");
    expect(result.searchParams.get("mbl_placement")).toBe("home_opportunity");
  });

  it("supports tracked machine-finder placement", () => {
    const result = new URL(buildBambuUrl("machine_finder_open-fdm", "machine_finder_result"));
    expect(result.searchParams.get("mbl_placement")).toBe("machine_finder_result");
  });
});
