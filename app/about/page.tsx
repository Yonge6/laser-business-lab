import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = { title: "About", description: "Why Maker Business Lab helps makers validate products and business math before choosing equipment." };

export default function AboutPage() {
  return <ContentPage eyebrow="ABOUT THE LAB" title="Make better things. Make better choices." titleZh="做更好的产品，也做更好的选择。" intro="Maker Business Lab helps makers turn a possible product into an explainable business decision." introZh="Maker Business Lab 帮助 Maker 把一个可能的产品，变成可解释的商业选择。" childrenEn={<><h2>Money first. Machines later.</h2><p>We start with demand, price, cost, time, and the maker’s real constraints. Equipment is considered only after the business case is visible.</p><h2>Built for more than one making path.</h2><p>Laser making and 3D printing are the first supported paths. Product, ROI, and equipment guidance stays specific to the process a maker chooses.</p><h2>Transparent recommendations.</h2><p>Opportunity scores and equipment matches use visible inputs and explainable rules. Marketplace examples are dated source references, not paid rankings or earnings promises.</p></>} childrenZh={<><h2>先谈赚钱，再谈机器。</h2><p>我们从需求、售价、成本、时间和 Maker 的真实限制出发。只有商业逻辑清晰后，才考虑设备。</p><h2>服务不同的制造方式。</h2><p>激光制作和 3D 打印是首批支持的路径。产品、ROI 与设备建议会始终匹配 Maker 选择的具体工艺。</p><h2>推荐过程保持透明。</h2><p>机会评分与设备匹配均基于可见输入和可解释规则。电商案例会标注核验日期，仅作来源参考，不是付费排名或收益承诺。</p></>} />;
}
