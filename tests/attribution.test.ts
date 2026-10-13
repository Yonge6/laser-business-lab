import { describe, expect, it } from "vitest";
import { ATTRIBUTION_TTL_MS, attributionToSearchParams, deriveTouch, mergeAttribution, withoutLandingQuery } from "@/lib/attribution/storage";

describe("attribution", () => {
  it("preserves first touch and updates attributable last touch", () => {
    const first = deriveTouch(new URL("https://laserbusinesslab.com/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=laser_roi&utm_content=video_023"), "", new Date("2026-08-01T00:00:00Z"));
    const initial = mergeAttribution(null, first, 1_000, "visitor-1", "session-1");
    const second = deriveTouch(new URL("https://laserbusinesslab.com/calculator?utm_source=google&utm_medium=cpc&utm_campaign=maker_profit"), "", new Date("2026-08-02T00:00:00Z"));
    const merged = mergeAttribution(initial, second, 2_000, "visitor-2", "session-2");

    expect(merged.first.source).toBe("tiktok");
    expect(merged.last.source).toBe("google");
    expect(merged.visitorId).toBe("visitor-1");
    expect(merged.expiresAt).toBe(2_000 + ATTRIBUTION_TTL_MS);
  });

  it("uses referrer when UTMs are absent", () => {
    const touch = deriveTouch(new URL("https://laserbusinesslab.com/learn"), "https://www.reddit.com/r/lasercutting/");
    expect(touch.source).toBe("www.reddit.com");
    expect(touch.medium).toBe("referral");
  });

  it("builds outbound UTMs from stored attribution", () => {
    const touch = deriveTouch(new URL("https://laserbusinesslab.com/?utm_source=youtube&utm_medium=organic_video&utm_campaign=roi"));
    const attribution = mergeAttribution(null, touch, 1_000, "v", "s");
    const params = attributionToSearchParams(attribution);
    expect(params.get("utm_source")).toBe("youtube");
    expect(params.get("visitor_id")).toBe("v");
  });

  it("keeps UTM dimensions without storing private report query data", () => {
    const touch = deriveTouch(new URL("https://maker.wonderelian.com/report/?id=private-cost-model&utm_source=pinterest&utm_campaign=pricing#result"));
    expect(touch.landingPage).toBe("/report/");
    expect(touch.source).toBe("pinterest");
    expect(touch.campaign).toBe("pricing");
  });

  it("sanitizes older stored query data while preserving first and last touches", () => {
    const touch = deriveTouch(new URL("https://maker.wonderelian.com/?utm_source=pinterest"));
    const original = mergeAttribution(null, touch, 1_000, "visitor", "session");
    original.first.landingPage = "/report/?id=private-cost-model#result";
    const safe = withoutLandingQuery(original);
    expect(safe.first.landingPage).toBe("/report/");
    expect(safe.first.source).toBe("pinterest");
    expect(safe.visitorId).toBe("visitor");
    expect(original.first.landingPage).toContain("private-cost-model");
  });
});
