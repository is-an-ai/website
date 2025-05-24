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

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI =
  import.meta.env.VITE_GITHUB_REDIRECT_URI ||
  `${window.location.origin}/auth/callback`;

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

  // GitHub OAuth login
  const login = useCallback(() => {
    if (!GITHUB_CLIENT_ID) {
      setError("GitHub OAuth is not configured");
      return;
    }

    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("oauth_state", state);

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
    githubAuthUrl.searchParams.set("scope", "user:email");
    githubAuthUrl.searchParams.set("state", state);

    window.location.href = githubAuthUrl.toString();
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

  // Handle GitHub OAuth callback
  const handleGithubCallback = useCallback(
    async (code: string, state: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Verify state parameter
        const storedState = localStorage.getItem("oauth_state");
        if (state !== storedState) {
          throw new Error("Invalid state parameter");
        }

        localStorage.removeItem("oauth_state");

        const response: AuthResponse = await apiClient.githubAuth(code, state);
        setUser(response.user);

        // Redirect to dashboard or home
        window.location.href = "/dashboard";
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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

    checkAuth();
  }, []);

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

  // Handle GitHub OAuth callback if we're on the callback page
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      setError(`GitHub OAuth error: ${error}`);
      setIsLoading(false);
      return;
    }

    if (code && state && location.pathname === "/auth/callback") {
      handleGithubCallback(code, state);
    }
  }, [location.search, location.pathname, handleGithubCallback]);

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
