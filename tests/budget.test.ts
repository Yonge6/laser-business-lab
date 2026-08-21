import { describe, expect, it } from "vitest";
import { clampToBudget } from "@/lib/calculators/budget";

describe("equipment budget constraints", () => {
  it("clamps investment below and above a closed range", () => {
    expect(clampToBudget(100, { min: 500, max: 2_999 })).toBe(500);
    expect(clampToBudget(5_599, { min: 500, max: 2_999 })).toBe(2_999);
    expect(clampToBudget(1_499, { min: 500, max: 2_999 })).toBe(1_499);
  });

  it("keeps an open-ended budget unrestricted above its minimum", () => {
    expect(clampToBudget(7_000, { min: 8_000 })).toBe(8_000);
    expect(clampToBudget(25_000, { min: 8_000 })).toBe(25_000);
  });
});
