import { NextResponse } from "next/server";
import { isMachineId, machineById } from "@/lib/machines/data";
import { insertRows } from "@/lib/supabase/server";

export async function GET(request: Request, context: { params: Promise<{ machine: string }> }) {
  const { machine } = await context.params;
  if (!isMachineId(machine)) return NextResponse.json({ error: "Unknown machine" }, { status: 404 });

  const incoming = new URL(request.url);
  const destination = new URL(machineById[machine].url);
  const source = incoming.searchParams.get("utm_source") || "laserbusinesslab";
  const medium = incoming.searchParams.get("utm_medium") || "referral";
  const campaign = incoming.searchParams.get("utm_campaign") || incoming.searchParams.get("tool") || "machine_finder";
  const content = incoming.searchParams.get("utm_content") || machine;
  destination.searchParams.set("utm_source", source);
  destination.searchParams.set("utm_medium", medium);
  destination.searchParams.set("utm_campaign", campaign);
  destination.searchParams.set("utm_content", content);
  const term = incoming.searchParams.get("utm_term");
  if (term) destination.searchParams.set("utm_term", term);
  destination.searchParams.set("ref", "laserbusinesslab");

  try {
    await insertRows("outbound_clicks", {
      session_id: incoming.searchParams.get("session_id"),
      visitor_id: incoming.searchParams.get("visitor_id"),
      machine,
      destination: destination.toString(),
      source,
      medium,
      campaign,
      content,
      tool: incoming.searchParams.get("tool") || "unknown",
      tool_result: incoming.searchParams.get("tool_result"),
    });
  } catch {
    // A tracking outage must never block a valid outbound visit.
  }

  return NextResponse.redirect(destination, 302);
}
