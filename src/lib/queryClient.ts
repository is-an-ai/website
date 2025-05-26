import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";
import { HTTP_STATUS } from "./constants";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        const apiError = error as unknown as ApiError;
        // Don't retry on auth errors or client errors
        if (
          apiError.code === HTTP_STATUS.UNAUTHORIZED ||
          (apiError.code >= 400 && apiError.code < 500)
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
