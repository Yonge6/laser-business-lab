import type { Metadata } from "next";
import { Suspense } from "react";
import { RoiExperience } from "@/components/calculator/roi-experience";

export const metadata: Metadata = { title: "Maker Product ROI Calculator", description: "Estimate maker product margin, monthly gross profit, production hours, and equipment payback for laser or 3D-printing products." };

const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Maker Product ROI Calculator", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function LaserRoiPage() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Suspense><RoiExperience /></Suspense></main>;
}
