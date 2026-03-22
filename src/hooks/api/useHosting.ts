import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";

// Query Keys
export const hostingKeys = {
  all: ["hosting"] as const,
  lists: () => [...hostingKeys.all, "list"] as const,
  my: () => [...hostingKeys.all, "my"] as const,
  details: () => [...hostingKeys.all, "detail"] as const,
  detail: (name: string) => [...hostingKeys.details(), name] as const,
};

// Queries
export const useMyHostings = () => {
  return useQuery({
    queryKey: hostingKeys.my(),
    queryFn: () => apiClient.getMyHostings(),
    enabled: apiClient.isAuthenticated(),
  });
};

// Mutations
export const useDeployHosting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, files }: { name: string; files: FileList | File[] }) =>
      apiClient.deployHosting(name, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostingKeys.my() });
    },
  });
};

export const useDeleteHosting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => apiClient.deleteHosting(name),
    onSuccess: (_, name) => {
      queryClient.removeQueries({ queryKey: hostingKeys.detail(name) });
      queryClient.invalidateQueries({ queryKey: hostingKeys.my() });
    },
  });
};
