"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";
import { captureAttribution } from "@/lib/attribution/client";
import { trackEvent } from "@/lib/analytics/client";
import { LanguageProvider } from "@/components/providers/language-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    captureAttribution();
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        person_profiles: "identified_only",
      });
    }
    void trackEvent("page_view", { path: window.location.pathname });
  }, []);

  return <LanguageProvider>{children}</LanguageProvider>;
}
