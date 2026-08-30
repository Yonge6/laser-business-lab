"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowSquareOut,
  Calculator,
  ChartLineUp,
  Crosshair,
  EnvelopeSimple,
  GlobeHemisphereWest,
  House,
  Info,
  Pulse,
  X,
} from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics/client";
import { useLanguage } from "@/components/providers/language-provider";
import { withElianSource } from "@/lib/commerce/outbound";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";

type SiteDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const works = [
  {
    id: "wonderelian",
    href: "https://wonderelian.com/",
    name: "WonderElian",
    tagline: "Make complex ideas clear, beautiful, and human",
    taglineZh: "让复杂的想法变得清晰、好看而有人情味",
  },
  {
    id: "yixiu",
    href: "https://yixiu.wonderelian.com/",
    name: "Yixiu Meditation",
    nameZh: "一休冥想",
    tagline: "Return to the present through sound",
    taglineZh: "让声音带你回到当下",
  },
  {
    id: "xiazi",
    href: "https://xiazishuo.com/",
    name: "Xiazi Says",
    nameZh: "虾子曰",
    tagline: "See yesterday's world through nine global stories",
    taglineZh: "用 9 个全球热点看清昨日世界",
  },
  {
    id: "human-design",
    href: "https://human-design.wonderelian.com/",
    name: "Bu'er · Know Yourself",
    nameZh: "不二 · 认识自己",
    tagline: "A bilingual manual for your life",
    taglineZh: "一份中英双语的人生使用说明书",
  },
  {
    id: "style-atlas",
    href: "https://style-atlas.wonderelian.com/",
    name: "Style Atlas",
    nameZh: "艺术风格图鉴",
    tagline: "Learn to see a style",
    taglineZh: "沿着艺术与设计脉络看懂一种美",
  },
  {
    id: "wendao",
    href: "https://wendao.wonderelian.com/",
    name: "Wendao · Daodejing",
    nameZh: "三慢问道",
    tagline: "Read the classic slowly—and yourself with it",
    taglineZh: "慢读《道德经》，也慢慢认识自己",
  },
];

const contactLinks = [
  { label: "WonderElian", href: "https://wonderelian.com/" },
  { label: "Email", labelZh: "邮箱", href: "mailto:hustyy986@gmail.com" },
  { label: "RED", labelZh: "小红书", href: "https://xhslink.cn/m/3OF5qu7Peui" },
  { label: "Douyin", labelZh: "抖音", href: "https://v.douyin.com/d9L1thkye0Y/" },
  { label: "X", href: "https://x.com/yongyuan1?s=11" },
  { label: "TikTok", href: "https://www.tiktok.com/@wonderelian?_r=1&_t=ZP-98Tvaldfrpe" },
];

