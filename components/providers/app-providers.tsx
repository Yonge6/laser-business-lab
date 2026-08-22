"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { captureAttribution } from "@/lib/attribution/client";
import { trackEvent } from "@/lib/analytics/client";
import { LanguageProvider } from "@/components/providers/language-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        person_profiles: "identified_only",
      });
    }
  }, []);

  useEffect(() => {
    void trackEvent("page_view", { path: pathname });
  }, [pathname]);

  return <LanguageProvider>{children}</LanguageProvider>;
}
