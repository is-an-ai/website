import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@/types/api";
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

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
    setUser(null);
    setError(null);
  }, []);

  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.GITHUB_AUTH}`;
  }, []);

  const handleOAuthCallback = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const encodedUser = urlParams.get("user");

    if (!token || !encodedUser) {
      setError("Invalid OAuth callback - missing token or user data");
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      const userInfo = JSON.parse(decodeURIComponent(encodedUser));
      setUser(userInfo);

      window.history.replaceState({}, document.title, ROUTES.DASHBOARD);
    } catch (err) {
      setError(`Failed to process OAuth callback: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          await apiClient.getMySubdomains();
          setUser({ id: "current", name: "Authenticated User" });
        }
      } catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === HTTP_STATUS.UNAUTHORIZED) {
          apiClient.logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (location.pathname === "/auth/callback") {
      handleOAuthCallback();
      return;
    }

    checkAuth();
  }, [location.pathname, handleOAuthCallback]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get("error");

    if (error && location.pathname === "/auth/callback") {
      setError(`OAuth error: ${error}`);
      setIsLoading(false);
    }
  }, [location.search, location.pathname]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};
