import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Attribution } from "@/lib/attribution/storage";
import { createDebouncedCalculatorTracker, trackEvent, trackPageNavigation } from "@/lib/analytics/client";

const attributionMocks = vi.hoisted(() => ({
  capture: vi.fn(),
  read: vi.fn<() => Attribution | null>(),
}));

vi.mock("@/lib/attribution/client", () => ({
  captureAttribution: attributionMocks.capture,
  readAttribution: attributionMocks.read,
}));

const usageProperties = {
  tool: "tumbler_profit",
  category: "laser",
  product_category: "tumblers",
  path: "/calculator/tumbler-profit",
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_EVENT_ENDPOINT", "");
  attributionMocks.read.mockReturnValue(null);
  vi.stubGlobal("window", { gtag: vi.fn(), dispatchEvent: vi.fn() });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("live calculator usage", () => {
  it("does not count default results as usage", () => {
    const emit = vi.fn(async () => undefined);
    createDebouncedCalculatorTracker(usageProperties, emit);
    vi.advanceTimersByTime(5_000);
    expect(emit).not.toHaveBeenCalled();
  });

  it("starts on the first edit and completes once after editing settles", () => {
    const emit = vi.fn(async () => undefined);
    const tracker = createDebouncedCalculatorTracker(usageProperties, emit);
    tracker.recordEdit();
    expect(emit).toHaveBeenCalledExactlyOnceWith("calculator_start", usageProperties);
    vi.advanceTimersByTime(600);
    tracker.recordEdit();
    vi.advanceTimersByTime(749);
    expect(emit).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(emit).toHaveBeenNthCalledWith(2, "calculator_complete", usageProperties);
    tracker.recordEdit();
    vi.advanceTimersByTime(2_000);
    expect(emit).toHaveBeenCalledTimes(2);
  });

  it("does not complete when an edited calculator is unmounted before the delay", () => {
    const emit = vi.fn(async () => undefined);
    const tracker = createDebouncedCalculatorTracker(usageProperties, emit);
    tracker.recordEdit();
    tracker.cancel();
    vi.advanceTimersByTime(2_000);
    expect(emit).toHaveBeenCalledExactlyOnceWith("calculator_start", usageProperties);
  });
});

describe("client navigation attribution", () => {
  it("captures initial and new UTM touches without replacing them on internal links", () => {
    let previous: string | null = null;
    previous = trackPageNavigation("/", "utm_source=pinterest&utm_medium=organic_social", previous);
    previous = trackPageNavigation("/", "utm_source=pinterest&utm_medium=organic_social", previous);
    expect(attributionMocks.capture).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledTimes(2);

    previous = trackPageNavigation("/calculator/tumbler-profit", "", previous);
    expect(attributionMocks.capture).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledTimes(4);

    trackPageNavigation("/calculator/tumbler-profit", "utm_source=youtube&utm_medium=organic_video", previous);
    expect(attributionMocks.capture).toHaveBeenCalledTimes(2);
    expect(window.gtag).toHaveBeenCalledTimes(6);
  });

  it("still records page views when browser storage is restricted", () => {
    attributionMocks.capture.mockImplementationOnce(() => { throw new Error("Storage denied"); });
    expect(() => trackPageNavigation("/learn", "", null)).not.toThrow();
    expect(window.gtag).toHaveBeenCalledWith("event", "maker_v1_page_view", expect.objectContaining({ path: "/learn" }));
  });

  it("sends all five UTM dimensions without calculator inputs or results", async () => {
    const touch = {
      source: "pinterest",
      medium: "organic_social",
      campaign: "tumbler_pricing_us",
      content: "cost_checklist",
      term: "tumbler pricing",
      landingPage: "/calculator/tumbler-profit",
      visitedAt: "2026-10-13T00:00:00Z",
    };
    attributionMocks.read.mockReturnValue({ visitorId: "v", sessionId: "s", first: touch, last: touch, expiresAt: Date.now() + 1_000 });
    await trackEvent("calculator_complete", { ...usageProperties, calculator_input: { sellingPrice: 32 }, calculator_result: { profit: 25 } });
    expect(window.gtag).toHaveBeenCalledWith("event", "maker_v1_calculator_complete", {
      ...usageProperties,
      traffic_source: "pinterest",
      traffic_medium: "organic_social",
      traffic_campaign: "tumbler_pricing_us",
      traffic_content: "cost_checklist",
      traffic_term: "tumbler pricing",
      schema_version: 1,
      surface: "h5",
    });
  });
});
