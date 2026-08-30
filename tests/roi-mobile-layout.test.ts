import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("ROI calculator mobile width", () => {
  it("contains wide step controls inside the calculator card", () => {
    const css = readFileSync("app/globals.css", "utf8");

    expect(css).toContain(".calculator-card { min-width: 0; max-width: 100%; overflow: hidden;");
    expect(css).toContain(".calculator-shell { width: 100%; min-width: 0; max-width: 100%; overflow-x: clip;");
    expect(css).toContain("grid-template-columns: repeat(4, minmax(96px, 1fr))");
    expect(css).toContain(".calculator-question { min-width: 0;");
  });
});
