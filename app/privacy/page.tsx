import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = { title: "Privacy", description: "Laser Business Lab privacy and analytics information." };

export default function PrivacyPage() {
  return <ContentPage eyebrow="PRIVACY" title="Clear data. Clear purpose." titleZh="数据透明，用途明确。" intro="This MVP collects only the data needed to understand product use, attribution, and requested report delivery." introZh="本 MVP 仅收集用于了解产品使用、来源归因和用户主动请求报告所需的数据。" childrenEn={<><h2>What we collect</h2><p>We may store anonymous visitor and session identifiers, first- and last-touch campaign parameters, tool inputs and calculated results, outbound machine clicks, and an email address only when you submit it.</p><h2>Storage</h2><p>Attribution is stored in your browser for up to 90 days. When analytics and database services are configured, event data may be processed by GA4, PostHog, and Supabase.</p><h2>Your choices</h2><p>You can clear browser storage at any time. Do not submit confidential customer, financial, or production information into calculator fields.</p></>} childrenZh={<><h2>我们收集什么</h2><p>我们可能保存匿名访客和会话标识、首次和末次营销来源、工具输入与计算结果、设备外跳点击，以及仅在你主动提交时保存邮箱。</p><h2>存储</h2><p>归因数据会在浏览器中保存最多 90 天。配置分析与数据库服务后，事件数据可能由 GA4、PostHog 和 Supabase 处理。</p><h2>你的选择</h2><p>你可以随时清除浏览器存储。请勿在计算器中输入机密客户、财务或生产信息。</p></>} />;
}
