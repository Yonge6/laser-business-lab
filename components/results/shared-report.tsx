"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, TrendUp } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";
import { decodeReport } from "@/lib/reports/codec";
import { formatCurrency, formatNumber } from "@/lib/format";
import { opportunityById } from "@/lib/opportunities/data";

const productZh: Record<string, string> = {
  Tumblers: "保温杯",
  Signs: "标牌",
  "Acrylic Products": "亚克力产品",
  "Awards & Trophies": "奖杯与奖牌",
  "Leather Goods": "皮革制品",
  "Personalized Gifts": "个性化礼品",
  "Wood Products": "木制品",
  "Promotional Products": "促销产品",
  Other: "其他",
};

const profileZh: Record<string, string> = {
  "HIGH-MARGIN": "高毛利",
  "HEALTHY-MARGIN": "健康毛利",
  "MARGIN-WATCH": "关注毛利",
  "HIGH-VOLUME": "高销量",
  "MEDIUM-VOLUME": "中等销量",
  "EARLY-STAGE": "起步阶段",
  "CAPACITY-AVAILABLE": "仍有可用产能",
  "SPEED-SENSITIVE": "效率敏感",
};

export function SharedReport() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const report = decodeReport(searchParams.get("id") ?? "");
  const zh = locale === "zh";

  if (!report) {
    return <main className="not-found shell"><span>404</span><h1>{zh ? "报告链接无效。" : "Report link is invalid."}</h1><p>{zh ? "请返回计算器重新生成报告。" : "Return to the calculator and generate a new report."}</p><Link className="button button-primary" href="/calculator/laser-roi">{zh ? "打开 ROI 计算器" : "Open ROI calculator"}</Link></main>;
  }

  const opportunity = Object.values(opportunityById).find((item) => item.title === report.product);
  const product = zh ? opportunity?.titleZh ?? productZh[report.product] ?? report.product : report.product;
  return (
    <main className="shared-report shell">
      <header><TrendUp weight="bold" /><div><p className="eyebrow">{zh ? "共享商业报告" : "SHARED BUSINESS REPORT"}</p><h1>{zh ? "我的 Maker 商业潜力" : "My maker business potential"}</h1><p>{product}</p></div></header>
      <div className="report-grid">
        <div className="report-main"><span>{zh ? "预计月度毛利润" : "Estimated monthly gross profit"}</span><strong>{formatCurrency(report.result.monthlyGrossProfit)}</strong><small>{zh ? "未扣除人工、平台费用、税费、固定开支和需求限制" : "Before labor, fees, taxes, overhead, and demand constraints"}</small></div>
        <div className="report-stat"><strong>{formatCurrency(report.result.grossProfitPerItem, 2)}</strong><span>{zh ? "单件毛利" : "Gross profit / item"}</span></div>
        <div className="report-stat"><strong>{report.result.paybackMonths ? `${formatNumber(report.result.paybackMonths, 1)} ${zh ? "个月" : "mo"}` : "—"}</strong><span>{zh ? "预计回本周期" : "Estimated payback"}</span></div>
        <div className="report-stat"><strong>{report.input.monthlyOrders}</strong><span>{zh ? "每月订单量" : "Orders / month"}</span></div>
        <div className="report-stat"><strong>{formatNumber(report.result.productionHours, 1)} {zh ? "小时" : "h"}</strong><span>{zh ? "生产时间" : "Production time"}</span></div>
      </div>
      <div className="profile-block"><span>{zh ? "生产画像" : "Production profile"}</span><div>{report.result.profiles.map((profile) => <b key={profile}><Check weight="bold" /> {zh ? profileZh[profile] ?? profile : profile}</b>)}</div></div>
      <p className="shared-note">{zh ? "仅供估算。实际盈利能力取决于需求、定价、材料、人工、机器设置、工作流程及其他商业因素。本报告不构成财务或商业建议。" : "Estimates only. Actual profitability depends on demand, pricing, materials, labor, machine settings, workflow and other business factors. Nothing here is financial or business advice."}</p>
      <Link href="/calculator/laser-roi" className="button button-primary">{zh ? "创建你自己的报告" : "Build your own report"}</Link>
    </main>
  );
}
