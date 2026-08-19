import type { Metadata } from "next";
import { MachineFinder } from "@/components/calculator/machine-finder";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Laser Machine Finder", description: "Get a transparent laser equipment category and machine match based on what you make, volume, priorities, budget, and experience." };

export default function MachineFinderPage() {
  return <main><PageHero eyebrow="60-SECOND TOOL / EQUIPMENT MATCH" eyebrowZh="60 秒工具 / 设备匹配" title="Find the setup that fits your business." titleZh="找到适合你生意的设备方案。" description="Answer business questions first. We’ll show the match, alternative, and every reason behind the score." descriptionZh="先回答商业问题，我们会给出最佳匹配、备选方案和每一项评分理由。" marker="03" /><MachineFinder /></main>;
}
