"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function IdeasCta() {
  const { locale } = useLanguage();
  return <div className="shell result-actions"><Link className="button button-primary" href="/opportunities">{locale === "zh" ? "打开机会发现器" : "Open Opportunity Finder"}</Link></div>;
}
