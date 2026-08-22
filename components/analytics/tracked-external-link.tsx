"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { trackEvent } from "@/lib/analytics/client";

type TrackedExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  analytics: Record<string, unknown>;
};

export function TrackedExternalLink({ href, analytics, onClick, ...props }: TrackedExternalLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    let destinationDomain = "unknown";
    try {
      destinationDomain = new URL(href).hostname;
    } catch {
      destinationDomain = "invalid";
    }

    void trackEvent("outbound_click", {
      ...analytics,
      destination_domain: destinationDomain,
      destination_url: href,
    });
    onClick?.(event);
  }

  return <a {...props} href={href} onClick={handleClick} />;
}
