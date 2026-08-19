"use client";

import Link from "next/link";
import { Asterisk } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

const copy = {
  en: {
    line: "Business intelligence for people who make things.",
    disclosure: "Laser Business Lab may recommend OneLaser products. Some outbound links are tracked and may be affiliated with OneLaser.",
    estimates: "All profit, demand, and capacity figures are estimates—not financial or business advice.",
    privacy: "Privacy",
    disclaimer: "Disclaimer",
    about: "About",
  },
  zh: {
    line: "为 Maker 提供商业选择情报。",
    disclosure: "Laser Business Lab 可能推荐 OneLaser 产品。部分外链会被追踪，并可能与 OneLaser 存在关联。",
    estimates: "所有利润、需求和产能数据均为估算，不构成财务或商业建议。",
    privacy: "隐私",
    disclaimer: "免责声明",
    about: "关于",
  },
};

export function SiteFooter() {
  const { locale } = useLanguage();
  const t = copy[locale];
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand"><Asterisk weight="bold" /> LASER BUSINESS LAB</div>
          <p>{t.line}</p>
        </div>
        <div className="footer-disclosures">
          <p>{t.disclosure}</p>
          <p>{t.estimates}</p>
        </div>
        <nav aria-label={locale === "zh" ? "法律信息" : "Legal"}>
          <Link href="/about">{t.about}</Link>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/disclaimer">{t.disclaimer}</Link>
        </nav>
      </div>
    </footer>
  );
}
