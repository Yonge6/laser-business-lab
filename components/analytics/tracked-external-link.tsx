"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { withElianSource } from "@/lib/commerce/outbound";
import { trackEvent } from "@/lib/analytics/client";

type TrackedExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  analytics: Record<string, unknown>;
};

export function TrackedExternalLink({ href, analytics, onClick, ...props }: TrackedExternalLinkProps) {
  const attributedHref = withElianSource(href);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    let destinationDomain = "unknown";
    try {
      destinationDomain = new URL(attributedHref).hostname;
    } catch {
      destinationDomain = "invalid";
    }

    void trackEvent("outbound_click", {
      ...analytics,
      destination_domain: destinationDomain,
      destination_url: attributedHref,
    });
    onClick?.(event);
  }

  return <a {...props} href={attributedHref} onClick={handleClick} />;
}
