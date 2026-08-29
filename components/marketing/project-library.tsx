"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowSquareOut, Calculator, CheckCircle, Funnel, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/format";
import { makerProjects, projectMatchesMaterial, projectMaterialFilters, type MakerProject } from "@/lib/projects/project-library";

const copy = {
  en: {
    eyebrow: "SELLABLE PROJECT LIBRARY",
    title: "See what you could make—and what the numbers could look like.",
    description: "Browse finished-product directions by material. Open any project to review its buyer, planning economics, production path, and matched equipment.",
    all: "All",
    filters: { Wood: "Wood", Acrylic: "Acrylic", Leather: "Leather", Metal: "Metal", Glass: "Glass" },
    open: "Open project plan",
    count: "maker product directions",
    viewAll: "Explore all 42 projects",
    selected: "PROJECT PLAN",
    price: "Planning price",
    profit: "Est. gross profit / item",
    monthly: "Illustrative monthly gross profit",
    margin: "Gross margin before overhead",
    buyer: "Best-fit buyer or use case",
    process: "Production path",
    setup: "What to validate first",
    calculate: "Calculate with my numbers",
    guide: "Open the full project guide",
    equipment: "View matched equipment",
    disclaimer: "Planning estimate only. Gross profit excludes marketplace fees, labor, spoilage, packaging, shipping, taxes, marketing, financing, and overhead. Validate demand and costs with a small paid test before investing.",
    close: "Close project details",
    previous: "Previous project",
    next: "Next project",
  },
  zh: {
    eyebrow: "可销售作品库",
    title: "先看能做什么，再看这门生意怎么算。",
    description: "按材料浏览成品方向。点开任一项目，即可查看目标买家、规划数据、生产路径与匹配设备。",
    all: "全部",
    filters: { Wood: "木材", Acrylic: "亚克力", Leather: "皮革", Metal: "金属", Glass: "玻璃" },
    open: "打开项目方案",
    count: "个 Maker 产品方向",
    viewAll: "查看全部 42 个项目",
    selected: "项目方案",
    price: "规划售价",
    profit: "预计单件毛利",
    monthly: "示例月度毛利润",
    margin: "未扣经营费用毛利率",
    buyer: "适合买家或使用场景",
    process: "生产路径",
    setup: "优先验证事项",
    calculate: "用我的数据测算",
    guide: "打开完整项目指南",
    equipment: "查看匹配设备",
    disclaimer: "仅为规划估算。毛利润尚未扣除平台费、人工、损耗、包装、物流、税费、营销、融资和经营费用。投资前请先用小批量付费测试验证需求与成本。",
    close: "关闭项目详情",
    previous: "上一个项目",
    next: "下一个项目",
  },
};

