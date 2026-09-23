import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { makerGuides, guideDate, guidePath, guideStructuredData } from "@/lib/learn/guides";
import { withElianSource } from "@/lib/commerce/outbound";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";

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
  return <main className="maker-guide shell" lang="en-US">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData(guide, base)).replace(/</g, "\\u003c") }} />
    <nav className="guide-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/learn">Learn</Link><span>/</span><span aria-current="page">{guide.category}</span></nav>
    <header className="guide-header"><p className="eyebrow">U.S. MAKER GUIDES / {guide.category}</p><h1>{guide.title}</h1><p className="guide-byline">By <Link href="/about">Maker Business Lab</Link> · Published &amp; reviewed <time dateTime={guideDate}>September 23, 2026</time> · USD</p><div className="guide-answer"><strong>THE SHORT ANSWER</strong><p>{guide.answer}</p></div></header>
    <div className="guide-layout">
      <aside className="guide-contents"><nav aria-label="On this page"><strong>IN THIS GUIDE</strong>{guide.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<a href="#questions">Common questions</a><a href="#sources">Sources &amp; method</a></nav></aside>
      <article className="guide-body" aria-label={guide.title}>
        {guide.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.table ? <div className="guide-table-wrap" role="region" aria-label={`${section.title} table`} tabIndex={0}><table><caption>{section.title} — illustrative USD assumptions</caption><thead><tr>{section.table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
          {section.bullets ? <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}
          {section.sources ? <p className="guide-citations">Reference: {section.sources.map(id => { const source = guide.sources.find(item => item.id === id)!; return <TrackedExternalLink key={id} href={withElianSource(source.url)} analytics={{ placement: "us_guide_reference", guide: slug, source: id }}>{source.title} ↗</TrackedExternalLink>; })}</p> : null}
        </section>)}
        <section id="questions"><h2>Common questions</h2>{guide.faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>
        <section id="sources" className="guide-method"><h2>Sources &amp; method</h2><p>Prepared by Maker Business Lab from the primary sources below, checked September 23, 2026. Cost models are our own illustrative calculations, not measured seller earnings, supplier quotes, or market averages. Amounts are rounded for display; formulas use unrounded inputs. Policies and prices can change.</p><ul>{guide.sources.map(source => <li key={source.id}><TrackedExternalLink href={withElianSource(source.url)} analytics={{ placement: "us_guide_sources", guide: slug, source: source.id }}>{source.title} ↗</TrackedExternalLink></li>)}</ul></section>
        <section className="guide-tool"><p className="eyebrow">PUT YOUR OWN NUMBERS TO WORK</p><h2>Make the next decision with your costs.</h2><Link href={guide.tool.href} className="button button-primary">{guide.tool.label} →</Link></section>
        <nav className="guide-related" aria-label="Related guides"><h2>Keep building your plan</h2>{makerGuides.filter(item => item.slug !== slug).map(item => <Link key={item.slug} href={guidePath(item.slug)}>{item.title} <span aria-hidden="true">↗</span></Link>)}<Link href="/learn">All maker guides →</Link></nav>
      </article>
    </div>
  </main>;
}
