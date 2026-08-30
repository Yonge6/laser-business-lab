import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("mobile app shell", () => {
  it("publishes a standalone portrait manifest with install icons", () => {
    const value = manifest();

    expect(value.display).toBe("standalone");
    expect(value.orientation).toBe("portrait");
    expect(value.theme_color).toBe("#e7310e");
    expect(value.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192" }),
      expect.objectContaining({ sizes: "512x512" }),
      expect.objectContaining({ purpose: "maskable" }),
    ]));
  });

  it("ships the install icons", () => {
    expect(existsSync("app/apple-icon.png")).toBe(true);
    expect(existsSync("public/icons/icon-192.png")).toBe(true);
    expect(existsSync("public/icons/icon-512.png")).toBe(true);
    expect(existsSync("public/icons/icon-maskable-512.png")).toBe(true);
  });

  it("uses the same homepage content structure on desktop and mobile", () => {
    const home = readFileSync("components/marketing/home-experience.tsx", "utf8");
    const css = readFileSync("app/globals.css", "utf8");

    expect(home).not.toContain("MobileAppHome");
    expect(home).toContain('className="hero-section shell"');
    expect(home).toContain('className="opportunity-showcase shell"');
    expect(home).toContain("<ProjectLibrary compact />");
    expect(home).toContain('className="game-path-section"');
    expect(home).toContain('className="toolkit-section shell"');
    expect(css).not.toContain(".mobile-app-home ~");
  });

  it("keeps the H5 tab bar aligned with the native App tabs", () => {
    const navigation = readFileSync("components/marketing/mobile-bottom-nav.tsx", "utf8");
    const css = readFileSync("app/globals.css", "utf8");

    expect(navigation).toContain('["Learn", "/learn", BookOpenText]');
    expect(navigation).toContain('["学习", "/learn", BookOpenText]');
    expect(navigation).toContain('["Calculate", "/calculator", Calculator]');
    expect(navigation).not.toContain('"Saved"');
    expect(css).toContain("left: 12px; right: 12px; bottom: calc(8px + env(safe-area-inset-bottom))");
    expect(css).toContain("border-radius: 25px");
  });
});
