import { describe, expect, it } from "vitest";
import { makerEventName, safeAnalyticsProperties } from "@/lib/analytics/client";

describe("Maker product analytics", () => {
  it("keeps H5 and iOS event namespaces separate", () => {
    expect(makerEventName("calculator_complete", "h5")).toBe("maker_v1_calculator_complete");
    expect(makerEventName("calculator_complete", "ios")).toBe("maker_ios_v1_calculator_complete");
  });

  it("never forwards calculator values, email, or nested answer objects", () => {
    expect(safeAnalyticsProperties({
      tool: "laser_roi",
      step: 3,
      marketing_consent: false,
      email: "private@example.com",
      calculator_input: { price: 34 },
      calculator_result: { profit: 25.5 },
      finder_answers: { budget: "under_5k" },
    })).toEqual({ tool: "laser_roi", step: 3, marketing_consent: false });
  });
});
