import { describe, expect, it } from "vitest";
import { decodeReport, encodeReport, type SharedReport } from "@/lib/reports/codec";

const report: SharedReport = {
  version: 1,
  kind: "roi",
  product: "Tumblers",
  input: {
    sellingPrice: 35,
    materialCost: 8,
    packagingCost: 2,
    monthlyOrders: 150,
    productionMinutes: 10,
    machinePrice: 5_599,
  },
  result: {
    grossProfitPerItem: 25,
    monthlyGrossProfit: 3_750,
    productionHours: 25,
    paybackMonths: 1.49,
    profiles: ["HIGH-MARGIN", "MEDIUM-VOLUME"],
  },
};

describe("share report codec", () => {
  it("round trips a safe report payload", () => {
    expect(decodeReport(encodeReport(report))).toEqual(report);
  });

  it("rejects malformed report IDs", () => {
    expect(decodeReport("not-a-report")).toBeNull();
  });
});
