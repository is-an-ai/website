import { getAllBlogPosts } from "./blog";

const SITE_URL = "https://is-an.ai";
const SITE_NAME = "is-an.ai";
const SITE_DESCRIPTION =
  "Learn how to make the most of your AI project subdomains with is-an.ai. Tutorials, tips, and best practices for AI developers and researchers.";

export const generateRSSFeed = async (): Promise<string> => {
  const blogPosts = await getAllBlogPosts();

  // Take only the latest 20 posts for RSS
  const latestPosts = blogPosts.slice(0, 20);

  const rssItems = latestPosts
    .map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      // Clean description for RSS (remove HTML if any)
      const cleanDescription = post.description
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/&/g, "&amp;") // Escape ampersands
        .replace(/</g, "&lt;") // Escape less than
        .replace(/>/g, "&gt;"); // Escape greater than

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${cleanDescription}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>team@is-an.ai (${post.author})</author>
      <category>${post.tags.join(", ")}</category>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date().toUTCString();
  const latestPostDate =
    latestPosts.length > 0
      ? new Date(latestPosts[0].date).toUTCString()
      : lastBuildDate;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${latestPostDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${SITE_NAME} Blog</title>
      <link>${SITE_URL}/blog</link>
      <width>1200</width>
      <height>630</height>
    </image>
    <managingEditor>team@is-an.ai (is-an.ai Team)</managingEditor>
    <webMaster>team@is-an.ai (is-an.ai Team)</webMaster>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <category>Machine Learning</category>
    <category>Web Development</category>
${rssItems}
  </channel>
</rss>`;

  return rss;
};

export const generateAtomFeed = async (): Promise<string> => {
  const blogPosts = await getAllBlogPosts();
  const latestPosts = blogPosts.slice(0, 20);

  const atomEntries = latestPosts
    .map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const updated = new Date(post.date).toISOString();

      return `  <entry>
    <title type="html"><![CDATA[${post.title}]]></title>
    <link href="${postUrl}"/>
    <updated>${updated}</updated>
    <id>${postUrl}</id>
    <content type="html"><![CDATA[${post.description}]]></content>
    <author>
      <name>${post.author}</name>
      <email>team@is-an.ai</email>
    </author>
    ${post.tags.map((tag) => `<category term="${tag}"/>`).join("\n    ")}
  </entry>`;
    })
    .join("\n");

  const updated =
    latestPosts.length > 0
      ? new Date(latestPosts[0].date).toISOString()
      : new Date().toISOString();

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_NAME} Blog</title>
  <subtitle>${SITE_DESCRIPTION}</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <link href="${SITE_URL}/blog"/>
  <updated>${updated}</updated>
  <id>${SITE_URL}/blog</id>
  <author>
    <name>is-an.ai Team</name>
    <email>team@is-an.ai</email>
  </author>
${atomEntries}
</feed>`;

  return atom;
};
