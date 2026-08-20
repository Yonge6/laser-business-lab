import { afterEach, describe, expect, it, vi } from "vitest";

import { handleReportEmail, type ReportEmailEnv } from "@/services/report-email/src/index";

const env: ReportEmailEnv = {
  RESEND_API_KEY: "test_key",
  ALLOWED_ORIGINS: "https://maker.wonderelian.com,http://127.0.0.1:4173",
  FROM_EMAIL: "Maker Business Lab <reports@send.wonderelian.com>",
  OWNER_EMAIL: "owner@example.com",
};

function reportRequest(overrides: Record<string, unknown> = {}, origin = "https://maker.wonderelian.com") {
  return new Request("https://mailer.example.workers.dev/reports", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({
      email: "maker@example.com",
      tool: "laser_roi",
      result: "personalized-tumblers",
      reportUrl: "https://maker.wonderelian.com/report/?id=abc",
      locale: "en",
      requestId: "request-123456",
      company: "",
      ...overrides,
    }),
  });
}

describe("report email worker", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("delivers a validated report with an idempotency key", async () => {
    const resend = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_123" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest(), env);
    const request = resend.mock.calls[0][1] as RequestInit;
    const message = JSON.parse(String(request.body));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_123" });
    expect((request.headers as Record<string, string>)["idempotency-key"]).toBe("request-123456");
    expect(message.to).toEqual(["maker@example.com"]);
    expect(message.bcc).toEqual(["owner@example.com"]);
    expect(message.html).toContain("https://maker.wonderelian.com/report/?id=abc");
  });

  it("rejects an untrusted origin before delivery", async () => {
    const resend = vi.fn();
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest({}, "https://attacker.example"), env);

    expect(response.status).toBe(403);
    expect(resend).not.toHaveBeenCalled();
  });

  it("rejects bot honeypot submissions", async () => {
    const resend = vi.fn();
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest({ company: "spam" }), env);

    expect(response.status).toBe(400);
    expect(resend).not.toHaveBeenCalled();
  });
});
