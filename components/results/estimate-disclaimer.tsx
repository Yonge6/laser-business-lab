"use client";

import { Info } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

export function EstimateDisclaimer({ compact = false }: { compact?: boolean }) {
  const { locale } = useLanguage();
  return (
    <div className={compact ? "estimate-disclaimer compact" : "estimate-disclaimer"}>
      <Info weight="bold" />
      <p>{locale === "zh"
        ? "仅供估算。实际盈利取决于需求、定价、材料、人工、设备设置、工作流程及其他业务因素。本网站内容不构成财务或商业建议。"
        : "Estimates only. Actual profitability depends on demand, pricing, materials, labor, machine settings, workflow and other business factors. Nothing here constitutes financial or business advice."}</p>
    </div>
  );
}
