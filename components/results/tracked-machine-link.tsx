"use client";

import { ArrowSquareOut } from "@phosphor-icons/react";
import { buildOutboundHref } from "@/lib/attribution/client";
import { trackEvent } from "@/lib/analytics/client";
import { machineById, type MachineId } from "@/lib/machines/data";

export function TrackedMachineLink({ machine, tool, result, children, className = "button machine-cta" }: { machine: string; tool: string; result: string; children: React.ReactNode; className?: string }) {
  const target = machineById[machine as MachineId];

  async function follow(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (!target) return;
    const href = buildOutboundHref(target.url, machine, { tool, result });
    await trackEvent("onelaser_outbound_click", { tool, recommendation: machine });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  if (!target) return null;
  return <a href={target.url} onClick={follow} className={className} target="_blank" rel="noopener noreferrer">{children}<ArrowSquareOut weight="bold" /></a>;
}
