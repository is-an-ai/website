import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const DEFAULT_IMAGE = "/og-image.png"; // You'll need to add this image to public folder
const SITE_NAME = "is-an.ai";
const SITE_URL = "https://is-an.ai";

export default function SEO({
  title,
  description,
  keywords = [],
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  // Generate structured data for articles
  const structuredData =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: fullImage,
          url: fullUrl,
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          author: {
            "@type": "Organization",
            name: author || SITE_NAME,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/logo.png`,
            },
          },
          keywords: [...keywords, ...tags].join(", "),
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          description,
          url: SITE_URL,
        };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={[...keywords, ...tags].join(", ")} />
      )}
      <meta name="author" content={author || SITE_NAME} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific OG tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@isanai" />
      <meta name="twitter:creator" content="@isanai" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#1f2937" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
