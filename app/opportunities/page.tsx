import type { Metadata } from "next";
import { OpportunityFinder } from "@/components/opportunities/opportunity-finder";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Maker Product Opportunity Finder", description: "Find and rank laser and 3D printing product opportunities by demand, margin, competition, time, and equipment fit." };

export default function OpportunitiesPage() {
  return <main><PageHero eyebrow="FREE TOOL / MAKER OPPORTUNITY FINDER" title="What should you make and sell?" description="Get a ranked starting path based on your interests, time, budget, and business goal." marker="01" /><OpportunityFinder /></main>;
}
