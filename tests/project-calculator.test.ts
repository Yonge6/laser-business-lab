import { describe, expect, it } from "vitest";
import { findCalculatorProject, projectCalculatorHref, projectRoiPreset } from "@/lib/calculators/project-preset";
import { calculateRoi } from "@/lib/calculators/roi";
import { makerProjects } from "@/lib/projects/project-library";
import { decodeReport, encodeReport } from "@/lib/reports/codec";

describe("project to calculator handoff", () => {
  it("resolves every library project from its calculator link", () => {
    for (const project of makerProjects) {
      const url = new URL(projectCalculatorHref(project), "https://maker.wonderelian.com");
      expect(url.pathname).toBe("/calculator/laser-roi");
      expect(findCalculatorProject(url.searchParams.get("project"))).toBe(project);
    }
  });

  it("falls back safely for missing, unknown, and inherited property names", () => {
    for (const slug of [null, "", "missing-project", "constructor", "__proto__", "toString"]) {
      expect(findCalculatorProject(slug)).toBeUndefined();
    }
  });

  it("starts a serving board with its economics instead of tumbler defaults", () => {
    const project = findCalculatorProject("personalized-serving-board")!;
    expect(projectRoiPreset(project)).toEqual({ sellingPrice: 69, materialCost: 19.32, packagingCost: 0, monthlyOrders: 24 });
  });

  it("preserves small batch volume and currency precision in reports", () => {
    const project = findCalculatorProject("event-tumbler-batch")!;
    const input = { ...projectRoiPreset(project), productionMinutes: 10, workingDays: 22, hoursPerDay: 6, machinePrice: 5599 };
    const result = calculateRoi(input);
    expect(input.monthlyOrders).toBe(4);
    expect(result.grossProfitPerItem).toBe(270);
    expect(result.monthlyGrossProfit).toBe(1080);
    const report = decodeReport(encodeReport({ version: 1, kind: "roi", product: project.title, input, result }));
    expect(report?.product).toBe("Event Tumbler Batch");
    expect(report?.input.monthlyOrders).toBe(4);
    expect(report?.result.monthlyGrossProfit).toBe(1080);
  });

  it("reproduces every project's illustrative profit within cent rounding", () => {
    for (const project of makerProjects) {
      const input = { ...projectRoiPreset(project), productionMinutes: 10, workingDays: 22, hoursPerDay: 6, machinePrice: 5599 };
      const result = calculateRoi(input);
      expect(Math.abs(result.grossProfitPerItem - project.grossProfit)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(result.monthlyGrossProfit - project.estimatedMonthlyGrossProfit)).toBeLessThanOrEqual(input.monthlyOrders * 0.005);
    }
  });
});
