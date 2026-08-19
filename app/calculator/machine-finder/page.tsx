import type { Metadata } from "next";
import { MachineFinder } from "@/components/calculator/machine-finder";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Laser Machine Finder", description: "Get a transparent laser equipment category and machine match based on what you make, volume, priorities, budget, and experience." };

export default function MachineFinderPage() {
  return <main><PageHero eyebrow="60-SECOND TOOL / EQUIPMENT MATCH" title="Find the setup that fits your business." description="Answer business questions first. We’ll show the match, alternative, and every reason behind the score." marker="03" /><MachineFinder /></main>;
}
