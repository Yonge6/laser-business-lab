import type { Metadata } from "next";
import { Suspense } from "react";
import { RoiCalculator } from "@/components/calculator/roi-calculator";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Laser ROI Calculator", description: "Estimate laser product margin, monthly gross profit, production hours, and equipment payback." };

const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Laser ROI Calculator", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function LaserRoiPage() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><PageHero eyebrow="FREE TOOL / ROI QUEST" title="Can a laser business make you money?" description="Calculate product margin, capacity, and how long a planned machine investment could take to pay back." marker="ROI" /><Suspense><RoiCalculator /></Suspense></main>;
}
