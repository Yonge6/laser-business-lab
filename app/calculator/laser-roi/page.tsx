import type { Metadata } from "next";
import { Suspense } from "react";
import { RoiCalculator } from "@/components/calculator/roi-calculator";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Laser ROI Calculator", description: "Estimate laser product margin, monthly gross profit, production hours, and equipment payback." };

const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Laser ROI Calculator", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function LaserRoiPage() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><PageHero eyebrow="FREE TOOL / ROI QUEST" eyebrowZh="免费工具 / ROI 回本任务" title="Can a laser business make you money?" titleZh="激光生意能为你赚钱吗？" description="Calculate product margin, capacity, and how long a planned machine investment could take to pay back." descriptionZh="计算产品毛利、产能，以及计划中的设备投资需要多久回本。" marker="ROI" /><Suspense><RoiCalculator /></Suspense></main>;
}
