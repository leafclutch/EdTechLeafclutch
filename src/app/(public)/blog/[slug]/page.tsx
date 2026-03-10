import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/supabase/types";

export const revalidate = 60;

async function getPost(slug: string) {
  const supabase = createPublicSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<BlogPost>();
  return data;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Leafclutch Technologies Blog`,
    description: `${post.title}. Read tech insights, tutorials, and career advice from Leafclutch Technologies, Bhairahawa, Nepal.`,
    keywords: [post.category, "tech blog Nepal", "Leafclutch blog", post.title],
    openGraph: {
      title: post.title,
      description: `${post.title} — Tech insights from Leafclutch Technologies Nepal.`,
      url: `https://leafclutchtech.com.np/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: post.cover_image,
          width: 900,
          height: 450,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `https://leafclutchtech.com.np/blog/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.published_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <>
      <PageHero
        badge="BLOG"
        title={post.title}
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "BLOG", href: "/blog" },
          { label: post.category.toUpperCase() },
        ]}
      />

      <section className="blog-detail-section">
        <div className="container">
          <div className="blog-detail-content">
            <div className="blog-detail-meta">
              <span>
                <i className="fas fa-calendar-alt"></i> {formattedDate}
              </span>
              <span>
                <i className="fas fa-tag"></i> {post.category}
              </span>
              <span>
                <i className="fas fa-user"></i> {post.author}
              </span>
            </div>
            <img
              src={post.cover_image}
              alt={post.title}
              className="blog-detail-image"
            />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <div
              style={{
                marginTop: "48px",
                paddingTop: "32px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <Link href="/blog" className="btn btn-outline-primary">
                <i className="fas fa-arrow-left"></i> Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
