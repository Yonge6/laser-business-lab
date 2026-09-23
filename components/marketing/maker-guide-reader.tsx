"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { guideDate, guidePath, guideStructuredData, type MakerGuide } from "@/lib/learn/guides";
import { withElianSource } from "@/lib/commerce/outbound";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";

type Props = { english: MakerGuide; chinese: MakerGuide; base: string; related: { slug: string; title: string; titleZh: string }[] };
export function MakerGuideReader({ english, chinese, base, related }: Props) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const guide = zh ? chinese : english;
  const slug = guide.slug;
  return <main className="maker-guide shell" lang={zh ? "zh-CN" : "en-US"}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData(guide, base, zh ? "zh-CN" : "en-US")).replace(/</g, "\\u003c") }} />
    <nav className="guide-breadcrumbs" aria-label={zh ? "面包屑导航" : "Breadcrumb"}><Link href="/">{zh ? "首页" : "Home"}</Link><span>/</span><Link href="/learn">{zh ? "学习" : "Learn"}</Link><span>/</span><span aria-current="page">{guide.category}</span></nav>
    <header className="guide-header"><p className="eyebrow">{zh ? "美国 Maker 商业指南" : "U.S. MAKER GUIDES"} / {guide.category}</p><h1>{guide.title}</h1><p className="guide-byline">{zh ? "作者：" : "By "}<Link href="/about">Maker Business Lab</Link> · {zh ? "发布与核对日期：" : "Published & reviewed "}<time dateTime={guideDate}>{zh ? "2026 年 9 月 23 日" : "September 23, 2026"}</time> · {zh ? "美元（USD）" : "USD"}</p><div className="guide-answer"><strong>{zh ? "先看结论" : "THE SHORT ANSWER"}</strong><p>{guide.answer}</p></div></header>
    <div className="guide-layout">
      <aside className="guide-contents"><nav aria-label={zh ? "文章目录" : "On this page"}><strong>{zh ? "文章目录" : "IN THIS GUIDE"}</strong>{guide.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<a href="#questions">{zh ? "常见问题" : "Common questions"}</a><a href="#sources">{zh ? "资料来源与计算方法" : "Sources & method"}</a></nav></aside>
      <article className="guide-body" aria-label={guide.title}>
        {guide.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.table ? <div className="guide-table-wrap" role="region" aria-label={`${section.title}${zh ? "表格" : " table"}`} tabIndex={0}><table><caption>{section.title} — {zh ? "美元假设示例" : "illustrative USD assumptions"}</caption><thead><tr>{section.table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
          {section.bullets ? <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}
          {section.sources ? <p className="guide-citations">{zh ? "参考资料：" : "Reference: "}{section.sources.map(id => { const source = guide.sources.find(item => item.id === id)!; return <TrackedExternalLink key={id} href={withElianSource(source.url)} analytics={{ placement: "us_guide_reference", guide: slug, source: id }}>{source.title} ↗</TrackedExternalLink>; })}</p> : null}
        </section>)}
        <section id="questions"><h2>{zh ? "常见问题" : "Common questions"}</h2>{guide.faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>
        <section id="sources" className="guide-method"><h2>{zh ? "资料来源与计算方法" : "Sources & method"}</h2><p>{zh ? "由 Maker Business Lab 根据下列一手资料编写，核对日期为 2026 年 9 月 23 日。成本模型是我们自行计算的假设示例，并非实测卖家收入、供应商报价或市场平均值。展示金额经过取整，公式使用未取整数据。政策和价格可能变化。" : "Prepared by Maker Business Lab from the primary sources below, checked September 23, 2026. Cost models are our own illustrative calculations, not measured seller earnings, supplier quotes, or market averages. Amounts are rounded for display; formulas use unrounded inputs. Policies and prices can change."}</p><ul>{guide.sources.map(source => <li key={source.id}><TrackedExternalLink href={withElianSource(source.url)} analytics={{ placement: "us_guide_sources", guide: slug, source: source.id }}>{source.title} ↗</TrackedExternalLink></li>)}</ul></section>
        <section className="guide-tool"><p className="eyebrow">{zh ? "用你自己的数字做决定" : "PUT YOUR OWN NUMBERS TO WORK"}</p><h2>{zh ? "填入真实成本，再做下一步决定。" : "Make the next decision with your costs."}</h2><Link href={guide.tool.href} className="button button-primary">{guide.tool.label} →</Link></section>
        <nav className="guide-related" aria-label={zh ? "延伸阅读" : "Related guides"}><h2>{zh ? "继续完善你的商业计划" : "Keep building your plan"}</h2>{related.map(item => <Link key={item.slug} href={guidePath(item.slug)}>{zh ? item.titleZh : item.title} <span aria-hidden="true">↗</span></Link>)}<Link href="/learn">{zh ? "查看全部指南" : "All maker guides"} →</Link></nav>
      </article>
    </div>
  </main>;
}
