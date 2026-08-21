import { afterEach, describe, expect, it, vi } from "vitest";

import { handleReportEmail, type ReportEmailEnv } from "@/services/report-email/src/index";

const env: ReportEmailEnv = {
  RESEND_API_KEY: "test_key",
  RESEND_CONTACTS_API_KEY: "test_contacts_key",
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
      marketingConsent: false,
      ...overrides,
    }),
  });
}

function vercelReportRequest(overrides: Record<string, unknown> = {}, origin = "https://maker.wonderelian.com") {
  return new Request("https://maker-business-lab-report-email.vercel.app/api/reports", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({
      email: "maker@example.com",
      tool: "machine_finder",
      result: "XRF",
      reportUrl: "https://maker.wonderelian.com/report/?id=abc",
      locale: "en",
      requestId: "request-123456",
      company: "",
      marketingConsent: false,
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
    expect(await response.json()).toEqual({ delivered: true, id: "email_123", marketingSubscribed: false });
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

  it("accepts the Vercel function route", async () => {
    const resend = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_vercel" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(vercelReportRequest(), env);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_vercel", marketingSubscribed: false });
  });

  it("adds an explicitly opted-in email to Resend Contacts", async () => {
    const resend = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "email_optin" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "contact_123" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest({ marketingConsent: true }), env);
    const contactRequest = resend.mock.calls[1][1] as RequestInit;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_optin", marketingSubscribed: true });
    expect(resend.mock.calls[1][0]).toBe("https://api.resend.com/contacts");
    expect((contactRequest.headers as Record<string, string>).authorization).toBe("Bearer test_contacts_key");
    expect(JSON.parse(String(contactRequest.body))).toEqual({ email: "maker@example.com", unsubscribed: false });
  });

  it("keeps report delivery successful when Contacts is not configured", async () => {
    const resend = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_without_contacts" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest({ marketingConsent: true }), { ...env, RESEND_CONTACTS_API_KEY: undefined });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_without_contacts", marketingSubscribed: false });
    expect(resend).toHaveBeenCalledTimes(1);
  });

  it("keeps report delivery successful when Contacts returns an error", async () => {
    const resend = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "email_contacts_error" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "forbidden" }), { status: 403 }));
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest({ marketingConsent: true }), env);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_contacts_error", marketingSubscribed: false });
  });

  it("re-subscribes an existing Contact after fresh explicit consent", async () => {
    const resend = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "email_existing_contact" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "already exists" }), { status: 409 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "contact_existing" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);

    const response = await handleReportEmail(reportRequest({ marketingConsent: true }), env);
    const updateRequest = resend.mock.calls[2][1] as RequestInit;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_existing_contact", marketingSubscribed: true });
    expect(resend.mock.calls[2][0]).toBe("https://api.resend.com/contacts/maker%40example.com");
    expect(updateRequest.method).toBe("PATCH");
    expect(JSON.parse(String(updateRequest.body))).toEqual({ unsubscribed: false });
  });

  it("does not add an email to Contacts without explicit consent", async () => {
    const resend = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_transactional" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);

    await handleReportEmail(reportRequest({ marketingConsent: false }), env);

    expect(resend).toHaveBeenCalledTimes(1);
  });

  it("safely treats a missing consent field from an older client as opt-out", async () => {
    const resend = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_legacy" }), { status: 200 }));
    vi.stubGlobal("fetch", resend);
    const request = reportRequest();
    const payload = await request.json() as Record<string, unknown>;
    delete payload.marketingConsent;
    const legacyRequest = new Request(request.url, {
      method: "POST",
      headers: { origin: "https://maker.wonderelian.com", "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await handleReportEmail(legacyRequest, env);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivered: true, id: "email_legacy", marketingSubscribed: false });
    expect(resend).toHaveBeenCalledTimes(1);
  });
});
