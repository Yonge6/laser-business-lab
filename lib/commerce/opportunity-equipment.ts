import { buildBambuUrl } from "@/lib/commerce/bambu";
import { buildOneLaserUrl, oneLaserOpportunityDestinations, oneLaserOpportunityNames } from "@/lib/commerce/onelaser";
import { buildXToolUrl } from "@/lib/commerce/xtool";
import type { OpportunityCategory } from "@/lib/opportunities/data";

export type OpportunityEquipmentRecommendation = {
  name: string;
  nameZh: string;
  url: string;
};

export function getOpportunityEquipmentRecommendation(id: string, category: OpportunityCategory, placement: "opportunity_finder_result" | "roi_report" = "opportunity_finder_result"): OpportunityEquipmentRecommendation {
  const content = placement === "roi_report" ? `roi_${id}` : `opportunity_finder_${id}`;

  if (category === "laser") {
    const destination = oneLaserOpportunityDestinations[id];
    const name = oneLaserOpportunityNames[id];
    if (!destination || !name) throw new Error(`Missing OneLaser recommendation for ${id}`);
    return {
      name,
      nameZh: name,
      url: buildOneLaserUrl(destination, {
        campaign: "equipment_match",
        content,
        placement,
      }),
    };
  }

  if (category === "3d-printing") {
    return {
      name: "Bambu Lab printers",
      nameZh: "拓竹打印机",
      url: buildBambuUrl(content, placement),
    };
  }

  return {
    name: "xTool WonderPress",
    nameZh: "xTool WonderPress",
    url: buildXToolUrl(content, placement),
  };
}

export function getRoiEquipmentRecommendation(method: "laser" | "3d-printing" | "heat-press" | "maker", product: string, opportunityId?: string): OpportunityEquipmentRecommendation {
  if (opportunityId) {
    const category: OpportunityCategory = method === "maker" ? "laser" : method;
    return getOpportunityEquipmentRecommendation(opportunityId, category, "roi_report");
  }

  const normalized = product.toLowerCase();
  if (method === "3d-printing" || /desk organizer|planter|functional part|3d-print/.test(normalized)) {
    return { name: "Bambu Lab printers", nameZh: "拓竹打印机", url: buildBambuUrl(`roi_${normalized.replace(/[^a-z0-9]+/g, "-")}`, "roi_report") };
  }
  if (method === "heat-press" || /tote bag|t-shirt|hoodie|pillow|mug|phone case|badge|heat-press/.test(normalized)) {
    return { name: "xTool WonderPress", nameZh: "xTool WonderPress", url: buildXToolUrl(`roi_${normalized.replace(/[^a-z0-9]+/g, "-")}`, "roi_report") };
  }

  const id = normalized.includes("tumbler")
    ? "personalized-tumblers"
    : normalized.includes("acrylic") || normalized.includes("sign")
      ? "acrylic-wedding-signs"
      : normalized.includes("wood")
        ? "layered-wood-wall-art"
        : "laser-leather-patches";
  return getOpportunityEquipmentRecommendation(id, "laser", "roi_report");
}
