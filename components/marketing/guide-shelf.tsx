import { makerGuides } from "@/lib/learn/guides";
import { makerGuidesZh } from "@/lib/learn/guides-zh";
import { GuideShelfView } from "@/components/marketing/guide-shelf-view";

export function GuideShelf() {
  const cards = makerGuides.map(guide => {
    const chinese = makerGuidesZh.find(item => item.slug === guide.slug)!;
    return { slug: guide.slug, image: guide.image, title: guide.title, titleZh: chinese.title, description: guide.description, descriptionZh: chinese.description, category: guide.category, categoryZh: chinese.category };
  });
  return <GuideShelfView cards={cards} />;
}
