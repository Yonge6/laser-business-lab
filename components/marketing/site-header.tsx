"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { assetPath } from "@/lib/site";
import { SiteDrawer } from "@/components/marketing/site-drawer";
import { trackEvent } from "@/lib/analytics/client";

const copy = {
  en: {
    tagline: "Turn skills into profitable products",
    home: "Home",
    opportunities: "Opportunities",
    calculators: "Calculators",
    equipment: "Equipment",
    radar: "Radar",
    learn: "Learn",
    about: "About",
    start: "Start quest",
    menu: "Open menu",
    menuLabel: "Menu",
  },
  zh: {
    tagline: "把技能变成可盈利的产品",
    home: "首页",
    opportunities: "机会发现",
    calculators: "利润计算",
    equipment: "设备匹配",
    radar: "雷达",
    learn: "学习",
    about: "关于",
    start: "开始任务",
    menu: "打开菜单",
    menuLabel: "菜单",
  },
};

export function SiteHeader() {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = copy[locale];
  const nav = [
    [t.home, "/"],
    [t.opportunities, "/opportunities"],
    [t.calculators, "/calculator"],
    [t.equipment, "/calculator/machine-finder"],
    [t.radar, "/radar"],
    [t.learn, "/learn"],
    [t.about, "/about"],
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === href;
    if (href === "/calculator/machine-finder") return pathname.startsWith(href);
    if (href === "/calculator") return pathname.startsWith(href) && !pathname.startsWith("/calculator/machine-finder");
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={locale === "zh" ? "Maker Business Lab 首页" : "Maker Business Lab home"}>
          <span className="brand-mark-source" aria-hidden="true"><Image src={assetPath("/images/brand-lockup.png")} alt="" width={392} height={62} priority /></span>
          <span className="brand-lockup"><strong>MAKER BUSINESS LAB</strong><small>{t.tagline}</small></span>
        </Link>
        <nav className="main-nav" aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
          {nav.map(([label, href]) => {
            const active = isActive(href);
            return <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>{label}</Link>;
          })}
          <Link className="nav-cta" href="/opportunities">{t.start}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={locale === "zh" ? "语言" : "Language"}>
            <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"} aria-label="Switch to English">EN</button>
            <span>/</span>
            <button type="button" className={locale === "zh" ? "active" : ""} onClick={() => setLocale("zh")} aria-pressed={locale === "zh"} aria-label="切换为中文">中</button>
          </div>
          <button className="menu-button" onClick={() => { setDrawerOpen(true); void trackEvent("drawer_open", { path: pathname }); }} aria-expanded={drawerOpen} aria-haspopup="dialog" aria-label={t.menu}>
            <List weight="bold" /><span>{t.menuLabel}</span>
          </button>
        </div>
      </div>
      <SiteDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
