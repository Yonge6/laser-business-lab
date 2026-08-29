"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookmarkSimple, Trash } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { opportunities } from "@/lib/opportunities/data";
import {
  getSavedOpportunityServerSnapshot,
  getSavedOpportunitySnapshot,
  subscribeToSavedOpportunities,
  writeSavedOpportunityIds,
} from "@/lib/opportunities/saved";
import { assetPath } from "@/lib/site";

export function SavedOpportunities() {
  const { locale } = useLanguage();
  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedOpportunities,
    getSavedOpportunitySnapshot,
    getSavedOpportunityServerSnapshot,
  );
  const savedIds = JSON.parse(savedSnapshot) as string[];

  const saved = opportunities.filter((item) => savedIds.includes(item.id));
  const remove = (id: string) => {
    writeSavedOpportunityIds(savedIds.filter((savedId) => savedId !== id));
  };

  return (
    <main className="saved-page shell">
      <header>
        <p className="eyebrow">{locale === "zh" ? "你的收藏" : "Your saved opportunities"}</p>
        <h1>{locale === "zh" ? "稍后继续验证。" : "Pick up where you left off."}</h1>
        <p>{locale === "zh" ? "收藏会保存在这台设备上。" : "Saved opportunities stay on this device."}</p>
      </header>
      {saved.length ? (
        <div className="saved-opportunity-list">
          {saved.map((item) => (
            <article key={item.id}>
              <Image src={assetPath(item.image)} alt={locale === "zh" ? item.titleZh : item.title} width={240} height={180} />
              <div>
                <small>{locale === "zh" ? item.processZh : item.process}</small>
                <h2>{locale === "zh" ? item.titleZh : item.title}</h2>
                <p>{locale === "zh" ? item.evidenceZh : item.evidence}</p>
                <Link href={`/ideas/${item.id}`}>{locale === "zh" ? "继续查看" : "Continue"}<ArrowRight weight="bold" /></Link>
              </div>
              <button type="button" onClick={() => remove(item.id)} aria-label={locale === "zh" ? `删除${item.titleZh}` : `Remove ${item.title}`}><Trash weight="bold" /></button>
            </article>
          ))}
        </div>
      ) : (
        <section className="saved-empty">
          <BookmarkSimple weight="bold" />
          <h2>{locale === "zh" ? "还没有收藏机会。" : "No saved opportunities yet."}</h2>
          <p>{locale === "zh" ? "在首页收藏一个产品机会，之后可以从这里继续。" : "Save a product opportunity from Home, then continue here later."}</p>
          <Link className="button button-primary" href="/">{locale === "zh" ? "返回首页" : "Back to home"}</Link>
        </section>
      )}
    </main>
  );
}
