import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { User, AuthResponse, ApiError } from "@/types/api";
import apiClient from "@/lib/api";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  AUTH_TOKEN_KEY,
  ROUTES,
} from "@/lib/constants";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  devLogin: () => Promise<void>;
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

  const devLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuthResponse = await apiClient.devLogin();
      setUser(response.user);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
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
      setError("Failed to process OAuth callback");
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
      } catch {
        apiClient.logout();
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
    const handleTokenExpired = () => {
      setUser(null);
      setError("Your session has expired. Please log in again.");
    };

    window.addEventListener("auth:token-expired", handleTokenExpired);
    return () => {
      window.removeEventListener("auth:token-expired", handleTokenExpired);
    };
  }, []);

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
    devLogin,
    logout,
    clearError,
  };
};
