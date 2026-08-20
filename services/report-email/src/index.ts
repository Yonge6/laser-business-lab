type RateLimiter = {
  limit(input: { key: string }): Promise<{ success: boolean }>;
};

export type ReportEmailEnv = {
  RESEND_API_KEY: string;
  ALLOWED_ORIGINS: string;
  FROM_EMAIL: string;
  OWNER_EMAIL?: string;
  REPORT_RATE_LIMITER?: RateLimiter;
};

type ReportRequest = {
  email: string;
  tool: string;
  result: string;
  reportUrl: string;
  locale: "en" | "zh";
  requestId: string;
  company?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOOL_PATTERN = /^[a-z][a-z0-9_]{1,49}$/;

function corsHeaders(origin: string) {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function json(data: unknown, status: number, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(origin ? corsHeaders(origin) : {}),
    },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);
}

function parsePayload(value: unknown, allowedOrigins: Set<string>): ReportRequest | null {
  if (!value || typeof value !== "object") return null;
  const payload = value as Partial<ReportRequest>;
  if (typeof payload.company === "string" && payload.company.trim()) return null;
  if (typeof payload.email !== "string" || payload.email.length > 254 || !EMAIL_PATTERN.test(payload.email)) return null;
  if (typeof payload.tool !== "string" || !TOOL_PATTERN.test(payload.tool)) return null;
  if (typeof payload.result !== "string" || !payload.result.trim() || payload.result.length > 256) return null;
  if (payload.locale !== "en" && payload.locale !== "zh") return null;
  if (typeof payload.requestId !== "string" || !/^[a-zA-Z0-9-]{8,80}$/.test(payload.requestId)) return null;
  if (typeof payload.reportUrl !== "string" || payload.reportUrl.length > 3_000) return null;
  try {
    const reportUrl = new URL(payload.reportUrl);
    if (reportUrl.protocol !== "https:" && reportUrl.hostname !== "127.0.0.1" && reportUrl.hostname !== "localhost") return null;
    if (!allowedOrigins.has(reportUrl.origin)) return null;
  } catch {
    return null;
  }
  return {
    email: payload.email.trim().toLowerCase(),
    tool: payload.tool,
    result: payload.result.trim(),
    reportUrl: payload.reportUrl,
    locale: payload.locale,
    requestId: payload.requestId,
  };
}

async function rateLimitKey(email: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function handleReportEmail(request: Request, env: ReportEmailEnv) {
  const allowedOrigins = new Set(env.ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean));
  const origin = request.headers.get("origin") ?? "";
  const pathname = new URL(request.url).pathname;

  if (request.method === "GET" && (pathname === "/health" || pathname === "/api/health")) {
    return json({ ok: true }, 200);
  }
  if (!origin || !allowedOrigins.has(origin)) return json({ error: "origin_not_allowed" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST" || (pathname !== "/reports" && pathname !== "/api/reports")) return json({ error: "not_found" }, 404, origin);
  if (Number(request.headers.get("content-length") ?? 0) > 12_000) return json({ error: "payload_too_large" }, 413, origin);

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }
  const payload = parsePayload(rawPayload, allowedOrigins);
  if (!payload) return json({ error: "invalid_request" }, 400, origin);

  if (env.REPORT_RATE_LIMITER) {
    const outcome = await env.REPORT_RATE_LIMITER.limit({ key: await rateLimitKey(payload.email) });
    if (!outcome.success) return json({ error: "rate_limited" }, 429, origin);
  }

  const isChinese = payload.locale === "zh";
  const subject = isChinese ? `你的 Maker 商业结果：${payload.result}` : `Your maker business result: ${payload.result}`;
  const title = isChinese ? "你的 Maker 商业结果已准备好" : "Your maker business result is ready";
  const action = isChinese ? "打开完整结果" : "Open the full result";
  const note = isChinese ? "结果为估算值，请在投资前通过小批量测试验证。" : "Results are estimates. Validate with a small test before investing.";
  const safeResult = escapeHtml(payload.result);
  const safeUrl = escapeHtml(payload.reportUrl);
  const message = {
    from: env.FROM_EMAIL,
    to: [payload.email],
    ...(env.OWNER_EMAIL && env.OWNER_EMAIL.toLowerCase() !== payload.email ? { bcc: [env.OWNER_EMAIL] } : {}),
    subject,
    text: `${title}\n\n${payload.result}\n${payload.reportUrl}\n\n${note}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111"><div style="height:8px;background:#e7310e"></div><h1>${escapeHtml(title)}</h1><p style="font-size:18px">${safeResult}</p><p><a href="${safeUrl}" style="display:inline-block;background:#e7310e;color:#fff;padding:14px 22px;text-decoration:none;font-weight:700">${escapeHtml(action)}</a></p><p style="color:#666">${escapeHtml(note)}</p></div>`,
  };
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
      "idempotency-key": payload.requestId,
    },
    body: JSON.stringify(message),
  });
  if (!resendResponse.ok) return json({ error: "delivery_failed" }, 502, origin);
  const delivered = await resendResponse.json() as { id?: string };
  return json({ delivered: true, id: delivered.id }, 200, origin);
}

const worker = {
  fetch(request: Request, env: ReportEmailEnv) {
    return handleReportEmail(request, env);
  },
};

export default worker;
