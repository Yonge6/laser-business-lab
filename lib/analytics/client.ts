"use client";

import type { AnalyticsEventName, AnalyticsProperties, MakerAnalyticsSurface } from "@/lib/analytics/events";
import { captureAttribution, readAttribution } from "@/lib/attribution/client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __makerNativeApp?: boolean;
  }
}

const BLOCKED_PROPERTY_KEYS = new Set([
  "email",
  "calculator_input",
  "calculator_result",
  "finder_answers",
]);

export function makerEventName(event: AnalyticsEventName, surface: MakerAnalyticsSurface) {
  return `${surface === "ios" ? "maker_ios_v1" : "maker_v1"}_${event}`;
}

export function safeAnalyticsProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) =>
      !BLOCKED_PROPERTY_KEYS.has(key) &&
      (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    )
  );
}

function analyticsSurface(): MakerAnalyticsSurface {
  return window.__makerNativeApp ? "ios" : "h5";
}

export function trackPageNavigation(pathname: string, query: string, previousNavigation: string | null) {
  const navigation = `${pathname}?${query}`;
  if (navigation === previousNavigation) return navigation;

  // document.referrer remains the original referrer during client navigation.
  // Refresh only a new campaign touch, so internal links retain the existing one.
  if (previousNavigation === null || new URLSearchParams(query).has("utm_source")) {
    try {
      captureAttribution();
    } catch {
      // Restricted browser storage must not prevent page-view measurement.
    }
  }
  void trackEvent("page_view", { path: pathname });
  return navigation;
}

type CalculatorUsageProperties = {
  tool: string;
  category: string;
  product_category: string;
  path: string;
};

export function createDebouncedCalculatorTracker(
  properties: CalculatorUsageProperties,
  emit: typeof trackEvent = trackEvent,
  delayMs = 750,
) {
  let started = false;
  let completed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return {
    recordEdit() {
      if (!started) {
        started = true;
        void emit("calculator_start", properties);
      }
      if (completed) return;
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        completed = true;
        void emit("calculator_complete", properties);
      }, delayMs);
    },
    cancel() {
      if (timer !== null) clearTimeout(timer);
      timer = null;
    },
  };
}

export async function trackEvent(event: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  const attribution = readAttribution();
  const enriched = {
    ...safeAnalyticsProperties(properties),
    traffic_source: attribution?.last.source ?? "direct",
    traffic_medium: attribution?.last.medium ?? "none",
    traffic_campaign: attribution?.last.campaign ?? "none",
    traffic_content: attribution?.last.content ?? "none",
    traffic_term: attribution?.last.term ?? "none",
  };
  const surface = analyticsSurface();
  const productEvent = makerEventName(event, surface);
  const productProperties = { ...enriched, schema_version: 1, surface };

  window.gtag?.("event", event, enriched);
  window.gtag?.("event", productEvent, productProperties);
  window.dispatchEvent(new CustomEvent("maker:analytics", {
    detail: { event: productEvent, ...productProperties },
  }));

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    const posthog = (await import("posthog-js")).default;
    posthog.capture(event, enriched);
    posthog.capture(productEvent, productProperties);
  }

  const endpoint = process.env.NEXT_PUBLIC_EVENT_ENDPOINT;
  if (endpoint) {
    void fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: productEvent, properties: productProperties, attribution }),
      keepalive: true,
    }).catch(() => undefined);
  }
}
