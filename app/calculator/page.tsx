import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Crosshair, Flask } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Free Maker Business Calculators", description: "Free profit, ROI, tumbler, and machine fit tools for maker businesses." };

const tools = [
  { icon: Calculator, title: "Laser ROI Calculator", description: "Calculate margin, monthly gross profit, capacity, and equipment payback.", href: "/calculator/laser-roi", marker: "01" },
  { icon: Flask, title: "Tumbler Profit Calculator", description: "Model drinkware revenue, gross profit, production hours, and speed scenarios.", href: "/calculator/tumbler-profit", marker: "02" },
  { icon: Crosshair, title: "Laser Machine Finder", description: "Turn business needs into a transparent, rules-based equipment match.", href: "/calculator/machine-finder", marker: "03" },
];

export default function CalculatorIndexPage() {
  return <main><PageHero eyebrow="FREE MAKER BUSINESS TOOLS" title="Put your business idea through the lab." description="Use your own prices, costs, time, volume, and goals. Every result stays explainable." marker="TOOLS" /><section className="tool-index shell">{tools.map(({ icon: Icon, ...tool }) => <Link href={tool.href} key={tool.href}><span>{tool.marker}</span><Icon weight="bold" /><h2>{tool.title}</h2><p>{tool.description}</p><b>Start tool <ArrowRight weight="bold" /></b></Link>)}</section></main>;
}