export function ProjectLibrary({ compact = false }: { compact?: boolean }) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [filter, setFilter] = useState<(typeof projectMaterialFilters)[number]>("All");
  const [selected, setSelected] = useState<MakerProject | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const filtered = useMemo(() => makerProjects.filter((project) => projectMatchesMaterial(project, filter)), [filter]);
  const shown = compact ? filtered.slice(0, 12) : filtered;

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [selected]);

  function openProject(project: MakerProject, trigger: HTMLElement) {
    returnFocusRef.current = trigger;
    setSelected(project);
  }

  function moveProject(direction: -1 | 1) {
    if (!selected) return;
    const index = filtered.findIndex((project) => project.slug === selected.slug);
    const nextIndex = (index + direction + filtered.length) % filtered.length;
    setSelected(filtered[nextIndex]);
  }

  return (
    <section className={`project-library-section${compact ? " is-compact" : ""}`} aria-labelledby={compact ? "home-project-library-title" : "project-library-title"}>
      <div className="shell">
        <div className="project-library-heading">
          <div>
            <p className="eyebrow">03 / {t.eyebrow}</p>
            <h2 id={compact ? "home-project-library-title" : "project-library-title"}>{t.title}</h2>
          </div>
          <p>{t.description}</p>
        </div>

        <div className="project-library-toolbar">
          <div className="project-library-filters" aria-label={locale === "zh" ? "按材料筛选作品" : "Filter projects by material"}>
            <Funnel weight="bold" aria-hidden="true" />
            {projectMaterialFilters.map((item) => (
              <button key={item} type="button" className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>
                {item === "All" ? t.all : t.filters[item]}
              </button>
            ))}
          </div>
          <strong>{filtered.length} {t.count}</strong>
        </div>

        <div className="project-library-grid">
          {shown.map((project, index) => (
            <button key={project.slug} type="button" className="project-library-card" onClick={(event) => openProject(project, event.currentTarget)} aria-label={`${t.open}: ${locale === "zh" ? project.titleZh : project.title}`}>
              <Image src={project.imagePath} alt={locale === "zh" ? `${project.titleZh}成品示例` : `${project.title} finished-product example`} width={720} height={520} loading={index < 4 && compact ? "eager" : "lazy"} />
              <span className="project-library-card-index">#{String(makerProjects.indexOf(project) + 1).padStart(2, "0")}</span>
              <span className="project-library-card-copy">
                <small>{locale === "zh" ? project.materialZh : project.material}</small>
                <strong>{locale === "zh" ? project.titleZh : project.title}</strong>
                <span>{t.open}<ArrowRight weight="bold" /></span>
              </span>
            </button>
          ))}
        </div>

        {compact ? <div className="project-library-more"><Link className="button button-primary" href="/projects">{t.viewAll}<ArrowRight weight="bold" /></Link></div> : null}
      </div>

      {selected ? (
        <div className="project-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
          <div ref={dialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
            <button ref={closeRef} className="project-dialog-close" type="button" onClick={() => setSelected(null)} aria-label={t.close}><X weight="bold" /></button>
            <div className="project-dialog-media">
              <Image src={selected.imagePath} alt={locale === "zh" ? `${selected.titleZh}成品示例` : `${selected.title} finished-product example`} width={1000} height={760} priority />
              <span>{locale === "zh" ? selected.materialZh : selected.material}</span>
            </div>
            <div className="project-dialog-content">
              <p className="eyebrow">{t.selected} · #{String(makerProjects.indexOf(selected) + 1).padStart(2, "0")}</p>
              <h2 id="project-dialog-title">{locale === "zh" ? selected.titleZh : selected.title}</h2>
              <div className="project-dialog-metrics">
                <div><span>{t.price}</span><strong>{formatCurrency(selected.price)}</strong></div>
                <div><span>{t.profit}</span><strong>{formatCurrency(selected.grossProfit, 2)}</strong></div>
                <div><span>{t.margin}</span><strong>{selected.margin}%</strong></div>
                <div><span>{t.monthly}</span><strong>{formatCurrency(selected.estimatedMonthlyGrossProfit)}</strong></div>
              </div>
              <dl className="project-dialog-details">
                <div><dt><CheckCircle weight="fill" />{t.buyer}</dt><dd>{locale === "zh" ? selected.useCaseZh : selected.useCase}</dd></div>
                <div><dt><CheckCircle weight="fill" />{t.process}</dt><dd>{locale === "zh" ? selected.processZh : selected.process}</dd></div>
                <div><dt><CheckCircle weight="fill" />{t.setup}</dt><dd>{locale === "zh" ? selected.setupZh : selected.setup}</dd></div>
              </dl>
              <p className="project-dialog-disclaimer">{t.disclaimer}</p>
              <div className="project-dialog-actions">
                <Link className="button button-primary" href="/calculator/laser-roi">{t.calculate}<Calculator weight="bold" /></Link>
                <Link className="button button-ghost" href={`/projects/${selected.slug}`}>{t.guide}<ArrowRight weight="bold" /></Link>
                <TrackedExternalLink className="project-machine-link" href={selected.machineUrl} target="_blank" rel="noreferrer" analytics={{ placement: "project_library", project: selected.slug, destination: "equipment", recommendation: selected.machineName }}>
                  <span>{t.equipment}</span><strong>{selected.machineName}</strong><ArrowSquareOut weight="bold" />
                </TrackedExternalLink>
              </div>
            </div>
            <button className="project-dialog-nav project-dialog-prev" type="button" onClick={() => moveProject(-1)} aria-label={t.previous}><ArrowLeft weight="bold" /></button>
            <button className="project-dialog-nav project-dialog-next" type="button" onClick={() => moveProject(1)} aria-label={t.next}><ArrowRight weight="bold" /></button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
