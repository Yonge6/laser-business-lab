import { describe, expect, it } from "vitest";
import { calculateRoi } from "@/lib/calculators/roi";
import { calculateTumblerProfit } from "@/lib/calculators/tumbler";

describe("calculateRoi", () => {
  it("calculates finite business metrics", () => {
    const result = calculateRoi({
      sellingPrice: 35,
      materialCost: 8,
      packagingCost: 2,
      productionMinutes: 10,
      monthlyOrders: 150,
      workingDays: 22,
      hoursPerDay: 6,
      machinePrice: 5_599,
    });

    expect(result.grossProfitPerItem).toBe(25);
    expect(result.monthlyGrossProfit).toBe(3_750);
    expect(result.annualGrossProfit).toBe(45_000);
    expect(result.productionHours).toBe(25);
    expect(result.paybackMonths).toBeCloseTo(1.493, 2);
  });

  it("does not produce negative or infinite profit output", () => {
    const result = calculateRoi({
      sellingPrice: 0,
      materialCost: 20,
      packagingCost: 5,
      productionMinutes: 0,
      monthlyOrders: 0,
      workingDays: 0,
      hoursPerDay: 0,
      machinePrice: 5_000,
    });

    expect(result.grossProfitPerItem).toBe(0);
    expect(result.monthlyGrossProfit).toBe(0);
    expect(result.paybackMonths).toBeNull();
    expect(result.isProfitable).toBe(false);
    expect(Object.values(result).filter((value) => typeof value === "number").every(Number.isFinite)).toBe(true);
  });
});

describe("calculateTumblerProfit", () => {
  it("calculates current and 3x capacity without promising demand", () => {
    const result = calculateTumblerProfit({
      blankCost: 7,
      sellingPrice: 32,
      engravingMinutes: 4,
      ordersPerDay: 20,
      workingDays: 22,
    });

    expect(result.profitPerTumbler).toBe(25);
    expect(result.monthlyRevenue).toBe(14_080);
    expect(result.monthlyGrossProfit).toBe(11_000);
    expect(result.outputPerShift).toBe(120);
    expect(result.highEfficiencyOutputPerShift).toBe(360);
  });
});
