export const ONE_LASER_ORIGIN = "https://www.1laser.com";

export const oneLaserDestinations = {
  machines: `${ONE_LASER_ORIGIN}/collections/laser-engraving-cutting-marking-machines`,
  consultation: `${ONE_LASER_ORIGIN}/products/sales-consultation-call`,
  xrf: `${ONE_LASER_ORIGIN}/products/onelaser-xrf-desktop-laser-machine`,
  vertigo: `${ONE_LASER_ORIGIN}/products/vertigo-vertical-laser-engraver`,
  hydra9Gen2: `${ONE_LASER_ORIGIN}/products/hydra-9-gen-2-70w-rf-co2-dual-laser-machine`,
  cobra10: `${ONE_LASER_ORIGIN}/products/cobra-10-100w-co2-laser-engraver-cutter`,
  cobra14: `${ONE_LASER_ORIGIN}/products/cobra-14-130w-co2-laser-engraver-cutter`,
} as const;

export const oneLaserOpportunityDestinations: Record<string, string> = {
  "personalized-tumblers": oneLaserDestinations.vertigo,
  "laser-leather-patches": oneLaserDestinations.xrf,
  "layered-wood-wall-art": oneLaserDestinations.hydra9Gen2,
  "acrylic-wedding-signs": oneLaserDestinations.cobra10,
};

export const oneLaserOpportunityNames: Record<string, string> = {
  "personalized-tumblers": "OneLaser VertiGo",
  "laser-leather-patches": "OneLaser XRF",
  "layered-wood-wall-art": "OneLaser Hydra 9 Gen 2",
  "acrylic-wedding-signs": "OneLaser Cobra 10",
};

type OneLaserTracking = {
  campaign: "equipment_match" | "roi_result";
  content: string;
  placement: "home_opportunity" | "opportunity_finder_result" | "machine_finder_result" | "roi_report";
};

export function buildOneLaserUrl(destination: string, tracking: OneLaserTracking) {
  const url = new URL(destination, ONE_LASER_ORIGIN);
  if (url.origin !== ONE_LASER_ORIGIN) throw new Error("OneLaser outbound links must stay on 1laser.com");
  url.searchParams.set("utm_source", "elian");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", tracking.campaign);
  url.searchParams.set("utm_content", tracking.content);
  url.searchParams.set("mbl_placement", tracking.placement);
  return url.toString();
}
