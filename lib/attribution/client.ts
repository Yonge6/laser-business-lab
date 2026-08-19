"use client";

import { ATTRIBUTION_KEY, attributionToSearchParams, deriveTouch, mergeAttribution, type Attribution } from "@/lib/attribution/storage";

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) ?? "null") as Attribution | null;
    return value && value.expiresAt > Date.now() ? value : null;
  } catch {
    return null;
  }
}

export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const touch = deriveTouch(new URL(window.location.href), document.referrer);
  const existing = readAttribution();
  const sessionId = window.sessionStorage.getItem("lbl_session_id") ?? crypto.randomUUID();
  window.sessionStorage.setItem("lbl_session_id", sessionId);
  const next = mergeAttribution(existing, touch, Date.now(), existing?.visitorId ?? crypto.randomUUID(), sessionId);
  window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  return next;
}

export function buildOutboundHref(machineUrl: string, machine: string, context: { tool?: string; result?: string } = {}) {
  const params = attributionToSearchParams(readAttribution());
  params.set("utm_content", machine);
  params.set("ref", "laserbusinesslab");
  if (context.tool) params.set("tool", context.tool);
  if (context.result) params.set("tool_result", context.result);
  const url = new URL(machineUrl);
  params.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}
