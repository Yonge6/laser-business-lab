"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function NotFound() {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  return <main className="not-found shell"><span>404</span><h1>{zh ? "没有找到这项任务。" : "Quest not found."}</h1><p>{zh ? "这个页面不在当前的 Maker 商业地图中。" : "This route is not part of the current maker business map."}</p><Link className="button button-primary" href="/">{zh ? "返回任务中心" : "Return to mission control"}</Link></main>;
}
