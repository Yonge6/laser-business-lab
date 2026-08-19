import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Learn", description: "Business-first guides for maker products, equipment decisions, pricing, and production." };

const pillars = [
  { title: "Make money", items: ["How much can a laser business make?", "How should you price laser products?", "What maker product should you sell first?"] },
  { title: "Choose a making path", items: ["Laser vs 3D printing for a first product", "RF vs glass-tube CO₂", "Best setup for personalized drinkware"] },
  { title: "Grow production", items: ["How to reduce setup time", "Batch production without quality drift", "When faster equipment changes the economics"] },
];

export default function LearnPage() {
  return <main><PageHero eyebrow="LEARN / BUSINESS-FIRST GUIDES" title="Content that ends in a decision." description="Guides connect directly to a calculator or opportunity test—not a generic buy button." marker="LEARN" /><section className="learn-grid shell">{pillars.map((pillar) => <article key={pillar.title}><p className="eyebrow">CONTENT PILLAR</p><h2>{pillar.title}</h2><ul>{pillar.items.map((item) => <li key={item}>{item}</li>)}</ul><Link href="/calculator">Try a free tool <ArrowRight weight="bold" /></Link></article>)}</section></main>;
}
