"use client";

import { ATTRIBUTION_KEY, deriveTouch, mergeAttribution, type Attribution } from "@/lib/attribution/storage";

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
