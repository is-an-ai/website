import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import our generators (we'll need to build this differently for Node.js)
const generateFeeds = async () => {
  console.log("🚀 Generating sitemap and RSS feeds...");

  try {
    // For now, we'll generate with mock data since we can't easily import from TypeScript
    const mockBlogPosts = [
      {
        slug: "getting-started-with-is-an-ai",
        title: "Getting Started with is-an.ai",
        description:
          "Learn how to register your first AI project subdomain with is-an.ai in just a few clicks",
        date: "2024-01-15",
        author: "is-an.ai Team",
        tags: ["tutorial", "getting-started", "subdomain"],
      },
    ];

    // Generate sitemap
    const sitemap = await generateSitemapXML(mockBlogPosts);
    const sitemapPath = path.join(__dirname, "../dist/sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemap);
    console.log("✅ Generated sitemap.xml");

    // Generate RSS feed
    const rss = await generateRSSXML(mockBlogPosts);
    const rssPath = path.join(__dirname, "../dist/rss.xml");
    fs.writeFileSync(rssPath, rss);
    console.log("✅ Generated rss.xml");

    // Generate robots.txt
    const robots = generateRobotsTxt();
    const robotsPath = path.join(__dirname, "../dist/robots.txt");
    fs.writeFileSync(robotsPath, robots);
    console.log("✅ Generated robots.txt");

    console.log("🎉 All feeds generated successfully!");
  } catch (error) {
    console.error("❌ Error generating feeds:", error);
    process.exit(1);
  }
};

const generateSitemapXML = async (blogPosts) => {
  const SITE_URL = "https://is-an.ai";

  const staticPages = [
    { url: "", priority: 1.0, changefreq: "weekly" },
    { url: "/docs", priority: 0.8, changefreq: "weekly" },
    { url: "/examples", priority: 0.8, changefreq: "weekly" },
    { url: "/blog", priority: 0.9, changefreq: "daily" },
  ];

  const blogUrls = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    priority: 0.6,
    changefreq: "monthly",
    lastmod: new Date(post.date).toISOString().split("T")[0],
  }));

  const allUrls = [...staticPages, ...blogUrls];
  const today = new Date().toISOString().split("T")[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ url, priority, changefreq, lastmod = today }) =>
      `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
};

const generateRSSXML = async (blogPosts) => {
  const SITE_URL = "https://is-an.ai";
  const SITE_NAME = "is-an.ai";
  const SITE_DESCRIPTION =
    "Learn how to make the most of your AI project subdomains with is-an.ai";

  const rssItems = blogPosts
    .map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>team@is-an.ai (${post.author})</author>
      <category>${post.tags.join(", ")}</category>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${SITE_NAME} Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>
    <managingEditor>team@is-an.ai (is-an.ai Team)</managingEditor>
    <webMaster>team@is-an.ai (is-an.ai Team)</webMaster>
${rssItems}
  </channel>
</rss>`;
};

const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://is-an.ai/sitemap.xml
Sitemap: https://is-an.ai/rss.xml

# Block admin areas
Disallow: /admin/
Disallow: /_next/
Disallow: /api/auth/`;
};

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, "../dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Run the generation
generateFeeds();
