import { NextResponse } from "next/server";
import { insertRows } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; tool?: string; result?: string; attribution?: { sessionId?: string; visitorId?: string } };
    const email = body.email?.trim().toLowerCase();
    if (!email || email.length > 254 || !emailPattern.test(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

    await insertRows("leads", {
      email,
      session_id: body.attribution?.sessionId ?? null,
      visitor_id: body.attribution?.visitorId ?? null,
      source_tool: body.tool?.slice(0, 80) ?? null,
      result: body.result?.slice(0, 200) ?? null,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save lead" }, { status: 500 });
  }
}
