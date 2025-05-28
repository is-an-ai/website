import { DNSRecord } from "@/types/api";

// IPv4 주소 검증
export const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

// IPv6 주소 검증
export const isValidIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  return ipv6Regex.test(ip);
};

// 도메인명 검증
export const isValidDomain = (domain: string): boolean => {
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length <= 253;
};

// DNS 레코드 검증
export const validateDNSRecord = (
  record: DNSRecord
): { isValid: boolean; error?: string } => {
  if (
    !record.value ||
    (typeof record.value === "string" && !record.value.trim())
  ) {
    return { isValid: false, error: "Record value is required" };
  }

  const value =
    typeof record.value === "string" ? record.value.trim() : record.value;

  switch (record.type) {
    case "A":
      if (typeof value !== "string" || !isValidIPv4(value)) {
        return {
          isValid: false,
          error: "A record must contain a valid IPv4 address",
        };
      }
      break;

    case "AAAA":
      if (typeof value !== "string" || !isValidIPv6(value)) {
        return {
          isValid: false,
          error: "AAAA record must contain a valid IPv6 address",
        };
      }
      break;

    case "CNAME":
      if (typeof value !== "string" || !isValidDomain(value)) {
        return {
          isValid: false,
          error: "CNAME record must contain a valid domain name",
        };
      }
      break;

    case "TXT":
      if (typeof value !== "string") {
        return {
          isValid: false,
          error: "TXT record must contain a text string",
        };
      }
      if (value.length > 255) {
        return {
          isValid: false,
          error: "TXT record value cannot exceed 255 characters",
        };
      }
      break;

    case "MX":
      // MX 레코드는 더 복잡한 구조를 가지므로 별도 처리 필요
      if (typeof value !== "string" || !isValidDomain(value)) {
        return {
          isValid: false,
          error: "MX record must contain a valid mail server domain",
        };
      }
      break;

    default:
      return { isValid: false, error: "Unsupported DNS record type" };
  }

  return { isValid: true };
};

// 여러 DNS 레코드 검증
export const validateDNSRecords = (
  records: DNSRecord[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  records.forEach((record, index) => {
    const validation = validateDNSRecord(record);
    if (!validation.isValid) {
      errors.push(`Record ${index + 1} (${record.type}): ${validation.error}`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

// API 에러에서 사용자 친화적 메시지 추출
export const getErrorMessage = (error: unknown): string => {
  // Type guard for API error
  const isApiError = (
    err: unknown
  ): err is { code: number; message: string } => {
    return (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      "message" in err
    );
  };

  if (!isApiError(error)) {
    return "An unexpected error occurred.";
  }

  if (error.code === 400) {
    // 스키마 검증 에러인 경우
    if (error.message?.includes("DNS") || error.message?.includes("record")) {
      // 더 구체적인 DNS 레코드 에러 메시지
      if (
        error.message?.includes("A record") &&
        error.message?.includes("IPv4")
      ) {
        return "A record must contain a valid IPv4 address (e.g., 192.168.1.1)";
      }
      if (
        error.message?.includes("AAAA record") &&
        error.message?.includes("IPv6")
      ) {
        return "AAAA record must contain a valid IPv6 address (e.g., 2001:db8::1)";
      }
      if (
        error.message?.includes("CNAME record") &&
        error.message?.includes("domain")
      ) {
        return "CNAME record must contain a valid domain name (e.g., example.com)";
      }
      if (error.message?.includes("TXT record")) {
        return "TXT record contains invalid text format";
      }
      return "Invalid DNS record format. Please check your record values.";
    }
    if (error.message?.includes("subdomain")) {
      return "Invalid subdomain name format. Use only letters, numbers, and hyphens.";
    }
    return error.message || "Invalid request format.";
  }

  if (error.code === 409) {
    return "This subdomain is already taken. Please choose a different name.";
  }

  if (error.code === 429) {
    return "Too many requests. Please try again in a few minutes.";
  }

  if (error.code >= 500) {
    return "Server error. Please try again later.";
  }

  return error.message || "An unexpected error occurred.";
};
