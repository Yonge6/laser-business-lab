"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { PageHero } from "@/components/marketing/page-hero";
import { RoiCalculator, type MakerMethod } from "@/components/calculator/roi-calculator";
import { findCalculatorProject } from "@/lib/calculators/project-preset";
import { useLanguage } from "@/components/providers/language-provider";
import { roiOpportunity } from "@/lib/calculators/roi-opportunity";

const hero = {
  laser: {
    eyebrow: "FREE TOOL / LASER ROI QUEST",
    eyebrowZh: "免费工具 / 激光 ROI 回本任务",
    title: "Can a laser business make you money?",
    titleZh: "激光生意能为你赚钱吗？",
    description: "Calculate product margin, laser capacity, and how long a planned machine investment could take to pay back.",
    descriptionZh: "计算产品毛利、激光产能，以及计划中的设备投资需要多久回本。",
  },
  "3d-printing": {
    eyebrow: "FREE TOOL / 3D PRINTING ROI QUEST",
    eyebrowZh: "免费工具 / 3D 打印 ROI 回本任务",
    title: "Can a 3D-printing business make you money?",
    titleZh: "3D 打印生意能为你赚钱吗？",
    description: "Calculate product margin, print capacity, and how long a planned printer investment could take to pay back.",
    descriptionZh: "计算产品毛利、打印产能，以及计划中的 3D 打印机投资需要多久回本。",
  },
  "heat-press": {
    eyebrow: "FREE TOOL / HEAT PRESS ROI QUEST",
    eyebrowZh: "免费工具 / 热压转印 ROI 回本任务",
    title: "Can a heat-press business make you money?",
    titleZh: "热压转印生意能为你赚钱吗？",
    description: "Calculate product margin, pressing capacity, and how long a planned heat-press investment could take to pay back.",
    descriptionZh: "计算产品毛利、热压产能，以及计划中的热压设备投资需要多久回本。",
  },
  maker: {
    eyebrow: "FREE TOOL / MAKER ROI QUEST",
    eyebrowZh: "免费工具 / MAKER ROI 回本任务",
    title: "Can this maker product make you money?",
    titleZh: "这个 Maker 产品能为你赚钱吗？",
    description: "Calculate product margin, production capacity, and how long a planned equipment investment could take to pay back.",
    descriptionZh: "计算产品毛利、生产能力，以及计划中的设备投资需要多久回本。",
  },
} satisfies Record<MakerMethod, { eyebrow: string; eyebrowZh: string; title: string; titleZh: string; description: string; descriptionZh: string }>;

function RoiQuerySelection({ onSelect }: { onSelect: (selection: { productId: string | null; projectSlug: string | null }) => void }) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const projectSlug = searchParams.get("project");
  useEffect(() => { onSelect({ productId, projectSlug }); }, [onSelect, productId, projectSlug]);
  return null;
}

export function RoiExperience() {
  const [selection, setSelection] = useState<{ productId: string | null; projectSlug: string | null }>({ productId: null, projectSlug: null });
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const opportunity = roiOpportunity(selection.productId);
  const project = opportunity ? undefined : findCalculatorProject(selection.projectSlug);
  const method: MakerMethod = opportunity?.category ?? (project ? "laser" : "maker");
  const content = hero[method];
  return (
    <>
      <Suspense fallback={null}><RoiQuerySelection onSelect={setSelection} /></Suspense>
      <PageHero {...content} marker="ROI" />
      <div className="shell roi-cost-guide">
        <p>{zh
          ? "先把人工、平台费用、运费和损耗计入成本。如果材料成本中尚未包含这些项目，请将它们合并到“包装 / 其他成本”。生产时间用于测算产能，不会自动计算人工费用。"
          : "Include labor, marketplace fees, shipping and waste in your costs. Add any amounts not already counted in materials to Packaging / other cost. Production time estimates capacity; it does not automatically price your labor."}</p>
        <Link href="/learn/etsy-tumbler-pricing-us/">{zh ? "查看美国 Etsy 保温杯的完整成本示例 →" : "See a complete U.S. Etsy tumbler cost example →"}</Link>
      </div>
      <RoiCalculator key={opportunity?.id ?? project?.slug ?? "maker"} method={method} opportunityId={opportunity?.id} projectSlug={project?.slug} />
    </>
  );
}
