"use client";

import { ArrowSquareOut, ChatCircleDots, CheckCircle, Storefront } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";
import { trackEvent } from "@/lib/analytics/client";
import { buildOneLaserUrl, oneLaserDestinations } from "@/lib/commerce/onelaser";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";

type OneLaserRecommendationProps = {
  profileId: string;
  productName: string;
  destination: string;
  fit: string;
  fitZh: string;
  placement: "machine_finder_result" | "roi_report";
  compact?: boolean;
};

export function OneLaserRecommendation({ profileId, productName, destination, fit, fitZh, placement, compact = false }: OneLaserRecommendationProps) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const campaign = placement === "machine_finder_result" ? "equipment_match" : "roi_result";
  const productUrl = buildOneLaserUrl(destination, { campaign, content: profileId, placement });
  const consultationUrl = buildOneLaserUrl(oneLaserDestinations.consultation, { campaign, content: `${profileId}_consultation`, placement });

  function track(destinationType: "product" | "consultation") {
    void trackEvent("recommendation_click", {
      tool: placement === "machine_finder_result" ? "equipment_match" : "laser_roi",
      brand: "OneLaser",
      recommendation: profileId,
      placement,
      destination: destinationType,
    });
  }

  return (
    <aside className={compact ? "onelaser-recommendation compact" : "onelaser-recommendation"} aria-label={zh ? "OneLaser 官方设备建议" : "Official OneLaser equipment suggestion"}>
      <div className="onelaser-brand-rail"><Storefront weight="fill" /><span>ONELASER</span><small>{zh ? "官方站" : "OFFICIAL"}</small></div>
      <div className="onelaser-recommendation-copy">
        <p className="eyebrow">{zh ? "真实设备检查点" : "REAL MACHINE CHECKPOINT"}</p>
        <h3>{compact ? (zh ? "把 ROI 结果带到真实设备比较" : "Take your ROI into a real machine comparison") : (zh ? `查看 ${productName}` : `See ${productName}`)}</h3>
        <p>{zh ? fitZh : fit}</p>
        <span><CheckCircle weight="fill" />{zh ? "先核对材料、工作区域、安全性、总成本与当前供货" : "Confirm materials, work area, safety, total cost, and current availability"}</span>
      </div>
      <div className="onelaser-recommendation-actions">
        <TrackedExternalLink className="button button-primary" href={productUrl} target="_blank" rel="noreferrer" onClick={() => track("product")} analytics={{ placement, destination: "equipment", brand: "OneLaser", recommendation: profileId }}>{compact ? (zh ? `查看 ${productName}` : `View ${productName}`) : (zh ? "在 OneLaser 查看匹配设备" : "View matched machine on OneLaser")}<ArrowSquareOut weight="bold" /></TrackedExternalLink>
        <TrackedExternalLink className="onelaser-consultation-link" href={consultationUrl} target="_blank" rel="noreferrer" onClick={() => track("consultation")} analytics={{ placement, destination: "consultation", brand: "OneLaser", recommendation: profileId }}><ChatCircleDots weight="bold" />{zh ? "预约免费 30 分钟咨询" : "Book a free 30-minute consultation"}</TrackedExternalLink>
        <small>{zh ? "将在新窗口打开 1laser.com；规格、价格和供货情况可能变化。" : "Opens 1laser.com in a new tab. Specifications, prices, and availability may change."}</small>
      </div>
    </aside>
  );
}
