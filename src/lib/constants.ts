// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.is-an.ai";

// GitHub Configuration
export const GITHUB_REPOSITORY_URL = "https://github.com/is-an-ai";

// Domain Configuration
export const DOMAIN_SUFFIX = ".is-an.ai";
export const BASE_DOMAIN = "is-an.ai";

// Local Storage Keys
export const AUTH_TOKEN_KEY = "auth_token";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  DEV_LOGIN: "/v1/dev/login",
  GITHUB_AUTH: "/v1/user/auth/github",

  // Domain
  DOMAINS: "/v1/domain",
  MY_DOMAINS: "/v1/domain/my",
  DOMAIN_BY_ID: (id: string) => `/v1/domain/id/${id}`,
  DOMAIN_BY_NAME: (name: string) => `/v1/domain/name/${name}`,
  UPDATE_DOMAIN: (name: string) => `/v1/domain/${name}`,
  DELETE_DOMAIN: (name: string) => `/v1/domain/${name}`,
} as const;

// Public API Endpoints (no auth required)
export const PUBLIC_ENDPOINTS = ["/v1/dev/"];

// Error Codes (from backend API)
export const ERROR_CODES = {
  // Auth related (40000-40099)
  UNAUTHORIZED: 40001,
  INVALID_CREDENTIALS: 40002,
  TOKEN_EXPIRED: 40003,
  INVALID_TOKEN: 40004,
  FORBIDDEN: 40005,

  // GitHub related (40100-40199)
  GITHUB_API_ERROR: 40101,
  GITHUB_AUTH_ERROR: 40102,

  // Database related (40200-40299)
  DATABASE_ERROR: 40201,

  // Validation related (40300-40399)
  VALIDATION_ERROR: 40301,
  INVALID_STATE: 40302,

  // Domain related (40400-40499)
  SUBDOMAIN_ALREADY_EXISTS: 40401,
  SUBDOMAIN_NOT_FOUND: 40402,
} as const;

// Toast Configuration
export const TOAST_DURATION = 3000; // milliseconds

// Development Configuration
export const DEV_PORT = 3000;

// Custom Events
export const CUSTOM_EVENTS = {
  TOKEN_EXPIRED: "auth:token-expired",
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DOCS: "/docs",
  EXAMPLES: "/examples",
  AUTH_CALLBACK: "/auth/callback",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  NOT_FOUND: 404,
} as const;
