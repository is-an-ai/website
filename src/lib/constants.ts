// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// GitHub Configuration
export const GITHUB_REPOSITORY_URL = "https://github.com/is-an-ai";

export const DISCORD_INVITE_URL = "https://discord.gg/gK769bxq3x";

// Domain Configuration
export const DOMAIN_SUFFIX = ".is-an.ai";
export const BASE_DOMAIN = "is-an.ai";
export const MAX_SUBDOMAINS_PER_USER = 5;
// Global service state
export const REGISTRAR_AT_CAPACITY: boolean = false; // Toggle to disable new registrations globally

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
  CREATE_DOMAIN_V2: "/v2/domain",
  DOMAIN_AVAILABILITY_V2: (name: string) => `/v2/domain/available/${name}`,
} as const;

// Toast Configuration
export const TOAST_DURATION = 3000; // milliseconds

// Development Configuration
export const DEV_PORT = 3000;

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
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const;
