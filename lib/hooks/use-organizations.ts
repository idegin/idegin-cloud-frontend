"use client"

import { useQuery } from "@tanstack/react-query"
import { organizationsApi, type OrganizationFilters } from "@/lib/api/organizations"

export function useOrganizations(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: ["organizations", filters],
    queryFn: () => organizationsApi.getAll(filters),
  })
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => organizationsApi.getById(id),
    enabled: !!id,
  })
}

export function useOrganizationProjects(organizationId: string) {
  return useQuery({
    queryKey: ["organization", organizationId, "projects"],
    queryFn: () => organizationsApi.getById(organizationId),
    enabled: !!organizationId,
    select: (data) => ({
      organization: {
        id: data.organization.id,
        name: data.organization.name,
        slug: data.organization.slug,
      },
      projects: data.organization.projects || [],
      statistics: data.statistics,
    }),
  })
}
