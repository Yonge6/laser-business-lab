import { describe, expect, it } from "vitest";

import { buildYixiuFocusAppStoreUrl, buildYixiuFocusUrl } from "@/lib/commerce/yixiu";

describe("Yixiu focus referral links", () => {
  it("routes the Maker companion card to the focused Mountain Stream landing page", () => {
    const url = new URL(buildYixiuFocusUrl());

    expect(url.origin).toBe("https://yixiu.wonderelian.com");
    expect(url.pathname).toBe("/mountain-stream-sounds-for-focus/");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: "maker",
      utm_medium: "owned_referral",
      utm_campaign: "focus_sounds",
      utm_content: "focus_companion_card",
    });
  });

  it("uses the Focus custom product page for the iPhone download", () => {
    const url = new URL(buildYixiuFocusAppStoreUrl());

    expect(url.origin).toBe("https://apps.apple.com");
    expect(url.pathname).toBe("/us/app/yixiu-white-noise-sleep/id1461182261");
    expect(url.searchParams.get("ppid")).toBe("7890afd3-dd12-4215-a5c5-17f4ebc28759");
  });
});
