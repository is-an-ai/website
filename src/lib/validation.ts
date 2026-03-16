import { DNSRecord } from "@/types/api";

// ===== Vendor subdomain validation =====

const VENDOR_PATTERN = /^_([a-z0-9]+)\.[a-zA-Z0-9][a-zA-Z0-9.-]*$/;

export const isVendorSubdomain = (name: string): boolean => {
  return VENDOR_PATTERN.test(name);
};

export const getVendorName = (name: string): string | null => {
  const match = name.match(VENDOR_PATTERN);
  return match ? match[1].toLowerCase() : null;
};

export const getBaseSubdomain = (name: string): string | null => {
  if (!isVendorSubdomain(name)) {
    return null;
  }
  return name.replace(/^_[a-z0-9]+\./i, "");
};

export const validateSubdomainName = (
  name: string,
  records?: DNSRecord[]
): {
  isValid: boolean;
  error?: string;
  isVendor: boolean;
  vendorName?: string;
  baseSubdomain?: string;
} => {
  const trimmedName = name.trim();

  // _{vendor}.{subdomain} pattern (e.g., _vercel.myapp, _discord.myapp)
  if (trimmedName.startsWith("_")) {
    if (!isVendorSubdomain(trimmedName)) {
      return {
        isValid: false,
        error:
          "Invalid vendor subdomain format. Use _{vendor}.{your-subdomain} format.",
        isVendor: true,
      };
    }

    const vendorName = getVendorName(trimmedName);
    const baseSubdomain = getBaseSubdomain(trimmedName);

    // Vendor subdomains only allow TXT records
    if (records && records.length > 0) {
      const hasNonTxtRecord = records.some(
        (r) => r.type !== "TXT" && (typeof r.value === "string" ? r.value.trim() !== "" : true)
      );
      if (hasNonTxtRecord) {
        return {
          isValid: false,
          error:
            "Vendor verification subdomains (_{vendor}.*) only support TXT records.",
          isVendor: true,
          vendorName: vendorName || undefined,
          baseSubdomain: baseSubdomain || undefined,
        };
      }
    }

    return {
      isValid: true,
      isVendor: true,
      vendorName: vendorName || undefined,
      baseSubdomain: baseSubdomain || undefined,
    };
  }

  return { isValid: true, isVendor: false };
};

// ===== DNS record validation =====

export const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

export const isValidIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  return ipv6Regex.test(ip);
};

export const isValidDomain = (domain: string): boolean => {
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length <= 253;
};

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

export const getErrorMessage = (error: unknown): string => {
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
    if (error.message?.includes("DNS") || error.message?.includes("record")) {
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
