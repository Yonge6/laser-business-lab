"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function ContentPage({ eyebrow, title, titleZh, intro, introZh, childrenEn, childrenZh }: { eyebrow: string; title: string; titleZh: string; intro: string; introZh: string; childrenEn: React.ReactNode; childrenZh: React.ReactNode }) {
  const { locale } = useLanguage();
  return (
    <main className="content-page shell">
      <header><p className="eyebrow">{eyebrow}</p><h1>{locale === "zh" ? titleZh : title}</h1><p>{locale === "zh" ? introZh : intro}</p></header>
      <article>{locale === "zh" ? childrenZh : childrenEn}</article>
    </main>
  );
}
