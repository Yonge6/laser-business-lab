import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("bilingual typography", () => {
  it("keeps the English display face and loads a dedicated Chinese display face", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");

    expect(layout).toContain("ZCOOL_QingKe_HuangYou");
    expect(layout).toContain('variable: "--font-display-en"');
    expect(layout).toContain('variable: "--font-display-zh"');
    expect(layout).toContain('variable: "--font-body-en"');
  });

  it("switches Chinese display and body fonts from the document language", () => {
    const css = readFileSync("app/globals.css", "utf8");

    expect(css).toContain('html[lang="zh-CN"]');
    expect(css).toContain("--font-display: var(--font-display-en), var(--font-body-zh)");
    expect(css).toContain("--font-body: var(--font-body-en), var(--font-body-zh)");
    expect(css).toContain('"PingFang SC"');
  });

  it("keeps Latin branding and numeric data identical in both languages", () => {
    const css = readFileSync("app/globals.css", "utf8");

    expect(css).toContain("--font-numeric: var(--font-display-en)");
    expect(css).toContain(".brand-lockup strong { font-family: var(--font-display-en)");
    expect(css).toContain('html[lang="zh-CN"] body :where(');
    expect(css).toContain("font-family: var(--font-numeric), sans-serif !important");
    expect(css).toContain("font-variant-numeric: lining-nums tabular-nums");
  });

  it("keeps Chinese interface type upright while preserving its existing bold weights", () => {
    const css = readFileSync("app/globals.css", "utf8");

    expect(css).toContain('html[lang="zh-CN"] body *');
    expect(css).toContain("font-style: normal !important");
    expect(css).toContain('html[lang="zh-CN"] body :where(h1, h2, h3)');
    expect(css).toContain("font-weight: 800");
    expect(css).toContain("line-height: 1.08 !important");
  });

  it("synchronizes the document language for restored App and H5 sessions", () => {
    const provider = readFileSync("components/providers/language-provider.tsx", "utf8");

    expect(provider).toContain('document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"');
    expect(provider).toContain("}, [locale]);");
  });
});
