import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Tech Insights, Career Tips & IT News from Nepal",
  description:
    "Read the latest articles on AI, Web Development, Cybersecurity, UI/UX Design, career tips, and IT industry news from Leafclutch Technologies, Bhairahawa, Nepal.",
  keywords: [
    "tech blog Nepal",
    "IT news Bhairahawa",
    "AI articles Nepal",
    "web development tips",
    "cybersecurity blog",
    "career advice IT Nepal",
    "Leafclutch blog",
    "tech internship tips Nepal",
  ],
  openGraph: {
    title: "Blog — Leafclutch Technologies Nepal",
    description:
      "Tech insights, career tips & IT industry news from Nepal's leading IT training provider.",
    url: "https://leafclutchtech.com.np/blog",
  },
  alternates: { canonical: "https://leafclutchtech.com.np/blog" },
};

export default async function BlogPage() {
  const supabase = createPublicSupabase();
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .returns<BlogPost[]>();

  return (
    <>
      <PageHero
        badge="OUR BLOG"
        title="Latest Articles"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "BLOG" }]}
      />

      <section className="blog-section">
        <div className="container">
          <div className="blog-grid">
            {(blogPosts ?? []).map((post) => (
              <div className="blog-card" key={post.slug}>
                <div
                  className="blog-card-image"
                  style={{ backgroundImage: `url(${post.cover_image})` }}
                ></div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>
                      <i className="fas fa-calendar-alt"></i>{" "}
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>
                      <i className="fas fa-tag"></i> {post.category}
                    </span>
                  </div>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="btn btn-outline-primary"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
