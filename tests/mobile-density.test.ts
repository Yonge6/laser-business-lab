import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("compact mobile experience", () => {
  const css = readFileSync("app/globals.css", "utf8");

  it("keeps controls thumb-sized while reducing vertical page work", () => {
    expect(css).toContain("/* Mobile compact experience: same information architecture, less vertical work. */");
    expect(css).toContain(".choice-card { min-height: 56px");
    expect(css).toContain(".quest-question { min-height: 430px; padding: 26px 16px; }");
    expect(css).toContain(".calculator-question { padding: 26px 16px; }");
  });

  it("compacts the opportunity cards without changing their content structure", () => {
    expect(css).toContain(".opportunity-card { height: 330px");
    expect(css).toContain(".score-value { font-size: 48px; }");
    expect(css).toContain(".project-library-section { padding-block: 48px 58px; }");
  });
});
