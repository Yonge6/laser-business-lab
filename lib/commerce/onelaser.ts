export const ONE_LASER_ORIGIN = "https://www.1laser.com";

export const oneLaserDestinations = {
  machines: `${ONE_LASER_ORIGIN}/collections/laser-engraving-cutting-marking-machines`,
  consultation: `${ONE_LASER_ORIGIN}/products/sales-consultation-call`,
  xrf: `${ONE_LASER_ORIGIN}/products/onelaser-xrf-desktop-laser-machine`,
  vertigo: `${ONE_LASER_ORIGIN}/products/vertigo-vertical-laser-engraver`,
  cobra14: `${ONE_LASER_ORIGIN}/products/cobra-14-130w-co2-laser-engraver-cutter`,
} as const;

type OneLaserTracking = {
  campaign: "equipment_match" | "roi_result";
  content: string;
  placement: "home_opportunity" | "machine_finder_result" | "roi_report";
};

export function buildOneLaserUrl(destination: string, tracking: OneLaserTracking) {
  const url = new URL(destination, ONE_LASER_ORIGIN);
  if (url.origin !== ONE_LASER_ORIGIN) throw new Error("OneLaser outbound links must stay on 1laser.com");
  url.searchParams.set("utm_source", "maker_business_lab");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", tracking.campaign);
  url.searchParams.set("utm_content", tracking.content);
  url.searchParams.set("mbl_placement", tracking.placement);
  return url.toString();
}
