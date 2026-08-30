import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("site drawer interaction contract", () => {
  it("keeps a visible mobile backdrop and caps the desktop panel width", () => {
    const css = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
    expect(css).toContain("grid-template-columns: 1fr clamp(390px, 36vw, 520px)");
    expect(css).toContain("width: min(calc(100% - 44px), 420px)");
  });

  it("supports focus trapping, focus restoration, and swipe dismissal", () => {
    const source = fs.readFileSync(path.join(root, "components/marketing/site-drawer.tsx"), "utf8");
    expect(source).toContain("previousFocusRef.current?.focus()");
    expect(source).toContain('event.key !== "Tab"');
    expect(source).toContain("dragRef.current.distance >= 72");
    expect(source).toContain("onPointerCancel={handlePointerEnd}");
  });
});
