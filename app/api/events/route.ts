import { NextResponse } from "next/server";
import { insertRows } from "@/lib/supabase/server";
import type { AnalyticsEventName } from "@/lib/analytics/events";

const allowedEvents = new Set<AnalyticsEventName>([
  "page_view", "calculator_start", "calculator_step_completed", "calculator_complete", "opportunity_finder_start", "opportunity_finder_complete", "machine_finder_start", "machine_finder_complete", "recommendation_view", "recommendation_click", "onelaser_outbound_click", "email_capture", "share_result",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json() as { event?: AnalyticsEventName; properties?: Record<string, unknown>; attribution?: { visitorId?: string; sessionId?: string; first?: Record<string, unknown>; last?: Record<string, unknown> } };
    if (!body.event || !allowedEvents.has(body.event)) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    const properties = body.properties ?? {};
    const attribution = body.attribution;
    const sessionId = attribution?.sessionId ?? null;
    const visitorId = attribution?.visitorId ?? null;

    if (sessionId && visitorId) {
      await insertRows("sessions", {
        id: sessionId,
        visitor_id: visitorId,
        first_source: attribution?.first?.source ?? null,
        first_medium: attribution?.first?.medium ?? null,
        first_campaign: attribution?.first?.campaign ?? null,
        first_content: attribution?.first?.content ?? null,
        last_source: attribution?.last?.source ?? null,
        last_medium: attribution?.last?.medium ?? null,
        last_campaign: attribution?.last?.campaign ?? null,
        last_content: attribution?.last?.content ?? null,
        landing_page: attribution?.first?.landingPage ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id", resolution: "merge-duplicates" });
    }

    await insertRows("analytics_events", { session_id: sessionId, visitor_id: visitorId, event_name: body.event, properties });

    if (body.event === "calculator_complete") {
      await insertRows("calculator_results", {
        session_id: sessionId,
        calculator_type: properties.tool ?? "unknown",
        input_json: properties.calculator_input ?? {},
        result_json: properties.calculator_result ?? {},
        recommended_machine: properties.recommendation ?? null,
      });
    }

    if (body.event === "machine_finder_complete" || body.event === "opportunity_finder_complete") {
      await insertRows("machine_finder_results", {
        session_id: sessionId,
        finder_type: properties.tool ?? "unknown",
        answer_json: properties.finder_answers ?? {},
        result_json: { recommendation: properties.recommendation ?? null },
        recommended_machine: properties.recommendation ?? null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true, persisted: false });
  }
}
