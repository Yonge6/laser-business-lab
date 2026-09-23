"use client";

import type { Opportunity } from "@/lib/opportunities/data";
import { useLanguage } from "@/components/providers/language-provider";

// A fixed 0–100 scale makes different products directly comparable.
function point(index: number, value: number, radius = 88) {
  const angle = (index * 72 - 90) * Math.PI / 180;
  const distance = Math.max(0, Math.min(100, value)) / 100 * radius;
  return [180 + Math.cos(angle) * distance, 130 + Math.sin(angle) * distance];
}

export function OpportunityRadar({ opportunity }: { opportunity: Opportunity }) {
  const { locale } = useLanguage();
  const labels = locale === "zh"
    ? ["需求", "利润", "竞争", "技能", "速度"]
    : ["DEMAND", "MARGIN", "COMPETITION", "SKILL", "SPEED"];
  const values = [opportunity.demand, opportunity.margin, opportunity.competition, opportunity.skill, opportunity.speed];
  const title = locale === "zh" ? opportunity.titleZh : opportunity.title;
  const description = labels.map((label, index) => `${label}: ${values[index]}/100`).join(", ");

  return (
    <div className="radar-wrap">
      <div className="radar-title"><span>{locale === "zh" ? "机会雷达" : "OPPORTUNITY RADAR"}</span></div>
      <svg className="radar-chart" viewBox="0 0 360 260" role="img" aria-label={`${title}: ${description}`}>
        {[20, 40, 60, 80, 100].map((value) => (
          <polygon key={value} points={labels.map((_, index) => point(index, value).join(",")).join(" ")} fill="none" stroke="#c8c3bb" />
        ))}
        {labels.map((label, index) => {
          const [x, y] = point(index, 100);
          const [labelX, labelY] = point(index, 100, 112);
          return (
            <g key={label}>
              <line x1="180" y1="130" x2={x} y2={y} stroke="#c8c3bb" />
              <text x={labelX} y={labelY} textAnchor={index === 0 ? "middle" : index < 3 ? "start" : "end"} dominantBaseline="middle" fill="currentColor" fontSize="11" fontWeight="800">{label}</text>
            </g>
          );
        })}
        <polygon points={values.map((value, index) => point(index, value).join(",")).join(" ")} fill="#e7310e" fillOpacity=".32" stroke="#e7310e" strokeWidth="2" />
      </svg>
      <p className="radar-caption"><strong>{title}</strong>{locale === "zh" ? "规划评分 · 0–100 分 · 并非实时销量" : "Planning scores · 0–100 · Not live sales data"}</p>
    </div>
  );
}
