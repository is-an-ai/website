import { getAllBlogPosts } from "./blog";

interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

const SITE_URL = "https://is-an.ai";

// Static pages configuration
const STATIC_PAGES: SitemapUrl[] = [
  {
    url: "",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    url: "/docs",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    url: "/examples",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    url: "/blog",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "daily",
    priority: 0.9,
  },
];

export const generateSitemap = async (): Promise<string> => {
  const blogPosts = await getAllBlogPosts();

  // Convert blog posts to sitemap URLs
  const blogUrls: SitemapUrl[] = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString().split("T")[0],
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  // Combine all URLs
  const allUrls = [...STATIC_PAGES, ...blogUrls];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
};

export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/rss.xml

# Block admin areas (if any)
Disallow: /admin/
Disallow: /_next/
Disallow: /api/auth/`;
};
