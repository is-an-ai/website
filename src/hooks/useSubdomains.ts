import { useState, useCallback } from "react";
import {
  Subdomain,
  CreateSubdomainRequest,
  UpdateSubdomainRequest,
  ApiError,
} from "@/types/api";
import apiClient from "@/lib/api";

interface UseSubdomainsReturn {
  // State
  subdomains: Subdomain[];
  isLoading: boolean;
  error: string | null;

  // Availability checking
  isCheckingAvailability: boolean;
  availabilityResult: boolean | null;

  // Actions
  checkAvailability: (name: string) => Promise<boolean>;
  createSubdomain: (data: CreateSubdomainRequest) => Promise<void>;
  updateSubdomain: (
    name: string,
    data: UpdateSubdomainRequest
  ) => Promise<void>;
  deleteSubdomain: (name: string) => Promise<void>;
  fetchMySubdomains: () => Promise<void>;
  clearError: () => void;
  clearAvailabilityResult: () => void;
}

export const useSubdomains = (): UseSubdomainsReturn => {
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<boolean | null>(
    null
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAvailabilityResult = useCallback(() => {
    setAvailabilityResult(null);
  }, []);

  const checkAvailability = useCallback(
    async (name: string): Promise<boolean> => {
      try {
        setIsCheckingAvailability(true);
        setError(null);

        // Basic validation
        if (!name || name.length < 1) {
          throw new Error("Subdomain name is required");
        }

        // Simple validation for subdomain format
        const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
        if (!subdomainRegex.test(name)) {
          throw new Error(
            "Invalid subdomain format. Use only letters, numbers, and hyphens."
          );
        }

        const isAvailable = await apiClient.checkSubdomainAvailability(name);
        setAvailabilityResult(isAvailable);
        return isAvailable;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to check availability");
        setAvailabilityResult(null);
        return false;
      } finally {
        setIsCheckingAvailability(false);
      }
    },
    []
  );

  const fetchMySubdomains = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiClient.getMySubdomains();
      setSubdomains(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to fetch subdomains");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubdomain = useCallback(
    async (data: CreateSubdomainRequest): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        await apiClient.createSubdomain(data);

        // Refresh the list after creation
        await fetchMySubdomains();
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to create subdomain");
        throw err; // Re-throw so the component can handle it
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMySubdomains]
  );

  const updateSubdomain = useCallback(
    async (name: string, data: UpdateSubdomainRequest): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        await apiClient.updateSubdomain(name, data);

        // Refresh the list after update
        await fetchMySubdomains();
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to update subdomain");
        throw err; // Re-throw so the component can handle it
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMySubdomains]
  );

  const deleteSubdomain = useCallback(
    async (name: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        await apiClient.deleteSubdomain(name);

        // Refresh the list after deletion
        await fetchMySubdomains();
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to delete subdomain");
        throw err; // Re-throw so the component can handle it
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMySubdomains]
  );

  return {
    // State
    subdomains,
    isLoading,
    error,

    // Availability checking
    isCheckingAvailability,
    availabilityResult,

    // Actions
    checkAvailability,
    createSubdomain,
    updateSubdomain,
    deleteSubdomain,
    fetchMySubdomains,
    clearError,
    clearAvailabilityResult,
  };
};
