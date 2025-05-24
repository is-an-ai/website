import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { User, AuthResponse, ApiError } from "@/types/api";
import apiClient from "@/lib/api";

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

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.is-an.ai";

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

  // GitHub OAuth login - simplified redirect to backend
  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}/v1/user/auth/github`;
  }, []);

  // Dev environment login
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

  // Handle OAuth callback with token and user info in URL params
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
      // Save token
      localStorage.setItem("auth_token", token);

      // Decode user info
      const userInfo = JSON.parse(decodeURIComponent(encodedUser));
      setUser(userInfo);

      // Clear URL params and redirect to dashboard
      window.history.replaceState({}, document.title, "/dashboard");
    } catch (err) {
      setError("Failed to process OAuth callback");
    } finally {
      setIsLoading(false);
    }
  }, [location.search]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          // Try to fetch user data to validate token
          await apiClient.getMySubdomains();
          // If successful, we can assume the user is authenticated
          // In a real app, you might have a separate endpoint to get current user
          setUser({ id: "current", name: "Authenticated User" });
        }
      } catch {
        // Token is invalid, clear it
        apiClient.logout();
      } finally {
        setIsLoading(false);
      }
    };

    // Handle OAuth callback
    if (location.pathname === "/auth/callback") {
      handleOAuthCallback();
      return;
    }

    checkAuth();
  }, [location.pathname, handleOAuthCallback]);

  // Listen for token expiration events
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

  // Handle OAuth errors
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
