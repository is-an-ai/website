import { DNSRecord } from "@/types/api";
import { PSL_GUIDANCE_MESSAGES } from "./pslWarnings";

export interface PlatformGuidance {
  platform: string;
  icon: string;
  iconBg: string;
  message: string;
  steps: readonly string[];
  docsSection: string;
}

const PLATFORM_PATTERNS = {
  vercel: /^.+\.vercel\.app$|^cname\.vercel-dns\.com$/i,
  cloudflare: /^.+\.pages\.dev$/i,
  github: /^.+\.github\.io$/i,
  netlify: /^.+\.netlify\.app$/i,
} as const;

// Function to check if a URL points to Vercel (for PSL warning)
export const isVercelTarget = (target: string): boolean => {
  const cleanTarget = target.trim().toLowerCase();
  return PLATFORM_PATTERNS.vercel.test(cleanTarget);
};

export const detectPlatform = (
  cnameTarget: string
): PlatformGuidance | null => {
  const cleanTarget = cnameTarget.trim().toLowerCase();

  if (PLATFORM_PATTERNS.vercel.test(cleanTarget)) {
    return {
      platform: "Vercel",
      icon: "▲",
      iconBg: "bg-red-500",
      message: PSL_GUIDANCE_MESSAGES.VERCEL_NOT_SUPPORTED,
      steps: PSL_GUIDANCE_MESSAGES.VERCEL_STEPS,
      docsSection: "examples",
    };
  }

  if (PLATFORM_PATTERNS.cloudflare.test(cleanTarget)) {
    return {
      platform: "Cloudflare Pages",
      icon: "☁",
      iconBg: "bg-orange-500",
      message:
        "After setting up the CNAME record, you need to add the custom domain in Cloudflare Pages",
      steps: [
        "Go to your Cloudflare Pages dashboard",
        "Select your project",
        "Add your subdomain in Custom domains",
      ],
      docsSection: "examples",
    };
  }

  if (PLATFORM_PATTERNS.github.test(cleanTarget)) {
    return {
      platform: "GitHub Pages",
      icon: "⚡",
      iconBg: "bg-gray-900",
      message:
        "After setting up the CNAME record, you need to add the custom domain in GitHub Pages",
      steps: [
        "Go to your GitHub repository Settings",
        "Find the Pages section",
        "Add your subdomain to Custom domain",
      ],
      docsSection: "examples",
    };
  }

  if (PLATFORM_PATTERNS.netlify.test(cleanTarget)) {
    return {
      platform: "Netlify",
      icon: "N",
      iconBg: "bg-teal-500",
      message:
        "After setting up the CNAME record, you need to add the custom domain in Netlify",
      steps: [
        "Go to your Netlify site settings",
        "Find the Domain management section",
        "Add your subdomain with Add custom domain",
      ],
      docsSection: "examples",
    };
  }

  return null;
};

export const hasCnameRecord = (records: DNSRecord[]) => {
  return records.some(
    (record) =>
      record.type === "CNAME" &&
      (typeof record.value === "string" ? record.value.trim() : false)
  );
};
