import {
  Subdomain,
  CreateSubdomainRequest,
  UpdateSubdomainRequest,
  CreateSubdomainResponse,
  DeleteResponse,
  ApiError,
} from "@/types/api";
import {
  API_BASE_URL,
  AUTH_TOKEN_KEY,
  API_ENDPOINTS,
  PUBLIC_ENDPOINTS,
  HTTP_STATUS,
} from "./constants";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(AUTH_TOKEN_KEY);
    }
  }

  private clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
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
        if (errorData.code === HTTP_STATUS.UNAUTHORIZED) {
          this.clearToken();
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
    return PUBLIC_ENDPOINTS.some((path) => endpoint.startsWith(path));
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Domain methods
  async getAllSubdomains(): Promise<Subdomain[]> {
    return this.request<Subdomain[]>(API_ENDPOINTS.DOMAINS);
  }

  async getMySubdomains(): Promise<Subdomain[]> {
    return this.request<Subdomain[]>(API_ENDPOINTS.MY_DOMAINS);
  }

  async getSubdomainById(id: string): Promise<Subdomain> {
    return this.request<Subdomain>(API_ENDPOINTS.DOMAIN_BY_ID(id));
  }

  async getSubdomainByName(name: string): Promise<Subdomain> {
    return this.request<Subdomain>(API_ENDPOINTS.DOMAIN_BY_NAME(name));
  }

  async checkSubdomainAvailability(name: string): Promise<boolean> {
    try {
      await this.getSubdomainByName(name);
      return false; // If we get a response, subdomain exists
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.code === HTTP_STATUS.NOT_FOUND) {
        // SUBDOMAIN_NOT_FOUND
        return true; // Subdomain is available
      }
      throw error; // Re-throw other errors
    }
  }

  async createSubdomain(
    data: CreateSubdomainRequest
  ): Promise<CreateSubdomainResponse> {
    return this.request<CreateSubdomainResponse>(API_ENDPOINTS.DOMAINS, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSubdomain(
    name: string,
    data: UpdateSubdomainRequest
  ): Promise<CreateSubdomainResponse> {
    return this.request<CreateSubdomainResponse>(
      API_ENDPOINTS.UPDATE_DOMAIN(name),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async deleteSubdomain(name: string): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(API_ENDPOINTS.DELETE_DOMAIN(name), {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
