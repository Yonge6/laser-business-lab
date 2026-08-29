import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { ProjectLibrary } from "@/components/marketing/project-library";

export const metadata: Metadata = {
  title: "Maker Project Library: 42 Products to Sell",
  description: "Browse 42 laser-made product directions with planning prices, gross-profit boundaries, materials, production guidance, and matched equipment.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <main><PageHero eyebrow="MAKER PROJECT LIBRARY" eyebrowZh="MAKER 作品库" title="Finished products, business-first." titleZh="从成品出发，判断生意是否成立。" description="Filter 42 sellable project directions by material, then open the price, gross-profit boundary, process, and equipment path behind each one." descriptionZh="按材料筛选 42 个可销售产品方向，再查看每个项目背后的售价、毛利边界、生产工艺与设备路径。" marker="42" /><ProjectLibrary /></main>;
}
