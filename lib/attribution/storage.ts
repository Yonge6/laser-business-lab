export const ATTRIBUTION_KEY = "lbl_attribution_v1";
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1_000;

export type Touch = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPage: string;
  visitedAt: string;
};

export type Attribution = {
  visitorId: string;
  sessionId: string;
  first: Touch;
  last: Touch;
  expiresAt: number;
};

const valueOr = (params: URLSearchParams, key: string, fallback: string) => params.get(key)?.trim() || fallback;

export function deriveTouch(url: URL, referrer = "", now = new Date()): Touch {
  const hasUtm = url.searchParams.has("utm_source");
  let source = valueOr(url.searchParams, "utm_source", "direct");
  let medium = valueOr(url.searchParams, "utm_medium", "none");

  if (!hasUtm && referrer) {
    try {
      const referringHost = new URL(referrer).hostname;
      if (referringHost && referringHost !== url.hostname) {
        source = referringHost;
        medium = "referral";
      }
    } catch {
      // Keep direct attribution when the referrer is malformed.
    }
  }

  return {
    source,
    medium,
    campaign: valueOr(url.searchParams, "utm_campaign", "none"),
    content: valueOr(url.searchParams, "utm_content", "none"),
    term: valueOr(url.searchParams, "utm_term", "none"),
    landingPage: `${url.pathname}${url.search}`,
    visitedAt: now.toISOString(),
  };
}

export function mergeAttribution(existing: Attribution | null, touch: Touch, now = Date.now(), visitorId = crypto.randomUUID(), sessionId = crypto.randomUUID()): Attribution {
  const validExisting = existing && existing.expiresAt > now ? existing : null;
  return {
    visitorId: validExisting?.visitorId ?? visitorId,
    sessionId,
    first: validExisting?.first ?? touch,
    last: touch.source === "direct" && validExisting ? validExisting.last : touch,
    expiresAt: now + ATTRIBUTION_TTL_MS,
  };
}

export function attributionToSearchParams(attribution: Attribution | null) {
  const touch = attribution?.last ?? attribution?.first;
  const params = new URLSearchParams();
  if (!touch || !attribution) return params;
  params.set("utm_source", touch.source);
  params.set("utm_medium", touch.medium);
  params.set("utm_campaign", touch.campaign);
  params.set("utm_content", touch.content);
  if (touch.term !== "none") params.set("utm_term", touch.term);
  params.set("visitor_id", attribution.visitorId);
  params.set("session_id", attribution.sessionId);
  return params;
}
