// User types
export interface User {
  id: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// DNS Record types
export interface MXRecord {
  preference: number;
  exchange: string;
}

export interface DNSRecord {
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT";
  value: string | string[] | MXRecord[];
}

// Subdomain types
export interface Subdomain {
  subdomainId: string;
  subdomainName: string;
  description: string;
  record: DNSRecord[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubdomainRequest {
  subdomainName: string;
  description: string;
  record: DNSRecord[];
}

export interface UpdateSubdomainRequest {
  description: string;
  record: DNSRecord[];
}

export interface CreateSubdomainResponse {
  subdomainId: string;
  subdomainName: string;
  description: string;
  record: DNSRecord[];
  ownerId: string;
}

// API Response types
export interface ApiError {
  code: number;
  message: string;
}

export interface DeleteResponse {
  message: string;
}

// API Error Codes
export enum ErrorCode {
  // Auth related (40000-40099)
  UNAUTHORIZED = 40001,
  INVALID_CREDENTIALS = 40002,
  TOKEN_EXPIRED = 40003,
  INVALID_TOKEN = 40004,
  FORBIDDEN = 40005,

  // GitHub related (40100-40199)
  GITHUB_API_ERROR = 40101,
  GITHUB_AUTH_ERROR = 40102,

  // Database related (40200-40299)
  DATABASE_ERROR = 40201,

  // Validation related (40300-40399)
  VALIDATION_ERROR = 40301,
  INVALID_STATE = 40302,
  INVALID_DNS_RECORD = 40303,
  INVALID_RECORD_VALUE = 40304,

  // Domain related (40400-40499)
  SUBDOMAIN_ALREADY_EXISTS = 40401,
  SUBDOMAIN_NOT_FOUND = 40402,
}
