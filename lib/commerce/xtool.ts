export const XTOOL_WONDERPRESS_URL = "https://www.xtool.com/products/xtool-wonderpress-modular-auto-heat-press-for-2d-transfers-and-3d-creations";

export function buildXToolUrl(content: string, placement: "home_opportunity" | "machine_finder_result" = "home_opportunity") {
  const url = new URL(XTOOL_WONDERPRESS_URL);
  url.searchParams.set("utm_source", "maker_business_lab");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "equipment_match");
  url.searchParams.set("utm_content", content);
  url.searchParams.set("mbl_placement", placement);
  return url.toString();
}
