"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowSquareOut, Calculator, CheckCircle, TrendUp } from "@phosphor-icons/react";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/format";
import type { MakerProject } from "@/lib/projects/project-library";

export function ProjectGuide({ project }: { project: MakerProject }) {
  const { locale } = useLanguage();
  const zh = locale === "zh";

  return (
    <main className="project-guide-page">
      <section className="project-guide-hero shell">
        <div className="project-guide-copy">
          <p className="eyebrow">{zh ? "产品方案 / 先验证再投入" : "PROJECT PLAN / VALIDATE BEFORE INVESTING"}</p>
          <Link className="project-guide-back" href="/projects"><ArrowLeft weight="bold" />{zh ? "返回作品库" : "Back to project library"}</Link>
          <h1>{zh ? project.titleZh : project.title}</h1>
          <p>{zh ? project.useCaseZh : project.useCase}</p>
          <div className="project-guide-actions">
            <Link className="button button-primary" href="/calculator/laser-roi">{zh ? "用我的数据测算" : "Calculate with my numbers"}<Calculator weight="bold" /></Link>
            <TrackedExternalLink className="button button-ghost" href={project.machineUrl} target="_blank" rel="noreferrer" analytics={{ placement: "project_guide", project: project.slug, destination: "equipment", recommendation: project.machineName }}>{zh ? "查看匹配设备" : "View matched equipment"}<ArrowSquareOut weight="bold" /></TrackedExternalLink>
          </div>
        </div>
        <figure className="project-guide-image">
          <Image src={project.imagePath} alt={zh ? `${project.titleZh}成品示例` : `${project.title} finished-product example`} width={1200} height={900} priority />
          <figcaption><span>{zh ? project.materialZh : project.material}</span><strong>{project.machineName}</strong></figcaption>
        </figure>
      </section>

      <section className="project-guide-economics shell" aria-labelledby="project-economics-title">
        <header><p className="eyebrow">01 / {zh ? "规划数据" : "PLANNING ECONOMICS"}</p><h2 id="project-economics-title">{zh ? "先看价格与毛利边界。" : "Start with price and gross-profit boundaries."}</h2></header>
        <div className="project-guide-metrics">
          <div className="featured"><TrendUp weight="bold" /><span>{zh ? "示例月度毛利润" : "Illustrative monthly gross profit"}</span><strong>{formatCurrency(project.estimatedMonthlyGrossProfit)}</strong></div>
          <div><span>{zh ? "规划售价" : "Planning price"}</span><strong>{formatCurrency(project.price)}</strong></div>
          <div><span>{zh ? "预计单件毛利" : "Est. gross profit / item"}</span><strong>{formatCurrency(project.grossProfit, 2)}</strong></div>
          <div><span>{zh ? "未扣经营费用毛利率" : "Gross margin before overhead"}</span><strong>{project.margin}%</strong></div>
        </div>
        <p className="project-guide-disclaimer">{zh ? "以上为规划估算，不是收益承诺。毛利润尚未扣除平台费、人工、损耗、包装、物流、税费、营销、融资和经营费用；正式投入前应使用真实报价和小批量付费订单重新测算。" : "These are planning estimates, not income promises. Gross profit excludes marketplace fees, labor, spoilage, packaging, shipping, taxes, marketing, financing, and overhead. Recalculate with real quotes and a small paid test before investing."}</p>
      </section>

      <section className="project-guide-plan shell">
        <div><p className="eyebrow">02 / {zh ? "生产验证" : "PRODUCTION VALIDATION"}</p><h2>{zh ? "先跑通一个小订单。" : "Prove one small order first."}</h2></div>
        <ol>
          <li><span>01</span><div><h3>{zh ? "确认买家" : "Confirm the buyer"}</h3><p>{zh ? project.useCaseZh : project.useCase}</p></div><CheckCircle weight="fill" /></li>
          <li><span>02</span><div><h3>{zh ? "验证工艺" : "Validate the process"}</h3><p>{zh ? project.processZh : project.process}</p></div><CheckCircle weight="fill" /></li>
          <li><span>03</span><div><h3>{zh ? "记录真实成本" : "Record real costs"}</h3><p>{zh ? project.setupZh : project.setup}</p></div><CheckCircle weight="fill" /></li>
        </ol>
      </section>

      <section className="project-guide-machine shell">
        <div><p className="eyebrow">03 / {zh ? "设备路径" : "EQUIPMENT PATH"}</p><h2>{zh ? "产品成立后，再比较设备。" : "Compare equipment after the product earns the right."}</h2><p>{zh ? `根据材料、工艺与重复生产需求，本项目优先查看 ${project.machineName}。购买前仍需核对工作区域、材料安全性、产能、售后支持与总运营成本。` : `Based on material, process, and repeatability needs, this project points first to ${project.machineName}. Before buying, confirm working area, material safety, capacity, support, and total operating cost.`}</p></div>
        <TrackedExternalLink href={project.machineUrl} target="_blank" rel="noreferrer" analytics={{ placement: "project_guide", project: project.slug, destination: "equipment", recommendation: project.machineName }}><span>{zh ? "匹配设备" : "MATCHED EQUIPMENT"}</span><strong>{project.machineName}</strong><ArrowSquareOut weight="bold" /></TrackedExternalLink>
      </section>

      <section className="project-guide-next shell"><p>{zh ? "准备测试这个方向？先把自己的售价、成本、工时和订单量放进模型。" : "Ready to test this direction? Put your own price, costs, time, and order volume into the model."}</p><Link className="button button-primary" href="/calculator/laser-roi">{zh ? "开始免费测算" : "Run the free profit model"}<ArrowRight weight="bold" /></Link></section>
    </main>
  );
}
