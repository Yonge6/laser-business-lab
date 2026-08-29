import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectGuide } from "@/components/marketing/project-guide";
import { makerProjectBySlug, makerProjects } from "@/lib/projects/project-library";

export const dynamicParams = false;

export function generateStaticParams() {
  return makerProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = makerProjectBySlug[slug];
  if (!project) return {};
  return {
    title: `${project.title}: Price, Profit & Equipment Plan`,
    description: `Plan ${project.title.toLowerCase()} with an illustrative ${project.margin}% gross margin before overhead, production guidance, and a matched equipment path.`,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { images: [project.imagePath] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = makerProjectBySlug[slug];
  if (!project) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${project.title} business plan`,
    description: `${project.title} planning economics, validation steps, and equipment path for maker businesses.`,
    image: project.imagePath,
    about: { "@type": "Product", name: project.title, material: project.material, offers: { "@type": "Offer", price: project.price, priceCurrency: "USD" } },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><ProjectGuide project={project} /></>;
}
