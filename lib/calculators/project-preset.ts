import type { RoiInput } from "@/lib/calculators/roi";
import { makerProjects, type MakerProject } from "@/lib/projects/project-library";

export function projectCalculatorHref(project: MakerProject) {
  return `/calculator/laser-roi?project=${encodeURIComponent(project.slug)}`;
}

export function findCalculatorProject(slug: string | null) {
  return makerProjects.find((project) => project.slug === slug);
}

// The library's margin is illustrative and before overhead. This implied cost
// reproduces that model; it is not a supplier quote or a complete unit cost.
export function projectRoiPreset(project: MakerProject): Pick<RoiInput, "sellingPrice" | "materialCost" | "packagingCost" | "monthlyOrders"> {
  return {
    sellingPrice: project.price,
    materialCost: Math.round((project.price - project.grossProfit) * 100) / 100,
    packagingCost: 0,
    monthlyOrders: project.monthlySales ?? 24,
  };
}
