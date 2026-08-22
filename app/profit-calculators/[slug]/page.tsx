import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoOpportunityLanding } from "@/components/marketing/seo-opportunity-landing";
import { getSeoOpportunity, seoJsonLd, seoOpportunityIds, seoPageMetadata } from "@/lib/seo/opportunity-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return seoOpportunityIds.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return seoPageMetadata("profit", slug);
}

export default async function ProductProfitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getSeoOpportunity(slug)) notFound();
  const jsonLd = seoJsonLd("profit", slug, process.env.NEXT_PUBLIC_SITE_URL);

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><SeoOpportunityLanding opportunityId={slug} kind="profit" /></>;
}
