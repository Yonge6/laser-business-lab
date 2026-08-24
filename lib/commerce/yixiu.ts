const YIXIU_FOCUS_ORIGIN = "https://yixiu.wonderelian.com";
const YIXIU_APP_STORE_URL = "https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261";
const YIXIU_FOCUS_PRODUCT_PAGE_ID = "7890afd3-dd12-4215-a5c5-17f4ebc28759";

export function buildYixiuFocusUrl(content = "focus_companion_card") {
  const url = new URL("/mountain-stream-sounds-for-focus/", YIXIU_FOCUS_ORIGIN);
  url.searchParams.set("utm_source", "maker");
  url.searchParams.set("utm_medium", "owned_referral");
  url.searchParams.set("utm_campaign", "focus_sounds");
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function buildYixiuFocusAppStoreUrl() {
  const url = new URL(YIXIU_APP_STORE_URL);
  url.searchParams.set("ppid", YIXIU_FOCUS_PRODUCT_PAGE_ID);
  return url.toString();
}
