import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = { title: "About", description: "Why Maker Business Lab helps makers validate products and business math before choosing equipment." };

export default function AboutPage() {
  return <ContentPage eyebrow="ABOUT THE LAB" title="Make better things. Make better choices." titleZh="做更好的产品，也做更好的选择。" intro="Maker Business Lab helps makers turn a possible product into an explainable business decision." introZh="Maker Business Lab 帮助 Maker 把一个可能的产品，变成可解释的商业选择。" childrenEn={<><h2>Money first. Machines later.</h2><p>We start with demand, price, cost, time, and the maker’s real constraints. Equipment is recommended only after the business case is visible.</p><h2>Laser-first, maker-wide.</h2><p>Laser engraving is our first deep vertical. The opportunity model is designed to support 3D printing and other maker methods as evidence and tools mature.</p><h2>Our relationship with OneLaser</h2><p>Maker Business Lab may recommend OneLaser products when they match a user’s stated needs. Some links are tracked and may be affiliated with OneLaser. Recommendation logic is deterministic and explanations are visible.</p></>} childrenZh={<><h2>先谈赚钱，再谈机器。</h2><p>我们从需求、售价、成本、时间和 Maker 的真实限制出发。只有商业逻辑清晰后，才推荐设备。</p><h2>从激光切入，服务更广泛的 Maker。</h2><p>激光雕刻是第一个深度垂直领域。随着证据和工具成熟，机会模型将支持 3D 打印及其他制造方式。</p><h2>与 OneLaser 的关系</h2><p>当 OneLaser 产品符合用户需求时，Maker Business Lab 可能会推荐它们。部分链接会被追踪，并可能与 OneLaser 存在关联。推荐规则是确定性的，理由对用户可见。</p></>} />;
}