export function SiteDrawer({ open, onClose }: SiteDrawerProps) {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef({ startX: 0, startY: 0, distance: 0, horizontal: false });
  const zh = locale === "zh";

  const primaryNav = [
    { href: "/", label: "Home", labelZh: "首页", icon: House },
    { href: "/opportunities", label: "Find an opportunity", labelZh: "发现赚钱机会", icon: Crosshair },
    { href: "/calculator", label: "Calculate profit", labelZh: "测算利润", icon: Calculator },
    { href: "/calculator/machine-finder", label: "Match equipment", labelZh: "匹配设备", icon: ChartLineUp },
    { href: "/radar", label: "Opportunity radar", labelZh: "机会雷达", icon: Pulse },
    { href: "/learn", label: "Maker playbook", labelZh: "Maker 赚钱指南", icon: Info },
  ];

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeys);
      previousFocusRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  function trackLink(destination: string, type: "internal" | "work" | "contact") {
    void trackEvent("drawer_link_click", { destination, type, path: pathname });
  }

  function resetDrawerDrag() {
    dragRef.current = { startX: 0, startY: 0, distance: 0, horizontal: false };
    drawerRef.current?.style.removeProperty("--drawer-drag-x");
    drawerRef.current?.classList.remove("is-dragging");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!event.isPrimary) return;
    dragRef.current = { startX: event.clientX, startY: event.clientY, distance: 0, horizontal: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const deltaX = Math.max(0, event.clientX - dragRef.current.startX);
    const deltaY = Math.abs(event.clientY - dragRef.current.startY);
    if (!dragRef.current.horizontal && deltaX < 8) return;
    if (!dragRef.current.horizontal && deltaY > deltaX) return;

    dragRef.current.horizontal = true;
    dragRef.current.distance = deltaX;
    drawerRef.current?.classList.add("is-dragging");
    drawerRef.current?.style.setProperty("--drawer-drag-x", `${deltaX}px`);
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const shouldClose = dragRef.current.horizontal && dragRef.current.distance >= 72;
    resetDrawerDrag();
    if (shouldClose) onClose();
  }

  return (
    <div className="site-drawer-layer">
      <button className="site-drawer-backdrop" type="button" aria-label={zh ? "关闭菜单" : "Close menu"} onClick={onClose} />
      <aside
        ref={drawerRef}
        className="site-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-drawer-title"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <span className="site-drawer-drag-rail" aria-hidden="true" />
        <header className="site-drawer-header">
          <div>
            <span>MAKER BUSINESS LAB / CONTROL DECK</span>
            <h2 id="site-drawer-title">{zh ? "你的 Maker 基地" : "Your maker base"}</h2>
          </div>
          <button ref={closeButtonRef} className="site-drawer-close" type="button" aria-label={zh ? "关闭菜单" : "Close menu"} onClick={onClose}>
            <X weight="bold" />
          </button>
        </header>

        <div className="site-drawer-scroll">
          <section className="drawer-mission" aria-labelledby="drawer-mission-title">
            <span className="drawer-section-label">01 / {zh ? "继续任务" : "CONTINUE THE QUEST"}</span>
            <h3 id="drawer-mission-title">{zh ? "从一个能卖的产品开始。" : "Start with a product people will buy."}</h3>
            <p>{zh ? "先找到机会，再验证利润和生产方式；每一步都回到商业数字。" : "Find the opportunity, validate the economics, then choose how to make it. Every step returns to business numbers."}</p>
            <Link className="drawer-mission-cta" href="/opportunities" onClick={() => { trackLink("/opportunities", "internal"); onClose(); }}>
              {zh ? "开始机会任务" : "Start opportunity quest"}<ArrowRight weight="bold" />
            </Link>
          </section>

          <nav className="drawer-primary-nav" aria-label={zh ? "全站导航" : "Site navigation"}>
            {primaryNav.map((item, index) => {
              const active = item.href === "/"
                ? pathname === "/"
                : item.href === "/calculator"
                  ? pathname.startsWith("/calculator") && !pathname.startsWith("/calculator/machine-finder")
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link className={active ? "is-active" : undefined} href={item.href} key={item.href} aria-current={active ? "page" : undefined} onClick={() => { trackLink(item.href, "internal"); onClose(); }}>
                  <span className="drawer-nav-index">{String(index + 1).padStart(2, "0")}</span>
                  <Icon weight="bold" />
                  <strong>{zh ? item.labelZh : item.label}</strong>
                  <ArrowRight weight="bold" />
                </Link>
              );
            })}
          </nav>

          <section className="drawer-works" aria-labelledby="drawer-works-title">
            <div className="drawer-section-heading">
              <div>
                <span className="drawer-section-label">02 / {zh ? "沿途所作" : "WORKS ALONG THE WAY"}</span>
                <h3 id="drawer-works-title">{zh ? "观世界，识自己，也学习看见美。" : "See the world, know yourself, and learn to see beauty."}</h3>
              </div>
              <GlobeHemisphereWest weight="bold" />
            </div>
            <div className="drawer-work-list">
              {works.map((work, index) => (
                <TrackedExternalLink href={withElianSource(work.href)} target="_blank" rel="noreferrer" key={work.id} onClick={() => trackLink(work.id, "work")} analytics={{ placement: "site_drawer", destination: "related_work", work: work.id }}>
                  <span className="drawer-work-index">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{zh ? work.nameZh ?? work.name : work.name}</strong>
                    <small>{zh ? work.taglineZh : work.tagline}</small>
                  </span>
                  <ArrowSquareOut weight="bold" />
                </TrackedExternalLink>
              ))}
            </div>
          </section>

          <section className="drawer-contact" aria-labelledby="drawer-contact-title">
            <span className="drawer-section-label">03 / {zh ? "联系与说明" : "CONTACT & INFO"}</span>
            <div className="drawer-contact-title">
              <h3 id="drawer-contact-title">{zh ? "保持联系" : "Stay in the loop"}</h3>
              <EnvelopeSimple weight="bold" />
            </div>
            <div className="drawer-contact-links">
              {contactLinks.map((item) => item.href.startsWith("mailto:") ? (
                <a href={item.href} key={item.label} onClick={() => trackLink(item.label, "contact")}>{zh ? item.labelZh ?? item.label : item.label}<ArrowSquareOut weight="bold" /></a>
              ) : (
                <TrackedExternalLink href={withElianSource(item.href)} target="_blank" rel="noreferrer" key={item.label} onClick={() => trackLink(item.label, "contact")} analytics={{ placement: "site_drawer", destination: "contact", channel: item.label }}>
                  {zh ? item.labelZh ?? item.label : item.label}<ArrowSquareOut weight="bold" />
                </TrackedExternalLink>
              ))}
            </div>
            <div className="drawer-legal-links">
              <Link href="/about" onClick={onClose}>{zh ? "关于" : "About"}</Link>
              <Link href="/privacy" onClick={onClose}>{zh ? "隐私" : "Privacy"}</Link>
              <Link href="/disclaimer" onClick={onClose}>{zh ? "免责声明" : "Disclaimer"}</Link>
            </div>
          </section>
        </div>

        <footer className="site-drawer-footer">
          <span>{zh ? "界面语言" : "Interface language"}</span>
          <div>
            <button type="button" className={locale === "en" ? "is-active" : undefined} onClick={() => setLocale("en")}>EN</button>
            <button type="button" className={locale === "zh" ? "is-active" : undefined} onClick={() => setLocale("zh")}>中文</button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
