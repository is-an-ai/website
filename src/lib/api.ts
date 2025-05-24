import {
  AuthResponse,
  Subdomain,
  CreateSubdomainRequest,
  UpdateSubdomainRequest,
  CreateSubdomainResponse,
  DeleteResponse,
  ApiError,
} from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.is-an.ai";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private saveToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  private clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available and not a public endpoint
    if (this.token && !this.isPublicEndpoint(endpoint)) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          code: response.status,
          message: response.statusText || "Unknown error",
        }));

        // Handle token expiration
        if (errorData.code === 40003 || errorData.code === 40004) {
          this.clearToken();
          // Optionally redirect to login or emit an event
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:token-expired"));
          }
        }

        throw errorData;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          code: 0,
          message: error.message,
        } as ApiError;
      }
      throw error;
    }
  }

  private isPublicEndpoint(endpoint: string): boolean {
    const publicEndpoints = ["/v1/dev/"];

    return publicEndpoints.some((path) => endpoint.startsWith(path));
  }

  // Auth methods
  async devLogin(): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/v1/dev/login", {
      method: "POST",
    });

    this.saveToken(response.token);
    return response;
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Domain methods
  async getAllSubdomains(): Promise<Subdomain[]> {
    return this.request<Subdomain[]>("/v1/domain");
  }

  async getMySubdomains(): Promise<Subdomain[]> {
    return this.request<Subdomain[]>("/v1/domain/my");
  }

  async getSubdomainById(id: string): Promise<Subdomain> {
    return this.request<Subdomain>(`/v1/domain/id/${id}`);
  }

  async getSubdomainByName(name: string): Promise<Subdomain> {
    return this.request<Subdomain>(`/v1/domain/name/${name}`);
  }

  async checkSubdomainAvailability(name: string): Promise<boolean> {
    try {
      await this.getSubdomainByName(name);
      return false; // If we get a response, subdomain exists
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.code === 404) {
        // SUBDOMAIN_NOT_FOUND
        return true; // Subdomain is available
      }
      throw error; // Re-throw other errors
    }
  }

  async createSubdomain(
    data: CreateSubdomainRequest
  ): Promise<CreateSubdomainResponse> {
    return this.request<CreateSubdomainResponse>("/v1/domain", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSubdomain(
    name: string,
    data: UpdateSubdomainRequest
  ): Promise<CreateSubdomainResponse> {
    return this.request<CreateSubdomainResponse>(`/v1/domain/${name}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSubdomain(name: string): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(`/v1/domain/${name}`, {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
