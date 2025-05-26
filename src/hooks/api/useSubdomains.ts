import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSubdomainRequest, UpdateSubdomainRequest } from "@/types/api";
import apiClient from "@/lib/api";

// Query Keys
export const subdomainKeys = {
  all: ["subdomains"] as const,
  lists: () => [...subdomainKeys.all, "list"] as const,
  list: (filters: string) => [...subdomainKeys.lists(), { filters }] as const,
  details: () => [...subdomainKeys.all, "detail"] as const,
  detail: (id: string) => [...subdomainKeys.details(), id] as const,
  my: () => [...subdomainKeys.all, "my"] as const,
  availability: (name: string) =>
    [...subdomainKeys.all, "availability", name] as const,
};

// Queries
export const useMySubdomains = () => {
  return useQuery({
    queryKey: subdomainKeys.my(),
    queryFn: () => apiClient.getMySubdomains(),
    enabled: apiClient.isAuthenticated(),
  });
};

export const useAllSubdomains = () => {
  return useQuery({
    queryKey: subdomainKeys.lists(),
    queryFn: () => apiClient.getAllSubdomains(),
  });
};

export const useSubdomainByName = (name: string) => {
  return useQuery({
    queryKey: subdomainKeys.detail(name),
    queryFn: () => apiClient.getSubdomainByName(name),
    enabled: !!name,
  });
};

export const useSubdomainAvailability = (name: string) => {
  return useQuery({
    queryKey: subdomainKeys.availability(name),
    queryFn: () => apiClient.checkSubdomainAvailability(name),
    enabled: !!name && name.length > 0,
    staleTime: 30 * 1000, // 30 seconds - availability can change quickly
    gcTime: 60 * 1000, // 1 minute
  });
};

// Mutations
export const useCreateSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubdomainRequest) =>
      apiClient.createSubdomain(data),
    onSuccess: () => {
      // Invalidate and refetch my subdomains
      queryClient.invalidateQueries({ queryKey: subdomainKeys.my() });
      // Invalidate all subdomains list
      queryClient.invalidateQueries({ queryKey: subdomainKeys.lists() });
    },
  });
};

export const useUpdateSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      data,
    }: {
      name: string;
      data: UpdateSubdomainRequest;
    }) => apiClient.updateSubdomain(name, data),
    onSuccess: (_, { name }) => {
      // Invalidate specific subdomain
      queryClient.invalidateQueries({ queryKey: subdomainKeys.detail(name) });
      // Invalidate my subdomains
      queryClient.invalidateQueries({ queryKey: subdomainKeys.my() });
      // Invalidate all subdomains list
      queryClient.invalidateQueries({ queryKey: subdomainKeys.lists() });
    },
  });
};

export const useDeleteSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => apiClient.deleteSubdomain(name),
    onSuccess: (_, name) => {
      // Remove specific subdomain from cache
      queryClient.removeQueries({ queryKey: subdomainKeys.detail(name) });
      // Invalidate my subdomains
      queryClient.invalidateQueries({ queryKey: subdomainKeys.my() });
      // Invalidate all subdomains list
      queryClient.invalidateQueries({ queryKey: subdomainKeys.lists() });
    },
  });
};
