/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBlogPost,
  formatDate,
  getTagColor,
  type BlogPost,
} from "@/lib/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "@/components/SEO";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const blogPost = await getBlogPost(slug);
        if (blogPost) {
          setPost(blogPost);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to load blog post:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <SEO
          title="Loading Blog Post..."
          description="Loading blog post content..."
          url={`/blog/${slug}`}
        />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <SEO
          title="Blog Post Not Found"
          description="The blog post you're looking for doesn't exist."
          url={`/blog/${slug}`}
        />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Post Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                The blog post you're looking for doesn't exist.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Convert date to ISO format for structured data
  const publishedTime = new Date(post.date).toISOString();

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        keywords={[
          "AI subdomain",
          "machine learning",
          "AI projects",
          ...post.tags,
        ]}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={publishedTime}
        author={post.author}
        tags={post.tags}
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← Back to Blog
            </Link>
          </nav>

          <article className="bg-white rounded-lg shadow-sm p-8">
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>•</span>
                <span>{post.author}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">{post.description}</p>

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
            </header>

            <div className="prose prose-lg prose-gray max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (props: any) => (
                    <h1
                      className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0"
                      {...props}
                    />
                  ),
                  h2: (props: any) => (
                    <h2
                      className="text-2xl font-semibold text-gray-900 mb-4 mt-8"
                      {...props}
                    />
                  ),
                  h3: (props: any) => (
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-4 mt-6"
                      {...props}
                    />
                  ),
                  p: (props: any) => (
                    <p
                      className="text-gray-700 leading-relaxed mb-4"
                      {...props}
                    />
                  ),
                  ul: (props: any) => (
                    <ul
                      className="list-disc list-inside mb-4 text-gray-700 space-y-2"
                      {...props}
                    />
                  ),
                  ol: (props: any) => (
                    <ol
                      className="list-decimal list-inside mb-4 text-gray-700 space-y-2"
                      {...props}
                    />
                  ),
                  li: (props: any) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  blockquote: (props: any) => (
                    <blockquote
                      className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-600"
                      {...props}
                    />
                  ),
                  code: (props: any) => (
                    <code
                      className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
                      {...props}
                    />
                  ),
                  pre: (props: any) => (
                    <pre
                      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 text-sm"
                      {...props}
                    />
                  ),
                  a: (props: any) => (
                    <a
                      {...props}
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                      target={
                        props.href?.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        props.href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    />
                  ),
                  strong: (props: any) => (
                    <strong
                      className="font-semibold text-gray-900"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
