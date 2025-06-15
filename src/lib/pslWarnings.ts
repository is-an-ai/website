export const PSL_WARNINGS = {
  VERCEL_NOT_SUPPORTED:
    "Vercel detected. Due to PSL (Public Suffix List) limitations, Vercel is not currently supported with is-an.ai subdomains. Consider using Cloudflare Pages, Netlify, or GitHub Pages instead.",
  VERCEL_TITLE: "⚠️ Vercel Platform Limitation",
  UNSUPPORTED_PLATFORM: "Unsupported Platform",
  ADDITIONAL_SETUP_REQUIRED: "Additional setup required",
  GOT_IT: "Got it",
  CONFIRM: "OK",
  VIEW_SUPPORTED_PLATFORMS: "View Supported Platforms",
  VIEW_DETAILED_GUIDE: "View detailed guide",
} as const;

export const PSL_GUIDANCE_MESSAGES = {
  VERCEL_NOT_SUPPORTED:
    "⚠️ Vercel is not currently supported due to PSL (Public Suffix List) requirements. Vercel cannot issue SSL certificates for is-an.ai subdomains.",
  VERCEL_STEPS: [
    "Consider using Cloudflare Pages, Netlify, or GitHub Pages instead",
    "These platforms don't require PSL enrollment",
    "Check our documentation for setup guides",
  ],
} as const;
