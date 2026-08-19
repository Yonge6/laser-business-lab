"use client";

import { useLanguage } from "@/components/providers/language-provider";

type PageHeroProps = {
  eyebrow: string;
  eyebrowZh: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  marker: string;
  markerZh?: string;
};

export function PageHero({ eyebrow, eyebrowZh, title, titleZh, description, descriptionZh, marker, markerZh }: PageHeroProps) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  return (
    <section className="page-hero shell">
      <div>
        <p className="eyebrow">{zh ? eyebrowZh : eyebrow}</p>
        <h1>{zh ? titleZh : title}</h1>
        <p>{zh ? descriptionZh : description}</p>
      </div>
      <span className="page-marker">{zh ? markerZh ?? marker : marker}</span>
    </section>
  );
}
