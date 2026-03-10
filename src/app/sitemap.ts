import type { MetadataRoute } from "next";

const BASE_URL = "https://leafclutchtech.com.np";

export default function sitemap(): MetadataRoute.Sitemap {
  const courses = [
    "ai-ml",
    "web-development",
    "cybersecurity",
    "ui-ux-design",
    "graphic-design",
    "data-science",
  ];

  const blogPosts = [
    "how-ai-is-transforming-education-in-nepal",
    "top-5-web-development-frameworks-2025",
    "why-cybersecurity-skills-are-essential",
    "complete-guide-to-ui-ux-design-for-beginners",
    "how-to-land-your-first-tech-internship-in-nepal",
    "graphic-design-trends-2025",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/enroll`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const coursePages: MetadataRoute.Sitemap = courses.map((slug) => ({
    url: `${BASE_URL}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages, ...blogPages];
}
