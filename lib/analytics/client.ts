"use client";

import type { AnalyticsEventName, AnalyticsProperties } from "@/lib/analytics/events";
import { readAttribution } from "@/lib/attribution/client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export async function trackEvent(event: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  const attribution = readAttribution();
  const enriched = {
    ...properties,
    traffic_source: attribution?.last.source ?? "direct",
    traffic_campaign: attribution?.last.campaign ?? "none",
    traffic_content: attribution?.last.content ?? "none",
  };

  window.gtag?.("event", event, enriched);

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    const posthog = (await import("posthog-js")).default;
    posthog.capture(event, enriched);
  }

  const endpoint = process.env.NEXT_PUBLIC_EVENT_ENDPOINT;
  if (endpoint) {
    void fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, properties: enriched, attribution }),
      keepalive: true,
    }).catch(() => undefined);
  }
}
