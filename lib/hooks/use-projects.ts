"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "@/lib/api/projects"
import type { ProjectFilters } from "@/lib/api/projects"

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => projectsApi.getAll(filters),
  })
}

export function useOrgProjects(currentOrgUser: string | null, filters?: Omit<ProjectFilters, "client" | "provider" | "is_payment_active">) {
  return useQuery({
    queryKey: ["projects", "org", currentOrgUser, filters],
    queryFn: () => projectsApi.getOrgProjects(filters),
    enabled: !!currentOrgUser,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  })
}

export function useProjectStats() {
  return useQuery({
    queryKey: ["projects", "stats"],
    queryFn: () => projectsApi.getStats(),
  })
}

export function useProjectFullDetails(id: string) {
  return useQuery({
    queryKey: ["project", id, "full"],
    queryFn: () => projectsApi.getFullDetails(id),
    enabled: !!id,
  })
}

export function useProjectDetails(id: string) {
  return useQuery({
    queryKey: ["project", id, "details"],
    queryFn: () => projectsApi.getDetailsForClient(id),
    enabled: !!id,
  })
}

export function useToggleProjectBilling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      projectsApi.toggleBilling(id, isActive),
    onSuccess: (_, variables) => {
      // Invalidate both the full details and regular project queries
      queryClient.invalidateQueries({ queryKey: ["project", variables.id, "full"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
    },
  })
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "in_dev" | "suspended" }) =>
      projectsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate both the full details and regular project queries
      queryClient.invalidateQueries({ queryKey: ["project", variables.id, "full"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
    },
  })
}
