export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content?: string;
}

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
}

// Blog posts data - this will be the "database" for now
const BLOG_POSTS_DATA = {
  "getting-started-with-is-an-ai": {
    title: "Getting Started with is-an.ai",
    description:
      "Learn how to register your first AI project subdomain with is-an.ai in just a few clicks",
    date: "2024-01-15",
    author: "is-an.ai Team",
    tags: ["tutorial", "getting-started", "subdomain"],
    content: `# Getting Started with is-an.ai

Welcome to **is-an.ai** - the easiest way to get a professional subdomain for your AI projects! This guide will walk you through everything you need to know to get started.

## Why Choose is-an.ai?

As an AI researcher or enthusiast, you've probably faced the challenge of sharing your projects with the world. Traditional domain registration and DNS management can be:

- **Complex and time-consuming**
- **Expensive for multiple projects**
- **Technically challenging for non-developers**

is-an.ai solves these problems by providing:

✅ **One-click subdomain registration**  
✅ **No GitHub or DNS knowledge required**  
✅ **Free for AI projects**  
✅ **Professional \`.is-an.ai\` domain**  

## How It Works

Our process is inspired by the simplicity of Toss (the Korean payment app) - clean, intuitive, and efficient.

### 1. Visit our Registration Portal

Simply go to our website and click "Register Subdomain"

### 2. Choose Your Subdomain

Pick a memorable name for your project:
- \`my-awesome-ai.is-an.ai\`
- \`chatbot-demo.is-an.ai\`
- \`ml-research.is-an.ai\`

### 3. Automatic Setup

We handle all the technical details:
- GitHub repository management
- DNS record creation
- Cloudflare integration
- SSL certificate provisioning

## Best Practices

### Subdomain Naming
- Keep it short and memorable
- Use hyphens for readability
- Avoid numbers unless necessary
- Make it descriptive of your project

### Project Documentation
- Include a clear README
- Add project screenshots
- Explain your AI model/approach
- Provide usage instructions

## Common Use Cases

### Research Projects
Perfect for sharing academic research, papers, and demos:
\`\`\`
neural-style-transfer.is-an.ai
sentiment-analysis.is-an.ai
computer-vision-demo.is-an.ai
\`\`\`

### AI Startups
Great for MVP demos and prototype showcases:
\`\`\`
ai-writing-assistant.is-an.ai
smart-recommendation.is-an.ai
voice-ai-bot.is-an.ai
\`\`\`

### Learning Projects
Ideal for portfolio and educational content:
\`\`\`
my-first-ml-model.is-an.ai
tensorflow-tutorial.is-an.ai
ai-learning-journey.is-an.ai
\`\`\`

## Technical Details

### DNS Management
We automatically manage:
- A records pointing to your hosting
- CNAME records for www subdomain
- SSL/TLS certificates via Let's Encrypt
- CDN optimization through Cloudflare

### GitHub Integration
Your subdomain request creates:
- Pull request in our public repository
- Automated validation and approval
- Instant DNS propagation
- Monitoring and health checks

## Getting Support

Need help? We're here for you:

- **Documentation**: Check our comprehensive guides
- **Community**: Join our Discord community
- **Email**: Contact support@is-an.ai
- **GitHub**: Open an issue in our repository

## Next Steps

Ready to get started? Here's what to do next:

1. **Plan your project**: Think about what you want to showcase
2. **Choose a subdomain**: Pick a memorable name
3. **Register**: Use our simple registration form
4. **Deploy**: Upload your project and go live!

---

*This post was last updated on January 15, 2024. Have questions or suggestions? Let us know!*`,
  },
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = Object.entries(BLOG_POSTS_DATA).map(([slug, data]) => ({
    slug,
    ...data,
  }));

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const post = BLOG_POSTS_DATA[slug as keyof typeof BLOG_POSTS_DATA];
  if (!post) return null;

  return {
    slug,
    ...post,
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTagColor = (tag: string): string => {
  const colors = {
    tutorial: "bg-blue-100 text-blue-800",
    "getting-started": "bg-green-100 text-green-800",
    subdomain: "bg-purple-100 text-purple-800",
    advanced: "bg-red-100 text-red-800",
    tips: "bg-yellow-100 text-yellow-800",
    announcement: "bg-indigo-100 text-indigo-800",
  };

  return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800";
};
