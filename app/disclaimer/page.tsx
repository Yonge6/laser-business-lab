import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = { title: "Disclaimer", description: "Important limitations for Laser Business Lab estimates and recommendations." };

export default function DisclaimerPage() {
  return <ContentPage eyebrow="IMPORTANT" title="Estimates, not promises." titleZh="这是估算，不是承诺。" intro="Business outcomes depend on demand, execution, costs, and conditions no calculator can fully predict." introZh="商业结果取决于需求、执行、成本和计算器无法完全预测的现实条件。" childrenEn={<><h2>No earnings guarantee</h2><p>Revenue, gross profit, output, opportunity scores, and payback periods are illustrative estimates based on the inputs and simplified assumptions shown.</p><h2>Validate before investing</h2><p>Test demand, pricing, materials, quality, workflow, fees, taxes, labor, maintenance, and local requirements before buying equipment or launching a product.</p><h2>Not advice</h2><p>Nothing on this site constitutes financial, legal, tax, investment, or professional business advice.</p></>} childrenZh={<><h2>不保证收益</h2><p>营收、毛利润、产量、机会评分和回本周期均为基于输入和简化假设的示例估算。</p><h2>投资前先验证</h2><p>购买设备或推出产品前，请验证需求、定价、材料、质量、工作流、平台费用、税费、人工、维护及当地要求。</p><h2>不构成建议</h2><p>本网站任何内容均不构成财务、法律、税务、投资或专业商业建议。</p></>} />;
}
