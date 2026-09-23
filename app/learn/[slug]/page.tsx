import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makerGuides, guideDate, guidePath } from "@/lib/learn/guides";
import { makerGuidesZh } from "@/lib/learn/guides-zh";
import { MakerGuideReader } from "@/components/marketing/maker-guide-reader";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";
export const dynamicParams = false;
export function generateStaticParams() { return makerGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = makerGuides.find(item => item.slug === slug);
  if (!guide) notFound();
  return { title: { absolute: guide.title }, description: guide.description, alternates: { canonical: guidePath(slug) },
    openGraph: { title: guide.title, description: guide.description, url: `${base}${guidePath(slug)}`, siteName: "Maker Business Lab", type: "article", locale: "en_US", publishedTime: guideDate, modifiedTime: guideDate, authors: [`${base}/about/`], images: [{ url: `${base}${guide.image}`, alt: guide.title }] },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: [`${base}${guide.image}`] },
  };
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = makerGuides.find(item => item.slug === slug);
  if (!guide) notFound();
  const chinese = makerGuidesZh.find(item => item.slug === slug)!;
  const related = makerGuides.filter(item => item.slug !== slug).map(item => ({ slug: item.slug, title: item.title, titleZh: makerGuidesZh.find(translation => translation.slug === item.slug)!.title }));
  return <MakerGuideReader english={guide} chinese={chinese} base={base} related={related} />;
}
