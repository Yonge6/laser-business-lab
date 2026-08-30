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
    expect(css).toContain("--font-display: var(--font-display-en), var(--font-display-zh)");
    expect(css).toContain('"PingFang SC"');
  });

  it("synchronizes the document language for restored App and H5 sessions", () => {
    const provider = readFileSync("components/providers/language-provider.tsx", "utf8");

    expect(provider).toContain('document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"');
    expect(provider).toContain("}, [locale]);");
  });
});
