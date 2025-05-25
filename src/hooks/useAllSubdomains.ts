import { useState, useEffect, useCallback } from "react";
import { Subdomain, ApiError } from "@/types/api";
import apiClient from "@/lib/api";

interface UseAllSubdomainsReturn {
  subdomains: Subdomain[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAllSubdomains = (): UseAllSubdomainsReturn => {
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSubdomains = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiClient.getAllSubdomains();
      setSubdomains(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to fetch subdomains");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubdomains();
  }, [fetchAllSubdomains]);

  return {
    subdomains,
    isLoading,
    error,
    refetch: fetchAllSubdomains,
  };
};
