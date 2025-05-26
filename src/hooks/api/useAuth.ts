import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, ApiError } from "@/types/api";
import apiClient from "@/lib/api";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  AUTH_TOKEN_KEY,
  ROUTES,
  HTTP_STATUS,
} from "@/lib/constants";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  clearError: () => void;
}

// Auth query key
const authKeys = {
  user: ["auth", "user"] as const,
};

export const useAuth = (): UseAuthReturn => {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const queryClient = useQueryClient();

  // Use React Query for user data
  const {
    data: user,
    isLoading: isQueryLoading,
    error: queryError,
  } = useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      if (!apiClient.isAuthenticated()) {
        return null;
      }

      try {
        // Verify auth by making an API call
        await apiClient.getMySubdomains();
        return { id: "current", name: "Authenticated User" } as User;
      } catch (error) {
        const apiError = error as unknown as ApiError;
        if (apiError.code === HTTP_STATUS.UNAUTHORIZED) {
          apiClient.logout();
          throw new Error("Authentication expired");
        }
        throw error;
      }
    },
    enabled: location.pathname !== "/auth/callback",
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [isCallbackLoading, setIsCallbackLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
    queryClient.setQueryData(authKeys.user, null);
    queryClient.clear(); // Clear all cached data on logout
    setError(null);
  }, [queryClient]);

  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.GITHUB_AUTH}`;
  }, []);

  const handleOAuthCallback = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const encodedUser = urlParams.get("user");

    if (!token || !encodedUser) {
      setError("Invalid OAuth callback - missing token or user data");
      setIsCallbackLoading(false);
      return;
    }

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      const userInfo = JSON.parse(decodeURIComponent(encodedUser));

      // Update React Query cache
      queryClient.setQueryData(authKeys.user, userInfo);

      window.history.replaceState({}, document.title, ROUTES.DASHBOARD);
    } catch (err) {
      setError(`Failed to process OAuth callback: ${err}`);
    } finally {
      setIsCallbackLoading(false);
    }
  }, [location.search, queryClient]);

  useEffect(() => {
    if (location.pathname === "/auth/callback") {
      setIsCallbackLoading(true);
      handleOAuthCallback();
      return;
    }
  }, [location.pathname, handleOAuthCallback]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get("error");

    if (error && location.pathname === "/auth/callback") {
      setError(`OAuth error: ${error}`);
      setIsCallbackLoading(false);
    }
  }, [location.search, location.pathname]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError]);

  const isLoading = isQueryLoading || isCallbackLoading;

  return {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};
