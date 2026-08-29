"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkSimple, Broadcast, Calculator, House, MagnifyingGlass } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

const items = {
  en: [
    ["Home", "/", House],
    ["Opportunities", "/opportunities", MagnifyingGlass],
    ["Calculate", "/calculator/laser-roi", Calculator],
    ["Radar", "/radar", Broadcast],
    ["Saved", "/saved", BookmarkSimple],
  ] as const,
  zh: [
    ["首页", "/", House],
    ["机会", "/opportunities", MagnifyingGlass],
    ["计算", "/calculator/laser-roi", Calculator],
    ["雷达", "/radar", Broadcast],
    ["收藏", "/saved", BookmarkSimple],
  ] as const,
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const { locale } = useLanguage();

  return (
    <nav className="mobile-bottom-nav" aria-label={locale === "zh" ? "移动端主导航" : "Mobile primary navigation"}>
      {items[locale].map(([label, href, Icon]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            <Icon weight={active ? "fill" : "bold"} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
