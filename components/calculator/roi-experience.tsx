"use client";

import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/marketing/page-hero";
import { RoiCalculator, type MakerMethod } from "@/components/calculator/roi-calculator";
import { opportunityById } from "@/lib/opportunities/data";

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
  maker: {
    eyebrow: "FREE TOOL / MAKER ROI QUEST",
    eyebrowZh: "免费工具 / MAKER ROI 回本任务",
    title: "Can this maker product make you money?",
    titleZh: "这个 Maker 产品能为你赚钱吗？",
    description: "Calculate product margin, production capacity, and how long a planned equipment investment could take to pay back.",
    descriptionZh: "计算产品毛利、生产能力，以及计划中的设备投资需要多久回本。",
  },
} satisfies Record<MakerMethod, { eyebrow: string; eyebrowZh: string; title: string; titleZh: string; description: string; descriptionZh: string }>;

export function RoiExperience() {
  const searchParams = useSearchParams();
  const opportunity = opportunityById[searchParams.get("product") ?? ""];
  const method: MakerMethod = opportunity?.category ?? "maker";
  const content = hero[method];

  return (
    <>
      <PageHero {...content} marker="ROI" />
      <RoiCalculator method={method} />
    </>
  );
}
