"use client";

import { useLanguage } from "@/components/providers/language-provider";

const eyebrowTranslations: Record<string, string> = {
  "ABOUT THE LAB": "关于实验室",
  IMPORTANT: "重要说明",
  PRIVACY: "隐私说明",
};

export function ContentPage({ eyebrow, eyebrowZh, title, titleZh, intro, introZh, childrenEn, childrenZh }: { eyebrow: string; eyebrowZh?: string; title: string; titleZh: string; intro: string; introZh: string; childrenEn: React.ReactNode; childrenZh: React.ReactNode }) {
  const { locale } = useLanguage();
  return (
    <main className="content-page shell">
      <header><p className="eyebrow">{locale === "zh" ? eyebrowZh ?? eyebrowTranslations[eyebrow] ?? eyebrow : eyebrow}</p><h1>{locale === "zh" ? titleZh : title}</h1><p>{locale === "zh" ? introZh : intro}</p></header>
      <article>{locale === "zh" ? childrenZh : childrenEn}</article>
    </main>
  );
}
