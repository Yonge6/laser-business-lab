import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { decodeReport } from "@/lib/reports/codec";
import { formatCurrency, formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Shared Maker Business Report", robots: { index: false, follow: false } };

export default async function SharedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = decodeReport(id);
  if (!report) notFound();
  return (
    <main className="shared-report shell">
      <header><TrendUp weight="bold" /><div><p className="eyebrow">SHARED BUSINESS REPORT</p><h1>My maker business potential</h1><p>{report.product}</p></div></header>
      <div className="report-grid">
        <div className="report-main"><span>Estimated monthly gross profit</span><strong>{formatCurrency(report.result.monthlyGrossProfit)}</strong><small>Before labor, fees, taxes, overhead, and demand constraints</small></div>
        <div className="report-stat"><strong>{formatCurrency(report.result.grossProfitPerItem, 2)}</strong><span>Gross profit / item</span></div>
        <div className="report-stat"><strong>{report.result.paybackMonths ? `${formatNumber(report.result.paybackMonths, 1)} mo` : "—"}</strong><span>Estimated payback</span></div>
        <div className="report-stat"><strong>{report.input.monthlyOrders}</strong><span>Orders / month</span></div>
        <div className="report-stat"><strong>{formatNumber(report.result.productionHours, 1)} h</strong><span>Production time</span></div>
      </div>
      <div className="profile-block"><span>Production profile</span><div>{report.result.profiles.map((profile) => <b key={profile}><Check weight="bold" /> {profile}</b>)}</div></div>
      <p className="shared-note">Estimates only. Actual profitability depends on demand, pricing, materials, labor, machine settings, workflow and other business factors. Nothing here is financial or business advice.</p>
      <Link href="/calculator/laser-roi" className="button button-primary">Build your own report</Link>
    </main>
  );
}
