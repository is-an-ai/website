import { useEffect, useState } from "react";
import {
  getAllBlogPosts,
  formatDate,
  getTagColor,
  type BlogPost,
} from "@/lib/blog";
import SEO from "@/components/SEO";
import { RssIcon } from "lucide-react";

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const blogPosts = await getAllBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <>
        <SEO
          title="Blog - Loading..."
          description="Learn how to make the most of your AI project subdomains with is-an.ai"
          url="/blog"
        />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Blog"
        description="Learn how to make the most of your AI project subdomains with is-an.ai. Tutorials, tips, and best practices for AI developers and researchers."
        keywords={[
          "AI subdomain",
          "machine learning",
          "AI projects",
          "subdomain registration",
          "AI development",
          "tutorials",
          "is-an.ai",
        ]}
        url="/blog"
        type="website"
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <header className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                is-an.ai Blog
              </h1>
              <div className="flex items-center gap-3">
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                  title="Subscribe to RSS feed"
                >
                  <RssIcon className="w-4 h-4" />
                  RSS Feed
                </a>
              </div>
            </div>
            <p className="text-xl text-gray-600">
              Learn how to make the most of your AI project subdomains
            </p>
          </header>

          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <time className="text-sm text-gray-500" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span className="text-sm text-gray-500">{post.author}</span>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  <a
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {post.title}
                  </a>
                </h2>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-sm rounded-full ${getTagColor(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Read more →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No blog posts yet. Stay tuned for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
