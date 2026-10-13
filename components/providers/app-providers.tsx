"use client";

import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { trackPageNavigation } from "@/lib/analytics/client";
import { LanguageProvider } from "@/components/providers/language-provider";

function NavigationAnalytics() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const previousNavigation = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        person_profiles: "identified_only",
      });
    }
  }, []);

  useEffect(() => {
    previousNavigation.current = trackPageNavigation(pathname, query, previousNavigation.current);
  }, [pathname, query]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Suspense fallback={null}><NavigationAnalytics /></Suspense>
      {children}
    </LanguageProvider>
  );
}
