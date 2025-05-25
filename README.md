# is-an.ai

Free subdomains for AI projects. No GitHub PRs, no DNS config, no waiting.

## What is is-an.ai?

**is-an.ai** is like [is-a.dev](https://is-a.dev) but specifically designed for AI projects and enthusiasts. We provide free subdomains under the `is-an.ai` domain (e.g., `your-project.is-an.ai`) with a simple, modern user experience inspired by Toss.

### Key Features

- **Quick Registration** - Get your subdomain in minutes
- **GitHub OAuth** - Simple authentication, no account creation needed
- **AI-Focused** - For AI researchers, developers, and enthusiasts
- **Free** - No costs or limitations
- **No Technical Knowledge Required** - No DNS configuration or GitHub skills needed

## Quick Start

### Method 1: Web Interface (Recommended)

1. **Visit** [is-an.ai](https://is-an.ai)
2. **Check availability** of your desired subdomain
3. **Sign in** with GitHub OAuth
4. **Register** your subdomain
5. **Configure** your target URL in the dashboard

That's it! Your subdomain will be active immediately.

### Method 2: GitHub Repository (Advanced)

If you prefer the traditional approach or want to contribute to the community:

1. **Fork** the [is-an.ai repository](https://github.com/is-an-ai/is-an.ai)
2. **Add** your DNS record to the appropriate JSON file following the schema
3. **Submit** a pull request
4. **Wait** for automatic processing via GitHub Actions

## How It Works

is-an.ai manages DNS records through a public GitHub repository. When you register a subdomain through our website:

1. Your request is processed by our backend API
2. DNS records are automatically added to our repository
3. GitHub Actions deploy the changes to Cloudflare
4. Your subdomain becomes active within minutes

## Use Cases

Good for:

- **AI/ML Projects** - Host your models and demos
- **Research Projects** - Share your AI research and papers
- **AI Tools** - Deploy your AI-powered applications
- **Educational Content** - AI tutorials and learning resources
- **AI Games** - Interactive AI experiences
- **Portfolio Sites** - Display your AI work

## Development

This is a React + Vite application. See [SETUP.md](./SETUP.md) for detailed development instructions.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Contributing

We welcome contributions:

- Bug reports and fixes
- Feature suggestions and implementations
- Documentation improvements
- UI/UX enhancements

Please check our [GitHub repository](https://github.com/is-an-ai/is-an.ai-website) for contribution guidelines.

## Support

- **Email**: support@is-an.ai
- **GitHub Issues**: [Report bugs or request features](https://github.com/is-an-ai/is-an.ai-website/issues)

---

Open source project for the AI community
