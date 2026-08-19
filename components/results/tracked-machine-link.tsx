"use client";

import { ArrowSquareOut } from "@phosphor-icons/react";
import { buildOutboundHref } from "@/lib/attribution/client";
import { trackEvent } from "@/lib/analytics/client";

export function TrackedMachineLink({ machine, tool, result, children, className = "button machine-cta" }: { machine: string; tool: string; result: string; children: React.ReactNode; className?: string }) {
  async function follow(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const href = buildOutboundHref(machine, { tool, result });
    await trackEvent("onelaser_outbound_click", { tool, recommendation: machine });
    window.location.assign(href);
  }

  return <a href={`/go/${machine}`} onClick={follow} className={className}>{children}<ArrowSquareOut weight="bold" /></a>;
}
