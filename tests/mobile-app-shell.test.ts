import { existsSync } from "node:fs";
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

  it("ships the install icons and mobile signal image", () => {
    expect(existsSync("app/apple-icon.png")).toBe(true);
    expect(existsSync("public/icons/icon-192.png")).toBe(true);
    expect(existsSync("public/icons/icon-512.png")).toBe(true);
    expect(existsSync("public/icons/icon-maskable-512.png")).toBe(true);
    expect(existsSync("public/images/mobile/leather-luggage-tag.png")).toBe(true);
  });
});
