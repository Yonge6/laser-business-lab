import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("site drawer interaction contract", () => {
  it("keeps a visible mobile backdrop and caps the desktop panel width", () => {
    const css = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
    expect(css).toContain("grid-template-columns: 1fr clamp(390px, 36vw, 520px)");
    expect(css).toContain("width: min(88vw, 410px)");
  });

  it("supports focus trapping, focus restoration, and swipe dismissal", () => {
    const source = fs.readFileSync(path.join(root, "components/marketing/site-drawer.tsx"), "utf8");
    expect(source).toContain("previousFocusRef.current?.focus()");
    expect(source).toContain('event.key !== "Tab"');
    expect(source).toContain("dragRef.current.distance >= 72");
    expect(source).toContain("onPointerCancel={handlePointerEnd}");
  });

  it("links Buer Within with its current bilingual positioning on H5 and iOS", () => {
    const webSource = fs.readFileSync(path.join(root, "components/marketing/site-drawer.tsx"), "utf8");
    const iosSource = fs.readFileSync(path.join(root, "ios/MakerBusinessLab/Views/AppShellView.swift"), "utf8");

    for (const source of [webSource, iosSource]) {
      expect(source).toContain("https://buer.wonderelian.com/");
      expect(source).toContain("Buer Within");
      expect(source).toContain("不二见己");
      expect(source).toContain("Doudoulong, your AI growth companion");
      expect(source).toContain("豆豆龙，你的专属 AI 成长伙伴");
      expect(source).not.toContain("https://human-design.wonderelian.com/");
    }
  });
});
