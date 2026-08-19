export function PageHero({ eyebrow, title, description, marker }: { eyebrow: string; title: string; description: string; marker: string }) {
  return (
    <section className="page-hero shell">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="page-marker">{marker}</span>
    </section>
  );
}
