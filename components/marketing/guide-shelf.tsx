import Image from "next/image";
import Link from "next/link";
import { makerGuides, guidePath } from "@/lib/learn/guides";
import { assetPath } from "@/lib/site";

export function GuideShelf() {
  return <section className="guide-shelf shell" lang="en-US" aria-labelledby="us-guides-title">
    <p className="eyebrow">THE BUSINESS SIDE OF MAKING</p>
    <div className="section-heading"><h2 id="us-guides-title">U.S. Maker Guides</h2><p>English guides. USD examples. Real costs before your next investment.</p></div>
    <div className="guide-shelf-grid">{makerGuides.map((guide, index) => <Link className="guide-preview" href={guidePath(guide.slug)} key={guide.slug}>
      <div className="guide-preview-image"><Image src={assetPath(guide.image)} alt="" width={640} height={420} sizes="(max-width: 760px) 100vw, 33vw" /></div>
      <div className="guide-preview-copy"><small>0{index + 1} / {guide.category}</small><h3>{guide.title}</h3><p>{guide.description}</p><span>Read the guide <span aria-hidden="true">↗</span></span></div>
    </Link>)}</div>
  </section>;
}
