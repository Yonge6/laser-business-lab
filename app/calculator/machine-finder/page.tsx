import type { Metadata } from "next";
import { Suspense } from "react";
import { MachineFinder } from "@/components/calculator/machine-finder";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Maker Equipment Finder", description: "Get a transparent laser, 3D-printing, or heat-press equipment-category match based on what you make, volume, priorities, investment level, and experience." };

export default function MachineFinderPage() {
  return <main><PageHero eyebrow="MAKER TOOL / EQUIPMENT MATCH" eyebrowZh="MAKER 工具 / 设备匹配" title="Match the equipment to your making path." titleZh="让设备匹配你的制造方式。" description="Choose laser, 3D printing, or heat press first. Then compare the best-fit equipment category, alternative, and every reason behind the match." descriptionZh="先选择激光、3D 打印或热压转印，再查看最适合的设备类别、备选方案和每一项匹配理由。" marker="03" /><Suspense><MachineFinder /></Suspense></main>;
}
