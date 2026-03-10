import Link from "next/link";

interface PageHeroProps {
  badge: string;
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PageHero({ badge, title, breadcrumbs }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="section-badge">{badge}</span>
        <h1>{title}</h1>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((b, i) => (
            <span key={i}>
              {i > 0 && <span className="breadcrumb-sep">&gt;</span>}
              {b.href ? (
                <Link href={b.href}>{b.label}</Link>
              ) : (
                <span className="current">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
