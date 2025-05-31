import { DNSRecord } from "@/types/api";

export interface PlatformGuidance {
  platform: string;
  icon: string;
  iconBg: string;
  message: string;
  steps: string[];
  docsSection: string;
}

const PLATFORM_PATTERNS = {
  vercel: /^.+\.vercel\.app$|^cname\.vercel-dns\.com$/i,
  cloudflare: /^.+\.pages\.dev$/i,
  github: /^.+\.github\.io$/i,
  netlify: /^.+\.netlify\.app$/i,
} as const;

export const detectPlatform = (
  cnameTarget: string
): PlatformGuidance | null => {
  const cleanTarget = cnameTarget.trim().toLowerCase();

  if (PLATFORM_PATTERNS.vercel.test(cleanTarget)) {
    return {
      platform: "Vercel",
      icon: "▲",
      iconBg: "bg-black",
      message: "CNAME 설정 후 Vercel에서 커스텀 도메인을 추가해야 합니다",
      steps: [
        "Vercel 프로젝트 설정으로 이동",
        "Domains 탭 클릭",
        "등록한 서브도메인 추가",
      ],
      docsSection: "examples",
    };
  }

  if (PLATFORM_PATTERNS.cloudflare.test(cleanTarget)) {
    return {
      platform: "Cloudflare Pages",
      icon: "☁",
      iconBg: "bg-orange-500",
      message:
        "CNAME 설정 후 Cloudflare Pages에서 커스텀 도메인을 추가해야 합니다",
      steps: [
        "Cloudflare Pages 대시보드로 이동",
        "해당 프로젝트 선택",
        "Custom domains에서 서브도메인 추가",
      ],
      docsSection: "examples",
    };
  }

  if (PLATFORM_PATTERNS.github.test(cleanTarget)) {
    return {
      platform: "GitHub Pages",
      icon: "⚡",
      iconBg: "bg-gray-900",
      message: "CNAME 설정 후 GitHub Pages에서 커스텀 도메인을 추가해야 합니다",
      steps: [
        "GitHub 저장소 Settings로 이동",
        "Pages 섹션 찾기",
        "Custom domain에 서브도메인 추가",
      ],
      docsSection: "examples",
    };
  }

  if (PLATFORM_PATTERNS.netlify.test(cleanTarget)) {
    return {
      platform: "Netlify",
      icon: "N",
      iconBg: "bg-teal-500",
      message: "CNAME 설정 후 Netlify에서 커스텀 도메인을 추가해야 합니다",
      steps: [
        "Netlify 사이트 설정으로 이동",
        "Domain management 섹션 찾기",
        "Add custom domain으로 서브도메인 추가",
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
