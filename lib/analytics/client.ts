"use client";

import type { AnalyticsEventName, AnalyticsProperties, MakerAnalyticsSurface } from "@/lib/analytics/events";
import { readAttribution } from "@/lib/attribution/client";

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

export async function trackEvent(event: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  const attribution = readAttribution();
  const enriched = {
    ...safeAnalyticsProperties(properties),
    traffic_source: attribution?.last.source ?? "direct",
    traffic_campaign: attribution?.last.campaign ?? "none",
    traffic_content: attribution?.last.content ?? "none",
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
