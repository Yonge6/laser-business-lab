export const BAMBU_PRINTERS_URL = "https://bambulab.com/en-us/compare";

export function buildBambuUrl(content: string, placement: "home_opportunity" | "opportunity_finder_result" | "machine_finder_result" | "roi_report" = "home_opportunity") {
  const url = new URL(BAMBU_PRINTERS_URL);
  url.searchParams.set("utm_source", "elian");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "equipment_match");
  url.searchParams.set("utm_content", content);
  url.searchParams.set("mbl_placement", placement);
  return url.toString();
}
