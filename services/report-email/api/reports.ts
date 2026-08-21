import { handleReportEmail, type ReportEmailEnv } from "../src/index.js";

function readEnvironment(): ReportEmailEnv | null {
  const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.trim();
  const FROM_EMAIL = process.env.FROM_EMAIL?.trim();

  if (!RESEND_API_KEY || !ALLOWED_ORIGINS || !FROM_EMAIL) return null;

  return {
    RESEND_API_KEY,
    RESEND_CONTACTS_API_KEY: process.env.RESEND_CONTACTS_API_KEY?.trim() || undefined,
    ALLOWED_ORIGINS,
    FROM_EMAIL,
    OWNER_EMAIL: process.env.OWNER_EMAIL?.trim() || undefined,
  };
}

const reportsFunction = {
  fetch(request: Request) {
    const env = readEnvironment();
    if (!env) return Response.json({ error: "service_not_configured" }, { status: 503 });
    return handleReportEmail(request, env);
  },
};

export default reportsFunction;
