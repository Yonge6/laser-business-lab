"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { Opportunity } from "@/lib/opportunities/data";
import { useLanguage } from "@/components/providers/language-provider";

export function OpportunityRadar({ opportunity }: { opportunity: Opportunity }) {
  const { locale } = useLanguage();
  const labels = locale === "zh"
    ? ["需求", "利润", "竞争", "技能", "速度"]
    : ["DEMAND", "MARGIN", "COMPETITION", "SKILL", "SPEED"];
  const data = [
    { label: labels[0], value: opportunity.demand },
    { label: labels[1], value: opportunity.margin },
    { label: labels[2], value: opportunity.competition },
    { label: labels[3], value: opportunity.skill },
    { label: labels[4], value: opportunity.speed },
  ];

  return (
    <div className="radar-wrap" aria-label={`${opportunity.title} opportunity radar`}>
      <div className="radar-title"><span>{locale === "zh" ? "机会雷达" : "OPPORTUNITY RADAR"}</span></div>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} outerRadius="68%">
          <PolarGrid stroke="#c8c3bb" />
          <PolarAngleAxis dataKey="label" tick={{ fill: "#11100f", fontSize: 11, fontWeight: 800 }} />
          <Radar dataKey="value" stroke="#e7310e" fill="#e7310e" fillOpacity={0.42} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
